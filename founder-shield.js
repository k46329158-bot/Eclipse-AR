(function() {
  const FOUNDER_EMAIL = 'k46329158@gmail.com';
  if (window.firebase && firebase.apps && firebase.apps.length === 0) {
    try {
      firebase.initializeApp({
        apiKey: "AIzaSyDRqYi8BsrjP4gdxmdq5XKiWnrn9aDyKGg",
        authDomain: "://firebaseapp.com",
        projectId: "eclipse-aiden"
      });
    } catch (e) {}
  }

  window.checkIsFounderActive = function() {
    const acc = JSON.parse(localStorage.getItem('eclipse_verified_google_user') || 'null');
    return !!(acc && acc.verifiedByGoogle === true && String(acc.email || '').toLowerCase() === FOUNDER_EMAIL);
  };

  window.loginWithRealGoogleBot = async function() {
    if (!window.firebase || !firebase.auth) {
      alert('Iniciando conexión con Google, vuelve a tocar en un segundo.');
      return;
    }
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const res = await firebase.auth().signInWithPopup(provider);
      const u = res.user;
      if (!u || !u.email) return;
      const isF = u.email.toLowerCase() === FOUNDER_EMAIL;
      const name = isF ? 'Æiden Company' : (prompt('Elige tu nombre de canal:', u.displayName || u.email.split('@')) || '').trim();
      if (!name) return;
      const prof = { uid: u.uid, name, email: u.email, verifiedByGoogle: true };
      localStorage.setItem('eclipse_verified_google_user', JSON.stringify(prof));
      localStorage.setItem('eclipse_account_active', JSON.stringify(prof));
      location.reload();
    } catch (e) {
      alert('Error al entrar con Google: ' + (e.message || e));
    }
  };

  setInterval(() => {
    const isF = window.checkIsFounderActive();
    const acc = JSON.parse(localStorage.getItem('eclipse_verified_google_user') || 'null');
    const banner = Array.from(document.querySelectorAll('div, section')).find(el => el.textContent && el.textContent.includes('MODO FUNDADOR:') && el.offsetHeight < 100);
    if (banner) banner.style.display = isF ? 'flex' : 'none';
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
      ab.textContent = acc ? (isF ? `@${acc.name} · Fundador ✓` : `@${acc.name} ✓`) : 'Entrar con Google';
      ab.onclick = acc ? () => { localStorage.removeItem('eclipse_verified_google_user'); localStorage.removeItem('eclipse_account_active'); location.reload(); } : window.loginWithRealGoogleBot;
    }
  }, 600);
})();
