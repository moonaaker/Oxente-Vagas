// como não tive aula de java ainda vou ter que pesquisar na internet como usar e pedir dica pra IA

const header = document.getElementById('site-header');
const footer = document.getElementById('site-footer');
const pages = document.querySelectorAll('.page');
const pageNames = [...pages].map((page) => page.dataset.page);
const internalLinks = document.querySelectorAll('a[href^="#"]');

const headerTones = {
  empresas: 'tone-cactus',
  login: 'tone-terracotta',
  cadastro: 'tone-terracotta',
  'criar-perfil': 'tone-terracotta',
};
const pagesWithoutFooter = ['login', 'cadastro', 'criar-perfil'];

function currentPage() {
  const name = location.hash.slice(1);
  return pageNames.includes(name) ? name : 'home';
}

function updateHeaderBackground() {
  const isSolid = currentPage() !== 'home' || window.scrollY > 12;
  header.classList.toggle('is-scrolled', isSolid);
}

function showPage(page) {
  pages.forEach((el) => {
    el.hidden = el.dataset.page !== page;
  });
  footer.hidden = pagesWithoutFooter.includes(page);

  header.classList.toggle('hide-center', page === 'criar-perfil');
  header.classList.remove('tone-cactus', 'tone-terracotta');
  if (headerTones[page]) header.classList.add(headerTones[page]);
  updateHeaderBackground();

  internalLinks.forEach((link) => {
    if (link.hash === `#${page}`) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', () => showPage(currentPage()));
window.addEventListener('scroll', updateHeaderBackground, { passive: true });
showPage(currentPage());

const faqItems = document.querySelectorAll('.faq-item');

function setFaqOpen(item, isOpen) {
  item.classList.toggle('open', isOpen);
  item.querySelector('.faq-question').setAttribute('aria-expanded', isOpen);
}
//  sinto que ja to entendendo um pouco como funciona, apesar de nem saber que esses codigo existia
faqItems.forEach((item) => {
  item.querySelector('.faq-question').addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    faqItems.forEach((other) => setFaqOpen(other, false));
    setFaqOpen(item, !wasOpen);
  });
});

const roleButtons = document.querySelectorAll('.role-toggle button');
const rolePanels = document.querySelectorAll('.role-panel');

roleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    roleButtons.forEach((other) => other.setAttribute('aria-pressed', other === button));
    rolePanels.forEach((panel) => {
      panel.hidden = panel.dataset.role !== button.dataset.role;
    });
  });
});

document.querySelectorAll('form').forEach((form) => {
  form.addEventListener('submit', (event) => event.preventDefault());
});

const ZOOM = { min: 80, max: 150, step: 10, initial: 100 };
let zoomLevel = ZOOM.initial;

function setZoom(level) {
  zoomLevel = Math.min(ZOOM.max, Math.max(ZOOM.min, level));
  document.body.style.zoom = `${zoomLevel}%`;
}

document.getElementById('zoom-in').addEventListener('click', () => setZoom(zoomLevel + ZOOM.step));
document.getElementById('zoom-out').addEventListener('click', () => setZoom(zoomLevel - ZOOM.step));
document.getElementById('zoom-reset').addEventListener('click', () => setZoom(ZOOM.initial));

const darkToggle = document.getElementById('dark-mode-toggle');

darkToggle.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark-mode');
  const label = isDark ? 'Desativar modo escuro' : 'Ativar modo escuro';
  darkToggle.setAttribute('aria-pressed', isDark);
  darkToggle.setAttribute('aria-label', label);
  darkToggle.title = label;
});

const avatarButton = document.getElementById('avatar-upload');
const avatarInput = document.getElementById('avatar-input');
const avatarHint = document.getElementById('avatar-hint');
const usernameInput = document.getElementById('perfil-usuario');
const passwordInput = document.getElementById('perfil-senha');
const ageInput = document.getElementById('perfil-idade');
const ageField = document.getElementById('idade-field');
const nextButtonWrap = document.getElementById('next-btn-wrap');
const nextButton = document.getElementById('next-btn');

function validateProfile() {
  const age = parseInt(ageInput.value, 10);
  const usernameOk = usernameInput.value.trim().length >= 3;
  const passwordOk = passwordInput.value.length >= 6;
  const ageOk = age >= 17 && age <= 120;
  const photoOk = avatarButton.classList.contains('has-image');
  const textFieldsOk = usernameOk && passwordOk && ageOk;
  const allOk = textFieldsOk && photoOk;

  ageField.classList.toggle('has-error', ageInput.value !== '' && !ageOk);
  avatarHint.classList.toggle('is-missing', textFieldsOk && !photoOk);
  avatarHint.textContent = textFieldsOk && !photoOk
    ? 'Adicione uma foto pra continuar'
    : 'Obrigatório — clique no círculo pra escolher uma imagem';
  nextButtonWrap.classList.toggle('visible', allOk);
  nextButton.disabled = !allOk;
}

avatarButton.addEventListener('click', () => avatarInput.click());

avatarInput.addEventListener('change', () => {
  const file = avatarInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    avatarButton.style.backgroundImage = `url("${reader.result}")`;
    avatarButton.classList.add('has-image');
    validateProfile();
  };
  reader.readAsDataURL(file);
});

[usernameInput, passwordInput, ageInput].forEach((input) => {
  input.addEventListener('input', validateProfile);
});

// foi curtinho ate