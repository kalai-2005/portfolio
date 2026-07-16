const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const scrollTopButton = document.getElementById('scrollTop');
const typedText = document.getElementById('typedText');
const yearSpan = document.getElementById('year');
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const projectLightbox = document.getElementById('projectLightbox');
const projectLightboxImage = document.getElementById('projectLightboxImage');
const projectLightboxClose = document.getElementById('projectLightboxClose');
const certificateModal = document.createElement('div');
certificateModal.className = 'certificate-modal';
certificateModal.innerHTML = `
  <div class="certificate-modal-content">
    <button class="certificate-modal-close" type="button" aria-label="Close preview">×</button>
    <div id="certificateModalBody"></div>
  </div>
`;
document.body.appendChild(certificateModal);
const certificateModalBody = document.getElementById('certificateModalBody');
const certificateModalClose = certificateModal.querySelector('.certificate-modal-close');

const roles = [
  'Front-End Web Developer',
  'Full-Stack Developer',
  'Graphics Designer'
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = roles[roleIndex];
  if (!deleting) {
    typedText.textContent = current.slice(0, charIndex + 1);
    charIndex += 1;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    typedText.textContent = current.slice(0, charIndex - 1);
    charIndex -= 1;
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeLoop, deleting ? 70 : 90);
}

typeLoop();

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  const iconMap = {
    light: '🌙',
    dark: '☀️',
    midnight: '✨'
  };
  themeToggle.textContent = iconMap[theme] || '🌙';
  localStorage.setItem('portfolio-theme', theme);
}

const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
const themeOrder = ['light', 'dark', 'midnight'];
const currentThemeIndex = themeOrder.indexOf(savedTheme) >= 0 ? themeOrder.indexOf(savedTheme) : 0;
setTheme(themeOrder[currentThemeIndex]);

themeToggle.addEventListener('click', () => {
  const currentTheme = root.getAttribute('data-theme') || 'light';
  const currentIndex = themeOrder.indexOf(currentTheme) >= 0 ? themeOrder.indexOf(currentTheme) : 0;
  const nextIndex = (currentIndex + 1) % themeOrder.length;
  setTheme(themeOrder[nextIndex]);
});

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const sections = [...document.querySelectorAll('main section')];
const navItems = [...document.querySelectorAll('.nav-links a')];

window.addEventListener('scroll', () => {
  const y = window.scrollY + 140;
  let current = 'home';

  sections.forEach((section) => {
    if (section.offsetTop <= y) {
      current = section.id;
    }
  });

  navItems.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });

  scrollTopButton.classList.toggle('show', window.scrollY > 420);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

scrollTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function openProjectLightbox(src, alt) {
  if (!projectLightbox || !projectLightboxImage) return;
  projectLightboxImage.src = src;
  projectLightboxImage.alt = alt;
  projectLightbox.classList.add('show');
  projectLightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProjectLightbox() {
  if (!projectLightbox || !projectLightboxImage) return;
  projectLightbox.classList.remove('show');
  projectLightbox.setAttribute('aria-hidden', 'true');
  projectLightboxImage.removeAttribute('src');
  document.body.style.overflow = '';
}

document.querySelectorAll('.project-thumb').forEach((thumb) => {
  thumb.addEventListener('click', () => openProjectLightbox(thumb.src, thumb.alt));
  thumb.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProjectLightbox(thumb.src, thumb.alt);
    }
  });
  thumb.setAttribute('tabindex', '0');
  thumb.setAttribute('role', 'button');
});

projectLightboxClose?.addEventListener('click', closeProjectLightbox);
projectLightbox?.addEventListener('click', (event) => {
  if (event.target === projectLightbox) {
    closeProjectLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeProjectLightbox();
    closeCertificateModal();
  }
});

function openCertificateModal(file, type) {
  if (!certificateModalBody) return;
  certificateModalBody.innerHTML = '';

  if (type === 'pdf') {
    certificateModalBody.innerHTML = `<iframe src="${file}" title="Certificate preview"></iframe>`;
  } else {
    certificateModalBody.innerHTML = `<img src="${file}" alt="Certificate preview" />`;
  }

  certificateModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeCertificateModal() {
  certificateModal.classList.remove('show');
  certificateModalBody.innerHTML = '';
  document.body.style.overflow = '';
}

document.querySelectorAll('.certificate-open').forEach((button) => {
  button.addEventListener('click', () => {
    openCertificateModal(button.dataset.file, button.dataset.type || 'image');
  });
});

certificateModalClose?.addEventListener('click', closeCertificateModal);
certificateModal?.addEventListener('click', (event) => {
  if (event.target === certificateModal) {
    closeCertificateModal();
  }
});

if (yearSpan) yearSpan.textContent = new Date().getFullYear();

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();

  if (!name || !email || !message) {
    formStatus.textContent = 'Please complete all required fields.';
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formStatus.textContent = 'Please enter a valid email address.';
    return;
  }

  formStatus.textContent = 'Thanks for reaching out! I will get back to you soon.';
  form.reset();
});
