
function playFriendlyIntroChime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.14);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + i * 0.14 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.14 + 0.75);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.14);
      osc.stop(ctx.currentTime + i * 0.14 + 0.8);
    });
  } catch (e) {}
}
playFriendlyIntroChime();

(function() {
  // Ocultar cualquier intro vieja del HTML para evitar duplicados
  const oldIntro = document.getElementById('eclipseIntro');
  if (oldIntro) oldIntro.remove();

  const overlay = document.createElement('div');
  overlay.id = 'eclipseOfficialIntro';
  overlay.style.cssText = 'position:fixed; inset:0; background:#09090d; z-index:2147483647; display:flex; align-items:center; justify-content:center; transition:opacity 0.65s ease, visibility 0.65s ease;';
  overlay.innerHTML = '<canvas id="eclipseIntroCanvas" width="1280" height="720" style="width:100vw; height:100vh; object-fit:contain; background:#09090d;"></canvas>';
  document.body.appendChild(overlay);

  const c = document.getElementById('eclipseIntroCanvas');
  const ctx = c.getContext('2d');

  // Evaluador Bézier puro (sin corchetes numéricos que puedan recortarse)
  function cubicBezier(p0, p1, p2, p3, t) {
    const mt = 1 - t;
    return {
      x: mt*mt*mt*p0.x + 3*mt*mt*t*p1.x + 3*mt*t*t*p2.x + t*t*t*p3.x,
      y: mt*mt*mt*p0.y + 3*mt*mt*t*p1.y + 3*mt*t*t*p2.y + t*t*t*p3.y
    };
  }

  const segs = [
    { a:{x:55,y:10}, b:{x:30.147,y:10}, c:{x:10,y:30.147}, d:{x:10,y:55} },
    { a:{x:10,y:55}, b:{x:10,y:79.853}, c:{x:30.147,y:100}, d:{x:55,y:100} },
    { a:{x:55,y:100}, b:{x:68.5,y:100}, c:{x:80.6,y:94.05}, d:{x:88.8,y:84.6} },
    { a:{x:88.8,y:84.6}, b:{x:75.5,y:87.8}, c:{x:61.2,y:83.2}, d:{x:52.2,y:72.1} },
    { a:{x:52.2,y:72.1}, b:{x:40.5,y:57.6}, c:{x:42.8,y:36.2}, d:{x:57.3,y:24.5} },
    { a:{x:57.3,y:24.5}, b:{x:63.8,y:19.2}, c:{x:71.7,y:16.6}, d:{x:79.6,y:16.8} },
    { a:{x:79.6,y:16.8}, b:{x:72.6,y:12.5}, c:{x:64.1,y:10}, d:{x:55,y:10} }
  ];

  const N = 161;
  const perSeg = 23;
  const moonPts = [];
  const circlePts = [];

  segs.forEach(s => {
    for (let j = 0; j < perSeg; j++) {
      const t = j / perSeg;
      const pt = cubicBezier(s.a, s.b, s.c, s.d, t);
      moonPts.push({ x: (pt.x - 55) * 2.1, y: (pt.y - 55) * 2.1 });
    }
  });

  for (let i = 0; i < N; i++) {
    const ang = -Math.PI / 2 - (i / N) * Math.PI * 2;
    circlePts.push({ x: 94.5 * Math.cos(ang), y: 94.5 * Math.sin(ang) });
  }

  function toObjs(str) {
    const nums = str.trim().split(/\s+/).map(Number);
    const res = [];
    for (let i = 0; i < nums.length; i += 2) res.push({ x: nums[i], y: nums[i + 1] });
    return res;
  }

  const rawStar = toObjs("73 28 78.5 42 93.5 43 82 52.5 85.5 67 73 59 60.5 67 64 52.5 52.5 43 67.5 42");
  const starLocalPts = rawStar.map(p => ({ x: (p.x - 73) * 2.1, y: (p.y - 48.5) * 2.1 }));
  const playLocalPts = toObjs("-24 -34 -6 -23 12 -12 30 0 12 12 -6 23 -24 34 -24 17 -24 0 -24 -17");

  function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function draw(ms) {
    ctx.fillStyle = '#09090d';
    ctx.fillRect(0, 0, 1280, 720);

    const floatY = ms < 1300 ? Math.sin((ms / 1300) * Math.PI * 2) * 14 : 0;
    const morphRaw = Math.max(0, Math.min(1, (ms - 1300) / 1150));
    const m = easeInOut(morphRaw);
    const textAlpha = Math.max(0, Math.min(1, (ms - 2350) / 550));

    ctx.save();
    ctx.translate(640, 290 + floatY);

    ctx.fillStyle = '#9333ea';
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const px = lerp(circlePts[i].x, moonPts[i].x, m);
      const py = lerp(circlePts[i].y, moonPts[i].y, m);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    const sx = lerp(4, (73 - 55) * 2.1, m);
    const sy = lerp(0, (48.5 - 55) * 2.1, m);
    const spin = (1 - Math.pow(1 - morphRaw, 2)) * Math.PI * 4;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(spin);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const px = lerp(playLocalPts[i].x, starLocalPts[i].x, m);
      const py = lerp(playLocalPts[i].y, starLocalPts[i].y, m);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.restore();

    if (textAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = textAlpha;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 58px Arial, sans-serif';
      ctx.fillText('Eclipse<sup style="font-size:15px;color:#c084fc;margin-left:3px;">AR</sup>', 640, 470 + (1 - textAlpha) * 14);

      ctx.fillStyle = '#a1a1aa';
      ctx.font = '600 20px Arial, sans-serif';
      ctx.fillText('Æiden Company', 640, 512 + (1 - textAlpha) * 14);
      ctx.restore();
    }
  }

  const t0 = performance.now();
  function animate(now) {
    const elapsed = now - t0;
    draw(elapsed);
    if (elapsed < 3800) {
      requestAnimationFrame(animate);
    } else {
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';
      setTimeout(() => overlay.remove(), 700);
    }
  }
  requestAnimationFrame(animate);
})();

// === MELODÍA AMIGABLE GARANTIZADA EN INTRO ===
(function() {
  let played = false;
  function playEclipseMelody() {
    if (played) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      if (ctx.state === 'suspended') ctx.resume();
      if (ctx.state !== 'running') return;
      played = true;

      // Melodía cálida y amigable (Do - Mi - Sol - La - Do alto)
      const notes = [523.25, 659.25, 783.99, 880.00, 1046.50];
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.14);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + i * 0.14 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.14 + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.14);
        osc.stop(ctx.currentTime + i * 0.14 + 0.75);
      });
    } catch (e) {}
  }

  window.addEventListener('load', playEclipseMelody);
  ['pointerdown', 'click', 'keydown', 'touchstart'].forEach(ev =>
    window.addEventListener(ev, playEclipseMelody, { once: true })
  );
})();
