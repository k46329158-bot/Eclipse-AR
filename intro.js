(function() {
  let audioDone = false;
  function playFriendlyMusic() {
    if (audioDone) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      if (ctx.state === 'suspended') ctx.resume();
      if (ctx.state !== 'running') return;
      audioDone = true;

      const badge = document.getElementById('introSoundHint');
      if (badge) badge.style.display = 'none';

      // Melodía corta, cálida y amigable (Do5 - Mi5 - Sol5 - Si5 - Do6)
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.50];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.14);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + i * 0.14 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.14 + 0.95);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.14);
        osc.stop(ctx.currentTime + i * 0.14 + 1.0);
      });
    } catch (e) {}
  }

  function startEclipseMorphIntro() {
    const old = document.getElementById('eclipseIntro');
    if (old) old.remove();

    const ov = document.createElement('div');
    ov.id = 'eclipseIntro';
    ov.style.cssText = 'position:fixed;inset:0;background:#09090d;z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity 0.65s ease;cursor:pointer;';
    ov.innerHTML = `
      <div id="introSoundHint" style="position:absolute;top:18px;right:20px;background:#18181f;border:1px solid #4c1d95;color:#d8b4fe;padding:6px 12px;border-radius:16px;font-size:11.5px;font-weight:700;">Toca para activar sonido</div>
      <svg id="morphSvg" width="130" height="130" viewBox="0 0 100 100" style="filter:drop-shadow(0 0 26px rgba(147,51,234,0.65));">
        <path id="morphBody" fill="#9333EA" d="M 14 26 Q 50 26 86 26 Q 92 26 92 32 L 92 68 Q 92 74 86 74 Q 50 74 14 74 Q 8 74 8 68 L 8 32 Q 8 26 14 26 Z" />
        <polygon id="morphStar" fill="#FFFFFF" points="42,36 42,36 62,50 62,50 42,64 42,64 42,50 42,50 42,36 42,36" />
      </svg>
      <div id="introBrand" style="margin-top:14px;font-size:38px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;display:flex;align-items:flex-start;opacity:0;transform:translateY(12px);transition:all 0.6s ease;">
        Eclipse<sup style="font-size:15px;color:#c084fc;margin-left:3px;margin-top:4px;font-weight:800;">AR</sup>
      </div>
      <div id="introSub" style="font-size:13px;color:#a1a1aa;margin-top:5px;letter-spacing:0.6px;opacity:0;transition:opacity 0.6s ease;">Æiden Company</div>
    `;
    document.body.appendChild(ov);

    const bodyEl = document.getElementById('morphBody');
    const starEl = document.getElementById('morphStar');
    const brandEl = document.getElementById('introBrand');
    const subEl = document.getElementById('introSub');

    // Metamorfosis matemática suave (1.4 segundos): Play -> Luna creciente + Flecha girando -> Estrella
    const start = performance.now();
    const duration = 1400;

    function animateMorph(now) {
      const rawT = Math.min(1, (now - start) / duration);
      // Easing suave
      const t = rawT < 0.5 ? 2 * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 2) / 2;

      // 1. El botón rectangular morado se encurva y aplasta hasta formar la Luna creciente
      if (t < 0.85) {
        const k = t / 0.85;
        const leftX = 8 + k * 10;
        const rightX = 92 - k * 14;
        const topY = 26 - k * 12;
        const botY = 74 + k * 12;
        const curveOuter = 8 - k * 26;
        const curveInner = 92 - k * 54;
        bodyEl.setAttribute('d', `M 53 ${topY} C ${curveOuter} ${topY}, ${curveOuter} ${botY}, 53 ${botY} C ${rightX} ${botY}, ${curveInner} ${botY - 12}, ${curveInner} 50 C ${curveInner} ${topY + 12}, ${rightX} ${topY}, 53 ${topY} Z`);
      } else {
        bodyEl.setAttribute('d', 'M53 14C33.1 14 17 30.1 17 50C17 69.9 33.1 86 53 86C63.8 86 73.5 81.2 80.1 73.7C69.4 76.2 57.9 72.5 50.7 63.6C41.4 52.1 43.2 35.1 54.8 25.6C60.1 21.3 66.4 19.2 72.7 19.4C67.1 16 60.3 14 53 14Z');
      }

      // 2. La flecha blanca gira 360° y despliega sus 5 puntas en estrella al costado de la luna
      const cx = 50 + t * 23;
      const cy = 50 - t * 6;
      const rOuter = 13 + t * 2.5;
      const rInner = 11 - t * 5.2;
      const rot = t * Math.PI * 2;
      let pts = [];
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? rOuter : rInner;
        const ang = rot - Math.PI / 2 + (i * Math.PI) / 5;
        pts.push(`${(cx + Math.cos(ang) * r).toFixed(1)},${(cy + Math.sin(ang) * r).toFixed(1)}`);
      }
      starEl.setAttribute('points', pts.join(' '));

      if (rawT >= 0.55) {
        brandEl.style.opacity = '1';
        brandEl.style.transform = 'translateY(0)';
        subEl.style.opacity = '1';
      }

      if (rawT < 1) requestAnimationFrame(animateMorph);
    }
    requestAnimationFrame(animateMorph);

    playFriendlyMusic();
    ['pointerdown', 'click', 'keydown', 'touchstart'].forEach(ev =>
      window.addEventListener(ev, playFriendlyMusic, { once: true })
    );

    setTimeout(() => {
      ov.style.opacity = '0';
      setTimeout(() => ov.remove(), 680);
    }, 2800);
  }

  if (document.body) startEclipseMorphIntro();
  else window.addEventListener('DOMContentLoaded', startEclipseMorphIntro);
})();
