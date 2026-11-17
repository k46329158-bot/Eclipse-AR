(function() {
  const PROJECT_ID = 'eclipse-aiden';
  const FS_BASE = `https://googleapis.com{PROJECT_ID}/databases/(default)/documents`;

  // Convertir objeto simple a formato Firestore REST
  function toFirestoreFields(obj) {
    const fields = {};
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'number') fields[k] = { integerValue: String(Math.floor(v)) };
      else fields[k] = { stringValue: String(v ?? '') };
    }
    return { fields };
  }

  // Leer documentos de una colección en Firestore
  async function fetchCloudCollection(colName) {
    try {
      const res = await fetch(`${FS_BASE}/${colName}?pageSize=100`);
      if (!res.ok) return [];
      const data = await res.json();
      if (!data.documents) return [];
      return data.documents.map(doc => {
        const f = doc.fields || {};
        const out = { _docName: doc.name };
        for (const [k, val] of Object.entries(f)) {
          out[k] = val.stringValue !== undefined ? val.stringValue : Number(val.integerValue || 0);
        }
        return out;
      });
    } catch (e) {
      return [];
    }
  }

  // Guardar documento en Firestore
  async function pushCloudDoc(colName, obj) {
    try {
      const res = await fetch(`${FS_BASE}/${colName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toFirestoreFields(obj))
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  // Agregar campo opcional de URL directa en el formulario +Crear para videos largos
  function enhanceUploadFormWithCloud() {
    const fileInp = document.getElementById('inFile');
    if (!fileInp || document.getElementById('inCloudUrl')) return;

    fileInp.removeAttribute('required');
    const wrap = document.createElement('div');
    wrap.className = 'field';
    wrap.style.marginTop = '8px';
    wrap.innerHTML = `
      <label style="color:#38bdf8;">O pega enlace directo del video (.mp4 / .webm) para compartirlo globalmente:</label>
      <input type="url" id="inCloudUrl" placeholder="https://ejemplo.com (opcional si elegiste archivo chico)" style="width:100%; background:#09090d; border:1px solid #0284c7; color:#fff; padding:8px; border-radius:8px;" />
    `;
    fileInp.parentElement.after(wrap);
  }

  // Sincronizar videos globales al cargar la página
  async function syncGlobalFeed() {
    enhanceUploadFormWithCloud();
    const cloudVideos = await fetchCloudCollection('eclipse_videos');
    if (cloudVideos.length > 0 && typeof videos !== 'undefined' && Array.isArray(videos)) {
      const existingIds = new Set(videos.map(v => String(v.id)));
      cloudVideos.reverse().forEach(cv => {
        if (!existingIds.has(String(cv.id))) {
          videos.unshift({
            id: cv.id || ('v-' + Date.now()),
            title: cv.title || 'Video sin título',
            author: cv.author || 'CreadorEclipse',
            desc: cv.desc || '',
            url: cv.url || '',
            thumb: cv.thumb || '',
            views: Number(cv.views || 1),
            likes: Number(cv.likes || 0),
            dislikes: Number(cv.dislikes || 0),
            date: cv.date || 'Reciente'
          });
        }
      });
      if (typeof renderVideos === 'function') renderVideos();
    }

    const cloudShorts = await fetchCloudCollection('eclipse_shorts');
    if (cloudShorts.length > 0) {
      const localShorts = JSON.parse(localStorage.getItem('eclipse_shorts_db') || '[]');
      const sIds = new Set(localShorts.map(s => String(s.id)));
      cloudShorts.reverse().forEach(cs => {
        if (!sIds.has(String(cs.id))) {
          localShorts.unshift({
            id: cs.id,
            title: cs.title,
            author: cs.author,
            videoUrl: cs.videoUrl || '',
            likes: Number(cs.likes || 1),
            dislikes: Number(cs.dislikes || 0),
            color1: '#4c1d95',
            color2: '#09090d',
            comments: []
          });
        }
      });
      localStorage.setItem('eclipse_shorts_db', JSON.stringify(localShorts));
    }
  }

  // Envolver uploadVideo para que también publique en Firestore global
  const origUpload = window.uploadVideo;
  window.uploadVideo = function(e) {
    if (e) e.preventDefault();
    const title = (document.getElementById('inTitle')?.value || '').trim();
    const author = (document.getElementById('inAuthor')?.value || '').trim() || 'CreadorEclipse';
    const desc = (document.getElementById('inDesc')?.value || '').trim();
    const cloudUrl = (document.getElementById('inCloudUrl')?.value || '').trim();
    const file = document.getElementById('inFile')?.files?.item(0);

    if (!title) return;
    if (typeof window.scan === 'function') {
      const chk = window.scan(title, desc, file ? file.name : cloudUrl);
      if (chk && chk.ok === false) return;
    }

    const publishGlobal = async (finalUrl) => {
      const vidObj = {
        id: 'vid-' + Date.now(),
        title,
        author,
        desc,
        url: finalUrl,
        thumb: '',
        views: 1,
        likes: 0,
        dislikes: 0,
        date: new Date().toLocaleDateString()
      };
      await pushCloudDoc('eclipse_videos', vidObj);
      if (typeof videos !== 'undefined' && Array.isArray(videos)) {
        videos.unshift(vidObj);
        if (typeof renderVideos === 'function') renderVideos();
      }
      const m = document.getElementById('uploadModal');
      if (m) { m.classList.add('hidden'); m.style.display = 'none'; }
      e?.target?.reset?.();
    };

    if (cloudUrl) {
      publishGlobal(cloudUrl);
    } else if (file && file.size <= 750 * 1024) {
      const reader = new FileReader();
      reader.onload = () => publishGlobal(reader.result);
      reader.readAsDataURL(file);
    } else if (typeof origUpload === 'function') {
      origUpload.apply(this, arguments);
      alert('Nota: Para que otras personas desde otros dispositivos puedan reproducir videos pesados (>750 KB), pega también un enlace directo .mp4 en el campo azul.');
    }
  };

  setTimeout(syncGlobalFeed, 900);
})();
