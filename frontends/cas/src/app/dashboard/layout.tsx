'use client';

import { DashboardLayout } from '@/customComponents/DashboardLayout';
import React, { FC } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
