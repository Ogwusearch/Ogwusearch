
/**
 * Authentication service contract.
 *
 * Defines the application-facing authentication boundary.
 *
 * The service does not implement:
 * - password hashing
 * - database access
 * - JWT signing
 * - HTTP
 * - sessions storage
 * - external identity providers
 */

import type { AuthenticatedIdentity } from "../identity/authenticated-identity.js";
import type { AuthenticationContext } from "../context/authentication-context.js";
import type { AuthenticationSession } from "../sessions/authentication-session.js";
import type { AccessToken } from "../tokens/access-token.js";
import type { RefreshToken } from "../tokens/refresh-token.js";

export interface AuthenticationResult {
  readonly context: AuthenticationContext;
  readonly identity?: AuthenticatedIdentity;
  readonly accessToken?: AccessToken;
  readonly refreshToken?: RefreshToken;
  readonly session?: AuthenticationSession;
}

export interface AuthenticationService<TCredentials = unknown> {
  authenticate(
    credentials: TCredentials,
  ): Promise<AuthenticationResult>;

  validateAccessToken(
    token: string,
  ): Promise<AuthenticationResult>;

  refreshAccessToken(
    token: string,
  ): Promise<AuthenticationResult>;

  logout(
    sessionId: string,
  ): Promise<void>;
}