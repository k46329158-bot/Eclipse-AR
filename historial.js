(function() {
  function initEclipseHistory() {
    const aside = document.querySelector('aside');
    if (!aside || document.getElementById('navEclipseHistory')) return;

    const btn = document.createElement('div');
    btn.id = 'navEclipseHistory';
    btn.className = 'nav-item';
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>Historial</span>`;
    btn.onclick = openHistoryPanel;
    aside.appendChild(btn);

    if (typeof window.playVideo === 'function' && !window.playVideo._histReady) {
      const origPlay = window.playVideo;
      window.playVideo = function(id) {
        origPlay.apply(this, arguments);
        try {
          if (typeof videos !== 'undefined' && Array.isArray(videos)) {
            const v = videos.find(x => String(x.id) === String(id));
            if (v) {
              let h = JSON.parse(localStorage.getItem('eclipse_history_list') || '[]');
              h = h.filter(item => String(item.id) !== String(v.id));
              h.unshift({ id: v.id, title: v.title, author: v.author, date: new Date().toLocaleString() });
              localStorage.setItem('eclipse_history_list', JSON.stringify(h.slice(0, 60)));
            }
          }
        } catch (e) {}
      };
      window.playVideo._histReady = true;
    }
  }

  function openHistoryPanel() {
    let modal = document.getElementById('eclipseHistoryOverlay');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'eclipseHistoryOverlay';
      modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:2147483647; display:flex; align-items:center; justify-content:center; padding:16px;';
      document.body.appendChild(modal);
    }
    const list = JSON.parse(localStorage.getItem('eclipse_history_list') || '[]');
    const itemsHtml = list.length === 0
      ? '<p style="color:#a1a1aa; font-size:13px; text-align:center; padding:24px 0;">Todavía no reprodujiste ningún video en tu historial.</p>'
      : list.map((it, idx) => `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;background:#18181f;border:1px solid #27272a;padding:10px 12px;border-radius:12px;margin-bottom:8px;"><div><div style="font-weight:700;font-size:13.5px;color:#fff;">${it.title}</div><div style="font-size:11px;color:#a1a1aa;">${it.author} · ${it.date}</div></div><div style="display:flex;gap:6px;"><button type="button" onclick="document.getElementById('eclipseHistoryOverlay').style.display='none';if(typeof playVideo==='function')playVideo('${it.id}');" style="background:#9333ea;color:#fff;border:none;padding:6px 12px;border-radius:14px;font-size:11.5px;font-weight:700;cursor:pointer;">Ver</button><button type="button" onclick="let h=JSON.parse(localStorage.getItem('eclipse_history_list')||'[]');h.splice(${idx},1);localStorage.setItem('eclipse_history_list',JSON.stringify(h));document.getElementById('navEclipseHistory').click();" style="background:#27272a;color:#fda4af;border:none;padding:6px 9px;border-radius:14px;font-size:11px;cursor:pointer;">X</button></div></div>`).join('');

    modal.innerHTML = `<div style="width:460px;max-width:95vw;max-height:85vh;overflow-y:auto;background:#121218;border:1px solid #6b21a8;border-radius:18px;padding:22px;color:#fff;position:relative;"><button type="button" onclick="document.getElementById('eclipseHistoryOverlay').style.display='none'" style="position:absolute;top:12px;right:12px;background:#27272a;color:#fff;border:none;width:28px;height:28px;border-radius:50%;cursor:pointer;">X</button><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;padding-right:34px;"><h3 style="margin:0;font-size:17px;">Historial de Reproducción</h3>${list.length>0?`<button type="button" onclick="localStorage.removeItem('eclipse_history_list');document.getElementById('navEclipseHistory').click();" style="background:#7f1d1d;color:#fecaca;border:none;padding:5px 10px;border-radius:10px;font-size:11px;font-weight:700;cursor:pointer;">Borrar historial</button>`:''}</div>${itemsHtml}</div>`;
    modal.style.display = 'flex';
  }
  window.addEventListener('DOMContentLoaded', initEclipseHistory);
})();
