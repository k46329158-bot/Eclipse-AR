(function() {
  function hookHistoryMenu() {
    const aside = document.querySelector('aside');
    if (!aside) return;
    let btn = document.getElementById('navEclipseHistory');
    if (!btn) {
      btn = document.createElement('div');
      btn.id = 'navEclipseHistory';
      btn.className = 'nav-item';
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>Historial</span>`;
      aside.appendChild(btn);
    }
    btn.onclick = renderYouTubeStyleHistory;

    if (typeof window.playVideo === 'function' && !window.playVideo._ytHist) {
      const orig = window.playVideo;
      window.playVideo = function(id) {
        orig.apply(this, arguments);
        try {
          if (typeof videos !== 'undefined' && Array.isArray(videos)) {
            const v = videos.find(x => String(x.id) === String(id));
            if (v) {
              let h = JSON.parse(localStorage.getItem('eclipse_history_list') || '[]');
              h = h.filter(it => String(it.id) !== String(v.id));
              h.unshift({ id: v.id, title: v.title, author: v.author, thumb: v.thumb || '', desc: v.desc || '', date: new Date().toLocaleString() });
              localStorage.setItem('eclipse_history_list', JSON.stringify(h.slice(0, 80)));
            }
          }
        } catch (e) {}
      };
      window.playVideo._ytHist = true;
    }
  }

  window.renderYouTubeStyleHistory = function() {
    const grid = document.getElementById('videoGrid') || document.querySelector('main');
    if (!grid) return;

    const q = (document.getElementById('ytHistSearch')?.value || '').toLowerCase();
    const list = JSON.parse(localStorage.getItem('eclipse_history_list') || '[]')
      .filter(it => it.title.toLowerCase().includes(q) || it.author.toLowerCase().includes(q));

    const cards = list.length === 0
      ? `<div style="padding:40px 20px; text-align:center; color:#a1a1aa; font-size:14px;">Tu historial de reproducción está vacío.</div>`
      : list.map((it, idx) => `
          <div style="display:flex; gap:16px; background:#121218; border:1px solid #27272a; border-radius:14px; padding:12px; margin-bottom:12px; align-items:flex-start; cursor:pointer;" onclick="if(typeof playVideo==='function') playVideo('${it.id}')">
            <div style="width:210px; max-width:40%; aspect-ratio:16/9; background:#1e1b2e; border-radius:10px; overflow:hidden; flex-shrink:0; display:flex; align-items:center; justify-content:center; border:1px solid #3b0764;">
              ${it.thumb ? `<img src="${it.thumb}" style="width:100%; height:100%; object-fit:cover;">` : `<svg width="32" height="32" viewBox="0 0 24 24" fill="#9333ea"><polygon points="6 4 20 12 6 20 6 4"/></svg>`}
            </div>
            <div style="flex:1; min-width:0;">
              <div style="font-size:16px; font-weight:700; color:#fff; margin-bottom:4px;">${it.title}</div>
              <div style="font-size:12.5px; color:#c084fc; font-weight:600; margin-bottom:6px;">${it.author} · Visto el ${it.date}</div>
              <div style="font-size:12px; color:#a1a1aa; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${it.desc || 'Video reproducido en Eclipse'}</div>
            </div>
            <button type="button" title="Quitar del historial" onclick="event.stopPropagation(); let h=JSON.parse(localStorage.getItem('eclipse_history_list')||'[]'); h.splice(${idx},1); localStorage.setItem('eclipse_history_list',JSON.stringify(h)); renderYouTubeStyleHistory();" style="background:transparent; border:none; color:#a1a1aa; font-size:16px; cursor:pointer; padding:4px 8px;">✕</button>
          </div>
        `).join('');

    grid.style.display = 'block';
    grid.innerHTML = `
      <div style="max-width:980px; margin:0 auto; padding:10px 4px;">
        <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px; margin-bottom:18px; border-bottom:1px solid #27272a; padding-bottom:14px;">
          <h2 style="margin:0; font-size:21px; color:#fff;">Historial de reproducción</h2>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <input type="text" id="ytHistSearch" value="${q}" oninput="renderYouTubeStyleHistory()" placeholder="Buscar en el historial..." style="background:#18181f; border:1px solid #3f3f46; color:#fff; padding:8px 14px; border-radius:20px; font-size:13px; width:220px;" />
            <button type="button" onclick="if(confirm('¿Borrar todo el historial de reproducción?')){localStorage.removeItem('eclipse_history_list'); renderYouTubeStyleHistory();}" style="background:#27272a; color:#fda4af; border:1px solid #7f1d1d; padding:8px 14px; border-radius:20px; font-size:12px; font-weight:700; cursor:pointer;">Borrar todo el historial</button>
            <button type="button" onclick="location.reload()" style="background:#9333ea; color:#fff; border:none; padding:8px 14px; border-radius:20px; font-size:12px; font-weight:700; cursor:pointer;">Volver al Inicio</button>
          </div>
        </div>
        ${cards}
      </div>
    `;
  };

  window.addEventListener('DOMContentLoaded', hookHistoryMenu);
})();

// === VOLVER AL INICIO AL TOCAR EL LOGO / NOMBRE ECLIPSE AR O "INICIO" ===
(function() {
  window.goHomeEclipse = function() {
    const hv = document.getElementById('eclipseHistoryView');
    if (hv) hv.style.display = 'none';

    const ho = document.getElementById('eclipseHistoryOverlay');
    if (ho) ho.style.display = 'none';

    // Limpiar buscador si había texto y mostrar todos los videos en portada
    const searchInput = document.getElementById('searchInput') || document.querySelector('header input[type="text"]');
    if (searchInput && searchInput.value) {
      searchInput.value = '';
    }
    if (typeof renderVideos === 'function') {
      renderVideos();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function bindBrandHomeClick() {
    const logoEl = document.querySelector('header .logo, header .brand, header a, header h1, header svg');
    const brandContainer = logoEl ? (logoEl.closest('.logo, .brand, a') || logoEl.parentElement) : null;
    if (brandContainer && !brandContainer._homeBound) {
      brandContainer.style.cursor = 'pointer';
      brandContainer.title = 'Volver al inicio de Eclipse';
      brandContainer.addEventListener('click', (e) => {
        e.preventDefault();
        window.goHomeEclipse();
      });
      brandContainer._homeBound = true;
    }

    // También conectar el primer botón del menú lateral ("Inicio")
    const firstNav = document.querySelector('aside .nav-item');
    if (firstNav && !firstNav._homeBound) {
      firstNav.addEventListener('click', () => window.goHomeEclipse());
      firstNav._homeBound = true;
    }
  }

  if (document.body) bindBrandHomeClick();
  else window.addEventListener('DOMContentLoaded', bindBrandHomeClick);
})();
