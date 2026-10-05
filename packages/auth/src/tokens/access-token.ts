
/**
 * Access token contract.
 *
 * Represents an authenticated access credential.
 * Token creation and signing are handled by an external adapter.
 */

export interface AccessToken {
  readonly value: string;
  readonly expiresAt: Date;
}
