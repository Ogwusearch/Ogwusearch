export type SubjectId = string;
export type ResourceId = string;

export interface AuthorizationSubject {
  readonly id: SubjectId;
  readonly attributes?: Readonly<Record<string, unknown>>;
}

export interface AuthorizationResource {
  readonly type: string;
  readonly id: ResourceId;
  readonly attributes?: Readonly<Record<string, unknown>>;
}

export interface AuthorizationAction {
  readonly name: string;
}

export interface AuthorizationContext {
  readonly attributes?: Readonly<Record<string, unknown>>;
}

export interface AuthorizationRequest {
  readonly subject: AuthorizationSubject;
  readonly action: AuthorizationAction;
  readonly resource: AuthorizationResource;
  readonly context?: AuthorizationContext;
}

export type AuthorizationDecision =
  | {
      readonly allowed: true;
      readonly reason?: string;
    }
  | {
      readonly allowed: false;
      readonly reason: string;
    };

export interface Permission {
  readonly resource: string;
  readonly action: string;
}

export interface Role {
  readonly id: string;
  readonly name: string;
}

export interface AuthorizationPolicy {
  evaluate(
    request: AuthorizationRequest,
  ): Promise<AuthorizationDecision>;
}

export interface AuthorizationService {
  authorize(
    request: AuthorizationRequest,
  ): Promise<AuthorizationDecision>;
}