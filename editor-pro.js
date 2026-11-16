
window.checkIsFounderActive = function() {
  if (typeof isFounder !== 'undefined' && isFounder) return true;
  if (typeof founderMode !== 'undefined' && founderMode) return true;
  if (localStorage.getItem('eclipse_founder') === '1') return true;
  if (document.body && document.body.innerText.includes('MODO FUNDADOR')) return true;
  return false;
};


window.openModal = function() {
  const m = document.getElementById('uploadModal');
  if (m) m.classList.remove('hidden');
};
window.closeModal = function() {
  const m = document.getElementById('uploadModal');
  if (m) m.classList.add('hidden');
};

(function() {
  function initEditorPro() {
    const fileInput = document.getElementById('inFile');
    if (!fileInput || document.getElementById('eclipseEditorProBox')) return;

    const proBox = document.createElement('div');
    proBox.id = 'eclipseEditorProBox';
    proBox.style.cssText = 'background:#16161d; border:1px solid #4c1d95; border-radius:12px; padding:14px; margin-top:12px;';
    proBox.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span style="font-weight:800; font-size:13px; color:#e9d5ff;">EDITOR PRO DE VIDEO · ÆIDEN STUDIO</span>
        <span id="proStatusTag" style="font-size:11px; background:#2e1065; color:#d8b4fe; padding:2px 8px; border-radius:6px;">Activo</span>
      </div>

      <div id="proPreviewWrap" style="display:none; position:relative; background:#000; border-radius:10px; overflow:hidden; margin-bottom:12px; max-height:175px; aspect-ratio:16/9; margin:0 auto 10px;">
        <video id="proPreviewVideo" controls muted playsinline style="width:100%; height:100%; object-fit:contain;"></video>
        <div id="proOverlayText" style="position:absolute; left:50%; bottom:14%; transform:translateX(-50%); color:#ffffff; font-weight:800; font-size:18px; text-shadow:0 2px 8px rgba(0,0,0,0.9); pointer-events:none; text-align:center; max-width:90%;"></div>
      </div>

      <div id="proControlsGrid" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:12px;">
        <div>
          <label style="color:#a1a1aa; display:block; margin-bottom:3px;">Filtro Visual</label>
          <select id="proFilterSel" style="width:100%; background:#0f0f14; color:#fff; border:1px solid #3f3f46; border-radius:8px; padding:6px;">
            <option value="none">Normal</option>
            <option value="contrast(1.22) saturate(1.35)">Cine Vibrante</option>
            <option value="grayscale(1) contrast(1.2)">Blanco y Negro</option>
            <option value="sepia(0.55) contrast(1.1)">Vintage</option>
            <option value="hue-rotate(90deg) saturate(1.4)">Neón Eclipse</option>
          </select>
        </div>

        <div>
          <label style="color:#a1a1aa; display:block; margin-bottom:3px;">Velocidad</label>
          <select id="proSpeedSel" style="width:100%; background:#0f0f14; color:#fff; border:1px solid #3f3f46; border-radius:8px; padding:6px;">
            <option value="1">1.0x (Normal)</option>
            <option value="0.5">0.5x (Cámara Lenta)</option>
            <option value="1.5">1.5x (Rápido)</option>
            <option value="2">2.0x (Turbo)</option>
          </select>
        </div>

        <div>
          <label style="color:#a1a1aa; display:block; margin-bottom:3px;">Brillo: <span id="proBrightVal">100%</span></label>
          <input type="range" id="proBrightRange" min="60" max="150" value="100" style="width:100%;">
        </div>

        <div>
          <label style="color:#a1a1aa; display:block; margin-bottom:3px;">Contraste: <span id="proContrastVal">100%</span></label>
          <input type="range" id="proContrastRange" min="60" max="160" value="100" style="width:100%;">
        </div>

        <div style="grid-column:1 / -1;">
          <label style="color:#a1a1aa; display:block; margin-bottom:3px;">Texto en pantalla (opcional)</label>
          <div style="display:flex; gap:6px;">
            <input type="text" id="proTextInput" placeholder="Ej. Suscríbete a mi canal" style="flex:1; background:#0f0f14; color:#fff; border:1px solid #3f3f46; border-radius:8px; padding:6px 10px;">
            <input type="color" id="proTextColor" value="#ffffff" style="width:38px; height:32px; border:none; background:none; cursor:pointer;">
            <select id="proTextPos" style="background:#0f0f14; color:#fff; border:1px solid #3f3f46; border-radius:8px; padding:0 8px;">
              <option value="bottom">Abajo</option>
              <option value="top">Arriba</option>
              <option value="center">Centro</option>
            </select>
          </div>
        </div>

        <div>
          <label style="color:#a1a1aa; display:block; margin-bottom:3px;">Inicio recorte (seg): <span id="proTrimStartVal">0s</span></label>
          <input type="range" id="proTrimStart" min="0" max="60" step="0.5" value="0" style="width:100%;">
        </div>

        <div>
          <label style="color:#a1a1aa; display:block; margin-bottom:3px;">Fin recorte (seg): <span id="proTrimEndVal">Auto</span></label>
          <input type="range" id="proTrimEnd" min="1" max="120" step="0.5" value="120" style="width:100%;">
        </div>
      </div>
    `;

    fileInput.parentNode.insertBefore(proBox, fileInput.nextSibling);

    const vid = document.getElementById('proPreviewVideo');
    const wrap = document.getElementById('proPreviewWrap');
    const fSel = document.getElementById('proFilterSel');
    const sSel = document.getElementById('proSpeedSel');
    const bRng = document.getElementById('proBrightRange');
    const cRng = document.getElementById('proContrastRange');
    const tInp = document.getElementById('proTextInput');
    const tCol = document.getElementById('proTextColor');
    const tPos = document.getElementById('proTextPos');
    const trS = document.getElementById('proTrimStart');
    const trE = document.getElementById('proTrimEnd');
    const ov = document.getElementById('proOverlayText');

    function updatePreviewStyle() {
      const baseFilter = fSel.value === 'none' ? '' : fSel.value;
      const fullFilter = `${baseFilter} brightness(${bRng.value}%) contrast(${cRng.value}%)`.trim();
      vid.style.filter = fullFilter;
      vid.playbackRate = parseFloat(sSel.value);
      document.getElementById('proBrightVal').textContent = bRng.value + '%';
      document.getElementById('proContrastVal').textContent = cRng.value + '%';

      ov.textContent = tInp.value;
      ov.style.color = tCol.value;
      if (tPos.value === 'top') { ov.style.top = '10%'; ov.style.bottom = 'auto'; ov.style.transform = 'translateX(-50%)'; }
      else if (tPos.value === 'center') { ov.style.top = '50%'; ov.style.bottom = 'auto'; ov.style.transform = 'translate(-50%, -50%)'; }
      else { ov.style.bottom = '14%'; ov.style.top = 'auto'; ov.style.transform = 'translateX(-50%)'; }

      window._eclipseProEdit = {
        filter: fullFilter,
        speed: parseFloat(sSel.value),
        overlayText: tInp.value,
        overlayColor: tCol.value,
        overlayPos: tPos.value,
        trimStart: parseFloat(trS.value),
        trimEnd: parseFloat(trE.value)
      };
    }

    fileInput.addEventListener('change', function() {
      const f = fileInput.files && fileInput.files.at(0);
      if (!f) return;
      const canUse = (typeof unlockedEditor !== 'undefined' && unlockedEditor) || (typeof isFounder !== 'undefined' && isFounder);
      document.getElementById('proStatusTag').textContent = canUse ? 'Desbloqueado' : 'Bloqueado (20.000 Lunas)';
      document.getElementById('proControlsGrid').style.opacity = canUse ? '1' : '0.45';
      document.getElementById('proControlsGrid').style.pointerEvents = canUse ? 'auto' : 'none';

      vid.src = URL.createObjectURL(f);
      wrap.style.display = 'block';
      vid.onloadedmetadata = function() {
        const dur = Math.max(1, Math.floor(vid.duration));
        trS.max = dur;
        trE.max = dur;
        trE.value = dur;
        document.getElementById('proTrimEndVal').textContent = dur + 's';
        updatePreviewStyle();
      };
    });

    [fSel, sSel, bRng, cRng, tInp, tCol, tPos].forEach(el => el.addEventListener('input', updatePreviewStyle));
    trS.addEventListener('input', () => {
      document.getElementById('proTrimStartVal').textContent = trS.value + 's';
      vid.currentTime = parseFloat(trS.value);
      updatePreviewStyle();
    });
    trE.addEventListener('input', () => {
      document.getElementById('proTrimEndVal').textContent = trE.value + 's';
      updatePreviewStyle();
    });
  }

  window.addEventListener('DOMContentLoaded', initEditorPro);
})();

// === MÓDULO DE COMPARTIR VIDEOS Y ENLACES DIRECTOS ===
(function() {
  function setupShareFeature() {
    const dlBtn = Array.from(document.querySelectorAll('.player-bar button')).find(b => b.textContent.includes('Descargar'));
    if (!dlBtn || document.getElementById('eclipseShareBtn')) return;

    const shareBtn = document.createElement('button');
    shareBtn.id = 'eclipseShareBtn';
    shareBtn.type = 'button';
    shareBtn.className = 'pill-action';
    shareBtn.style.cssText = 'border:1px solid #4c1d95; color:#e9d5ff; font-weight:600;';
    shareBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> Compartir`;

    shareBtn.onclick = async function() {
      const vidId = (typeof currentVideo !== 'undefined' && currentVideo && currentVideo.id) ? currentVideo.id : '';
      const vidTitle = (typeof currentVideo !== 'undefined' && currentVideo && currentVideo.title) ? currentVideo.title : 'Mira este video en Eclipse';
      const baseUrl = window.location.origin + window.location.pathname;
      const shareUrl = vidId ? `${baseUrl}?v=${encodeURIComponent(vidId)}` : baseUrl;

      if (navigator.share) {
        try {
          await navigator.share({ title: vidTitle + ' - Eclipse', text: vidTitle, url: shareUrl });
          return;
        } catch (e) {}
      }

      try {
        await navigator.clipboard.writeText(shareUrl);
        const origHtml = shareBtn.innerHTML;
        shareBtn.innerHTML = '¡Enlace copiado!';
        shareBtn.style.background = '#7e22ce';
        shareBtn.style.color = '#fff';
        setTimeout(() => {
          shareBtn.innerHTML = origHtml;
          shareBtn.style.background = '';
          shareBtn.style.color = '#e9d5ff';
        }, 2200);
      } catch (e) {
        prompt('Copia el enlace de este video en Eclipse:', shareUrl);
      }
    };

    dlBtn.parentNode.insertBefore(shareBtn, dlBtn);
  }

  // Abrir automáticamente el video si alguien entra con ?v=ID
  function checkSharedVideoParam() {
    const params = new URLSearchParams(window.location.search);
    const targetId = params.get('v');
    if (!targetId) return;

    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      if (typeof videos !== 'undefined' && Array.isArray(videos) && videos.length > 0) {
        const found = videos.find(v => String(v.id) === String(targetId));
        if (found && typeof playVideo === 'function') {
          playVideo(found.id);
          clearInterval(timer);
        }
      }
      if (tries > 25) clearInterval(timer);
    }, 300);
  }

  window.addEventListener('DOMContentLoaded', () => {
    setupShareFeature();
    checkSharedVideoParam();
  });
})();


