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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha ao criar atleta');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-screen-content">
      <header className="admin-topbar">
        <div>
          <span className="admin-kicker">Gestao de Atletas</span>
          <h1>Novo atleta</h1>
        </div>
      </header>

      {error ? (
        <div className="admin-panel" style={{ borderColor: 'rgba(230, 57, 70, 0.3)', marginBottom: '22px' }}>
          <p className="error-text">{error}</p>
        </div>
      ) : null}

      {message ? (
        <div className="admin-panel" style={{ borderColor: 'rgba(45, 106, 79, 0.3)', marginBottom: '22px' }}>
          <p className="success-text">{message}</p>
        </div>
      ) : null}

      {loading ? (
        <div className="admin-empty-state">
           <strong>Carregando formulario...</strong>
        </div>
      ) : (
        <form className="admin-content-grid" style={{ gridTemplateColumns: '1fr 0.6fr', alignItems: 'start' }} onSubmit={handleSubmit}>
          <section className="admin-panel">
            <div className="admin-panel-header">
               <h2>Dados Pessoais</h2>
               <p>Informacoes obrigatorias para registro do atleta.</p>
            </div>
            
            <div className="form-grid" style={{ marginTop: 0 }}>
              <label className="field-span">
                <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Nome completo</span>
                <input style={{ minHeight: '40px', borderRadius: '10px' }} value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex: Joao Silva" />
              </label>
              <label>
                <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>CPF</span>
                <input style={{ minHeight: '40px', borderRadius: '10px' }} value={cpf} onChange={(event) => setCpf(event.target.value)} placeholder="000.000.000-00" />
              </label>
              <label>
                <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Data de nascimento</span>
                <input style={{ minHeight: '40px', borderRadius: '10px' }} type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
              </label>
              <label>
                <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>E-mail</span>
                <input style={{ minHeight: '40px', borderRadius: '10px' }} value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="joao@exemplo.com" />
              </label>
              <label>
                <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Telefone</span>
                <input style={{ minHeight: '40px', borderRadius: '10px' }} value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(00) 00000-0000" />
              </label>
            </div>

            <div className="admin-panel-header" style={{ marginTop: '30px' }}>
               <h2>Vinculo e Kit</h2>
            </div>
            <div className="form-grid" style={{ marginTop: 0 }}>
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
                <select style={{ minHeight: '40px', borderRadius: '10px' }} value={shirtSize} onChange={(event) => setShirtSize(event.target.value as CreateAthleteInput['shirtSize'])}>
                  {shirtSizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="admin-topbar-actions field-span" style={{ justifyContent: 'flex-start', marginTop: '30px' }}>
               <button className="admin-quick-action" style={{ minHeight: '40px', padding: '0 30px' }} type="submit" disabled={submitting || selectedSports.length === 0}>
                {submitting ? 'Salvando...' : 'Criar atleta'}
              </button>
              <a className="admin-topbar-actions a" style={{ minHeight: '40px', padding: '0 20px' }} href="/admin/atletas">
                Cancelar
              </a>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-header">
               <h2>Modalidades</h2>
               <p>Selecione pelo menos uma prova.</p>
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
        </form>
      )}
    </div>
  );
}
