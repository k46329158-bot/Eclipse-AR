(function() {
  const FOUNDER_EMAIL = 'k46329158@gmail.com';
  const FOUNDER_NAME = 'æiden company';
  const FOUNDER_BIRTH = '2012-02-06';

  // Ocultar por CSS desde el milisegundo cero cualquier botón/barra de Fundador hasta verificar los 3 requisitos
  const hideCss = document.createElement('style');
  hideCss.id = 'founderStrictHideCss';
  hideCss.textContent = `
    #promoteAdminBtn, #founderJusticeBtn, #founderToolsBar, #founderAccountsBtn { display: none !important; }
    @keyframes wormholeSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    @keyframes ejectToSpace { 0% { transform: translate(-95px,0) scale(0.2); opacity: 0; } 55% { transform: translate(0,0) scale(1); opacity: 1; } 100% { transform: translate(35px,0) scale(0.1); opacity: 0; } }
    @keyframes monsterChomp { 0%,40% { transform: translateX(55px) scale(0.95); } 70% { transform: translateX(10px) scale(1.12); } 100% { transform: translateX(18px) scale(1); } }
    .wh-spin { animation: wormholeSpin 3s linear infinite; }
    .wh-ejected-text { animation: ejectToSpace 2.5s ease-in-out forwards; }
    .cosmic-monster { animation: monsterChomp 2.5s ease-in-out forwards; }
  `;
  document.head.appendChild(hideCss);

  window.checkIsFounderActive = function() {
    const acc = JSON.parse(localStorage.getItem('eclipse_account_active') || 'null');
    if (!acc) return false;
    return (
      String(acc.name || '').trim().toLowerCase() === FOUNDER_NAME &&
      String(acc.email || '').trim().toLowerCase() === FOUNDER_EMAIL &&
      String(acc.birthdate || '').trim() === FOUNDER_BIRTH
    );
  };

  window.triggerWormholeMonster = function(badName, ruleReason) {
    const old = document.getElementById('wormholeSpaceCamModal');
    if (old) old.remove();
    const ov = document.createElement('div');
    ov.id = 'wormholeSpaceCamModal';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(3,4,10,0.95);z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:16px;color:#fff;';
    ov.innerHTML = `<div style="width:470px;max-width:95vw;background:#090b16;border:2px solid #7e22ce;border-radius:20px;padding:20px;text-align:center;">
      <div style="font-size:11px;color:#38bdf8;font-weight:800;margin-bottom:10px;">● REC · CÁMARA ESPACIAL DEL BOT VERIFICADOR</div>
      <div style="height:175px;background:#05060f;border:1px solid #312e81;border-radius:14px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;margin-bottom:12px;">
        <div class="wh-spin"><svg width="80" height="80" viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="10 6"/><circle cx="50" cy="50" r="26" fill="none" stroke="#c084fc" stroke-width="4" stroke-dasharray="8 5"/></svg></div>
        <div class="wh-ejected-text" style="background:#7f1d1d;border:1px solid #f87171;color:#fecaca;padding:5px 10px;border-radius:8px;font-size:12px;font-weight:900;">"${badName}"</div>
        <div class="cosmic-monster"><svg width="105" height="105" viewBox="0 0 120 120" fill="none"><path d="M95 20C55 15 28 38 25 60C28 82 55 105 95 100C85 82 85 38 95 20Z" fill="#4c1d95" stroke="#c084fc" stroke-width="3"/><polygon points="32,46 44,54 30,58" fill="#fff"/><polygon points="30,62 44,66 32,74" fill="#fff"/><circle cx="66" cy="40" r="6" fill="#38bdf8"/><circle cx="66" cy="80" r="6" fill="#38bdf8"/></svg></div>
      </div>
      <h3 style="margin:0 0 6px;font-size:17px;color:#fda4af;">¡El Monstruo Cósmico se devoró ese texto!</h3>
      <p style="margin:0 0 14px;font-size:12.5px;color:#cbd5e1;">${ruleReason}</p>
      <button type="button" onclick="document.getElementById('wormholeSpaceCamModal').remove()" style="background:#9333ea;color:#fff;border:none;padding:9px 20px;border-radius:14px;font-weight:800;cursor:pointer;">Intentar de nuevo</button>
    </div>`;
    document.body.appendChild(ov);
  };
})();

window.FS_ACCOUNTS = 'https://googleapis.com';

