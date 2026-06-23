import type { MouseEventHandler, ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export default function PageContainer({ children, className, onClick }: PageContainerProps) {
  return (
    <div className={`app-page p-6 min-h-full ${className ?? ''}`} onClick={onClick}>
      {children}
    </div>
  );
}
