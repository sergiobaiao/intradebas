export type TeamSummary = {
  id: string;
  name: string;
  color?: string | null;
  totalScore: number;
};

export type TeamDetailSummary = TeamSummary & {
  athletesCount: number;
};

export type AthleteSummary = {
  id: string;
  name: string;
  cpf: string;
  email?: string | null;
  phone?: string | null;
  birthDate?: string;
  type: string;
  status: string;
  unit?: string | null;
  shirtSize: 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XGG';
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

export type UpdateAthleteInput = {
  name?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  unit?: string;
  teamId?: string;
  shirtSize?: 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XGG';
  sports?: string[];
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

export type SponsorAdminSummary = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string | null;
  logoUrl?: string | null;
  status: 'pending' | 'active' | 'inactive';
  createdAt: string;
  couponCount: number;
  quota: {
    id: string;
    level: 'bronze' | 'prata' | 'ouro';
    price: number;
    courtesyCount: number;
  };
};

export type UpdateSponsorInput = {
  companyName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  logoUrl?: string;
  quotaId?: string;
  status?: 'pending' | 'active' | 'inactive';
};

export type CouponAdminSummary = {
  id: string;
  code: string;
  status: 'active' | 'used' | 'expired';
  createdAt: string;
  redeemedAt?: string | null;
  sponsor: {
    id: string;
    companyName: string;
  };
  athlete?: {
    id: string;
    name: string;
    cpf: string;
  } | null;
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
  description?: string | null;
  isAldebarun: boolean;
  isActive?: boolean;
  scheduleDate?: string | null;
  scheduleNotes?: string | null;
};

export type SportDetailSummary = SportSummary & {
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  results: ResultSummary[];
};

export type ResultSummary = {
  id: string;
  position: number;
  rawScore?: number | null;
  calculatedPoints?: number | null;
  resultDate: string;
  notes?: string | null;
  sport: { id: string; name: string; category: string };
  team: { id: string; name: string; color: string; totalScore: number };
};

export type ResultInput = {
  sportId: string;
  teamId: string;
  position: number;
  rawScore?: number;
  resultDate: string;
  notes?: string;
};

export type BulkResultInput = {
  items: ResultInput[];
};

export type ResultAuditLogSummary = {
  id: string;
  fieldChanged: string;
  oldValue?: string | null;
  newValue?: string | null;
  changedAt: string;
  changer: {
    id: string;
    name: string;
    email: string;
  };
  result: {
    id: string;
    sport: {
      id: string;
      name: string;
    };
    team?: {
      id: string;
      name: string;
    } | null;
  };
};

export type AuditLogSummary = {
  id: string;
  entityType: string;
  entityId: string;
  entityLabel?: string | null;
  action: string;
  fieldChanged?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
  changedAt: string;
  changer: {
    id: string;
    name: string;
    email: string;
  };
};

export type LgpdDeletionRequestSummary = {
  id: string;
  athleteCpf: string;
  requesterName: string;
  email?: string | null;
  phone?: string | null;
  reason?: string | null;
  status: 'pending' | 'in_review' | 'resolved' | 'rejected';
  adminNotes?: string | null;
  requestedAt: string;
  reviewedAt?: string | null;
  athlete?: {
    id: string;
    name: string;
    status: string;
    team?: {
      id: string;
      name: string;
    } | null;
  } | null;
  reviewer?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export type CreateLgpdDeletionRequestInput = {
  requesterName: string;
  athleteCpf: string;
  email?: string;
  phone?: string;
  reason?: string;
};

export type MediaAdminSummary = {
  id: string;
  type: 'photo' | 'video';
  title?: string | null;
  url: string;
  thumbnailUrl?: string | null;
  provider: 'local' | 'youtube' | 'vimeo';
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  uploader: {
    id: string;
    name: string;
    email: string;
  };
};

export type CreateMediaInput = {
  type: 'photo' | 'video';
  title?: string;
  url: string;
  thumbnailUrl?: string;
  provider: 'local' | 'youtube' | 'vimeo';
  isFeatured?: boolean;
  sortOrder?: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ScoringConfigSummary = {
  id: string;
  category: string;
  position: number;
  points: number;
  updatedByUser: {
    id: string;
    name: string;
    email: string;
  };
};

export type CreateScoringConfigInput = {
  category: 'coletiva' | 'individual' | 'dupla' | 'fitness';
  position: number;
  points: number;
};

export type UpdateTeamInput = {
  name?: string;
  color?: string;
};

export type UpdateSportInput = {
  name?: string;
  description?: string;
  isActive?: boolean;
  scheduleDate?: string;
  scheduleNotes?: string;
};

export type CreateSportInput = {
  name: string;
  category: 'coletiva' | 'individual' | 'dupla' | 'fitness';
  description?: string;
  isAldebarun?: boolean;
  isActive?: boolean;
  scheduleDate?: string;
  scheduleNotes?: string;
};

export type UpdateMediaInput = {
  title?: string;
  isFeatured?: boolean;
  sortOrder?: number;
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

async function fetchJson<T>(path: string, emptyValue: T): Promise<T> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

  try {
    const response = await fetch(`${apiBase}${path}`, {
      next: {
        revalidate: 30,
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

export function getTeams() {
  return fetchJson<TeamSummary[]>('/teams', []);
}

export function getTeam(id: string) {
  return fetchJson<TeamDetailSummary | null>(`/teams/${id}`, null);
}

export function getTeamAthletes(id: string) {
  return fetchJson<AthleteSummary[]>(`/teams/${id}/athletes`, []);
}

export function getRanking() {
  return fetchJson<RankingRow[]>('/results/ranking', []);
}

export function getResults() {
  return fetchJson<ResultSummary[]>('/results', []);
}

export function getAthletes() {
  return fetchJson<AthleteSummary[]>('/athletes', []);
}

export function getSponsorshipQuotas() {
  return fetchJson<SponsorshipQuotaSummary[]>('/sponsorship/quotas', []);
}

export function getSports() {
  return fetchJson<SportSummary[]>('/sports', []);
}

export function getBackdropSponsors() {
  return fetchJson<BackdropSponsorSummary[]>('/backdrop', []);
}

export function getAthlete(id: string) {
  return fetchJson<AthleteSummary | null>(`/athletes/${id}`, null);
}

export function getSport(id: string) {
  return fetchJson<SportDetailSummary | null>(`/sports/${id}`, null);
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

export async function createLgpdDeletionRequest(input: CreateLgpdDeletionRequestInput) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

  const response = await fetch(`${apiBase}/lgpd/deletion-requests`, {
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
    const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
    throw new Error(message ?? 'Falha ao registrar solicitacao LGPD');
  }

  return (await response.json()) as LgpdDeletionRequestSummary;
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

function buildQuery(params: Record<string, string | number | undefined | null>) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === '') {
      continue;
    }

    query.set(key, String(value));
  }

  const serialized = query.toString();
  return serialized ? `?${serialized}` : '';
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

export function adminUpdateAthlete(athleteId: string, input: UpdateAthleteInput) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/athletes/${athleteId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao atualizar atleta');
    }

    return (await response.json()) as AthleteSummary;
  });
}

export function adminDeleteAthlete(athleteId: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/athletes/${athleteId}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao excluir atleta');
    }

    return (await response.json()) as { id: string; deleted: true };
  });
}

export function adminCreateResult(input: ResultInput) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/results`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao lancar resultado');
    }

    return (await response.json()) as ResultSummary;
  });
}

export function adminCreateResultsBulk(input: BulkResultInput) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/results/bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao lancar resultados em lote');
    }

    return (await response.json()) as ResultSummary[];
  });
}

export function adminUpdateResult(resultId: string, input: Partial<ResultInput>) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/results/${resultId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao corrigir resultado');
    }

    return (await response.json()) as ResultSummary;
  });
}

export function adminGetResultAuditLogs() {
  return adminFetchJson<ResultAuditLogSummary[]>('/results/audit');
}

export function adminGetAuditLogs(entityType?: string) {
  return adminFetchJson<AuditLogSummary[]>(
    `/audit${buildQuery({ entityType })}`,
  );
}

export function adminGetLgpdDeletionRequests(status?: string) {
  return adminFetchJson<LgpdDeletionRequestSummary[]>(
    `/lgpd/deletion-requests${buildQuery({ status })}`,
  );
}

export function adminUpdateLgpdDeletionRequest(
  requestId: string,
  input: {
    status?: 'pending' | 'in_review' | 'resolved' | 'rejected';
    adminNotes?: string;
  },
) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/lgpd/deletion-requests/${requestId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao atualizar solicitacao LGPD');
    }

    return (await response.json()) as LgpdDeletionRequestSummary;
  });
}

export function adminGetAthleteReviewPage(input: {
  page?: number;
  pageSize?: number;
  status?: string;
  teamId?: string;
  search?: string;
}) {
  return adminFetchJson<PaginatedResponse<AthleteSummary>>(
    `/athletes/admin/review${buildQuery(input)}`,
  );
}

export function adminGetResultsPage(input: {
  page?: number;
  pageSize?: number;
  teamId?: string;
  sportId?: string;
}) {
  return adminFetchJson<PaginatedResponse<ResultSummary>>(
    `/results/admin${buildQuery(input)}`,
  );
}

export function adminGetSponsors() {
  return adminFetchJson<SponsorAdminSummary[]>('/sponsors');
}

export function adminGetSponsorsPage(input: {
  page?: number;
  pageSize?: number;
  status?: string;
}) {
  return adminFetchJson<PaginatedResponse<SponsorAdminSummary>>(
    `/sponsors${buildQuery(input)}`,
  );
}

export function adminGetCoupons() {
  return adminFetchJson<CouponAdminSummary[]>('/coupons');
}

export function adminGetCouponsPage(input: {
  page?: number;
  pageSize?: number;
  status?: string;
  sponsorId?: string;
}) {
  return adminFetchJson<PaginatedResponse<CouponAdminSummary>>(
    `/coupons${buildQuery(input)}`,
  );
}

export function adminGetSponsorCoupons(sponsorId: string) {
  return adminFetchJson<CouponAdminSummary[]>(`/sponsors/${sponsorId}/coupons`);
}

export function adminCreateSponsorCoupon(sponsorId: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/sponsors/${sponsorId}/coupons`, {
    method: 'POST',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao gerar cupom');
    }

    return (await response.json()) as CouponAdminSummary;
  });
}

