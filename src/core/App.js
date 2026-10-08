import { EventBus } from './EventBus.js';
import { DocumentModel } from '../models/DocumentModel.js';
import { ToolModel } from '../models/ToolModel.js';
import { CanvasView } from '../views/CanvasView.js';
import { PanelsView } from '../views/PanelsView.js';
import { StatusBarView } from '../views/StatusBarView.js';
import { CanvasController } from '../controllers/CanvasController.js';
import { PanelsController } from '../controllers/PanelsController.js';
import { StorageService } from '../services/StorageService.js';
import { ExportService } from '../services/ExportService.js';
import { ToolFactory } from '../tools/ToolFactory.js';
import { EVENTS } from './constants.js';

export class App {
  constructor(rootEl) {
    this.root = rootEl;
    this.bus = new EventBus();
    this.storage = new StorageService();
    this.exporter = new ExportService();

    this.document = new DocumentModel(this.bus);
    this.tool = new ToolModel(this.bus);

    this.toolFactory = new ToolFactory(this.document, this.tool, this.bus);

    this.canvasView = null;
    this.panelsView = null;
    this.statusView = null;

    this.canvasController = null;
    this.panelsController = null;
  }

  start() {
    this.#restoreState();

    const root = this.root;
    root.classList.add('app');

    this.canvasView = new CanvasView(root, this.bus);
    this.statusView = new StatusBarView(root, this.bus);
    this.panelsView = new PanelsView(root, this.bus, this.toolFactory);

    this.canvasController = new CanvasController(
      this.canvasView,
      this.document,
      this.tool,
      this.toolFactory,
      this.bus
    );

      this.panelsController = new PanelsController(
          this.panelsView,
          this.document,
          this.tool,
          this.storage,
          this.exporter,
          this.bus,
          this.toolFactory
      );

    this.canvasView.render(this.document.getState());
    this.panelsView.update(this.tool.getState());
    this.statusView.update(this.document.getState(), this.tool.getState());

    this.#bindPersistence();

    this.bus.emit(EVENTS.STATUS_UPDATED, {
      document: this.document.getState(),
      tool: this.tool.getState(),
    });
  }

  #restoreState() {
    const saved = this.storage.loadDocument();
    if (saved) {
      this.document.restore(saved.document);
      this.tool.restore(saved.tool);
    } else {
      this.document.resetToDemo();
    }
  }

  #bindPersistence() {
    const persist = () => {
      this.storage.saveDocument({
        document: this.document.getState(),
        tool: this.tool.getState(),
      });
    };
    this.bus.on(EVENTS.DOCUMENT_CHANGED, persist);
    this.bus.on(EVENTS.TOOL_CHANGED, persist);
    this.bus.on(EVENTS.BRUSH_PARAMS_CHANGED, persist);
  }
}