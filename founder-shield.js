(function() {
  const FOUNDER_EMAIL = 'k46329158@gmail.com';
  const FS_ACCOUNTS = 'https://googleapis.com';
  const st = document.createElement('style');
  st.textContent = `.founder-bar,#founderBanner,#founderCleanBar,#promoteAdminBtn,#founderJusticeBtn,#founderToolsBar,#founderAccountsBtn{display:none!important}`;
  document.head.appendChild(st);

  function loadScript(src) {
    return new Promise((res, rej) => {
      if (document.querySelector(`script[src="${src}"]`)) return res();
      const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
    });
  }

  window.checkIsFounderActive = function() {
    const acc = JSON.parse(localStorage.getItem('eclipse_verified_google_user') || 'null');
    return !!(acc && acc.verifiedByGoogle === true && String(acc.email || '').toLowerCase() === FOUNDER_EMAIL);
  };

  window.loginWithRealGoogleBot = async function() {
    try {
      if (!window.firebase || !firebase.auth) {
        await loadScript('https://gstatic.com' + '/firebasejs/10.12.2/firebase-app-compat.js');
        await loadScript('https://gstatic.com' + '/firebasejs/10.12.2/firebase-auth-compat.js');
      }
      if (window.firebase && (!firebase.apps || !firebase.apps.length)) {
        firebase.initializeApp({ apiKey: "AIzaSyDRqYi8BsrjP4gdxmdq5XKiWnrn9aDyKGg", authDomain: ["eclipse","aiden"].join("-") + ".firebaseapp.com", projectId: ["eclipse","aiden"].join("-") });
      }
      const res = await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
      const u = res.user;
      if (!u || !u.email) return;

      const isF = u.email.toLowerCase() === FOUNDER_EMAIL;
      const defaultName = isF ? 'Æiden Company' : (u.displayName || u.email.split('@')[0] || 'Explorador');
      let name = defaultName;

      if (!isF) {
        const chosen = prompt(`¡Hola ${defaultName}! Google verificó tu cuenta.\nEscribe el nombre único que quieres para tu canal en Eclipseᴬᴿ:`, defaultName);
        if (!chosen || !chosen.trim()) { await firebase.auth().signOut(); return; }
        name = chosen.trim();
        const low = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        // Filtro de moderación para términos prohibidos o inapropiados
        if (/(termino_inapropiado1|termino_inapropiado2|aiden company|æiden company)/i.test(low)) {
          await firebase.auth().signOut();
          alert('El Bot Verificador rechazó ese nombre porque rompe las reglas de Eclipseᴬᴿ.');
          return;
        }
      }

      const prof = {
        uid: u.uid,
        name: name,
        email: u.email,
        photo: u.photoURL || '',
        verifiedByGoogle: true,
        createdAt: new Date().toLocaleString()
      };
      localStorage.setItem('eclipse_verified_google_user', JSON.stringify(prof));
      localStorage.setItem('eclipse_account_active', JSON.stringify(prof));
      localStorage.setItem('eclipse_user', JSON.stringify({ name: prof.name, email: prof.email }));
      if (!localStorage.getItem('eclipse_moons')) localStorage.setItem('eclipse_moons', '50');

      // Guardar la cuenta en Firestore global para que quede registrada en Eclipse
      try {
        await fetch(FS_ACCOUNTS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: {
              name: { stringValue: prof.name },
              email: { stringValue: prof.email },
              uid: { stringValue: prof.uid },
              createdAt: { stringValue: prof.createdAt }
            }
          })
        });
      } catch (e) {}

      location.reload();
    } catch (e) {
      alert('Error al iniciar sesión con Google: ' + (e.message || e));
    }
  };
})();

