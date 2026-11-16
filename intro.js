(function() {
  function playFriendlySound() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      if (ctx.state === 'suspended') ctx.resume();
      const notes = [523.25, 659.25, 783.99, 880.00, 1046.50];
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.14);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.11, ctx.currentTime + i * 0.14 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.14 + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.14);
        osc.stop(ctx.currentTime + i * 0.14 + 0.75);
      });
    } catch (e) {}
  }

  window.addEventListener('DOMContentLoaded', () => {
    const oldIntro = document.getElementById('eclipseIntro');
    if (oldIntro) oldIntro.remove();

    const overlay = document.createElement('div');
    overlay.id = 'eclipseIntro';
    overlay.style.cssText = 'position:fixed;inset:0;background:#09090d;z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity 0.65s ease;';
    overlay.innerHTML = `
      <svg width="96" height="96" viewBox="0 0 100 100" style="margin-bottom:16px;filter:drop-shadow(0 0 24px rgba(147,51,234,0.65));">
        <path d="M53 14C33.1 14 17 30.1 17 50C17 69.9 33.1 86 53 86C63.8 86 73.5 81.2 80.1 73.7C69.4 76.2 57.9 72.5 50.7 63.6C41.4 52.1 43.2 35.1 54.8 25.6C60.1 21.3 66.4 19.2 72.7 19.4C67.1 16 60.3 14 53 14Z" fill="#9333EA"/>
        <polygon points="73,30 76.5,40.5 87.5,40.5 78.6,47 82,57.5 73,51 64,57.5 67.4,47 58.5,40.5 69.5,40.5" fill="#FFFFFF"/>
      </svg>
      <div style="font-size:38px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;display:flex;align-items:flex-start;">
        Eclipse<sup style="font-size:15px;color:#c084fc;margin-left:3px;margin-top:4px;font-weight:800;">AR</sup>
      </div>
      <div style="font-size:13px;color:#a1a1aa;margin-top:6px;letter-spacing:0.6px;">Æiden Company</div>
    `;
    document.body.appendChild(overlay);

    playFriendlySound();
    overlay.addEventListener('pointerdown', playFriendlySound, { once: true });

    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 700);
    }, 2300);
  });
})();
