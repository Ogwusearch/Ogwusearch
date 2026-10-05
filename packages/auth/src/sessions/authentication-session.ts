
/**
 * Authentication session contract.
 *
 * Represents an authenticated session without defining how
 * the session is stored or managed.
 */

import type { AuthenticatedIdentity } from "../identity/authenticated-identity.js";

export type SessionId = string;

export interface AuthenticationSession {
  readonly id: SessionId;
  readonly identity: AuthenticatedIdentity;
  readonly createdAt: Date;
  readonly expiresAt: Date;
}
