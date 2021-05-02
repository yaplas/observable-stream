# Observable Stream

 ![Travis (.org)](https://img.shields.io/travis/yaplas/observable-stream)
 ![Codecov](https://img.shields.io/codecov/c/github/yaplas/observable-stream)

Make a stream observable without losing back-pressure control.

## Install

npm:

    npm i observable-stream

Yarn:

    yarn add observable-stream

## Usage

###  controlledPipe

```ts
import { controlledPipe } from "observable-stream";
import { concatMap, scan, bufferTime, catchError } from "rxjs/operators";

controlledPipe(
  // Readable stream as source  
  sourceStream,
  // Here goes the rxjs operations.
  // You can do any async operation with
  // no worries about back-pressure,
  // your process memory will be fine because
  // this operations will be executed
  // in a controlled way: the whole stream
  // will be split in observables
  // of N items and then pipe it to your
  // controlled operations. Then the process
  // subscribes to the observable returned by your
  // operation pipe, and wait for the completion,
  // once the result observable completes the next
  // N items observable will be processed,
  // this way of processing ensure that the
  // source stream will be paused if it is necessary
  concatMap(someAsyncTask),
  concatMap(someOtherAsyncTask),
  concatMap(someMoreAsyncStuff),
  // uncontrolled areas are defined by brackets
  // [ here goes uncontrolled operations ]
  // given the way to process the controlled operations
  // is by building observables of N items, aggregation
  // operations like "scan" will be reset
  // every time an N items observable completes,
  // so you need to put this kind of operations into
  // uncontrolled areas, actually aggregations should be
  // into uncontrolled areas.
  [
    // uncontrolled areas will not pause the source stream
    // so you have to avoid putting async operations here
    scan(someAggregatorFunction)
    // buffer operations are other type of operations
    // that make sense to put into uncontrolled areas.
    // Notice that if you don't put buffers operations
    // into uncontrolled area you won't get the total
    // amount of items you setup if that amount is more than N,
    // where N is the amount of items per observable builded
    // into controlled areas
    bufferTime(100, null, 100);
  ],
  // back-pressure control still working even
  // after uncontrolled areas, if the following
  // operation take time to complete the source stream
  // will be paused
  concatMap(someAsyncTaskAfterUncontrolledArea),
  concatMap(someOtherAsyncTask),
  // you can catch errors ocurred all along the pipe
  // even into uncontrolled areas
  catchError(someErrorHandler)
).pipe(
  // controlledPipe returns a readable stream
  // that you can pipe to other one
  outputStream
);
```

### toObservable

```ts
import { toObservable, controlledPipe } from "observable-stream";
// controlledPipe returns an stream to be able
// to continue piping streams, but you can
// also convert the stream to an observable
// if you need a promise or to wait for completion,
// or you want to return an observable for final
// sync operations or logging.
// Is it not necessary use toObservable to be able
// to process stream data with rxjs operators,
// as we saw previously controlledPipe build 
// observables for you and control the process.
// toObservable is applicable directly to any
// readable streams, but you have to take account that
// there is no more back-pressure control for returned
// observable subscripted operations
await toObservable(controlledPipe(sourceStream, ... your operations ...)).toPromise();
```
### Working Example

In this example you can see how the slow async task at the end of the pipe slows down the data generation, source stream prints `pushing ... N` on the screen and the output stream prints `output [N, 2N, 1 + 2 + ... + N]`.

https://codesandbox.io/s/goofy-easley-wo95q

Note: This work is being improved, better examples coming soon.
