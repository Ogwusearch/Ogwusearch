# @ogwusearch/engineering-units

A reusable, strongly typed unit and quantity foundation for the Ogwusearch engineering platform.

`engineering-units` provides physical dimensions, engineering units, quantities, unit registries, and unit conversion.

It is designed to be independent of any specific engineering domain.

## Position in the Monorepo

```text
engineering-types
       ↑
engineering-units
       ↑
engineering-validation
       ↑
engineering-core
       ↑
solar-engine
```

`engineering-units` belongs to the foundation layer.

It should not contain solar-specific, mining-specific, or application-specific calculations.

---

# Responsibilities

`engineering-units` provides:

* SI and engineering dimensions
* physical unit definitions
* unit registries
* quantities
* unit conversion
* dimension compatibility checks
* reusable unit metadata

Examples include:

```text
Length
Mass
Time
Temperature
Current
Charge
Voltage
Resistance
Energy
Power
Percentage
```

The package can be extended as additional engineering domains require more units.

---

# Design Goals

## Strongly Typed

Units should be represented by TypeScript types rather than undocumented strings or raw numbers.

```ts
const voltage = createQuantity(230, VOLT);
```

rather than:

```ts
const voltage = 230;
```

The unit stays attached to the value.

---

## Dimension-Aware

Every unit belongs to a physical dimension.

For example:

```text
Volt
Millivolt
Kilovolt
```

all belong to the voltage dimension.

Similarly:

```text
Watt
Kilowatt
Megawatt
```

belong to the power dimension.

This allows the conversion layer to reject incompatible conversions such as:

```text
230 V → 230 kg
```

---

## Conversion-Safe

Conversions should only occur between compatible dimensions.

```text
230 V
  ↓
base unit
  ↓
0.23 kV
```

but:

```text
230 V
  ↓
X
kg
```

must fail.

---

## Reusable

The package should work across multiple engineering systems:

```text
Solar
Electrical
Mechanical
Mining
Energy
Industrial
Civil
```

---

# Package Structure

```text
engineering-units/
├── src/
│   ├── dimensions/
│   │   ├── dimension.ts
│   │   └── dimensions.ts
│   │
│   ├── units/
│   │   ├── unit.ts
│   │   ├── registry.ts
│   │   ├── charge.ts
│   │   ├── current.ts
│   │   ├── energy.ts
│   │   ├── length.ts
│   │   ├── percentage.ts
│   │   ├── power.ts
│   │   ├── resistance.ts
│   │   ├── temperature.ts
│   │   ├── time.ts
│   │   └── voltage.ts
│   │
│   ├── quantity/
│   │   ├── quantity.ts
│   │   ├── create-quantity.ts
│   │   └── compare.ts
│   │
│   ├── conversion/
│   │   ├── errors.ts
│   │   ├── convert.ts
│   │   └── conversion.ts
│   │
│   └── index.ts
│
├── tests/
├── package.json
├── tsconfig.json
└── README.md
```

---

# Dimensions

The package represents dimensions using a dimension vector.

The base dimensions are:

```text
Length
Mass
Time
Temperature
Current
Amount
Luminous Intensity
```

A dimension is represented conceptually as:

```ts
interface DimensionVector {
  readonly length: number;
  readonly mass: number;
  readonly time: number;
  readonly temperature: number;
  readonly current: number;
  readonly amount: number;
  readonly luminousIntensity: number;
}
```

For example:

```text
Length
[1, 0, 0, 0, 0, 0, 0]

Area
[2, 0, 0, 0, 0, 0, 0]

Velocity
[1, 0,-1, 0, 0, 0, 0]

Force
[1, 1,-2, 0, 0, 0, 0]

Energy
[2, 1,-2, 0, 0, 0, 0]

Power
[2, 1,-3, 0, 0, 0, 0]
```

This enables dimensional analysis without depending on a particular unit symbol.

---

# Standard Dimensions

The package defines common derived dimensions:

```text
DIMENSIONLESS
LENGTH
MASS
TIME
TEMPERATURE
CURRENT
AMOUNT
LUMINOUS_INTENSITY

AREA
VOLUME
VELOCITY
ACCELERATION
FORCE
ENERGY
POWER
CHARGE
VOLTAGE
RESISTANCE
FREQUENCY
PRESSURE
```

Example:

```ts
const POWER = createDimension({
  length: 2,
  mass: 1,
  time: -3,
});
```

---

# Units

A unit describes a physical measurement system.

