import { CANVAS } from '../core/constants.js';

export class ExportService {
  exportPNG(documentState, toolState) {
    const canvas = document.createElement('canvas');
    canvas.width = documentState.width;
    canvas.height = documentState.height;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = CANVAS.BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.#drawVector(ctx, documentState, toolState);

    canvas.toBlob((blob) => {
      this.#download(blob, `inkflow-${Date.now()}.png`);
    }, 'image/png');
  }

  exportSVG(documentState, toolState) {
    const { width, height, points } = documentState;
    const stroke = toolState.brush.color;
    const strokeWidth = toolState.brush.width;

    const pathData = points.length
      ? `M ${points.map((p) => `${p.x} ${p.y}`).join(' L ')}`
      : '';

    const circles = points
      .map(
        (p) =>
          `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#e74c3c" stroke="#ffffff" stroke-width="1"/>`
      )
      .join('\n');

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${CANVAS.BG_COLOR}"/>
  <path d="${pathData}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
  ${circles}
</svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    this.#download(blob, `inkflow-${Date.now()}.svg`);
  }

  #drawVector(ctx, documentState, toolState) {
    const { points } = documentState;
    const stroke = toolState.brush.color;
    const strokeWidth = toolState.brush.width;

    if (points.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    }

    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5 + 1, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#e74c3c';
      ctx.fill();
    });
  }

  #download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
}