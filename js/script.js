/* ==========================================================================
   ESPAÇO IRIS — Comportamento do site
   ========================================================================== */

/* Abre e fecha o menu no celular */
const menuBtn = document.querySelector("#menu-btn");
const menu = document.querySelector("#menu");

if (menuBtn && menu) {
  menuBtn.addEventListener("click", () => {
    menu.classList.toggle("aberto");
  });

  // fecha o menu ao clicar em um link (celular)
  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => menu.classList.remove("aberto"));
  });
}

/* ==========================================================================
   NÚMERO DO WHATSAPP
   ==========================================================================
   O número está direto nos links do index.html, no formato:
   https://wa.me/5512987089203?text=MENSAGEM

   Para trocar o número, procure por "5512987089203" no index.html e
   substitua em todos os lugares (é 55 = Brasil + 12 = DDD + número).

   Esse formato abre o WhatsApp (app no celular ou WhatsApp Web no
   computador) já na conversa com a mensagem preenchida — é a mesma
   lógica usada por integrações com a API oficial do WhatsApp Business.
   Se um dia migrarem para a API oficial, basta trocar essa URL pelo
   endpoint do provedor, mantendo número e mensagem.
   ========================================================================== */
