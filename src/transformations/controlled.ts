import { Transform } from 'stream';
import { from, OperatorFunction } from 'rxjs';

const defaultOptions = {
  highWaterMark: 16,
};

export default <T = unknown, R = unknown>(
  process: OperatorFunction<T, R>,
  options = defaultOptions,
): Transform => {
  const transformOptions = { ...defaultOptions, ...options };
  const buffer: T[] = [];
  const flushBuffer = (callback: Function, push: (item: R) => void) => {
    process(from(buffer.slice())).subscribe({
      next: item => push(item),
      complete: () => callback(),
      error: err => callback(err),
    });
    buffer.splice(0);
  };

  return new Transform({
    highWaterMark: transformOptions.highWaterMark,
    objectMode: true,
    transform(chunk, encoding, callback) {
      // eslint-disable-next-line fp/no-mutating-methods
      buffer.push(chunk);

      if (buffer.length < options.highWaterMark) {
        // eslint-disable-next-line callback-return
        callback();
      } else {
        // eslint-disable-next-line fp/no-this, fp/no-mutating-methods
        flushBuffer(callback, (item: R) => this.push(item));
      }
    },
    flush(callback) {
      // eslint-disable-next-line fp/no-this, fp/no-mutating-methods
      flushBuffer(callback, (item: R) => this.push(item));
    },
  });
};

