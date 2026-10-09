import { BrushTool } from './BrushTool.js';

export class ToolFactory {
  constructor(documentModel, toolModel, bus) {
    this.document = documentModel;
    this.tool = toolModel;
    this.bus = bus;

    this.registry = new Map();
    this.#registerDefaults();
  }

  #registerDefaults() {
    this.register('brush', BrushTool);
  }

  register(name, ToolClass) {
    this.registry.set(name, ToolClass);
  }

  create(name) {
    const ToolClass = this.registry.get(name);
    if (!ToolClass) {
      throw new Error(`Tool "${name}" not registered`);
    }
    return new ToolClass(this.tool, this.bus);
  }

  list() {
    return [...this.registry.keys()];
  }
}