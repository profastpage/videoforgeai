export class AppServiceError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "AppServiceError";
  }
}

export function isAppServiceError(error: unknown): error is AppServiceError {
  return error instanceof AppServiceError;
}
