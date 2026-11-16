(function() {
  const DEFAULT_SHORTS = [
    {
      id: 'sh-1',
      title: '¿Por qué la Luna se vuelve roja en un Eclipse Total?',
      author: 'Biología & Cosmos',
      likes: 1420,
      dislikes: 4,
      color1: '#3b0764',
      color2: '#09090d',
      comments: [
        { user: 'ExploradorLunar', text: 'Explicación impecable en menos de un minuto.', sticker: 'moon' }
      ]
    },
    {
      id: 'sh-2',
      title: 'Creando una animación fotograma a fotograma sin IA',
      author: 'Æiden Company',
      likes: 2890,
      dislikes: 2,
      color1: '#1e1b4b',
      color2: '#0f172a',
      comments: [
        { user: 'ArteHumanoAR', text: 'Así da gusto ver talento real de verdad.', sticker: 'fire' }
      ]
    }
  ];

  function getShorts() {
    const saved = JSON.parse(localStorage.getItem('eclipse_shorts_db') || 'null');
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    localStorage.setItem('eclipse_shorts_db', JSON.stringify(DEFAULT_SHORTS));
    return DEFAULT_SHORTS;
  }

  function saveShorts(list) {
    localStorage.setItem('eclipse_shorts_db', JSON.stringify(list));
  }

  window.currentShortIdx = 0;

  function initShortsNav() {
    const aside = document.querySelector('aside');
    if (!aside || document.getElementById('navEclipseShorts')) return;

    const btn = document.createElement('div');
    btn.id = 'navEclipseShorts';
    btn.className = 'nav-item';
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="2" width="12" height="20" rx="3"/><polygon points="10 9 15 12 10 15 10 9" fill="currentColor"/></svg><span>Shorts</span>`;
    btn.onclick = () => openShortsFeed(0);
    aside.insertBefore(btn, aside.children[1] || aside.firstChild);

    // Conectar goHomeEclipse para que también cierre Shorts al tocar el logo
    if (typeof window.goHomeEclipse === 'function' && !window.goHomeEclipse._shortsHook) {
      const origHome = window.goHomeEclipse;
      window.goHomeEclipse = function() {
        const sv = document.getElementById('eclipseShortsView');
        if (sv) sv.style.display = 'none';
        origHome.apply(this, arguments);
      };
      window.goHomeEclipse._shortsHook = true;
    }
  }

  window.addEventListener('DOMContentLoaded', initShortsNav);
})();

const ECLIPSE_STICKERS = {
  moon: `<svg width="42" height="42" viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" fill="#1e1b4b"/><path d="M32 12C22 12 14 20 14 30C14 40 22 48 32 48C37 48 42 46 45 42C39 43 34 41 30 37C25 31 26 23 32 18C35 16 38 15 41 15C38 13 35 12 32 12Z" fill="#c084fc"><animateTransform attributeName="transform" type="rotate" values="-6 30 30;6 30 30;-6 30 30" dur="1.6s" repeatCount="indefinite"/></path></svg>`,
  fire: `<svg width="42" height="42" viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" fill="#2e1065"/><path d="M30 12C35 20 42 25 42 35C42 42 36 48 30 48C24 48 18 42 18 35C18 28 24 23 26 18C27 22 29 23 30 12Z" fill="#a855f7"><animateTransform attributeName="transform" type="scale" values="1;1.08;1" additive="sum" dur="0.9s" repeatCount="indefinite"/></path></svg>`,
  star: `<svg width="42" height="42" viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" fill="#0f172a"/><polygon points="30,11 35,23 48,23 38,31 42,44 30,36 18,44 22,31 12,23 25,23" fill="#38bdf8"><animateTransform attributeName="transform" type="rotate" from="0 30 30" to="360 30 30" dur="4s" repeatCount="indefinite"/></polygon></svg>`,
  shield: `<svg width="42" height="42" viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" fill="#082f49"/><path d="M30 12L46 19V31C46 41 39 48 30 51C21 48 14 41 14 31V19L30 12Z" fill="#0284c7" stroke="#7dd3fc" stroke-width="2"/><polyline points="23 31 28 36 38 25" fill="none" stroke="#fff" stroke-width="3"/></svg>`
};

window.rateShort = function(idx, kind) {
  const list = JSON.parse(localStorage.getItem('eclipse_shorts_db') || '[]');
  const s = list.at(idx); if (!s) return;
  if (kind === 'like') s.likes = (s.likes || 0) + 1;
  else s.dislikes = (s.dislikes || 0) + 1;
  localStorage.setItem('eclipse_shorts_db', JSON.stringify(list));
  openShortsFeed(idx);
};

window.sendShortComment = function(idx, stickerId) {
  const list = JSON.parse(localStorage.getItem('eclipse_shorts_db') || '[]');
  const s = list.at(idx); if (!s) return;
  const inp = document.getElementById('shortCommentInput');
  const txt = inp ? inp.value.trim() : '';
  if (!txt && !stickerId) return;
  const u = JSON.parse(localStorage.getItem('eclipse_user') || 'null');
  s.comments = s.comments || [];
  s.comments.push({ user: (u && u.name) ? u.name : 'EspectadorLunar', text: txt, sticker: stickerId || '' });
  localStorage.setItem('eclipse_shorts_db', JSON.stringify(list));
  openShortsFeed(idx);
};

window.openUploadShortModal = function() {
  const title = prompt('Título de tu nuevo Eclipse Short:'); if (!title) return;
  const author = prompt('Nombre de tu canal:') || 'CreadorEclipse';
  const url = prompt('Enlace directo .mp4 (o déjalo vacío para Short ilustrado):') || '';
  const list = JSON.parse(localStorage.getItem('eclipse_shorts_db') || '[]');
  list.unshift({ id: 'sh-' + Date.now(), title, author, videoUrl: url, likes: 1, dislikes: 0, color1: '#4c1d95', color2: '#09090d', comments: [] });
  localStorage.setItem('eclipse_shorts_db', JSON.stringify(list));
  openShortsFeed(0);
};

window.openShortsFeed = function(idx) {
  const list = JSON.parse(localStorage.getItem('eclipse_shorts_db') || '[]');
  if (list.length === 0) return;
  window.currentShortIdx = ((idx % list.length) + list.length) % list.length;
  const s = list.at(window.currentShortIdx);

  let view = document.getElementById('eclipseShortsView');
  if (!view) {
    view = document.createElement('div'); view.id = 'eclipseShortsView';
    view.style.cssText = 'position:fixed;top:60px;left:220px;right:0;bottom:0;background:#09090d;z-index:920;display:flex;align-items:center;justify-content:center;padding:16px;color:#fff;overflow-y:auto;';
    if (window.innerWidth < 768) view.style.left = '0';
    document.body.appendChild(view);
  }

  const cHtml = (s.comments || []).map(c => `<div style="background:#18181f;border:1px solid #27272a;border-radius:12px;padding:9px 11px;margin-bottom:8px;"><div style="font-size:11.5px;font-weight:700;color:#c084fc;">@${c.user}</div>${c.text?`<div style="font-size:12.5px;color:#f4f4f5;margin-top:3px;">${c.text}</div>`:''}${c.sticker&&ECLIPSE_STICKERS[c.sticker]?`<div style="margin-top:6px;">${ECLIPSE_STICKERS[c.sticker]}</div>`:''}</div>`).join('');

  view.innerHTML = `<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:20px;max-width:940px;width:100%;">
    <div style="display:flex;align-items:flex-end;gap:12px;">
      <div style="width:300px;height:520px;border-radius:20px;border:2px solid #6b21a8;background:linear-gradient(160deg,${s.color1||'#2e1065'},${s.color2||'#09090d'});display:flex;flex-direction:column;justify-content:space-between;padding:18px;box-shadow:0 20px 50px rgba(0,0,0,0.85);">
        <div style="display:flex;justify-content:space-between;align-items:center;"><span style="background:rgba(147,51,234,0.35);border:1px solid #a855f7;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:800;">Eclipse Shorts</span><button type="button" onclick="openUploadShortModal()" style="background:#9333ea;color:#fff;border:none;padding:5px 11px;border-radius:12px;font-size:11px;font-weight:700;cursor:pointer;">+ Subir Short</button></div>
        ${s.videoUrl?`<video src="${s.videoUrl}" controls autoplay loop playsinline style="width:100%;height:320px;object-fit:cover;border-radius:12px;background:#000;"></video>`:`<div style="text-align:center;"><svg width="64" height="64" viewBox="0 0 100 100"><path d="M53 14C33 14 17 30 17 50C17 70 33 86 53 86C64 86 73 81 80 74C69 76 58 72 51 64C41 52 43 35 55 26C60 21 66 19 73 19C67 16 60 14 53 14Z" fill="#a855f7"/><polygon points="73,30 76,40 87,40 78,47 82,57 73,51 64,57 67,47 58,40 69,40" fill="#fff"/></svg></div>`}
        <div><div style="font-size:13px;font-weight:800;color:#d8b4fe;">@${s.author}</div><div style="font-size:14px;font-weight:700;color:#fff;margin-top:4px;">${s.title}</div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;align-items:center;">
        <button type="button" onclick="rateShort(${window.currentShortIdx},'like')" style="width:46px;height:46px;border-radius:50%;background:#18181f;border:1px solid #3f3f46;color:#c084fc;cursor:pointer;font-size:11px;font-weight:800;">▲<br>${s.likes||0}</button>
        <button type="button" onclick="rateShort(${window.currentShortIdx},'dislike')" style="width:46px;height:46px;border-radius:50%;background:#18181f;border:1px solid #3f3f46;color:#fda4af;cursor:pointer;font-size:11px;font-weight:800;">▼<br>${s.dislikes||0}</button>
        <button type="button" onclick="openShortsFeed(${window.currentShortIdx-1})" style="width:40px;height:40px;border-radius:50%;background:#18181f;border:1px solid #3f3f46;color:#fff;cursor:pointer;font-weight:800;">↑</button>
        <button type="button" onclick="openShortsFeed(${window.currentShortIdx+1})" style="width:40px;height:40px;border-radius:50%;background:#18181f;border:1px solid #3f3f46;color:#fff;cursor:pointer;font-weight:800;">↓</button>
      </div>
    </div>
    <div style="width:340px;max-width:95vw;height:520px;background:#121218;border:1px solid #27272a;border-radius:20px;padding:18px;display:flex;flex-direction:column;justify-content:space-between;">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #27272a;padding-bottom:10px;"><b style="font-size:15px;">Comentarios (${(s.comments||[]).length})</b><button type="button" onclick="document.getElementById('eclipseShortsView').style.display='none'" style="background:#27272a;color:#fff;border:none;padding:5px 11px;border-radius:12px;font-size:11.5px;cursor:pointer;">Cerrar</button></div>
      <div style="flex:1;overflow-y:auto;padding:10px 0;">${cHtml||'<p style="color:#71717a;font-size:12.5px;text-align:center;">Sé el primero en comentar o mandar un sticker.</p>'}</div>
      <div>
        <div style="font-size:11px;color:#a1a1aa;margin-bottom:6px;">Stickers animados:</div>
        <div style="display:flex;gap:8px;margin-bottom:10px;">
          <button type="button" onclick="sendShortComment(${window.currentShortIdx},'moon')" style="background:#18181f;border:1px solid #3f3f46;border-radius:10px;padding:4px;cursor:pointer;">${ECLIPSE_STICKERS.moon}</button>
          <button type="button" onclick="sendShortComment(${window.currentShortIdx},'fire')" style="background:#18181f;border:1px solid #3f3f46;border-radius:10px;padding:4px;cursor:pointer;">${ECLIPSE_STICKERS.fire}</button>
          <button type="button" onclick="sendShortComment(${window.currentShortIdx},'star')" style="background:#18181f;border:1px solid #3f3f46;border-radius:10px;padding:4px;cursor:pointer;">${ECLIPSE_STICKERS.star}</button>
          <button type="button" onclick="sendShortComment(${window.currentShortIdx},'shield')" style="background:#18181f;border:1px solid #3f3f46;border-radius:10px;padding:4px;cursor:pointer;">${ECLIPSE_STICKERS.shield}</button>
        </div>
        <div style="display:flex;gap:6px;"><input id="shortCommentInput" type="text" placeholder="Añade un comentario..." style="flex:1;background:#09090d;border:1px solid #3f3f46;color:#fff;padding:8px 11px;border-radius:12px;font-size:12.5px;" /><button type="button" onclick="sendShortComment(${window.currentShortIdx},'')" style="background:#9333ea;color:#fff;border:none;padding:8px 14px;border-radius:12px;font-size:12px;font-weight:700;cursor:pointer;">Enviar</button></div>
      </div>
    </div>
  </div>`;
  view.style.display = 'flex';
};

// Arranque inmediato garantizado (sin depender de DOMContentLoaded)
(function bootShortsNow() {
  if (!localStorage.getItem('eclipse_shorts_db')) {
    localStorage.setItem('eclipse_shorts_db', JSON.stringify([
      { id: 'sh-1', title: '¿Por qué la Luna se vuelve roja en un Eclipse Total?', author: 'Biología & Cosmos', likes: 1420, dislikes: 4, color1: '#3b0764', color2: '#09090d', comments: [{ user: 'ExploradorLunar', text: 'Explicación impecable en menos de un minuto.', sticker: 'moon' }] },
      { id: 'sh-2', title: 'Creando una animación fotograma a fotograma sin IA', author: 'Æiden Company', likes: 2890, dislikes: 2, color1: '#1e1b4b', color2: '#0f172a', comments: [{ user: 'ArteHumanoAR', text: 'Así da gusto ver talento real de verdad.', sticker: 'fire' }] }
    ]));
  }
  const aside = document.querySelector('aside');
  if (aside && !document.getElementById('navEclipseShorts')) {
    const btn = document.createElement('div');
    btn.id = 'navEclipseShorts';
    btn.className = 'nav-item';
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="2" width="12" height="20" rx="3"/><polygon points="10 9 15 12 10 15 10 9" fill="currentColor"/></svg><span>Shorts</span>`;
    btn.onclick = () => openShortsFeed(0);
    aside.insertBefore(btn, aside.children.item(1) || aside.firstChild);
  }
})();

// === PANTALLA VACÍA CON NAVE ESPACIAL FLOTANDO: "No hay nada... XD" ===
(function() {
  // Limpiar los 2 shorts de ejemplo antiguos si quedaron guardados solos
  try {
    const cur = JSON.parse(localStorage.getItem('eclipse_shorts_db') || '[]');
    if (cur.length === 2 && cur.at(0)?.id === 'sh-1' && cur.at(1)?.id === 'sh-2') {
      localStorage.setItem('eclipse_shorts_db', '[]');
    }
  } catch (e) {}

  const st = document.createElement('style');
  st.textContent = `
    @keyframes floatShip {
      0%, 100% { transform: translateY(0px) rotate(-3deg); }
      50%      { transform: translateY(-12px) rotate(3deg); }
    }
    .eclipse-empty-ship { animation: floatShip 3s ease-in-out infinite; }
  `;
  document.head.appendChild(st);

  const origOpenShorts = window.openShortsFeed;
  window.openShortsFeed = function(idx) {
    const list = JSON.parse(localStorage.getItem('eclipse_shorts_db') || '[]');
    if (list.length > 0) {
      return origOpenShorts.apply(this, arguments);
    }

    let view = document.getElementById('eclipseShortsView');
    if (!view) {
      view = document.createElement('div');
      view.id = 'eclipseShortsView';
      view.style.cssText = 'position:fixed;top:60px;left:220px;right:0;bottom:0;background:#09090d;z-index:920;display:flex;align-items:center;justify-content:center;padding:20px;color:#fff;';
      if (window.innerWidth < 768) view.style.left = '0';
      document.body.appendChild(view);
    }

    view.innerHTML = `
      <div style="text-align:center; max-width:420px; background:#121218; border:1px solid #3b0764; border-radius:24px; padding:34px 26px; box-shadow:0 20px 50px rgba(0,0,0,0.8);">
        <div class="eclipse-empty-ship" style="display:inline-block; margin-bottom:14px;">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <!-- Estrellitas dibujadas -->
            <circle cx="20" cy="28" r="2" fill="#c084fc"/>
            <circle cx="98" cy="24" r="2.5" fill="#38bdf8"/>
            <circle cx="92" cy="88" r="2" fill="#e879f9"/>
            <circle cx="26" cy="92" r="1.8" fill="#ffffff"/>
            <!-- Fuego propulsor -->
            <path d="M52 86 L60 106 L68 86 Z" fill="#a855f7"/>
            <path d="M55 86 L60 99 L65 86 Z" fill="#38bdf8"/>
            <!-- Aletas laterales -->
            <path d="M42 66 L26 82 L44 80 Z" fill="#7e22ce" stroke="#c084fc" stroke-width="2"/>
            <path d="M78 66 L94 82 L76 80 Z" fill="#7e22ce" stroke="#c084fc" stroke-width="2"/>
            <!-- Cuerpo de la nave espacial -->
            <path d="M60 18 C75 34 80 58 76 84 L44 84 C40 58 45 34 60 18 Z" fill="#1e1b4b" stroke="#38bdf8" stroke-width="2.5"/>
            <!-- Ventanilla circular -->
            <circle cx="60" cy="50" r="11" fill="#09090d" stroke="#c084fc" stroke-width="2.5"/>
            <circle cx="57" cy="47" r="3" fill="#7dd3fc" opacity="0.8"/>
          </svg>
        </div>
        <h2 style="margin:0 0 8px; font-size:24px; font-weight:900; color:#ffffff;">No hay nada... XD</h2>
        <p style="margin:0 0 20px; font-size:13.5px; color:#a1a1aa; line-height:1.45;">
          Todavía nadie subió ningún Short a la órbita.<br>¡Sé el primero en estrenar Eclipse Shorts!
        </p>
        <div style="display:flex; gap:10px; justify-content:center;">
          <button type="button" onclick="openUploadShortModal()" style="background:linear-gradient(135deg,#9333ea,#0284c7); color:#fff; border:none; padding:10px 18px; border-radius:16px; font-size:13px; font-weight:800; cursor:pointer;">+ Subir el primer Short</button>
          <button type="button" onclick="document.getElementById('eclipseShortsView').style.display='none'" style="background:#27272a; color:#e4e4e7; border:none; padding:10px 16px; border-radius:16px; font-size:13px; font-weight:700; cursor:pointer;">Volver</button>
        </div>
      </div>
    `;
    view.style.display = 'flex';
  };
})();

// === INTEGRACIÓN DE "MODO SHORT" DENTRO DEL BOTÓN + CREAR ===
(function() {
  window.eclipseCreateMode = 'video';

  window.setEclipseCreateMode = function(mode) {
    window.eclipseCreateMode = mode;
    const bVid = document.getElementById('modeBtnVideo');
    const bSh  = document.getElementById('modeBtnShort');
    const hint = document.getElementById('shortModeHint');
    if (bVid && bSh) {
      bVid.style.background = mode === 'video' ? '#9333ea' : '#18181f';
      bVid.style.color      = mode === 'video' ? '#fff' : '#a1a1aa';
      bSh.style.background  = mode === 'short' ? 'linear-gradient(135deg,#9333ea,#0284c7)' : '#18181f';
      bSh.style.color       = mode === 'short' ? '#fff' : '#a1a1aa';
    }
    if (hint) {
      hint.style.display = mode === 'short' ? 'block' : 'none';
    }
  };

  function injectCreateModeSelector() {
    const form = document.querySelector('#uploadModal form') || document.getElementById('uploadForm') || document.getElementById('inFile')?.closest('form, .modal-box, .modal-card');
    if (!form || document.getElementById('eclipseCreateModeBar')) return;

    const bar = document.createElement('div');
    bar.id = 'eclipseCreateModeBar';
    bar.style.cssText = 'margin-bottom:14px; background:#09090d; border:1px solid #3b0764; border-radius:14px; padding:10px;';
    bar.innerHTML = `
      <div style="font-size:11.5px; color:#c084fc; font-weight:800; margin-bottom:8px;">SELECCIONA EL FORMATO DE PUBLICACIÓN:</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
        <button type="button" id="modeBtnVideo" onclick="setEclipseCreateMode('video')" style="background:#9333ea; color:#fff; border:none; padding:8px 10px; border-radius:10px; font-size:12px; font-weight:800; cursor:pointer;">Video Normal (Horizontal)</button>
        <button type="button" id="modeBtnShort" onclick="setEclipseCreateMode('short')" style="background:#18181f; color:#a1a1aa; border:none; padding:8px 10px; border-radius:10px; font-size:12px; font-weight:800; cursor:pointer;">Eclipse Short (Video Corto)</button>
      </div>
      <div id="shortModeHint" style="display:none; margin-top:8px; font-size:11.5px; color:#7dd3fc;">
        Modo Short activo: Tu video se publicará en formato vertical (9:16) dentro de Eclipse Shorts.
      </div>
    `;
    form.insertBefore(bar, form.firstChild);

    // Interceptar el envío del formulario cuando esté en Modo Short
    form.addEventListener('submit', function(e) {
      if (window.eclipseCreateMode !== 'short') return;
      e.preventDefault();
      e.stopImmediatePropagation();

      const title = (document.getElementById('inTitle')?.value || '').trim();
      const author = (document.getElementById('inAuthor')?.value || '').trim() || 'CreadorEclipse';
      const fileInp = document.getElementById('inFile');
      const file = fileInp && fileInp.files && fileInp.files.item(0);

      if (!title) return alert('Escribe un título para tu Eclipse Short.');

      // Pasar por el filtro Anti-IA si existe
      if (typeof window.scan === 'function') {
        const check = window.scan(title, '', file ? file.name : '');
        if (check && check.ok === false) {
          alert(check.reason || 'Contenido rechazado por el filtro Anti-IA de Eclipse.');
          return;
        }
      }

      const saveAndOpen = (videoUrl) => {
        const list = JSON.parse(localStorage.getItem('eclipse_shorts_db') || '[]');
        list.unshift({
          id: 'sh-' + Date.now(),
          title,
          author,
          videoUrl: videoUrl || '',
          likes: 1,
          dislikes: 0,
          color1: '#4c1d95',
          color2: '#09090d',
          comments: []
        });
        localStorage.setItem('eclipse_shorts_db', JSON.stringify(list));

        // Cerrar modal +Crear y abrir el Short recién publicado
        const upModal = document.getElementById('uploadModal');
        if (upModal) { upModal.classList.add('hidden'); upModal.style.display = 'none'; }
        form.reset();
        setEclipseCreateMode('video');
        if (typeof window.openShortsFeed === 'function') window.openShortsFeed(0);
      };

      if (file) {
        const blobUrl = URL.createObjectURL(file);
        saveAndOpen(blobUrl);
      } else {
        saveAndOpen('');
      }
    }, true);
  }

  // Hacer que el botón "+ Subir el primer Short" abra directamente el modal +Crear en Modo Short
  window.openUploadShortModal = function() {
    const sv = document.getElementById('eclipseShortsView');
    if (sv) sv.style.display = 'none';
    const createBtn = document.querySelector('header button[onclick*="upload"], header button[onclick*="Upload"], header button[onclick*="Create"]');
    if (createBtn) {
      createBtn.click();
    } else {
      const m = document.getElementById('uploadModal');
      if (m) { m.classList.remove('hidden'); m.style.display = 'flex'; }
    }
    setTimeout(() => {
      injectCreateModeSelector();
      setEclipseCreateMode('short');
    }, 60);
  };

  if (document.body) injectCreateModeSelector();
  else window.addEventListener('DOMContentLoaded', injectCreateModeSelector);
})();
