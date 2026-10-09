import { EVENTS } from '../core/constants.js';
import { icons } from '../ui/icons.js';

export class PanelsView {
  constructor(root, bus, toolFactory) {
    this.root = root;
    this.bus = bus;
    this.toolFactory = toolFactory;

    this.topPanel = null;
    this.bottomPanel = null;
    this.orientationIndicator = null;

    this.controls = {};

    this.#build();
    this.#bindInternalEvents();
  }

  #build() {
    this.topPanel = document.createElement('div');
    this.topPanel.className = 'panel panel--top';

    this.topPanel.innerHTML = `
      <span class="panel__label">Инструменты</span>
      <div class="panel__tools" id="toolList"></div>
      <div class="separator"></div>
      <button class="button" data-action="toggle-orientation">
        ${icons.layout}
        <span data-role="orientation-label">Панели: горизонтально</span>
      </button>
      <div class="separator"></div>
      <button class="button button--danger" data-action="clear">
        ${icons.trash}
        Очистить
      </button>
      <div class="separator"></div>
      <button class="button" data-action="save-project">
        ${icons.save}
        Сохранить проект
      </button>
      <button class="button" data-action="load-project">
        ${icons.folder}
        Загрузить проект
      </button>
      <div class="separator"></div>
      <button class="button" data-action="export-png">
        ${icons.image}
        PNG
      </button>
      <button class="button" data-action="export-svg">
        ${icons.vector}
        SVG
      </button>
    `;

    this.bottomPanel = document.createElement('div');
    this.bottomPanel.className = 'panel panel--bottom';

    this.bottomPanel.innerHTML = `
      <span class="panel__label">Кисть</span>
      <label class="field">
        <span class="field__label">Толщина</span>
        <input type="range" min="1" max="12" value="3" data-control="brush-width" />
        <span class="field__value" data-role="brush-width-value">3</span>
      </label>
      <div class="separator"></div>
      <label class="field">
        <span class="field__label">Цвет</span>
        <input type="color" value="#2c3e50" data-control="brush-color" />
      </label>
      <div class="separator"></div>
      <span class="panel__hint">ЛКМ — точка · ПКМ — удалить последнюю</span>
    `;

    this.orientationIndicator = document.createElement('div');
    this.orientationIndicator.className = 'orientation-indicator';
    this.orientationIndicator.textContent = 'горизонтальные панели';

    this.root.appendChild(this.topPanel);
    this.root.appendChild(this.orientationIndicator);
    this.root.appendChild(this.bottomPanel);

    this.controls.brushWidth = this.bottomPanel.querySelector('[data-control="brush-width"]');
    this.controls.brushColor = this.bottomPanel.querySelector('[data-control="brush-color"]');
    this.controls.brushWidthValue = this.bottomPanel.querySelector('[data-role="brush-width-value"]');
    this.controls.orientationLabel = this.topPanel.querySelector('[data-role="orientation-label"]');
    this.controls.toolList = this.topPanel.querySelector('#toolList');
  }

  #bindInternalEvents() {
    this.topPanel.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      this.bus.emit('ui:action', { action });
    });

    this.controls.brushWidth.addEventListener('input', (e) => {
      this.controls.brushWidthValue.textContent = e.target.value;
      this.bus.emit('ui:brush-width', Number(e.target.value));
    });

    this.controls.brushColor.addEventListener('input', (e) => {
      this.bus.emit('ui:brush-color', e.target.value);
    });
  }

  renderTools(toolNames) {
    this.controls.toolList.innerHTML = toolNames
      .map(
        (name) => `
        <button class="button button--tool" data-tool="${name}">
          ${icons.brush}
          ${name}
        </button>`
      )
      .join('');
  }

  update(toolState) {
    const { brush, panels, activeTool } = toolState;

    if (this.controls.brushWidth.value !== String(brush.width)) {
      this.controls.brushWidth.value = brush.width;
      this.controls.brushWidthValue.textContent = brush.width;
    }
    if (this.controls.brushColor.value !== brush.color) {
      this.controls.brushColor.value = brush.color;
    }

    const orientation = panels.orientation;
    this.root.classList.toggle('app--vertical-panels', orientation === 'vertical');
    this.controls.orientationLabel.textContent =
      orientation === 'horizontal' ? 'Панели: горизонтально' : 'Панели: вертикально';
    this.orientationIndicator.textContent =
      orientation === 'horizontal' ? 'горизонтальные панели' : 'вертикальные панели';

    this.topPanel.querySelectorAll('[data-tool]').forEach((btn) => {
      btn.classList.toggle('button--active', btn.dataset.tool === activeTool);
    });
  }

  getOrientationIndicator() {
    return this.orientationIndicator;
  }
}