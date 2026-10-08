import { STORAGE_KEYS } from '../core/constants.js';

export class StorageService {
  saveDocument(payload) {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCUMENT, JSON.stringify(payload));
    } catch (e) {
      console.warn('Не удалось сохранить в localStorage', e);
    }
  }

  loadDocument() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENT);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('Не удалось прочитать localStorage', e);
      return null;
    }
  }

  downloadProject(payload) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    this.#download(blob, `inkflow-project-${Date.now()}.inkflow.json`);
  }

  pickAndLoadProject() {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,application/json';
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) return reject(new Error('Файл не выбран'));
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const data = JSON.parse(reader.result);
            if (!data.document || !data.tool) {
              throw new Error('Некорректный формат проекта');
            }
            resolve(data);
          } catch (e) {
            reject(e);
          }
        };
        reader.onerror = () => reject(new Error('Ошибка чтения файла'));
        reader.readAsText(file);
      };
      input.click();
    });
  }

  #download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
}