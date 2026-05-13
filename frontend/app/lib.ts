export type TeamSummary = {
  id: string;
  name: string;
  color?: string | null;
  totalScore: number;
};

export type AdminUserSummary = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
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

export type PublicAthleteSummary = {
  id: string;
  name: string;
  team?: TeamSummary;
  sports: { id: string; name: string; category: string }[];
};

export type CreateAthleteInput = {
  name: string;
  cpf: string;
  email: string;
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
  recaptchaToken?: string;
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

export type AthletePortalSession = {
  athlete: AthleteSummary;
  emailVerifiedAt?: string | null;
  lgpd: {
    consent: boolean;
    consentAt?: string | null;
    policyVersion: string;
  };
  results: Array<{
    id: string;
    position?: number | null;
    rawScore?: number | null;
    calculatedPoints?: number | null;
    resultDate: string;
    notes?: string | null;
    sport: { id: string; name: string; category: string };
    team?: { id: string; name: string; color?: string | null; totalScore: number } | null;
  }>;
  coupons: Array<{
    id: string;
    code: string;
    status: 'active' | 'used' | 'expired';
    redeemedAt?: string | null;
    sponsor: { id: string; companyName: string };
  }>;
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

export type SponsorPortalCouponSummary = {
  id: string;
  code: string;
  status: 'active' | 'used' | 'expired';
  createdAt: string;
  redeemedAt?: string | null;
  athlete?: {
    id: string;
    name: string;
    cpf: string;
  } | null;
};

export type SponsorPortalSession = {
  sponsor: {
    id: string;
    companyName: string;
    contactName: string;
    email: string;
    phone?: string | null;
    logoUrl?: string | null;
    status: 'pending' | 'active' | 'inactive';
    paymentDate?: string | null;
    paymentNotes?: string | null;
    createdAt: string;
    quota: {
      id: string;
      level: 'bronze' | 'prata' | 'ouro';
      price: number;
      courtesyCount: number;
      benefits?: string | null;
      backdropPriority: number;
    };
  };
  coupons: SponsorPortalCouponSummary[];
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

export type AldebarunResultSummary = {
  id: string;
  position: number;
  rawScore?: number | null;
  calculatedPoints?: number | null;
  resultDate: string;
  notes?: string | null;
  sport: {
    id: string;
    name: string;
    category: string;
    description?: string | null;
    scheduleDate?: string | null;
    scheduleNotes?: string | null;
  };
  team?: {
    id: string;
    name: string;
    color: string;
    totalScore: number;
  } | null;
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

export type PublicMediaSummary = {
  id: string;
  type: 'photo' | 'video';
  title?: string | null;
  url: string;
  thumbnailUrl?: string | null;
  provider: 'local' | 'youtube' | 'vimeo';
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
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

export type CreateAdminUserInput = {
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  password: string;
};

export type UpdateAdminUserInput = {
  name?: string;
  role?: 'admin' | 'superadmin';
  isActive?: boolean;
  password?: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  token: string;
  password: string;
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

async function refreshAdminSession() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

  const response = await fetch(`${apiBase}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    return false;
  }

  return true;
}

async function adminApiFetch(path: string, init?: RequestInit) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const doRequest = () =>
    fetch(`${apiBase}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        ...(init?.headers ?? {}),
      },
    });

  let response = await doRequest();

  if (response.status === 401) {
    const refreshed = await refreshAdminSession();

    if (refreshed) {
      response = await doRequest();
    }
  }

  return response;
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
  return fetchJson<PublicAthleteSummary[]>('/athletes/public', []);
}

export function getSponsorshipQuotas() {
  return fetchJson<SponsorshipQuotaSummary[]>('/sponsorship/quotas', []);
}

export function getSports() {
  return fetchJson<SportSummary[]>('/sports', []);
}

export function getAldebarunSports() {
  return fetchJson<SportSummary[]>('/sports/aldebarun', []);
}

export function getAldebarunResults() {
  return fetchJson<AldebarunResultSummary[]>('/results/aldebarun', []);
}

export function getBackdropSponsors() {
  return fetchJson<BackdropSponsorSummary[]>('/backdrop', []);
}

export function getPublicMediaPage(input: {
  page?: number;
  pageSize?: number;
  provider?: string;
  featured?: string;
}) {
  return fetchJson<PaginatedResponse<PublicMediaSummary>>(
    `/media/public${buildQuery(input)}`,
    {
      items: [],
      total: 0,
      page: input.page ?? 1,
      pageSize: input.pageSize ?? 12,
      totalPages: 1,
    },
  );
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

export async function requestSponsorPortalAccess(input: { email: string }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

  const response = await fetch(`${apiBase}/sponsors/portal/access-request`, {
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
    throw new Error(message ?? 'Falha ao solicitar acesso ao portal do patrocinador');
  }

  return (await response.json()) as { success: true };
}

export async function getSponsorPortalSession(token: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

  const response = await fetch(`${apiBase}/sponsors/portal/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: string | string[] }
      | null;
    const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
    throw new Error(message ?? 'Falha ao carregar portal do patrocinador');
  }

  return (await response.json()) as SponsorPortalSession;
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

export async function confirmAthleteEmail(token: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

  const response = await fetch(`${apiBase}/athletes/portal/confirm-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: string | string[] }
      | null;
    const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
    throw new Error(message ?? 'Falha ao confirmar cadastro');
  }

  return (await response.json()) as AthletePortalSession;
}

export async function getAthletePortalSession(token: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

  const response = await fetch(`${apiBase}/athletes/portal/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: string | string[] }
      | null;
    const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
    throw new Error(message ?? 'Falha ao abrir area do atleta');
  }

  return (await response.json()) as AthletePortalSession;
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

export async function requestPasswordReset(input: ForgotPasswordInput) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

  const response = await fetch(`${apiBase}/auth/forgot-password`, {
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
    throw new Error(message ?? 'Falha ao solicitar recuperacao de senha');
  }

  return (await response.json()) as { success: true };
}

export async function submitPasswordReset(input: ResetPasswordInput) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

  const response = await fetch(`${apiBase}/auth/reset-password`, {
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
    throw new Error(message ?? 'Falha ao redefinir senha');
  }

  return (await response.json()) as { success: true };
}

export async function adminFetchJson<T>(path: string): Promise<T> {
  const response = await adminApiFetch(path, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;
    throw new Error(body?.message ?? `Erro na requisicao admin para ${path}`);
  }

  return (await response.json()) as T;
}

async function adminRequestJson<T>(
  path: string,
  init: RequestInit,
  fallbackMessage: string,
): Promise<T> {
  const response = await adminApiFetch(path, init);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: string | string[] }
      | null;
    const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
    throw new Error(message ?? fallbackMessage);
  }

  return (await response.json()) as T;
}

async function adminRequestText(
  path: string,
  init: RequestInit,
  fallbackMessage: string,
) {
  const response = await adminApiFetch(path, init);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: string | string[] }
      | null;
    const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
    throw new Error(message ?? fallbackMessage);
  }

  return response.text();
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
  return adminRequestJson<AthleteSummary>(`/athletes/${athleteId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  }, 'Falha ao atualizar status do atleta');
}

export function adminUpdateAthlete(athleteId: string, input: UpdateAthleteInput) {
  return adminRequestJson<AthleteSummary>(`/athletes/${athleteId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  }, 'Falha ao atualizar atleta');
}

export function adminDeleteAthlete(athleteId: string) {
  return adminRequestJson<{ id: string; deleted: true }>(`/athletes/${athleteId}`, {
    method: 'DELETE',
  }, 'Falha ao excluir atleta');
}

export function adminCreateResult(input: ResultInput) {
  return adminRequestJson<ResultSummary>('/results', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  }, 'Falha ao lancar resultado');
}

export function adminCreateResultsBulk(input: BulkResultInput) {
  return adminRequestJson<ResultSummary[]>('/results/bulk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  }, 'Falha ao lancar resultados em lote');
}

export function adminUpdateResult(resultId: string, input: Partial<ResultInput>) {
  return adminRequestJson<ResultSummary>(`/results/${resultId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  }, 'Falha ao corrigir resultado');
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

export function adminGetAdminUsers() {
  return adminFetchJson<AdminUserSummary[]>('/auth/admin-users');
}

export function adminCreateAdminUser(input: CreateAdminUserInput) {
  return adminRequestJson<AdminUserSummary>('/auth/admin-users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  }, 'Falha ao criar usuario administrativo');
}

export function adminUpdateAdminUser(userId: string, input: UpdateAdminUserInput) {
  return adminRequestJson<AdminUserSummary>(`/auth/admin-users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  }, 'Falha ao atualizar usuario administrativo');
}

export function adminUpdateLgpdDeletionRequest(
  requestId: string,
  input: {
    status?: 'pending' | 'in_review' | 'resolved' | 'rejected';
    adminNotes?: string;
  },
) {
  return adminRequestJson<LgpdDeletionRequestSummary>(`/lgpd/deletion-requests/${requestId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  }, 'Falha ao atualizar solicitacao LGPD');
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
  return adminRequestJson<CouponAdminSummary>(`/sponsors/${sponsorId}/coupons`, {
    method: 'POST',
  }, 'Falha ao gerar cupom');
}

export function adminActivateSponsor(sponsorId: string) {
  return adminRequestJson<{
    id: string;
    status: 'active' | 'pending' | 'inactive';
    couponsGenerated: number;
  }>(`/sponsors/${sponsorId}/activate`, {
    method: 'PATCH',
  }, 'Falha ao ativar patrocinador');
}

export function adminExpireCoupon(couponId: string) {
  return adminRequestJson<CouponAdminSummary>(`/coupons/${couponId}/expire`, {
    method: 'PATCH',
  }, 'Falha ao expirar cupom');
}

export function adminUpdateSponsor(sponsorId: string, input: UpdateSponsorInput) {
  return adminRequestJson<SponsorAdminSummary>(`/sponsors/${sponsorId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  }, 'Falha ao atualizar patrocinador');
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
  return adminRequestJson<MediaAdminSummary>('/media', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  }, 'Falha ao criar midia');
}

export function adminUploadMedia(file: File, input: {
  title?: string;
  isFeatured?: boolean;
  sortOrder?: number;
}) {
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

  return adminRequestJson<MediaAdminSummary>('/media/upload', {
    method: 'POST',
    body: formData,
  }, 'Falha ao enviar midia');
}

export function adminUpdateMedia(mediaId: string, input: UpdateMediaInput) {
  return adminRequestJson<MediaAdminSummary>(`/media/${mediaId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  }, 'Falha ao atualizar midia');
}

export function adminDeleteMedia(mediaId: string) {
  return adminRequestJson<{ id: string; deleted: true }>(`/media/${mediaId}`, {
    method: 'DELETE',
  }, 'Falha ao remover midia');
}

export function adminGetScoringConfig() {
  return adminFetchJson<ScoringConfigSummary[]>('/settings/scoring');
}

export function adminCreateScoringConfig(input: CreateScoringConfigInput) {
  return adminRequestJson<ScoringConfigSummary>('/settings/scoring', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  }, 'Falha ao criar configuracao');
}

export function adminUpdateTeam(teamId: string, input: UpdateTeamInput) {
  return adminRequestJson<TeamSummary>(`/teams/${teamId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  }, 'Falha ao atualizar equipe');
}

export function adminDeleteTeam(teamId: string) {
  return adminRequestJson<{ id: string; deleted: true }>(`/teams/${teamId}`, {
    method: 'DELETE',
  }, 'Falha ao excluir equipe');
}

export function adminCreateTeam(input: { name: string; color?: string }) {
  return adminRequestJson<TeamSummary>('/teams', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  }, 'Falha ao criar equipe');
}

export function adminCreateSport(input: CreateSportInput) {
  return adminRequestJson<SportSummary>('/sports', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  }, 'Falha ao criar modalidade');
}

export function adminUpdateSport(sportId: string, input: UpdateSportInput) {
  return adminRequestJson<SportSummary>(`/sports/${sportId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  }, 'Falha ao atualizar modalidade');
}

export function adminDeleteSport(sportId: string) {
  return adminRequestJson<{ id: string; deleted: true }>(`/sports/${sportId}`, {
    method: 'DELETE',
  }, 'Falha ao excluir modalidade');
}

export function adminUpdateScoringConfig(rowId: string, points: number) {
  return adminRequestJson<ScoringConfigSummary>(`/settings/scoring/${rowId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ points }),
  }, 'Falha ao atualizar configuracao');
}

export function adminDeleteScoringConfig(rowId: string) {
  return adminRequestJson<{ id: string; deleted: true }>(`/settings/scoring/${rowId}`, {
    method: 'DELETE',
  }, 'Falha ao remover configuracao');
}

export async function adminDownloadAthletesCsv() {
  return adminRequestText('/athletes/export', {
    method: 'GET',
  }, 'Falha ao exportar atletas');
}
