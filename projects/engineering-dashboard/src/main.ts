import {
  getWorkspaceSnapshot,
  type WorkspaceSnapshot,
} from "./workspace";

import { bindLoadCalculator, renderLoadCalculator } from "./load-calculator";
import "./styles.css";

let workspace: WorkspaceSnapshot | null = null;
let workspaceLoading = false;
let workspaceError: string | null = null;

function workspaceStatus(): string {
  if (!workspace) {
    return "Loading";
  }

  if (!workspace.workspace.exists) {
    return "Unavailable";
  }

  return "Healthy";
}

function workspaceCheckStatus(
  check:
    | {
        readonly ok: boolean;
      }
    | null,
): string {
  if (!check) {
    return "Not checked";
  }

  return check.ok ? "Passed" : "Failed";
}

function realProjectCount(): string {
  return workspace
    ? String(workspace.projects.count).padStart(2, "0")
    : "--";
}

function realPackageCount(): string {
  return workspace
    ? String(workspace.packages.count).padStart(2, "0")
    : "--";
}


import "./styles.css";

type Page =
  | "dashboard"
  | "projects"
  | "solaraudit"
  | "calculations"
  | "tools"
  | "reports"
  | "workspace"
  | "documentation"
  | "settings";

const navigation: ReadonlyArray<{
  readonly page: Page;
  readonly label: string;
  readonly icon: string;
}> = [
  {
    page: "dashboard",
    label: "Dashboard",
    icon: "grid",
  },
  {
    page: "projects",
    label: "Projects",
    icon: "folder",
  },
  {
    page: "solaraudit",
    label: "SolarAudit",
    icon: "solar",
  },
  {
    page: "calculations",
    label: "Calculations",
    icon: "calculator",
  },
  {
    page: "tools",
    label: "Engineering Tools",
    icon: "tools",
  },
  {
    page: "reports",
    label: "Reports",
    icon: "report",
  },
];

const utilityNavigation: ReadonlyArray<{
  readonly page: Page;
  readonly label: string;
  readonly icon: string;
}> = [
  {
    page: "workspace",
    label: "Workspace",
    icon: "database",
  },
  {
    page: "documentation",
    label: "Documentation",
    icon: "book",
  },
  {
    page: "settings",
    label: "Settings",
    icon: "settings",
  },
];



