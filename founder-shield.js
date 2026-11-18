(function() {
  const FOUNDER_EMAIL = 'k46329158@gmail.com';
  if (window.firebase && firebase.apps && firebase.apps.length === 0) {
    try {
      firebase.initializeApp({
        apiKey: "AIzaSyDRqYi8BsrjP4gdxmdq5XKiWnrn9aDyKGg",
        authDomain: "://firebaseapp.com",
        projectId: "eclipse-aiden"
      });
    } catch (e) {}
  }

  window.checkIsFounderActive = function() {
    const acc = JSON.parse(localStorage.getItem('eclipse_verified_google_user') || 'null');
    return !!(acc && acc.verifiedByGoogle === true && String(acc.email || '').toLowerCase() === FOUNDER_EMAIL);
  };

  window.loginWithRealGoogleBot = async function() {
    if (!window.firebase || !firebase.auth) {
      alert('Iniciando conexión con Google, vuelve a tocar en un segundo.');
      return;
    }
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const res = await firebase.auth().signInWithPopup(provider);
      const u = res.user;
      if (!u || !u.email) return;
      const isF = u.email.toLowerCase() === FOUNDER_EMAIL;
      const name = isF ? 'Æiden Company' : (prompt('Elige tu nombre de canal:', u.displayName || u.email.split('@')) || '').trim();
      if (!name) return;
      const prof = { uid: u.uid, name, email: u.email, verifiedByGoogle: true };
      localStorage.setItem('eclipse_verified_google_user', JSON.stringify(prof));
      localStorage.setItem('eclipse_account_active', JSON.stringify(prof));
      location.reload();
    } catch (e) {
      alert('Error al entrar con Google: ' + (e.message || e));
    }
  };

  setInterval(() => {
    const isF = window.checkIsFounderActive();
    const acc = JSON.parse(localStorage.getItem('eclipse_verified_google_user') || 'null');
    const banner = Array.from(document.querySelectorAll('div, section')).find(el => el.textContent && el.textContent.includes('MODO FUNDADOR:') && el.offsetHeight < 100);
    if (banner) banner.style.display = isF ? 'flex' : 'none';
    const hr = document.querySelector('header .header-right') || document.querySelector('header');
    if (hr) {
      let ab = document.getElementById('eclipseAccountBtn');
      if (!ab) {
        ab = document.createElement('button');
        ab.id = 'eclipseAccountBtn';
        ab.type = 'button';
        ab.style.cssText = 'background:#1e1b4b;color:#e9d5ff;border:1px solid #7e22ce;padding:6px 12px;border-radius:16px;font-size:12px;font-weight:800;cursor:pointer;';
        hr.appendChild(ab);
      }
      ab.textContent = acc ? (isF ? `@${acc.name} · Fundador ✓` : `@${acc.name} ✓`) : 'Entrar con Google';
      ab.onclick = acc ? () => { localStorage.removeItem('eclipse_verified_google_user'); localStorage.removeItem('eclipse_account_active'); location.reload(); } : window.loginWithRealGoogleBot;
    }
  }, 600);
})();

// === DESBLOQUEO DE ESTUDIO ANIMACIÓN + JUSTICIA FUNDADOR + NOMBRAR ADMIN ===
(function() {
  const FOUNDER_EMAIL = 'k46329158@gmail.com';
  const FS_ACCOUNTS = 'https://googleapis.com';

  function isRealFounder() {
    const acc = JSON.parse(localStorage.getItem('eclipse_verified_google_user') || 'null');
    return !!(acc && acc.verifiedByGoogle === true && String(acc.email || '').toLowerCase() === FOUNDER_EMAIL);
  }
  window.checkIsFounderActive = isRealFounder;

  // 1. Arreglar Estudio de Animación para que NUNCA pida Lunas al Fundador
  window.openAnimStudio = function() {
    const hasAnim = localStorage.getItem('eclipse_unlocked_anim') === '1';
    if (!isRealFounder() && !hasAnim) {
      alert('El Estudio de Animación Pro cuesta 30,000 Lunas en la Tienda de Lunas.');
      if (typeof openStoreModal === 'function') openStoreModal();
      return;
    }
    const m = document.getElementById('animModal');
    if (m) { m.classList.remove('hidden'); m.style.display = 'flex'; }
  };

  // 2. Funciones de Inmunizar contra Bots y Nombrar Admin
  window.indultarCanalFundador = function(canal) {
    if (!isRealFounder() || !canal) return;
    if (typeof channelStrikes !== 'undefined') delete channelStrikes[canal];
    const list = JSON.parse(localStorage.getItem('eclipse_founder_exempt') || '[]');
    if (!list.some(x => x.toLowerCase() === canal.toLowerCase())) {
      list.push(canal.trim());
      localStorage.setItem('eclipse_founder_exempt', JSON.stringify(list));
    }
    window.openFounderJusticeModal();
  };

  window.revocarInmunidadFundador = function(canal) {
    if (!isRealFounder()) return;
    const list = JSON.parse(localStorage.getItem('eclipse_founder_exempt') || '[]')
      .filter(x => x.toLowerCase() !== canal.toLowerCase());
    localStorage.setItem('eclipse_founder_exempt', JSON.stringify(list));
    window.openFounderJusticeModal();
  };

  window.grantAdminRole = function(username) {
    if (!isRealFounder() || !username) return;
    const list = JSON.parse(localStorage.getItem('eclipse_admins_list') || '[]');
    if (!list.some(x => x.toLowerCase() === username.trim().toLowerCase())) {
      list.push(username.trim());
      localStorage.setItem('eclipse_admins_list', JSON.stringify(list));
    }
    alert('¡' + username.trim() + ' ahora es Admin Oficial en Eclipseᴬᴿ!');
  };
})();

