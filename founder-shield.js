(function() {
  const PROJECT_ID = 'eclipse-aiden';
  const FS_ACCOUNTS = `https://googleapis.com{PROJECT_ID}/databases/(default)/documents/eclipse_accounts`;
  const FOUNDER_EMAIL = 'k46329158@gmail.com';

  const st = document.createElement('style');
  st.textContent = `
    @keyframes wormholeSpin { 0% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(1.08); } 100% { transform: rotate(360deg) scale(1); } }
    @keyframes ejectToSpace { 0% { transform: translate(-110px, 0) scale(0.2) rotate(-180deg); opacity: 0; } 55% { transform: translate(-10px, -6px) scale(1) rotate(0deg); opacity: 1; } 100% { transform: translate(35px, 0) scale(0.1); opacity: 0; } }
    @keyframes monsterChomp { 0%, 40% { transform: translateX(65px) scale(0.95); } 65% { transform: translateX(12px) scale(1.12); } 85% { transform: translateX(20px) scale(1); } 100% { transform: translateX(24px) scale(1.03); } }
    .wh-spin { animation: wormholeSpin 3s linear infinite; }
    .wh-ejected-text { animation: ejectToSpace 2.6s ease-in-out forwards; }
    .cosmic-monster { animation: monsterChomp 2.6s ease-in-out forwards; }
  `;
  document.head.appendChild(st);

  window.triggerWormholeMonster = function(badName, ruleReason) {
    const old = document.getElementById('wormholeSpaceCamModal');
    if (old) old.remove();

    const ov = document.createElement('div');
    ov.id = 'wormholeSpaceCamModal';
    ov.style.cssText = 'position:fixed; inset:0; background:rgba(3,4,10,0.94); z-index:2147483647; display:flex; align-items:center; justify-content:center; padding:16px; color:#fff;';
    ov.innerHTML = `
      <div style="width:490px; max-width:95vw; background:#090b16; border:2px solid #7e22ce; border-radius:20px; padding:20px; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,0.9);">
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:#38bdf8; font-weight:800; margin-bottom:10px; border-bottom:1px solid #1e293b; padding-bottom:6px;">
          <span>● REC · CÁMARA ESPACIAL DEL BOT VERIFICADOR</span>
          <span>AGUJERO DE GUSANO ACTIVO</span>
        </div>
        <div style="position:relative; height:190px; background:radial-gradient(circle at center, #17122b 0%, #04050a 100%); border:1px solid #312e81; border-radius:14px; overflow:hidden; display:flex; align-items:center; justify-content:space-between; padding:0 18px; margin-bottom:14px;">
          <!-- Agujero de gusano expulsando el texto prohibido -->
          <div class="wh-spin" style="width:86px; height:86px; flex-shrink:0;">
            <svg width="86" height="86" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="10 6"/>
              <circle cx="50" cy="50" r="30" fill="none" stroke="#c084fc" stroke-width="4" stroke-dasharray="8 5"/>
              <circle cx="50" cy="50" r="16" fill="#09090d" stroke="#e879f9" stroke-width="3"/>
            </svg>
          </div>
          <!-- Texto prohibido expulsado -->
          <div class="wh-ejected-text" style="background:#7f1d1d; border:1px solid #f87171; color:#fecaca; padding:5px 10px; border-radius:8px; font-size:12px; font-weight:900; max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
            "${badName}"
          </div>
          <!-- Monstruo Cósmico devorándolo -->
          <div class="cosmic-monster" style="width:115px; height:115px; flex-shrink:0;">
            <svg width="115" height="115" viewBox="0 0 120 120" fill="none">
              <path d="M95 20 C55 15 28 38 25 60 C28 82 55 105 95 100 C85 82 85 38 95 20 Z" fill="#4c1d95" stroke="#c084fc" stroke-width="3"/>
              <!-- Dientes cósmicos -->
              <polygon points="32,46 44,54 30,58" fill="#ffffff"/>
              <polygon points="30,62 44,66 32,74" fill="#ffffff"/>
              <polygon points="48,36 56,47 43,47" fill="#ffffff"/>
              <polygon points="43,73 56,73 48,84" fill="#ffffff"/>
              <!-- Ojos brillantes -->
              <circle cx="66" cy="40" r="6" fill="#38bdf8"/>
              <circle cx="65" cy="40" r="2.5" fill="#09090d"/>
              <circle cx="66" cy="80" r="6" fill="#38bdf8"/>
              <circle cx="65" cy="80" r="2.5" fill="#09090d"/>
            </svg>
          </div>
        </div>
        <h3 style="margin:0 0 6px; font-size:17px; color:#fda4af;">¡El Monstruo Cósmico se devoró ese nombre!</h3>
        <p style="margin:0 0 16px; font-size:12.5px; color:#cbd5e1;">${ruleReason}</p>
        <button type="button" onclick="document.getElementById('wormholeSpaceCamModal').remove()" style="background:linear-gradient(135deg,#9333ea,#0284c7); color:#fff; border:none; padding:9px 22px; border-radius:14px; font-size:13px; font-weight:800; cursor:pointer;">Elegir otro nombre limpio</button>
      </div>
    `;
    document.body.appendChild(ov);
  };
})();

