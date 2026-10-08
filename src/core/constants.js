export const APP_NAME = 'Fairy Brush';
export const APP_VERSION = '0.1.0';

export const CANVAS = {
  DEFAULT_WIDTH: 1024,
  DEFAULT_HEIGHT: 768,
  BG_COLOR: '#ffffff',
};

export const BRUSH = {
  DEFAULT_WIDTH: 3,
  DEFAULT_COLOR: '#2c3e50',
  POINT_RADIUS: 5,
  POINT_FILL: '#e74c3c',
  POINT_STROKE: '#ffffff',
};

export const STORAGE_KEYS = {
  DOCUMENT: 'inkflow:document:v1',
  SETTINGS: 'inkflow:settings:v1',
};

export const EVENTS = {
  DOCUMENT_CHANGED: 'document:changed',
  TOOL_CHANGED: 'tool:changed',
  BRUSH_PARAMS_CHANGED: 'brush:params-changed',
  PANEL_ORIENTATION_CHANGED: 'panels:orientation-changed',
  STATUS_UPDATED: 'status:updated',
};