const icons: Record<string, string> = {
  grid: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  `,

  folder: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.5 6.5h6l2 2h9v9.5a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2V6.5Z"/>
      <path d="M2.5 9h18"/>
    </svg>
  `,

  solar: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3.5"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>
    </svg>
  `,

  calculator: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="2.5" width="14" height="19" rx="2"/>
      <path d="M8 6h8M8 10h2M14 10h2M8 14h2M14 14h2M8 18h2M14 18h2"/>
    </svg>
  `,

  tools: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m14.7 6.3 3-3a5 5 0 0 0-6.1 6.1L4.1 16.9a2.2 2.2 0 1 0 3.1 3.1l7.5-7.5a5 5 0 0 0 6.1-6.1l-3 3-3.1-1-1-3.1Z"/>
    </svg>
  `,

  report: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 3h9l4 4v14H6z"/>
      <path d="M15 3v5h5M9 13h6M9 17h6M9 9h2"/>
    </svg>
  `,

  database: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="7" ry="3"/>
      <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/>
      <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7"/>
    </svg>
  `,

  book: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5v-17Z"/>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M8 6h8M8 10h8"/>
    </svg>
  `,

  settings: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/>
      <path d="m19 13.5 1.3 1-.1 1.7-1.6 1-1.8-.6-1.2.8-.3 1.9-1.6.7-1.4-1.3h-1.6l-1.4 1.3-1.6-.7-.3-1.9-1.2-.8-1.8.6-1.6-1 .1-1.7 1.3-1v-1.5l-1.3-1 .1-1.7 1.6-1 1.8.6 1.2-.8.3-1.9L10 4.5l1.4 1.3H13l1.4-1.3 1.6.7.3 1.9 1.2.8 1.8-.6 1.6 1-.1 1.7-1.3 1Z"/>
    </svg>
  `,

  search: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.3"/>
      <path d="m16 16 5 5"/>
    </svg>
  `,

  bell: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>
    </svg>
  `,

  menu: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16"/>
    </svg>
  `,

  close: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18"/>
    </svg>
  `,

  arrow: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  `,

  plus: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  `,

  check: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4 4L19 6"/>
    </svg>
  `,

  warning: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 2.8 20h18.4L12 3Z"/>
      <path d="M12 9v5M12 17.5v.1"/>
    </svg>
  `,

  bolt: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z"/>
    </svg>
  `,

  refresh: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 11a8 8 0 0 0-14.9-3M4 5v4h4M4 13a8 8 0 0 0 14.9 3M20 19v-4h-4"/>
    </svg>
  `,
};

function icon(name: string): string {
  return icons[name] ?? "";
}


function currentPage(): Page {
  const hash = window.location.hash.replace("#/", "");

  const validPages: readonly Page[] = [
    "dashboard",
    "projects",
    "solaraudit",
    "calculations",
    "tools",
    "reports",
    "workspace",
    "documentation",
    "settings",
  ];

  return validPages.includes(hash as Page)
    ? (hash as Page)
    : "dashboard";
}

function navigate(page: Page): void {
  window.location.hash = `/${page}`;
}

function renderSidebar(page: Page): string {
  const primary = navigation
    .map(
      (item) => `
        <button
          class="nav-item ${page === item.page ? "active" : ""}"
          data-page="${item.page}"
          type="button"
        >
          <span class="nav-icon">${icon(item.icon)}</span>
          <span>${item.label}</span>
        </button>
      `,
    )
    .join("");

  const utility = utilityNavigation
    .map(
      (item) => `
        <button
          class="nav-item ${page === item.page ? "active" : ""}"
          data-page="${item.page}"
          type="button"
        >
          <span class="nav-icon">${icon(item.icon)}</span>
          <span>${item.label}</span>
        </button>
      `,
    )
    .join("");

  const localStatus = workspace
    ? workspace.workspace.exists
      ? "Workspace connected"
      : "Workspace unavailable"
    : workspaceLoading
      ? "Reading workspace..."
      : "Workspace not loaded";

  return `
    <aside class="sidebar" id="sidebar">
      <div class="brand">
        <div class="brand-mark">O</div>

        <div class="brand-copy">
          <strong>Ogwusearch</strong>
          <span>Engineering</span>
        </div>

        <button
          class="mobile-close"
          id="mobile-close"
          type="button"
          aria-label="Close navigation"
        >
          ${icon("close")}
        </button>
      </div>

      <div class="workspace-switcher">
        <div class="workspace-symbol">
          ${icon("bolt")}
        </div>

        <div class="workspace-copy">
          <span>LOCAL WORKSPACE</span>
          <strong>Engineering</strong>
        </div>

        <span
          class="workspace-dot ${
            workspace?.workspace.exists ? "" : "offline"
          }"
        ></span>
      </div>

      <div class="nav-section">
        <span class="nav-heading">ENGINEERING</span>
        ${primary}
      </div>

      <div class="nav-section utility-section">
        <span class="nav-heading">WORKSPACE</span>
        ${utility}
      </div>

      <div class="sidebar-bottom">
        <div class="system-card">
          <div class="system-top">
            <span
              class="system-status-dot ${
                workspace?.workspace.exists ? "" : "offline"
              }"
            ></span>

            <span>Local system</span>
          </div>

          <strong>${localStatus}</strong>

          <small>
            ${
              workspace?.workspace.root ??
              "/home/ogwu/workspace/ogwusearch"
            }
          </small>
        </div>

        <div class="sidebar-footer">
          <span>Ogwusearch Engineering</span>
          <span>v0.1.0</span>
        </div>
      </div>
    </aside>

    <div class="sidebar-overlay" id="sidebar-overlay"></div>
  `;
}

function renderTopbar(page: Page): string {
  const labels: Record<Page, string> = {
    dashboard: "Dashboard",
    projects: "Projects",
    solaraudit: "SolarAudit",
    calculations: "Calculations",
    tools: "Engineering Tools",
    reports: "Reports",
    workspace: "Workspace",
    documentation: "Documentation",
    settings: "Settings",
  };

  return `
    <header class="topbar">
      <div class="topbar-left">
        <button
          class="menu-button"
          id="menu-button"
          type="button"
          aria-label="Open navigation"
        >
          ${icon("menu")}
        </button>

        <div class="breadcrumbs">
          <span>Engineering</span>
          <span class="breadcrumb-separator">/</span>
          <strong>${labels[page]}</strong>
        </div>
      </div>

      <div class="topbar-actions">
        <button
          class="search-button"
          id="search-button"
          type="button"
        >
          <span class="search-icon">${icon("search")}</span>
          <span>Search</span>
          <kbd>Ctrl K</kbd>
        </button>

        <button
          class="icon-button"
          id="notification-button"
          type="button"
          aria-label="Notifications"
        >
          ${icon("bell")}
          <span class="notification-dot"></span>
        </button>

        <div class="profile">
          <div class="profile-avatar">O</div>

          <div class="profile-copy">
            <strong>Ogwusearch</strong>
            <span>Local Developer</span>
          </div>
        </div>
      </div>
    </header>
  `;
}

function statCard(
  label: string,
  value: string,
  detail: string,
  iconName: string,
  tone: string,
): string {
  return `
    <article class="stat-card">
      <div class="stat-icon ${tone}">
        ${icon(iconName)}
      </div>

      <div class="stat-content">
        <span>${label}</span>
        <strong>${value}</strong>
        <small>${detail}</small>
      </div>
    </article>
  `;
}

function renderProjectRows(): string {
  if (workspaceLoading && !workspace) {
    return `
      <tr>
        <td colspan="4">
          <div class="empty-state">
            Reading local projects...
          </div>
        </td>
      </tr>
    `;
  }

  if (workspaceError && !workspace) {
    return `
      <tr>
        <td colspan="4">
          <div class="empty-state">
            ${workspaceError}
          </div>
        </td>
      </tr>
    `;
  }

  if (!workspace) {
    return `
      <tr>
        <td colspan="4">
          <div class="empty-state">
            Workspace data is not available.
          </div>
        </td>
      </tr>
    `;
  }

  if (workspace.projects.details.length === 0) {
    return `
      <tr>
        <td colspan="4">
          <div class="empty-state">
            No projects detected in the local workspace.
          </div>
        </td>
      </tr>
    `;
  }

  return workspace.projects.details
    .map(
      (project) => `
        <tr>
          <td>
            <div class="table-primary">
              <div class="table-project-icon">
                ${icon("folder")}
              </div>

              <div>
                <strong>${project.name}</strong>

                <span>
                  ${
                    project.packageName ||
                    "Local project"
                  }
                </span>
              </div>
            </div>
          </td>

          <td>
            <span
              class="status ${
                project.hasSource
                  ? "active"
                  : "warning"
              }"
            >
              ${
                project.hasSource
                  ? "Detected"
                  : "No src"
              }
            </span>
          </td>

          <td>
            ${
              project.version
                ? `v${project.version}`
                : "—"
            }
          </td>

          <td>
            <button
              class="table-action"
              type="button"
              data-action="open-project"
              data-project="${project.name}"
              aria-label="Open ${project.name}"
            >
              ${icon("arrow")}
            </button>
          </td>
        </tr>
      `,
    )
    .join("");
}

function renderCalculationRows(): string {
  return `
    <tr>
      <td>
        <div class="calculation-name">
          <strong>Calculation registry</strong>
          <span>Engineering Core</span>
        </div>
      </td>

      <td>
        <span class="status draft">
          Not connected
        </span>
      </td>

      <td>
        Local integration pending
      </td>
    </tr>
  `;
}

function renderPipeline(): string {
  const solarAuditExists =
    workspace?.solarAudit.exists === true;

  const nodes: ReadonlyArray<
    readonly [string, string, boolean]
  > = [
    [
      "Load Audit",
      solarAuditExists ? "Available" : "Waiting",
      solarAuditExists,
    ],
    [
      "Energy Analysis",
      solarAuditExists ? "Available" : "Waiting",
      solarAuditExists,
    ],
    [
      "Peak Demand",
      solarAuditExists ? "Available" : "Waiting",
      solarAuditExists,
    ],
    [
      "PV Sizing",
      "Engine module",
      false,
    ],
    [
      "PV Array",
      "Engine module",
      false,
    ],
    [
      "PV String",
      "Engine module",
      false,
    ],
    [
      "Battery",
      "Engine module",
      false,
    ],
    [
      "Inverter",
      "Engine module",
      false,
    ],
  ];

  return `
    <div class="pipeline">
      ${nodes
        .map(
          ([name, state, available], index) => `
            <div class="pipeline-node">
              <div
                class="pipeline-number ${
                  available ? "complete" : ""
                }"
              >
                ${
                  available
                    ? icon("check")
                    : index + 1
                }
              </div>

              <div class="pipeline-copy">
                <strong>${name}</strong>
                <span>${state}</span>
              </div>

              ${
                index < nodes.length - 1
                  ? `
                    <div class="pipeline-arrow">
                      ${icon("arrow")}
                    </div>
                  `
                  : ""
              }
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderDashboard(): string {
  const projectCount = realProjectCount();
  const packageCount = realPackageCount();

  const solarAuditReady =
    workspace?.solarAudit.exists === true;

  const workspaceState =
    workspaceStatus();

  const healthScore = workspace
    ? workspace.git.dirty
      ? "92"
      : "100"
    : "--";

  const healthDescription = workspace
    ? `${workspace.projects.count} projects, ${workspace.packages.count} packages and ${workspace.services.count} services detected locally.`
    : workspaceLoading
      ? "Connecting to the local workspace adapter..."
      : workspaceError ??
        "Workspace information is unavailable.";

  return `
    <section class="page dashboard-page">
      <div class="page-header">
        <div>
          <span class="eyebrow">
            LOCAL ENGINEERING WORKSPACE
          </span>

          <h1>
            Good morning, Ogwusearch.
          </h1>

          <p>
            Your local engineering workspace is connected directly
            to the Ogwusearch Engineering repository.
          </p>
        </div>

        <div class="header-actions">
          <button
            class="button secondary"
            type="button"
            data-action="open-solar"
          >
            ${icon("solar")}
            Open SolarAudit
          </button>

          <button
            class="button primary"
            type="button"
            data-action="new-project"
          >
            ${icon("plus")}
            New Project
          </button>
        </div>
      </div>

      ${
        workspaceError
          ? `
            <section class="panel">
              <div class="empty-state">
                <strong>
                  Workspace adapter error
                </strong>

                <span>
                  ${workspaceError}
                </span>
              </div>
            </section>
          `
          : ""
      }

      <div class="stats-grid">
        ${statCard(
          "Projects",
          projectCount,
          workspace
            ? `${workspace.projects.names.length} detected locally`
            : "Reading workspace...",
          "folder",
          "gold",
        )}

        ${statCard(
          "Packages",
          packageCount,
          workspace
            ? "Engineering packages detected"
            : "Reading workspace...",
          "database",
          "blue",
        )}

        ${statCard(
          "SolarAudit",
          solarAuditReady
            ? "Ready"
            : "--",
          solarAuditReady
            ? "Project detected locally"
            : workspace
              ? "Not detected"
              : "Reading workspace...",
          "solar",
          "green",
        )}

        ${statCard(
          "Workspace",
          workspaceState,
          workspace
            ? workspace.git.dirty
              ? "Git working tree has changes"
              : "Git working tree clean"
            : "Reading local repository...",
          "check",
          "pink",
        )}
      </div>

      <div class="dashboard-grid">
        <section class="panel pipeline-panel">
          <div class="panel-header">
            <div>
              <span class="panel-kicker">
                SOLARAUDIT ENGINE
              </span>

              <h2>
                Calculation Pipeline
              </h2>
            </div>

            <button
              class="panel-link"
              type="button"
              data-page="solaraudit"
            >
              View audit
              ${icon("arrow")}
            </button>
          </div>

          <p class="panel-description">
            The dashboard reports the local SolarAudit project and
            existing engine modules without duplicating engineering
            formulas or calculation logic.
          </p>

          ${renderPipeline()}

          <div class="pipeline-footer">
            <div class="health-indicator">
              <span class="health-dot"></span>

              ${
                solarAuditReady
                  ? "SolarAudit detected locally"
                  : "SolarAudit not detected"
              }
            </div>

            <span class="muted-text">
              Local execution
            </span>
          </div>
        </section>

        <section class="panel health-panel">
          <div class="panel-header">
            <div>
              <span class="panel-kicker">
                REAL WORKSPACE
              </span>

              <h2>
                Workspace Health
              </h2>
            </div>

            <button
              class="icon-button small"
              type="button"
              data-action="refresh"
              aria-label="Refresh workspace"
            >
              ${icon("refresh")}
            </button>
          </div>

          <div class="health-score">
            <div class="health-ring">
              <div>
                <strong>${healthScore}</strong>
                <span>/ 100</span>
              </div>
            </div>

            <div class="health-summary">
              <strong>
                ${workspaceState}
              </strong>

              <p>
                ${healthDescription}
              </p>
            </div>
          </div>

          <div class="health-list">
            <div>
              <span>
                <i class="health-dot"></i>
                Git
              </span>

              <strong>
                ${
                  workspace
                    ? workspace.git.branch ??
                      "Unknown"
                    : "Loading"
                }
              </strong>
            </div>

            <div>
              <span>
                <i class="health-dot"></i>
                TypeScript
              </span>

              <strong>
                ${workspaceCheckStatus(
                  workspace?.checks.typecheck ??
                    null,
                )}
              </strong>
            </div>

            <div>
              <span>
                <i class="health-dot"></i>
                Tests
              </span>

              <strong>
                ${workspaceCheckStatus(
                  workspace?.checks.tests ??
                    null,
                )}
              </strong>
            </div>

            <div>
              <span>
                <i class="health-dot"></i>
                Build
              </span>

              <strong>
                ${workspaceCheckStatus(
                  workspace?.checks.build ??
                    null,
                )}
              </strong>
            </div>
          </div>
        </section>
      </div>

      <div class="dashboard-grid lower-grid">
        <section class="panel table-panel">
          <div class="panel-header">
            <div>
              <span class="panel-kicker">
                REAL FILESYSTEM
              </span>

              <h2>
                Local Projects
              </h2>
            </div>

            <button
              class="panel-link"
              type="button"
              data-page="projects"
            >
              View all
              ${icon("arrow")}
            </button>
          </div>

          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Version</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                ${renderProjectRows()}
              </tbody>
            </table>
          </div>
        </section>

        <section class="panel quick-panel">
          <div class="panel-header">
            <div>
              <span class="panel-kicker">
                WORKSPACE ACTIONS
              </span>

              <h2>
                Quick Actions
              </h2>
            </div>
          </div>

          <div class="quick-actions">
            <button
              type="button"
              class="quick-action"
              data-action="refresh"
            >
              <span class="quick-icon gold">
                ${icon("refresh")}
              </span>

              <span>
                <strong>
                  Refresh Workspace
                </strong>

                <small>
                  Read the local filesystem again
                </small>
              </span>

              ${icon("arrow")}
            </button>

            <button
              type="button"
              class="quick-action"
              data-action="run-checks"
            >
              <span class="quick-icon green">
                ${icon("check")}
              </span>

              <span>
                <strong>
                  Run Checks
                </strong>

                <small>
                  Typecheck, tests and build
                </small>
              </span>

              ${icon("arrow")}
            </button>

            <button
              type="button"
              class="quick-action"
              data-page="workspace"
            >
              <span class="quick-icon blue">
                ${icon("database")}
              </span>

              <span>
                <strong>
                  Inspect Workspace
                </strong>

                <small>
                  Packages, Git and SolarAudit status
                </small>
              </span>

              ${icon("arrow")}
            </button>

            <button
              type="button"
              class="quick-action"
              data-page="documentation"
            >
              <span class="quick-icon pink">
                ${icon("book")}
              </span>

              <span>
                <strong>
                  Documentation
                </strong>

                <small>
                  Review engineering architecture
                </small>
              </span>

              ${icon("arrow")}
            </button>
          </div>
        </section>
      </div>

      <section class="panel table-panel recent-calculations">
        <div class="panel-header">
          <div>
            <span class="panel-kicker">
              ENGINEERING CORE
            </span>

            <h2>
              Calculation Registry
            </h2>
          </div>

          <button
            class="panel-link"
            type="button"
            data-page="calculations"
          >
            View calculations
            ${icon("arrow")}
          </button>
        </div>

        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Calculation</th>
                <th>Status</th>
                <th>Information</th>
              </tr>
            </thead>

            <tbody>
              ${renderCalculationRows()}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  `;
}

function featurePage(
  title: string,
  kicker: string,
  description: string,
  items: ReadonlyArray<{
    readonly title: string;
    readonly description: string;
    readonly icon: string;
    readonly action: string;
  }>,
): string {
  return `
    <section class="page">
      <div class="page-header">
        <div>
          <span class="eyebrow">${kicker}</span>

          <h1>${title}</h1>

          <p>${description}</p>
        </div>
      </div>

      <div class="feature-grid">
        ${items
          .map(
            (item) => `
              <article class="feature-card">
                <div class="feature-icon">
                  ${icon(item.icon)}
                </div>

                <div class="feature-card-content">
                  <h2>${item.title}</h2>

                  <p>
                    ${item.description}
                  </p>

                  <button
                    type="button"
                    class="feature-action"
                    data-action="${item.action}"
                  >
                    Open
                    ${icon("arrow")}
                  </button>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderProjectsPage(): string {
  const count = workspace
    ? workspace.projects.count
    : 0;

  return `
    <section class="page">
      <div class="page-header">
        <div>
          <span class="eyebrow">
            REAL FILESYSTEM
          </span>

          <h1>
            Projects
          </h1>

          <p>
            Projects detected directly from the local
            Ogwusearch Engineering workspace.
          </p>
        </div>

        <button
          class="button secondary"
          type="button"
          data-action="refresh"
        >
          ${icon("refresh")}
          Refresh
        </button>
      </div>

      <section class="panel table-panel">
        <div class="panel-header">
          <div>
            <span class="panel-kicker">
              LOCAL PROJECTS
            </span>

            <h2>
              Project Registry
            </h2>
          </div>

          <span class="local-badge">
            ${count} DETECTED
          </span>
        </div>

        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Version</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              ${renderProjectRows()}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  `;
}

function renderSolarAuditPage(): string {
  const exists =
    workspace?.solarAudit.exists === true;

  const packageName =
    workspace?.solarAudit.packageName ??
    "@ogwusearch/solar-audit";

  const version =
    workspace?.solarAudit.version;

  const source =
    workspace?.solarAudit.hasSource === true;

  const tests =
    workspace?.solarAudit.hasTests === true;

  return `
    <section class="page">
      <div class="page-header">
        <div>
          <span class="eyebrow">
            SOLAR ENGINEERING
          </span>

          <h1>
            SolarAudit
          </h1>

          <p>
            Local SolarAudit project status backed by the real
            Ogwusearch Engineering workspace.
          </p>
        </div>

        <button
          class="button primary"
          type="button"
          data-action="run-checks"
        >
          ${icon("refresh")}
          Run Checks
        </button>
      </div>

      <section class="panel audit-overview">
        <div class="audit-title">
          <div class="audit-icon">
            ${icon("solar")}
          </div>

          <div>
            <span class="panel-kicker">
              LOCAL PROJECT
            </span>

            <h2>
              ${packageName}
            </h2>

            <p>
              ${
                version
                  ? `Version ${version}`
                  : "Version unavailable"
              }
            </p>
          </div>
        </div>

        <div class="audit-status">
          <span
            class="status ${
              exists
                ? "active"
                : "warning"
            }"
          >
            ${
              exists
                ? "Detected"
                : "Missing"
            }
          </span>

          <span>
            ${
              source
                ? "Source present"
                : "Source unavailable"
            }
          </span>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <span class="panel-kicker">
              PROJECT STATUS
            </span>

            <h2>
              SolarAudit Components
            </h2>
          </div>
        </div>

        <div class="audit-pipeline">
          <div
            class="audit-step ${
              exists ? "complete" : ""
            }"
          >
            <span class="audit-step-icon">
              ${
                exists
                  ? icon("check")
                  : icon("warning")
              }
            </span>

            <div>
              <strong>
                Project
              </strong>

              <span>
                ${
                  exists
                    ? "Detected"
                    : "Missing"
                }
              </span>
            </div>
          </div>

          <div
            class="audit-step ${
              source ? "complete" : ""
            }"
          >
            <span class="audit-step-icon">
              ${
                source
                  ? icon("check")
                  : icon("warning")
              }
            </span>

            <div>
              <strong>
                Source
              </strong>

              <span>
                ${
                  source
                    ? "Present"
                    : "Missing"
                }
              </span>
            </div>
          </div>

          <div
            class="audit-step ${
              tests ? "complete" : ""
            }"
          >
            <span class="audit-step-icon">
              ${
                tests
                  ? icon("check")
                  : icon("warning")
              }
            </span>

            <div>
              <strong>
                Tests
              </strong>

              <span>
                ${
                  tests
                    ? "Test files detected"
                    : "Test files not detected"
                }
              </span>
            </div>
          </div>

          <div
            class="audit-step ${
              workspace?.checks.typecheck?.ok
                ? "complete"
                : ""
            }"
          >
            <span class="audit-step-icon">
              ${
                workspace?.checks.typecheck?.ok
                  ? icon("check")
                  : icon("bolt")
              }
            </span>

            <div>
              <strong>
                Typecheck
              </strong>

              <span>
                ${workspaceCheckStatus(
                  workspace?.checks.typecheck ??
                    null,
                )}
              </span>
            </div>
          </div>

          <div
            class="audit-step ${
              workspace?.checks.tests?.ok
                ? "complete"
                : ""
            }"
          >
            <span class="audit-step-icon">
              ${
                workspace?.checks.tests?.ok
                  ? icon("check")
                  : icon("bolt")
              }
            </span>

            <div>
              <strong>
                Tests
              </strong>

              <span>
                ${workspaceCheckStatus(
                  workspace?.checks.tests ??
                    null,
                )}
              </span>
            </div>
          </div>

          <div
            class="audit-step ${
              workspace?.checks.build?.ok
                ? "complete"
                : ""
            }"
          >
            <span class="audit-step-icon">
              ${
                workspace?.checks.build?.ok
                  ? icon("check")
                  : icon("bolt")
              }
            </span>

            <div>
              <strong>
                Build
              </strong>

              <span>
                ${workspaceCheckStatus(
                  workspace?.checks.build ??
                    null,
                )}
              </span>
            </div>
          </div>
        </div>
      </section>
    </section>
  `;
}

function renderCalculationsPage(): string {
  return `
    <section class="page">
      <div class="page-header">
        <div>
          <span class="eyebrow">ENGINEERING CORE</span>
          <h1>Calculations</h1>
          <p>
            Run calculations through the existing Ogwusearch
            engineering calculation engines.
          </p>
        </div>
      </div>

      ${renderLoadCalculator()}
    </section>
  `;
}

function renderToolsPage(): string {
  return featurePage(
    "Engineering Tools",
    "ENGINEERING TOOLS",
    "A shared tool layer built on Engineering Core. Tools consume the same validated formulas and units as SolarAudit.",
    [
      {
        title: "Solar Calculator",
        description:
          "Solar power and energy calculations.",
        icon: "solar",
        action: "tool-solar",
      },
      {
        title: "Battery Calculator",
        description:
          "Battery capacity, energy and reserve calculations.",
        icon: "bolt",
        action: "tool-battery",
      },
      {
        title: "Inverter Calculator",
        description:
          "Inverter sizing and utilization checks.",
        icon: "bolt",
        action: "tool-inverter",
      },
      {
        title: "Cable Calculator",
        description:
          "Cable sizing and voltage-drop calculations.",
        icon: "tools",
        action: "tool-cable",
      },
      {
        title: "Voltage Drop",
        description:
          "Electrical voltage-drop analysis.",
        icon: "bolt",
        action: "tool-voltage",
      },
      {
        title: "Unit Converter",
        description:
          "Shared engineering unit conversions.",
        icon: "calculator",
        action: "tool-units",
      },
    ],
  );
}

function renderReportsPage(): string {
  return featurePage(
    "Reports",
    "ENGINEERING REPORTS",
    "Deterministic report outputs assembled from validated Solar Engine results without introducing new engineering formulas.",
    [
      {
        title: "SolarAudit Report",
        description:
          "Complete solar engineering audit report.",
        icon: "solar",
        action: "report-solar",
      },
      {
        title: "Load Report",
        description:
          "Load, energy and peak-demand results.",
        icon: "report",
        action: "report-load",
      },
      {
        title: "System Design",
        description:
          "PV, battery, inverter and cable design summary.",
        icon: "report",
        action: "report-design",
      },
      {
        title: "Bill of Materials",
        description:
          "Validated BOM and costing output.",
        icon: "report",
        action: "report-bom",
      },
    ],
  );
}

function renderWorkspacePage(): string {
  if (!workspace) {
    return `
      <section class="page">
        <div class="page-header">
          <div>
            <span class="eyebrow">
              LOCAL ENVIRONMENT
            </span>

            <h1>
              Workspace
            </h1>

            <p>
              ${
                workspaceLoading
                  ? "Connecting to the local workspace adapter..."
                  : workspaceError ??
                    "Workspace information is unavailable."
              }
            </p>
          </div>

          <button
            class="button secondary"
            type="button"
            data-action="refresh"
          >
            ${icon("refresh")}
            Refresh
          </button>
        </div>

        <section class="panel loading-panel">
          <span>
            Reading local workspace:
          </span>

          <code>
            /home/ogwu/workspace/ogwusearch
          </code>
        </section>
      </section>
    `;
  }

  return `
    <section class="page">
      <div class="page-header">
        <div>
          <span class="eyebrow">
            REAL LOCAL ENVIRONMENT
          </span>

          <h1>
            Workspace
          </h1>

          <p>
            Live information collected directly from the local
            Ogwusearch Engineering workspace.
          </p>
        </div>

        <div class="header-actions">
          <button
            class="button secondary"
            type="button"
            data-action="refresh"
          >
            ${icon("refresh")}
            Refresh
          </button>

          <button
            class="button primary"
            type="button"
            data-action="run-checks"
          >
            ${icon("check")}
            Run Checks
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <section class="panel">
          <div class="panel-header">
            <div>
              <span class="panel-kicker">
                ROOT
              </span>

              <h2>
                Workspace Location
              </h2>
            </div>

            <span
              class="status ${
                workspace.workspace.exists
                  ? "active"
                  : "warning"
              }"
            >
              ${
                workspace.workspace.exists
                  ? "Connected"
                  : "Unavailable"
              }
            </span>
          </div>

          <div class="path-box">
            ${workspace.workspace.root}
          </div>

          <div class="workspace-stat-list">
            <div>
              <span>
                Projects
              </span>

              <strong>
                ${workspace.projects.count}
              </strong>
            </div>

            <div>
              <span>
                Packages
              </span>

              <strong>
                ${workspace.packages.count}
              </strong>
            </div>

            <div>
              <span>
                Services
              </span>

              <strong>
                ${workspace.services.count}
              </strong>
            </div>

            <div>
              <span>
                Git Branch
              </span>

              <strong>
                ${workspace.git.branch ?? "Unknown"}
              </strong>
            </div>

            <div>
              <span>
                Commit
              </span>

              <strong>
                ${workspace.git.commit ?? "Unknown"}
              </strong>
            </div>

            <div>
              <span>
                Working Tree
              </span>

              <strong>
                ${
                  workspace.git.dirty
                    ? "Modified"
                    : "Clean"
                }
              </strong>
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-header">
            <div>
              <span class="panel-kicker">
                SOLARAUDIT
              </span>

              <h2>
                SolarAudit Status
              </h2>
            </div>

            <span
              class="status ${
                workspace.solarAudit.exists
                  ? "active"
                  : "warning"
              }"
            >
              ${
                workspace.solarAudit.exists
                  ? "Detected"
                  : "Missing"
              }
            </span>
          </div>

          <div class="package-list">
            <div class="package-item">
              <span class="package-status"></span>

              <code>
                ${
                  workspace.solarAudit.packageName ??
                  "SolarAudit"
                }
              </code>

              <span>
                ${
                  workspace.solarAudit.version
                    ? `v${workspace.solarAudit.version}`
                    : "Unknown"
                }
              </span>
            </div>

            <div class="package-item">
              <span class="package-status"></span>

              <code>
                source
              </code>

              <span>
                ${
                  workspace.solarAudit.hasSource
                    ? "Present"
                    : "Missing"
                }
              </span>
            </div>

            <div class="package-item">
              <span class="package-status"></span>

              <code>
                tests
              </code>

              <span>
                ${
                  workspace.solarAudit.hasTests
                    ? "Present"
                    : "Missing"
                }
              </span>
            </div>
          </div>
        </section>
      </div>

      <section class="panel workspace-packages">
        <div class="panel-header">
          <div>
            <span class="panel-kicker">
              REAL FILESYSTEM
            </span>

            <h2>
              Engineering Packages
            </h2>
          </div>

          <span class="local-badge">
            ${workspace.packages.count} DETECTED
          </span>
        </div>

        <div class="package-list">
          ${
            workspace.packages.details.length > 0
              ? workspace.packages.details
                  .map(
                    (pkg) => `
                      <div class="package-item">
                        <span class="package-status"></span>

                        <code>
                          ${pkg.packageName}
                        </code>

                        <span>
                          ${
                            pkg.version
                              ? `v${pkg.version}`
                              : "No version"
                          }
                        </span>
                      </div>
                    `,
                  )
                  .join("")
              : `
                <div class="empty-state">
                  No engineering packages detected.
                </div>
              `
          }
        </div>
      </section>

      <section class="panel workspace-packages">
        <div class="panel-header">
          <div>
            <span class="panel-kicker">
              GIT
            </span>

            <h2>
              Working Tree
            </h2>
          </div>

          <span
            class="status ${
              workspace.git.dirty
                ? "warning"
                : "active"
            }"
          >
            ${
              workspace.git.dirty
                ? "Modified"
                : "Clean"
            }
          </span>
        </div>

        ${
          workspace.git.changes.length === 0
            ? `
              <div class="empty-state">
                No uncommitted changes detected.
              </div>
            `
            : `
              <div class="git-changes">
                ${workspace.git.changes
                  .map(
                    (change) => `
                      <code>
                        ${change}
                      </code>
                    `,
                  )
                  .join("")}
              </div>
            `
        }
      </section>

      <section class="panel workspace-packages">
        <div class="panel-header">
          <div>
            <span class="panel-kicker">
              VERIFICATION
            </span>

            <h2>
              Local Checks
            </h2>
          </div>

          <span class="local-badge">
            ${
              workspace.checks.executed
                ? "EXECUTED"
                : "NOT RUN"
            }
          </span>
        </div>

        <div class="check-grid">
          ${renderCheckCard(
            "Typecheck",
            workspace.checks.typecheck,
          )}

          ${renderCheckCard(
            "Tests",
            workspace.checks.tests,
          )}

          ${renderCheckCard(
            "Build",
            workspace.checks.build,
          )}
        </div>
      </section>
    </section>
  `;
}

function renderDocumentationPage(): string {
  return featurePage(
    "Documentation",
    "ENGINEERING DOCUMENTATION",
    "Documentation for the engineering architecture, calculation contracts, standards and project workflows.",
    [
      {
        title: "Architecture",
        description:
          "System layers and package dependency rules.",
        icon: "book",
        action: "docs-architecture",
      },
      {
        title: "Calculation Theory",
        description:
          "Engineering formulas and calculation assumptions.",
        icon: "calculator",
        action: "docs-theory",
      },
      {
        title: "SolarAudit Guide",
        description:
          "How the SolarAudit application is structured.",
        icon: "solar",
        action: "docs-solar",
      },
      {
        title: "Development Plan",
        description:
          "Current roadmap and implementation phases.",
        icon: "report",
        action: "docs-plan",
      },
    ],
  );
}

function renderSettingsPage(): string {
  return `
    <section class="page">
      <div class="page-header">
        <div>
          <span class="eyebrow">
            LOCAL CONFIGURATION
          </span>

          <h1>
            Settings
          </h1>

          <p>
            Dashboard configuration. Backend, authentication,
            MCP and cloud settings are intentionally not connected.
          </p>
        </div>
      </div>

      <div class="settings-grid">
        <section class="panel settings-card">
          <div class="settings-icon">
            ${icon("database")}
          </div>

          <div>
            <span class="panel-kicker">
              DATA MODE
            </span>

            <h2>
              Local Workspace
            </h2>

            <p>
              The dashboard reads the local filesystem through
              the workspace adapter.
            </p>
          </div>

          <span class="status active">
            Enabled
          </span>
        </section>

        <section class="panel settings-card">
          <div class="settings-icon">
            ${icon("bolt")}
          </div>

          <div>
            <span class="panel-kicker">
              ENGINE
            </span>

            <h2>
              Engineering Core
            </h2>

            <p>
              Engineering calculations remain owned by the
              existing packages rather than being duplicated here.
            </p>
          </div>

          <span class="status active">
            External
          </span>
        </section>

        <section class="panel settings-card">
          <div class="settings-icon">
            ${icon("tools")}
          </div>

          <div>
            <span class="panel-kicker">
              FUTURE
            </span>

            <h2>
              Backend / MCP / AI
            </h2>

            <p>
              These layers remain outside this local dashboard
              until their underlying engineering foundation is ready.
            </p>
          </div>

          <span class="status draft">
            Later Phase
          </span>
        </section>
      </div>
    </section>
  `;
}

function renderCheckCard(
  name: string,
  check:
    | {
        readonly ok: boolean;
        readonly output: string;
        readonly error: string | null;
      }
    | null,
): string {
  if (!check) {
    return `
      <article class="check-card">
        <div class="check-card-icon muted">
          ${icon("warning")}
        </div>

        <div>
          <strong>
            ${name}
          </strong>

          <span>
            Not executed
          </span>
        </div>
      </article>
    `;
  }

  return `
    <article class="check-card">
      <div
        class="check-card-icon ${
          check.ok
            ? "success"
            : "failure"
        }"
      >
        ${
          check.ok
            ? icon("check")
            : icon("warning")
        }
      </div>

      <div>
        <strong>
          ${name}
        </strong>

        <span>
          ${
            check.ok
              ? "Passed"
              : "Failed"
          }
        </span>
      </div>
    </article>
  `;
}

function renderPage(page: Page): string {
  switch (page) {
    case "dashboard":
      return renderDashboard();

    case "projects":
      return renderProjectsPage();

    case "solaraudit":
      return renderSolarAuditPage();

    case "calculations":
      return renderCalculationsPage();

    case "tools":
      return renderToolsPage();

    case "reports":
      return renderReportsPage();

    case "workspace":
      return renderWorkspacePage();

    case "documentation":
      return renderDocumentationPage();

    case "settings":
      return renderSettingsPage();

    default:
      return renderDashboard();
  }
}

function renderApp(): void {
  const page = currentPage();

  const app =
    document.querySelector<HTMLDivElement>(
      "#app",
    );

  if (!app) {
    return;
  }

  app.innerHTML = `
    <div class="app-shell">
      ${renderSidebar(page)}

      <main class="main">
        ${renderTopbar(page)}

        <div class="content">
          ${renderPage(page)}
        </div>
      </main>

      <div
        class="toast-container"
        id="toast-container"
        aria-live="polite"
      ></div>
    </div>
  `;

  bindEvents();
}

function showToast(message: string): void {
  const container =
    document.querySelector<HTMLDivElement>(
      "#toast-container",
    );

  if (!container) {
    return;
  }

  const toast =
    document.createElement("div");

  toast.className = "toast";

  toast.innerHTML = `
    <span class="toast-icon">
      ${icon("check")}
    </span>

    <span>
      ${message}
    </span>
  `;

  container.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add("leaving");

    window.setTimeout(() => {
      toast.remove();
    }, 220);
  }, 2600);
}

function setSidebar(open: boolean): void {
  const sidebar =
    document.querySelector<HTMLElement>(
      "#sidebar",
    );

  const overlay =
    document.querySelector<HTMLElement>(
      "#sidebar-overlay",
    );

  sidebar?.classList.toggle(
    "open",
    open,
  );

  overlay?.classList.toggle(
    "visible",
    open,
  );
}

function handleAction(
  action: string,
): void {
  switch (action) {
    case "new-project":
      showToast(
        "Project creation will be connected to the SolarAudit application layer.",
      );
      break;

    case "open-solar":
      navigate("solaraudit");
      break;

    case "run-audit":
      navigate("solaraudit");
      break;

    case "run-checks":
      showToast(
        "Running workspace typecheck, tests and build...",
      );

      void loadWorkspace(true);
      break;

    case "refresh":
      showToast(
        "Refreshing local workspace...",
      );

      void loadWorkspace(false);
      break;

    case "open-project": {
      const project =
        document
          .querySelector<HTMLElement>(
            `[data-project="${CSS.escape(
              document.activeElement instanceof HTMLElement
                ? document.activeElement.dataset.project ?? ""
                : "",
            )}"]`,
          )
          ?.dataset.project;

      showToast(
        project
          ? `Project selected: ${project}`
          : "Project selected.",
      );

      break;
    }

    default:
      showToast(
        "This workspace action is reserved for the next integration phase.",
      );
      break;
  }
}

