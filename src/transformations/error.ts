import { tap } from "rxjs/operators";

export class TransformationError {
  error: Error;

  constructor(error: Error) {
    this.error = error;
  }
}

export const errorWatcher = tap<any>((item) => {
  if (item instanceof TransformationError) {
    throw item.error;
  }
});
