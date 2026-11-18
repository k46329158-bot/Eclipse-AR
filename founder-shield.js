(function() {
  const FOUNDER_EMAIL = 'k46329158@gmail.com';

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function ensureFirebaseReady() {
    if (!window.firebase || !firebase.auth) {
      await loadScript('https://gstatic.com' + '/firebasejs/10.12.2/firebase-app-compat.js');
      await loadScript('https://gstatic.com' + '/firebasejs/10.12.2/firebase-auth-compat.js');
    }
    if (window.firebase && (!firebase.apps || firebase.apps.length === 0)) {
      firebase.initializeApp({
        apiKey: "AIzaSyDRqYi8BsrjP4gdxmdq5XKiWnrn9aDyKGg",
        authDomain: ["eclipse","aiden"].join("-") + ".firebaseapp.com",
        projectId: ["eclipse","aiden"].join("-")
      });
    }
  }

  window.checkIsFounderActive = function() {
    const acc = JSON.parse(localStorage.getItem('eclipse_verified_google_user') || 'null');
    return !!(acc && acc.verifiedByGoogle === true && String(acc.email || '').toLowerCase() === FOUNDER_EMAIL);
  };

  window.loginWithRealGoogleBot = async function() {
    try {
      await ensureFirebaseReady();
      const provider = new firebase.auth.GoogleAuthProvider();
      const res = await firebase.auth().signInWithPopup(provider);
      const u = res.user;
      if (!u || !u.email) return;
      const isF = u.email.toLowerCase() === FOUNDER_EMAIL;
      const name = isF ? 'Æiden Company' : (prompt('Elige tu nombre de canal único:', u.displayName || u.email.split('@')[0]) || '').trim();
      if (!name) return;
      const prof = { uid: u.uid, name, email: u.email, verifiedByGoogle: true };
      localStorage.setItem('eclipse_verified_google_user', JSON.stringify(prof));
      localStorage.setItem('eclipse_account_active', JSON.stringify(prof));
      location.reload();
    } catch (e) {
      alert('No se pudo abrir la ventana de Google: ' + (e.message || e));
    }
  };

  window.openAnimStudio = function() {
    const hasAnim = localStorage.getItem('eclipse_unlocked_anim') === '1';
    if (!window.checkIsFounderActive() && !hasAnim) {
      alert('El Estudio de Animación Pro cuesta 30,000 Lunas en la Tienda de Lunas.');
      if (typeof openStoreModal === 'function') openStoreModal();
      return;
    }
    const m = document.getElementById('animModal');
    if (m) { m.classList.remove('hidden'); m.style.display = 'flex'; }
  };

  window.indultarCanalFundador = function(canal) {
    if (!window.checkIsFounderActive() || !canal) return;
    const list = JSON.parse(localStorage.getItem('eclipse_founder_exempt') || '[]');
    if (!list.some(x => x.toLowerCase() === canal.toLowerCase())) { list.push(canal.trim()); localStorage.setItem('eclipse_founder_exempt', JSON.stringify(list)); }
    window.openFounderJusticeModal();
  };

  window.grantAdminRole = function(u) {
    if (!window.checkIsFounderActive() || !u) return;
    const list = JSON.parse(localStorage.getItem('eclipse_admins_list') || '[]');
    if (!list.some(x => x.toLowerCase() === u.trim().toLowerCase())) { list.push(u.trim()); localStorage.setItem('eclipse_admins_list', JSON.stringify(list)); }
    alert('¡' + u.trim() + ' ahora es Admin Oficial en Eclipseᴬᴿ!');
  };

  window.openFounderJusticeModal = function() {
    if (!window.checkIsFounderActive()) return;
    let m = document.getElementById('founderJusticeModal');
    if (!m) { m = document.createElement('div'); m.id = 'founderJusticeModal'; m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:16px;'; document.body.appendChild(m); }
    const exempt = JSON.parse(localStorage.getItem('eclipse_founder_exempt') || '[]');
    m.innerHTML = `<div style="width:450px;max-width:95vw;background:#121218;border:1px solid #38bdf8;border-radius:18px;padding:22px;color:#fff;position:relative;">
      <button type="button" onclick="document.getElementById('founderJusticeModal').style.display='none'" style="position:absolute;top:12px;right:12px;background:#27272a;color:#fff;border:none;width:28px;height:28px;border-radius:50%;cursor:pointer;">X</button>
      <h3 style="margin:0 0 6px;font-size:17px;">Justicia Fundador · Inmunidad contra Bots</h3>
      <div style="display:flex;gap:6px;margin:12px 0;">
        <input id="manualExemptName" type="text" placeholder="Canal a inmunizar..." style="flex:1;background:#09090d;border:1px solid #3f3f46;color:#fff;padding:8px;border-radius:10px;" />
        <button type="button" onclick="const v=document.getElementById('manualExemptName').value.trim();if(v)indultarCanalFundador(v);" style="background:#0284c7;color:#fff;border:none;padding:8px 12px;border-radius:10px;font-weight:700;cursor:pointer;">Inmunizar</button>
      </div>
      ${exempt.map(c => `<div style="background:#18181f;border:1px solid #38bdf8;padding:8px 12px;border-radius:10px;margin-bottom:6px;"><b>${c}</b> · Protegido ✓</div>`).join('') || '<p style="color:#a1a1aa;font-size:12px;">Sin canales inmunizados.</p>'}
    </div>`;
    m.style.display = 'flex';
  };

  setInterval(() => {
    const isF = window.checkIsFounderActive();
    const acc = JSON.parse(localStorage.getItem('eclipse_verified_google_user') || 'null');
    const banner = Array.from(document.querySelectorAll('div, section')).find(el => el.textContent && el.textContent.includes('MODO FUNDADOR:') && el.offsetHeight < 100);
    if (banner) {
      banner.style.display = isF ? 'flex' : 'none';
      if (isF && !document.getElementById('founderCleanBar')) {
        const bar = document.createElement('span');
        bar.id = 'founderCleanBar';
        bar.style.cssText = 'display:inline-flex;gap:8px;margin-left:12px;';
        bar.innerHTML = `<button type="button" onclick="openFounderJusticeModal()" style="background:#0284c7;color:#fff;border:none;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:800;cursor:pointer;">Justicia Fundador</button><button type="button" onclick="const f=prompt('Nombre del canal de tu amigo para hacerlo Admin:');if(f)grantAdminRole(f);" style="background:#9333ea;color:#fff;border:none;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:800;cursor:pointer;">+ Nombrar Admin</button>`;
        banner.appendChild(bar);
      }
    }
    const hr = document.querySelector('header .header-right') || document.querySelector('header');
    if (hr) {
      let ab = document.getElementById('eclipseAccountBtn');
      if (!ab) { ab = document.createElement('button'); ab.id = 'eclipseAccountBtn'; ab.type = 'button'; ab.style.cssText = 'background:#1e1b4b;color:#e9d5ff;border:1px solid #7e22ce;padding:6px 12px;border-radius:16px;font-size:12px;font-weight:800;cursor:pointer;'; hr.appendChild(ab); }
      ab.textContent = acc ? (isF ? `@${acc.name} · Fundador ✓` : `@${acc.name} ✓`) : 'Entrar con Google';
      ab.onclick = acc ? () => { localStorage.removeItem('eclipse_verified_google_user'); localStorage.removeItem('eclipse_account_active'); location.reload(); } : window.loginWithRealGoogleBot;
    }
  }, 500);
})();
