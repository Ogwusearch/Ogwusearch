import { defineConfig, type Plugin } from "vite";
import { execFile } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const WORKSPACE_ROOT = "/home/ogwu/workspace/ogwusearch";

interface CommandResult {
  readonly ok: boolean;
  readonly output: string;
  readonly error?: string;
}

async function runCommand(
  command: string,
  args: readonly string[],
): Promise<CommandResult> {
  try {
    const result = await execFileAsync(command, [...args], {
      cwd: WORKSPACE_ROOT,
      timeout: 120_000,
      maxBuffer: 10 * 1024 * 1024,
    });

    return {
      ok: true,
      output: result.stdout.trim(),
    };
  } catch (error) {
    const err = error as {
      stdout?: string;
      stderr?: string;
      message?: string;
    };

    return {
      ok: false,
      output: err.stdout?.trim() ?? "",
      error: err.stderr?.trim() ?? err.message ?? "Command failed",
    };
  }
}

function readJsonFile(path: string): Record<string, unknown> | null {
  try {
    if (!existsSync(path)) {
      return null;
    }

    return JSON.parse(readFileSync(path, "utf8")) as Record<
      string,
      unknown
    >;
  } catch {
    return null;
  }
}

function directoryNames(path: string): string[] {
  if (!existsSync(path)) {
    return [];
  }

  try {
    return readdirSync(path, {
      withFileTypes: true,
    })
      .filter((entry) => entry.isDirectory())
      .filter((entry) => !entry.name.startsWith("."))
      .filter((entry) => entry.name !== "node_modules")
      .map((entry) => entry.name)
      .sort();
  } catch {
    return [];
  }
}

function workspaceApiPlugin(): Plugin {
  return {
    name: "ogwusearch-local-workspace-api",

    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (!request.url?.startsWith("/api/workspace")) {
          next();
          return;
        }

        response.setHeader("Content-Type", "application/json");

        const url = new URL(
          request.url,
          "http://127.0.0.1:4173",
        );

        const runChecks =
          url.searchParams.get("checks") === "true";

        const git = await runCommand("git", [
          "status",
          "--short",
        ]);

        const branch = await runCommand("git", [
          "branch",
          "--show-current",
        ]);

        const commit = await runCommand("git", [
          "rev-parse",
          "--short",
          "HEAD",
        ]);

        const rootPackage = readJsonFile(
          join(WORKSPACE_ROOT, "package.json"),
        );

        const projectsPath = join(
          WORKSPACE_ROOT,
          "projects",
        );

        const packagesPath = join(
          WORKSPACE_ROOT,
          "packages",
        );

        const servicesPath = join(
          WORKSPACE_ROOT,
          "services",
        );

        const projects = directoryNames(projectsPath);
        const packages = directoryNames(packagesPath);
        const services = directoryNames(servicesPath);

        const projectDetails = projects.map((name) => {
          const projectRoot = join(
            projectsPath,
            name,
          );

          const packageJson = readJsonFile(
            join(projectRoot, "package.json"),
          );

          return {
            name,
            path: projectRoot,
            packageName:
              typeof packageJson?.name === "string"
                ? packageJson.name
                : name,
            version:
              typeof packageJson?.version === "string"
                ? packageJson.version
                : null,
            hasPackageJson:
              existsSync(join(projectRoot, "package.json")),
            hasSource:
              existsSync(join(projectRoot, "src")),
            hasReadme:
              existsSync(join(projectRoot, "README.md")),
          };
        });

        const packageDetails = packages.map((name) => {
          const packageRoot = join(
            packagesPath,
            name,
          );

          const packageJson = readJsonFile(
            join(packageRoot, "package.json"),
          );

          return {
            name,
            path: packageRoot,
            packageName:
              typeof packageJson?.name === "string"
                ? packageJson.name
                : name,
            version:
              typeof packageJson?.version === "string"
                ? packageJson.version
                : null,
          };
        });

        let tests: CommandResult | null = null;
        let build: CommandResult | null = null;
        let typecheck: CommandResult | null = null;

        if (runChecks) {
          typecheck = await runCommand("pnpm", [
            "-r",
            "--if-present",
            "typecheck",
          ]);

          tests = await runCommand("pnpm", [
            "-r",
            "--if-present",
            "test",
          ]);

          build = await runCommand("pnpm", [
            "-r",
            "--if-present",
            "build",
          ]);
        }

        const solarAuditPath = join(
          projectsPath,
          "SolarAudit",
        );

        const solarAuditPackage = readJsonFile(
          join(solarAuditPath, "package.json"),
        );

        const responseBody = {
          generatedAt: new Date().toISOString(),

          workspace: {
            root: WORKSPACE_ROOT,
            exists: existsSync(WORKSPACE_ROOT),
            packageName:
              typeof rootPackage?.name === "string"
                ? rootPackage.name
                : null,
          },

          git: {
            branch: branch.output || null,
            commit: commit.output || null,
            dirty:
              git.ok &&
              git.output.length > 0,
            changes: git.output
              ? git.output
                  .split("\n")
                  .filter(Boolean)
              : [],
          },

          projects: {
            count: projects.length,
            names: projects,
            details: projectDetails,
          },

          packages: {
            count: packages.length,
            names: packages,
            details: packageDetails,
          },

          services: {
            count: services.length,
            names: services,
          },

          solarAudit: {
            exists: existsSync(solarAuditPath),
            packageName:
              typeof solarAuditPackage?.name === "string"
                ? solarAuditPackage.name
                : null,
            version:
              typeof solarAuditPackage?.version === "string"
                ? solarAuditPackage.version
                : null,
            hasSource:
              existsSync(join(solarAuditPath, "src")),
            hasTests:
              existsSync(join(solarAuditPath, "test")) ||
              existsSync(join(solarAuditPath, "tests")),
          },

          checks: {
            executed: runChecks,

            typecheck: typecheck
              ? {
                  ok: typecheck.ok,
                  output: typecheck.output,
                  error: typecheck.error ?? null,
                }
              : null,

            tests: tests
              ? {
                  ok: tests.ok,
                  output: tests.output,
                  error: tests.error ?? null,
                }
              : null,

            build: build
              ? {
                  ok: build.ok,
                  output: build.output,
                  error: build.error ?? null,
                }
              : null,
          },
        };

        response.end(
          JSON.stringify(responseBody, null, 2),
        );
      });
    },
  };
}

export default defineConfig({
  plugins: [workspaceApiPlugin()],

  server: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true,
  },

  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true,
  },

  resolve: {
    alias: {
      "@workspace": resolve(
        dirname(new URL(import.meta.url).pathname),
      ),
    },
  },
});