The common unit contract is:

```ts
interface Unit {
  readonly symbol: string;
  readonly name: string;
  readonly dimension: DimensionVector;

  readonly toBase: (value: number) => number;
  readonly fromBase: (value: number) => number;
}
```

This gives every unit:

* a symbol
* a human-readable name
* a physical dimension
* a conversion to the base unit
* a conversion from the base unit

---

# Supported Units

## Length

```text
m
km
cm
mm
µm
nm
in
ft
yd
mi
nmi
```

Examples:

```text
1 km = 1000 m
1 ft = 0.3048 m
1 in = 0.0254 m
```

---

## Current

```text
A
kA
mA
µA
nA
```

Examples:

```text
1 kA = 1000 A
1 A = 1000 mA
```

---

## Charge

```text
C
mC
µC
nC
kC
Ah
mAh
```

Examples:

```text
1 Ah = 3600 C
1 mAh = 3.6 C
```

This is particularly useful for battery engineering.

---

## Energy

```text
J
mJ
kJ
MJ
Wh
kWh
MWh
GWh
```

Examples:

```text
1 Wh = 3600 J
1 kWh = 3,600,000 J
```

---

## Power

```text
W
mW
kW
MW
GW
hp
PS
VA
kVA
MVA
var
kvar
Mvar
```

Electrical engineering may use different semantic quantities that share dimensional structure.

For example:

```text
W
VA
var
```

are dimensionally related but should not automatically be treated as interchangeable engineering concepts merely because their dimensions match.

---

## Resistance

```text
Ω
mΩ
µΩ
kΩ
MΩ
```

Examples:

```text
1 kΩ = 1000 Ω
1 MΩ = 1,000,000 Ω
```

---

## Voltage

```text
V
mV
µV
kV
MV
```

Examples:

```text
1000 mV = 1 V
1 kV = 1000 V
```

---

## Time

```text
s
ms
µs
ns
min
h
d
wk
```

Examples:

```text
60 s = 1 min
3600 s = 1 h
86400 s = 1 d
```

---

## Temperature

```text
K
°C
°F
°R
```

Temperature is different from simple scaled units because Celsius and Fahrenheit contain offsets.

For example:

```text
°C → K
```

cannot be implemented as multiplication by a simple factor.

The unit model therefore supports:

```ts
toBase(value)
fromBase(value)
```

rather than assuming every conversion is factor-only.

---

## Percentage

```text
ratio
%
‰
‱
```

Examples:

```text
1 ratio = 100%
10% = 0.10 ratio
1‰ = 0.001 ratio
```

---

# Quantities

A quantity combines a numerical value with a unit.

```ts
interface Quantity {
  readonly value: number;
  readonly unit: Unit;
}
```

Example:

```ts
const voltage = createQuantity(230, VOLT);
```

Conceptually:

```text
value = 230
unit  = V
```

This prevents the unit from being separated from the engineering value.

---

# Creating Quantities

```ts
const voltage = createQuantity(230, VOLT);

const current = createQuantity(10, AMPERE);

const energy = createQuantity(5, KILOWATT_HOUR);
```

Values must be finite numbers.

Invalid values such as:

```text
NaN
Infinity
-Infinity
```

should not be accepted as normal quantities.

---

# Conversion

The conversion layer provides conversion between compatible units.

Example:

```ts
const voltage = createQuantity(230, VOLT);

const result = convertTo(voltage, KILOVOLT);
```

Conceptually:

```text
230 V
 ↓
0.23 kV
```

Direct value conversion is also supported:

```ts
const value = convert(
  230,
  VOLT,
  KILOVOLT,
);
```

Result:

```text
0.23
```

---

# Conversion Model

Conversions follow this model:

```text
Source Unit
     │
     ▼
 Source → Base
     │
     ▼
 Base Value
     │
     ▼
 Base → Target
     │
     ▼
Target Unit
```

For example:

```text
kW
 ↓
W
 ↓
kW
```

This centralizes conversion behavior and avoids implementing every possible unit pair separately.

---

# Dimension Compatibility

Before conversion, dimensions must be compared.

Example:

```ts
convert(230, VOLT, MILLIVOLT);
```

is valid because both units represent voltage.

But:

```ts
convert(230, VOLT, KILOGRAM);
```

must throw an incompatible-unit error.

The comparison should be based on dimension values, not object identity.

Conceptually:

```ts
dimensionsEqual(
  from.dimension,
  to.dimension,
);
```

