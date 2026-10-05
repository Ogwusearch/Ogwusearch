
/**
 * @ogwusearch/auth
 *
 * Shared authentication contracts for OGWUSEARCH applications
 * and services.
 *
 * This package defines authentication boundaries only.
 * Infrastructure implementations belong outside this package.
 */

export type {
  AuthenticatedIdentity,
  UserId,
} from "./identity/index.js";

export type {
  AuthenticationContext,
  AuthenticationStatus,
} from "./context/index.js";

export type {
  CredentialVerificationResult,
  CredentialVerifier,
} from "./credentials/index.js";

export type {
  AccessToken,
  RefreshToken,
  TokenValidationResult,
  TokenValidator,
} from "./tokens/index.js";

export type {
  AuthenticationSession,
  SessionId,
} from "./sessions/index.js";

export {
  AuthenticationError,
} from "./errors/index.js";

export type {
  AuthenticationErrorCode,
} from "./errors/index.js";

export type {
  AuthenticationResult,
  AuthenticationService,
} from "./service/index.js";
