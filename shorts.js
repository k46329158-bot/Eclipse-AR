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
