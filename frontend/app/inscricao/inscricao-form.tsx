'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  AthleteSummary,
  CreateAthleteInput,
  SportSummary,
  TeamSummary,
  createAthleteRegistration,
} from '../lib';

const shirtSizes: CreateAthleteInput['shirtSize'][] = ['PP', 'P', 'M', 'G', 'GG', 'XGG'];
const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

type InscricaoFormProps = {
  teams: TeamSummary[];
  sports: SportSummary[];
};

export function InscricaoForm({ teams, sports }: InscricaoFormProps) {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [unit, setUnit] = useState('');
  const [type, setType] = useState<CreateAthleteInput['type']>('titular');
  const [titularId, setTitularId] = useState('');
  const [teamId, setTeamId] = useState(teams[0]?.id ?? '');
  const [shirtSize, setShirtSize] = useState<CreateAthleteInput['shirtSize']>('M');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [createdAthlete, setCreatedAthlete] = useState<AthleteSummary | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!recaptchaSiteKey || document.querySelector('[data-recaptcha-script="true"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
    script.async = true;
    script.defer = true;
    script.dataset.recaptchaScript = 'true';
    document.head.appendChild(script);
  }, []);

  const requiresTitular = type !== 'titular';
  const canSubmit = useMemo(
    () =>
      Boolean(
        name &&
          cpf &&
          email &&
          birthDate &&
          teamId &&
          selectedSports.length > 0 &&
          lgpdConsent &&
          (!requiresTitular || titularId),
      ),
    [birthDate, cpf, email, lgpdConsent, name, requiresTitular, selectedSports.length, teamId, titularId],
  );

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
      const recaptchaToken = recaptchaSiteKey
        ? await new Promise<string>((resolve, reject) => {
            if (!window.grecaptcha) {
              reject(new Error('reCAPTCHA ainda nao carregou. Tente novamente.'));
              return;
            }

            window.grecaptcha?.ready(() => {
              window.grecaptcha
                ?.execute(recaptchaSiteKey, { action: 'athlete_registration' })
                .then(resolve)
                .catch(reject);
            });
          })
        : undefined;
      const athlete = await createAthleteRegistration({
        name,
        cpf,
        email,
        phone: phone || undefined,
        birthDate,
        unit: unit || undefined,
        type,
        titularId: requiresTitular ? titularId : undefined,
        teamId,
        shirtSize,
        sports: selectedSports,
        lgpdConsent,
        couponCode: couponCode || undefined,
        recaptchaToken,
      });

      setCreatedAthlete(athlete);
      setMessage(
        couponCode
          ? 'Inscricao recebida, cupom resgatado e e-mail de confirmacao enviado.'
          : 'Inscricao recebida. Confirme seu e-mail para liberar a area do atleta.',
      );
      setName('');
      setCpf('');
      setEmail('');
      setPhone('');
      setBirthDate('');
      setUnit('');
      setType('titular');
      setTitularId('');
      setTeamId(teams[0]?.id ?? '');
      setShirtSize('M');
      setSelectedSports([]);
      setCouponCode('');
      setLgpdConsent(false);
    } catch (submitError) {
      setCreatedAthlete(null);
      setError(submitError instanceof Error ? submitError.message : 'Falha ao concluir inscricao');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        <span>Nome completo</span>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Joao Silva Santos" />
      </label>

      <label>
        <span>CPF</span>
        <input value={cpf} onChange={(event) => setCpf(event.target.value)} placeholder="000.000.000-00" />
      </label>

      <label>
        <span>E-mail</span>
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@exemplo.com" />
      </label>

      <label>
        <span>Telefone</span>
        <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(86) 99999-0000" />
      </label>

      <label>
        <span>Data de nascimento</span>
        <input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
      </label>

      <label>
        <span>Tipo de inscricao</span>
        <select value={type} onChange={(event) => setType(event.target.value as CreateAthleteInput['type'])}>
          <option value="titular">Titular</option>
          <option value="familiar">Familiar</option>
          <option value="convidado">Convidado</option>
        </select>
      </label>

      {requiresTitular ? (
        <label className="field-span">
          <span>ID do titular responsavel</span>
          <input
            value={titularId}
            onChange={(event) => setTitularId(event.target.value)}
            placeholder="UUID do titular ja cadastrado"
          />
        </label>
      ) : null}

      <label>
        <span>Equipe</span>
        <select value={teamId} onChange={(event) => setTeamId(event.target.value)}>
          <option value="" disabled>
            Selecione uma equipe
          </option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Tamanho da camiseta</span>
        <select value={shirtSize} onChange={(event) => setShirtSize(event.target.value as CreateAthleteInput['shirtSize'])}>
          {shirtSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>

      <label className="field-span">
        <span>Unidade residencial</span>
        <input value={unit} onChange={(event) => setUnit(event.target.value)} placeholder="Bloco, apartamento ou casa" />
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

      <label className="field-span">
        <span>Cupom de cortesia</span>
        <input
          value={couponCode}
          onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
          placeholder="Opcional para convidados e cortesias"
        />
      </label>

      <label className="checkbox-row field-span">
        <input type="checkbox" checked={lgpdConsent} onChange={(event) => setLgpdConsent(event.target.checked)} />
        <span>
          Autorizo o tratamento dos meus dados pessoais conforme a politica de privacidade e regras LGPD do evento.
        </span>
      </label>

      {message ? <p className="success-text field-span">{message}</p> : null}
      {error ? <p className="error-text field-span">{error}</p> : null}
      {createdAthlete ? (
        <p className="field-span">
          Protocolo: <strong>{createdAthlete.id}</strong> | Status: <strong>{createdAthlete.status}</strong>
        </p>
      ) : null}

      <div className="field-span cta-row">
        <button type="submit" className="button primary" disabled={!canSubmit || submitting}>
          {submitting ? 'Enviando inscricao...' : 'Enviar inscricao'}
        </button>
        <a className="button secondary" href="/privacidade">
          Ver politica LGPD
        </a>
      </div>
    </form>
  );
}
