'use client';

import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AppRepositories } from './types';
import {
  LocalDocumentRepository,
  LocalClientRepository,
  LocalProductRepository,
  LocalCompanyRepository,
} from './localRepository';
import {
  RemoteDocumentRepository,
  RemoteClientRepository,
  RemoteProductRepository,
  RemoteCompanyRepository,
} from './remoteRepository';

interface RepositoryContextType {
  repositories: AppRepositories;
  isGuest: boolean;
  migrateLocalDataToAccount: () => Promise<boolean>;
}

const RepositoryContext = createContext<RepositoryContextType | null>(null);

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated' && Boolean(session?.user);
  const isGuest = !isAuthenticated;

  const localRepos = useMemo<AppRepositories>(
    () => ({
      documents: new LocalDocumentRepository(),
      clients: new LocalClientRepository(),
      products: new LocalProductRepository(),
      company: new LocalCompanyRepository(),
    }),
    []
  );

  const remoteRepos = useMemo<AppRepositories>(
    () => ({
      documents: new RemoteDocumentRepository(),
      clients: new RemoteClientRepository(),
      products: new RemoteProductRepository(),
      company: new RemoteCompanyRepository(),
    }),
    []
  );

  const repositories = isAuthenticated ? remoteRepos : localRepos;

  const migrateLocalDataToAccount = async (): Promise<boolean> => {
    if (!isAuthenticated) return false;
    try {
      // 1. Fetch all guest data from IndexedDB
      const localClients = await localRepos.clients.getAll();
      const localProducts = await localRepos.products.getAll();
      const localDocs = await localRepos.documents.getAll();
      const localCompany = await localRepos.company.get();

      // 2. Push company info if not default
      if (localCompany && localCompany.name !== 'Mon Entreprise DZ') {
        await remoteRepos.company.save(localCompany);
      }

      // 3. Migrate clients
      for (const client of localClients) {
        await remoteRepos.clients.save({ ...client, id: undefined });
      }

      // 4. Migrate products
      for (const product of localProducts) {
        await remoteRepos.products.save({ ...product, id: undefined });
      }

      // 5. Migrate documents
      for (const doc of localDocs) {
        await remoteRepos.documents.save({ ...doc, id: undefined });
      }

      // 6. Clear local DB
      if (typeof window !== 'undefined') {
        indexedDB.deleteDatabase('factura_dz_db');
      }

      return true;
    } catch (err) {
      console.error('Migration failed:', err);
      return false;
    }
  };

  return (
    <RepositoryContext.Provider value={{ repositories, isGuest, migrateLocalDataToAccount }}>
      {children}
    </RepositoryContext.Provider>
  );
}

export function useRepository() {
  const ctx = useContext(RepositoryContext);
  if (!ctx) {
    throw new Error('useRepository must be used within a RepositoryProvider');
  }
  return ctx;
}