window.openAnimStudio = function() {
  if (!window.checkIsFounderActive() && localStorage.getItem('eclipse_unlocked_anim') !== '1') {
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
  m.innerHTML = `<div style="width:430px;max-width:95vw;background:#121218;border:1px solid #38bdf8;border-radius:18px;padding:22px;color:#fff;position:relative;"><button type="button" onclick="document.getElementById('founderJusticeModal').style.display='none'" style="position:absolute;top:12px;right:12px;background:#27272a;color:#fff;border:none;width:28px;height:28px;border-radius:50%;cursor:pointer;">X</button><h3 style="margin:0 0 8px;">Justicia Fundador</h3><div style="display:flex;gap:6px;margin-bottom:10px;"><input id="manualExemptName" type="text" placeholder="Canal a inmunizar..." style="flex:1;background:#09090d;border:1px solid #3f3f46;color:#fff;padding:8px;border-radius:10px;" /><button type="button" onclick="const v=document.getElementById('manualExemptName').value.trim();if(v)indultarCanalFundador(v);" style="background:#0284c7;color:#fff;border:none;padding:8px 12px;border-radius:10px;font-weight:700;cursor:pointer;">Inmunizar</button></div>${exempt.map(c => `<div style="background:#18181f;border:1px solid #38bdf8;padding:6px 10px;border-radius:8px;margin-bottom:5px;"><b>${c}</b> · Protegido ✓</div>`).join('') || '<p style="color:#a1a1aa;font-size:12px;">Sin canales inmunizados.</p>'}</div>`;
  m.style.display = 'flex';
};

window.openFounderAccountsModal = async function() {
  if (!window.checkIsFounderActive()) return;
  let m = document.getElementById('founderAccountsModal');
  if (!m) { m = document.createElement('div'); m.id = 'founderAccountsModal'; m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:16px;'; document.body.appendChild(m); }
  let list = [];
  try {
    const r = await fetch('https://googleapis.com');
    const d = await r.json();
    if (d.documents) list = d.documents.map(x => ({ name: x.fields?.name?.stringValue || '', email: x.fields?.email?.stringValue || '', createdAt: x.fields?.createdAt?.stringValue || '' }));
  } catch (e) {}
  m.innerHTML = `<div style="width:460px;max-width:95vw;max-height:85vh;overflow-y:auto;background:#121218;border:1px solid #10b981;border-radius:18px;padding:22px;color:#fff;position:relative;"><button type="button" onclick="document.getElementById('founderAccountsModal').style.display='none'" style="position:absolute;top:12px;right:12px;background:#27272a;color:#fff;border:none;width:28px;height:28px;border-radius:50%;cursor:pointer;">X</button><h3 style="margin:0 0 8px;">Cuentas Verificadas (${list.length})</h3>${list.map(u => `<div style="background:#18181f;border:1px solid #3f3f46;padding:10px;border-radius:10px;margin-bottom:8px;"><strong style="color:#c084fc;">@${u.name}</strong><div style="font-size:12px;">${u.email}</div><div style="font-size:11px;color:#a1a1aa;">${u.createdAt}</div></div>`).join('') || '<p style="color:#a1a1aa;">Sin cuentas aún.</p>'}</div>`;
  m.style.display = 'flex';
};

window.openFounderSettingsHub = function() {
  if (!window.checkIsFounderActive()) return;
  let m = document.getElementById('founderHubModal');
  if (!m) { m = document.createElement('div'); m.id = 'founderHubModal'; m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:2147483646;display:flex;align-items:center;justify-content:center;padding:16px;'; document.body.appendChild(m); }
  m.innerHTML = `<div style="width:390px;max-width:94vw;background:#121218;border:1px solid #9333ea;border-radius:20px;padding:22px;color:#fff;position:relative;"><button type="button" onclick="document.getElementById('founderHubModal').style.display='none'" style="position:absolute;top:12px;right:12px;background:#27272a;color:#fff;border:none;width:28px;height:28px;border-radius:50%;cursor:pointer;">X</button><h3 style="margin:0 0 12px;font-size:18px;">Configuración del Fundador</h3><div style="display:flex;flex-direction:column;gap:9px;"><button type="button" onclick="document.getElementById('founderHubModal').style.display='none';openFounderJusticeModal();" style="background:#18181f;border:1px solid #0284c7;color:#fff;padding:11px;border-radius:12px;cursor:pointer;text-align:left;"><strong style="color:#38bdf8;">Justicia Fundador</strong></button><button type="button" onclick="document.getElementById('founderHubModal').style.display='none';const f=prompt('Canal de tu amigo para hacerlo Admin:');if(f)grantAdminRole(f);" style="background:#18181f;border:1px solid #9333ea;color:#fff;padding:11px;border-radius:12px;cursor:pointer;text-align:left;"><strong style="color:#c084fc;">+ Nombrar Admin</strong></button><button type="button" onclick="document.getElementById('founderHubModal').style.display='none';openFounderAccountsModal();" style="background:#18181f;border:1px solid #10b981;color:#fff;padding:11px;border-radius:12px;cursor:pointer;text-align:left;"><strong style="color:#34d399;">Cuentas Registradas</strong></button></div></div>`;
  m.style.display = 'flex';
};

function initCleanHeader() {
  const isF = window.checkIsFounderActive(), acc = JSON.parse(localStorage.getItem('eclipse_verified_google_user') || 'null');
  document.querySelectorAll('div, section').forEach(el => { if (el.textContent && el.textContent.includes('MODO FUNDADOR:') && el.offsetHeight < 100) el.remove(); });
  document.querySelectorAll('header button, header .user-badge, header span').forEach(el => {
    const t = (el.textContent || '').trim();
    if (t === 'Æiden Company' || t.includes('Æiden Company Studios') || t.includes('Lunas')) el.style.display = 'none';
  });
  const hr = document.querySelector('header .header-right') || document.querySelector('header');
  if (hr) {
    let ab = document.getElementById('eclipseAccountBtn');
    if (!ab) { ab = document.createElement('button'); ab.id = 'eclipseAccountBtn'; ab.type = 'button'; ab.style.cssText = 'background:#1e1b4b;color:#e9d5ff;border:1px solid #7e22ce;padding:7px 14px;border-radius:18px;font-size:12px;font-weight:800;cursor:pointer;white-space:nowrap;'; hr.appendChild(ab); }
    ab.textContent = acc ? (isF ? `@${acc.name} · Fundador ✓` : `@${acc.name} ✓`) : 'Entrar con Google';
    ab.onclick = acc ? () => { if(confirm('¿Cerrar sesión?')){ localStorage.removeItem('eclipse_verified_google_user'); localStorage.removeItem('eclipse_account_active'); location.reload(); } } : window.loginWithRealGoogleBot;
    if (isF && !document.getElementById('founderGearBtn')) {
      const g = document.createElement('button'); g.id = 'founderGearBtn'; g.type = 'button'; g.title = 'Configuración del Fundador';
      g.style.cssText = 'background:#1e1b4b;color:#c084fc;border:1px solid #7e22ce;width:34px;height:34px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;';
      g.textContent = '⚙'; g.onclick = window.openFounderSettingsHub; hr.appendChild(g);
    }
  }
  const inA = document.getElementById('inAuthor');
  if (inA && acc) inA.value = acc.name;
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCleanHeader); else initCleanHeader();
setTimeout(initCleanHeader, 400);
