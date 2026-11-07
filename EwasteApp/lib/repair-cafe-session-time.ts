/**
 * Sessions store SQL TIME values such as 10:00:00, not ISO timestamps.
 * Attendance records store timestamp values, which need Sydney timezone.
 */
export function formatRepairCafeTime(value: string | null | undefined): string {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return "Time not set";
  const clock = /^([01]\d|2[0-3]):([0-5]\d)(?::[0-5]\d(?:\.\d+)?)?$/.exec(raw);
  if (clock) {
    const hour = Number(clock[1]);
    return `${hour % 12 || 12}:${clock[2]} ${hour < 12 ? "am" : "pm"}`;
  }
  const timestamp = new Date(raw);
  return Number.isNaN(timestamp.getTime())
    ? "Time not set"
    : timestamp.toLocaleTimeString("en-AU", {
        timeZone: "Australia/Sydney",
        hour: "numeric",
        minute: "2-digit",
      });
}