window.FOUNDER_EMAIL = 'k46329158@gmail.com';
window.FS_ACCOUNTS = 'https://googleapis.com';

window.checkIsFounderActive = function() {
  if (localStorage.getItem('eclipse_founder_auth') === '1') return true;
  const acc = JSON.parse(localStorage.getItem('eclipse_account_active') || 'null');
  return !!(acc && (acc.email.toLowerCase() === window.FOUNDER_EMAIL || acc.name.toLowerCase() === 'æiden company'));
};

window.verifyNameWithBot = function(rawName, email, existing) {
  const clean = rawName.trim();
  const low = clean.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (clean.length < 3) return { ok: false, type: 'short', msg: 'El nombre debe tener al menos 3 caracteres.' };
  if (/(puto|puta|mierda|nazi|racist|escoria|idiota|imbecil|maricon|mogolic|retrasad)/i.test(low)) return { ok: false, type: 'banned', msg: 'Regla 1: No se permiten insultos, discriminación ni racismo.' };
  if (/(hitler|epstein|jeffrey epstein|adolf|alan hitler|bin laden|ted bundy|dahmer)/i.test(low)) return { ok: false, type: 'banned', msg: 'Regla 2: Nombre prohibido en Eclipseᴬᴿ.' };
  if (/(porno|porn|xxx|xnxx|xvideos|hentai|nsfw|banned_term|pedofil|onlyfans|sex|desnud|erotic)/i.test(low)) return { ok: false, type: 'banned', msg: 'Regla 3: No se permiten nombres relacionados con pornografía.' };
  if ((low === 'aiden company' || low === 'æiden company') && email.toLowerCase() !== window.FOUNDER_EMAIL && localStorage.getItem('eclipse_founder_auth') !== '1') return { ok: false, type: 'banned', msg: 'Regla 4: "Æiden Company" es exclusivo del Fundador.' };
  const taken = existing.some(a => a.name && a.name.toLowerCase() === clean.toLowerCase() && a.email.toLowerCase() !== email.toLowerCase());
  if (taken) {
    const b = clean.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12) || 'Explorador';
    return { ok: false, type: 'taken', ideas: [`${b}_AR`, `${b}Lunar`, `Astro${b}${Math.floor(10 + Math.random() * 89)}`], msg: `Regla 4: "@${clean}" ya está ocupado.` };
  }
  return { ok: true };
};

