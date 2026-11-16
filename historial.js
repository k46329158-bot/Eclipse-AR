(function() {
  function hookVideoHistory() {
    if (typeof window.playVideo === 'function' && !window.playVideo._ytHistHook) {
      const origPlay = window.playVideo;
      window.playVideo = function(id) {
        origPlay.apply(this, arguments);
        if (localStorage.getItem('eclipse_hist_paused') === '1') return;
        try {
          if (typeof videos !== 'undefined' && Array.isArray(videos)) {
            const v = videos.find(x => String(x.id) === String(id));
            if (v) {
              let h = JSON.parse(localStorage.getItem('eclipse_history_list') || '[]');
              h = h.filter(item => String(item.id) !== String(v.id));
              h.unshift({
                id: v.id,
                title: v.title,
                author: v.author,
                desc: v.desc || 'Video de Eclipse',
                day: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              });
              localStorage.setItem('eclipse_history_list', JSON.stringify(h.slice(0, 100)));
            }
          }
        } catch (e) {}
      };
      window.playVideo._ytHistHook = true;
    }
  }

  window.showHistoryPage = function(filterText = '') {
    ['eclipseShortsView', 'eclipseSubsView'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    let view = document.getElementById('eclipseHistoryView');
    if (!view) {
      view = document.createElement('div');
      view.id = 'eclipseHistoryView';
      view.style.cssText = 'position:fixed; top:60px; left:220px; right:0; bottom:0; background:#09090d; z-index:915; overflow-y:auto; padding:26px 32px; color:#fff;';
      if (window.innerWidth < 768) view.style.left = '0';
      document.body.appendChild(view);
    }

    const all = JSON.parse(localStorage.getItem('eclipse_history_list') || '[]');
    const q = (filterText || '').toLowerCase();
    const list = all.filter(it => it.title.toLowerCase().includes(q) || it.author.toLowerCase().includes(q));

    const cards = list.length === 0
      ? `<div style="color:#a1a1aa; font-size:14px; padding:40px 0; text-align:center;">${q ? 'No hay videos que coincidan.' : 'Tu historial de reproducciones está vacío.'}</div>`
      : list.map((it, idx) => `
          <div style="display:flex; justify-content:space-between; align-items:center; gap:16px; background:#121218; border:1px solid #27272a; border-radius:14px; padding:12px 16px; margin-bottom:12px; cursor:pointer;" onclick="window.goHomeEclipse(); if(typeof playVideo==='function') playVideo('${it.id}');">
            <div style="display:flex; align-items:center; gap:14px; overflow:hidden;">
              <div style="width:120px; height:68px; border-radius:10px; background:linear-gradient(135deg,#2e1065,#09090d); border:1px solid #4c1d95; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#c084fc"><polygon points="6 4 20 12 6 20 6 4"/></svg>
              </div>
              <div style="overflow:hidden;">
                <div style="font-size:15px; font-weight:700; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${it.title}</div>
                <div style="font-size:12px; color:#c084fc; margin-top:2px;">${it.author} · Visto el ${it.day} a las ${it.time}</div>
              </div>
            </div>
            <button type="button" onclick="event.stopPropagation(); let h=JSON.parse(localStorage.getItem('eclipse_history_list')||'[]'); h.splice(${idx},1); localStorage.setItem('eclipse_history_list',JSON.stringify(h)); showHistoryPage(document.getElementById('ytHistSearch')?.value||'');" style="background:transparent; border:none; color:#a1a1aa; font-size:16px; cursor:pointer; padding:6px 10px;">✕</button>
          </div>
        `).join('');

    view.innerHTML = `
      <div style="max-width:1050px; margin:0 auto; display:grid; grid-template-columns:1fr 280px; gap:24px;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
            <h2 style="margin:0; font-size:21px;">Historial de reproducciones</h2>
            <button type="button" onclick="window.goHomeEclipse()" style="background:#27272a; color:#fff; border:none; padding:7px 14px; border-radius:16px; font-size:12px; font-weight:700; cursor:pointer;">Volver al inicio</button>
          </div>
          ${cards}
        </div>
        <div style="background:#121218; border:1px solid #27272a; border-radius:16px; padding:18px; height:fit-content;">
          <input id="ytHistSearch" type="text" value="${filterText}" oninput="showHistoryPage(this.value)" placeholder="Buscar en el historial..." style="width:100%; background:#09090d; border:1px solid #3f3f46; color:#fff; padding:9px 12px; border-radius:10px; font-size:13px; margin-bottom:14px;" />
          <button type="button" onclick="if(confirm('¿Borrar todo el historial?')){localStorage.removeItem('eclipse_history_list'); showHistoryPage();}" style="width:100%; text-align:left; background:#18181f; border:1px solid #27272a; color:#fca5a5; padding:10px 12px; border-radius:10px; font-size:12.5px; font-weight:700; cursor:pointer; margin-bottom:10px;">Borrar todo el historial</button>
          <button type="button" onclick="const p=localStorage.getItem('eclipse_hist_paused')==='1'; localStorage.setItem('eclipse_hist_paused', p?'0':'1'); showHistoryPage();" style="width:100%; text-align:left; background:#18181f; border:1px solid #27272a; color:#e4e4e7; padding:10px 12px; border-radius:10px; font-size:12.5px; font-weight:700; cursor:pointer;">${localStorage.getItem('eclipse_hist_paused')==='1' ? 'Reanudar el historial' : 'Pausar el historial'}</button>
        </div>
      </div>
    `;
    view.style.display = 'block';
    const inp = document.getElementById('ytHistSearch');
    if (inp && filterText) { inp.focus(); inp.setSelectionRange(filterText.length, filterText.length); }
  };

  function bootHistoryAndLogo() {
    hookVideoHistory();

    // 1. Conectar el botón "Historial" del menú lateral izquierdo
    const aside = document.querySelector('aside');
    if (aside) {
      let btn = document.getElementById('navEclipseHistory');
      if (!btn) {
        btn = document.createElement('div');
        btn.id = 'navEclipseHistory';
        btn.className = 'nav-item';
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>Historial</span>`;
        aside.insertBefore(btn, aside.children.item(3) || aside.firstChild);
      }
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.showHistoryPage('');
      };
    }

    // 2. Forzar que tocar el Logo o Título "Eclipse AR" arriba a la izquierda te lleve SOLO AL INICIO
    const header = document.querySelector('header');
    if (header) {
      const logoZone = header.querySelector('.logo, .brand') || header.firstElementChild;
      if (logoZone) {
        const cleanLogo = logoZone.cloneNode(true);
        logoZone.parentNode.replaceChild(cleanLogo, logoZone);
        cleanLogo.style.cursor = 'pointer';
        cleanLogo.title = 'Volver al inicio de Eclipse';
        cleanLogo.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (typeof window.goHomeEclipse === 'function') window.goHomeEclipse();
        });
      }
    }
  }

  if (document.body) bootHistoryAndLogo();
  else window.addEventListener('DOMContentLoaded', bootHistoryAndLogo);
})();
