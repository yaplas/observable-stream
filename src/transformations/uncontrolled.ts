import { OperatorFunction, Subject } from "rxjs";
import { Transform } from "stream";

export default <T = unknown, R = unknown>(operation: OperatorFunction<T, R>) => {
  const subject = new Subject<T>();
  let push:Function;
  subject.pipe(operation).subscribe({next: (item: R) => {
    if (push instanceof Function) {
       push(item);
    }   else {
        throw new Error('Unexpected early push');
    }
  }});

  return new Transform({
    objectMode: true,
    transform(item, encoding, callback) {
      if (!push) {
        push = (item: R) => this.push(item);
      }
      subject.next(item);
      callback();
    },
    flush(callback) {
      subject.complete();
      callback();
    },
  });
}