import { Transform } from "stream";
import { OperatorFunction, pipe } from "rxjs";
import createTransformation from "../transformations/controlled";
import createUncontrolledTransformation from "../transformations/uncontrolled";
import { PassThrough, Readable } from "stream";

const pipeArray = ([operation1, operation2, ...rest]: OperatorFunction<
  unknown,
  unknown
>[]): OperatorFunction<unknown, unknown> => {
  if (operation2) {
    return pipeArray([pipe(operation1, operation2), ...rest]);
  }
  return operation1;
};

const streamFromOperations = (
  streamCreator: (operation: OperatorFunction<unknown, unknown>) => Transform,
  operations: OperatorFunction<unknown, unknown>[]
): Transform =>
  operations.length > 0
    ? streamCreator(pipeArray(operations))
    : new PassThrough();

type OperationArray<T, R> =
  | [OperatorFunction<T, R>]
  | [
      OperatorFunction<T, any>,
      ...OperatorFunction<any, any>[],
      OperatorFunction<any, R>
    ];

type Operations<T, R> =
  | [OperatorFunction<T, R> | OperationArray<R, T>]
  | [
      OperatorFunction<T, any> | OperationArray<R, any>,
      ...(OperatorFunction<any, any> | OperationArray<any, any>)[],
      OperatorFunction<any, R> | OperationArray<any, R>
    ];

function controlledPipe<T = unknown, R = unknown>(
  source: Readable,
  ...operations: Operations<T, R>
): Transform;

function controlledPipe(
  source: Readable,
  ...operations: (
    | OperatorFunction<unknown, unknown>
    | OperatorFunction<unknown, unknown>[]
  )[]
): Readable {
  const { streams, controlled } = operations.reduce(
    (acc, item) =>
      item instanceof Array
        ? {
            streams: [
              ...acc.streams,
              streamFromOperations(createTransformation, acc.controlled),
              streamFromOperations(createUncontrolledTransformation, item),
            ],
            controlled: [],
          }
        : {
            ...acc,
            controlled: [...acc.controlled, item],
          },
    { controlled: [], streams: [] } as {
      streams: Transform[];
      controlled: OperatorFunction<unknown, unknown>[];
    }
  );

  return [
    ...streams,
    streamFromOperations(createTransformation, controlled),
    createTransformation(),
  ].reduce((result, stream) => result.pipe(stream), source);
}

export default controlledPipe;