---

# Comparing Quantities

Quantities with compatible dimensions can be compared even when they use different units.

Example:

```text
1000 m
1 km
```

represent equal quantities.

A comparison operation can therefore normalize both values to their base unit:

```text
1000 m → 1000 m
1 km   → 1000 m
```

and then compare the normalized values.

Supported operations include:

```text
compareQuantities()
quantitiesEqual()
quantityGreaterThan()
quantityLessThan()
```

---

# Unit Registry

Units are grouped into categories.

Example:

```ts
const UNIT_REGISTRY = {
  charge: CHARGE_UNITS,
  current: CURRENT_UNITS,
  energy: ENERGY_UNITS,
  length: LENGTH_UNITS,
  percentage: PERCENTAGE_UNITS,
  power: POWER_UNITS,
  resistance: RESISTANCE_UNITS,
  temperature: TEMPERATURE_UNITS,
  time: TIME_UNITS,
  voltage: VOLTAGE_UNITS,
};
```

This allows applications to discover units by category and symbol.

Example:

```ts
getUnit("voltage", "V");
```

or:

```ts
getUnit("energy", "kWh");
```

---

# Engineering Usage

The unit package is intended to become the common measurement layer for other engineering packages.

For example, a solar calculation might use:

```ts
const systemVoltage = createQuantity(48, VOLT);

const loadPower = createQuantity(5, KILOWATT);

const dailyEnergy = createQuantity(24, KILOWATT_HOUR);
```

The domain calculation can then operate on explicit quantities instead of undocumented numbers.

---

# Solar Engineering Example

A solar engine may eventually use:

```text
Voltage
Current
Power
Energy
Charge
Resistance
Time
Percentage
Length
Temperature
```

Example calculation inputs:

```text
System Voltage = 48 V
Load Power     = 5 kW
Daily Energy   = 24 kWh/day
Efficiency     = 85%
Cable Length   = 30 m
Ambient Temp   = 35 °C
```

`engineering-units` supplies the measurement layer.

`solar-engine` supplies the actual solar engineering formulas.

---

# Domain Separation

`engineering-units` should not implement:

```text
PV sizing
Battery sizing
Inverter sizing
Cable sizing
Voltage-drop design
Load auditing
Mining production
Inventory calculations
Financial calculations
UI behavior
Database access
```

Those belong to higher-level packages.

The boundary should remain:

```text
engineering-units
        ↓
provides measurements

engineering-core
        ↓
executes calculations

solar-engine
        ↓
solves solar engineering problems
```

---

# Dependencies

The package may depend on:

```text
@ogwusearch/engineering-types
```

It should not depend on:

```text
engineering-core
solar-engine
application packages
UI packages
database packages
```

This keeps the unit layer reusable.

---

# Example

```ts
import {
  createQuantity,
  convertTo,
  VOLT,
  KILOVOLT,
} from "@ogwusearch/engineering-units";

const systemVoltage = createQuantity(
  230,
  VOLT,
);

const kilovolts = convertTo(
  systemVoltage,
  KILOVOLT,
);

console.log(kilovolts.value);
// 0.23
```

---

# Testing

The package should test:

```text
dimension creation
dimension equality
dimension multiplication
dimension division
dimension powers

unit definitions
unit registry
quantity creation
quantity validation

compatible conversions
incompatible conversions
temperature conversions
quantity conversions

quantity comparison
quantity equality
```

Particular attention should be given to:

```text
floating-point conversion
temperature offsets
dimension compatibility
zero values
negative values where physically valid
very large values
very small values
invalid numeric values
```

---

# Commands

From the repository root:

```bash
pnpm --filter @ogwusearch/engineering-units typecheck
```

Build:

```bash
pnpm --filter @ogwusearch/engineering-units build
```

Test:

```bash
pnpm --filter @ogwusearch/engineering-units test
```

Run all three:

```bash
pnpm --filter @ogwusearch/engineering-units typecheck \
  && pnpm --filter @ogwusearch/engineering-units build \
  && pnpm --filter @ogwusearch/engineering-units test
```

---

# Architectural Principle

The central principle of `engineering-units` is:

```text
A number alone is not an engineering measurement.
A measurement consists of a value, a unit, and a physical dimension.
```

Therefore:

```text
230
```

is just a number.

While:

```text
230 V
```

is an engineering quantity.

The package exists to make that distinction explicit, reusable, and type-safe throughout the Ogwusearch engineering platform.
