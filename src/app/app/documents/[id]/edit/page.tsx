'use client';

import React, { useEffect, useState, use } from 'react';
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
  const { repositories } = useRepository();
  const [doc, setDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await repositories.documents.getById(id);
      setDoc(data);
      setLoading(false);
    }
    load();
  }, [id, repositories]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Chargement...</div>;
  }

  if (!doc) {
    return <div className="p-8 text-center">Document introuvable.</div>;
  }

  return (
    <React.Suspense fallback={<div className="p-8 text-center text-slate-500">Chargement de l'éditeur...</div>}>
      <DocumentEditor initialData={doc} />
    </React.Suspense>
  );
}
