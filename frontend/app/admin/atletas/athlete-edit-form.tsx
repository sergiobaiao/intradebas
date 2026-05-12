'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { AdminField } from '@/components/admin/field';
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
  AthleteSummary,
  SportSummary,
  TeamSummary,
  adminUpdateAthlete,
} from '../../lib';

type AthleteEditFormProps = {
  athlete: AthleteSummary;
  teams: TeamSummary[];
  sports: SportSummary[];
};

export function AthleteEditForm({
  athlete,
  teams,
  sports,
}: AthleteEditFormProps) {
  const router = useRouter();
  const [name, setName] = useState(athlete.name);
  const [email, setEmail] = useState(athlete.email ?? '');
  const [phone, setPhone] = useState(athlete.phone ?? '');
  const [birthDate, setBirthDate] = useState(String(athlete.birthDate).slice(0, 10));
  const [unit, setUnit] = useState(athlete.unit ?? '');
  const [teamId, setTeamId] = useState(athlete.team?.id ?? teams[0]?.id ?? '');
  const [shirtSize, setShirtSize] = useState<
    'PP' | 'P' | 'M' | 'G' | 'GG' | 'XGG'
  >(athlete.shirtSize);
  const [selectedSports, setSelectedSports] = useState(athlete.sports.map((sport) => sport.id));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
      await adminUpdateAthlete(athlete.id, {
        name,
        email: email || undefined,
        phone: phone || undefined,
        birthDate,
        unit: unit || undefined,
        teamId,
        shirtSize,
        sports: selectedSports,
      });
      setMessage('Atleta atualizado com sucesso.');
      router.refresh();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha ao atualizar atleta');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
      <AdminSurface
        title="Editar cadastro"
        description="Modifique as informacoes do atleta e vinculos com a equipe."
      >
        {error ? <p className="mb-4 text-sm font-medium text-rose-700">{error}</p> : null}
        {message ? <p className="mb-4 text-sm font-medium text-emerald-700">{message}</p> : null}

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Nome completo" className="md:col-span-2">
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </AdminField>
            <AdminField label="E-mail">
              <Input value={email} onChange={(event) => setEmail(event.target.value)} />
            </AdminField>
            <AdminField label="Telefone">
              <Input value={phone} onChange={(event) => setPhone(event.target.value)} />
            </AdminField>
            <AdminField label="Data de nascimento">
              <Input
                type="date"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
              />
            </AdminField>
            <AdminField label="Unidade / Lotacao">
              <Input value={unit} onChange={(event) => setUnit(event.target.value)} />
            </AdminField>
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
                onValueChange={(value) =>
                  setShirtSize(value as 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XGG')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['PP', 'P', 'M', 'G', 'GG', 'XGG'].map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AdminField>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={submitting || selectedSports.length === 0}>
              {submitting ? 'Salvando...' : 'Salvar alteracoes'}
            </Button>
          </div>
        </form>
      </AdminSurface>

      <AdminSurface title="Modalidades" description="Provas vinculadas ao atleta.">
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
    </div>
  );
}
