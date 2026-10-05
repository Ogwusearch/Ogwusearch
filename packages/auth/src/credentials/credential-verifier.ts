
/**
 * Credential verification contract.
 *
 * Implementations may verify passwords, API credentials,
 * external identity credentials, or other authentication methods.
 *
 * This package does not implement the verification mechanism.
 */

import type { CredentialVerificationResult } from "./credential-result.js";

export interface CredentialVerifier<TCredentials = unknown> {
  verify(
    credentials: TCredentials,
  ): Promise<CredentialVerificationResult>;
}
