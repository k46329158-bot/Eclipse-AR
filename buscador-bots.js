(function() {
  function normalizeText(str) {
    return String(str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function scoreMatch(item, query) {
    const q = normalizeText(query);
    if (!q) return 0;
    const words = q.split(/\s+/).filter(Boolean);
    const title = normalizeText(item.title);
    const author = normalizeText(item.author);
    const desc = normalizeText(item.desc || '');
    const full = `${title} ${author} ${desc}`;

    let score = 0;
    if (title.includes(q)) score += 100;
    if (author.includes(q)) score += 70;
    if (desc.includes(q)) score += 40;

    for (const w of words) {
      if (w.length < 2) continue;
      if (title.includes(w)) score += 35;
      else if (author.includes(w)) score += 25;
      else if (desc.includes(w)) score += 15;
      else if (w.length >= 4 && full.includes(w.slice(0, w.length - 1))) score += 10;
    }
    return score;
  }

  window.runEclipseBotSearch = function(rawQuery) {
    const query = String(rawQuery || '').trim();
    if (!query) {
      if (typeof window.goHomeEclipse === 'function') window.goHomeEclipse();
      return;
    }

    ['eclipseHistoryView', 'eclipseShortsView', 'eclipseSubsView'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    let view = document.getElementById('eclipseSearchView');
    if (!view) {
      view = document.createElement('div');
      view.id = 'eclipseSearchView';
      view.style.cssText = 'position:fixed; top:60px; left:220px; right:0; bottom:0; background:#09090d; z-index:925; overflow-y:auto; padding:26px 32px; color:#fff;';
      if (window.innerWidth < 768) view.style.left = '0';
      document.body.appendChild(view);
    }

    const allVideos = (typeof videos !== 'undefined' && Array.isArray(videos)) ? videos : [];
    const allShorts = JSON.parse(localStorage.getItem('eclipse_shorts_db') || '[]');

    const vidResults = allVideos
      .map(v => ({ ...v, kind: 'video', _score: scoreMatch(v, query) }))
      .filter(x => x._score > 0);

    const shortResults = allShorts
      .map(s => ({ ...s, kind: 'short', _score: scoreMatch(s, query) }))
      .filter(x => x._score > 0);

    const combined = [...vidResults, ...shortResults].sort((a, b) => b._score - a._score);

    if (combined.length === 0) {
      view.innerHTML = `
        <div style="max-width:560px; margin:30px auto; text-align:center; background:#0c0f1d; border:1px solid #1e3a8a; border-radius:24px; padding:34px 24px; box-shadow:0 20px 50px rgba(0,0,0,0.85);">
          <div style="display:inline-block; margin-bottom:14px;">
            <!-- Galaxia dibujada en unos planos técnicos con signos ? y ¿ por todos lados -->
            <svg width="260" height="175" viewBox="0 0 260 175" fill="none">
              <rect x="6" y="6" width="248" height="163" rx="12" fill="#091326" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="5 3"/>
              <!-- Cuadrícula de plano técnico -->
              <line x1="6" y1="45" x2="254" y2="45" stroke="#1e3a8a" stroke-width="0.8"/>
              <line x1="6" y1="88" x2="254" y2="88" stroke="#1e3a8a" stroke-width="0.8"/>
              <line x1="6" y1="130" x2="254" y2="130" stroke="#1e3a8a" stroke-width="0.8"/>
              <line x1="65" y1="6" x2="65" y2="169" stroke="#1e3a8a" stroke-width="0.8"/>
              <line x1="130" y1="6" x2="130" y2="169" stroke="#1e3a8a" stroke-width="0.8"/>
              <line x1="195" y1="6" x2="195" y2="169" stroke="#1e3a8a" stroke-width="0.8"/>
              <!-- Galaxia espiral en el plano -->
              <ellipse cx="130" cy="88" rx="68" ry="26" transform="rotate(-18 130 88)" stroke="#c084fc" stroke-width="2" stroke-dasharray="4 3"/>
              <ellipse cx="130" cy="88" rx="45" ry="16" transform="rotate(-18 130 88)" stroke="#38bdf8" stroke-width="2"/>
              <circle cx="130" cy="88" r="9" fill="#e879f9"/>
              <circle cx="130" cy="88" r="4" fill="#ffffff"/>
              <!-- Signos ? y ¿ por todos lados -->
              <text x="24" y="36" fill="#38bdf8" font-size="20" font-weight="900">¿</text>
              <text x="218" y="38" fill="#c084fc" font-size="22" font-weight="900">?</text>
              <text x="36" y="148" fill="#c084fc" font-size="22" font-weight="900">?</text>
              <text x="212" y="150" fill="#38bdf8" font-size="20" font-weight="900">¿</text>
              <text x="82" y="32" fill="#7dd3fc" font-size="16" font-weight="900">?</text>
              <text x="172" y="156" fill="#e879f9" font-size="17" font-weight="900">¿</text>
              <text x="18" y="96" fill="#7dd3fc" font-size="18" font-weight="900">?</text>
              <text x="230" y="95" fill="#7dd3fc" font-size="18" font-weight="900">¿</text>
            </svg>
          </div>
          <h2 style="margin:0 0 8px; font-size:21px; font-weight:900; color:#ffffff;">Hmmmm.... parece que no encontramos tu significado</h2>
          <p style="margin:0 0 18px; font-size:15px; font-weight:800; color:#38bdf8;">"¿En qué idioma hablas hermano?"</p>
          <p style="margin:0 0 20px; font-size:12.5px; color:#a1a1aa;">Los Bots Exploradores revisaron toda la galaxia para "${query}" y no hallaron coincidencias.</p>
          <button type="button" onclick="document.getElementById('eclipseSearchView').style.display='none'; if(typeof goHomeEclipse==='function') goHomeEclipse();" style="background:#9333ea; color:#fff; border:none; padding:10px 20px; border-radius:16px; font-size:13px; font-weight:800; cursor:pointer;">Volver al inicio</button>
        </div>
      `;
      view.style.display = 'block';
      return;
    }

    const cardsHtml = combined.map(item => `
      <div onclick="document.getElementById('eclipseSearchView').style.display='none'; if('${item.kind}'==='short'){ if(typeof openShortsFeed==='function') openShortsFeed(0); } else { if(typeof playVideo==='function') playVideo('${item.id}'); }" style="display:flex; gap:16px; background:#121218; border:1px solid #27272a; border-radius:16px; padding:14px; margin-bottom:14px; cursor:pointer; align-items:center;">
        <div style="width:220px; height:124px; border-radius:12px; background:linear-gradient(135deg,#2e1065,#09090d); border:1px solid #4c1d95; display:flex; align-items:center; justify-content:center; flex-shrink:0; position:relative;">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="#c084fc"><polygon points="6 4 20 12 6 20 6 4"/></svg>
          <span style="position:absolute; bottom:8px; right:8px; background:rgba(0,0,0,0.8); color:#d8b4fe; font-size:10px; font-weight:800; padding:2px 7px; border-radius:6px;">${item.kind === 'short' ? 'SHORT' : 'VIDEO'}</span>
        </div>
        <div style="overflow:hidden;">
          <div style="font-size:17px; font-weight:800; color:#fff; margin-bottom:4px;">${item.title}</div>
          <div style="font-size:12.5px; color:#c084fc; font-weight:700; margin-bottom:6px;">${item.author || 'Creador de Eclipse'}</div>
          <div style="font-size:12.5px; color:#a1a1aa; line-height:1.4;">${item.desc || 'Encontrado por los Bots Exploradores de Eclipseᴬᴿ.'}</div>
        </div>
      </div>
    `).join('');

    view.innerHTML = `
      <div style="max-width:960px; margin:0 auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; border-bottom:1px solid #27272a; padding-bottom:12px;">
          <div>
            <div style="font-size:11.5px; color:#38bdf8; font-weight:800;">BOTS EXPLORADORES DE ECLIPSE · ${combined.length} RESULTADO(S)</div>
            <h2 style="margin:2px 0 0; font-size:20px;">Resultados para "${query}"</h2>
          </div>
          <button type="button" onclick="document.getElementById('eclipseSearchView').style.display='none'" style="background:#27272a; color:#fff; border:none; padding:8px 16px; border-radius:16px; font-size:12px; font-weight:700; cursor:pointer;">Cerrar búsqueda</button>
        </div>
        ${cardsHtml}
      </div>
    `;
    view.style.display = 'block';
  };
})();

// Conectar el input del buscador superior + garantizar botones de Fundador visibles
(function() {
  function hookTopSearchAndFounderBtns() {
    const searchInp = document.querySelector('header input[type="text"], header input[type="search"], #searchInput');
    if (searchInp && !searchInp._botsBound) {
      searchInp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.runEclipseBotSearch(searchInp.value);
        }
      });
      const sibBtn = searchInp.parentElement?.querySelector('button');
      if (sibBtn) {
        sibBtn.onclick = (e) => {
          e.preventDefault();
          window.runEclipseBotSearch(searchInp.value);
        };
      }
      searchInp._botsBound = true;
    }

    // Si está activo MODO FUNDADOR, poner los botones directo en la barra morada de Modo Fundador
    if (document.body && document.body.innerText.includes('MODO FUNDADOR')) {
      const founderBanner = Array.from(document.querySelectorAll('div, section')).find(el =>
        el.textContent && el.textContent.includes('MODO FUNDADOR:') && el.offsetHeight < 90
      );
      if (founderBanner && !document.getElementById('founderToolsBar')) {
        const bar = document.createElement('span');
        bar.id = 'founderToolsBar';
        bar.style.cssText = 'display:inline-flex; gap:8px; margin-left:12px; vertical-align:middle;';
        bar.innerHTML = `
          <button type="button" onclick="if(typeof openFounderJusticeModal==='function') openFounderJusticeModal();" style="background:#0284c7; color:#fff; border:none; padding:4px 10px; border-radius:12px; font-size:11px; font-weight:800; cursor:pointer;">Justicia Fundador</button>
          <button type="button" onclick="const f=prompt('Nombre del canal de tu mejor amigo para hacerlo Admin:'); if(f && typeof grantAdminRole==='function') grantAdminRole(f);" style="background:#9333ea; color:#fff; border:none; padding:4px 10px; border-radius:12px; font-size:11px; font-weight:800; cursor:pointer;">+ Nombrar Admin</button>
        `;
        founderBanner.appendChild(bar);
      }
    }
  }

  setInterval(hookTopSearchAndFounderBtns, 1200);
})();

