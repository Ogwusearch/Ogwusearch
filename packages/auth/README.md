# Authentication Package

## Purpose

`@ogwusearch/auth` provides the shared authentication contracts and utilities used by OGWUSEARCH applications and services.

The package answers one question:

> **Who is the authenticated user?**

Authentication is responsible for establishing and verifying identity.

---

## Responsibilities

The authentication package may define:

* User identity contracts
* Authentication context
* Credential verification contracts
* Access-token contracts
* Refresh-token contracts
* Session contracts
* Authentication result types
* Authentication errors
* Token validation contracts
* Authentication-related utilities

---

## Non-Responsibilities

This package must not contain:

* Application-specific business logic
* Solar engineering calculations
* UI logic
* Database-specific repositories
* HTTP route handlers
* FastAPI application code
* Authorization policies
* Role management
* Permission management

Authorization belongs to:

```text
packages/authorization/
```

Service-specific implementation belongs in an appropriate service.

---

## Architectural Boundary

```text
Authentication Package
        │
        │ establishes identity
        ▼
Authenticated Identity
        │
        ▼
Authorization Package
        │
        │ evaluates access
        ▼
Application / Service
```

Authentication must remain independent of domain applications.

It must not depend on:

```text
solar-engine
solaraudit
circuit-engine
embedded-engineering
```

---

## Package Location

```text
packages/auth/
```

Expected structure:

```text
auth/
├── README.md
├── package.json
├── tsconfig.json
└── src/
    └── index.ts
```

The internal structure may expand as the authentication contract becomes defined.

---

## Core Concepts

### Identity

Represents the authenticated subject.

Example conceptual model:

```text
AuthenticatedIdentity
├── id
├── username / email
├── status
└── metadata
```

The exact contract should be defined before implementation.

---

### Authentication Context

Represents the identity established for the current operation.

```text
AuthenticationContext
├── authenticated
├── identity
└── authenticationMethod
```

---

### Access Token

Represents a credential used to prove an already-established authentication state.

The package should define the contract without coupling itself to a specific token implementation.

Possible implementations may include JWT or opaque tokens.

---

### Refresh Token

Represents a credential used to obtain a new access token when supported by the authentication architecture.

Refresh-token storage and persistence are service-level concerns unless explicitly defined otherwise.

---

## Authentication Flow

The conceptual authentication lifecycle is:

```text
Credentials
     │
     ▼
Authenticate
     │
     ▼
Verify Identity
     │
     ▼
Create Authentication Context
     │
     ▼
Issue Credential
     │
     ▼
Authenticated Request
     │
     ▼
Validate Credential
     │
     ▼
Authenticated Identity
```

---

## Relationship With Authorization

Authentication and authorization are separate concerns.

```text
AUTHENTICATION

Who are you?
     │
     ▼
Identity


AUTHORIZATION

What are you allowed to do?
     │
     ▼
Permission / Policy Decision
```

The authentication package establishes identity.

The authorization package decides whether that identity may perform an action.

---

## Dependency Rule

The authentication package must remain independent of application domains.

```text
auth
  │
  └── no dependency on domain engines
```

Domain packages must not be required to understand authentication internals.

---

## Security Principles

Authentication implementations must follow these principles:

1. Never store plaintext passwords.
2. Password verification must use a secure password-hashing mechanism.
3. Credentials must not be logged.
4. Tokens must be validated before accepting authenticated requests.
5. Authentication failures must not expose sensitive information.
6. Secrets must come from secure configuration.
7. Token expiration must be enforced.
8. Authentication state must be explicit.
9. Security-sensitive operations must be auditable.
10. Authentication contracts must remain independent from UI concerns.

---

## Implementation Boundary

This package defines reusable contracts.

An authentication service is responsible for implementation details such as:

```text
Database
Password hashing
User persistence
Token signing
Token storage
Session persistence
HTTP endpoints
Configuration
Secrets
```

For example:

```text
packages/auth
        │
        │ contracts
        ▼
services/auth-service
        │
        ├── Database
        ├── Password hashing
        ├── Token handling
        └── API
```

---

## Testing

The package should eventually contain tests covering:

* Identity contracts
* Authentication result contracts
* Token contracts
* Authentication context
* Invalid authentication states
* Expired credentials
* Authentication error handling

