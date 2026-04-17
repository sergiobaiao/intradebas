export const teamSeed = [
  {
    id: 'team-mucura',
    name: 'Mucura',
    color: '#E63946',
    totalScore: 18,
  },
  {
    id: 'team-jacare',
    name: 'Jacare',
    color: '#2D6A4F',
    totalScore: 14,
  },
  {
    id: 'team-capivara',
    name: 'Capivara',
    color: '#E9C46A',
    totalScore: 11,
  },
] as const;

export const sportSeed = [
  {
    id: 'sport-futsal',
    name: 'Futsal',
    category: 'coletiva',
  },
  {
    id: 'sport-corrida',
    name: 'ALDEBARUN 5K',
    category: 'individual',
  },
  {
    id: 'sport-futevolei',
    name: 'Futevolei',
    category: 'dupla',
  },
] as const;

export const athleteSeed = [
  {
    id: 'athlete-1',
    name: 'Marina Carvalho',
    cpf: '111.222.333-44',
    phone: '86999990001',
    birthDate: '1992-03-10',
    type: 'titular',
    teamId: 'team-mucura',
    shirtSize: 'M',
    status: 'active',
    unit: 'Bloco A, Ap. 101',
    lgpdConsent: true,
    sports: ['sport-corrida'],
  },
  {
    id: 'athlete-2',
    name: 'Rafael Nunes',
    cpf: '555.666.777-88',
    phone: '86999990002',
    birthDate: '1988-08-19',
    type: 'titular',
    teamId: 'team-jacare',
    shirtSize: 'G',
    status: 'active',
    unit: 'Bloco C, Ap. 304',
    lgpdConsent: true,
    sports: ['sport-futsal', 'sport-futevolei'],
  },
  {
    id: 'athlete-3',
    name: 'Livia Rocha',
    cpf: '999.000.111-22',
    phone: '86999990003',
    birthDate: '2001-01-25',
    type: 'convidado',
    teamId: 'team-capivara',
    shirtSize: 'P',
    status: 'pending',
    unit: null,
    titularId: 'athlete-2',
    lgpdConsent: true,
    sports: ['sport-corrida'],
  },
] as const;

