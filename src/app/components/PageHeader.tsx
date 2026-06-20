import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  // Action controls (buttons) rendered on the right. Wrapped so multiple
  // buttons wrap nicely on small screens.
  children?: ReactNode;
}

// Shared page header: title + optional subtitle + optional action slot.
// Used across the list pages (Users, Patients, Roles, Appointments, etc.).
export default function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="app-page-header flex items-center justify-between mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">{title}</h1>
        {subtitle && <p className="text-gray-500">{subtitle}</p>}
      </div>
      {children && (
        <div className="app-page-header-actions flex flex-wrap items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
