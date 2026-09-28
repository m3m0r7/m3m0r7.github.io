import { browserView } from './browser-view.mjs';

export function createMonitorDisplay(screen) {
  const { ctx, canvas, texture } = screen;
  const font = '"Noto Sans JP", sans-serif';
  let currentView = null, signature = '';
  const portrait = new Image();
  portrait.addEventListener('load', () => { if (currentView?.kind === 'online') paint(currentView); });
  portrait.src = new URL('../assets/homepage.png', import.meta.url).href;
  function rect(x, y, width, height, radius, color) {
    ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(x, y, width, height, radius); ctx.fill();
  }
  function text(value, x, y, size, color, weight = 400) {
    ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${font}`; ctx.fillText(value, x, y);
  }
  function line(points, color, width = 2) {
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
  }
  function paint(view) {
    ctx.save(); ctx.setTransform(canvas.width / 1024, 0, 0, canvas.height / 576, 0, 0); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    rect(0, 0, 1024, 576, 0, view.kind === 'off' ? '#070c14' : '#101824');
    if (view.kind !== 'off') {
      rect(0, 0, 1024, 51, 0, '#0a101b');
      ['#ba8a74', '#c1af74', '#96ad86'].forEach((color, i) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(24 + i * 21, 24, 6, 0, Math.PI * 2); ctx.fill(); });
      rect(98, 10, 323, 41, [9, 9, 0, 0], '#202d40');
      text(view.title, 122, 32, 17, '#dde7f7'); text('×', 389, 30, 23, '#8f9eb7');
      rect(0, 51, 1024, 57, 0, '#202d40');
      line([[33, 70], [24, 79], [33, 88]], '#a0b0ca', 3); line([[24, 79], [44, 79]], '#a0b0ca', 3);
      line([[67, 70], [76, 79], [67, 88]], '#52637b', 3);
      ctx.strokeStyle = '#a0b0ca'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(107, 79, 10, .3, Math.PI * 1.8); ctx.stroke();
      line([[113, 65], [114, 75], [104, 72]], '#a0b0ca', 2);
      rect(143, 61, 785, 36, 18, '#101a2a');
      text('ⓘ', 160, 79, 20, '#8b9ab3'); text('i.mem.ooo', 191, 80, 19, '#b7c7df'); text('⋮', 972, 79, 28, '#a1b4d2');
      rect(0, 108, 1024, 1, 0, '#344158');
      if (view.kind === 'loading') {
        rect(0, 107, 630, 3, 0, '#83a8f4');
        ctx.strokeStyle = '#8baaf0'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(512, 255, 26, .3, Math.PI * 1.75); ctx.stroke();
        ctx.textAlign = 'center'; text(view.heading, 512, 336, 28, '#e0eafa'); text(view.description, 512, 384, 19, '#93a6c4');
      } else if (view.kind === 'online') {
        if (portrait.complete && portrait.naturalWidth) ctx.drawImage(portrait, 0, 109, 1024, 467);
        else { rect(0,109,1024,467,0,'#ffffff'); text('i.mem.ooo',80,230,32,'#743c51',500); }
      } else {
        line([[251, 201], [289, 201], [304, 216], [304, 259], [251, 259], [251, 201]], '#83a1cc', 3);
        line([[289, 201], [289, 217], [304, 217]], '#83a1cc', 3);
        text('·  ·', 265, 228, 22, '#83a1cc'); line([[268, 247], [281, 239], [290, 247]], '#83a1cc', 2);
        text(view.heading, 249, 308, 29, '#e5edfc', 500); text(view.description, 249, 357, 20, '#a0b4d2');
        text(view.code, 249, 407, 15, '#849abd'); rect(249, 456, 126, 43, 7, '#446cb4'); text('再読み込み', 266, 478, 17, '#f5f8ff', 500);
      }
    }
    ctx.restore(); texture.needsUpdate = true;
  }
  return {
    update(state, openingPhase) {
      const view = browserView(state, openingPhase), next = `${view.kind}:${view.code}`;
      if (signature === next) return;
      signature = next; currentView = view; paint(view);
    },
  };
}
