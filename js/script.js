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

/* Carrossel de fotos do hero — troca de imagem a cada 3 segundos */
const heroSlides = document.querySelectorAll(".hero-foto .hero-slide");

if (heroSlides.length > 1) {
  let heroIndex = 0;

  setInterval(() => {
    heroSlides[heroIndex].classList.remove("ativa");
    heroIndex = (heroIndex + 1) % heroSlides.length;
    heroSlides[heroIndex].classList.add("ativa");
  }, 3000);
}

/* Revezamento das fotos da galeria — cada quadro alterna entre 2 fotos a cada 3 segundos */
document.querySelectorAll(".foto-slider").forEach((slider) => {
  const slides = slider.querySelectorAll(".foto-slide");
  if (slides.length > 1) {
    let idx = 0;
    setInterval(() => {
      slides[idx].classList.remove("ativa");
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add("ativa");
    }, 3000);
  }
});

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
