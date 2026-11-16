(function() {
  let soundPlayed = false;
  function playEclipseChime() {
    if (soundPlayed) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      if (ctx.state === 'suspended') ctx.resume();
      if (ctx.state !== 'running') return;
      soundPlayed = true;
      const pill = document.getElementById('introAudioPill');
      if (pill) pill.remove();

      const notes = [523.25, 659.25, 783.99, 987.77, 1046.50];
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.12);
        g.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + i * 0.12 + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 0.8);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.85);
      });
    } catch (e) {}
  }

  function startAdaptiveIntro() {
    const old = document.getElementById('eclipseIntro');
    if (old) old.remove();

    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatOrb {
        0%, 100% { transform: translateY(0px) scale(1); }
        50%      { transform: translateY(-9px) scale(1.03); }
      }
      .eclipse-floating-logo {
        animation: floatOrb 2.2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);

    const ov = document.createElement('div');
    ov.id = 'eclipseIntro';
    ov.style.cssText = 'position:fixed;inset:0;background:#09090d;z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity 0.55s ease;cursor:pointer;';
    ov.innerHTML = `
      <div id="introAudioPill" style="position:absolute;top:18px;right:20px;background:#18181f;border:1px solid #4c1d95;color:#d8b4fe;padding:6px 12px;border-radius:16px;font-size:11.5px;font-weight:700;">Toca para sonido</div>
      <div class="eclipse-floating-logo">
        <svg width="128" height="128" viewBox="0 0 100 100" style="filter:drop-shadow(0 0 26px rgba(147,51,234,0.65));">
          <defs>
            <mask id="eclipseMoonMask">
              <rect x="0" y="0" width="100" height="100" fill="white"/>
              <circle id="moonCutCircle" cx="122" cy="50" r="32" fill="black"/>
            </mask>
          </defs>
          <!-- Círculo redondo perfecto (sin estirarse hacia los costados) -->
          <circle cx="50" cy="50" r="36" fill="#9333EA" mask="url(#eclipseMoonMask)"/>
          <polygon id="arrowToStar" fill="#FFFFFF" points="43,36 43,36 63,50 63,50 43,64 43,64 43,50 43,50 43,36 43,36"/>
        </svg>
      </div>
      <div id="introTitle" style="margin-top:14px;font-size:38px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;display:flex;align-items:flex-start;opacity:0;transform:translateY(10px);transition:all 0.45s ease;">
        Eclipse<sup style="font-size:15px;color:#c084fc;margin-left:3px;margin-top:4px;font-weight:800;">AR</sup>
      </div>
      <div id="introNetStatus" style="font-size:12px;color:#a1a1aa;margin-top:6px;letter-spacing:0.4px;">Cargando órbita...</div>
    `;
    document.body.appendChild(ov);

    const cutCircle = document.getElementById('moonCutCircle');
    const starPoly  = document.getElementById('arrowToStar');
    const titleEl   = document.getElementById('introTitle');
    const statusEl  = document.getElementById('introNetStatus');

    // Medir velocidad real de red / carga de la página
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const speedMbps = (conn && conn.downlink) ? conn.downlink : 5;
    let pageReady = (document.readyState === 'complete');
    window.addEventListener('load', () => { pageReady = true; });

    // Si internet es rápido (> 5 Mbps) dura ~1.1s; si es lento dura más y espera a que cargue
    const minDuration = speedMbps >= 8 ? 1050 : (speedMbps >= 3 ? 1500 : 2300);
    const startTime = performance.now();
    let progress = 0;

    function tick(now) {
      const elapsed = now - startTime;
      const target = pageReady ? Math.min(1, elapsed / minDuration) : Math.min(0.72, elapsed / (minDuration * 1.4));
      progress += (target - progress) * 0.14;
      if (pageReady && elapsed >= minDuration && progress > 0.985) progress = 1;

      const t = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // Ahuecado limpio desde la derecha sin estirar el círculo
      cutCircle.setAttribute('cx', (122 - t * 53).toFixed(1));

      // Flecha girando sobre su eje y abriendo sus 5 puntas en estrella
      const cx = 50 + t * 23;
      const cy = 50 - t * 5;
      const rOut = 13 + t * 2;
      const rIn = 11 - t * 5.2;
      const ang = t * Math.PI * 2;
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? rOut : rIn;
        const a = ang - Math.PI / 2 + (i * Math.PI) / 5;
        pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
      }
      starPoly.setAttribute('points', pts.join(' '));

      if (progress >= 0.55) {
        titleEl.style.opacity = '1';
        titleEl.style.transform = 'translateY(0)';
        statusEl.textContent = pageReady ? 'Æiden Company' : 'Sincronizando conexión...';
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          ov.style.opacity = '0';
          setTimeout(() => ov.remove(), 550);
        }, 350);
      }
    }
    requestAnimationFrame(tick);

    playEclipseChime();
    ['pointerdown', 'click', 'keydown', 'touchstart'].forEach(ev =>
      window.addEventListener(ev, playEclipseChime, { once: true })
    );
  }

  if (document.body) startAdaptiveIntro();
  else window.addEventListener('DOMContentLoaded', startAdaptiveIntro);
})();
