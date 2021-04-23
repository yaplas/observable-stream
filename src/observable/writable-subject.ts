import { Writable } from 'stream';
import { Subject } from 'rxjs';

export default <T = unknown>(subject: Subject<T>) => new Writable({
  objectMode: true,
  final() { subject.complete(); },
  write(chunk, encoding, callback) {
    subject.next(chunk);
    callback();
  },
});
