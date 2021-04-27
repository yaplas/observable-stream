# Observable Stream

Make a stream observable without losing back-pressure control.

## Install

npm:

    npm i observable-stream

Yarn:

    yarn add observable-stream

## Usage

###  controlledPipe

```
import { controlledPipe } from "observable-stream";

controlledPipe(
  // readable stream as source  
  sourceStream,
  // here goes the rxjs operations
  // you can do any async operation with no worries about back-pressure
  // your process memory will be fine because async operation will be executed
  // in a controlled way: the whole stream will be split in observables
  // of N items and then piped to your rxjs operations, once the current observable
  // completes then the next one will be processed, this way of processing ensure
  // that the source stream will be paused if it is necessary
  concatMap(someAsyncTask),
  // uncontrolled areas are defined by brackets: [ here goes uncontrolled operations ]
  // given the way to process the controlled operations is by building
  // observables of N items, aggregation operations like "scan" will be reset
  // every time an N items observable completes, so you need to put your
  // aggregations into uncontrolled areas
  [
    // aggregation operators goes into the uncontrolled areas
    scan(someAggregatorFunction)
    // buffer operations are other type of operations that make sense
    // to put into uncontrolled areas 
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

```
import { toObservable } from "observable-stream";
// controlledPipe returns an stream to be able to continue piping streams, but you can
// also convert the stream to an observable if you need a promise or to wait for completion.
// Is it not necessary to toObservable to process stream data with rxjs operators, controlledPipe
// build observables for you and control the process.
// toObservable is applicable directly to streams but in that case all the operations to what you
// eventually can pipe the observable will be executed with no back-pressure control.
await toObservable(controlledPipe(sourceStream, ... your operations ...)).toPromise();
```