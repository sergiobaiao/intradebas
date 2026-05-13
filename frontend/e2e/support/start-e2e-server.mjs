import { createServer } from 'node:http';
import { spawn } from 'node:child_process';

const apiPort = 3999;

const teams = [
  {
    id: 'team-1',
    name: 'Mucura',
    color: '#E63946',
    totalScore: 14,
  },
];

const sports = [
  {
    id: 'sport-1',
    name: 'Futsal',
    category: 'coletivo',
    isAldebarun: false,
    isActive: true,
    scheduleDate: '2026-12-20T18:00:00.000Z',
    scheduleNotes: 'Quadra principal',
  },
  {
    id: 'sport-2',
    name: 'ALDEBARUN 5K',
    category: 'individual',
    isAldebarun: true,
    isActive: true,
    scheduleDate: '2026-12-21T06:00:00.000Z',
    scheduleNotes: 'Largada na portaria central',
  },
];

const athletes = [
  {
    id: 'athlete-1',
    name: 'Joao Silva Santos',
    cpf: '000.000.000-00',
    type: 'titular',
    status: 'pending',
    shirtSize: 'M',
    sports: [{ id: 'sport-1', name: 'Futsal', category: 'coletivo' }],
    team: teams[0],
  },
  {
    id: 'athlete-2',
    name: 'Maria Alves',
    cpf: '111.111.111-11',
    type: 'titular',
    status: 'active',
    shirtSize: 'G',
    sports: [{ id: 'sport-1', name: 'Futsal', category: 'coletivo' }],
    team: teams[0],
  },
];

const results = [
  {
    id: 'result-1',
    position: 1,
    rawScore: null,
    calculatedPoints: 5,
    resultDate: '2026-04-28T12:00:00.000Z',
    notes: null,
    sport: { id: 'sport-1', name: 'Futsal', category: 'coletivo' },
    team: teams[0],
  },
];

const ranking = [
  {
    id: 'team-1',
    name: 'Mucura',
    color: '#E63946',
    totalScore: 14,
    wins: 3,
    podiums: 4,
    tieBreakRule: 'most_wins',
  },
  {
    id: 'team-2',
    name: 'Guara',
    color: '#2A9D8F',
    totalScore: 8,
    wins: 1,
    podiums: 2,
    tieBreakRule: 'most_wins',
  },
];

const rankingSettings = {
  id: 'default',
  tieBreakRule: 'most_wins',
  updatedAt: '2026-05-12T12:00:00.000Z',
  updatedByUser: {
    id: 'user-1',
    name: 'Administrador INTRADEBAS',
    email: 'admin@intradebas.local',
  },
};

const scoringConfig = [
  {
    id: 'coletiva-1',
    category: 'coletiva',
    position: 1,
    points: 5,
    updatedByUser: rankingSettings.updatedByUser,
  },
  {
    id: 'coletiva-2',
    category: 'coletiva',
    position: 2,
    points: 3,
    updatedByUser: rankingSettings.updatedByUser,
  },
];

const sponsorshipQuotas = [
  {
    id: 'quota-1',
    level: 'bronze',
    price: 350,
    maxSlots: 8,
    usedSlots: 2,
    remainingSlots: 6,
    courtesyCount: 2,
    benefits: 'Costas camisa + Backdrop',
    backdropPriority: 1,
  },
];

const backdropSponsors = [
  {
    id: 'sponsor-1',
    companyName: 'Padaria Aldebaran',
    logoUrl: 'https://example.com/logo-padaria.png',
    level: 'ouro',
    backdropPriority: 3,
  },
  {
    id: 'sponsor-2',
    companyName: 'Mercadinho Vila',
    logoUrl: 'https://example.com/logo-mercadinho.png',
    level: 'bronze',
    backdropPriority: 1,
  },
];

const publicMedia = {
  items: [
    {
      id: 'media-1',
      type: 'photo',
      title: 'Abertura oficial',
      url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80',
      provider: 'local',
      isFeatured: true,
      sortOrder: 1,
      createdAt: '2026-04-28T12:00:00.000Z',
    },
    {
      id: 'media-2',
      type: 'video',
      title: 'Cobertura da rodada',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: null,
      provider: 'youtube',
      isFeatured: true,
      sortOrder: 2,
      createdAt: '2026-04-29T12:00:00.000Z',
    },
  ],
  total: 2,
  page: 1,
  pageSize: 18,
  totalPages: 1,
};

const api = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://127.0.0.1:${apiPort}`);

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Origin': '*',
    });
    response.end();
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/teams') {
    sendJson(response, teams);
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/sports') {
    sendJson(response, sports);
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/sports/aldebarun') {
    sendJson(response, sports.filter((sport) => sport.isAldebarun));
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/athletes') {
    sendJson(response, athletes);
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/results') {
    sendJson(response, results);
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/results/ranking') {
    sendJson(response, ranking);
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/settings/ranking') {
    sendJson(response, rankingSettings);
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/settings/scoring') {
    sendJson(response, scoringConfig);
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/results/aldebarun') {
    sendJson(
      response,
      [
        {
          id: 'aldebarun-1',
          position: 1,
          rawScore: 1410,
          calculatedPoints: 10,
          resultDate: '2026-04-29T09:00:00.000Z',
          notes: 'Melhor tempo da prova',
          sport: sports[1],
          team: teams[0],
        },
      ],
    );
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/sponsorship/quotas') {
    sendJson(response, sponsorshipQuotas);
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/backdrop') {
    sendJson(response, backdropSponsors);
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/media/public') {
    sendJson(response, publicMedia);
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/results/ranking/live') {
    response.writeHead(200, {
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
    });
    response.write(`data: ${JSON.stringify(ranking)}\n\n`);
    response.end();
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/v1/athletes') {
    for await (const _chunk of request) {
      // drain request body
    }

    sendJson(response, athletes[0]);
    return;
  }

  response.writeHead(404);
  response.end();
});

api.listen(apiPort, '127.0.0.1', () => {
  const next = spawn('npx', ['next', 'dev', '-H', '127.0.0.1', '-p', '3100'], {
    env: {
      ...process.env,
      NEXT_PUBLIC_API_URL: `http://127.0.0.1:${apiPort}/api/v1`,
    },
    stdio: 'inherit',
  });

  const shutdown = () => {
    next.kill('SIGTERM');
    api.close();
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  next.on('exit', (code) => {
    api.close(() => process.exit(code ?? 0));
  });
});

function sendJson(response, payload) {
  response.writeHead(200, {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  });
  response.end(JSON.stringify(payload));
}
