import { EVENTS } from '../core/constants.js';

export class PanelsController {
  constructor(view, documentModel, toolModel, storage, exporter, bus, toolFactory) {
    this.view = view;
    this.document = documentModel;
    this.tool = toolModel;
    this.storage = storage;
    this.exporter = exporter;
    this.bus = bus;
    this.toolFactory = toolFactory;

    if (this.toolFactory) {
      this.view.renderTools(this.toolFactory.list());
    }

    this.#bind();
  }

  #bind() {
    this.bus.on('ui:action', ({ action }) => this.#handleAction(action));
    this.bus.on('ui:brush-width', (width) => this.tool.setBrushWidth(width));
    this.bus.on('ui:brush-color', (color) => this.tool.setBrushColor(color));

    this.bus.on(EVENTS.TOOL_CHANGED, (state) => this.view.update(state));
    this.bus.on(EVENTS.BRUSH_PARAMS_CHANGED, (state) => this.view.update(state));
    this.bus.on(EVENTS.PANEL_ORIENTATION_CHANGED, (state) => this.view.update(state));

    // клики по кнопкам инструментов внутри панели
    this.view.topPanel.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-tool]');
      if (!btn) return;
      this.tool.setActiveTool(btn.dataset.tool);
    });
  }

  async #handleAction(action) {
    switch (action) {
      case 'toggle-orientation': {
        const current = this.tool.getState().panels.orientation;
        this.tool.setPanelsOrientation(
          current === 'horizontal' ? 'vertical' : 'horizontal'
        );
        break;
      }
      case 'clear':
        this.document.clear();
        break;
      case 'save-project':
        this.storage.downloadProject({
          document: this.document.getState(),
          tool: this.tool.getState(),
        });
        break;
      case 'load-project':
        try {
          const data = await this.storage.pickAndLoadProject();
          this.document.restore(data.document);
          this.tool.restore(data.tool);
        } catch (e) {
          console.warn('Загрузка проекта отменена или не удалась:', e.message);
        }
        break;
      case 'export-png':
        this.exporter.exportPNG(this.document.getState(), this.tool.getState());
        break;
      case 'export-svg':
        this.exporter.exportSVG(this.document.getState(), this.tool.getState());
        break;
      default:
        console.warn('Неизвестное действие:', action);
    }
  }
}