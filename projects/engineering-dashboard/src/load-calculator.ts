import {
  runLoadAudit,
  type LoadAuditInput,
  type LoadCategory,
  type LoadPhase,
} from "@ogwusearch/solar-engine";

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character] ?? character;
  });
}

function numberValue(input: HTMLInputElement, label: string): number {
  if (!input.value.trim()) {
    throw new Error(`${label} is required.`);
  }

  const value = Number(input.value);

  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be a valid number.`);
  }

  return value;
}

function optionalNumber(input: HTMLInputElement, label: string): number | undefined {
  if (!input.value.trim()) return undefined;

  const value = Number(input.value);

  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be a valid number.`);
  }

  return value;
}

function messages(
  title: string,
  items: readonly { code: string; message: string }[],
): string {
  if (!items.length) return "";

  return `
    <section class="panel" style="padding:16px;margin-top:16px">
      <h3>${escapeHtml(title)}</h3>
      <ul>
        ${items.map((item) => `
          <li><strong>${escapeHtml(item.code)}</strong>:
          ${escapeHtml(item.message)}</li>
        `).join("")}
      </ul>
    </section>
  `;
}

function renderLoadRow(index: number): string {
  const categories: [LoadCategory, string][] = [
    ["LIGHTING", "Lighting"],
    ["HVAC", "HVAC"],
    ["MOTOR", "Motor"],
    ["PUMP", "Pump"],
    ["APPLIANCE", "Appliance"],
    ["OFFICE", "Office"],
    ["IT", "IT"],
    ["INDUSTRIAL", "Industrial"],
    ["OTHER", "Other"],
  ];

  return `
    <tr data-load-row>
      <td><input data-field="name" aria-label="Load name ${index}"
        value="${index === 1 ? "LED Lighting" : ""}" required /></td>
      <td><select data-field="category" aria-label="Category ${index}">
        ${categories.map(([value, label]) =>
          `<option value="${value}">${label}</option>`
        ).join("")}
      </select></td>
      <td><input data-field="quantity" aria-label="Quantity ${index}"
        type="number" min="1" step="1" value="10" required /></td>
      <td><input data-field="ratedPowerW" aria-label="Rated watts ${index}"
        type="number" min="0.01" step="any" value="12" required /></td>
      <td><input data-field="powerFactor" aria-label="Power factor ${index}"
        type="number" min="0.01" max="1" step="any" value="0.9" required /></td>
      <td><input data-field="operatingHoursPerDay" aria-label="Hours per day ${index}"
        type="number" min="0" max="24" step="any" value="8" required /></td>
      <td><input data-field="operatingDaysPerMonth" aria-label="Days per month ${index}"
        type="number" min="0" max="31" step="any" value="30" required /></td>
      <td><select data-field="phase" aria-label="Phase ${index}">
        <option value="SINGLE_PHASE">Single</option>
        <option value="THREE_PHASE">Three</option>
      </select></td>
      <td><input data-field="demandFactor" aria-label="Demand factor ${index}"
        type="number" min="0.01" max="1" step="any" placeholder="Default" /></td>
      <td><button type="button" class="button" data-remove-load>Remove</button></td>
    </tr>
  `;
}

