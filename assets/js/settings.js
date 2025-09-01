import { downloadExport, collectData, readImport, diffExport, applyImport } from './exportImport.js';

const exportBtn = document.getElementById('exportData');
const importBtn = document.getElementById('importData');
const importInput = document.getElementById('importFile');
const diffSection = document.getElementById('diffSection');
const diffPreview = document.getElementById('diffPreview');
const confirmBtn = document.getElementById('confirmImport');
const cancelBtn = document.getElementById('cancelImport');
let incomingData = null;

if (exportBtn) {
  exportBtn.addEventListener('click', () => downloadExport());
}

if (importBtn && importInput) {
  importBtn.addEventListener('click', () => importInput.click());
  importInput.addEventListener('change', async () => {
    const file = importInput.files[0];
    if (!file) return;
    try {
      incomingData = await readImport(file);
      const current = collectData();
      diffPreview.textContent = diffExport(current, incomingData);
      diffSection.style.display = 'block';
    } catch (err) {
      alert('Failed to read file');
    }
  });
}

if (confirmBtn) {
  confirmBtn.addEventListener('click', () => {
    if (incomingData) {
      applyImport(incomingData);
      diffSection.style.display = 'none';
      incomingData = null;
    }
  });
}

if (cancelBtn) {
  cancelBtn.addEventListener('click', () => {
    diffSection.style.display = 'none';
    incomingData = null;
  });
}
