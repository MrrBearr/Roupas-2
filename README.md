# Marcela Modas — projeto demonstrativo

Vitrine digital estática criada pela CA Studio para demonstrar um site de loja de roupas local. Marca, produtos, preços, história, depoimentos, endereço e demais informações comerciais são fictícios.

O aviso de demonstração permanece visível, a página usa `noindex, nofollow`, o arquivo `robots.txt` permite que os rastreadores leiam essa diretiva e não há dados estruturados de empresa local. Todos os CTAs de WhatsApp apontam para Caio Alexandre e identificam esta demonstração.

## Tecnologia

HTML, CSS e JavaScript puros, sem dependências ou etapa de build.

## Executar localmente

```bash
python -m http.server 8000
```

Abra `http://localhost:8000`.

## Estrutura

- `index.html`: conteúdo e vitrine ilustrativa
- `styles.css`: design system e layout responsivo
- `script.js`: menu mobile, FAQ e contato contextual
- `robots.txt`: acesso liberado para que a diretiva `noindex` seja lida

Antes de usar o projeto comercialmente, substitua imagens e informações por materiais aprovados pelo cliente e revise indexação, metadados e contatos.