export function renderLoadCalculator(): string {
  return `
    <section class="panel" style="padding:20px;margin-bottom:20px">
      <div class="panel-header">
        <div>
          <span class="panel-kicker">SOLAR ENGINE</span>
          <h2>Multi-Load Audit Calculator</h2>
          <p>Enter multiple appliances and calculate their combined demand and energy.</p>
        </div>
      </div>

      <form id="load-audit-form">
        <div style="overflow-x:auto">
          <table style="width:100%;min-width:1100px;border-collapse:collapse">
            <thead><tr>
              <th>Load</th><th>Category</th><th>Qty</th><th>Rated W</th>
              <th>PF</th><th>Hours/day</th><th>Days/month</th>
              <th>Phase</th><th>Demand factor</th><th>Action</th>
            </tr></thead>
            <tbody id="load-audit-rows">${renderLoadRow(1)}</tbody>
          </table>
        </div>

        <div style="margin-top:16px">
          <button type="button" class="button" id="add-load-row">+ Add load</button>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px;margin-top:20px">
          <label>Design margin (0–1, optional)
            <input name="designMargin" type="number" min="0" max="1"
              step="any" placeholder="Engine default" />
          </label>
          <label>Diversity factor (minimum 1, optional)
            <input name="diversityFactor" type="number" min="1"
              step="any" placeholder="Engine default" />
          </label>
        </div>

        <div style="margin-top:20px">
          <button type="submit" class="button button-primary">Run Load Audit</button>
        </div>
      </form>

      <div id="load-audit-error" role="alert" aria-live="polite"
        style="margin-top:16px"></div>
    </section>

    <section id="load-audit-results" aria-live="polite">
      <section class="panel" style="padding:20px">
        <h2>Calculation results</h2>
        <p>Add your loads and run the audit.</p>
      </section>
    </section>
  `;
}

