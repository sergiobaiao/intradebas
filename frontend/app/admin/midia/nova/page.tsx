'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AdminField } from '@/components/admin/field';
import { AdminPageHeader } from '@/components/admin/page-header';
import { AdminSurface } from '@/components/admin/surface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreateMediaInput, adminCreateMedia, adminUploadMedia } from '../../../lib';

const providers: CreateMediaInput['provider'][] = ['local', 'youtube', 'vimeo'];
const types: CreateMediaInput['type'][] = ['photo', 'video'];
const selectClassName =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

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
    <div className="space-y-6">
      <AdminPageHeader
        kicker="Conteudo"
        title="Novo item de midia"
        description="Nesta tela voce cadastra novas fotos e videos para o portal, definindo origem do arquivo, destaque e ordem de exibicao no acervo."
        highlights={[
          'Escolha Upload local para arquivos da organizacao e provedores externos para links ja publicados.',
          'Defina destaque e ordem agora para controlar a visibilidade do item na galeria publica.',
        ]}
      />

      {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminSurface title="Fonte e tipo do conteudo" description="Defina como o arquivo sera integrado ao acervo oficial.">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Tipo de midia">
                <select
                  className={selectClassName}
                  value={type}
                  onChange={(event) => setType(event.target.value as CreateMediaInput['type'])}
                >
                  {types.map((item) => (
                    <option key={item} value={item}>
                      {item === 'photo' ? 'Foto / Imagem' : 'Video'}
                    </option>
                  ))}
                </select>
              </AdminField>
              <AdminField label="Provedor">
                <select
                  className={selectClassName}
                  value={provider}
                  onChange={(event) => setProvider(event.target.value as CreateMediaInput['provider'])}
                >
                  {providers.map((item) => (
                    <option key={item} value={item}>
                      {item === 'local' ? 'Upload local (S3/MinIO)' : item.charAt(0).toUpperCase() + item.slice(1)}
                    </option>
                  ))}
                </select>
              </AdminField>
            </div>

            <AdminField label="Titulo editorial">
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ex: Largada da maratona"
              />
            </AdminField>

            {provider === 'local' ? (
              <AdminField label="Arquivo" hint="Aceita imagens ou videos conforme o tipo selecionado.">
                <Input
                  type="file"
                  accept={type === 'photo' ? 'image/*' : 'video/*'}
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                  className="pt-2"
                />
              </AdminField>
            ) : (
              <div className="grid gap-4">
                <AdminField label="URL publica">
                  <Input type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://..." />
                </AdminField>
                <AdminField label="URL da thumbnail" hint="Opcional para provedores externos.">
                  <Input type="url" value={thumbnailUrl} onChange={(event) => setThumbnailUrl(event.target.value)} />
                </AdminField>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Ordem de exibicao">
                <Input
                  type="number"
                  min="0"
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                />
              </AdminField>
              <label className="flex items-center gap-3 rounded-[12px] border border-border/70 bg-[#f8f4f0] px-4 py-3 text-sm text-[#605d52]">
                <input type="checkbox" checked={isFeatured} onChange={(event) => setIsFeatured(event.target.checked)} />
                Marcar como destaque na galeria publica
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="submit"
                disabled={submitting || (provider === 'local' ? !file : !url.trim())}
              >
                {submitting ? 'Salvando...' : 'Criar item'}
              </Button>
              <Button asChild variant="outline">
                <a href="/admin/midia">Cancelar</a>
              </Button>
            </div>
          </form>
        </AdminSurface>

        <AdminSurface title="Diretrizes operacionais" description="Boas praticas para manter a galeria consistente.">
          <div className="grid gap-3 text-sm leading-6 text-[#605d52]">
            <div className="rounded-[12px] border border-border/70 bg-[#f8f4f0] px-4 py-3">
              Use <strong className="text-[#201515]">upload local</strong> para fotos e videos capturados pela comissao.
            </div>
            <div className="rounded-[12px] border border-border/70 bg-[#f8f4f0] px-4 py-3">
              Prefira <strong className="text-[#201515]">YouTube</strong> ou <strong className="text-[#201515]">Vimeo</strong> para coberturas longas ja publicadas.
            </div>
            <div className="rounded-[12px] border border-border/70 bg-[#f8f4f0] px-4 py-3">
              Defina a <strong className="text-[#201515]">ordem</strong> e o <strong className="text-[#201515]">destaque</strong> pensando no que deve aparecer primeiro no portal.
            </div>
          </div>
        </AdminSurface>
      </section>
    </div>
  );
}
