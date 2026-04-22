'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateMediaInput, adminCreateMedia, adminUploadMedia } from '../../../lib';

const providers: CreateMediaInput['provider'][] = ['local', 'youtube', 'vimeo'];
const types: CreateMediaInput['type'][] = ['photo', 'video'];

export default function AdminNovaMidiaPage() {
  const router = useRouter();
  const [type, setType] = useState<CreateMediaInput['type']>('photo');
  const [provider, setProvider] = useState<CreateMediaInput['provider']>('local');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sortOrder, setSortOrder] = useState('0');
  const [isFeatured, setIsFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (provider === 'local') {
        if (!file) {
          throw new Error('Selecione um arquivo para upload');
        }

        await adminUploadMedia(file, {
          title: title || undefined,
          isFeatured,
          sortOrder: Number(sortOrder),
        });
      } else {
        await adminCreateMedia({
          type,
          provider,
          title: title || undefined,
          url,
          thumbnailUrl: thumbnailUrl || undefined,
          isFeatured,
          sortOrder: Number(sortOrder),
        });
      }

      router.push('/admin/midia');
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha ao criar midia');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="section">
      <div className="shell">
        <span className="eyebrow">Midia</span>
        <h1>Novo item de midia</h1>
        <p>Cadastre fotos e videos por upload local ou por URL publica, mantendo o acervo editorial dentro do painel.</p>
        {error ? <p className="error-text">{error}</p> : null}
        <div className="card">
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              <span>Tipo</span>
              <select value={type} onChange={(event) => setType(event.target.value as CreateMediaInput['type'])}>
                {types.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Provider</span>
              <select
                value={provider}
                onChange={(event) => setProvider(event.target.value as CreateMediaInput['provider'])}
              >
                {providers.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-span">
              <span>Titulo</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} />
            </label>
            {provider === 'local' ? (
              <label className="field-span">
                <span>Arquivo</span>
                <input
                  type="file"
                  accept={type === 'photo' ? 'image/*' : 'video/*'}
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />
              </label>
            ) : (
              <>
                <label className="field-span">
                  <span>URL</span>
                  <input type="url" value={url} onChange={(event) => setUrl(event.target.value)} />
                </label>
                <label className="field-span">
                  <span>Thumbnail URL</span>
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(event) => setThumbnailUrl(event.target.value)}
                  />
                </label>
              </>
            )}
            <label>
              <span>Ordem</span>
              <input
                type="number"
                min="0"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
              />
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(event) => setIsFeatured(event.target.checked)}
              />
              <span>Marcar como destaque</span>
            </label>
            <div className="field-span cta-row">
              <a className="button secondary" href="/admin/midia">
                Cancelar
              </a>
              <button
                className="button primary"
                type="submit"
                disabled={
                  submitting ||
                  (provider === 'local' ? !file : !url.trim())
                }
              >
                {submitting ? 'Salvando...' : 'Criar item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
