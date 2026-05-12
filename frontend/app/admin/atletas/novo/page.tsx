'use client';

import { FormEvent, useEffect, useState } from 'react';

import { AdminEmptyState } from '@/components/admin/empty-state';
import { AdminField } from '@/components/admin/field';
import { AdminPageHeader } from '@/components/admin/page-header';
import { AdminSurface } from '@/components/admin/surface';
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
  CreateAthleteInput,
  SportSummary,
  TeamSummary,
  adminFetchJson,
  createAthleteRegistration,
} from '../../../lib';

const shirtSizes: CreateAthleteInput['shirtSize'][] = ['PP', 'P', 'M', 'G', 'GG', 'XGG'];

export default function AdminNovoAtletaPage() {
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [sports, setSports] = useState<SportSummary[]>([]);
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [teamId, setTeamId] = useState('');
  const [shirtSize, setShirtSize] = useState<CreateAthleteInput['shirtSize']>('M');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [loadedTeams, loadedSports] = await Promise.all([
        adminFetchJson<TeamSummary[]>('/teams'),
        adminFetchJson<SportSummary[]>('/sports'),
      ]);
      setTeams(loadedTeams);
      setSports(loadedSports);
      setTeamId(loadedTeams[0]?.id ?? '');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar formulario');
    } finally {
      setLoading(false);
    }
  }

  function toggleSport(sportId: string) {
    setSelectedSports((current) =>
      current.includes(sportId)
        ? current.filter((item) => item !== sportId)
        : [...current, sportId],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await createAthleteRegistration({
        name,
        cpf,
        email,
        phone: phone || undefined,
        birthDate,
        type: 'titular',
        teamId,
        shirtSize,
        sports: selectedSports,
        lgpdConsent: true,
      });
      setMessage('Atleta criado com sucesso.');
      setName('');
      setCpf('');
      setEmail('');
      setPhone('');
      setBirthDate('');
      setSelectedSports([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha ao criar atleta');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        kicker="Gestao de atletas"
        title="Novo atleta"
        description="Cadastro manual de atleta com vinculo de equipe, kit e modalidades."
      />

      {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}
      {message ? <p className="text-sm font-medium text-emerald-700">{message}</p> : null}

      {loading ? (
        <AdminEmptyState title="Carregando formulario..." description="Preparando equipes e modalidades." />
      ) : (
        <form className="grid gap-6 xl:grid-cols-[1fr_0.7fr]" onSubmit={handleSubmit}>
          <AdminSurface title="Dados pessoais" description="Informacoes obrigatorias para registro do atleta.">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Nome completo" className="md:col-span-2">
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ex: Joao Silva"
                />
              </AdminField>
              <AdminField label="CPF">
                <Input
                  value={cpf}
                  onChange={(event) => setCpf(event.target.value)}
                  placeholder="000.000.000-00"
                />
              </AdminField>
              <AdminField label="Data de nascimento">
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(event) => setBirthDate(event.target.value)}
                />
              </AdminField>
              <AdminField label="E-mail">
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="joao@exemplo.com"
                />
              </AdminField>
              <AdminField label="Telefone">
                <Input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </AdminField>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <AdminField label="Equipe">
                <Select value={teamId} onValueChange={setTeamId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AdminField>
              <AdminField label="Tamanho da camiseta">
                <Select
                  value={shirtSize}
                  onValueChange={(value) => setShirtSize(value as CreateAthleteInput['shirtSize'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {shirtSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AdminField>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button type="submit" disabled={submitting || selectedSports.length === 0}>
                {submitting ? 'Salvando...' : 'Criar atleta'}
              </Button>
              <Button asChild variant="outline">
                <a href="/admin/atletas">Cancelar</a>
              </Button>
            </div>
          </AdminSurface>

          <AdminSurface title="Modalidades" description="Selecione pelo menos uma prova.">
            <div className="grid gap-3">
              {sports.map((sport) => {
                const selected = selectedSports.includes(sport.id);

                return (
                  <button
                    key={sport.id}
                    type="button"
                    onClick={() => toggleSport(sport.id)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                      selected
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                        : 'border-border/70 bg-slate-50/70 text-slate-700'
                    }`}
                  >
                    <span className="font-medium">{sport.name}</span>
                    <Badge variant={selected ? 'success' : 'outline'}>
                      {selected ? 'Selecionada' : 'Selecionar'}
                    </Badge>
                  </button>
                );
              })}
            </div>
            {selectedSports.length === 0 ? (
              <p className="mt-4 text-xs font-medium text-rose-700">
                * Selecione pelo menos uma modalidade.
              </p>
            ) : null}
          </AdminSurface>
        </form>
      )}
    </div>
  );
}
