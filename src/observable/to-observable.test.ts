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
  test("consuming items until failure", (done) => {
    const pushed = jest
      .fn()
      .mockImplementationOnce((item) => item)
      .mockImplementationOnce((item) => {
        throw new Error(`failure on item ${item}`);
      });
    const source = createReadableCounter(100, pushed);
    const next = jest.fn();
    toObservable(source).subscribe({
      next,
      error: (error) => {
        expect(next).toHaveBeenCalledTimes(2);
        expect(error.message).toEqual("failure on item 2");
        done();
      },
    });
  });
});
