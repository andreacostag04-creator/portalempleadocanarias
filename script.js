/* ================================================================
   CANARIAS PARADISE RESORT — Portal del Empleado
   script.js — Lógica de navegación, login y formularios
================================================================ */

/* ── MAPA DE SECCIONES ─────────────────────────────────────── */
const SECTIONS = {
  inicio:         { id: 's-inicio',         label: 'Inicio' },
  documentacion:  { id: 's-documentacion',  label: 'Documentación y Normativa' },
  gestion:        { id: 's-gestion',        label: 'Gestión del Empleo' },
  formacion:      { id: 's-formacion',      label: 'Formación y Desarrollo' },
  comunicacion:   { id: 's-comunicacion',   label: 'Comunicación Interna' },
  bienestar:      { id: 's-bienestar',      label: 'Salud y Bienestar' },
};


/* ── LOGIN ──────────────────────────────────────────────────── */

function doLogin() {
  const email = document.getElementById('inp-email').value.trim();
  const pass  = document.getElementById('inp-pass').value.trim();

  clearLoginError();

  if (!email || !pass) {
    showLoginError('Introduce tu correo y contraseña para continuar.');
    return;
  }
  if (!email.includes('@') || !email.includes('.')) {
    showLoginError('Introduce una dirección de correo válida.');
    return;
  }

  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('portal').classList.remove('is-hidden');
  goSection('inicio');
}

function doLogout() {
  if (!confirm('¿Deseas cerrar la sesión?')) return;
  document.getElementById('portal').classList.add('is-hidden');
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('inp-email').value = '';
  document.getElementById('inp-pass').value  = '';
  clearLoginError();
}

function showLoginError(msg) {
  clearLoginError();
  const p = document.createElement('p');
  p.id = 'login-err';
  p.style.cssText = 'color:#c0392b;font-size:0.82rem;margin-top:10px;text-align:center;';
  p.textContent = msg;
  document.querySelector('.login-container').appendChild(p);
}

function clearLoginError() {
  const el = document.getElementById('login-err');
  if (el) el.remove();
}

/* Permitir Enter en los campos de login */
document.addEventListener('DOMContentLoaded', function () {
  ['inp-email', 'inp-pass'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') doLogin();
    });
  });
});


/* ── NAVEGACIÓN ─────────────────────────────────────────────── */

function goSection(key) {
  if (!SECTIONS[key]) return;

  /* Ocultar todas las secciones */
  Object.values(SECTIONS).forEach(function (s) {
    const el = document.getElementById(s.id);
    if (el) el.classList.remove('active');
  });

  /* Mostrar la sección destino */
  const target = document.getElementById(SECTIONS[key].id);
  if (target) target.classList.add('active');

  /* Actualizar estado activo en el menú */
  document.querySelectorAll('.nav-item').forEach(function (link) {
    const section = link.getAttribute('data-section');
    link.classList.toggle('active', section === key);
  });

  /* Scroll al inicio */
  window.scrollTo({ top: 0, behavior: 'smooth' });

  /* Cerrar menú móvil si está abierto */
  const nav = document.getElementById('main-nav');
  if (nav) nav.classList.remove('open');
}

/* Toggle de menú móvil */
function toggleMobileNav() {
  const nav = document.getElementById('main-nav');
  if (nav) nav.classList.toggle('open');
}

/* Cerrar menú móvil al hacer clic fuera */
document.addEventListener('click', function (e) {
  const nav    = document.getElementById('main-nav');
  const toggle = document.getElementById('nav-toggle');
  if (!nav || !toggle) return;
  if (!nav.contains(e.target) && !toggle.contains(e.target)) {
    nav.classList.remove('open');
  }
});


/* ── FORMULARIOS ────────────────────────────────────────────── */

/* Vacaciones */
function handleVac(e) {
  e.preventDefault();
  const tipo   = document.getElementById('vac-tipo').value;
  const inicio = document.getElementById('vac-inicio').value;
  const fin    = document.getElementById('vac-fin').value;

  if (!tipo) { showFormMsg('form-vac', 'Selecciona el tipo de solicitud.', 'error'); return; }
  if (!inicio || !fin) { showFormMsg('form-vac', 'Introduce las fechas de inicio y fin.', 'error'); return; }
  if (new Date(fin) < new Date(inicio)) {
    showFormMsg('form-vac', 'La fecha de fin no puede ser anterior a la de inicio.', 'error');
    return;
  }
  showFormMsg('form-vac', 'Solicitud enviada. Tu responsable la revisará en un plazo de 48 horas.', 'ok');
  e.target.reset();
}

/* Inscripción a curso */
function handleCurso(e) {
  e.preventDefault();
  const curso = document.getElementById('cur-nombre').value;
  const turno = document.getElementById('cur-turno').value;

  if (!curso) { showFormMsg('form-curso', 'Selecciona el curso al que deseas inscribirte.', 'error'); return; }
  if (!turno) { showFormMsg('form-curso', 'Selecciona un horario preferido.', 'error'); return; }
  showFormMsg('form-curso', 'Inscripción registrada. Recibirás confirmación por correo en los próximos días.', 'ok');
  e.target.reset();
}

/* Canal de denuncias */
function handleDenuncia(e) {
  e.preventDefault();
  const tipo  = document.getElementById('den-tipo').value;
  const texto = document.getElementById('den-texto').value.trim();

  if (!tipo)          { showFormMsg('form-denuncia', 'Selecciona la categoría de la conducta.', 'error'); return; }
  if (texto.length < 20) { showFormMsg('form-denuncia', 'La descripción es demasiado breve. Añade más detalle.', 'error'); return; }
  showFormMsg('form-denuncia', 'Comunicación enviada de forma anónima y segura. Plazo máximo de respuesta: 10 días hábiles.', 'ok');
  e.target.reset();
}

/* Mostrar mensaje de formulario */
function showFormMsg(formId, msg, type) {
  const prev = document.getElementById('msg-' + formId);
  if (prev) prev.remove();

  const el = document.createElement('p');
  el.id = 'msg-' + formId;
  el.className = 'form-msg ' + type;
  el.textContent = msg;

  const form = document.getElementById(formId);
  if (form) form.appendChild(el);

  if (type === 'ok') {
    setTimeout(function () {
      const m = document.getElementById('msg-' + formId);
      if (m) m.remove();
    }, 7000);
  }
}


/* ── TOAST ──────────────────────────────────────────────────── */

let toastTimer = null;

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('visible');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove('visible');
  }, 3200);
}
