import type { R } from "@praha/byethrow";

// biome-ignore lint/suspicious/noExplicitAny: required for accurate type inference
function adapter<Result extends R.Result<any, any>>(value: Result) {
	return {
		...value,
		*[Symbol.iterator](): Generator<
			R.Failure<R.InferFailure<Result>>,
			R.InferSuccess<Result>
		> {
			if (value.type === "Success") {
				return value.value;
			} else {
				yield value;
				throw "";
			}
		},
	};
}

type Adapter = typeof adapter;

export function safeTry<T, E>(
	body: (_: Adapter) => AsyncGenerator<R.Failure<E>, R.Result<T, E>>,
): R.ResultAsync<T, E>;
export function safeTry<T, E>(
	body: (_: Adapter) => Generator<R.Failure<E>, R.Result<T, E>>,
): R.Result<T, E>;
export function safeTry<
	YieldFailure extends R.Failure<unknown>,
	GeneratorReturnResult extends R.Result<unknown, unknown>,
>(
	body: (_: Adapter) => Generator<YieldFailure, GeneratorReturnResult>,
): R.Result<
	R.InferSuccess<GeneratorReturnResult>,
	R.InferFailure<YieldFailure> | R.InferFailure<GeneratorReturnResult>
>;
export function safeTry<
	YieldFailure extends R.Failure<unknown>,
	GeneratorReturnResult extends R.Result<unknown, unknown>,
>(
	body: (_: Adapter) => AsyncGenerator<YieldFailure, GeneratorReturnResult>,
): R.ResultAsync<
	R.InferSuccess<GeneratorReturnResult>,
	R.InferFailure<YieldFailure> | R.InferFailure<GeneratorReturnResult>
>;
export function safeTry<T, E>(
	body: (
		_: Adapter,
	) =>
		| Generator<R.Failure<E>, R.Result<T, E>>
		| AsyncGenerator<R.Failure<E>, R.Result<T, E>>,
): R.Result<T, E> | R.ResultAsync<T, E> {
	const n = body(adapter).next();
	if (n instanceof Promise) {
		return n.then((v) => v.value);
	}
	return n.value;
}
