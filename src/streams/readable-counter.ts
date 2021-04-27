// this component is just for testing purposes
/* istanbul ignore file */
import { Readable } from "stream";

const createReadableSubject = (
  limit = 1000,
  pushed?: (item: unknown) => void
): Readable => {
  let count = 1;
  return new Readable({
    objectMode: true,
    read() {
      const item = count > limit ? null : count;
      this.push(item);
      try {
        pushed && pushed(item);
      } catch (error) {
        // pushed may fail because stream failure is being tested
        this.destroy(error);
      }
      count++;
    },
  });
};

export default createReadableSubject;
