export type TeamSummary = {
  id: string;
  name: string;
  color: string;
  totalScore: number;
};

export type SportSummary = {
  id: string;
  name: string;
  category: string;
};

export type AthleteRecord = {
  id: string;
  name: string;
  cpf: string;
  email?: string;
  phone?: string;
  birthDate: string;
  unit?: string | null;
  type: 'titular' | 'familiar' | 'convidado';
  titularId?: string;
  teamId: string;
  shirtSize: 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XGG';
  status: 'pending' | 'active' | 'rejected';
  lgpdConsent: boolean;
  sports: string[];
  createdAt: string;
};

