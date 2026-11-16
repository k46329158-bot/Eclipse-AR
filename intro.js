(function() {
  let soundPlayed = false;
  function playWelcomeHarp() {
    if (soundPlayed) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      if (ctx.state === 'suspended') ctx.resume();
      if (ctx.state !== 'running') return;
      soundPlayed = true;

      const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.95);
      });
    } catch (e) {}
  }

  window.addEventListener('DOMContentLoaded', () => {
    const old = document.getElementById('eclipseIntro');
    if (old) old.remove();

    const style = document.createElement('style');
    style.textContent = `
      @keyframes playToMoon {
        0%   { transform: scale(0.75) rotate(0deg); border-radius: 22px; background: #9333ea; }
        45%  { transform: scale(1.1) rotate(180deg); border-radius: 50%; background: #7e22ce; }
        100% { transform: scale(1) rotate(360deg); border-radius: 50%; background: transparent; }
      }
      @keyframes fadePlayIcon {
        0%, 35% { opacity: 1; transform: scale(1); }
        60%, 100% { opacity: 0; transform: scale(0.3); }
      }
      @keyframes revealMoonIcon {
        0%, 40% { opacity: 0; transform: scale(0.4) rotate(-40deg); }
        75%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
      }
      @keyframes riseBrand {
        0%, 45% { opacity: 0; transform: translateY(14px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    const ov = document.createElement('div');
    ov.id = 'eclipseIntro';
    ov.style.cssText = 'position:fixed;inset:0;background:#09090d;z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity 0.65s ease;cursor:pointer;';
    ov.innerHTML = `
      <div style="width:104px;height:104px;position:relative;display:flex;align-items:center;justify-content:center;animation:playToMoon 1.5s cubic-bezier(0.22,1,0.36,1) forwards;box-shadow:0 0 36px rgba(147,51,234,0.55);">
        <svg width="46" height="46" viewBox="0 0 24 24" fill="#ffffff" style="position:absolute;animation:fadePlayIcon 1.5s ease forwards;">
          <polygon points="7 4 20 12 7 20 7 4"/>
        </svg>
        <svg width="96" height="96" viewBox="0 0 100 100" style="position:absolute;animation:revealMoonIcon 1.5s ease forwards;">
          <path d="M53 14C33.1 14 17 30.1 17 50C17 69.9 33.1 86 53 86C63.8 86 73.5 81.2 80.1 73.7C69.4 76.2 57.9 72.5 50.7 63.6C41.4 52.1 43.2 35.1 54.8 25.6C60.1 21.3 66.4 19.2 72.7 19.4C67.1 16 60.3 14 53 14Z" fill="#9333EA"/>
          <polygon points="73,30 76.5,40.5 87.5,40.5 78.6,47 82,57.5 73,51 64,57.5 67.4,47 58.5,40.5 69.5,40.5" fill="#FFFFFF"/>
        </svg>
      </div>
      <div style="margin-top:18px;font-size:38px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;display:flex;align-items:flex-start;animation:riseBrand 1.5s ease forwards;">
        Eclipse<sup style="font-size:15px;color:#c084fc;margin-left:3px;margin-top:4px;font-weight:800;">AR</sup>
      </div>
      <div style="font-size:13px;color:#a1a1aa;margin-top:6px;letter-spacing:0.6px;animation:riseBrand 1.6s ease forwards;">Æiden Company</div>
    `;
    document.body.appendChild(ov);

    playWelcomeHarp();
    ['pointerdown', 'click', 'keydown', 'touchstart'].forEach(e =>
      window.addEventListener(e, playWelcomeHarp, { once: true })
    );

    setTimeout(() => {
      ov.style.opacity = '0';
      setTimeout(() => ov.remove(), 680);
    }, 2600);
  });
})();
