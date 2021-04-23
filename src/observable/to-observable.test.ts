import toObservable from ".";
import createReadableCounter from "../streams/readable-counter";

describe("toObservable", () => {
  test("consuming all items", (done) => {
    const source = createReadableCounter(100);
    const next = jest.fn();
    toObservable(source).subscribe({
      next,
      complete: () => {
        expect(next).toHaveBeenCalledTimes(100);
        done();
      },
    });
  });
});
