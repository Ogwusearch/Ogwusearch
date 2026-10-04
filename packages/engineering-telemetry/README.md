# @ogwusearch/engineering-telemetry

Framework-free telemetry infrastructure for Ogwusearch Engineering.

## Responsibilities

* Structured engineering events
* Event storage
* Event aggregation
* Dashboard-ready data adapters

The package does not depend on React, Chart.js, browser APIs, Supabase, SQLite, FastAPI, or Solar Engine.

## Architecture

```text
Application
    │
    ▼
TelemetryService
    │
    ▼
TelemetryStorage
    │
    ├── Memory Storage
    └── Future Storage
    │
    ▼
Aggregation
    │
    ▼
Dashboard Adapter
```

## Event Types

The package provides structured events for common engineering-platform activity:

```text
project_created
audit_created
audit_started
audit_completed
audit_failed

calculation_started
calculation_completed
calculation_failed

test_passed
test_failed
build_completed
report_generated
page_view
```

## Event Shape

Telemetry events use a stable event envelope with an extensible payload.

The envelope defines the identity, classification, temporal context, and optional project association of an event. Event-specific information is carried exclusively through the `data` payload.

```ts
export interface TelemetryEvent<
  TData extends Record<string, unknown> =
    Record<string, unknown>,
> {
  readonly id: string;
  readonly type: TelemetryEventType;
  readonly timestamp: string;
  readonly project?: string;
  readonly data: TData;
}
```

### Event Contract

| Field       | Type                      | Required | Semantics                                                          |
| ----------- | ------------------------- | -------: | ------------------------------------------------------------------ |
| `id`        | `string`                  |      Yes | Unique identifier for the event instance.                          |
| `type`      | `TelemetryEventType`      |      Yes | Canonical classification of the event.                             |
| `timestamp` | `string`                  |      Yes | ISO-8601 timestamp representing when the event occurred.           |
| `project`   | `string`                  |       No | Optional project or application context associated with the event. |
| `data`      | `Record<string, unknown>` |      Yes | Structured payload containing event-specific attributes.           |

The distinction between the envelope and payload is intentional:

```text
Telemetry Event
│
├── Identity
│   └── id
│
├── Classification
│   └── type
│
├── Temporal Context
│   └── timestamp
│
├── Application Context
│   └── project
│
└── Event Payload
    └── data
```

This allows the telemetry infrastructure to operate on events without needing to understand the semantics of every individual event payload.

### Event Envelope

A completed event may look like:

```ts
const event: TelemetryEvent = {
  id: "event-001",
  type: "audit_completed",
  timestamp: "2026-10-01T10:30:00.000Z",
  project: "SolarAudit",
  data: {
    auditId: "audit-001",
  },
};
```

The envelope is intentionally small. Infrastructure-level concerns such as identity, classification, ordering context, and project association remain separate from application-specific information.

### Event Payload

The `data` property is the extensibility boundary of the event model.

For example, a project event may contain:

```ts
await telemetry.trackEvent({
  type: "project_created",
  project: "SolarAudit",
  data: {
    projectId: "project-001",
    name: "Residential Solar Project",
  },
});
```

An audit event may contain:

```ts
await telemetry.trackEvent({
  type: "audit_completed",
  project: "SolarAudit",
  data: {
    auditId: "audit-001",
  },
});
```

A calculation event may contain:

```ts
await telemetry.trackEvent({
  type: "calculation_completed",
  project: "SolarAudit",
  data: {
    calculation: "load-audit",
    auditId: "audit-001",
  },
});
```

### Event Shape Invariants

Telemetry events should preserve the following invariants:

1. **Stable envelope**
   The top-level event structure should remain consistent across event types.

2. **Explicit classification**
   `type` identifies what happened; consumers should not infer event type from arbitrary payload fields.

3. **Structured payloads**
   Event-specific information belongs in `data` as structured values rather than preformatted log messages.

4. **Temporal consistency**
   `timestamp` uses ISO-8601 representation so events can be ordered and aggregated consistently.

5. **Immutable events**
   Telemetry events are treated as historical records. Once emitted, their meaning should not depend on later application state.

6. **Domain-neutral infrastructure**
   The telemetry package records activity but does not interpret engineering formulas, calculation correctness, or domain-specific business rules.

7. **Consumer independence**
   Event producers must not depend on storage engines, dashboard libraries, or presentation frameworks.

8. **Extensible payloads**
   New event-specific information should normally be introduced through `data` rather than by expanding the common envelope.

### Event Design Boundary

The telemetry model deliberately separates **what happened** from **how the event is stored or presented**.

```text
Event Producer
     │
     ▼
Telemetry Event
     │
     ├──► Storage
     │
     ├──► Aggregation
     │
     ├──► Reporting
     │
     └──► Dashboard Adapter
```

The event itself does not know whether it will eventually be written to memory, a file, a database, an API, a report, or a dashboard.

## Usage

```ts
import {
  MemoryTelemetryStorage,
  TelemetryService,
} from "@ogwusearch/engineering-telemetry";

const telemetry = new TelemetryService({
  storage: new MemoryTelemetryStorage(),
});

await telemetry.trackEvent({
  type: "audit_completed",
  project: "SolarAudit",
  data: {
    auditId: "audit-001",
  },
});
```

## Storage

Telemetry persistence is defined through the `TelemetryStorage` interface.

```ts
export interface TelemetryStorage {
  append(event: TelemetryEvent): Promise<void>;

  getAll(): Promise<
    readonly TelemetryEvent[]
  >;

  clear(): Promise<void>;
}
```

The package currently provides in-memory storage for development and testing.

Additional storage implementations can be added without changing the telemetry service.

## Aggregation

Raw events can be aggregated into reusable summaries:

```text
Total events
Events by type
Events by project
Events by day
```

Aggregation remains separate from storage so applications can use the same event data for different reporting requirements.

## Dashboard Adapters

The package converts telemetry summaries into generic dashboard-ready structures.

It does not depend on a specific visualization library.

Dashboard consumers may adapt the data to:

* Chart.js
* Recharts
* D3
* Custom dashboards
* JSON APIs
* CLI output
* Reports

Those integrations belong outside this package.

## Design Boundary

`engineering-telemetry` observes application activity. It does not own engineering calculations or application workflows.

```text
SolarAudit
    │
    ├──► Solar Engine
    │       │
    │       └──► Engineering Calculations
    │
    └──► Engineering Telemetry
            │
            └──► Activity Events
```

Telemetry should therefore remain independent of `solar-engine`.

## Package Structure

```text
src/
├── events/
│   ├── event-types.ts
│   └── index.ts
├── storage/
│   ├── telemetry-storage.ts
│   ├── memory-storage.ts
│   └── index.ts
├── aggregation/
│   ├── aggregate-events.ts
│   └── index.ts
├── adapters/
│   ├── dashboard-adapter.ts
│   └── index.ts
├── telemetry.ts
└── index.ts
```

## Development

From the monorepo root:

```bash
pnpm --dir packages/engineering-telemetry typecheck
pnpm --dir packages/engineering-telemetry test
pnpm --dir packages/engineering-telemetry build
```

Full package gate:

```bash
pnpm --dir packages/engineering-telemetry typecheck && \
pnpm --dir packages/engineering-telemetry test && \
pnpm --dir packages/engineering-telemetry build
```

## Principles

* Framework-free
* Storage-independent
* Deterministic
* Structured
* Reusable
* Domain-neutral
* Dashboard-independent

The package provides the telemetry infrastructure without becoming part of the application UI or engineering calculation domain.
