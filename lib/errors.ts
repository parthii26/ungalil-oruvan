export class AppError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor(code: string, message: string, status = 400, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Please sign in to continue.") {
    super("UNAUTHORIZED", message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to do that.") {
    super("FORBIDDEN", message, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Please check the form and try again.", details?: unknown) {
    super("VALIDATION", message, 422, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "We could not find that.") {
    super("NOT_FOUND", message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = "That change conflicts with existing data.") {
    super("CONFLICT", message, 409);
  }
}

export class BusinessRuleError extends AppError {
  constructor(message: string, details?: unknown) {
    super("BUSINESS_RULE", message, 400, details);
  }
}

export function toUserMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