window.openAccountAuthModal = function() {
  let m = document.getElementById('eclipseAuthModal');
  if (!m) {
    m = document.createElement('div');
    m.id = 'eclipseAuthModal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:2147483646;display:flex;align-items:center;justify-content:center;padding:16px;';
    document.body.appendChild(m);
  }
  const acc = JSON.parse(localStorage.getItem('eclipse_account_active') || 'null');
  m.innerHTML = `<div style="width:420px;max-width:95vw;background:#121218;border:1px solid #7e22ce;border-radius:20px;padding:22px;color:#fff;position:relative;">
    <button type="button" onclick="document.getElementById('eclipseAuthModal').style.display='none'" style="position:absolute;top:12px;right:12px;background:#27272a;color:#fff;border:none;width:28px;height:28px;border-radius:50%;cursor:pointer;">X</button>
    <h3 style="margin:0 0 8px;font-size:18px;">${acc ? 'Tu Perfil Verificado' : 'Crear Cuenta / Entrar'}</h3>
    <div id="botVerifyBanner" style="display:none;background:#1e1b4b;border:1px solid #38bdf8;border-radius:12px;padding:10px;margin-bottom:10px;font-size:12px;"></div>
    <form id="eclipseAuthForm" style="display:flex;flex-direction:column;gap:8px;">
      <input id="regName" type="text" required value="${acc ? acc.name : ''}" placeholder="Nombre del canal *" style="background:#09090d;border:1px solid #3f3f46;color:#fff;padding:8px;border-radius:10px;" />
      <input id="regEmail" type="email" required value="${acc ? acc.email : ''}" placeholder="Correo electrónico *" style="background:#09090d;border:1px solid #3f3f46;color:#fff;padding:8px;border-radius:10px;" />
      <input id="regBirth" type="date" required value="${acc ? acc.birthdate : ''}" style="background:#09090d;border:1px solid #3f3f46;color:#fff;padding:8px;border-radius:10px;" />
      <input id="regAvatar" type="file" accept="image/*" style="font-size:12px;color:#a1a1aa;" />
      <textarea id="regBio" rows="2" placeholder="Biografía..." style="background:#09090d;border:1px solid #3f3f46;color:#fff;padding:8px;border-radius:10px;">${acc ? acc.bio : ''}</textarea>
      <button type="submit" style="background:#9333ea;color:#fff;border:none;padding:10px;border-radius:12px;font-weight:800;cursor:pointer;">Verificar con Bot y Entrar</button>
      ${acc ? `<button type="button" onclick="localStorage.removeItem('eclipse_account_active');localStorage.removeItem('eclipse_founder_auth');document.getElementById('eclipseAuthModal').style.display='none';" style="background:#7f1d1d;color:#fecaca;border:none;padding:8px;border-radius:12px;font-size:12px;cursor:pointer;">Cerrar Sesión</button>` : ''}
    </form>
  </div>`;
  m.style.display = 'flex';
  window.bindAuthSubmit();
};

