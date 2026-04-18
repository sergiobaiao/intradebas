export type TeamSummary = {
  id: string;
  name: string;
  color: string;
  totalScore: number;
};

export type AthleteSummary = {
  id: string;
  name: string;
  cpf: string;
  type: string;
  status: string;
  shirtSize: string;
  team?: TeamSummary;
  sports: { id: string; name: string; category: string }[];
};

export type CreateAthleteInput = {
  name: string;
  cpf: string;
  email?: string;
  phone?: string;
  birthDate: string;
  unit?: string;
  type: 'titular' | 'familiar' | 'convidado';
  titularId?: string;
  teamId: string;
  shirtSize: 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XGG';
  sports: string[];
  lgpdConsent: boolean;
  couponCode?: string;
};

export type SponsorshipQuotaSummary = {
  id: string;
  level: 'bronze' | 'prata' | 'ouro';
  price: number;
  maxSlots: number;
  usedSlots: number;
  remainingSlots: number;
  courtesyCount: number;
  benefits?: string | null;
  backdropPriority: number;
};

export type BackdropSponsorSummary = {
  id: string;
  companyName: string;
  logoUrl?: string | null;
  level: 'bronze' | 'prata' | 'ouro';
  backdropPriority: number;
};

export type RankingRow = {
  id: string;
  name: string;
  color?: string | null;
  totalScore: number;
};

export type SportSummary = {
  id: string;
  name: string;
  category: string;
  isAldebarun: boolean;
};

function getAdminTokenFromCookie() {
  if (typeof document === 'undefined') {
    return null;
  }

  const entry = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('intradebas_admin_token='));

  return entry ? decodeURIComponent(entry.split('=').slice(1).join('=')) : null;
}

const fallbackTeams: TeamSummary[] = [
  { id: 'team-mucura', name: 'Mucura', color: '#E63946', totalScore: 18 },
  { id: 'team-jacare', name: 'Jacare', color: '#2D6A4F', totalScore: 14 },
  { id: 'team-capivara', name: 'Capivara', color: '#E9C46A', totalScore: 11 },
];

const fallbackAthletes: AthleteSummary[] = [
  {
    id: 'athlete-1',
    name: 'Marina Carvalho',
    cpf: '111.222.333-44',
    type: 'titular',
    status: 'active',
    shirtSize: 'M',
    team: fallbackTeams[0],
    sports: [{ id: 'sport-corrida', name: 'ALDEBARUN 5K', category: 'individual' }],
  },
  {
    id: 'athlete-2',
    name: 'Rafael Nunes',
    cpf: '555.666.777-88',
    type: 'titular',
    status: 'active',
    shirtSize: 'G',
    team: fallbackTeams[1],
    sports: [{ id: 'sport-futsal', name: 'Futsal', category: 'coletiva' }],
  },
  {
    id: 'athlete-3',
    name: 'Livia Rocha',
    cpf: '999.000.111-22',
    type: 'convidado',
    status: 'pending',
    shirtSize: 'P',
    team: fallbackTeams[2],
    sports: [{ id: 'sport-corrida', name: 'ALDEBARUN 5K', category: 'individual' }],
  },
];

const fallbackSports: SportSummary[] = [
  { id: 'sport-futsal', name: 'Futsal', category: 'coletiva', isAldebarun: false },
  {
    id: 'sport-aldebarun-5k',
    name: 'ALDEBARUN 5K',
    category: 'individual',
    isAldebarun: true,
  },
  { id: 'sport-futevolei', name: 'Futevolei', category: 'dupla', isAldebarun: false },
];

async function fetchJson<T>(path: string, fallback: T): Promise<T> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

  try {
    const response = await fetch(`${apiBase}${path}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return fallback;
    }

    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export function getTeams() {
  return fetchJson<TeamSummary[]>('/teams', fallbackTeams);
}

export function getRanking() {
  return fetchJson<RankingRow[]>(
    '/results/ranking',
    fallbackTeams
      .map((team) => ({
        id: team.id,
        name: team.name,
        color: team.color,
        totalScore: team.totalScore,
      }))
      .sort((left, right) => right.totalScore - left.totalScore),
  );
}

export function getAthletes() {
  return fetchJson<AthleteSummary[]>('/athletes', fallbackAthletes);
}

export function getSponsorshipQuotas() {
  return fetchJson<SponsorshipQuotaSummary[]>('/sponsorship/quotas', []);
}

export function getSports() {
  return fetchJson<SportSummary[]>('/sports', fallbackSports);
}

export function getBackdropSponsors() {
  return fetchJson<BackdropSponsorSummary[]>('/backdrop', []);
}

export async function createSponsorInterest(input: {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  quotaId: string;
  logoUrl?: string;
}) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

  const response = await fetch(`${apiBase}/sponsors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;
    throw new Error(body?.message ?? 'Falha ao registrar interesse de patrocinio');
  }

  return response.json();
}

export async function createAthleteRegistration(input: CreateAthleteInput) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

  const response = await fetch(`${apiBase}/athletes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: string | string[] }
      | null;
    const message = Array.isArray(body?.message)
      ? body?.message[0]
      : body?.message;
    throw new Error(message ?? 'Falha ao concluir inscricao');
  }

  return (await response.json()) as AthleteSummary;
}

export async function adminFetchJson<T>(path: string): Promise<T> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  const response = await fetch(`${apiBase}${path}`, {
    cache: 'no-store',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;
    throw new Error(body?.message ?? `Erro na requisicao admin para ${path}`);
  }

  return (await response.json()) as T;
}

export function adminUpdateAthleteStatus(
  athleteId: string,
  status: 'active' | 'rejected',
) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/athletes/${athleteId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ status }),
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;
      throw new Error(body?.message ?? 'Falha ao atualizar status do atleta');
    }

    return (await response.json()) as AthleteSummary;
  });
}