window.openAccountAuthModal = function() {
  let m = document.getElementById('eclipseAuthModal');
  if (!m) { m = document.createElement('div'); m.id = 'eclipseAuthModal'; m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:2147483646;display:flex;align-items:center;justify-content:center;padding:16px;'; document.body.appendChild(m); }
  const acc = JSON.parse(localStorage.getItem('eclipse_account_active') || 'null');
  const [y0, m0, d0] = (acc?.birthdate || '--').split('-');

  const days = Array.from({length:31}, (_,i) => `<option value="${String(i+1).padStart(2,'0')}" ${d0===String(i+1).padStart(2,'0')?'selected':''}>${i+1}</option>`).join('');
  const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'].map((n,i) => `<option value="${String(i+1).padStart(2,'0')}" ${m0===String(i+1).padStart(2,'0')?'selected':''}>${n}</option>`).join('');
  const years = Array.from({length:95}, (_,i) => { const y = 2020 - i; return `<option value="${y}" ${y0===String(y)?'selected':''}>${y}</option>`; }).join('');

  m.innerHTML = `<div style="width:430px;max-width:95vw;background:#121218;border:1px solid #7e22ce;border-radius:20px;padding:22px;color:#fff;position:relative;">
    <button type="button" onclick="document.getElementById('eclipseAuthModal').style.display='none'" style="position:absolute;top:12px;right:12px;background:#27272a;color:#fff;border:none;width:28px;height:28px;border-radius:50%;cursor:pointer;">X</button>
    <h3 style="margin:0 0 6px;font-size:18px;">${acc ? 'Tu Perfil Verificado' : 'Crear Cuenta / Iniciar Sesión'}</h3>
    <div id="botVerifyBanner" style="display:none;background:#1e1b4b;border:1px solid #38bdf8;border-radius:12px;padding:10px;margin-bottom:10px;font-size:12px;"></div>
    <form id="eclipseAuthForm" style="display:flex;flex-direction:column;gap:9px;">
      <input id="regName" type="text" required value="${acc ? acc.name : ''}" placeholder="Nombre del canal *" style="background:#09090d;border:1px solid #3f3f46;color:#fff;padding:8px 10px;border-radius:10px;" />
      <input id="regEmail" type="email" required value="${acc ? acc.email : ''}" placeholder="Correo electrónico *" style="background:#09090d;border:1px solid #3f3f46;color:#fff;padding:8px 10px;border-radius:10px;" />
      <div>
        <div style="font-size:11.5px;color:#c084fc;font-weight:700;margin-bottom:4px;">Fecha de nacimiento *</div>
        <div style="display:grid;grid-template-columns:1fr 1.4fr 1.1fr;gap:6px;">
          <select id="regDay" required style="background:#09090d;border:1px solid #3f3f46;color:#fff;padding:8px;border-radius:10px;"><option value="">Día</option>${days}</select>
          <select id="regMonth" required style="background:#09090d;border:1px solid #3f3f46;color:#fff;padding:8px;border-radius:10px;"><option value="">Mes</option>${months}</select>
          <select id="regYear" required style="background:#09090d;border:1px solid #3f3f46;color:#fff;padding:8px;border-radius:10px;"><option value="">Año</option>${years}</select>
        </div>
      </div>
      <textarea id="regBio" rows="2" placeholder="Biografía de tu canal..." style="background:#09090d;border:1px solid #3f3f46;color:#fff;padding:8px 10px;border-radius:10px;">${acc ? acc.bio : ''}</textarea>
      <button type="submit" style="background:linear-gradient(135deg,#9333ea,#0284c7);color:#fff;border:none;padding:10px;border-radius:12px;font-weight:800;cursor:pointer;">Verificar con Bot y Entrar</button>
      ${acc ? `<button type="button" onclick="localStorage.removeItem('eclipse_account_active');document.getElementById('eclipseAuthModal').style.display='none';" style="background:#7f1d1d;color:#fecaca;border:none;padding:8px;border-radius:12px;font-size:12px;cursor:pointer;">Cerrar Sesión</button>` : ''}
    </form>
  </div>`;
  m.style.display = 'flex';
  window.bindStrictAuth();
};

window.bindStrictAuth = function() {
  document.getElementById('eclipseAuthForm').onsubmit = async function(ev) {
    ev.preventDefault();
    const nInp = document.getElementById('regName'), name = nInp.value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const d = document.getElementById('regDay').value, mo = document.getElementById('regMonth').value, y = document.getElementById('regYear').value;
    const birthdate = `${y}-${mo}-${d}`, bio = document.getElementById('regBio').value.trim();
    const banner = document.getElementById('botVerifyBanner');
    const low = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (/(puto|puta|mierda|nazi|racist|escoria|idiota|imbecil|maricon|mogolic|retrasad|hitler|epstein|adolf|porno|porn|xxx|xnxx|hentai|nsfw|pedofil|onlyfans|sex|desnud)/i.test(low)) {
      nInp.value = ''; window.triggerWormholeMonster(name, 'Nombre prohibido por las reglas de Eclipseᴬᴿ.'); return;
    }

    // Bloquear intento de suplantar los datos del Fundador si no coinciden los 3 requisitos exactos
    const isFounderExact = (name.toLowerCase() === 'æiden company' && email.toLowerCase() === 'k46329158@gmail.com' && birthdate === '2012-02-06');
    if (!isFounderExact && (low === 'aiden company' || low === 'æiden company' || email.toLowerCase() === 'k46329158@gmail.com')) {
      nInp.value = ''; window.triggerWormholeMonster(name, 'El nombre y correo del Fundador están protegidos y no se pueden copiar.'); return;
    }

    let cloud = [];
    try { const r = await fetch(window.FS_ACCOUNTS + '?pageSize=100'); const j = await r.json(); if (j.documents) cloud = j.documents.map(x => ({ name: x.fields?.name?.stringValue || '', email: x.fields?.email?.stringValue || '' })); } catch (e) {}
    const local = JSON.parse(localStorage.getItem('eclipse_accounts_db') || '[]'), all = [...cloud, ...local];

    // No permitir copiar el nombre de otro usuario
    if (!isFounderExact && all.some(a => a.name && a.name.toLowerCase() === name.toLowerCase() && a.email.toLowerCase() !== email.toLowerCase())) {
      const b = name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12) || 'Explorador';
      banner.style.display = 'block'; banner.style.borderColor = '#ef4444';
      banner.innerHTML = `<strong style="color:#fda4af;">Ese nombre ya está usado. Ideas:</strong> ${[`${b}_AR`, `${b}Lunar`, `Astro${b}`].map(i => `<button type="button" onclick="document.getElementById('regName').value='${i}'" style="background:#3b0764;color:#e9d5ff;border:1px solid #a855f7;padding:2px 8px;border-radius:8px;font-size:11px;margin:3px;cursor:pointer;">@${i}</button>`).join('')}`;
      return;
    }

    const newAcc = { name, email, birthdate, bio, createdAt: new Date().toLocaleString() };
    localStorage.setItem('eclipse_account_active', JSON.stringify(newAcc));
    localStorage.setItem('eclipse_user', JSON.stringify({ name, email }));
    const db = local.filter(x => x.email.toLowerCase() !== email.toLowerCase()); db.unshift(newAcc);
    localStorage.setItem('eclipse_accounts_db', JSON.stringify(db));
    try { await fetch(window.FS_ACCOUNTS, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: { name: { stringValue: name }, email: { stringValue: email }, bio: { stringValue: bio }, birthdate: { stringValue: birthdate }, createdAt: { stringValue: newAcc.createdAt } } }) }); } catch (e) {}
    document.getElementById('eclipseAuthModal').style.display = 'none';
  };
};

