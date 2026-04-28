import { AthletePortalClient } from './athlete-portal-client';

type AthletePortalPageProps = {
  searchParams?: Promise<{
    token?: string;
  }>;
};

export default async function AthletePortalPage({ searchParams }: AthletePortalPageProps) {
  const params = await searchParams;

  return (
    <main className="section">
      <div className="shell">
        <AthletePortalClient token={params?.token} />
      </div>
    </main>
  );
}
