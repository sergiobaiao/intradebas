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
    <div className="admin-screen-content">
      <header className="admin-topbar">
        <div>
          <span className="admin-kicker">Conteudo</span>
          <h1>Novo item de midia</h1>
        </div>
      </header>

      {error ? (
        <div className="admin-panel" style={{ borderColor: 'rgba(230, 57, 70, 0.3)', marginBottom: '22px' }}>
          <p className="error-text">{error}</p>
        </div>
      ) : null}

      <div className="admin-content-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
        <section className="admin-panel">
          <div className="admin-panel-header">
             <h2>Fonte e Tipo</h2>
             <p>Defina como o arquivo sera integrado ao acervo.</p>
          </div>
          <form className="form-grid" style={{ marginTop: 0 }} onSubmit={handleSubmit}>
            <label>
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Tipo de Midia</span>
              <select style={{ minHeight: '40px', borderRadius: '10px' }} value={type} onChange={(event) => setType(event.target.value as CreateMediaInput['type'])}>
                {types.map((item) => (
                  <option key={item} value={item}>
                    {item === 'photo' ? 'Foto / Imagem' : 'Video'}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Provedor</span>
              <select
                style={{ minHeight: '40px', borderRadius: '10px' }}
                value={provider}
                onChange={(event) => setProvider(event.target.value as CreateMediaInput['provider'])}
              >
                {providers.map((item) => (
                  <option key={item} value={item}>
                    {item === 'local' ? 'Upload Local (S3/MinIO)' : item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-span">
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Titulo Editorial</span>
              <input style={{ minHeight: '40px', borderRadius: '10px' }} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex: Largada da Maratona" />
            </label>
            {provider === 'local' ? (
              <label className="field-span">
                <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Arquivo</span>
                <input
                  type="file"
                  style={{ minHeight: '40px', padding: '8px' }}
                  accept={type === 'photo' ? 'image/*' : 'video/*'}
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />
              </label>
            ) : (
              <>
                <label className="field-span">
                  <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>URL Publica</span>
                  <input style={{ minHeight: '40px', borderRadius: '10px' }} type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://..." />
                </label>
                <label className="field-span">
                  <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>URL da Thumbnail (opcional)</span>
                  <input
                    style={{ minHeight: '40px', borderRadius: '10px' }}
                    type="url"
                    value={thumbnailUrl}
                    onChange={(event) => setThumbnailUrl(event.target.value)}
                  />
                </label>
              </>
            )}
            <label>
              <span className="admin-kicker" style={{ fontSize: '0.7rem' }}>Ordem de Exibicao</span>
              <input
                style={{ minHeight: '40px', borderRadius: '10px' }}
                type="number"
                min="0"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
              />
            </label>
            <div className="checkbox-row" style={{ alignSelf: 'center' }}>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(event) => setIsFeatured(event.target.checked)}
              />
              <span className="admin-kicker" style={{ textTransform: 'none', fontSize: '0.85rem' }}>Marcar como <strong>destaque</strong></span>
            </div>
            <div className="field-span admin-topbar-actions" style={{ justifyContent: 'flex-start', marginTop: '20px' }}>
              <button
                className="admin-quick-action"
                style={{ minHeight: '40px', padding: '0 20px' }}
                type="submit"
                disabled={
                  submitting ||
                  (provider === 'local' ? !file : !url.trim())
                }
              >
                {submitting ? 'Salvando...' : 'Criar item'}
              </button>
              <a className="admin-topbar-actions a" style={{ minHeight: '40px', padding: '0 20px' }} href="/admin/midia">
                Cancelar
              </a>
            </div>
          </form>
        </section>

        <section className="admin-panel">
           <div className="admin-panel-header">
             <h2>Diretrizes</h2>
           </div>
           <p className="admin-kicker" style={{ textTransform: 'none', fontSize: '0.85rem', color: '#4b5563' }}>
             Use <strong>Upload Local</strong> para fotos capturadas pela comissao. 
           </p>
           <p className="admin-kicker" style={{ textTransform: 'none', fontSize: '0.85rem', color: '#4b5563', marginTop: '12px' }}>
             Provedores externos como <strong>YouTube</strong> e <strong>Vimeo</strong> sao ideais para videos de cobertura oficial ja publicados.
           </p>
        </section>
      </div>
    </div>
  );
}
