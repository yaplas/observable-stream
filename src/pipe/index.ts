/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transform } from "stream";
import { OperatorFunction, UnaryFunction, pipe } from "rxjs";
import createTransformation from "../transformations/controlled";
import createUncontrolledTransformation from "../transformations/uncontrolled";
import { PassThrough, Readable } from "stream";

const pipeArray = ([operation1, operation2, ...rest]: UnaryFunction<
  unknown,
  unknown
>[]): UnaryFunction<unknown, unknown> => {
  if (operation2) {
    return pipeArray([pipe(operation1, operation2), ...rest]);
  }
  return operation1;
};

const streamFromOperations = (
  streamCreator: (operation: OperatorFunction<unknown, unknown>) => Transform,
  operations: UnaryFunction<unknown, unknown>[]
): Transform =>
  operations.length > 0
    ? streamCreator(pipeArray(operations) as OperatorFunction<unknown, unknown>)
    : new PassThrough();

type UnaryFunctionTuple<
  T,
  R,
  A = any,
  B = any,
  C = any,
  D = any,
  E = any,
  F = any,
  G = any,
  H = any,
  I = any
> =
  | [UnaryFunction<T, R>]
  | [UnaryFunction<T, A>, UnaryFunction<A, R>]
  | [UnaryFunction<T, A>, UnaryFunction<A, B>, UnaryFunction<B, R>]
  | [
      UnaryFunction<T, A>,
      UnaryFunction<A, B>,
      UnaryFunction<B, C>,
      UnaryFunction<C, R>
    ]
  | [
      UnaryFunction<T, A>,
      UnaryFunction<A, B>,
      UnaryFunction<B, C>,
      UnaryFunction<C, R>
    ]
  | [
      UnaryFunction<T, A>,
      UnaryFunction<A, B>,
      UnaryFunction<B, C>,
      UnaryFunction<C, D>,
      UnaryFunction<D, R>
    ]
  | [
      UnaryFunction<T, A>,
      UnaryFunction<A, B>,
      UnaryFunction<B, C>,
      UnaryFunction<C, D>,
      UnaryFunction<D, E>,
      UnaryFunction<E, R>
    ]
  | [
      UnaryFunction<T, A>,
      UnaryFunction<A, B>,
      UnaryFunction<B, C>,
      UnaryFunction<C, D>,
      UnaryFunction<D, E>,
      UnaryFunction<E, F>,
      UnaryFunction<F, R>
    ]
  | [
      UnaryFunction<T, A>,
      UnaryFunction<A, B>,
      UnaryFunction<B, C>,
      UnaryFunction<C, D>,
      UnaryFunction<D, E>,
      UnaryFunction<E, F>,
      UnaryFunction<F, G>,
      UnaryFunction<G, R>
    ]
  | [
      UnaryFunction<T, A>,
      UnaryFunction<A, B>,
      UnaryFunction<B, C>,
      UnaryFunction<C, D>,
      UnaryFunction<D, E>,
      UnaryFunction<E, F>,
      UnaryFunction<F, G>,
      UnaryFunction<G, H>,
      UnaryFunction<H, R>
    ]
  | [
      UnaryFunction<T, A>,
      UnaryFunction<A, B>,
      UnaryFunction<B, C>,
      UnaryFunction<C, D>,
      UnaryFunction<D, E>,
      UnaryFunction<E, F>,
      UnaryFunction<F, G>,
      UnaryFunction<G, H>,
      UnaryFunction<H, I>,
      UnaryFunction<I, R>
    ];

export function controlledPipe<A>(
  source: Readable,
  fnA: UnaryFunction<A, A> | UnaryFunctionTuple<A, A>
): Transform;

export function controlledPipe<A, B>(
  source: Readable,
  fnA: UnaryFunction<A, B> | UnaryFunctionTuple<A, B>
): Transform;

export function controlledPipe<A, B, C>(
  source: Readable,
  fnA: UnaryFunction<A, B> | UnaryFunctionTuple<A, B>,
  fnB: UnaryFunction<B, C> | UnaryFunctionTuple<B, C>
): Transform;

export function controlledPipe<A, B, C, D>(
  source: Readable,
  fnA: UnaryFunction<A, B> | UnaryFunctionTuple<A, B>,
  fnB: UnaryFunction<B, C> | UnaryFunctionTuple<B, C>,
  fnC: UnaryFunction<C, D> | UnaryFunctionTuple<C, D>
): Transform;

export function controlledPipe<A, B, C, D, E>(
  source: Readable,
  fnA: UnaryFunction<A, B> | UnaryFunctionTuple<A, B>,
  fnB: UnaryFunction<B, C> | UnaryFunctionTuple<B, C>,
  fnC: UnaryFunction<C, D> | UnaryFunctionTuple<C, D>,
  fnD: UnaryFunction<D, E> | UnaryFunctionTuple<D, E>
): Transform;

