
/**
 * Token validation contract.
 *
 * The auth package defines the validation boundary.
 * JWT, opaque tokens, OAuth providers, and other mechanisms
 * are implemented outside this package.
 */

import type { AuthenticatedIdentity } from "../identity/authenticated-identity.js";

export interface TokenValidationResult {
  readonly valid: boolean;
  readonly identity?: AuthenticatedIdentity;
  readonly reason?: string;
}

export interface TokenValidator<TToken = string> {
  validate(token: TToken): Promise<TokenValidationResult>;
}
