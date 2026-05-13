# Feature Specification: Public Experience Completion

**Feature Branch**: `058-public-experience-completion`  
**Created**: 2026-05-12  
**Status**: Draft  
**Input**: User description: "prossiga" after feature 057, closing the remaining public portal experience gaps.

## Requirements *(mandatory)*

- **FR-001**: O sistema MUST exibir um countdown real na home a partir da próxima modalidade com data agendada.
- **FR-002**: O sistema MUST expor uma galeria pública de mídia com dados reais publicados no backend.
- **FR-003**: O sistema MUST adicionar uma rota pública `/midia` alinhada ao shell visual público.
- **FR-004**: O sistema MUST transformar o backdrop público em experiência de rotação dinâmica baseada nos patrocinadores ativos.
- **FR-005**: O sistema MUST manter fallback explícito quando não houver datas, mídia ou patrocinadores carregados.
- **FR-006**: O sistema MUST validar backend e frontend com testes automatizados representativos.

## Success Criteria *(mandatory)*

- **SC-001**: A home passa a mostrar countdown real para o próximo evento agendado.
- **SC-002**: A rota `/midia` publica fotos e vídeos reais sem autenticação administrativa.
- **SC-003**: O backdrop público deixa de ser apenas grade estática e passa a rotacionar os patrocinadores ativos.
- **SC-004**: Build/testes de backend e frontend passam.
