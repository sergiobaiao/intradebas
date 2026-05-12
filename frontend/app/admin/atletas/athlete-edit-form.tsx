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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha ao atualizar atleta');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-content-grid" style={{ gridTemplateColumns: '1fr 0.6fr', alignItems: 'start' }}>
      <section className="admin-panel">
        <div className="admin-panel-header">
           <h2>Editar Cadastro</h2>
           <p>Modifique as informacoes do atleta e vinculos com a equipe.</p>
        </div>

        {error ? (
          <div style={{ marginBottom: '20px' }}>
            <p className="error-text">{error}</p>
          </div>
        ) : null}
        {message ? (
          <div style={{ marginBottom: '20px' }}>
            <p className="success-text">{message}</p>
          </div>
        ) : null}

        <form className="form-grid" style={{ marginTop: 0 }} onSubmit={handleSubmit}>
          <label className="field-span">
            <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Nome completo</span>
            <input style={{ minHeight: '40px', borderRadius: '10px' }} value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>E-mail</span>
            <input style={{ minHeight: '40px', borderRadius: '10px' }} value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Telefone</span>
            <input style={{ minHeight: '40px', borderRadius: '10px' }} value={phone} onChange={(event) => setPhone(event.target.value)} />
          </label>
          <label>
            <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Data de nascimento</span>
            <input style={{ minHeight: '40px', borderRadius: '10px' }} type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
          </label>
          <label>
            <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Unidade / Lotação</span>
            <input style={{ minHeight: '40px', borderRadius: '10px' }} value={unit} onChange={(event) => setUnit(event.target.value)} />
          </label>
          <label>
            <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Equipe</span>
            <select style={{ minHeight: '40px', borderRadius: '10px' }} value={teamId} onChange={(event) => setTeamId(event.target.value)}>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Tamanho da camiseta</span>
            <select
              style={{ minHeight: '40px', borderRadius: '10px' }}
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
          <div className="field-span admin-topbar-actions" style={{ justifyContent: 'flex-start', marginTop: '20px' }}>
            <button className="admin-quick-action" style={{ minHeight: '40px', padding: '0 30px' }} type="submit" disabled={submitting || selectedSports.length === 0}>
              {submitting ? 'Salvando...' : 'Salvar alteracoes'}
            </button>
          </div>
        </form>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
           <h2>Modalidades</h2>
           <p>Provas vinculadas ao atleta.</p>
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          {sports.map((sport) => (
            <label key={sport.id} className="checkbox-row" style={{ background: selectedSports.includes(sport.id) ? 'rgba(45, 106, 79, 0.05)' : 'transparent', padding: '10px', borderRadius: '8px', border: '1px solid rgba(17, 24, 39, 0.05)' }}>
              <input
                type="checkbox"
                checked={selectedSports.includes(sport.id)}
                onChange={() => toggleSport(sport.id)}
              />
              <span className="admin-kicker" style={{ textTransform: 'none', fontSize: '0.85rem' }}>{sport.name}</span>
            </label>
          ))}
        </div>
        {selectedSports.length === 0 && (
           <p style={{ marginTop: '12px', fontSize: '0.75rem', color: '#e63946' }}>* Selecione pelo menos uma modalidade.</p>
        )}
      </section>
    </div>
  );
}
