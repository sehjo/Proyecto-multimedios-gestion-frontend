import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  onClick?: () => void;
}

export default function PageContainer({ children, onClick }: PageContainerProps) {
  return (
    <div className="app-page p-8" onClick={onClick}>
      {children}
    </div>
  );
}
