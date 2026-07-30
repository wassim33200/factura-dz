'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DocumentEditor } from '@/components/documents/DocumentEditor';
import { useRepository } from '@/lib/repository/useRepository';
import { DocumentData } from '@/lib/types';

export default function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = use(
    (params && typeof (params as any)?.then === 'function'
      ? params
      : Promise.resolve(params)) as Promise<{ id: string }>
  );
  const id = resolvedParams?.id || '';
  const router = useRouter();
  const { repositories } = useRepository();
  const [doc, setDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        let data = await repositories.documents.getById(id);

        // Fallback: try local IndexedDB if remote returned nothing or threw
        if (!data && id.startsWith('doc_')) {
          const { LocalDocumentRepository } = await import('@/lib/repository/localRepository');
          const localRepo = new LocalDocumentRepository();
          data = await localRepo.getById(id);
        }

        setDoc(data);
      } catch (err) {
        console.error('Failed to load document for editing:', err);
        // Secondary fallback: try local repo regardless of ID prefix
        try {
          const { LocalDocumentRepository } = await import('@/lib/repository/localRepository');
          const localRepo = new LocalDocumentRepository();
          const localData = await localRepo.getById(id);
          if (localData) {
            setDoc(localData);
          } else {
            setError('Impossible de charger ce document pour le modifier.');
          }
        } catch {
          setError('Impossible de charger ce document pour le modifier.');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, repositories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        Chargement du document...
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
          !
        </div>
        <h2 className="text-xl font-bold text-slate-800">Document introuvable</h2>
        <p className="text-sm text-slate-600 max-w-md">
          {error || "Ce document n'existe pas ou n'est pas accessible."}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Retour
          </button>
          <Link
            href="/app/documents"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1C4A3D] rounded-lg hover:bg-[#15382e]"
          >
            Tous les documents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <React.Suspense fallback={<div className="p-8 text-center text-slate-500">Chargement de l&apos;éditeur...</div>}>
      <DocumentEditor initialData={doc} />
    </React.Suspense>
  );
}
