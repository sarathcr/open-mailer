'use client';

import Header from '@/customComponents/DashboardLayout/Header';
import Sidebar from '@/customComponents/DashboardLayout/SideBar';
import { FC, ReactNode, useState } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <div className="mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
