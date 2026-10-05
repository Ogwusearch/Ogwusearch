
/**
 * Authenticated identity.
 *
 * Represents the identity established by authentication.
 * This contract contains identity information only.
 *
 * Authorization decisions belong to @ogwusearch/authorization.
 */

export type UserId = string;

export interface AuthenticatedIdentity {
  readonly id: UserId;
  readonly attributes?: Readonly<Record<string, unknown>>;
}
