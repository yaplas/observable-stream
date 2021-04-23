import { Readable } from "stream";

export default (limit = 1000, pushed?: (item: unknown) => void): Readable => {
  let count = 0;
  return new Readable({
    objectMode: true,
    read() {
      count++;
      const item = count > limit ? null : { count };
      this.push(item);
      pushed && pushed(item);
    },
  });
};
