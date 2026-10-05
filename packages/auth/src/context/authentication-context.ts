
/**
 * Authentication context.
 *
 * Represents the authentication state available to an application
 * after an authentication attempt or token validation.
 */

import type { AuthenticatedIdentity } from "../identity/authenticated-identity.js";

export type AuthenticationStatus =
  | "AUTHENTICATED"
  | "UNAUTHENTICATED";

export interface AuthenticationContext {
  readonly status: AuthenticationStatus;
  readonly identity?: AuthenticatedIdentity;
  readonly method?: string;
}