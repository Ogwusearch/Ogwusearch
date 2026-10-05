
/**
 * Refresh token contract.
 *
 * Represents a credential used to obtain a new access token.
 * Token creation and persistence are handled externally.
 */

export interface RefreshToken {
  readonly value: string;
  readonly expiresAt: Date;
}
