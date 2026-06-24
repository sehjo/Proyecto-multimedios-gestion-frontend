import type { ReactNode } from 'react';

interface AgendaWorkspaceProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export default function AgendaWorkspace({ sidebar, children }: AgendaWorkspaceProps) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-52 flex-shrink-0 space-y-4">{sidebar}</div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
