import { cookies } from 'next/headers';
import type {
  AthleteSummary,
  PublicAthleteSummary,
  TeamDetailSummary,
  TeamSummary,
} from '../lib';

async function adminServerFetchJson<T>(path: string, emptyValue: T): Promise<T> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const cookieStore = await cookies();

  try {
    const response = await fetch(`${apiBase}${path}`, {
      cache: 'no-store',
      headers: {
        cookie: cookieStore.toString(),
      },
    });

    if (!response.ok) {
      return emptyValue;
    }

    return (await response.json()) as T;
  } catch {
    return emptyValue;
  }
}

export function getAdminAthletes() {
  return adminServerFetchJson<AthleteSummary[]>('/athletes', []);
}

export function getAdminAthlete(id: string) {
  return adminServerFetchJson<AthleteSummary | null>(`/athletes/${id}`, null);
}

export function getAdminTeamAthletes(id: string) {
  return adminServerFetchJson<AthleteSummary[]>(`/teams/${id}/athletes`, []);
}

export function getAdminTeams() {
  return adminServerFetchJson<TeamSummary[]>('/teams', []);
}

export function getAdminTeam(id: string) {
  return adminServerFetchJson<TeamDetailSummary | null>(`/teams/${id}`, null);
}

export function getPublicAthletes() {
  return adminServerFetchJson<PublicAthleteSummary[]>('/athletes/public', []);
}
