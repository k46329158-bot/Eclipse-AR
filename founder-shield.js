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

// === MENÚ DE CONFIGURACIÓN EXCLUSIVO DEL FUNDADOR (ENGRANAJE LIMPIO) ===
(function() {
  window.openFounderSettingsHub = function() {
    if (!window.checkIsFounderActive()) return;
    let m = document.getElementById('founderHubModal');
    if (!m) {
      m = document.createElement('div');
      m.id = 'founderHubModal';
      m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:2147483646;display:flex;align-items:center;justify-content:center;padding:16px;';
      document.body.appendChild(m);
    }
    m.innerHTML = `
      <div style="width:410px;max-width:94vw;background:#121218;border:1px solid #9333ea;border-radius:20px;padding:22px;color:#fff;position:relative;box-shadow:0 20px 50px rgba(0,0,0,0.85);">
        <button type="button" onclick="document.getElementById('founderHubModal').style.display='none'" style="position:absolute;top:12px;right:12px;background:#27272a;color:#fff;border:none;width:28px;height:28px;border-radius:50%;cursor:pointer;">X</button>
        <div style="font-size:11px;color:#c084fc;font-weight:800;letter-spacing:1px;">ÆIDEN COMPANY · PANEL PRIVADO</div>
        <h3 style="margin:2px 0 14px;font-size:18px;">Configuración del Fundador</h3>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <button type="button" onclick="document.getElementById('founderHubModal').style.display='none'; openFounderJusticeModal();" style="display:flex;align-items:center;justify-content:space-between;background:#18181f;border:1px solid #0284c7;color:#fff;padding:12px 14px;border-radius:14px;cursor:pointer;text-align:left;">
            <div><strong style="color:#38bdf8;display:block;font-size:13.5px;">Justicia Fundador</strong><span style="font-size:11.5px;color:#a1a1aa;">Quitar faltas e inmunizar canales contra bots</span></div>
            <span style="color:#38bdf8;font-weight:900;">→</span>
          </button>
          <button type="button" onclick="document.getElementById('founderHubModal').style.display='none'; const f=prompt('Nombre exacto del canal de tu mejor amigo para hacerlo Admin:'); if(f) grantAdminRole(f);" style="display:flex;align-items:center;justify-content:space-between;background:#18181f;border:1px solid #9333ea;color:#fff;padding:12px 14px;border-radius:14px;cursor:pointer;text-align:left;">
            <div><strong style="color:#c084fc;display:block;font-size:13.5px;">+ Nombrar Admin</strong><span style="font-size:11.5px;color:#a1a1aa;">Dar rango e insignia Admin oficial</span></div>
            <span style="color:#c084fc;font-weight:900;">→</span>
          </button>
          <button type="button" onclick="document.getElementById('founderHubModal').style.display='none'; if(typeof openFounderAccountsModal==='function') openFounderAccountsModal();" style="display:flex;align-items:center;justify-content:space-between;background:#18181f;border:1px solid #10b981;color:#fff;padding:12px 14px;border-radius:14px;cursor:pointer;text-align:left;">
            <div><strong style="color:#34d399;display:block;font-size:13.5px;">Cuentas Registradas</strong><span style="font-size:11.5px;color:#a1a1aa;">Ver directorio privado de usuarios verificados</span></div>
            <span style="color:#34d399;font-weight:900;">→</span>
          </button>
        </div>
      </div>
    `;
    m.style.display = 'flex';
  };

  setInterval(() => {
    const isF = window.checkIsFounderActive();
    // Ocultar los botones sueltos y la barra ancha para dejar el header limpio y espaciado
    ['founderCleanBar', 'promoteAdminBtn', 'founderJusticeBtn', 'founderToolsBar', 'founderAccountsBtn'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    const banner = Array.from(document.querySelectorAll('div, section')).find(el => el.textContent && el.textContent.includes('MODO FUNDADOR:') && el.offsetHeight < 100);
    if (banner) banner.style.display = 'none';

    // Mostrar únicamente un botón discreto de engranaje (⚙️) junto a tu perfil si eres Fundador
    const hr = document.querySelector('header .header-right') || document.querySelector('header');
    if (hr) {
      let gear = document.getElementById('founderGearBtn');
      if (isF) {
        if (!gear) {
          gear = document.createElement('button');
          gear.id = 'founderGearBtn';
          gear.type = 'button';
          gear.title = 'Configuración del Fundador';
          gear.style.cssText = 'background:#1e1b4b;color:#c084fc;border:1px solid #7e22ce;width:34px;height:34px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;';
          gear.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
          gear.onclick = window.openFounderSettingsHub;
          hr.appendChild(gear);
        }
        gear.style.display = 'inline-flex';
      } else if (gear) {
        gear.style.display = 'none';
      }
    }
  }, 600);
})();