window.openFounderJusticeModal = function() {
  if (!window.checkIsFounderActive()) return;
  let m = document.getElementById('founderJusticeModal');
  if (!m) { m = document.createElement('div'); m.id = 'founderJusticeModal'; m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:16px;'; document.body.appendChild(m); }
  const exempt = JSON.parse(localStorage.getItem('eclipse_founder_exempt') || '[]');
  m.innerHTML = `<div style="width:450px;max-width:95vw;background:#121218;border:1px solid #38bdf8;border-radius:18px;padding:22px;color:#fff;position:relative;">
    <button type="button" onclick="document.getElementById('founderJusticeModal').style.display='none'" style="position:absolute;top:12px;right:12px;background:#27272a;color:#fff;border:none;width:28px;height:28px;border-radius:50%;cursor:pointer;">X</button>
    <h3 style="margin:0 0 6px;font-size:17px;">Justicia Fundador · Inmunidad contra Bots</h3>
    <p style="margin:0 0 12px;font-size:12px;color:#a1a1aa;">Inmuniza canales inocentes para que ningún bot los bloquee por error.</p>
    <div style="display:flex;gap:6px;margin-bottom:12px;">
      <input id="manualExemptName" type="text" placeholder="Nombre del canal a inmunizar..." style="flex:1;background:#09090d;border:1px solid #3f3f46;color:#fff;padding:8px;border-radius:10px;" />
      <button type="button" onclick="const v=document.getElementById('manualExemptName').value.trim();if(v)indultarCanalFundador(v);" style="background:#0284c7;color:#fff;border:none;padding:8px 12px;border-radius:10px;font-weight:700;cursor:pointer;">Inmunizar</button>
    </div>
    ${exempt.map(c => `<div style="display:flex;justify-content:space-between;align-items:center;background:#18181f;border:1px solid #38bdf8;padding:8px 12px;border-radius:10px;margin-bottom:6px;"><span><b>${c}</b> · Protegido ✓</span><button type="button" onclick="revocarInmunidadFundador('${c.replace(/'/g,"\\'")}')" style="background:#7f1d1d;color:#fecaca;border:none;padding:4px 8px;border-radius:8px;font-size:11px;cursor:pointer;">Quitar</button></div>`).join('') || '<p style="color:#a1a1aa;font-size:12px;">No hay canales inmunizados aún.</p>'}
  </div>`;
  m.style.display = 'flex';
};

setInterval(() => {
  const isF = window.checkIsFounderActive();
  const banner = Array.from(document.querySelectorAll('div, section')).find(el => el.textContent && el.textContent.includes('MODO FUNDADOR:') && el.offsetHeight < 100);
  if (banner) {
    banner.style.display = isF ? 'flex' : 'none';
    if (isF && !document.getElementById('founderCleanBar')) {
      const bar = document.createElement('span');
      bar.id = 'founderCleanBar';
      bar.style.cssText = 'display:inline-flex;gap:8px;margin-left:12px;flex-wrap:wrap;';
      bar.innerHTML = `
        <button type="button" onclick="openFounderJusticeModal()" style="background:#0284c7;color:#fff;border:none;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:800;cursor:pointer;">Justicia Fundador</button>
        <button type="button" onclick="const f=prompt('Nombre exacto del canal de tu mejor amigo para hacerlo Admin:');if(f)grantAdminRole(f);" style="background:#9333ea;color:#fff;border:none;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:800;cursor:pointer;">+ Nombrar Admin</button>
      `;
      banner.appendChild(bar);
    }
  }
}, 600);
