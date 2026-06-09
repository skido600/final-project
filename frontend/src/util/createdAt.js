export function formatDateTime(dateString) {
  if (!dateString) return "No date";

  const date = new Date(dateString);

  return date.toLocaleString("en-NG", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
