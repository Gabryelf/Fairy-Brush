export class StatusBarView {
    constructor(root, bus) {
      this.root = root;
      this.bus = bus;
      this.el = null;
      this.#build();
    }
  
    #build() {
      this.el = document.createElement('div');
      this.el.className = 'statusbar';
      this.el.innerHTML = `
        <span>Точек: <b data-role="points">0</b></span>
        <span>Кисть: <b data-role="brush">ширина 3px</b></span>
        <span>Инструмент: <b data-role="tool">brush</b></span>
      `;
      this.root.appendChild(this.el);
    }
  
    update(documentState, toolState) {
      this.el.querySelector('[data-role="points"]').textContent = documentState.points.length;
      this.el.querySelector('[data-role="brush"]').textContent = `ширина ${toolState.brush.width}px`;
      this.el.querySelector('[data-role="tool"]').textContent = toolState.activeTool;
    }
  }