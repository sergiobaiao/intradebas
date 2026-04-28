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
  },
];

const ranking = [
  {
    id: 'team-1',
    name: 'Mucura',
    color: '#E63946',
    totalScore: 14,
  },
  {
    id: 'team-2',
    name: 'Guara',
    color: '#2A9D8F',
    totalScore: 8,
  },
];

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

  if (request.method === 'GET' && url.pathname === '/api/v1/results/ranking') {
    sendJson(response, ranking);
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

    sendJson(response, {
      id: 'athlete-1',
      name: 'Joao Silva Santos',
      cpf: '000.000.000-00',
      type: 'titular',
      status: 'pending',
      shirtSize: 'M',
      sports: [{ id: 'sport-1', name: 'Futsal', category: 'coletivo' }],
      team: teams[0],
    });
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
