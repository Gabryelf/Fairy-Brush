import { EVENTS } from '../core/constants.js';

export class CanvasController {
  constructor(view, documentModel, toolModel, toolFactory, bus) {
    this.view = view;
    this.document = documentModel;
    this.tool = toolModel;
    this.toolFactory = toolFactory;
    this.bus = bus;

    this.#bind();
  }

  #bind() {
    const canvas = this.view.getCanvas();

    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        const point = this.#coords(e);
        const activeTool = this.toolFactory.create(this.tool.getState().activeTool);
        activeTool.onPointerDown(point, this.document);
      } else if (e.button === 2) {
        e.preventDefault();
        const activeTool = this.toolFactory.create(this.tool.getState().activeTool);
        activeTool.onSecondary(this.document);
      }
    });

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const point = this.#coords(e.touches[0]);
      const activeTool = this.toolFactory.create(this.tool.getState().activeTool);
      activeTool.onPointerDown(point, this.document);
    }, { passive: false });

    this.bus.on(EVENTS.DOCUMENT_CHANGED, (state) => this.view.render(state));
    this.bus.on(EVENTS.BRUSH_PARAMS_CHANGED, () => this.view.render(this.document.getState()));
    this.bus.on(EVENTS.TOOL_CHANGED, (state) => {
      this.view.render(this.document.getState());
      this.bus.emit(EVENTS.STATUS_UPDATED, {
        document: this.document.getState(),
        tool: state,
      });
    });
  }

  #coords(e) {
    const canvas = this.view.getCanvas();
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    return {
      x: Math.min(Math.max(x, 0), canvas.width),
      y: Math.min(Math.max(y, 0), canvas.height),
    };
  }
}