/* eslint-disable prettier/prettier */
import { Subject } from "rxjs";
import { Readable, pipeline } from "stream";
import createWritableSubject from "./writable-subject";

export function toObservable<T = unknown>(readable: Readable): Subject<T> {
  const result = new Subject<T>();
  const writableSubject = createWritableSubject(result);
  pipeline(readable, writableSubject, (error) => result.error(error));

  return result;
}