
/**
 * Authentication error contract.
 *
 * Represents a structured authentication failure.
 * Concrete applications may map these errors to HTTP or UI responses.
 */

export type AuthenticationErrorCode =
  | "INVALID_CREDENTIALS"
  | "INVALID_TOKEN"
  | "TOKEN_EXPIRED"
  | "SESSION_EXPIRED"
  | "UNAUTHENTICATED"
  | "AUTHENTICATION_FAILED";

export class AuthenticationError extends Error {
  readonly code: AuthenticationErrorCode;

  constructor(
    code: AuthenticationErrorCode,
    message: string,
  ) {
    super(message);

    this.name = "AuthenticationError";
    this.code = code;
  }
}