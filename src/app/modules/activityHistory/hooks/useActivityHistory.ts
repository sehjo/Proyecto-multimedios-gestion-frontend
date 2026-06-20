import { useState, useMemo } from 'react';
import { getActivities } from '../services/activityHistoryService';
import { EMPTY_FILTERS, PAGE_SIZE } from '../constants';
import type { ActivityEntry, ActivityFilters } from '../types/activityHistory.types';

function filterActivities(entries: ActivityEntry[], filters: ActivityFilters): ActivityEntry[] {
  return entries.filter((entry) => {
    if (filters.user && !entry.user.toLowerCase().includes(filters.user.toLowerCase())) return false;
    if (filters.action && entry.action !== filters.action) return false;
    if (filters.module && entry.module !== filters.module) return false;
    if (filters.date && entry.date !== filters.date) return false;
    return true;
  });
}

export function useActivityHistory() {
  const activities = useMemo(() => getActivities(), []);
  const [draftFilters, setDraftFilters] = useState<ActivityFilters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<ActivityFilters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);

  const handleApply = () => {
    setAppliedFilters({ ...draftFilters });
    setPage(1);
  };

  const handleClear = () => {
    setDraftFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setPage(1);
  };

  const filtered = useMemo(
    () => filterActivities(activities, appliedFilters),
    [activities, appliedFilters],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const isFiltered = Object.values(appliedFilters).some(Boolean);

  return {
    draftFilters,
    setDraftFilters,
    filtered,
    paginated,
    page,
    setPage,
    totalPages,
    isFiltered,
    handleApply,
    handleClear,
  };
}
