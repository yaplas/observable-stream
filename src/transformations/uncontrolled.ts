import { OperatorFunction, pipe, Subject } from "rxjs";
import { Transform } from "stream";
import { TransformationError, errorWatcher } from "./error";

const createUncontrolledTransformation = <T = unknown, R = unknown>(
  operation: OperatorFunction<T, R>
): Transform => {
  const subject = new Subject<T>();
  let push: (item: R | TransformationError) => void;
  subject.pipe(pipe(errorWatcher, operation)).subscribe({
    next: (item: R) => push(item),
    error: (error) => push(new TransformationError(error)),
  });

  return new Transform({
    objectMode: true,
    transform(item, encoding, callback) {
      if (push === undefined) {
        push = (item) => this.push(item);
      }
      subject.next(item);
      callback();
    },
    flush(callback) {
      if (push === undefined) {
        push = (item) => this.push(item);
      }
      subject.complete();
      callback();
    },
  });
};

export default createUncontrolledTransformation;
