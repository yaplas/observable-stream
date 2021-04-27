import { Writable } from "stream";
import { Subject } from "rxjs";

const createWritableSubject = <T = unknown>(subject: Subject<T>): Writable =>
  new Writable({
    objectMode: true,
    final() {
      subject.complete();
    },
    write(chunk, encoding, callback) {
      subject.next(chunk);
      callback();
    },
  });

export default createWritableSubject;
