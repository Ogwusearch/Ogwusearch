export interface WorkspaceProject {
  readonly name: string;
  readonly path: string;
  readonly packageName: string;
  readonly version: string | null;
  readonly hasPackageJson: boolean;
  readonly hasSource: boolean;
  readonly hasReadme: boolean;
}

export interface WorkspacePackage {
  readonly name: string;
  readonly path: string;
  readonly packageName: string;
  readonly version: string | null;
}

export interface CommandCheck {
  readonly ok: boolean;
  readonly output: string;
  readonly error: string | null;
}

export interface WorkspaceSnapshot {
  readonly generatedAt: string;

  readonly workspace: {
    readonly root: string;
    readonly exists: boolean;
    readonly packageName: string | null;
  };

  readonly git: {
    readonly branch: string | null;
    readonly commit: string | null;
    readonly dirty: boolean;
    readonly changes: readonly string[];
  };

  readonly projects: {
    readonly count: number;
    readonly names: readonly string[];
    readonly details: readonly WorkspaceProject[];
  };

  readonly packages: {
    readonly count: number;
    readonly names: readonly string[];
    readonly details: readonly WorkspacePackage[];
  };

  readonly services: {
    readonly count: number;
    readonly names: readonly string[];
  };

  readonly solarAudit: {
    readonly exists: boolean;
    readonly packageName: string | null;
    readonly version: string | null;
    readonly hasSource: boolean;
    readonly hasTests: boolean;
  };

  readonly checks: {
    readonly executed: boolean;
    readonly typecheck: CommandCheck | null;
    readonly tests: CommandCheck | null;
    readonly build: CommandCheck | null;
  };
}

export async function getWorkspaceSnapshot(
  runChecks = false,
): Promise<WorkspaceSnapshot> {
  const endpoint = runChecks
    ? "/api/workspace?checks=true"
    : "/api/workspace";

  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Workspace adapter failed: HTTP ${response.status}`,
    );
  }

  return (await response.json()) as WorkspaceSnapshot;
}