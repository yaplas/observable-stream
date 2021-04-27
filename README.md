# Observable Stream

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

controlledPipe(
  // Readable stream as source  
  sourceStream,
  // Here goes the rxjs operations.
  // You can do any async operation with no worries about back-pressure,
  // your process memory will be fine because this operations will be executed
  // in a controlled way: the whole stream will be split in observables
  // of N items and then pipe it to your controlled operations. Then the process
  // subscribes to the observable returned by your operation pipe, and wait for the completion,
  // once the result observable completes the next N items observable will be processed,
  // this way of processing ensure that the source stream will be paused if it is necessary
  concatMap(someAsyncTask),
  // uncontrolled areas are defined by brackets: [ here goes uncontrolled operations ]
  // given the way to process the controlled operations is by building
  // observables of N items, aggregation operations like "scan" will be reset
  // every time an N items observable completes, so you need to put this
  // kind of operations into uncontrolled areas, actually aggregations should be
  // into uncontrolled areas.
  [
    // uncontrolled areas will not pause the source stream
    // so you have to avoid putting async operations here
    scan(someAggregatorFunction)
    // buffer operations are other type of operations that make sense
    // to put into uncontrolled areas. Even this could be considered async
    // because this bufferTime will emits when 100 items is collected or
    // in 100 ms, but it is kind of auto-controlled operation, because if the
    // data comes fast the 100 items are filled quickly, and if the data comes
    // in a slow rate there is no any back-pressure to be worried about.
    // Notice that if you don't put the bufferTime into uncontrolled area,
    // you can't get 100 items, you will have N items where N is the size
    // of the observables build into controlled areas
    bufferTime(100, null, 100);
  ],
  // back-pressure control still working even after uncontrolled areas,
  // if the following operation take time to complete the source stream
  // will be paused
  concatMap(someOtherAsyncTask),
).pipe(
  // controlledPipe returns a readable stream that you can pipe to other one
  outputStream
);
```

### toObservable

```ts
import { toObservable } from "observable-stream";
// controlledPipe returns an stream to be able to continue piping streams, but you can
// also convert the stream to an observable if you need a promise or to wait for completion.
// Is it not necessary to toObservable to process stream data with rxjs operators, controlledPipe
// build observables for you and control the process.
// toObservable is applicable directly to streams but in that case all the operations to what you
// eventually can pipe the observable will be executed with no back-pressure control.
await toObservable(controlledPipe(sourceStream, ... your operations ...)).toPromise();
```