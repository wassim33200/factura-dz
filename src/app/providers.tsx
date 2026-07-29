'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { RepositoryProvider } from '@/lib/repository/useRepository';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <RepositoryProvider>{children}</RepositoryProvider>
    </SessionProvider>
  );
}
