'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
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
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha ao atualizar atleta');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <h2>Editar cadastro</h2>
      {error ? <p className="error-text">{error}</p> : null}
      {message ? <p className="success-text">{message}</p> : null}
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          <span>Nome</span>
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          <span>E-mail</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          <span>Telefone</span>
          <input value={phone} onChange={(event) => setPhone(event.target.value)} />
        </label>
        <label>
          <span>Data de nascimento</span>
          <input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
        </label>
        <label>
          <span>Unidade</span>
          <input value={unit} onChange={(event) => setUnit(event.target.value)} />
        </label>
        <label>
          <span>Equipe</span>
          <select value={teamId} onChange={(event) => setTeamId(event.target.value)}>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Tamanho da camiseta</span>
          <select
            value={shirtSize}
            onChange={(event) =>
              setShirtSize(
                event.target.value as 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XGG',
              )
            }
          >
            {['PP', 'P', 'M', 'G', 'GG', 'XGG'].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </label>
        <fieldset className="field-span">
          <legend>Modalidades</legend>
          <div className="checkbox-grid">
            {sports.map((sport) => (
              <label key={sport.id} className="checkbox-row">
                <input
                  type="checkbox"
                  checked={selectedSports.includes(sport.id)}
                  onChange={() => toggleSport(sport.id)}
                />
                <span>{sport.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="field-span cta-row">
          <button className="button primary" type="submit" disabled={submitting || selectedSports.length === 0}>
            {submitting ? 'Salvando...' : 'Salvar alteracoes'}
          </button>
        </div>
      </form>
    </div>
  );
}
