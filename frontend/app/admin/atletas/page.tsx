'use client';

import { useEffect, useState } from 'react';

import { AdminDataTable } from '@/components/admin/data-table';
import { AdminEmptyState } from '@/components/admin/empty-state';
import { AdminField } from '@/components/admin/field';
import { AdminPageHeader } from '@/components/admin/page-header';
import { AdminSurface } from '@/components/admin/surface';
import { AdminToolbar, AdminToolbarGroup } from '@/components/admin/toolbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AthleteSummary,
  adminDeleteAthlete,
  adminDownloadAthletesCsv,
  adminFetchJson,
  adminGetAthleteReviewPage,
  adminUpdateAthleteStatus,
} from '../../lib';

function statusBadgeVariant(status: string): 'success' | 'warning' | 'destructive' | 'outline' {
  switch (status) {
    case 'active':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
      return 'destructive';
    default:
      return 'outline';
  }
}

export default function AdminAthletesPage() {
  const [athletes, setAthletes] = useState<AthleteSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [teamIdFilter, setTeamIdFilter] = useState('');
  const [search, setSearch] = useState('');
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    void loadAthletes();
  }, [page, statusFilter, teamIdFilter, search]);

  async function loadAthletes() {
    setLoading(true);
    setError(null);

    try {
      const [response, loadedTeams] = await Promise.all([
        adminGetAthleteReviewPage({
          page,
          pageSize: 12,
          status: statusFilter,
          teamId: teamIdFilter,
          search,
        }),
        adminFetchJson<{ id: string; name: string }[]>('/teams'),
      ]);
      setAthletes(response.items);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setTeams(loadedTeams);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar atletas');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(athleteId: string, status: 'active' | 'rejected') {
    setPendingActionId(athleteId);
    setError(null);

    try {
      const updated = await adminUpdateAthleteStatus(athleteId, status);
      setAthletes((current) =>
        current.map((athlete) => (athlete.id === athleteId ? updated : athlete)),
      );
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Falha ao atualizar atleta');
    } finally {
      setPendingActionId(null);
    }
  }

  async function deleteAthlete(athleteId: string) {
    if (!confirm('Tem certeza que deseja excluir este atleta?')) return;
    setDeletingId(athleteId);
    setError(null);

    try {
      await adminDeleteAthlete(athleteId);
      setAthletes((current) => current.filter((athlete) => athlete.id !== athleteId));
      setTotal((current) => Math.max(current - 1, 0));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Falha ao excluir atleta');
    } finally {
      setDeletingId(null);
    }
  }

  async function exportCsv() {
    setExporting(true);
    setError(null);

    try {
      const csv = await adminDownloadAthletesCsv();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'atletas.csv';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : 'Falha ao exportar atletas');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        kicker="Gestao de atletas"
        title="Atletas"
        description="Gestao cadastral com criacao, revisao, aprovacao e exportacao operacional das inscricoes."
        actions={
          <>
            <Button variant="outline" type="button" onClick={exportCsv} disabled={exporting}>
              {exporting ? 'Exportando...' : 'Exportar CSV'}
            </Button>
            <Button asChild>
              <a href="/admin/atletas/novo">Novo atleta</a>
            </Button>
          </>
        }
      />

      <AdminToolbar>
        <AdminToolbarGroup className="min-w-[180px] flex-1">
          <AdminField label="Status">
            <Select
              value={statusFilter || '__all__'}
              onValueChange={(value) => {
                setPage(1);
                setStatusFilter(value === '__all__' ? '' : value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="rejected">Rejeitados</SelectItem>
              </SelectContent>
            </Select>
          </AdminField>
        </AdminToolbarGroup>

        <AdminToolbarGroup className="min-w-[180px] flex-1">
          <AdminField label="Equipe">
            <Select
              value={teamIdFilter || '__all__'}
              onValueChange={(value) => {
                setPage(1);
                setTeamIdFilter(value === '__all__' ? '' : value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todas</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AdminField>
        </AdminToolbarGroup>

        <AdminToolbarGroup className="min-w-[260px] flex-[2]">
          <AdminField label="Busca por nome/CPF">
            <Input
              placeholder="Digite o nome ou CPF..."
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
            />
          </AdminField>
        </AdminToolbarGroup>
      </AdminToolbar>

      <AdminSurface
        title="Lista de atletas"
        description={`Total filtrado: ${total} atleta(s). A inclusao de novos atletas fica centralizada nesta propria pagina de gestao.`}
        actions={
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>
              Pagina {page} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((current) => current + 1)}
            >
              Proxima
            </Button>
          </div>
        }
      >
        {error ? <p className="mb-4 text-sm font-medium text-rose-700">{error}</p> : null}

        {loading ? (
          <AdminEmptyState
            title="Carregando..."
            description="Buscando registros de atletas no sistema."
          />
        ) : null}

        {!loading && athletes.length === 0 ? (
          <AdminEmptyState
            title="Nenhum atleta encontrado."
            description="Ajuste os filtros para ampliar a busca."
          />
        ) : null}

        {!loading && athletes.length > 0 ? (
          <AdminDataTable
            columns={[
              {
                key: 'nome',
                header: 'Nome',
                cell: (athlete) => (
                  <div className="space-y-1">
                    <a
                      href={`/admin/atletas/${athlete.id}`}
                      className="font-medium text-slate-950 hover:text-slate-700"
                    >
                      {athlete.name}
                    </a>
                    <p className="text-xs text-slate-500">{athlete.team?.name ?? 'Sem equipe'}</p>
                  </div>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                cell: (athlete) => (
                  <Badge variant={statusBadgeVariant(athlete.status)}>{athlete.status}</Badge>
                ),
              },
              {
                key: 'cpf',
                header: 'CPF',
                cell: (athlete) => <span className="text-slate-600">{athlete.cpf}</span>,
              },
              {
                key: 'modalidades',
                header: 'Modalidades',
                cell: (athlete) => (
                  <span className="text-sm text-slate-600">
                    {athlete.sports.map((sport) => sport.name).join(', ') || '—'}
                  </span>
                ),
              },
              {
                key: 'acoes',
                header: 'Acoes',
                className: 'text-right',
                cell: (athlete) => (
                  <div className="flex justify-end gap-2">
                    {athlete.status === 'pending' ? (
                      <>
                        <Button
                          size="sm"
                          type="button"
                          disabled={pendingActionId === athlete.id}
                          onClick={() => updateStatus(athlete.id, 'active')}
                        >
                          Aprovar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          disabled={pendingActionId === athlete.id}
                          onClick={() => updateStatus(athlete.id, 'rejected')}
                        >
                          Rejeitar
                        </Button>
                      </>
                    ) : null}
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      disabled={deletingId === athlete.id}
                      onClick={() => deleteAthlete(athlete.id)}
                    >
                      {deletingId === athlete.id ? '...' : 'Excluir'}
                    </Button>
                  </div>
                ),
              },
            ]}
            rows={athletes}
          />
        ) : null}
      </AdminSurface>
    </div>
  );
}
