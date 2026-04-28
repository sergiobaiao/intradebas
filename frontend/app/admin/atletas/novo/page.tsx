'use client';

import { FormEvent, useEffect, useState } from 'react';
import { CreateAthleteInput, SportSummary, TeamSummary, adminFetchJson, createAthleteRegistration } from '../../../lib';

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
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha ao criar atleta');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Atletas</span>
        <h1>Cadastro manual de atleta</h1>
        <p>Fluxo administrativo para registrar atletas diretamente no painel.</p>
        {error ? <p className="error-text">{error}</p> : null}
        {message ? <p className="success-text">{message}</p> : null}
        {loading ? <p>Carregando formulario...</p> : null}
        {!loading ? (
          <div className="card">
            <form className="form-grid" onSubmit={handleSubmit}>
              <label>
                <span>Nome completo</span>
                <input value={name} onChange={(event) => setName(event.target.value)} />
              </label>
              <label>
                <span>CPF</span>
                <input value={cpf} onChange={(event) => setCpf(event.target.value)} />
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
                <span>Equipe</span>
                <select value={teamId} onChange={(event) => setTeamId(event.target.value)}>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Tamanho da camiseta</span>
                <select value={shirtSize} onChange={(event) => setShirtSize(event.target.value as CreateAthleteInput['shirtSize'])}>
                  {shirtSizes.map((size) => (
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
                  {submitting ? 'Salvando...' : 'Criar atleta'}
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </main>
  );
}
