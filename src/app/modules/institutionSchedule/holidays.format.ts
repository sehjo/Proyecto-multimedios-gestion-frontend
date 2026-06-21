// Pure date formatters for the holidays UI (no hook needed).

const LONG_DATE_FORMATTER = new Intl.DateTimeFormat('es-CR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

// "lunes, 21 de junio de 2026" for a "YYYY-MM-DD" string. Parsed at noon to
// avoid timezone off-by-one shifts.
export function formatLongDate(date: string): string {
  return LONG_DATE_FORMATTER.format(new Date(`${date}T12:00:00`));
}

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat('es-CR', {
  day: '2-digit',
  month: '2-digit',
});

// "21/06" for a "YYYY-MM-DD" string.
export function formatShortDate(date: string): string {
  return SHORT_DATE_FORMATTER.format(new Date(`${date}T12:00:00`));
}
