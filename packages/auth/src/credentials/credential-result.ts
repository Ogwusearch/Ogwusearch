
/**
 * Result of credential verification.
 *
 * The auth package does not define how credentials are verified.
 * A concrete adapter is responsible for verification.
 */

import type { AuthenticatedIdentity } from "../identity/authenticated-identity.js";

export type CredentialVerificationResult =
  | {
      readonly valid: true;
      readonly identity: AuthenticatedIdentity;
    }
  | {
      readonly valid: false;
      readonly reason: string;
    };