export function adminActivateSponsor(sponsorId: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/sponsors/${sponsorId}/activate`, {
    method: 'PATCH',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao ativar patrocinador');
    }

    return (await response.json()) as {
      id: string;
      status: 'active' | 'pending' | 'inactive';
      couponsGenerated: number;
    };
  });
}

export function adminExpireCoupon(couponId: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/coupons/${couponId}/expire`, {
    method: 'PATCH',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao expirar cupom');
    }

    return (await response.json()) as CouponAdminSummary;
  });
}

export function adminUpdateSponsor(sponsorId: string, input: UpdateSponsorInput) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/sponsors/${sponsorId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao atualizar patrocinador');
    }

    return (await response.json()) as SponsorAdminSummary;
  });
}

export function adminGetMedia() {
  return adminFetchJson<MediaAdminSummary[]>('/media');
}

export function adminGetMediaPage(input: {
  page?: number;
  pageSize?: number;
  provider?: string;
  featured?: string;
}) {
  return adminFetchJson<PaginatedResponse<MediaAdminSummary>>(
    `/media${buildQuery(input)}`,
  );
}

export function adminCreateMedia(input: CreateMediaInput) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/media`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao criar midia');
    }

    return (await response.json()) as MediaAdminSummary;
  });
}

export function adminUploadMedia(file: File, input: {
  title?: string;
  isFeatured?: boolean;
  sortOrder?: number;
}) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();
  const formData = new FormData();

  formData.set('file', file);

  if (input.title) {
    formData.set('title', input.title);
  }

  if (typeof input.isFeatured === 'boolean') {
    formData.set('isFeatured', String(input.isFeatured));
  }

  if (typeof input.sortOrder === 'number') {
    formData.set('sortOrder', String(input.sortOrder));
  }

  return fetch(`${apiBase}/media/upload`, {
    method: 'POST',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
    body: formData,
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao enviar midia');
    }

    return (await response.json()) as MediaAdminSummary;
  });
}

export function adminUpdateMedia(mediaId: string, input: UpdateMediaInput) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/media/${mediaId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao atualizar midia');
    }

    return (await response.json()) as MediaAdminSummary;
  });
}

export function adminDeleteMedia(mediaId: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/media/${mediaId}`, {
    method: 'DELETE',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao remover midia');
    }

    return (await response.json()) as { id: string; deleted: true };
  });
}

