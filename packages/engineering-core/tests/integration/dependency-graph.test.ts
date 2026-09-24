import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  describe,
  expect,
  it,
} from "vitest";

const currentDirectory = dirname(
  fileURLToPath(import.meta.url),
);

const root = resolve(
  currentDirectory,
  "../../../..",
);

const packages = [
  "engineering-types",
  "engineering-units",
  "engineering-validation",
  "engineering-core",
] as const;

type PackageName = (typeof packages)[number];

interface PackageJson {
  readonly dependencies?: Readonly<
    Record<string, string>
  >;

  readonly peerDependencies?: Readonly<
    Record<string, string>
  >;
}

function readWorkspaceDependencies(
  packageName: PackageName,
): PackageName[] {
  const packagePath = resolve(
    root,
    "packages",
    packageName,
    "package.json",
  );

  const packageJson = JSON.parse(
    readFileSync(packagePath, "utf8"),
  ) as PackageJson;

  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.peerDependencies,
  };

  return packages.filter((candidate) =>
    Boolean(
      dependencies[
        `@ogwusearch/${candidate}`
      ],
    ),
  );
}

function assertAcyclic(): void {
  const visiting = new Set<PackageName>();
  const visited = new Set<PackageName>();

  function visit(
    packageName: PackageName,
  ): void {
    if (visiting.has(packageName)) {
      throw new Error(
        `Dependency cycle detected at ${packageName}`,
      );
    }

    if (visited.has(packageName)) {
      return;
    }

    visiting.add(packageName);

    for (const dependency of readWorkspaceDependencies(
      packageName,
    )) {
      visit(dependency);
    }

    visiting.delete(packageName);
    visited.add(packageName);
  }

  for (const packageName of packages) {
    visit(packageName);
  }
}

describe("foundation dependency graph", () => {
  it("contains no dependency cycle", () => {
    expect(() => assertAcyclic()).not.toThrow();
  });
});