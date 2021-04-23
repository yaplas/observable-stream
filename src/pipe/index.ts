import { Transform } from "stream";
import { OperatorFunction, pipe } from "rxjs";
import createTransformation from '../transformations/controlled';
import createUncontrolledTransformation from '../transformations/uncontrolled';

const pipeArray = (
  [operation1, operation2, ...rest]: OperatorFunction<any, any>[]
): OperatorFunction<any, any> => {
  if (operation2) {
    return pipeArray([pipe(operation1, operation2), ...rest]);
  }
  return operation1;
}

const pipeStreams = (stream1?: Transform, stream2?: Transform): Transform => {
  if (stream1 !== undefined && stream2 !== undefined) {
    return stream1.pipe(stream2);
  }

  if (stream1 !== undefined) {
    return stream1;
  }

  if (stream2 !== undefined) {
    return stream2;
  }

  throw new Error('Unexpected both streams undefined');
}

const streamFromOperations = (
  streamCreator: (operation: OperatorFunction<any, any>) => Transform,
  operations: OperatorFunction<any, any>[],
): Transform | undefined =>
  operations.length > 0 
    ? streamCreator(pipeArray(operations))
    : undefined;

export default (...operations: (OperatorFunction<any, any> | OperatorFunction<any, any>[])[]) => {
  const { stream, controlled } = operations.reduce(
    (result, item) => item instanceof Array
      ? {
        stream: pipeStreams(
          result.stream,
          pipeStreams(
            streamFromOperations(createTransformation, result.controlled),
            streamFromOperations(createUncontrolledTransformation, item)
          )
        ),
        controlled: [],
      } : {
        stream: result.stream,
        controlled: [...result.controlled, item]
      },
    {controlled:[]} as {stream?: Transform; controlled: OperatorFunction<any, any>[]}
  );
  
  return pipeStreams(stream, streamFromOperations(createTransformation, controlled));
}