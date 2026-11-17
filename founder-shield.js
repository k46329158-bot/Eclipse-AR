(function() {
  const FOUNDER_EMAIL = 'k46329158@gmail.com';
  const FS_ACCOUNTS = 'https://googleapis.com';

  const hideCss = document.createElement('style');
  hideCss.id = 'founderStrictHideCss';
  hideCss.textContent = `#promoteAdminBtn, #founderJusticeBtn, #founderToolsBar, #founderAccountsBtn { display: none !important; }`;
  document.head.appendChild(hideCss);

  // Solo es Fundador si inició sesión REAL con Google y su correo verificado por Google es el del Fundador
  window.checkIsFounderActive = function() {
    const acc = JSON.parse(localStorage.getItem('eclipse_verified_google_user') || 'null');
    return !!(acc && acc.verifiedByGoogle === true && String(acc.email || '').toLowerCase() === FOUNDER_EMAIL);
  };

  window.loginWithRealGoogleBot = async function() {
    if (typeof firebase === 'undefined' || !firebase.auth) {
      alert('Cargando motor de seguridad de Google... intenta en 2 segundos.');
      return;
    }
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      if (!user || !user.email) return;

      const isFounderUser = (user.email.toLowerCase() === FOUNDER_EMAIL);
      let channelName = isFounderUser ? 'Æiden Company' : (user.displayName || user.email.split('@'));

      if (!isFounderUser) {
        const chosen = prompt(`Google verificó tu correo (${user.email}).\nElige tu nombre de canal único para Eclipseᴬᴿ:`, channelName);
        if (!chosen || !chosen.trim()) {
          await firebase.auth().signOut();
          return;
        }
        channelName = chosen.trim();

        // Bot Guardián verifica reglas y unicidad en Firestore
        const low = channelName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (/(puto|puta|mierda|nazi|racist|escoria|idiota|imbecil|maricon|mogolic|retrasad|hitler|epstein|adolf|porno|porn|xxx|xnxx|hentai|nsfw|pedofil|onlyfans|sex|desnud|aiden company|æiden company)/i.test(low)) {
          await firebase.auth().signOut();
          if (typeof window.triggerWormholeMonster === 'function') {
            window.triggerWormholeMonster(channelName, 'Nombre rechazado por el Bot Guardián de Eclipseᴬᴿ.');
          } else {
            alert('Nombre rechazado por el Bot Guardián.');
          }
          return;
        }

        // Comprobar en la nube si otro correo ya registró ese nombre
        try {
          const r = await fetch(`${FS_ACCOUNTS}?pageSize=100`);
          const j = await r.json();
          const docs = j.documents || [];
          const taken = docs.some(d => {
            const n = (d.fields?.name?.stringValue || '').toLowerCase();
            const e = (d.fields?.email?.stringValue || '').toLowerCase();
            return n === channelName.toLowerCase() && e !== user.email.toLowerCase();
          });
          if (taken) {
            await firebase.auth().signOut();
            alert(`El Bot Guardián informa: el nombre "@${channelName}" ya pertenece a otro usuario verificado. Elige otro.`);
            return;
          }
        } catch (e) {}
      }

      const verifiedProfile = {
        uid: user.uid,
        name: channelName,
        email: user.email,
        photo: user.photoURL || '',
        verifiedByGoogle: true,
        createdAt: new Date().toLocaleString()
      };
      localStorage.setItem('eclipse_verified_google_user', JSON.stringify(verifiedProfile));
      localStorage.setItem('eclipse_account_active', JSON.stringify(verifiedProfile));

      // Registrar en Firestore global
      try {
        await fetch(FS_ACCOUNTS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: {
              name: { stringValue: verifiedProfile.name },
              email: { stringValue: verifiedProfile.email },
              uid: { stringValue: verifiedProfile.uid },
              createdAt: { stringValue: verifiedProfile.createdAt }
            }
          })
        });
      } catch (e) {}

      alert(isFounderUser
        ? 'Identidad verificada por Google: Bienvenido, Fundador (Æiden Company).'
        : `¡Cuenta verificada en tiempo real por Google y el Bot Guardián! Bienvenido, @${channelName}.`);
    } catch (err) {
      alert('No se pudo completar la verificación con Google: ' + (err.message || err));
    }
  };
})();

