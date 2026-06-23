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

const MEDIUM_DATE_FORMATTER = new Intl.DateTimeFormat('es-CR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

// "21 jun 2026" for a "YYYY-MM-DD" string.
export function formatMediumDate(date: string): string {
  return MEDIUM_DATE_FORMATTER.format(new Date(`${date}T12:00:00`));
}

// Whether the sorted dates form a single contiguous run (no gaps).
function isContiguous(sortedDates: string[]): boolean {
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(`${sortedDates[i - 1]}T12:00:00`);
    prev.setDate(prev.getDate() + 1);
    const expected = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}-${String(
      prev.getDate()
    ).padStart(2, '0')}`;
    if (expected !== sortedDates[i]) return false;
  }
  return true;
}

// Human summary of a set of closure dates:
//  - one day  -> "21 jun 2026"
//  - a range  -> "29 mar 2026 – 2 abr 2026"
//  - scattered -> "3 días: 1 ene, 5 ene, 9 ene 2026"
export function formatDatesSummary(dates: string[]): string {
  if (dates.length === 0) return '';
  const sorted = [...dates].sort();
  if (sorted.length === 1) return formatMediumDate(sorted[0]);
  if (isContiguous(sorted)) {
    return `${formatMediumDate(sorted[0])} – ${formatMediumDate(sorted[sorted.length - 1])}`;
  }
  return `${sorted.length} días: ${sorted.map(formatMediumDate).join(', ')}`;
}
