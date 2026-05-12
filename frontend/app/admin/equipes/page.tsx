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
  AthleteSummary,
  TeamSummary,
  adminDeleteTeam,
  adminFetchJson,
  adminUpdateTeam,
} from '../../lib';

export default function AdminEquipesPage() {
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [athletes, setAthletes] = useState<AthleteSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamColor, setTeamColor] = useState('');

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const [loadedTeams, loadedAthletes] = await Promise.all([
        adminFetchJson<TeamSummary[]>('/teams'),
        adminFetchJson<AthleteSummary[]>('/athletes'),
      ]);
      setTeams(loadedTeams);
      setAthletes(loadedAthletes);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar equipes');
    } finally {
      setLoading(false);
    }
  }

  const grouped = useMemo(
    () =>
      teams.map((team) => ({
        ...team,
        athletes: athletes.filter((athlete) => athlete.team?.id === team.id),
      })),
    [athletes, teams],
  );

  async function saveTeam(teamId: string) {
    setError(null);
    try {
      const updated = await adminUpdateTeam(teamId, {
        name: teamName || undefined,
        color: teamColor || undefined,
      });
      setTeams((current) =>
        current.map((team) => (team.id === teamId ? { ...team, ...updated } : team)),
      );
      setEditingId(null);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Falha ao atualizar equipe');
    }
  }

  async function deleteTeam(teamId: string) {
    if (!confirm('Tem certeza que deseja excluir esta equipe?')) return;
    setDeletingId(teamId);
    setError(null);

    try {
      await adminDeleteTeam(teamId);
      setTeams((current) => current.filter((team) => team.id !== teamId));
      setAthletes((current) => current.filter((athlete) => athlete.team?.id !== teamId));
      if (editingId === teamId) {
        setEditingId(null);
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Falha ao excluir equipe');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        kicker="Competicao"
        title="Equipes"
        description="Visao consolidada das equipes, composicao de atletas e placar acumulado do evento."
        actions={
          <Button asChild>
            <a href="/admin/equipes/nova">Nova equipe</a>
          </Button>
        }
      />

      {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}

      {loading ? (
        <AdminEmptyState title="Carregando..." description="Buscando registros de equipes no sistema." />
      ) : null}

      {!loading && grouped.length === 0 ? (
        <AdminEmptyState
          title="Nenhuma equipe cadastrada."
          description='Clique em "Nova equipe" para comecar.'
        />
      ) : null}

      {!loading && grouped.length > 0 ? (
        <section className="grid gap-4 xl:grid-cols-2">
          {grouped.map((team) => (
            <AdminSurface
              key={team.id}
              title={team.name}
              description={`Placar atual: ${team.totalScore} pts`}
              actions={<Badge variant="outline">{team.athletes.length} atletas</Badge>}
            >
              <div className="space-y-4">
                <div className="grid gap-2 text-sm text-slate-600">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full border border-slate-200"
                      style={{ backgroundColor: team.color || '#ccc' }}
                    />
                    <span>Cor: {team.color || 'Padrao'}</span>
                  </div>
                  <p className="m-0">
                    <strong>Ativos:</strong> {team.athletes.filter((athlete) => athlete.status === 'active').length}{' '}
                    · <strong>Pendentes:</strong>{' '}
                    {team.athletes.filter((athlete) => athlete.status === 'pending').length}
                  </p>
                  <p className="m-0">
                    <strong>Modalidades:</strong>{' '}
                    {Array.from(
                      new Set(team.athletes.flatMap((athlete) => athlete.sports.map((sport) => sport.name))),
                    ).join(', ') || 'Nenhuma'}
                  </p>
                </div>

                {editingId === team.id ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="Nome">
                      <Input value={teamName} onChange={(event) => setTeamName(event.target.value)} />
                    </AdminField>
                    <AdminField label="Cor (Hex)">
                      <Input value={teamColor} onChange={(event) => setTeamColor(event.target.value)} />
                    </AdminField>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm">
                    <a href={`/admin/equipes/${team.id}`}>Ver detalhes</a>
                  </Button>
                  {editingId === team.id ? (
                    <>
                      <Button size="sm" type="button" onClick={() => saveTeam(team.id)}>
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
                          setEditingId(team.id);
                          setTeamName(team.name);
                          setTeamColor(team.color ?? '');
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        disabled={deletingId === team.id}
                        onClick={() => deleteTeam(team.id)}
                      >
                        {deletingId === team.id ? '...' : 'Excluir'}
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
