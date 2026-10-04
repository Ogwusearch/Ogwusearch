#!/usr/bin/env bash

set -euo pipefail

ROOT="/home/ogwu/workspace/ogwusearch"
cd "$ROOT"

echo "============================================================"
echo " OGWUSEARCH ENGINEERING — REPOSITORY INSPECTION"
echo "============================================================"
echo "ROOT: $ROOT"
echo "DATE: $(date)"
echo

echo "============================================================"
echo "1. GIT STATUS"
echo "============================================================"

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    git status --short --branch
else
    echo "Not a Git repository."
fi

echo

echo "============================================================"
echo "2. TOP-LEVEL STRUCTURE"
echo "============================================================"

find . -maxdepth 2 \
    -type d \
    ! -path './.git*' \
    ! -path './node_modules*' \
    ! -path './dist*' \
    ! -path './build*' \
    | sort

echo

echo "============================================================"
echo "3. PACKAGES"
echo "============================================================"

if [ -d packages ]; then
    find packages -maxdepth 2 -type d | sort
else
    echo "packages/ not found."
fi

echo

echo "============================================================"
echo "4. DOCUMENTATION"
echo "============================================================"

find . \
    -type f \
    \( -iname '*.md' -o -iname '*.mdx' \) \
    ! -path './.git/*' \
    ! -path './node_modules/*' \
    | sort

echo

echo "============================================================"
echo "5. TYPESCRIPT FILES"
echo "============================================================"

find packages \
    -type f \
    \( -iname '*.ts' -o -iname '*.tsx' \) \
    2>/dev/null \
    | sort

echo

echo "============================================================"
echo "6. TEST FILES"
echo "============================================================"

find packages \
    -type f \
    \( \
        -iname '*.test.ts' \
        -o -iname '*.spec.ts' \
        -o -iname '*.test.tsx' \
        -o -iname '*.spec.tsx' \
    \) \
    2>/dev/null \
    | sort

echo

echo "============================================================"
echo "7. PACKAGE.JSON FILES"
echo "============================================================"

find . \
    -type f \
    -name package.json \
    ! -path './.git/*' \
    ! -path './node_modules/*' \
    | sort

echo

echo "============================================================"
echo "8. TYPESCRIPT CONFIGURATION"
echo "============================================================"

find . \
    -type f \
    \( \
        -name tsconfig.json \
        -o -name 'tsconfig.*.json' \
    \) \
    ! -path './.git/*' \
    ! -path './node_modules/*' \
    | sort

echo

echo "============================================================"
echo "9. SOLAR-ENGINE STRUCTURE"
echo "============================================================"

if [ -d packages/solar-engine ]; then
    find packages/solar-engine \
        -maxdepth 4 \
        -type d \
        | sort
else
    echo "packages/solar-engine not found."
fi

echo

echo "============================================================"
echo "10. FOUNDATION PACKAGES"
echo "============================================================"

for pkg in \
    engineering-types \
    engineering-units \
    engineering-validation \
    engineering-core \
    engineering-engine
do
    if [ -d "packages/$pkg" ]; then
        echo
        echo "----- packages/$pkg -----"
        find "packages/$pkg" \
            -maxdepth 3 \
            -type d \
            | sort
    fi
done

echo

echo "============================================================"
echo "11. OGWUSEARCH PACKAGE REFERENCES"
echo "============================================================"

grep -R \
    --include='package.json' \
    --include='*.ts' \
    --include='*.tsx' \
    -n '@ogwusearch/' \
    packages 2>/dev/null \
    | head -n 300 || true

echo

echo "============================================================"
echo "12. TODO / FIXME / HACK"
echo "============================================================"

grep -R \
    --exclude-dir=.git \
    --exclude-dir=node_modules \
    --exclude-dir=dist \
    --exclude-dir=build \
    --include='*.ts' \
    --include='*.tsx' \
    --include='*.md' \
    -nEi 'TODO|FIXME|HACK|XXX' \
    . 2>/dev/null \
    | head -n 300 || true

echo

echo "============================================================"
echo "13. EMPTY DIRECTORIES"
echo "============================================================"

find packages \
    -type d \
    -empty \
    2>/dev/null \
    | sort || true

echo

echo "============================================================"
echo "14. LARGE FILES (> 1 MB)"
echo "============================================================"

find . \
    -type f \
    -size +1M \
    ! -path './.git/*' \
    ! -path './node_modules/*' \
    2>/dev/null \
    -exec du -h {} \; \
    | sort -h

echo

echo "============================================================"
echo "15. GIT STATISTICS"
echo "============================================================"

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "Tracked files:"
    git ls-files | wc -l

    echo
    echo "Tracked TypeScript files:"
    git ls-files '*.ts' '*.tsx' | wc -l

    echo
    echo "Tracked Markdown files:"
    git ls-files '*.md' '*.mdx' | wc -l
fi

echo

echo "============================================================"
echo "16. TOOLCHAIN"
echo "============================================================"

command -v node >/dev/null 2>&1 \
    && echo "Node: $(node --version)" \
    || echo "Node: not found"

command -v npm >/dev/null 2>&1 \
    && echo "npm:  $(npm --version)" \
    || echo "npm: not found"

command -v pnpm >/dev/null 2>&1 \
    && echo "pnpm: $(pnpm --version)" \
    || echo "pnpm: not found"

command -v yarn >/dev/null 2>&1 \
    && echo "yarn: $(yarn --version)" \
    || echo "yarn: not found"

echo

echo "============================================================"
echo "17. ROOT PACKAGE.JSON"
echo "============================================================"

if [ -f package.json ]; then
    node - <<'NODE'
const fs = require("fs");

const pkg = JSON.parse(
    fs.readFileSync("package.json", "utf8")
);

console.log("name:", pkg.name ?? "(none)");
console.log("version:", pkg.version ?? "(none)");
console.log("private:", pkg.private ?? "(none)");
console.log(
    "packageManager:",
    pkg.packageManager ?? "(none)"
);

console.log(
    "workspaces:",
    JSON.stringify(pkg.workspaces ?? [], null, 2)
);

console.log("\nscripts:");

for (const [name, command] of Object.entries(pkg.scripts ?? {})) {
    console.log(`  ${name}: ${command}`);
}
NODE
else
    echo "Root package.json not found."
fi

echo

echo "============================================================"
echo " INSPECTION COMPLETE"
echo "============================================================"

echo
echo "Repository: $ROOT"
echo
echo "No repository files were modified."
echo