function bindCalculationSearch(): void {
  const input =
    document.querySelector<HTMLInputElement>(
      "#calculation-search",
    );

  const table =
    document.querySelector<HTMLTableElement>(
      "#calculation-table",
    );

  if (!input || !table) {
    return;
  }

  input.addEventListener(
    "input",
    () => {
      const query =
        input.value
          .trim()
          .toLowerCase();

      const rows =
        table.querySelectorAll<HTMLTableRowElement>(
          "tbody tr",
        );

      rows.forEach((row) => {
        row.style.display =
          row.textContent
            ?.toLowerCase()
            .includes(query)
            ? ""
            : "none";
      });
    },
  );
}

function bindEvents(): void {
  bindLoadCalculator();
  document
    .querySelectorAll<HTMLElement>(
      "[data-page]",
    )
    .forEach((element) => {
      element.addEventListener(
        "click",
        () => {
          const page =
            element.dataset.page as
              | Page
              | undefined;

          if (!page) {
            return;
          }

          navigate(page);
          setSidebar(false);
        },
      );
    });

  document
    .querySelectorAll<HTMLElement>(
      "[data-action]",
    )
    .forEach((element) => {
      element.addEventListener(
        "click",
        () => {
          const action =
            element.dataset.action;

          if (!action) {
            return;
          }

          handleAction(action);
        },
      );
    });

  document
    .querySelector(
      "#menu-button",
    )
    ?.addEventListener(
      "click",
      () => {
        setSidebar(true);
      },
    );

  document
    .querySelector(
      "#mobile-close",
    )
    ?.addEventListener(
      "click",
      () => {
        setSidebar(false);
      },
    );

  document
    .querySelector(
      "#sidebar-overlay",
    )
    ?.addEventListener(
      "click",
      () => {
        setSidebar(false);
      },
    );

  document
    .querySelector(
      "#search-button",
    )
    ?.addEventListener(
      "click",
      () => {
        showToast(
          "Search integration will use the local workspace registry.",
        );
      },
    );

  document
    .querySelector(
      "#notification-button",
    )
    ?.addEventListener(
      "click",
      () => {
        showToast(
          workspaceError ??
            "No new engineering notifications.",
        );
      },
    );

  bindCalculationSearch();
}

async function loadWorkspace(
  runChecks = false,
): Promise<void> {
  workspaceLoading = true;
  workspaceError = null;

  renderApp();

  try {
    workspace =
      await getWorkspaceSnapshot(
        runChecks,
      );
  } catch (error) {
    workspaceError =
      error instanceof Error
        ? error.message
        : "Unable to connect to workspace adapter.";
  } finally {
    workspaceLoading = false;

    renderApp();
  }
}

window.addEventListener(
  "hashchange",
  () => {
    renderApp();
  },
);

window.addEventListener(
  "keydown",
  (event) => {
    if (
      (event.ctrlKey ||
        event.metaKey) &&
      event.key.toLowerCase() === "k"
    ) {
      event.preventDefault();

      document
        .querySelector<HTMLButtonElement>(
          "#search-button",
        )
        ?.click();
    }

    if (event.key === "Escape") {
      setSidebar(false);
    }
  },
);

void loadWorkspace(false);