export function adminGetScoringConfig() {
  return adminFetchJson<ScoringConfigSummary[]>('/settings/scoring');
}

export function adminCreateScoringConfig(input: CreateScoringConfigInput) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/settings/scoring`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao criar configuracao');
    }

    return (await response.json()) as ScoringConfigSummary;
  });
}

export function adminUpdateTeam(teamId: string, input: UpdateTeamInput) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/teams/${teamId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao atualizar equipe');
    }

    return (await response.json()) as TeamSummary;
  });
}

export function adminDeleteTeam(teamId: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/teams/${teamId}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao excluir equipe');
    }

    return (await response.json()) as { id: string; deleted: true };
  });
}

export function adminCreateTeam(input: { name: string; color?: string }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/teams`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao criar equipe');
    }

    return (await response.json()) as TeamSummary;
  });
}

export function adminCreateSport(input: CreateSportInput) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/sports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao criar modalidade');
    }

    return (await response.json()) as SportSummary;
  });
}

export function adminUpdateSport(sportId: string, input: UpdateSportInput) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/sports/${sportId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao atualizar modalidade');
    }

    return (await response.json()) as SportSummary;
  });
}

export function adminDeleteSport(sportId: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/sports/${sportId}`, {
    method: 'DELETE',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao excluir modalidade');
    }

    return (await response.json()) as { id: string; deleted: true };
  });
}

export function adminUpdateScoringConfig(rowId: string, points: number) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/settings/scoring/${rowId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ points }),
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao atualizar configuracao');
    }

    return (await response.json()) as ScoringConfigSummary;
  });
}

export function adminDeleteScoringConfig(rowId: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  return fetch(`${apiBase}/settings/scoring/${rowId}`, {
    method: 'DELETE',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  }).then(async (response) => {
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
      throw new Error(message ?? 'Falha ao remover configuracao');
    }

    return (await response.json()) as { id: string; deleted: true };
  });
}

export async function adminDownloadAthletesCsv() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const token = getAdminTokenFromCookie();

  const response = await fetch(`${apiBase}/athletes/export`, {
    method: 'GET',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: string | string[] }
      | null;
    const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
    throw new Error(message ?? 'Falha ao exportar atletas');
  }

  return response.text();
}