// Bot Inspector en tiempo real antes de subir cualquier Video o Short
(function() {
  const origScan = window.scan;
  window.scan = function(title, desc, fileName) {
    const acc = JSON.parse(localStorage.getItem('eclipse_verified_google_user') || 'null');
    if (!acc || !acc.verifiedByGoogle) {
      alert('Bot de Seguridad: Debes iniciar sesión con Google ("Entrar con Google") antes de subir videos o Shorts.');
      return { ok: false, reason: 'Usuario no verificado con Google.' };
    }
    const base = typeof origScan === 'function' ? origScan(title, desc, fileName) : { ok: true };
    if (base && base.ok === false) return base;

    const full = `${title} ${desc} ${fileName}`.toLowerCase();
    if (/(porno|xxx|nsfw|desnud|maltrato|crueldad|hecho con ia|ai generated|midjourney|sora)/i.test(full)) {
      if (typeof window.triggerPhoenixBlackHole === 'function') {
        window.triggerPhoenixBlackHole(title, full);
      }
      return { ok: false, reason: 'Bloqueado por el Bot Inspector en tiempo real.' };
    }
    return { ok: true };
  };

  setInterval(() => {
    const isF = window.checkIsFounderActive();
    const acc = JSON.parse(localStorage.getItem('eclipse_verified_google_user') || 'null');

    const cssEl = document.getElementById('founderStrictHideCss');
    if (cssEl) {
      cssEl.textContent = isF
        ? `#promoteAdminBtn, #founderJusticeBtn, #founderToolsBar, #founderAccountsBtn { display: inline-flex !important; }`
        : `#promoteAdminBtn, #founderJusticeBtn, #founderToolsBar, #founderAccountsBtn { display: none !important; }`;
    }

    const banner = Array.from(document.querySelectorAll('div, section')).find(el =>
      el.textContent && el.textContent.includes('MODO FUNDADOR:') && el.offsetHeight < 100
    );
    if (banner) banner.style.display = isF ? 'flex' : 'none';

    const mb = Array.from(document.querySelectorAll('header button, header span, header div')).find(el =>
      el.textContent && (el.textContent.includes('∞ Lunas') || el.dataset?.moonsSlot)
    );
    if (mb) {
      mb.dataset.moonsSlot = '1';
      mb.textContent = isF ? '∞ Lunas' : `${Number(localStorage.getItem('eclipse_moons') || 0).toLocaleString()} Lunas`;
    }

    const hr = document.querySelector('header .header-right') || document.querySelector('header');
    if (hr) {
      let ab = document.getElementById('eclipseAccountBtn');
      if (!ab) {
        ab = document.createElement('button');
        ab.id = 'eclipseAccountBtn';
        ab.type = 'button';
        ab.style.cssText = 'background:#1e1b4b;color:#e9d5ff;border:1px solid #7e22ce;padding:6px 12px;border-radius:16px;font-size:12px;font-weight:800;cursor:pointer;';
        hr.appendChild(ab);
      }
      if (acc && acc.verifiedByGoogle) {
        ab.textContent = isF ? `@${acc.name} · Fundador ✓` : `@${acc.name} ✓`;
        ab.onclick = () => {
          if (confirm(`Sesión verificada: ${acc.email}\n¿Quieres cerrar sesión?`)) {
            localStorage.removeItem('eclipse_verified_google_user');
            localStorage.removeItem('eclipse_account_active');
            if (typeof firebase !== 'undefined' && firebase.auth) firebase.auth().signOut();
          }
        };
      } else {
        ab.textContent = 'Entrar con Google';
        ab.onclick = window.loginWithRealGoogleBot;
      }
    }

    const inAuthor = document.getElementById('inAuthor');
    if (inAuthor && acc && acc.verifiedByGoogle) {
      inAuthor.value = acc.name;
    }
  }, 500);
})();
