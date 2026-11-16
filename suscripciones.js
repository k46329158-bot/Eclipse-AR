(function() {
  function getSubs() {
    try {
      const s = JSON.parse(localStorage.getItem('eclipse_subs_list') || '[]');
      if (Array.isArray(s) && s.length > 0) return s;
      // Sincronizar si el script principal usaba otra variable
      if (typeof subscribedChannels !== 'undefined' && Array.isArray(subscribedChannels)) return subscribedChannels;
    } catch (e) {}
    return [];
  }

  function saveSubs(arr) {
    localStorage.setItem('eclipse_subs_list', JSON.stringify(arr));
    if (typeof subscribedChannels !== 'undefined') window.subscribedChannels = arr;
  }

  // Función global para volver al inicio cerrando cualquier sección abierta
  window.goHomeEclipse = function() {
    ['eclipseHistoryView', 'eclipseShortsView', 'eclipseSubsView', 'eclipseHistoryOverlay'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    const searchInput = document.getElementById('searchInput') || document.querySelector('header input[type="text"]');
    if (searchInput && searchInput.value) searchInput.value = '';
    if (typeof renderVideos === 'function') renderVideos();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Enganchar suscripciones si el usuario toca "Suscribirse" en cualquier video
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const txt = (btn.textContent || '').trim();
    if (txt === 'Suscribirse' || txt === 'Suscrito ✓') {
      setTimeout(() => {
        const authorEl = document.getElementById('playerAuthor') || document.querySelector('.video-author');
        const ch = authorEl ? authorEl.textContent.replace(/^@/, '').trim() : '';
        if (!ch) return;
        let list = getSubs();
        if (txt === 'Suscribirse' && !list.includes(ch)) list.push(ch);
        else if (txt === 'Suscrito ✓') list = list.filter(x => x !== ch);
        saveSubs(list);
      }, 80);
    }
  });

  window.toggleSubChannel = function(ch) {
    let list = getSubs();
    if (list.includes(ch)) list = list.filter(x => x !== ch);
    else list.push(ch);
    saveSubs(list);
    openSubscriptionsPage();
  };

  window.openSubscriptionsPage = function() {
    // Cerrar otras vistas si estaban abiertas
    ['eclipseHistoryView', 'eclipseShortsView'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    let view = document.getElementById('eclipseSubsView');
    if (!view) {
      view = document.createElement('div');
      view.id = 'eclipseSubsView';
      view.style.cssText = 'position:fixed; top:60px; left:220px; right:0; bottom:0; background:#09090d; z-index:910; overflow-y:auto; padding:26px 32px; color:#fff;';
      if (window.innerWidth < 768) view.style.left = '0';
      document.body.appendChild(view);
    }

    const subs = getSubs();
    const allVids = (typeof videos !== 'undefined' && Array.isArray(videos)) ? videos : [];
    const me = (JSON.parse(localStorage.getItem('eclipse_user') || 'null')?.name || '').toLowerCase();
    const availableCreators = Array.from(new Set(allVids.map(v => v.author).filter(a => a && a.toLowerCase() !== me && a.toLowerCase() !== 'æiden company')));
    const subVids = allVids.filter(v => subs.some(s => s.toLowerCase() === String(v.author || '').toLowerCase()));

    const channelsBar = availableCreators.map(ch => {
      const isSub = subs.includes(ch);
      return `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; background:#121218; border:1px solid ${isSub ? '#9333ea' : '#27272a'}; padding:10px 14px; border-radius:14px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg,#7e22ce,#0284c7); display:flex; align-items:center; justify-content:center; font-weight:900; font-size:14px;">${ch.charAt(0).toUpperCase()}</div>
            <div>
              <div style="font-weight:700; font-size:13.5px; color:#fff;">${ch}</div>
              <div style="font-size:11px; color:${isSub ? '#c084fc' : '#a1a1aa'};">${isSub ? 'Suscrito ✓' : 'Creador disponible'}</div>
            </div>
          </div>
          <button type="button" onclick="toggleSubChannel('${ch.replace(/'/g, "\\'")}')" style="background:${isSub ? '#27272a' : '#9333ea'}; color:#fff; border:none; padding:6px 12px; border-radius:14px; font-size:11.5px; font-weight:700; cursor:pointer;">${isSub ? 'Suscrito ✓' : 'Suscribirse'}</button>
        </div>
      `;
    }).join('');

    const videosHtml = subs.length === 0
      ? `<div style="text-align:center; padding:36px 16px; background:#121218; border:1px solid #27272a; border-radius:18px; margin-top:16px;">
           <h3 style="margin:0 0 6px; font-size:18px;">Aún no tienes suscripciones activas</h3>
           <p style="margin:0; font-size:13px; color:#a1a1aa;">Suscríbete arriba a tus creadores favoritos para ver aquí sus últimos videos sin ruido.</p>
         </div>`
      : (subVids.length === 0
          ? `<div style="text-align:center; padding:32px 16px; background:#121218; border:1px solid #27272a; border-radius:18px; margin-top:16px; color:#a1a1aa; font-size:13.5px;">Tus canales suscritos todavía no publicaron videos nuevos hoy.</div>`
          : `<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:16px; margin-top:16px;">
              ${subVids.map(v => `
                <div onclick="window.goHomeEclipse(); if(typeof playVideo==='function') playVideo('${v.id}');" style="background:#121218; border:1px solid #27272a; border-radius:14px; padding:12px; cursor:pointer;">
                  <div style="height:130px; border-radius:10px; background:linear-gradient(135deg,#2e1065,#09090d); display:flex; align-items:center; justify-content:center; margin-bottom:10px;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#c084fc"><polygon points="6 4 20 12 6 20 6 4"/></svg>
                  </div>
                  <div style="font-weight:700; font-size:14px; color:#fff;">${v.title}</div>
                  <div style="font-size:12px; color:#c084fc; margin-top:3px;">${v.author}</div>
                </div>
              `).join('')}
            </div>`
        );

    view.innerHTML = `
      <div style="max-width:1050px; margin:0 auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h2 style="margin:0; font-size:21px;">Suscripciones (${subs.length})</h2>
          <button type="button" onclick="window.goHomeEclipse()" style="background:#27272a; color:#fff; border:none; padding:7px 14px; border-radius:16px; font-size:12px; font-weight:700; cursor:pointer;">Volver al inicio</button>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:12px; margin-bottom:20px;">
          ${channelsBar}
        </div>
        <h3 style="margin:0 0 8px; font-size:16px; color:#e4e4e7;">Últimos videos de tus suscripciones</h3>
        ${videosHtml}
      </div>
    `;
    view.style.display = 'block';
  };

  function bootSubscriptionsAndBrandHome() {
    const aside = document.querySelector('aside');
    if (aside && !document.getElementById('navEclipseSubs')) {
      const btn = document.createElement('div');
      btn.id = 'navEclipseSubs';
      btn.className = 'nav-item';
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M6 4h12"/><polygon points="10 11 15 13.5 10 16 10 11" fill="currentColor"/></svg><span>Suscripciones</span>`;
      btn.onclick = openSubscriptionsPage;
      aside.insertBefore(btn, aside.children.item(2) || aside.firstChild);
    }

    // Hacer clicable TODO el bloque izquierdo del header (Logo + Título Eclipse AR) para volver al inicio
    const header = document.querySelector('header');
    if (header) {
      const brandZone = header.firstElementChild;
      if (brandZone && !brandZone._eclipseHomeReady) {
        brandZone.style.cursor = 'pointer';
        brandZone.title = 'Volver al inicio de Eclipse';
        brandZone.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          window.goHomeEclipse();
        });
        brandZone._eclipseHomeReady = true;
      }
    }
  }

  if (document.body) bootSubscriptionsAndBrandHome();
  else window.addEventListener('DOMContentLoaded', bootSubscriptionsAndBrandHome);
})();
