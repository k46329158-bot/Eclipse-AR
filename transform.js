(function() {
  let lastShape = null;
  let beforeShapeImg = null;
  let editingShape = null;
  let grabbedIdx = -1;
  let ox = 0, oy = 0;

  function drawWickShape(c, s, withNodes) {
    c.save();
    c.strokeStyle = s.color;
    c.lineWidth = s.size;
    c.lineCap = 'round';
    c.lineJoin = 'round';

    const p0 = s.pts.at(0), p1 = s.pts.at(1), p2 = s.pts.at(2), p3 = s.pts.at(3);

    if (s.type === 'rect') {
      c.beginPath();
      c.moveTo(p0.x, p0.y);
      c.lineTo(p1.x, p1.y);
      c.lineTo(p2.x, p2.y);
      c.lineTo(p3.x, p3.y);
      c.closePath();
      c.stroke();
    } else {
      const cx = (p1.x + p3.x) / 2;
      const cy = (p0.y + p2.y) / 2;
      const rx = Math.abs(p1.x - p3.x) / 2;
      const ry = Math.abs(p2.y - p0.y) / 2;
      c.beginPath();
      c.ellipse(cx, cy, Math.max(2, rx), Math.max(2, ry), 0, 0, Math.PI * 2);
      c.stroke();
    }

    if (withNodes) {
      c.strokeStyle = '#9333ea';
      c.lineWidth = 1.5;
      c.beginPath();
      c.moveTo(p0.x, p0.y);
      c.lineTo(p1.x, p1.y);
      c.lineTo(p2.x, p2.y);
      c.lineTo(p3.x, p3.y);
      c.closePath();
      c.stroke();

      s.pts.forEach(p => {
        c.fillStyle = '#a855f7';
        c.fillRect(p.x - 7, p.y - 7, 14, 14);
        c.strokeStyle = '#ffffff';
        c.lineWidth = 2;
        c.strokeRect(p.x - 7, p.y - 7, 14, 14);
      });
    }
    c.restore();
  }

  function finishTransform() {
    if (editingShape && beforeShapeImg) {
      ctx.putImageData(beforeShapeImg, 0, 0);
      drawWickShape(ctx, editingShape, false);
      if (typeof saveCurrentCanvasToFrame === 'function') saveCurrentCanvasToFrame();
    }
    editingShape = null;
    lastShape = null;
    beforeShapeImg = null;
    grabbedIdx = -1;
    const btn = document.getElementById('tool-transform');
    if (btn) btn.style.border = 'none';
  }

  // Interceptar cambio de herramienta y limpieza de lienzo para salir siempre de Transformar
  const prevSetTool = window.setAnimTool;
  window.setAnimTool = function(t) {
    finishTransform();
    if (typeof prevSetTool === 'function') prevSetTool(t);
  };

  const prevClear = window.clearCanvas;
  window.clearCanvas = function() {
    editingShape = null; lastShape = null; beforeShapeImg = null; grabbedIdx = -1;
    if (typeof prevClear === 'function') prevClear();
  };

  window.activateTransformTool = function() {
    if (editingShape) {
      finishTransform();
      window.setAnimTool('pencil');
      return;
    }
    if (!lastShape || !beforeShapeImg) {
      alert("Dibuja primero un Cuadrado o un Círculo y después tocá Transformar.");
      return;
    }
    animTool = 'transform';
    document.querySelectorAll('[id^="tool-"]').forEach(b => b.style.border = 'none');
    const btn = document.getElementById('tool-transform');
    if (btn) btn.style.border = '2px solid #c084fc';

    editingShape = JSON.parse(JSON.stringify(lastShape));
    ctx.putImageData(beforeShapeImg, 0, 0);
    drawWickShape(ctx, editingShape, true);
  };

  canvas.addEventListener('mousedown', function(e) {
    if (animTool !== 'transform') {
      if (editingShape) finishTransform();
      return;
    }
    if (editingShape) {
      const p = getPos(e);
      grabbedIdx = -1;
      for (let i = 0; i < editingShape.pts.length; i++) {
        const pt = editingShape.pts.at(i);
        if (Math.abs(p.x - pt.x) <= 18 && Math.abs(p.y - pt.y) <= 18) {
          grabbedIdx = i;
          break;
        }
      }
      if (grabbedIdx === -1) {
        const xs = editingShape.pts.map(pt => pt.x);
        const ys = editingShape.pts.map(pt => pt.y);
        if (p.x >= Math.min(...xs) && p.x <= Math.max(...xs) && p.y >= Math.min(...ys) && p.y <= Math.max(...ys)) {
          grabbedIdx = 99;
          ox = p.x;
          oy = p.y;
        } else {
          finishTransform();
          window.setAnimTool('pencil');
        }
      }
      e.stopImmediatePropagation();
    }
  }, true);

  canvas.addEventListener('mousemove', function(e) {
    if (animTool !== 'transform' || !editingShape || grabbedIdx === -1) return;
    const p = getPos(e);
    if (grabbedIdx >= 0 && grabbedIdx <= 3) {
      const pt = editingShape.pts.at(grabbedIdx);
      pt.x = p.x;
      pt.y = p.y;
      if (editingShape.type === 'circle') {
        if (grabbedIdx === 0 || grabbedIdx === 2) {
          editingShape.pts.at(0).x = p.x;
          editingShape.pts.at(2).x = p.x;
        } else {
          editingShape.pts.at(1).y = p.y;
          editingShape.pts.at(3).y = p.y;
        }
      }
    } else if (grabbedIdx === 99) {
      const dx = p.x - ox, dy = p.y - oy;
      editingShape.pts.forEach(pt => { pt.x += dx; pt.y += dy; });
      ox = p.x; oy = p.y;
    }
    ctx.putImageData(beforeShapeImg, 0, 0);
    drawWickShape(ctx, editingShape, true);
    e.stopImmediatePropagation();
  }, true);

  canvas.addEventListener('mouseup', function(e) {
    if (animTool === 'transform' && editingShape && grabbedIdx !== -1) {
      grabbedIdx = -1;
      e.stopImmediatePropagation();
      return;
    }
    if (isDrawing && (animTool === 'rect' || animTool === 'circle')) {
      const p = getPos(e);
      if (Math.abs(p.x - startX) > 3 || Math.abs(p.y - startY) > 3) {
        beforeShapeImg = snapshot;
        const pts = (animTool === 'rect')
          ? [
              { x: startX, y: startY },
              { x: p.x, y: startY },
              { x: p.x, y: p.y },
              { x: startX, y: p.y }
            ]
          : [
              { x: (startX + p.x) / 2, y: startY },
              { x: p.x, y: (startY + p.y) / 2 },
              { x: (startX + p.x) / 2, y: p.y },
              { x: startX, y: (startY + p.y) / 2 }
            ];
        lastShape = {
          type: animTool,
          pts: pts,
          color: document.getElementById('brushColor').value,
          size: parseInt(document.getElementById('brushSize').value)
        };
      }
    }
  }, true);
})();
