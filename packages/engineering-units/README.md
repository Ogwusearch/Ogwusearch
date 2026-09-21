# @ogwusearch/engineering-units

Engineering quantities, dimensions, units, and deterministic unit conversions for the OGWUSEARCH engineering ecosystem.

## Purpose

`@ogwusearch/engineering-units` provides the shared unit infrastructure used by engineering calculation engines.

It ensures that engineering calculations work with explicit and consistent units.

The package is responsible for:

* Quantities
* Units
* Dimensions
* Unit definitions
* Unit conversion
* Unit compatibility
* Unit normalization

It does **not** contain domain-specific engineering formulas.

---

## Core Principle

Engineering calculations should never depend on ambiguous numbers.

Avoid:

```ts
const voltage = 48;
```

Prefer:

```ts
const voltage = {
  value: 48,
  unit: "V",
};
```

This makes the engineering meaning explicit.

---

## Quantity Model

A quantity consists of:

```text
value + unit
```

Conceptually:

```ts
type Quantity = {
  value: number;
  unit: string;
};
```

Example:

```ts
const voltage = {
  value: 48,
  unit: "V",
};

const power = {
  value: 1500,
  unit: "W",
};

const energy = {
  value: 5.5,
  unit: "kWh",
};
```

---

## Dimensions

Units belong to physical dimensions.

Examples:

```text
Voltage
Current
Power
Energy
Resistance
Capacitance
Inductance
Frequency
Time
Length
Mass
Temperature
Area
Volume
```

Conceptually:

```text
Voltage
├── V
├── mV
└── kV

Current
├── A
├── mA
└── kA

Power
├── W
├── kW
└── MW

Energy
├── Wh
├── kWh
└── MWh
```

A unit must belong to a compatible dimension.

---

## Unit Examples

### Electrical

```text
V       Volt
mV      Millivolt
kV      Kilovolt

A       Ampere
mA      Milliampere
kA      Kiloampere

Ω       Ohm
kΩ      Kiloohm
MΩ      Megaohm

W       Watt
kW      Kilowatt
MW      Megawatt

Wh      Watt-hour
kWh     Kilowatt-hour
MWh     Megawatt-hour

Hz      Hertz
kHz     Kilohertz
MHz     Megahertz
```

### Solar

Common solar engineering units include:

```text
W
kW
Wh
kWh
V
A
Ah
kAh
°C
m²
kWh/m²/day
```

### Mechanical

Potential units include:

```text
N
kN
Pa
kPa
MPa
bar
mm
cm
m
kg
g
L
m³
```

---

## Unit Conversion

Conversions should be deterministic.

Example:

```text
1500 W
   ↓
1.5 kW
```

Conceptually:

```ts
convert(
  {
    value: 1500,
    unit: "W",
  },
  "kW",
);
```

Result:

```ts
{
  value: 1.5,
  unit: "kW",
}
```

---

## Conversion Rules

A conversion is valid only when the source and destination units have compatible dimensions.

Valid:

```text
W → kW
V → kV
A → mA
Wh → kWh
m → km
```

Invalid:

```text
W → V
A → kg
m → Hz
kWh → °C
```

Invalid conversions should produce a structured error rather than silently producing a result.

---

## Unit Normalization

Engineering modules may normalize quantities before performing calculations.

Example:

```text
Input:

1.5 kW
500 W
250 mW

        ↓

Normalization

1500 W
 500 W
0.25 W
```

The calculation can then operate on a consistent unit.

---

## Base Units

The package should define canonical units for each supported dimension.

Example:

```text
Power      → W
Energy     → Wh
Voltage    → V
Current    → A
Resistance → Ω
Length     → m
Mass       → kg
Time       → s
Temperature → °C
```

The exact base-unit policy should remain centralized in this package.

Domain engines should not implement their own conversion tables.

---

## Unit Registry

Units should be registered centrally.

Conceptually:

```ts
registerUnit({
  symbol: "kW",
  dimension: "power",
  factor: 1000,
});
```

A registry allows the system to determine:

```text
unit
  ↓
dimension
  ↓
conversion factor
```

Example:

```text
kW
 ↓
power
 ↓
1000 W
```

---

## Prefixes

The unit system should support standard SI-style prefixes where applicable.

```text
n   nano    10⁻⁹
µ   micro   10⁻⁶
m   milli   10⁻³
k   kilo    10³
M   mega    10⁶
G   giga    10⁹
```

Example:

```text
1 kW = 1000 W
1 MW = 1000 kW
1 mA = 0.001 A
```

