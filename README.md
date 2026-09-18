# Espaço Iris — Site

Site estático (HTML + CSS + JS puro). Não precisa instalar nada nem
rodar servidor: é só abrir no VS Code e usar a extensão **Live Server**
(botão "Go Live" no rodapé), ou hospedar em Netlify, Vercel, GitHub
Pages ou qualquer hospedagem simples.

## Estrutura de arquivos

```
espaco-iris/
├── index.html            → o site inteiro (uma página, 4 seções)
├── css/style.css          → toda a estilização
├── js/script.js            → menu do celular
├── img/
│   ├── logo.png                 → logo Espaço Iris (cabeçalho e rodapé)
│   ├── hero-iris.png            → foto da 1ª seção
│   ├── sobre-iris.png           → foto da seção "Iris Martins"
│   ├── iris-cliente.jpeg        → foto da seção de avaliações
│   ├── galeria/
│   │   ├── trabalho-1.png
│   │   ├── trabalho-2.jpeg
│   │   └── trabalho-3.jpeg
│   └── avaliacoes/
│       ├── sylvia.png
│       ├── fabiola.png
│       └── aline.png
└── README.md
```

**Importante:** as pastas `css`, `js` e `img` precisam ficar na mesma
pasta do `index.html`. Se os arquivos forem separados, o site abre
sem estilo e sem fotos.

## Seções do site

1. **Hero** — logo, menu, título "ESPAÇO IRIS .", frase e botão
   "Agende seu horário".
2. **Sobre** — "Iris Martins .", os três diferenciais e a frase
   "Não é só sobre mudar o cabelo…".
3. **Serviços** — seção extra que montei para dar corpo ao menu
   "Serviços", que existia no cabeçalho do Canva mas não tinha
   conteúdo. São 6 cards com textos genéricos de salão: **revise e
   troque pelos serviços reais da Iris, com os nomes que ela usa.**
4. **Galeria** — as três fotos emolduradas + link "Acesse nosso
   instagram".
5. **Avaliações** — foto + os três prints de avaliações do Google.

## WhatsApp

Número configurado: **(12) 98708-9203**

Aparece em 4 lugares: botão "Agende seu horário", botão "Falar no
WhatsApp" (Serviços), link do rodapé e botão verde flutuante.

Todos usam o formato `https://wa.me/5512987089203?text=MENSAGEM`, que
abre o WhatsApp (app no celular, WhatsApp Web no computador) já na
conversa com a mensagem preenchida — mesma lógica das integrações com
a API oficial do WhatsApp Business. Para trocar o número, procure por
`5512987089203` no `index.html` e substitua em todos os lugares
(55 = Brasil, 12 = DDD).

## Instagram

Link configurado: https://www.instagram.com/espaco__iris/ — aparece no
botão da Galeria e no rodapé.

## Sobre a fonte (importante)

O projeto do Canva usa **TT Ramillas**, que é uma fonte paga e
licenciada. Ela não pode ser carregada num site sem comprar a licença
**web** (a licença do Canva não vale para isso).

A substituta usada aqui é a **Playfair Display** (Google Fonts,
gratuita) — é a serifada didone gratuita mais próxima do desenho da
Ramillas: mesmo contraste alto entre traços grossos e finos, e serifas
afiladas. O resultado fica bem parecido, mas não é idêntico.

Se comprarem a licença web da TT Ramillas depois:
1. Coloquem os arquivos `.woff2` numa pasta `fonts/`
2. Declarem com `@font-face` no topo do `css/style.css`
3. Troquem `'Playfair Display'` por `'TT Ramillas'` na variável
   `--display`, no começo do arquivo

## Ajustes que provavelmente vocês vão querer fazer

- **Serviços**: trocar os 6 cards pelos serviços e descrições reais.
- **Endereço**: hoje o rodapé diz só "São José dos Campos — SP". Com o
  endereço completo dá para colocar rua/número e até um mapa.
- **Mais fotos na galeria**: é só adicionar os arquivos em
  `img/galeria/` e duplicar um bloco `<a class="foto-moldura">` no
  `index.html`.
