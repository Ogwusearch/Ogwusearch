/**
 * Create a deterministic field path.
 *
 * Examples:
 * createPath("battery", "capacity") => "battery.capacity"
 * createPath("loads", 0, "power") => "loads[0].power"
 * createPath("pv", "strings", 1, "modules", 5, "voltage")
 * => "pv.strings[1].modules[5].voltage"
 */
export function createPath(
  ...segments: Array<string | number | null | undefined>
): string {
  let path = "";

  for (const segment of segments) {
    if (segment === null || segment === undefined || segment === "") {
      continue;
    }

    if (typeof segment === "number") {
      path += `[${segment}]`;
    } else if (path === "") {
      path = segment;
    } else {
      path += `.${segment}`;
    }
  }

  return path;
}