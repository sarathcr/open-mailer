'use client';

import { AuthProvider } from '@/auth/AuthProvider';
import { AuthWrapper } from '@/auth/AuthWrapper';
import { DashboardLayout } from '@/customComponents/DashboardLayout';
import React, { FC } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <AuthProvider>
        <AuthWrapper>
          <DashboardLayout>{children}</DashboardLayout>
        </AuthWrapper>
      </AuthProvider>
    </>
  );
};

export default Layout;
