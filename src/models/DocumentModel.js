import { CANVAS, EVENTS } from '../core/constants.js';

export class DocumentModel {
  constructor(bus) {
    this.bus = bus;
    this.state = {
      width: CANVAS.DEFAULT_WIDTH,
      height: CANVAS.DEFAULT_HEIGHT,
      points: [],
    };
  }

  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }

  restore(state) {
    this.state = { ...this.state, ...state };
    this.bus.emit(EVENTS.DOCUMENT_CHANGED, this.getState());
  }

  resetToDemo() {
    this.state.points = [
      { x: 200, y: 300 },
      { x: 350, y: 200 },
      { x: 500, y: 350 },
      { x: 650, y: 150 },
      { x: 800, y: 400 },
    ];
    this.bus.emit(EVENTS.DOCUMENT_CHANGED, this.getState());
  }

  addPoint(point) {
    this.state.points.push({ ...point });
    this.bus.emit(EVENTS.DOCUMENT_CHANGED, this.getState());
  }

  removeLastPoint() {
    if (this.state.points.length === 0) return;
    this.state.points.pop();
    this.bus.emit(EVENTS.DOCUMENT_CHANGED, this.getState());
  }

  clear() {
    this.state.points = [];
    this.bus.emit(EVENTS.DOCUMENT_CHANGED, this.getState());
  }
}