export function controlledPipe<A, B, C, D, E, F>(
  source: Readable,
  fnA: UnaryFunction<A, B> | UnaryFunctionTuple<A, B>,
  fnB: UnaryFunction<B, C> | UnaryFunctionTuple<B, C>,
  fnC: UnaryFunction<C, D> | UnaryFunctionTuple<C, D>,
  fnD: UnaryFunction<D, E> | UnaryFunctionTuple<D, E>,
  fnE: UnaryFunction<E, F> | UnaryFunctionTuple<E, F>
): Transform;

export function controlledPipe<A, B, C, D, E, F, G>(
  source: Readable,
  fnA: UnaryFunction<A, B> | UnaryFunctionTuple<A, B>,
  fnB: UnaryFunction<B, C> | UnaryFunctionTuple<B, C>,
  fnC: UnaryFunction<C, D> | UnaryFunctionTuple<C, D>,
  fnD: UnaryFunction<D, E> | UnaryFunctionTuple<D, E>,
  fnE: UnaryFunction<E, F> | UnaryFunctionTuple<E, F>,
  fnF: UnaryFunction<F, G> | UnaryFunctionTuple<F, G>
): Transform;

export function controlledPipe<A, B, C, D, E, F, G, H>(
  source: Readable,
  fnA: UnaryFunction<A, B> | UnaryFunctionTuple<A, B>,
  fnB: UnaryFunction<B, C> | UnaryFunctionTuple<B, C>,
  fnC: UnaryFunction<C, D> | UnaryFunctionTuple<C, D>,
  fnD: UnaryFunction<D, E> | UnaryFunctionTuple<D, E>,
  fnE: UnaryFunction<E, F> | UnaryFunctionTuple<E, F>,
  fnF: UnaryFunction<F, G> | UnaryFunctionTuple<F, G>,
  fnG: UnaryFunction<G, H> | UnaryFunctionTuple<G, H>
): Transform;

export function controlledPipe<A, B, C, D, E, F, G, H, I>(
  source: Readable,
  fnA: UnaryFunction<A, B> | UnaryFunctionTuple<A, B>,
  fnB: UnaryFunction<B, C> | UnaryFunctionTuple<B, C>,
  fnC: UnaryFunction<C, D> | UnaryFunctionTuple<C, D>,
  fnD: UnaryFunction<D, E> | UnaryFunctionTuple<D, E>,
  fnE: UnaryFunction<E, F> | UnaryFunctionTuple<E, F>,
  fnF: UnaryFunction<F, G> | UnaryFunctionTuple<F, G>,
  fnG: UnaryFunction<G, H> | UnaryFunctionTuple<G, H>,
  fnH: UnaryFunction<H, I> | UnaryFunctionTuple<H, I>
): Transform;

export function controlledPipe<A, B, C, D, E, F, G, H, I, J>(
  source: Readable,
  fnA: UnaryFunction<A, B> | UnaryFunctionTuple<A, B>,
  fnB: UnaryFunction<B, C> | UnaryFunctionTuple<B, C>,
  fnC: UnaryFunction<C, D> | UnaryFunctionTuple<C, D>,
  fnD: UnaryFunction<D, E> | UnaryFunctionTuple<D, E>,
  fnE: UnaryFunction<E, F> | UnaryFunctionTuple<E, F>,
  fnF: UnaryFunction<F, G> | UnaryFunctionTuple<F, G>,
  fnG: UnaryFunction<G, H> | UnaryFunctionTuple<G, H>,
  fnH: UnaryFunction<H, I> | UnaryFunctionTuple<H, I>,
  fnI: UnaryFunction<I, J> | UnaryFunctionTuple<I, J>
): Transform;

export function controlledPipe<A, B, C, D, E, F, G, H, I, J, K>(
  source: Readable,
  fnA: UnaryFunction<A, B> | UnaryFunctionTuple<A, B>,
  fnB: UnaryFunction<B, C> | UnaryFunctionTuple<B, C>,
  fnC: UnaryFunction<C, D> | UnaryFunctionTuple<C, D>,
  fnD: UnaryFunction<D, E> | UnaryFunctionTuple<D, E>,
  fnE: UnaryFunction<E, F> | UnaryFunctionTuple<E, F>,
  fnF: UnaryFunction<F, G> | UnaryFunctionTuple<F, G>,
  fnG: UnaryFunction<G, H> | UnaryFunctionTuple<G, H>,
  fnH: UnaryFunction<H, I> | UnaryFunctionTuple<H, I>,
  fnI: UnaryFunction<I, J> | UnaryFunctionTuple<I, J>,
  fnJ: UnaryFunction<J, K> | UnaryFunctionTuple<J, K>
): Transform;

export function controlledPipe(
  source: Readable,
  ...operations: (
    | UnaryFunction<unknown, unknown>
    | UnaryFunction<unknown, unknown>[]
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
      controlled: UnaryFunction<unknown, unknown>[];
    }
  );

  return [
    ...streams,
    streamFromOperations(createTransformation, controlled),
    createTransformation(),
  ].reduce((result, stream) => result.pipe(stream), source);
}