window.bindAuthSubmit = function() {
  document.getElementById('eclipseAuthForm').onsubmit = async function(ev) {
    ev.preventDefault();
    const nInp = document.getElementById('regName'), name = nInp.value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const birthdate = document.getElementById('regBirth').value;
    const bio = document.getElementById('regBio').value.trim();
    const banner = document.getElementById('botVerifyBanner');
    let cloud = [];
    try {
      const r = await fetch(window.FS_ACCOUNTS + '?pageSize=100');
      const d = await r.json();
      if (d.documents) cloud = d.documents.map(x => ({ name: x.fields?.name?.stringValue || '', email: x.fields?.email?.stringValue || '' }));
    } catch (e) {}
    const local = JSON.parse(localStorage.getItem('eclipse_accounts_db') || '[]');
    const v = window.verifyNameWithBot(name, email, [...cloud, ...local]);
    if (!v.ok) {
      if (v.type === 'banned') { nInp.value = ''; window.triggerWormholeMonster(name, v.msg); return; }
      banner.style.display = 'block'; banner.style.borderColor = '#ef4444';
      banner.innerHTML = `<strong style="color:#fda4af;">${v.msg}</strong>` + (v.ideas ? `<div style="margin-top:6px;">Ideas: ${v.ideas.map(i => `<button type="button" onclick="document.getElementById('regName').value='${i}'" style="background:#3b0764;color:#e9d5ff;border:1px solid #a855f7;padding:2px 8px;border-radius:8px;font-size:11px;margin:3px;cursor:pointer;">@${i}</button>`).join('')}</div>` : '');
      return;
    }
    if (email.toLowerCase() === window.FOUNDER_EMAIL || name.toLowerCase() === 'æiden company') {
      localStorage.setItem('eclipse_founder_auth', '1'); window.isFounder = true;
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

window.openFounderAccountsModal = async function() {
  if (!window.checkIsFounderActive()) return;
  let m = document.getElementById('founderAccountsModal');
  if (!m) { m = document.createElement('div'); m.id = 'founderAccountsModal'; m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:16px;'; document.body.appendChild(m); }
  let cloud = [];
  try { const r = await fetch(window.FS_ACCOUNTS + '?pageSize=100'); const d = await r.json(); if (d.documents) cloud = d.documents.map(x => ({ name: x.fields?.name?.stringValue || '', email: x.fields?.email?.stringValue || '', birthdate: x.fields?.birthdate?.stringValue || '', bio: x.fields?.bio?.stringValue || '' })); } catch (e) {}
  const all = [...cloud, ...JSON.parse(localStorage.getItem('eclipse_accounts_db') || '[]')], uniq = [], seen = new Set();
  for (const u of all) { const k = (u.email || u.name).toLowerCase(); if (k && !seen.has(k)) { seen.add(k); uniq.push(u); } }
  m.innerHTML = `<div style="width:480px;max-width:95vw;max-height:85vh;overflow-y:auto;background:#121218;border:1px solid #10b981;border-radius:20px;padding:22px;color:#fff;position:relative;">
    <button type="button" onclick="document.getElementById('founderAccountsModal').style.display='none'" style="position:absolute;top:12px;right:12px;background:#27272a;color:#fff;border:none;width:28px;height:28px;border-radius:50%;cursor:pointer;">X</button>
    <h3 style="margin:0 0 8px;font-size:17px;">Cuentas Registradas · Solo Fundador (${uniq.length})</h3>
    ${uniq.map(u => `<div style="background:#18181f;border:1px solid #3f3f46;border-radius:12px;padding:10px;margin-bottom:8px;"><strong style="color:#c084fc;">@${u.name}</strong> · <span style="font-size:11px;color:#38bdf8;">${u.birthdate}</span><div style="font-size:12px;">${u.email}</div><div style="font-size:11.5px;color:#a1a1aa;">${u.bio || ''}</div></div>`).join('') || '<p style="color:#a1a1aa;">Aún no hay cuentas.</p>'}
  </div>`;
  m.style.display = 'flex';
};

setInterval(() => {
  const isF = window.checkIsFounderActive(), acc = JSON.parse(localStorage.getItem('eclipse_account_active') || 'null');
  const banner = Array.from(document.querySelectorAll('div, section')).find(el => el.textContent && el.textContent.includes('MODO FUNDADOR:') && el.offsetHeight < 100);
  if (!isF) {
    if (banner) banner.style.display = 'none';
    ['promoteAdminBtn', 'founderJusticeBtn', 'founderToolsBar', 'founderAccountsBtn'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
  } else if (banner) {
    banner.style.display = 'flex';
    if (!document.getElementById('founderAccountsBtn')) {
      const b = document.createElement('button'); b.id = 'founderAccountsBtn'; b.type = 'button';
      b.style.cssText = 'background:#059669;color:#fff;border:none;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:800;cursor:pointer;margin-left:8px;';
      b.textContent = 'Cuentas Registradas'; b.onclick = window.openFounderAccountsModal; banner.appendChild(b);
    }
    ['promoteAdminBtn', 'founderJusticeBtn', 'founderToolsBar', 'founderAccountsBtn'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'inline-flex'; });
  }
  const hr = document.querySelector('header .header-right') || document.querySelector('header');
  if (hr) {
    let ab = document.getElementById('eclipseAccountBtn');
    if (!ab) { ab = document.createElement('button'); ab.id = 'eclipseAccountBtn'; ab.type = 'button'; ab.style.cssText = 'background:#1e1b4b;color:#e9d5ff;border:1px solid #7e22ce;padding:6px 12px;border-radius:16px;font-size:12px;font-weight:800;cursor:pointer;'; ab.onclick = window.openAccountAuthModal; hr.appendChild(ab); }
    ab.textContent = acc ? (isF ? `@${acc.name} · Fundador` : `@${acc.name}`) : 'Crear Cuenta / Entrar';
  }
}, 800);
