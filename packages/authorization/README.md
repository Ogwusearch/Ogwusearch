# Authorization Package

## Purpose

`@ogwusearch/authorization` provides the shared authorization contracts used by OGWUSEARCH applications and services.

The package answers one question:

> **Is this authenticated identity allowed to perform this action on this resource?**

Authorization is responsible for evaluating access.

It does not establish identity.

---

## Responsibilities

The authorization package may define:

* Authorization subject contracts
* Resource contracts
* Action contracts
* Permission contracts
* Role contracts
* Policy contracts
* Authorization request contracts
* Authorization decision contracts
* Authorization errors
* Authorization service interfaces

---

## Non-Responsibilities

This package must not contain:

* Password handling
* Credential verification
* User authentication
* Password hashing
* JWT signing
* JWT parsing
* Token issuance
* Session authentication
* Database-specific repositories
* HTTP route handlers
* UI logic
* Solar engineering calculations
* Domain-specific business calculations

Authentication belongs to:

```text
packages/auth/
```

Service-specific implementation belongs in an appropriate service.

---

## Architectural Boundary

```text
Authentication
      │
      │ establishes identity
      ▼
Authenticated Identity
      │
      ▼
Authorization
      │
      │ evaluates access
      ▼
Authorization Decision
      │
      ▼
Application / Service
```

The authorization package consumes identity information.

It does not create or authenticate that identity.

---

## Package Location

```text
packages/authorization/
```

Expected structure:

```text
authorization/
├── README.md
├── package.json
├── tsconfig.json
└── src/
    └── index.ts
```

The internal structure may expand as the authorization contract becomes defined.

---

# Core Concepts

## Subject

The subject represents the authenticated identity requesting access.

Conceptually:

```text
AuthorizationSubject
├── id
└── attributes
```

The subject should contain only information required by authorization decisions.

Authentication remains responsible for establishing the identity.

---

## Resource

A resource represents the object or system being accessed.

Examples:

```text
project
site
audit
report
customer
user
system
```

The authorization package should not depend on SolarAudit or another specific application to define resources.

---

## Action

An action represents what the subject wants to do.

Examples:

```text
create
read
update
delete
execute
approve
export
```

Actions should remain generic.

Domain applications may define their own action vocabulary when required.

---

## Permission

A permission represents an allowed operation on a resource.

Conceptually:

```text
Permission
├── resource
└── action
```

Example:

```text
project:read
project:update
report:export
```

The package defines the contract, not the application's complete permission catalog.

---

## Role

A role represents a collection of permissions or authorization capabilities.

Conceptually:

```text
Role
├── id
├── name
└── permissions
```

Examples might include:

```text
admin
engineer
auditor
viewer
```

Specific application roles should not be hard-coded into the shared package.

---

## Policy

A policy defines rules used to determine whether an authorization request should be allowed.

A policy may consider:

```text
Subject
   +
Action
   +
Resource
   +
Context
   ↓
Authorization Decision
```

Policies should remain independent from authentication mechanisms.

---

# Authorization Request

The core request should conceptually contain:

```text
AuthorizationRequest
├── subject
├── action
├── resource
└── context
```

Where:

```text
subject  = who is requesting
action   = what they want to do
resource = what they want to access
context  = additional decision information
```

---

# Authorization Decision

The authorization engine returns a structured decision.

Conceptually:

```text
AuthorizationDecision
├── allowed
├── reason
└── metadata
```

The decision must clearly distinguish:

```text
ALLOW
DENY
```

The implementation may later support additional decision states if required, but the fundamental contract must remain explicit.

---

# Authorization Service

The package should define an interface for authorization evaluation.

Conceptually:

```ts
interface AuthorizationService {
  authorize(
    request: AuthorizationRequest,
  ): Promise<AuthorizationDecision>;
}
```

The implementation determines how the decision is produced.

Possible implementations include:

```text
Role-Based Access Control
Attribute-Based Access Control
Policy-Based Access Control
Resource-Based Access Control
```

The shared contract should not force one implementation prematurely.

---

# Authorization Flow

```text
Authenticated Identity
        │
        ▼
Authorization Request
        │
        ├── Subject
        ├── Action
        ├── Resource
        └── Context
        │
        ▼
Policy / Permission Evaluation
        │
        ▼
Authorization Decision
        │
   ┌────┴────┐
   ▼         ▼
 ALLOW      DENY
```

---

# Relationship With Authentication

Authentication and authorization are separate systems.

```text
AUTHENTICATION

Who are you?
       │
       ▼
Authenticated Identity


AUTHORIZATION

What may you do?
       │
       ▼
Access Decision
```

The expected relationship is:

```text
packages/auth
       │
       ▼
Authenticated Identity
       │
       ▼
packages/authorization
       │
       ▼
Authorization Decision
```

Authorization must not authenticate users itself.

---

# Dependency Rules

The authorization package must remain independent of application domains.

It must not depend on:

```text
solar-engine
solaraudit
circuit-engine
embedded-engineering
```

It should also not depend on a particular:

```text
database
web framework
authentication provider
token implementation
```

The package defines contracts.

Implementations provide infrastructure.

---

# Security Principles

Authorization implementations must follow these principles:

1. Default to deny when access cannot be established.
2. Never treat authentication as authorization.
3. Never trust client-supplied authorization decisions.
4. Evaluate permissions on the server side.
5. Keep authorization decisions explicit.
6. Avoid implicit privilege escalation.
7. Keep authorization policies auditable.
8. Do not expose unnecessary authorization information.
9. Keep authorization independent from UI logic.
10. Fail safely when authorization infrastructure is unavailable.

