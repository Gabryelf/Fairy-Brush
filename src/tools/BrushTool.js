import { BaseTool } from './BaseTool.js';

export class BrushTool extends BaseTool {
  onPointerDown(point, document) {
    document.addPoint(point);
  }

  onSecondary(document) {
    document.removeLastPoint();
  }
}