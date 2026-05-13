'use client';

import { useEffect, useState } from 'react';

import { AdminEmptyState } from '@/components/admin/empty-state';
import { AdminField } from '@/components/admin/field';
import { AdminPageHeader } from '@/components/admin/page-header';
import { AdminSurface } from '@/components/admin/surface';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MediaAdminSummary,
  adminDeleteMedia,
  adminGetMediaPage,
  adminUpdateMedia,
} from '../../lib';

const selectClassName =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

export default function AdminMidiaPage() {
  const [items, setItems] = useState<MediaAdminSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState('0');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [providerFilter, setProviderFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');

  useEffect(() => {
    void loadData();
  }, [page, providerFilter, featuredFilter]);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const loaded = await adminGetMediaPage({
        page,
        pageSize: 12,
        provider: providerFilter,
        featured: featuredFilter,
      });
      setItems(loaded.items);
      setTotalPages(loaded.totalPages);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar midia');
    } finally {
      setLoading(false);
    }
  }

  async function saveItem(mediaId: string) {
    setError(null);

    try {
      const updated = await adminUpdateMedia(mediaId, {
        title: title || undefined,
        isFeatured,
        sortOrder: Number(sortOrder),
      });

      setItems((current) =>
        [...current]
          .map((item) => (item.id === mediaId ? updated : item))
          .sort((left, right) => {
            if (left.isFeatured !== right.isFeatured) {
              return Number(right.isFeatured) - Number(left.isFeatured);
            }

            if (left.sortOrder !== right.sortOrder) {
              return left.sortOrder - right.sortOrder;
            }

            return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
          }),
      );
      setEditingId(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao atualizar midia');
    }
  }

  async function deleteItem(mediaId: string) {
    if (!confirm('Tem certeza que deseja remover esta midia?')) return;
    setDeletingId(mediaId);
    setError(null);

    try {
      await adminDeleteMedia(mediaId);
      setItems((current) => current.filter((item) => item.id !== mediaId));
      if (editingId === mediaId) {
        setEditingId(null);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao remover midia');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        kicker="Conteudo"
        title="Galeria de midia"
        description="Nesta tela voce organiza o acervo oficial publicado no portal, controla destaque, ordem de exibicao e faz a manutencao de fotos e videos."
        highlights={[
          'Use os filtros para localizar itens por provedor ou status de destaque.',
          'A criacao de novos itens fica centralizada aqui pelo botao de Novo item.',
        ]}
        actions={
          <Button asChild>
            <a href="/admin/midia/nova">Novo item</a>
          </Button>
        }
      />

      {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}

      <AdminSurface title="Filtros do acervo" description="Encontre rapidamente uploads locais e videos de provedores externos.">
        <div className="grid gap-4 md:grid-cols-2">
          <AdminField label="Provedor">
            <select
              className={selectClassName}
              value={providerFilter}
              onChange={(event) => {
                setPage(1);
                setProviderFilter(event.target.value);
              }}
            >
              <option value="">Todos</option>
              <option value="local">Local (Upload)</option>
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
            </select>
          </AdminField>
          <AdminField label="Destaque">
            <select
              className={selectClassName}
              value={featuredFilter}
              onChange={(event) => {
                setPage(1);
                setFeaturedFilter(event.target.value);
              }}
            >
              <option value="">Todos</option>
              <option value="true">Apenas em destaque</option>
              <option value="false">Normais</option>
            </select>
          </AdminField>
        </div>
      </AdminSurface>

      <AdminSurface
        title="Arquivos e links publicados"
        description="Gerenciamento de acervo visual e audiovisual que aparece no portal publico."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#605d52]">Pagina {page} de {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((current) => current + 1)}
            >
              Proxima
            </Button>
          </div>
        }
      >
        {loading ? (
          <AdminEmptyState title="Carregando..." description="Buscando itens de midia no acervo oficial." />
        ) : null}

        {!loading && items.length === 0 ? (
          <AdminEmptyState
            title="Nenhum item encontrado."
            description="Ajuste os filtros ou adicione um novo item para publicar conteudo."
          />
        ) : null}

        {!loading && items.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {items.map((item) => (
              <AdminSurface
                key={item.id}
                title={item.title ?? item.type}
                description={`${item.provider} · ${item.type}`}
                actions={
                  <Badge variant={item.isFeatured ? 'success' : 'outline'}>
                    {item.isFeatured ? 'Destaque' : 'Normal'}
                  </Badge>
                }
              >
                <div className="space-y-4">
                  <div className="grid gap-2 text-sm text-[#605d52]">
                    <p className="m-0 break-all">
                      <strong className="text-[#201515]">URL:</strong> {item.url}
                    </p>
                    <p className="m-0">
                      <strong className="text-[#201515]">Enviado por:</strong> {item.uploader.name}
                    </p>
                    <p className="m-0">
                      <strong className="text-[#201515]">Ordem:</strong> {item.sortOrder}
                    </p>
                  </div>

                  {editingId === item.id ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      <AdminField label="Titulo" className="md:col-span-2">
                        <Input value={title} onChange={(event) => setTitle(event.target.value)} />
                      </AdminField>
                      <AdminField label="Ordem">
                        <Input type="number" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} />
                      </AdminField>
                      <label className="flex items-center gap-3 rounded-[12px] border border-border/70 bg-[#f8f4f0] px-4 py-3 text-sm text-[#605d52]">
                        <input type="checkbox" checked={isFeatured} onChange={(event) => setIsFeatured(event.target.checked)} />
                        Item em destaque na galeria publica
                      </label>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    {editingId === item.id ? (
                      <>
                        <Button size="sm" type="button" onClick={() => void saveItem(item.id)}>
                          Salvar
                        </Button>
                        <Button variant="outline" size="sm" type="button" onClick={() => setEditingId(null)}>
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => {
                            setEditingId(item.id);
                            setTitle(item.title ?? '');
                            setIsFeatured(item.isFeatured);
                            setSortOrder(String(item.sortOrder));
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => void deleteItem(item.id)}
                          disabled={deletingId === item.id}
                        >
                          {deletingId === item.id ? 'Removendo...' : 'Remover'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </AdminSurface>
            ))}
          </div>
        ) : null}
      </AdminSurface>
    </div>
  );
}