---

# Implementation Boundary

The shared package defines authorization contracts.

An authorization service may provide:

```text
Role storage
Permission storage
Policy evaluation
Role assignment
Permission assignment
Resource ownership
Authorization persistence
Caching
API integration
Audit logging
```

For example:

```text
packages/authorization
          │
          │ contracts
          ▼
authorization-service
          │
          ├── Roles
          ├── Permissions
          ├── Policies
          ├── Database
          └── API
```

---

# Example Architecture

```text
                    ┌─────────────────┐
                    │  packages/auth  │
                    └────────┬────────┘
                             │
                             ▼
                    AuthenticatedIdentity
                             │
                             ▼
              ┌────────────────────────────┐
              │ packages/authorization    │
              │                            │
              │ Subject                    │
              │ Resource                   │
              │ Action                     │
              │ Permission                 │
              │ Role                       │
              │ Policy                     │
              │ AuthorizationDecision      │
              └──────────────┬─────────────┘
                             │
                             ▼
                    Application / API
```

---

# Testing

The package should eventually contain tests covering:

* Authorization request contracts
* Authorization decision contracts
* Permission contracts
* Role contracts
* Policy contracts
* Allow decisions
* Deny decisions
* Missing permissions
* Unknown resources
* Unknown actions
* Default-deny behavior
* Authorization error handling

Policy-specific tests belong with the policy implementation when appropriate.

---

# Current Status

**Status:** FOUNDATION / CONTRACT DEFINITION

This package is currently part of the OGWUSEARCH Engineering platform architecture.

Implementation should not proceed until the Phase 01 project audit determines the appropriate relationship between this package and the existing authentication/authorization service architecture.

---

# Phase 01 Rule

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

# Guiding Principle

> **Authentication establishes identity. Authorization evaluates access. Neither should contain engineering-domain logic.**
Yes. For `packages/authorization`, I would freeze the contract at the **decision boundary**. The package should define *what must be supplied* and *what decision comes back*, without committing OGWUSEARCH to RBAC, ABAC, a database, or a particular policy engine.

## Exact contract

### 1. Core types

```ts
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
```

### 2. Decision contract

The fundamental output is deliberately simple:

```ts
export type AuthorizationDecision =
  | {
      readonly allowed: true;
      readonly reason?: string;
    }
  | {
      readonly allowed: false;
      readonly reason: string;
    };
```

This means **deny is never ambiguous**: a denial must have a reason.

### 3. Service contract

```ts
export interface AuthorizationService {
  authorize(
    request: AuthorizationRequest,
  ): Promise<AuthorizationDecision>;
}
```

That is the central interface.

The package does **not** dictate how `authorize()` works.

---

## 4. Permission contract

Permissions are useful as a shared vocabulary, but they should remain generic:

```ts
export interface Permission {
  readonly resource: string;
  readonly action: string;
}
```

Example:

```ts
const permission: Permission = {
  resource: "project",
  action: "read",
};
```

The package does **not** define the complete OGWUSEARCH permission catalogue.

---

## 5. Role contract

Roles are also contractual rather than implementation-specific:

```ts
export interface Role {
  readonly id: string;
  readonly name: string;
}
```

**Important:** `Role` does not contain permissions.

That relationship belongs to the authorization implementation/policy layer. This prevents the package from accidentally locking the platform into RBAC.

---

## 6. Policy contract

Policies should be represented by an interface rather than a particular policy language:

```ts
export interface AuthorizationPolicy {
  evaluate(
    request: AuthorizationRequest,
  ): Promise<AuthorizationDecision>;
}
```

An implementation can subsequently use:

* RBAC
* ABAC
* resource ownership
* policy rules
* combinations of these

without changing the package contract.

---

# Exact public API

I would therefore make `src/index.ts` expose only:

```ts
export type SubjectId;
export type ResourceId;

export interface AuthorizationSubject;
export interface AuthorizationResource;
export interface AuthorizationAction;
export interface AuthorizationContext;

export interface AuthorizationRequest;
export type AuthorizationDecision;

export interface Permission;
export interface Role;
export interface AuthorizationPolicy;
export interface AuthorizationService;
```

And nothing else initially.

---

# What is explicitly outside the contract

Do **not** expose these from `packages/authorization`:

```text
JWT
OAuth
OIDC
passwords
sessions
cookies
databases
ORM models
HTTP/FastAPI
Express
NestJS
SQL
Redis
RBAC implementation
ABAC implementation
policy database
engineering projects
SolarAudit resources
```

Those belong to implementations or consuming applications.

---

# Dependency boundary

The intended dependency graph is:

```text
packages/auth
      │
      │ authenticated identity
      ▼
packages/authorization
      │
      │ access decision
      ▼
application/service
```

Not:

```text
authorization → auth implementation
authorization → database
authorization → web framework
authorization → SolarAudit
```

The authorization package should only need **identity information**, not the authentication implementation that produced it.

---

# Contract invariant

The most important invariant is:

```text
Authorization MUST NOT establish identity.
Authorization MUST NOT assume access.
Authorization MUST explicitly return ALLOW or DENY.
Unknown / unavailable authorization state MUST NOT become ALLOW.
```

So the package's architectural contract can be summarized as:

> **Given a subject, action, resource, and optional context, `AuthorizationService` produces an explicit authorization decision.**

That is the boundary I would freeze now. Everything beyond it—RBAC, policies, persistence, caching, APIs, admin interfaces, and implementation strategy—should remain outside `packages/authorization` until the architecture deliberately selects it.
