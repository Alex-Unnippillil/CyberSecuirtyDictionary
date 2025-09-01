export function collectData() {
  const settings = {
    darkMode: localStorage.getItem('darkMode') === 'true',
    favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
  };
  const notes = JSON.parse(localStorage.getItem('notes') || '{}');
  return { settings, notes };
}

export function exportToJSON() {
  return JSON.stringify(collectData(), null, 2);
}

export function downloadExport(filename = 'cyber-dictionary-data.json') {
  const blob = new Blob([exportToJSON()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function readImport(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function diffExport(current, incoming) {
  return [
    'Current Data:',
    JSON.stringify(current, null, 2),
    'Incoming Data:',
    JSON.stringify(incoming, null, 2),
  ].join('\n\n');
}

export function applyImport(data) {
  localStorage.setItem('darkMode', String(data.settings.darkMode));
  localStorage.setItem('favorites', JSON.stringify(data.settings.favorites));
  localStorage.setItem('notes', JSON.stringify(data.notes));
}
