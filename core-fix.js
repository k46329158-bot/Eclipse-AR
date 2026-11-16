(function() {
  // Asegurar que .hidden siempre oculte los modales incluso con display:flex inline
  const st = document.createElement('style');
  st.textContent = '.hidden { display: none !important; }';
  document.head.appendChild(st);

  // Garantizar funciones de Tienda de Lunas, Estudio de Animación y Editor Pro
  window.openStoreModal = function() {
    const m = document.getElementById('storeModal');
    if (m) { m.classList.remove('hidden'); m.style.display = 'flex'; }
  };

  window.closeStoreModal = function() {
    const m = document.getElementById('storeModal');
    if (m) { m.classList.add('hidden'); m.style.display = 'none'; }
  };

  window.openAnimStudio = function() {
    const isF = (typeof isFounder !== 'undefined' && isFounder) || localStorage.getItem('eclipse_founder') === '1';
    const hasAnim = (typeof unlockedAnim !== 'undefined' && unlockedAnim) || localStorage.getItem('eclipse_unlocked_anim') === '1';
    if (!isF && !hasAnim) {
      alert('El Estudio de Animación Pro cuesta 30,000 Lunas en la Tienda de Lunas (o entra en Modo Fundador).');
      openStoreModal();
      return;
    }
    const m = document.getElementById('animModal');
    if (m) { m.classList.remove('hidden'); m.style.display = 'flex'; }
  };

  window.closeAnimStudio = function() {
    const m = document.getElementById('animModal');
    if (m) { m.classList.add('hidden'); m.style.display = 'none'; }
  };

  window.buyFeature = function(feat, cost) {
    let moons = Number(localStorage.getItem('eclipse_moons') || (typeof userMoons !== 'undefined' ? userMoons : 0));
    const isF = (typeof isFounder !== 'undefined' && isFounder) || localStorage.getItem('eclipse_founder') === '1';
    if (!isF && moons < cost) {
      alert(`Necesitas ${cost.toLocaleString()} Lunas. Actualmente tienes ${moons.toLocaleString()} Lunas.`);
      return;
    }
    if (!isF) {
      moons -= cost;
      localStorage.setItem('eclipse_moons', String(moons));
      if (typeof userMoons !== 'undefined') window.userMoons = moons;
    }
    if (feat === 'editor') {
      localStorage.setItem('eclipse_unlocked_editor', '1');
      window.unlockedEditor = true;
      const b = document.getElementById('buyEditorBtn');
      if (b) { b.textContent = 'Adquirido ✓'; b.disabled = true; }
      alert('¡Editor Pro de Videos desbloqueado!');
    } else if (feat === 'anim') {
      localStorage.setItem('eclipse_unlocked_anim', '1');
      window.unlockedAnim = true;
      const b = document.getElementById('buyAnimBtn');
      if (b) { b.textContent = 'Adquirido ✓'; b.disabled = true; }
      alert('¡Estudio de Animación Pro desbloqueado!');
    }
  };

  window.selectTheme = function(theme, cost) {
    const themes = {
      default:  'radial-gradient(circle at top, #181028 0%, #09090d 75%)',
      nebulosa: 'radial-gradient(circle at top, #1e1b4b 0%, #09090d 75%)',
      solar:    'radial-gradient(circle at top, #422006 0%, #09090d 75%)',
      matrix:   'radial-gradient(circle at top, #052e16 0%, #050805 75%)'
    };
    document.body.style.background = themes[theme] || themes.default;
    localStorage.setItem('eclipse_theme', theme);
    document.querySelectorAll('[id^="themeBtn-"]').forEach(b => b.textContent = 'Equipar');
    const activeBtn = document.getElementById('themeBtn-' + theme);
    if (activeBtn) activeBtn.textContent = 'Equipado ✓';
  };

  window.claimDailyMoons = function() {
    const today = new Date().toDateString();
    if (localStorage.getItem('eclipse_last_claim') === today) {
      alert('Ya reclamaste tus 1,500 Lunas diarias hoy. ¡Vuelve mañana!');
      return;
    }
    let moons = Number(localStorage.getItem('eclipse_moons') || 0) + 1500;
    localStorage.setItem('eclipse_moons', String(moons));
    localStorage.setItem('eclipse_last_claim', today);
    alert(`¡Reclamaste +1,500 Lunas! Total actual: ${moons.toLocaleString()} Lunas.`);
  };

  window.donateToCreator = function() {
    alert('Gracias por apoyar a Æiden Company y mantener libre la divulgación científica en Eclipseᴬᴿ.');
  };

  // Activar controles de Editor Pro al seleccionar video
  window.previewEditorVideo = function(e) {
    const file = e.target.files && e.target.files.item(0);
    if (!file) return;
    const ctrl = document.getElementById('proEditorControls');
    if (ctrl) ctrl.classList.remove('hidden');
  };

  // Aplicar tema guardado al iniciar
  const savedTheme = localStorage.getItem('eclipse_theme');
  if (savedTheme) window.selectTheme(savedTheme, 0);
})();
