export type ReturnTypeAsync<T extends (...args: never[]) => Promise<unknown>> =
  Awaited<ReturnType<T>>;
