import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'ccss_recent_activity';
const MAX_ITEMS = 15;

type ActivityItem = {
  id: string;
  type: string;
  name: string;
  timestamp: number;
};

type ActivityContextType = {
  recentActivity: ActivityItem[];
  activityVersion: number;
  logActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
};

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

const readStoredActivity = (): ActivityItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item) =>
      item &&
      typeof item.id === 'string' &&
      typeof item.type === 'string' &&
      typeof item.name === 'string' &&
      typeof item.timestamp === 'number'
    );
  } catch {
    return [];
  }
};

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>(() => readStoredActivity());
  const [activityVersion, setActivityVersion] = useState(0);

  const logActivity = (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const nextItem: ActivityItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: activity.type,
      name: activity.name,
      timestamp: Date.now(),
    };

    setRecentActivity((prev) => {
      const next = [nextItem, ...prev].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });

    setActivityVersion((version) => version + 1);
  };

  const value = useMemo(
    () => ({
      recentActivity,
      activityVersion,
      logActivity,
    }),
    [recentActivity, activityVersion]
  );

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }

  return context;
}
