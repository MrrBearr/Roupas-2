# Site — Marcela Modas

Site institucional / vitrine digital para uma loja de roupas local. Single page, estático, sem dependências de build.

## Estrutura

```
.
├── index.html     # Conteúdo e marcação semântica
├── styles.css     # Design system (paleta, tipografia, layout responsivo)
└── script.js      # Menu mobile, FAQ, ano do footer
```

## Como abrir localmente

Basta abrir o `index.html` no navegador. Não precisa de servidor, build, npm, nada.

Para hospedar: qualquer servidor estático serve (Vercel, Netlify, GitHub Pages, Hostinger, etc).

## O que trocar quando for usar de verdade

Tudo que precisa virar real está marcado de forma óbvia. Use buscar/substituir.

| O que | Onde aparece | Trocar para |
|---|---|---|
| Nome da loja: `Marcela Modas` | `index.html`, `README.md` | nome real |
| Cidade: `Patos de Minas` | `index.html` (SEO + textos) | cidade real |
| WhatsApp: `5534999999999` | `index.html` (vários `wa.me/`) | número real, formato `55DDNNNNNNNNN` |
| Telefone: `(34) 99999-9999` | `index.html` (footer + CTA) | telefone real |
| Endereço: `Rua Major Gote, 752` | `index.html` (footer + CTA + schema) | endereço real |
| E-mail: `contato@marcelamodas.com.br` | `index.html` | e-mail real |
| Instagram: `https://instagram.com` | `index.html` | URL real |
| Imagens (Unsplash) | `index.html` | trocar pelas fotos reais da loja |

### Trocando imagens

As imagens são URLs do Unsplash (placeholder). Para o site final, substitua por fotos reais:
- Hero: foto vertical da loja, vitrine ou modelo
- Coleções: 1 foto por categoria (4 fotos)
- Produtos: 6 fotos verticais, fundo limpo
- Sobre: 2 fotos da loja por dentro
- Instagram: 6 fotos quadradas (pode plugar com API do Instagram depois)
- CTA final: 1 foto da fachada ou interior

### Atualizando o SEO local

Em `index.html`, o `<title>`, a `<meta name="description">` e o bloco `application/ld+json` (LocalBusiness) já estão estruturados pra busca local. Atualize:
- Nome
- Endereço completo
- Cidade/Estado
- Horários
- Telefone
- URL do site

## Acessibilidade e performance

- HTML semântico (header, main, section, footer, article, figure)
- Alt em todas as imagens
- `loading="lazy"` nas imagens abaixo da dobra
- `prefers-reduced-motion` respeitado
- Contraste AA na paleta principal
- Single page, sem JS pesado, sem framework