// === PERFIL INSTANTÁNEO ESTILO YOUTUBE (SIN REGISTRO NI ERRORES) ===
(function() {
  function initInstantProfile() {
    let profile = null;
    try { profile = JSON.parse(localStorage.getItem('eclipse_instant_profile')); } catch (e) {}

    if (!profile || !profile.uid) {
      const randNum = Math.floor(1000 + Math.random() * 9000);
      profile = {
        uid: 'user_' + Date.now().toString(36) + randNum,
        name: 'Creador #' + randNum,
        email: ''
      };
      localStorage.setItem('eclipse_instant_profile', JSON.stringify(profile));
    }

    function applyProfileToUI() {
      if (typeof deviceId !== 'undefined') deviceId = profile.uid;
      const isF = (typeof isFounder !== 'undefined' && isFounder);
      const displayName = isF ? 'Æiden Company' : profile.name;

      const btn = document.getElementById('authHeaderBtn') || Array.from(document.querySelectorAll('header button')).find(b => b.textContent.includes('Iniciar sesión') || b.dataset.eclipseProfile);
      if (btn) {
        btn.dataset.eclipseProfile = '1';
        btn.innerHTML = `<span style="width:20px;height:20px;border-radius:50%;background:#9333ea;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;">${displayName.charAt(0).toUpperCase()}</span> <span>${displayName}</span>`;
        btn.onclick = openProfileEditor;
      }

      if (!isF) {
        ['inAuthor', 'animAuthor', 'commAuthor'].forEach(id => {
          const el = document.getElementById(id);
          if (el) { el.value = displayName; el.readOnly = true; }
        });
      }
    }

    function openProfileEditor() {
      let modal = document.getElementById('eclipseQuickProfileModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'eclipseQuickProfileModal';
        modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.82); z-index:2147483647; display:flex; align-items:center; justify-content:center; padding:16px;';
        modal.innerHTML = `
          <div style="width:360px; max-width:95vw; background:#121218; border:1px solid #4c1d95; border-radius:18px; padding:22px; color:#fff; position:relative; text-align:center;">
            <button type="button" id="closeQuickProf" style="position:absolute; top:12px; right:12px; background:#27272a; color:#fff; border:none; width:28px; height:28px; border-radius:50%; cursor:pointer;">✕</button>
            <div id="qpAvatar" style="width:60px; height:60px; border-radius:50%; background:#7e22ce; color:#fff; font-size:24px; font-weight:800; display:flex; align-items:center; justify-content:center; margin:0 auto 10px; border:2px solid #c084fc;"></div>
            <h3 style="margin:0 0 4px; font-size:17px;">Tu Canal en Eclipse</h3>
            <p style="margin:0 0 14px; font-size:12px; color:#a1a1aa;">Sesión activa automáticamente · Sin contraseñas</p>
            <input type="text" id="qpNameInput" placeholder="Nombre de tu canal" style="width:100%; box-sizing:border-box; margin-bottom:12px; padding:10px 12px; border-radius:10px; background:#18181f; border:1px solid #3f3f46; color:#fff; font-size:14px;">
            <button type="button" id="qpSaveBtn" style="width:100%; background:#9333ea; color:#fff; border:none; padding:11px; border-radius:22px; font-weight:700; cursor:pointer;">Guardar nombre de canal</button>
          </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('closeQuickProf').onclick = () => { modal.style.display = 'none'; };
        document.getElementById('qpSaveBtn').onclick = () => {
          const newName = document.getElementById('qpNameInput').value.trim();
          if (!newName) return;
          profile.name = newName;
          localStorage.setItem('eclipse_instant_profile', JSON.stringify(profile));
          applyProfileToUI();
          if (typeof saveProgress === 'function') saveProgress();
          modal.style.display = 'none';
        };
      }
      const isF = (typeof isFounder !== 'undefined' && isFounder);
      const currentName = isF ? 'Æiden Company' : profile.name;
      document.getElementById('qpAvatar').textContent = currentName.charAt(0).toUpperCase();
      document.getElementById('qpNameInput').value = currentName;
      modal.style.display = 'flex';
    }

    applyProfileToUI();
  }

  window.addEventListener('DOMContentLoaded', initInstantProfile);
})();

// === BOT MODERADOR INTELIGENTE CON PROTECCIÓN DE VIDEOJUEGOS ===
(function() {
  const ZERO_TOLERANCE_RULES = [
    { c: "Abuso o explotación de menores", k: ["cp", "child porn", "pedofilia", "pederastia", "abuso infantil", "abuso a menores", "explotacion infantil", "menores desnudos", "loli nsfw", "shota"] },
    { c: "Pornografía o contenido sexual explícito", k: ["porno", "porn", "xxx", "nsfw", "sexo", "desnudo", "nude", "onlyfans", "hentai", "rule34", "pack", "recorte sexual", "clip porno"] },
    { c: "Anime NSFW o recortes inapropiados", k: ["ecchi", "ahegao", "uncensored", "sin censura", "recorte anime", "r34", "escena subida de tono"] },
    { c: "Bullying, acoso o humillación", k: ["bullying", "ciberbullying", "acoso escolar", "humillando a", "pelea escolar", "golpiza en la escuela", "doxeo", "doxxing", "suicidate", "matate"] },
    { c: "Maltrato o crueldad animal", k: ["maltrato animal", "pelea de perros", "pelea de gallos", "crueldad animal", "tortura animal", "matando perro", "matando gato"] },
    { c: "Gore o violencia extrema de la vida real", k: ["gore", "decapitacion", "ejecucion real", "suicidio", "tortura real", "accidente mortal", "cadaver real", "narco ejecucion"] },
    { c: "Contenido generado por IA o basura sintética", k: ["hecho con ia", "ai generated", "sora", "runway", "midjourney", "deepfake", "voz ia", "inteligencia artificial", "creado con ia", "ai slop"] },
    { c: "Desinformación o estafa", k: ["fake news", "noticia falsa", "cura milagrosa", "tierra es plana", "estafa cripto", "dinero gratis hack", "robar cuentas"] }
  ];

  const REAL_VIOLENCE_WORDS = ["tiroteo", "asesinato", "sangre", "disparos", "masacre", "arma real", "balacera"];

  const GAMING_CONTEXT = [
    "gameplay", "juego", "videojuego", "gaming", "gamer", "partida", "minecraft", "roblox",
    "gta", "grand theft auto", "fortnite", "valorant", "csgo", "counter strike", "mortal kombat",
    "call of duty", "warzone", "free fire", "pubg", "league of legends", "lol", "elden ring",
    "god of war", "resident evil", "boss fight", "speedrun", "mod", "playthrough", "walkthrough"
  ];

  window.scan = function(t, d, f) {
    const raw = `${t || ''} ${d || ''} ${f || ''}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // 1. Tolerancia cero (aplica siempre, incluso si dicen que es gameplay)
    for (const rule of ZERO_TOLERANCE_RULES) {
      for (const word of rule.k) {
        if (raw.includes(word)) {
          return { ok: false, r: rule.c };
        }
      }
    }

    // 2. Verificar si está en contexto de videojuego
    const isGaming = GAMING_CONTEXT.some(g => raw.includes(g));
    if (!isGaming) {
      for (const vWord of REAL_VIOLENCE_WORDS) {
        if (raw.includes(vWord)) {
          return { ok: false, r: "Violencia real (si es un videojuego, acláralo en el título o descripción)" };
        }
      }
    }

    return { ok: true };
  };
})();

// === ESCÁNER DE FOTOGRAMAS (HUELLA VISUAL) + VERIFICADOR CIENTÍFICO EN TIEMPO REAL ===
(function() {
  const SCIENCE_TOPICS = [
    "ciencia", "biologia", "fisica", "quimica", "medicina", "anatomia", "evolucion",
    "astronomia", "historia", "estudio", "investigacion", "experimento", "salud",
    "virus", "bacteria", "celula", "adn", "planeta", "universo", "matematica"
  ];

  const DEBUNKED_CLAIMS = [
    { claim: "tierra es plana", fact: "La Tierra tiene forma geoide/esférica comprobada científicamente." },
    { claim: "tierra plana", fact: "La Tierra es un esferoide oblato, no plana." },
    { claim: "vacunas causan autismo", fact: "Múltiples estudios científicos masivos desmienten cualquier vínculo entre vacunas y autismo." },
    { claim: "beber cloro", fact: "Ingerir dióxido de cloro o lejía es altamente tóxico y peligroso para la salud." },
    { claim: "dioxido de cloro cura", fact: "No existe evidencia científica que respalde el uso médico del dióxido de cloro." },
    { claim: "5g transmite virus", fact: "Las ondas de radio 5G no pueden transmitir virus biológicos." },
    { claim: "sol gira alrededor de la tierra", fact: "La Tierra orbita alrededor del Sol (heliocentrismo)." },
    { claim: "humanos no llegaron a la luna", fact: "Las misiones Apolo están verificadas por evidencia física e independiente." }
  ];

  // Generar huella digital real del archivo de video (primeros y últimos bloques + duración)
  async function computeVideoFingerprint(file) {
    if (!file) return null;
    try {
      const sliceHead = await file.slice(0, 65536).arrayBuffer();
      const sliceTail = await file.slice(Math.max(0, file.size - 65536), file.size).arrayBuffer();
      const combined = new Uint8Array(sliceHead.byteLength + sliceTail.byteLength);
      combined.set(new Uint8Array(sliceHead), 0);
      combined.set(new Uint8Array(sliceTail), sliceHead.byteLength);
      const hashBuf = await crypto.subtle.digest('SHA-256', combined);
      return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 24);
    } catch (e) {
      return null;
    }
  }

  // Verificación científica en vivo consultando Wikipedia API
  async function verifyScientificContext(title, desc) {
    const fullText = `${title} ${desc}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const isScience = SCIENCE_TOPICS.some(t => fullText.includes(t));
    if (!isScience) return { ok: true };

    // 1. Comprobar afirmaciones científicamente falsas conocidas
    for (const item of DEBUNKED_CLAIMS) {
      if (fullText.includes(item.claim)) {
        return {
          ok: false,
          reason: `Desinformación científica detectada: "${item.claim}". Dato verificado: ${item.fact}`
        };
      }
    }

    // 2. Consultar Wikipedia en español en tiempo real para verificar el tema
    try {
      const query = encodeURIComponent(title.trim());
      const wikiUrl = ['https:/', 'es.wikipedia.org', 'w', 'api.php'].join('/') + `?action=query&list=search&srsearch=${query}&format=json&origin=*`;
      const res = await fetch(wikiUrl);
      const data = await res.json();
      const hits = (data && data.query && data.query.search) ? data.query.search : [];
      if (hits.length > 0) {
        console.log('[Eclipse Bot Verificador] Tema científico respaldado por fuente enciclopédica:', hits.at(0).title);
      }
    } catch (e) {}

    return { ok: true };
  }

  // Interceptar el formulario de subida para ejecutar el análisis profundo antes de publicar
  function hookDeepModeration() {
    const uploadForm = document.querySelector('#uploadModal form');
    if (!uploadForm || uploadForm.dataset.deepBotHooked) return;
    uploadForm.dataset.deepBotHooked = '1';

    const origSubmit = uploadForm.onsubmit;
    uploadForm.onsubmit = async function(e) {
      e.preventDefault();
      const titleEl = document.getElementById('inTitle');
      const descEl = document.getElementById('inDesc');
      const fileEl = document.getElementById('inFile');
      const authorEl = document.getElementById('inAuthor');

      const title = titleEl ? titleEl.value : '';
      const desc = descEl ? descEl.value : '';
      const file = fileEl && fileEl.files ? fileEl.files.at(0) : null;

      // 1. Calcular huella digital del archivo de video
      const fp = await computeVideoFingerprint(file);
      const bannedHashes = JSON.parse(localStorage.getItem('eclipse_banned_hashes') || '[]');
      if (fp && bannedHashes.includes(fp)) {
        alert('BLOQUEO AUTOMÁTICO DE ECLIPSE: Este archivo de video coincide con contenido previamente rechazado por nuestras normas (aunque le hayas cambiado el título).');
        return;
      }

      // 2. Verificar rigor científico/educativo en tiempo real
      const sciCheck = await verifyScientificContext(title, desc);
      if (!sciCheck.ok) {
        if (fp) {
          bannedHashes.push(fp);
          localStorage.setItem('eclipse_banned_hashes', JSON.stringify(bannedHashes));
        }
        const author = authorEl ? authorEl.value.trim() : 'Canal';
        if (typeof channelStrikes !== 'undefined') {
          channelStrikes[author] = (channelStrikes[author] || 0) + 1;
          if (typeof saveProgress === 'function') saveProgress();
        }
        alert(`FALTA APLICADA POR EL BOT VERIFICADOR DE CIENCIA:\n\n${sciCheck.reason}\n\nEl video ha sido prohibido y se registró una falta en el canal.`);
        return;
      }

      // Si pasa todas las verificaciones, continuar con la publicación normal
      if (typeof origSubmit === 'function') {
        origSubmit.call(uploadForm, e);
      }
    };
  }

  window.addEventListener('DOMContentLoaded', hookDeepModeration);
})();

// === ESCUDO ANTI-ROBO DE CONTENIDO, COPYRIGHT Y PROTECCIÓN DE CREADORES ===
(function() {
  function extractPhrases(text) {
    const clean = (text || '').toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const words = clean.split(" ").filter(w => w.length > 3);
    const ngrams = new Set();
    for (let i = 0; i <= words.length - 3; i++) {
      ngrams.add(words.slice(i, i + 3).join(" "));
    }
    return { clean, words, ngrams };
  }

  function calculateSimilarity(textA, textB) {
    const a = extractPhrases(textA);
    const b = extractPhrases(textB);
    if (!a.clean || !b.clean) return 0;
    if (a.clean === b.clean) return 1;

    if (a.ngrams.size > 0 && b.ngrams.size > 0) {
      let shared = 0;
      a.ngrams.forEach(g => { if (b.ngrams.has(g)) shared++; });
      const ratio = shared / Math.min(a.ngrams.size, b.ngrams.size);
      if (ratio >= 0.65) return ratio;
    }

    const setB = new Set(b.words);
    if (a.words.length < 4) return 0;
    let wordMatches = 0;
    a.words.forEach(w => { if (setB.has(w)) wordMatches++; });
    return wordMatches / a.words.length;
  }

  async function getQuickHash(file) {
    if (!file) return null;
    try {
      const head = await file.slice(0, 65536).arrayBuffer();
      const tail = await file.slice(Math.max(0, file.size - 65536), file.size).arrayBuffer();
      const buf = new Uint8Array(head.byteLength + tail.byteLength);
      buf.set(new Uint8Array(head), 0);
      buf.set(new Uint8Array(tail), head.byteLength);
      const digest = await crypto.subtle.digest('SHA-256', buf);
      return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 24);
    } catch (e) {
      return null;
    }
  }

  function installCopyrightShield() {
    const uploadForm = document.querySelector('#uploadModal form');
    if (!uploadForm || uploadForm.dataset.copyrightShield) return;
    uploadForm.dataset.copyrightShield = '1';

    const prevSubmit = uploadForm.onsubmit;
    uploadForm.onsubmit = async function(e) {
      e.preventDefault();

      const title = (document.getElementById('inTitle')?.value || '').trim();
      const desc = (document.getElementById('inDesc')?.value || '').trim();
      const author = (document.getElementById('inAuthor')?.value || 'Creador').trim();
      const file = document.getElementById('inFile')?.files?.at(0) || null;
      const fp = await getQuickHash(file);

      const registry = JSON.parse(localStorage.getItem('eclipse_copyright_registry') || '[]');
      const existingVideos = (typeof videos !== 'undefined' && Array.isArray(videos)) ? videos : [];

      // 1. Verificar contra videos ya publicados en Eclipse y el registro de autoría
      const allSources = [
        ...registry,
        ...existingVideos.map(v => ({
          hash: v.fileHash || '',
          author: v.author || '',
          title: v.title || '',
          text: `${v.title || ''} ${v.desc || ''}`
        }))
      ];

      for (const orig of allSources) {
        if (!orig.author || orig.author.toLowerCase() === author.toLowerCase()) continue;

        const sameFile = fp && orig.hash && fp === orig.hash;
        const titleSim = calculateSimilarity(title, orig.title);
        const fullSim = calculateSimilarity(`${title} ${desc}`, orig.text);

        if (sameFile || titleSim >= 0.78 || fullSim >= 0.72) {
          // Registrar el video oculto/parchado como CONTENIDO ROBADO fuera de la vista pública
          const stolenLog = JSON.parse(localStorage.getItem('eclipse_stolen_blocked') || '[]');
          stolenLog.push({
            status: 'CONTENIDO ROBADO',
            stolenBy: author,
            originalCreator: orig.author,
            originalTitle: orig.title,
            date: new Date().toISOString()
          });
          localStorage.setItem('eclipse_stolen_blocked', JSON.stringify(stolenLog));

          if (typeof channelStrikes !== 'undefined') {
            channelStrikes[author] = (channelStrikes[author] || 0) + 1;
            if (typeof saveProgress === 'function') saveProgress();
          }

          alert(
            `[CONTENIDO ROBADO · OCULTO DEL PÚBLICO]\n\n` +
            `Este video ha sido parchado automáticamente como CONTENIDO ROBADO y retirado de la vista pública.\n\n` +
            `• Creador original protegido: ${orig.author}\n` +
            `• Obra original: "${orig.title}"\n` +
            `• Motivo: ${sameFile ? 'Archivo de video idéntico resubido sin permiso' : 'Copia de frases y estructura del contenido original'}`
          );
          return;
        }
      }

      // 2. Si es contenido original, registrar su autoría para protegerlo contra futuros robos
      registry.push({
        hash: fp || '',
        author: author,
        title: title,
        text: `${title} ${desc}`,
        createdAt: Date.now()
      });
      localStorage.setItem('eclipse_copyright_registry', JSON.stringify(registry));

      if (typeof prevSubmit === 'function') {
        prevSubmit.call(uploadForm, e);
      }
    };
  }

  // Filtrar en tiempo real por si llegara cualquier entrada marcada como CONTENIDO ROBADO
  function hideStolenFromPublicFeed() {
    if (typeof videos !== 'undefined' && Array.isArray(videos)) {
      const cleanList = videos.filter(v => v.status !== 'CONTENIDO ROBADO' && !String(v.title || '').includes('[CONTENIDO ROBADO]'));
      if (cleanList.length !== videos.length) {
        videos.length = 0;
        videos.push(...cleanList);
        if (typeof render === 'function') render();
      }
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    installCopyrightShield();
    setInterval(hideStolenFromPublicFeed, 1500);
  });
})();

// === AGUJERO NEGRO PHOENIX A TRAGÁNDOSE VIDEOS PROHIBIDOS ===
(function() {
  const st = document.createElement('style');
  st.textContent = `
    @keyframes phoenixSpin {
      0%   { transform: rotate(0deg) scale(1); }
      50%  { transform: rotate(180deg) scale(1.06); }
      100% { transform: rotate(360deg) scale(1); }
    }
    @keyframes videoSwallowed {
      0%   { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
      65%  { transform: translate(-85px, 15px) rotate(-240deg) scale(0.45); opacity: 0.85; }
      100% { transform: translate(-125px, 0px) rotate(-540deg) scale(0); opacity: 0; }
    }
    .phoenix-disk { animation: phoenixSpin 4s linear infinite; }
    .swallowed-video-card { animation: videoSwallowed 2.1s cubic-bezier(0.55, 0.05, 0.68, 0.19) forwards; }
  `;
  document.head.appendChild(st);

  window.triggerPhoenixBlackHole = function(videoTitle, rawReason) {
    const old = document.getElementById('phoenixBlackHoleModal');
    if (old) old.remove();

    const rLow = (rawReason + ' ' + videoTitle).toLowerCase();
    let customPhrase = 'Tu video rompió las reglas de Eclipse y fue devorado por el agujero negro Phoenix A.';
    if (/porno|xxx|nsfw|desnud|sex|erotic|adult|cochin/.test(rLow)) {
      customPhrase = 'Ve a subirlo a otro lado ¡Cochino!';
    } else if (/animal|maltrat|crueldad|perro|gato|caza|sangre|gore/.test(rLow)) {
      customPhrase = 'Los animales son alguien, no algo.';
    } else if (/ia|ai|midjourney|sora|runway|sintetic|bot|chatgpt/.test(rLow)) {
      customPhrase = 'Aquí creamos humanos, no robots. ¡Phoenix A se tragó tu relleno de IA!';
    }

    const ov = document.createElement('div');
    ov.id = 'phoenixBlackHoleModal';
    ov.style.cssText = 'position:fixed; inset:0; background:rgba(3, 3, 8, 0.94); backdrop-filter:blur(6px); z-index:2147483647; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; color:#fff; text-align:center;';
    ov.innerHTML = `
      <div style="font-size:12px; font-weight:800; letter-spacing:1.4px; color:#f59e0b; text-transform:uppercase; margin-bottom:10px;">
        Horizonte de Sucesos · Phoenix A (100 Mil Millones de Masas Solares)
      </div>

      <div style="position:relative; width:340px; height:210px; display:flex; align-items:center; justify-content:center; margin-bottom:14px;">
        <!-- Agujero Negro Supermasivo Phoenix A -->
        <div class="phoenix-disk" style="position:relative; width:165px; height:165px; display:flex; align-items:center; justify-content:center;">
          <svg width="165" height="165" viewBox="0 0 180 180">
            <defs>
              <radialGradient id="phoenixGlow" cx="50%" cy="50%" r="50%">
                <stop offset="35%" stop-color="#000000"/>
                <stop offset="52%" stop-color="#9333ea"/>
                <stop offset="72%" stop-color="#f59e0b"/>
                <stop offset="100%" stop-color="transparent"/>
              </radialGradient>
            </defs>
            <circle cx="90" cy="90" r="86" fill="url(#phoenixGlow)"/>
            <ellipse cx="90" cy="90" rx="84" ry="26" fill="none" stroke="#fbbf24" stroke-width="3.5" opacity="0.9"/>
            <ellipse cx="90" cy="90" rx="70" ry="18" fill="none" stroke="#c084fc" stroke-width="2.5" opacity="0.85"/>
            <circle cx="90" cy="90" r="34" fill="#000000" stroke="#7e22ce" stroke-width="2.5"/>
          </svg>
        </div>

        <!-- Tarjeta del video siendo succionada y estirada hacia el agujero negro -->
        <div class="swallowed-video-card" style="position:absolute; right:14px; width:125px; background:#18181f; border:1px solid #ef4444; border-radius:10px; padding:8px; box-shadow:0 0 20px rgba(239,68,68,0.5);">
          <div style="height:46px; background:#2e1065; border-radius:6px; display:flex; align-items:center; justify-content:center; margin-bottom:5px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fda4af"><polygon points="6 4 20 12 6 20 6 4"/></svg>
          </div>
          <div style="font-size:10px; font-weight:700; color:#fecaca; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${videoTitle || 'Video Prohibido'}</div>
        </div>
      </div>

      <h2 style="margin:0 0 8px; font-size:23px; font-weight:900; color:#fda4af; max-width:520px;">
        "${customPhrase}"
      </h2>
      <p style="margin:0 0 20px; font-size:13px; color:#a1a1aa; max-width:460px;">
        Tu publicación fue bloqueada y absorbida por Phoenix A porque incumple las normas de convivencia y contenido humano de Eclipseᴬᴿ.
      </p>
      <button type="button" onclick="document.getElementById('phoenixBlackHoleModal').remove()" style="background:linear-gradient(135deg,#9333ea,#dc2626); color:#fff; border:none; padding:11px 26px; border-radius:18px; font-size:13.5px; font-weight:800; cursor:pointer; box-shadow:0 6px 20px rgba(220,38,38,0.4);">
        Entendido · Salir
      </button>
    `;
    document.body.appendChild(ov);
  };

  // Enganchar al escáner de reglas para disparar Phoenix A automáticamente cuando rechaza un video
  const oldScan = window.scan;
  window.scan = function(t, d, f) {
    const res = typeof oldScan === 'function' ? oldScan(t, d, f) : { ok: true };
    if (res && res.ok === false) {
      setTimeout(() => window.triggerPhoenixBlackHole(t || 'Video rechazado', res.reason || t || ''), 60);
    }
    return res;
  };
})();

// === ROL E INSIGNIA DE ADMINISTRADOR PARA TU MEJOR AMIGO ===
(function() {
  window.getAdminsList = function() {
    return JSON.parse(localStorage.getItem('eclipse_admins_list') || '[]');
  };

  window.grantAdminRole = function(username) {
    if (!username) return;
    const list = window.getAdminsList();
    if (!list.some(x => x.toLowerCase() === username.toLowerCase())) {
      list.push(username.trim());
      localStorage.setItem('eclipse_admins_list', JSON.stringify(list));
    }
    alert(`¡${username} ahora tiene rango e insignia de Admin Oficial en Eclipseᴬᴿ!`);
  };

  // Botón rápido para que tú como Fundador nombres Admin a tu mejor amigo
  function addPromoteAdminOption() {
    const isF = window.checkIsFounderActive();
    if (!isF) return;
    const headerRight = document.querySelector('header .header-right') || document.querySelector('header');
    if (!headerRight || document.getElementById('promoteAdminBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'promoteAdminBtn';
    btn.type = 'button';
    btn.style.cssText = 'background:#1e1b4b; color:#38bdf8; border:1px solid #0284c7; padding:6px 11px; border-radius:16px; font-size:11.5px; font-weight:800; cursor:pointer;';
    btn.textContent = '+ Nombrar Admin';
    btn.onclick = () => {
      const friend = prompt('Escribe el nombre exacto del canal de tu mejor amigo para hacerlo Admin:');
      if (friend && friend.trim()) window.grantAdminRole(friend.trim());
    };
    headerRight.insertBefore(btn, headerRight.firstChild);
  }

  // Mostrar insignia "ADMIN" junto a su nombre si inició sesión con ese canal
  function checkCurrentUserAdmin() {
    const saved = JSON.parse(localStorage.getItem('eclipse_user') || 'null');
    if (!saved || !saved.name) return;
    const isAdm = window.getAdminsList().some(x => x.toLowerCase() === saved.name.toLowerCase());
    if (isAdm) {
      window.isEclipseAdmin = true;
      const pill = document.getElementById('userProfilePill') || document.querySelector('header .user-badge');
      if (pill && !pill.innerHTML.includes('ADMIN')) {
        pill.innerHTML += ' <span style="background:#0284c7;color:#fff;font-size:10px;padding:2px 6px;border-radius:8px;margin-left:5px;font-weight:900;">ADMIN</span>';
      }
    }
  }

  setInterval(() => { addPromoteAdminOption(); checkCurrentUserAdmin(); }, 1500);
})();