// === DEFINICIÓN DIRECTA DEL PANEL DE JUSTICIA FUNDADOR Y ADMIN ===
window.grantAdminRole = function(username) {
  if (!username) return;
  const list = JSON.parse(localStorage.getItem('eclipse_admins_list') || '[]');
  if (!list.some(x => x.toLowerCase() === username.trim().toLowerCase())) {
    list.push(username.trim());
    localStorage.setItem('eclipse_admins_list', JSON.stringify(list));
  }
  alert('¡' + username.trim() + ' ahora es Admin Oficial de Eclipseᴬᴿ!');
};

window.indultarCanalFundador = function(canal) {
  if (typeof channelStrikes !== 'undefined') {
    delete channelStrikes[canal];
    if (typeof saveProgress === 'function') saveProgress();
  }
  const list = JSON.parse(localStorage.getItem('eclipse_founder_exempt') || '[]');
  if (!list.some(x => x.toLowerCase() === canal.toLowerCase())) {
    list.push(canal);
    localStorage.setItem('eclipse_founder_exempt', JSON.stringify(list));
  }
  window.openFounderJusticeModal();
};

window.revocarInmunidadFundador = function(canal) {
  const list = JSON.parse(localStorage.getItem('eclipse_founder_exempt') || '[]')
    .filter(x => x.toLowerCase() !== canal.toLowerCase());
  localStorage.setItem('eclipse_founder_exempt', JSON.stringify(list));
  window.openFounderJusticeModal();
};

