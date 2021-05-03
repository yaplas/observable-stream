import createReadableCounter from "../streams/readable-counter";
import { controlledPipe, toObservable } from "../.";
import { catchError, concatMap, map, scan } from "rxjs/operators";
import { of, Subject } from "rxjs";

describe("controlledPipe", () => {
  test("uncontrolled areas can aggregate info beyond chunks", (done) => {
    const next = jest.fn();
    const source = createReadableCounter(100);
    toObservable(
      controlledPipe(
        source,
        // async operations should be into controlled areas (out of [ ... ])
        concatMap(
          (item) =>
            new Promise<number>((resolve) => setTimeout(resolve, 1, item))
        ),
        // uncontrolled areas are defined into [ ... ]
        [
          // aggregations should be in uncontrolled areas
          scan((acc, item) => item + acc, 0),
          // synchronic operations could be in uncontrolled areas as well
          // but it is not mandatory
          map((item) => `hey ${item}`),
        ],
        concatMap(
          (item) =>
            new Promise<{ [key: string]: number }>((resolve) =>
              setTimeout(resolve, 1, item)
            )
        ),
        // sync operations could be in both controlled or uncontrolled areas
        map((item) => `oh ${item}`)
      )
    ).subscribe({
      next,
      complete: () => {
        expect(next).toHaveBeenCalledTimes(100);
        // 5050 = 1 + 2 + 3 + ... + 99 + 100
        // this means all items pass through the scan
        // in one single continuous flow
        expect(next).toHaveBeenNthCalledWith(100, `oh hey 5050`);
        done();
      },
    });
  });
  test("back-pressure control pass through uncontrolled areas", (done) => {
    const pushed = jest.fn();
    const source = createReadableCounter(200, pushed);
    const stopper = new Subject();
    toObservable(
      controlledPipe(
        source,
        concatMap((item: number) => of(item)),
        [scan((acc, item) => item + acc, 0), map((item) => `hey ${item}`)],
        concatMap((item) => {
          if (item === "hey 1") {
            setTimeout(() => {
              // if the last count (200) was not pushed
              // means readable counter stop emitting
              // so back-pressure control works even across
              // uncontrolled areas
              expect(pushed).not.toHaveBeenCalledWith(200);
              stopper.next(1);
              stopper.complete();
            }, 500);
            return stopper;
          }
          return of(1);
        })
      )
    ).subscribe({
      complete: () => {
        expect(pushed).toHaveBeenCalledWith(200);
        expect(pushed).toHaveBeenCalledTimes(201);
        done();
      },
    });
  });
  test("back-pressure control having uncontrolled area at the end of the pipe", (done) => {
    const pushed = jest.fn();
    const source = createReadableCounter(200, pushed);
    const stopper = new Subject<number>();
    toObservable(
      controlledPipe(
        source,
        concatMap((item) => {
          if (item === 1) {
            setTimeout(() => {
              // if the last count (200) was not pushed
              // means readable counter stop emitting
              // so back-pressure control works even across
              // uncontrolled areas
              expect(pushed).not.toHaveBeenCalledWith(200);
              stopper.next(1);
              stopper.complete();
            }, 500);
            return stopper;
          }
          return of(1);
        }),
        [scan((acc, item) => item + acc, 0), map((item) => `hey ${item}`)]
      )
    ).subscribe({
      complete: () => {
        expect(pushed).toHaveBeenCalledWith(200);
        expect(pushed).toHaveBeenCalledTimes(201);
        done();
      },
    });
  });
  test("error could be catch at any point", async () => {
    const source = createReadableCounter(100);
    const catcher = jest.fn().mockImplementationOnce(() => of());
    await toObservable(
      controlledPipe(
        source,
        map(() => {
          throw new Error("some rxjs error");
        }),
        concatMap(
          (item) =>
            new Promise<number>((resolve) => setTimeout(resolve, 1, item))
        ),
        [scan((acc, item) => item + acc, 0)],
        concatMap(
          (item) =>
            new Promise<{ [key: string]: number }>((resolve) =>
              setTimeout(resolve, 1, item)
            )
        ),
        map((item) => `oh ${item}`),
        catchError(catcher)
      )
    ).toPromise();
    expect(catcher).toHaveBeenCalledTimes(1);
  });
});
