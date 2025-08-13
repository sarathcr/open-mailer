'use client';

import { AuthLayout } from '@/customComponents/AuthLayout';
import React, { FC } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default Layout;
