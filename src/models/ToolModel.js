import { BRUSH, EVENTS } from '../core/constants.js';

export class ToolModel {
  constructor(bus) {
    this.bus = bus;
    this.state = {
      activeTool: 'brush',
      brush: {
        width: BRUSH.DEFAULT_WIDTH,
        color: BRUSH.DEFAULT_COLOR,
      },
      panels: {
        orientation: 'horizontal',
      },
    };
  }

  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }

  restore(state) {
    this.state = { ...this.state, ...state };
    this.bus.emit(EVENTS.TOOL_CHANGED, this.getState());
    this.bus.emit(EVENTS.BRUSH_PARAMS_CHANGED, this.state.brush);
    this.bus.emit(EVENTS.PANEL_ORIENTATION_CHANGED, this.state.panels.orientation);
  }

  setActiveTool(name) {
    this.state.activeTool = name;
    this.bus.emit(EVENTS.TOOL_CHANGED, this.getState());
  }

  setBrushWidth(width) {
    this.state.brush.width = width;
    this.bus.emit(EVENTS.BRUSH_PARAMS_CHANGED, this.state.brush);
    this.bus.emit(EVENTS.TOOL_CHANGED, this.getState());
  }

  setBrushColor(color) {
    this.state.brush.color = color;
    this.bus.emit(EVENTS.BRUSH_PARAMS_CHANGED, this.state.brush);
    this.bus.emit(EVENTS.TOOL_CHANGED, this.getState());
  }

  setPanelOrientation(orientation) {
    this.state.panels.orientation = orientation;
    this.bus.emit(EVENTS.PANEL_ORIENTATION_CHANGED, orientation);
    this.bus.emit(EVENTS.TOOL_CHANGED, this.getState());
  }
}