Prefix handling should be deterministic and tested.

---

## Temperature

Temperature requires special handling because Celsius and Fahrenheit are offset scales rather than simple multiplicative conversions.

Examples:

```text
°C ↔ °F
°C ↔ K
```

Temperature conversion must therefore use explicit conversion functions rather than assuming:

```text
value × factor
```

---

## Compound Units

The unit system may eventually support compound quantities.

Examples:

```text
W/m²
kWh/m²/day
A/mm²
Ω·m
N·m
kg/m³
```

These are important for engineering calculations such as:

* Solar irradiance
* Energy yield
* Cable current density
* Resistivity
* Torque
* Material density

Compound-unit support should remain part of the units layer rather than being implemented independently inside domain engines.

---

## Unit Compatibility

Before performing operations, the system should verify dimensional compatibility.

Example:

```text
Voltage + Voltage
```

is dimensionally valid.

But:

```text
Voltage + Current
```

is not dimensionally valid.

Likewise:

```text
Energy / Time
```

produces a power dimension.

The units system should provide the infrastructure required to represent these relationships.

---

## Engineering Examples

### PV Power

```text
Panel power:

550 W

Equivalent:

0.55 kW
```

### Battery Energy

```text
48 V × 200 Ah

= 9600 Wh

= 9.6 kWh
```

The units package does not perform the engineering calculation itself.

It provides the quantity and unit infrastructure required for the calculation engine.

---

## Relationship With Other Packages

```text
                 engineering-types
                        ↑
                        │
                engineering-units
                        ↑
                        │
              engineering-validation
                        ↑
                        │
                 engineering-core
                        ↑
                        │
                  domain engines
```

Domain engines include:

```text
@ogwusearch/solar-engine
@ogwusearch/electrical-engine
@ogwusearch/circuit-engine
```

The units package should remain independent of these domain engines.

---

## What Does Not Belong Here

Do not place domain-specific engineering calculations inside this package.

For example, this does not belong here:

```ts
const pvPower =
  dailyEnergy / (peakSunHours * efficiency);
```

That belongs in:

```text
@ogwusearch/solar-engine
```

Likewise:

```ts
const current = power / voltage;
```

belongs in an electrical calculation module.

The units package provides the quantities and conversions used by those calculations.

---

## Recommended Package Structure

```text
engineering-units/
│
├── src/
│   ├── index.ts
│   │
│   ├── dimensions/
│   │   ├── dimension.ts
│   │   └── dimensions.ts
│   │
│   ├── units/
│   │   ├── unit.ts
│   │   ├── registry.ts
│   │   └── definitions/
│   │
│   ├── quantity/
│   │   ├── quantity.ts
│   │   ├── create-quantity.ts
│   │   └── normalize.ts
│   │
│   ├── conversion/
│   │   ├── convert.ts
│   │   ├── compatibility.ts
│   │   └── errors.ts
│   │
│   └── __tests__/
│       ├── quantity.test.ts
│       ├── conversion.test.ts
│       ├── compatibility.test.ts
│       └── dimensions.test.ts
│
└── README.md
```

---

## Testing Requirements

The units package should test:

### Basic conversion

```text
1000 W → 1 kW
1000 mA → 1 A
1000 Wh → 1 kWh
```

### Reverse conversion

```text
1 kW → 1000 W
1 A → 1000 mA
1 kWh → 1000 Wh
```

### Dimension compatibility

```text
W → kW
```

should succeed.

```text
W → V
```

should fail.

### Zero

```text
0 W → 0 kW
```

should remain zero.

### Negative values

Signed quantities should be handled consistently where physically meaningful.

### Precision

Conversions should avoid unnecessary floating-point errors and should have clearly defined precision behavior.

### Temperature

Test:

```text
°C → °F
°F → °C
°C → K
K → °C
```

---

## Quality Requirements

The package should maintain:

* Strong TypeScript typing
* Deterministic conversions
* Explicit dimensions
* Explicit units
* No hidden global state
* No domain-specific formulas
* No circular dependencies
* Centralized unit definitions
* Clear conversion errors
* Comprehensive tests

---

## Summary

`@ogwusearch/engineering-units` is the common unit and quantity layer for the OGWUSEARCH engineering ecosystem.

Its responsibility is:

```text
Quantity
   ↓
Dimension
   ↓
Unit
   ↓
Compatibility
   ↓
Conversion
   ↓
Normalized Quantity
```

The package ensures that engineering calculations operate on explicit, compatible, and reproducible units.

Engineering formulas belong in the domain engines.

Unit infrastructure belongs here.
