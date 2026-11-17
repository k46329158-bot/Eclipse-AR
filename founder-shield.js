(function() {
  // 1. Verificar únicamente por estado real autenticado (no por texto estático del HTML)
  window.checkIsFounderActive = function() {
    if (localStorage.getItem('eclipse_founder_auth') === '1') return true;
    if (typeof isFounder !== 'undefined' && isFounder === true) return true;
    return false;
  };

  function enforceFounderPrivacy() {
    const isRealFounder = window.checkIsFounderActive();

    // Localizar la barra morada MODO FUNDADOR
    const founderBanner = Array.from(document.querySelectorAll('div, section')).find(el =>
      el.textContent && el.textContent.includes('MODO FUNDADOR:') && el.offsetHeight < 100
    );

    if (!isRealFounder) {
      // OCULTAR TODO a visitantes normales / incógnito
      if (founderBanner) founderBanner.style.display = 'none';
      ['promoteAdminBtn', 'founderJusticeBtn', 'founderToolsBar'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });
      // Asegurar que no muestre Lunas Infinitas si no es fundador real
      const moonsBadge = Array.from(document.querySelectorAll('header button, header span, header div')).find(el =>
        el.textContent && el.textContent.includes('∞ Lunas')
      );
      if (moonsBadge) {
        const savedMoons = Number(localStorage.getItem('eclipse_moons') || 0);
        moonsBadge.textContent = `${savedMoons.toLocaleString()} Lunas`;
      }
    } else {
      // MOSTRAR SOLO AL FUNDADOR AUTENTICADO
      if (founderBanner) founderBanner.style.display = 'flex';
      ['promoteAdminBtn', 'founderJusticeBtn', 'founderToolsBar'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'inline-flex';
      });
    }
  }

  // Enganchar el botón "Æiden Company" del header para pedir tu clave de Fundador
  function hookFounderLoginBtn() {
    const fBtn = Array.from(document.querySelectorAll('header button')).find(b =>
      b.textContent && b.textContent.includes('Æiden') && b.textContent.includes('Company')
    );
    if (fBtn && !fBtn._shieldHooked) {
      fBtn.addEventListener('click', () => {
        setTimeout(() => {
          // Si la función original de index.html activó isFounder = true, guardamos sesión real
          if (typeof isFounder !== 'undefined' && isFounder === true) {
            localStorage.setItem('eclipse_founder_auth', '1');
            enforceFounderPrivacy();
          }
        }, 250);
      });
      fBtn._shieldHooked = true;
    }

    // Enganchar también el botón "Salir" del banner de Fundador
    const exitBtn = Array.from(document.querySelectorAll('button')).find(b =>
      b.textContent && b.textContent.trim() === 'Salir' && b.closest('div')?.textContent?.includes('MODO FUNDADOR')
    );
    if (exitBtn && !exitBtn._exitHooked) {
      exitBtn.addEventListener('click', () => {
        localStorage.removeItem('eclipse_founder_auth');
        window.isFounder = false;
        enforceFounderPrivacy();
      });
      exitBtn._exitHooked = true;
    }
  }

  enforceFounderPrivacy();
  setInterval(() => {
    enforceFounderPrivacy();
    hookFounderLoginBtn();
  }, 500);
})();
