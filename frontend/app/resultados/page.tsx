import { getRanking } from '../lib';
import { LiveRanking } from './live-ranking';

export default async function ResultadosPage() {
  const ranking = await getRanking();

  return (
    <main className="section">
      <div className="shell">
        <LiveRanking initialRanking={ranking} />
      </div>
    </main>
  );
}