Security-sensitive implementation tests belong with the implementation that provides them.

---

## Current Status

**Status:** FOUNDATION / CONTRACT DEFINITION

This package is currently part of the OGWUSEARCH Engineering platform architecture.

Implementation should not proceed until the Phase 01 project audit determines the appropriate relationship between this package and the existing authentication service.

---

## Phase 01 Rule

Do not expand this package simply because it exists.

The current priority is:

```text
Foundation
    ↓
Project Audit
    ↓
Project Priorities
    ↓
Architecture Decision
    ↓
Implementation
```

---

## Guiding Principle

> **Authenticate identity first. Authorize actions second. Keep both independent from engineering-domain logic.**



Yes. For `packages/auth`, I would make the contract **deliberately small**. It should define the language and interfaces for authentication, while leaving cryptography, persistence, HTTP, tokens, and provider-specific behavior to implementations.

## Exact contract scope

### `packages/auth` owns

1. **Identity**
2. **Authentication result**
3. **Authentication context**
4. **Authentication credentials contract**
5. **Authentication method**
6. **Authentication service interface**
7. **Credential-validation interface**
8. **Authentication errors**
9. **Minimal authentication metadata**

### `packages/auth` does **not** own

* Users database/repository
* Password hashing implementation
* JWT implementation
* OAuth/OIDC provider implementation
* Sessions persistence
* HTTP/FastAPI routes
* Cookies
* RBAC
* Roles
* Permissions
* Policies
* Access decisions
* Application/domain models

That gives us a clean boundary:

```text
packages/auth
    │
    ├── Identity
    ├── Credentials
    ├── AuthenticationContext
    ├── AuthenticationResult
    ├── AuthenticationService
    ├── CredentialValidator
    └── AuthenticationError
             │
             ▼
     implementation/service
             │
       ┌─────┼─────┐
       ▼     ▼     ▼
    DB     Crypto  HTTP
```

### Proposed TypeScript contract

```ts
export type UserId = string;

export type AuthenticationMethod =
  | "password"
  | "api_key"
  | "oauth"
  | "oidc";

export interface AuthenticatedIdentity {
  readonly userId: UserId;
  readonly authenticatedAt: Date;
  readonly method: AuthenticationMethod;
}

export interface AuthenticationContext {
  readonly authenticated: boolean;
  readonly identity: AuthenticatedIdentity | null;
}

export interface PasswordCredentials {
  readonly type: "password";
  readonly identifier: string;
  readonly secret: string;
}

export interface ApiKeyCredentials {
  readonly type: "api_key";
  readonly key: string;
}

export type AuthenticationCredentials =
  | PasswordCredentials
  | ApiKeyCredentials;

export interface AuthenticationResult {
  readonly success: boolean;
  readonly context: AuthenticationContext;
}

export interface AuthenticationService {
  authenticate(
    credentials: AuthenticationCredentials,
  ): Promise<AuthenticationResult>;

  validate(
    context: AuthenticationContext,
  ): Promise<AuthenticationResult>;
}
```

I would **not** add `Role`, `Permission`, `Policy`, or `authorize()` to this package. Those belong in `packages/authorization`.

### One important refinement

I would also **not put JWT types into `auth` yet**. JWT is an implementation/transport mechanism, whereas the package's fundamental contract is:

> **Given authentication credentials, establish and validate an authenticated identity.**

This keeps the package reusable if the eventual `auth-service` uses JWT today but an opaque-token/session architecture later.

So the exact dependency boundary becomes:

```text
                 ┌──────────────────────┐
                 │    packages/auth     │
                 │                      │
                 │ Identity             │
                 │ Credentials          │
                 │ Auth Context         │
                 │ Auth Result          │
                 │ Auth Service         │
                 │ Auth Errors          │
                 └──────────┬───────────┘
                            │
                 establishes identity
                            │
                            ▼
                 ┌──────────────────────┐
                 │ packages/authorization│
                 │                      │
                 │ Roles                │
                 │ Permissions          │
                 │ Policies             │
                 │ Access decisions     │
                 └──────────┬───────────┘
                            │
                            ▼
                    Application/API
```

**Contract scope is now small enough to freeze as a foundation decision.** The existing `auth-service` can subsequently be audited against this contract rather than allowing the service to define the architecture accidentally.
