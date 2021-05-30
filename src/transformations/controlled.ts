import { Transform } from "stream";
import { from, OperatorFunction, pipe } from "rxjs";
import { TransformationError, errorWatcher } from "./error";

const defaultOptions = {
  highWaterMark: 16,
};

export default <T = unknown, R = unknown>(
  operation?: OperatorFunction<T, R>,
  options = defaultOptions
): Transform => {
  const transformOptions = { ...defaultOptions, ...options };
  const buffer: T[] = [];
  const flushBuffer = (
    callback: (err?: Error) => void,
    push: (item: R | TransformationError) => void
  ) => {
    from(buffer.slice())
      .pipe(operation ? pipe(errorWatcher, operation) : errorWatcher)
      .subscribe({
        next: (item) => push(item),
        complete: () => callback(),
        error: (error) => {
          push(new TransformationError(error));
          callback();
        },
      });
    buffer.splice(0);
  };

  return new Transform({
    highWaterMark: transformOptions.highWaterMark * 4,
    objectMode: true,
    transform(item, encoding, callback) {
      buffer.push(item);

      if (buffer.length < transformOptions.highWaterMark) {
        callback();
      } else {
        flushBuffer(callback, (item) => this.push(item));
      }
    },
    flush(callback) {
      flushBuffer(callback, (item) => this.push(item));
    },
  });
};
