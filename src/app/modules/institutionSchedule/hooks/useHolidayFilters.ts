import { useCallback, useMemo, useState } from 'react';
import type { Holiday } from '../types/holidays.types';

// Year + months filter over the registered holidays list. The year is a single
// selection (defaults to the current year); months are a multi-selection shown
// only for the months that actually have holidays in the selected year. With no
// months selected, all holidays of the year are shown.
export function useHolidayFilters(holidays: Holiday[]) {
  // Years that have at least one holiday day, descending.
  const availableYears = useMemo(() => {
    const years = new Set(
      holidays.flatMap((h) => h.dates.map((d) => Number(d.slice(0, 4))))
    );
    return [...years].sort((a, b) => b - a);
  }, [holidays]);

  const currentYear = new Date().getFullYear();
  // Default to the current year if it has holidays, else the most recent one.
  const defaultYear = availableYears.includes(currentYear)
    ? currentYear
    : (availableYears[0] ?? currentYear);

  const [year, setYear] = useState<number>(defaultYear);
  const [months, setMonths] = useState<number[]>([]); // 1-12; empty = all

  // Months (1-12) that have holiday days within the selected year, ascending.
  const availableMonths = useMemo(() => {
    const set = new Set(
      holidays.flatMap((h) =>
        h.dates
          .filter((d) => Number(d.slice(0, 4)) === year)
          .map((d) => Number(d.slice(5, 7)))
      )
    );
    return [...set].sort((a, b) => a - b);
  }, [holidays, year]);

  const selectYear = useCallback((next: number) => {
    setYear(next);
    setMonths([]); // reset month picks when the year changes
  }, []);

  const toggleMonth = useCallback((month: number) => {
    setMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  }, []);

  // A holiday matches if any of its days falls in the selected year and (when
  // months are picked) in one of those months.
  const filteredHolidays = useMemo(() => {
    return holidays.filter((h) =>
      h.dates.some((d) => {
        if (Number(d.slice(0, 4)) !== year) return false;
        if (months.length === 0) return true;
        return months.includes(Number(d.slice(5, 7)));
      })
    );
  }, [holidays, year, months]);

  return {
    year,
    months,
    availableYears,
    availableMonths,
    filteredHolidays,
    selectYear,
    toggleMonth,
  };
}
