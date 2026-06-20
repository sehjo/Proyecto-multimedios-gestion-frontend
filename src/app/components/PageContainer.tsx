import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
}

// Standard page wrapper (padding + layout class) shared by all module pages,
// so pages compose components without writing the container markup themselves.
export default function PageContainer({ children }: PageContainerProps) {
  return <div className="app-page p-8">{children}</div>;
}
