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

export function getAthletes() {
  return fetchJson<AthleteSummary[]>('/athletes', fallbackAthletes);
}

