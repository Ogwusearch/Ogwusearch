#!/usr/bin/env bash

set -e

ROOT="/home/ogwu/workspace/ogwusearch/packages/solar-engine/src/pv-sizing"

echo "▶ Creating PV Sizing module..."
echo "  $ROOT"

mkdir -p "$ROOT"

touch \
  "$ROOT/index.ts" \
  "$ROOT/types.ts" \
  "$ROOT/validation.ts" \
  "$ROOT/calculations.ts" \
  "$ROOT/warnings.ts" \
  "$ROOT/errors.ts"

echo "✔ Created:"
find "$ROOT" -maxdepth 1 -type f -printf '  %f\n' | sort

echo
echo "✔ PV Sizing TypeScript module scaffolded successfully."
