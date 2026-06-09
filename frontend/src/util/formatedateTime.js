export function formatAppointment(date, time) {
  if (!date || !time) return "Invalid schedule";

  const dateTime = new Date(`${date}T${time}`);

  return dateTime.toLocaleString("en-NG", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
