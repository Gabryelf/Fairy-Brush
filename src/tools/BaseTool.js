export class BaseTool {
    constructor(toolModel, bus) {
      this.tool = toolModel;
      this.bus = bus;
    }
  
    onPointerDown(_point, _document) {
      throw new Error('onPointerDown not implemented');
    }
  
    onSecondary(_document) {
      throw new Error('onSecondary not implemented');
    }
  }