import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <div className="fixed top-4 right-6 z-50">
          <ThemeToggle />
        </div>
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
