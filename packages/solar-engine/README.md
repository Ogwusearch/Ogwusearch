# @ogwusearch/solar-engine

Domain-specific solar engineering calculation infrastructure for the Ogwusearch Engineering platform.

`@ogwusearch/solar-engine` provides deterministic and validated engineering calculations for photovoltaic and renewable-energy system analysis.

## Architecture

```text
engineering-types
       │
       ├──────────────┐
       ▼              ▼
engineering-units   engineering-validation
       │              │
       └───────┬──────┘
               ▼
       engineering-core
               │
               ▼
          solar-engine