window.openFounderJusticeModal = function() {
  let m = document.getElementById('founderJusticeModal');
  if (!m) {
    m = document.createElement('div');
    m.id = 'founderJusticeModal';
    m.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.88); z-index:2147483647; display:flex; align-items:center; justify-content:center; padding:16px;';
    document.body.appendChild(m);
  }

  const strikesObj = (typeof channelStrikes !== 'undefined') ? channelStrikes : {};
  const exemptList = JSON.parse(localStorage.getItem('eclipse_founder_exempt') || '[]');
  const allChannels = Array.from(new Set([...Object.keys(strikesObj), ...exemptList]));

  const rowsHtml = allChannels.length === 0
    ? '<p style="color:#a1a1aa; font-size:12.5px; text-align:center; padding:16px 0;">Ningún canal tiene faltas ni inmunidades registradas todavía.</p>'
    : allChannels.map(ch => {
        const st = strikesObj[ch] || 0;
        const isExempt = exemptList.some(x => x.toLowerCase() === ch.toLowerCase());
        return `
          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; background:#18181f; border:1px solid ${isExempt ? '#38bdf8' : '#27272a'}; padding:10px 12px; border-radius:12px; margin-bottom:8px;">
            <div>
              <div style="font-weight:700; font-size:13.5px; color:#fff;">${ch}</div>
              <div style="font-size:11px; color:${isExempt ? '#38bdf8' : '#fda4af'};">
                ${isExempt ? 'PROTEGIDO POR EL FUNDADOR (El Bot no puede bloquearlo)' : 'Faltas acumuladas: ' + st}
              </div>
            </div>
            <div>
              ${isExempt
                ? `<button type="button" onclick="revocarInmunidadFundador('${ch.replace(/'/g, "\\'")}')" style="background:#7f1d1d; color:#fecaca; border:none; padding:6px 11px; border-radius:10px; font-size:11px; font-weight:700; cursor:pointer;">Reactivar Bot</button>`
                : `<button type="button" onclick="indultarCanalFundador('${ch.replace(/'/g, "\\'")}')" style="background:#0284c7; color:#fff; border:none; padding:6px 11px; border-radius:10px; font-size:11px; font-weight:700; cursor:pointer;">Quitar Falta e Inmunizar</button>`
              }
            </div>
          </div>
        `;
      }).join('');

  m.innerHTML = `
    <div style="width:470px; max-width:95vw; max-height:85vh; overflow-y:auto; background:#121218; border:1px solid #38bdf8; border-radius:18px; padding:22px; color:#fff; position:relative;">
      <button type="button" onclick="document.getElementById('founderJusticeModal').style.display='none'" style="position:absolute; top:12px; right:12px; background:#27272a; color:#fff; border:none; width:28px; height:28px; border-radius:50%; cursor:pointer;">X</button>
      <h3 style="margin:0 0 4px; font-size:17px;">Panel de Justicia · Solo Fundador</h3>
      <p style="margin:0 0 14px; font-size:12px; color:#a1a1aa;">Si el bot cometió un malentendido, quita la falta y blinda al creador para que el bot no vuelva a bloquearlo sin tu orden.</p>
      <div style="display:flex; gap:6px; margin-bottom:14px;">
        <input id="manualExemptName" type="text" placeholder="Escribir nombre de canal para inmunizar..." style="flex:1; background:#09090d; border:1px solid #3f3f46; color:#fff; padding:8px 10px; border-radius:10px; font-size:12.5px;" />
        <button type="button" onclick="const v=document.getElementById('manualExemptName').value.trim(); if(v) indultarCanalFundador(v);" style="background:#9333ea; color:#fff; border:none; padding:8px 12px; border-radius:10px; font-size:12px; font-weight:700; cursor:pointer;">Inmunizar</button>
      </div>
      ${rowsHtml}
    </div>
  `;
  m.style.display = 'flex';
};
