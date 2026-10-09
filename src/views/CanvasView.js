import { CANVAS, BRUSH } from '../core/constants.js';
import { EVENTS } from '../core/constants.js';

export class CanvasView {
  constructor(root, bus) {
    this.root = root;
    this.bus = bus;
    this.area = null;
    this.canvas = null;
    this.ctx = null;
    this.#build();
  }

  #build() {
    this.area = document.createElement('div');
    this.area.className = 'canvas-area';

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'canvas';
    this.canvas.width = CANVAS.DEFAULT_WIDTH;
    this.canvas.height = CANVAS.DEFAULT_HEIGHT;
    this.canvas.setAttribute('tabindex', '0');

    this.area.appendChild(this.canvas);
    this.root.appendChild(this.area);
    this.ctx = this.canvas.getContext('2d');
  }

  getCanvas() {
    return this.canvas;
  }

  getArea() {
    return this.area;
  }

  render(state) {
    const { points } = state;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = CANVAS.BG_COLOR;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (points.length > 1) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = BRUSH.DEFAULT_COLOR;
      this.ctx.lineWidth = BRUSH.DEFAULT_WIDTH;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        this.ctx.lineTo(points[i].x, points[i].y);
      }
      this.ctx.stroke();
    }

    points.forEach((point) => {
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, BRUSH.POINT_RADIUS + 1, 0, Math.PI * 2);
      this.ctx.fillStyle = BRUSH.POINT_STROKE;
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, BRUSH.POINT_RADIUS, 0, Math.PI * 2);
      this.ctx.fillStyle = BRUSH.POINT_FILL;
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, BRUSH.POINT_RADIUS, 0, Math.PI * 2);
      this.ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    });
  }

  toCanvasElement() {
    return this.canvas;
  }
}