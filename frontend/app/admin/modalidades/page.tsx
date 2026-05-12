'use client';

import { useEffect, useMemo, useState } from 'react';

import { AdminEmptyState } from '@/components/admin/empty-state';
import { AdminField } from '@/components/admin/field';
import { AdminPageHeader } from '@/components/admin/page-header';
import { AdminSurface } from '@/components/admin/surface';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ResultSummary,
  SportSummary,
  adminDeleteSport,
  adminFetchJson,
  adminUpdateSport,
} from '../../lib';

export default function AdminModalidadesPage() {
  const [sports, setSports] = useState<SportSummary[]>([]);
  const [results, setResults] = useState<ResultSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sportName, setSportName] = useState('');
  const [description, setDescription] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [loadedSports, loadedResults] = await Promise.all([
        adminFetchJson<SportSummary[]>('/sports'),
        adminFetchJson<ResultSummary[]>('/results'),
      ]);
      setSports(loadedSports);
      setResults(loadedResults);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar modalidades');
    } finally {
      setLoading(false);
    }
  }

  const summaries = useMemo(
    () =>
      sports.map((sport) => ({
        ...sport,
        resultCount: results.filter((result) => result.sport.id === sport.id).length,
      })),
    [results, sports],
  );

  async function saveSport(sportId: string) {
    setError(null);
    try {
      const updated = await adminUpdateSport(sportId, {
        name: sportName || undefined,
        description: description || undefined,
        isActive,
        scheduleDate: scheduleDate ? new Date(scheduleDate).toISOString() : undefined,
      });
      setSports((current) =>
        current.map((sport) => (sport.id === sportId ? { ...sport, ...updated } : sport)),
      );
      setEditingId(null);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Falha ao atualizar modalidade');
    }
  }

  async function deleteSport(sportId: string) {
    if (!confirm('Tem certeza que deseja excluir esta modalidade?')) return;
    setDeletingId(sportId);
    setError(null);

    try {
      await adminDeleteSport(sportId);
      setSports((current) => current.filter((sport) => sport.id !== sportId));
      setResults((current) => current.filter((result) => result.sport.id !== sportId));
      if (editingId === sportId) {
        setEditingId(null);
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : 'Falha ao excluir modalidade',
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        kicker="Competicao"
        title="Modalidades"
        description="Resumo operacional das modalidades, categorias e quantidade de resultados ja lancados no sistema."
        actions={
          <Button asChild>
            <a href="/admin/modalidades/nova">Nova modalidade</a>
          </Button>
        }
      />

      {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}

      {loading ? (
        <AdminEmptyState
          title="Carregando..."
          description="Buscando registros de modalidades no sistema."
        />
      ) : null}

      {!loading && summaries.length === 0 ? (
        <AdminEmptyState
          title="Nenhuma modalidade cadastrada."
          description='Clique em "Nova modalidade" para comecar.'
        />
      ) : null}

      {!loading && summaries.length > 0 ? (
        <section className="grid gap-4 xl:grid-cols-2">
          {summaries.map((sport) => (
            <AdminSurface
              key={sport.id}
              title={sport.name}
              description={sport.category}
              actions={
                <Badge variant={sport.isActive === false ? 'destructive' : 'success'}>
                  {sport.isActive === false ? 'Inativa' : 'Ativa'}
                </Badge>
              }
            >
              <div className="space-y-4">
                <div className="grid gap-2 text-sm text-slate-600">
                  <p className="m-0">
                    <strong>Resultados:</strong> {sport.resultCount} lancados
                  </p>
                  <p className="m-0">
                    <strong>ALDEBARUN:</strong> {sport.isAldebarun ? 'Sim' : 'Nao'}
                  </p>
                  <p className="m-0">
                    <strong>Agenda:</strong>{' '}
                    {sport.scheduleDate
                      ? new Date(sport.scheduleDate).toLocaleString('pt-BR')
                      : 'Nao definida'}
                  </p>
                </div>

                {editingId === sport.id ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="Nome" className="md:col-span-2">
                      <Input value={sportName} onChange={(event) => setSportName(event.target.value)} />
                    </AdminField>
                    <AdminField label="Descricao" className="md:col-span-2">
                      <Input value={description} onChange={(event) => setDescription(event.target.value)} />
                    </AdminField>
                    <AdminField label="Data/hora">
                      <Input
                        type="datetime-local"
                        value={scheduleDate}
                        onChange={(event) => setScheduleDate(event.target.value)}
                      />
                    </AdminField>
                    <label className="flex items-center gap-2 self-end rounded-md border border-input px-3 py-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(event) => setIsActive(event.target.checked)}
                      />
                      Ativa
                    </label>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm">
                    <a href={`/admin/modalidades/${sport.id}`}>Ver detalhes</a>
                  </Button>
                  {editingId === sport.id ? (
                    <>
                      <Button size="sm" type="button" onClick={() => saveSport(sport.id)}>
                        Salvar
                      </Button>
                      <Button variant="outline" size="sm" type="button" onClick={() => setEditingId(null)}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => {
                          setEditingId(sport.id);
                          setSportName(sport.name);
                          setDescription(sport.description ?? '');
                          setScheduleDate(
                            sport.scheduleDate
                              ? new Date(sport.scheduleDate).toISOString().slice(0, 16)
                              : '',
                          );
                          setIsActive(sport.isActive !== false);
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        disabled={deletingId === sport.id}
                        onClick={() => deleteSport(sport.id)}
                      >
                        {deletingId === sport.id ? '...' : 'Excluir'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </AdminSurface>
          ))}
        </section>
      ) : null}
    </div>
  );
}
