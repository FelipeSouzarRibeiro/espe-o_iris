# Diretrizes e Contexto do Projeto: Espaço Iris

## 1. Identificadores Oficiais de Rastreamento
* **Domínio Oficial:** https://espacoirishair.com.br/ (Deploy via GitHub Pages, branch `main`).
* **Google Tag Manager (GTM):** `GTM-5B446LRF`
  - Instalado no `<head>` e logo após a abertura do `<body>` em `index.html`.
* **Google Analytics 4 (GA4):** `G-VFJCYVK2KN`
  - Gerenciado centralmente através do container do Google Tag Manager.
  - **Atenção:** NÃO adicionar scripts avulsos `gtag.js` diretamente no HTML para evitar disparos e métricas duplicadas.

## 2. Elementos de Conversão (IDs para Tag Manager / Ads)
* **Botão de Agendamento WhatsApp (Hero):** `#hero-whatsapp-btn`
* **Botão do Instagram (Hero):** `#hero-instagram-btn` (link para `https://www.instagram.com/espaco__iris/`)
* **Botão Flutuante de WhatsApp:** `.whatsapp-floating`

## 3. Ambiente e Comandos
* **Sistema:** Windows com PowerShell.
* **Comandos encadeados:** Utilizar `;` em vez de `&&` ao executar comandos no terminal.