setInterval(() => {
  const isF = window.checkIsFounderActive();
  const acc = JSON.parse(localStorage.getItem('eclipse_account_active') || 'null');
  const cssEl = document.getElementById('founderStrictHideCss');
  if (cssEl) {
    cssEl.textContent = isF
      ? `#promoteAdminBtn, #founderJusticeBtn, #founderToolsBar, #founderAccountsBtn { display: inline-flex !important; }`
      : `#promoteAdminBtn, #founderJusticeBtn, #founderToolsBar, #founderAccountsBtn { display: none !important; }`;
  }
  const banner = Array.from(document.querySelectorAll('div, section')).find(el => el.textContent && el.textContent.includes('MODO FUNDADOR:') && el.offsetHeight < 100);
  if (banner) banner.style.display = isF ? 'flex' : 'none';
  const mb = Array.from(document.querySelectorAll('header button, header span, header div')).find(el => el.textContent && (el.textContent.includes('∞ Lunas') || el.dataset?.moonsSlot));
  if (mb) { mb.dataset.moonsSlot = '1'; mb.textContent = isF ? '∞ Lunas' : `${Number(localStorage.getItem('eclipse_moons') || 0).toLocaleString()} Lunas`; }
  const hr = document.querySelector('header .header-right') || document.querySelector('header');
  if (hr) {
    let ab = document.getElementById('eclipseAccountBtn');
    if (!ab) { ab = document.createElement('button'); ab.id = 'eclipseAccountBtn'; ab.type = 'button'; ab.style.cssText = 'background:#1e1b4b;color:#e9d5ff;border:1px solid #7e22ce;padding:6px 12px;border-radius:16px;font-size:12px;font-weight:800;cursor:pointer;'; ab.onclick = window.openAccountAuthModal; hr.appendChild(ab); }
    ab.textContent = acc ? (isF ? `@${acc.name} · Fundador` : `@${acc.name}`) : 'Crear Cuenta / Entrar';
  }
}, 500);