export function bindLoadCalculator(): void {
  const form = document.querySelector<HTMLFormElement>("#load-audit-form");
  const rows = document.querySelector<HTMLTableSectionElement>("#load-audit-rows");
  const addButton = document.querySelector<HTMLButtonElement>("#add-load-row");
  const results = document.querySelector<HTMLElement>("#load-audit-results");
  const errorBox = document.querySelector<HTMLElement>("#load-audit-error");

  if (!form || !rows || !addButton || !results || !errorBox) return;

  let nextIndex = rows.querySelectorAll("[data-load-row]").length + 1;

  addButton.addEventListener("click", () => {
    rows.insertAdjacentHTML("beforeend", renderLoadRow(nextIndex));
    nextIndex += 1;
    errorBox.textContent = "";
  });

  rows.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const button = event.target.closest("[data-remove-load]");
    if (!button) return;

    if (rows.querySelectorAll("[data-load-row]").length <= 1) {
      errorBox.textContent = "At least one load is required.";
      return;
    }

    button.closest("[data-load-row]")?.remove();
    errorBox.textContent = "";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    errorBox.textContent = "";

    try {
      const loadRows = Array.from(
        rows.querySelectorAll<HTMLTableRowElement>("[data-load-row]"),
      );

      const loads = loadRows.map((row, index) => {
        function field(name: string): HTMLInputElement | HTMLSelectElement {
          const element = row.querySelector<HTMLInputElement | HTMLSelectElement>(
            `[data-field="${name}"]`,
          );

          if (!element) {
            throw new Error(`Missing ${name} in load row ${index + 1}.`);
          }

          return element;
        }

        function input(name: string): HTMLInputElement {
          const element = field(name);

          if (!(element instanceof HTMLInputElement)) {
            throw new Error(`Invalid ${name} field in row ${index + 1}.`);
          }

          return element;
        }

        const name = field("name").value.trim();

        if (!name) {
          throw new Error(`Enter a name for load row ${index + 1}.`);
        }

        const demandFactor = optionalNumber(
          input("demandFactor"),
          `Demand factor in row ${index + 1}`,
        );

        return {
          id: `load-${String(index + 1).padStart(3, "0")}`,
          name,
          category: field("category").value as LoadCategory,
          phase: field("phase").value as LoadPhase,
          quantity: numberValue(input("quantity"), `Quantity in row ${index + 1}`),
          ratedPowerW: numberValue(input("ratedPowerW"), `Rated power in row ${index + 1}`),
          powerFactor: numberValue(input("powerFactor"), `Power factor in row ${index + 1}`),
          operatingHoursPerDay: numberValue(
            input("operatingHoursPerDay"),
            `Hours per day in row ${index + 1}`,
          ),
          operatingDaysPerMonth: numberValue(
            input("operatingDaysPerMonth"),
            `Days per month in row ${index + 1}`,
          ),
          ...(demandFactor !== undefined ? { demandFactor } : {}),
        };
      });

      const designInput = form.querySelector<HTMLInputElement>('[name="designMargin"]');
      const diversityInput = form.querySelector<HTMLInputElement>('[name="diversityFactor"]');

      if (!designInput || !diversityInput) {
        throw new Error("Audit settings are missing.");
      }

      const designMargin = optionalNumber(designInput, "Design margin");
      const diversityFactor = optionalNumber(diversityInput, "Diversity factor");

      const input: LoadAuditInput = {
        loads,
        ...(designMargin !== undefined ? { designMargin } : {}),
        ...(diversityFactor !== undefined ? { diversityFactor } : {}),
      };

      // Run the real calculation engine once for the complete load schedule.
      const result = runLoadAudit(input);

      if (!result.valid || !result.value) {
        results.innerHTML = `
          <section class="panel" style="padding:20px">
            <h2>Calculation could not be completed</h2>
            <p>Status: ${escapeHtml(result.status)}</p>
            ${messages("Errors", result.errors)}
            ${messages("Warnings", result.warnings)}
          </section>`;
        return;
      }

      const value = result.value;
      const metrics = [
        ["Load types", value.loads.length, "loads"],
        ["Connected load", value.totalConnectedLoadW, "W"],
        ["Running load", value.totalRunningLoadW, "W"],
        ["Apparent power", value.totalApparentPowerVA, "VA"],
        ["Daily energy", value.dailyEnergyWh, "Wh/day"],
        ["Monthly energy", value.monthlyEnergyWh, "Wh/month"],
        ["Normal coincident demand", value.normalCoincidentDemandW, "W"],
        ["Peak demand", value.peakDemandW, "W"],
        ["Design peak demand", value.designPeakDemandW, "W"],
      ] as const;

      results.innerHTML = `
        <section class="panel" style="padding:20px">
          <div class="panel-header"><div>
            <span class="panel-kicker">ENGINE RESULT</span>
            <h2>Load Audit Results</h2>
            <p>Status: <strong>${escapeHtml(result.status)}</strong></p>
          </div></div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px">
            ${metrics.map(([label, amount, unit]) => `
              <article class="panel" style="padding:16px">
                <p>${escapeHtml(label)}</p>
                <h3>${Number(amount).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })} ${escapeHtml(unit)}</h3>
              </article>
            `).join("")}
          </div>

          <p style="margin-top:16px">Design margin:
            ${(value.designMargin * 100).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}%
          </p>

          <h3>Per-load results</h3>
          <div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse">
              <thead><tr>
                <th>Load ID</th><th>Connected load</th>
                <th>Running load</th><th>Apparent power</th>
              </tr></thead>
              <tbody>${value.loads.map((load) => `
                <tr>
                  <td>${escapeHtml(load.loadId)}</td>
                  <td>${load.connectedLoadW.toLocaleString()} W</td>
                  <td>${load.runningLoadW.toLocaleString()} W</td>
                  <td>${load.apparentPowerVA.toLocaleString()} VA</td>
                </tr>
              `).join("")}</tbody>
            </table>
          </div>

          ${messages("Warnings", result.warnings)}
          ${messages("Errors", result.errors)}

          <details style="margin-top:20px">
            <summary>Calculation assumptions</summary>
            <pre style="white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(
              JSON.stringify(result.assumptions, null, 2),
            )}</pre>
          </details>

          <details style="margin-top:12px">
            <summary>Calculation trace</summary>
            <pre style="white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(
              JSON.stringify(result.trace, null, 2),
            )}</pre>
          </details>

          <details style="margin-top:12px">
            <summary>Calculation metadata</summary>
            <pre style="white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(
              JSON.stringify(result.metadata, null, 2),
            )}</pre>
          </details>
        </section>`;
    } catch (error) {
      errorBox.textContent = error instanceof Error
        ? error.message
        : "Unable to run the load audit.";
    }
  });
}
