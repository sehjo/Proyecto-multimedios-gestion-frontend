import { ReactNode } from 'react';

interface NotificationsGridProps {
  main: ReactNode;
  side: ReactNode;
}

export default function NotificationsGrid({ main, side }: NotificationsGridProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 space-y-6">{main}</div>
      <div className="space-y-6">{side}</div>
    </div>
  );
}
