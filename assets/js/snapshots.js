// Snapshot management for dictionary UI
(function () {
  const snapshotNameInput = document.getElementById("snapshot-name");
  const saveSnapshotBtn = document.getElementById("save-snapshot");
  const snapshotList = document.getElementById("snapshot-list");
  const importInput = document.getElementById("import-snapshot");

  if (!snapshotNameInput || !saveSnapshotBtn || !snapshotList) {
    return;
  }

  // IndexedDB setup
  const dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open("dictionarySnapshots", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("snapshots", {
        keyPath: "id",
        autoIncrement: true,
      });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  function captureSnapshot() {
    return {
      searchValue: searchInput.value,
      currentLetterFilter,
      showFavorites: showFavoritesToggle ? showFavoritesToggle.checked : false,
      darkMode: document.body.classList.contains("dark-mode"),
      openTerm:
        definitionContainer.style.display === "block"
          ? definitionContainer.querySelector("h3")?.textContent || null
          : null,
    };
  }

  function applySnapshot(data) {
    if (!data) return;
    document.body.classList.toggle("dark-mode", !!data.darkMode);
    searchInput.value = data.searchValue || "";
    currentLetterFilter = data.currentLetterFilter || "All";
    if (showFavoritesToggle) {
      showFavoritesToggle.checked = !!data.showFavorites;
    }
    populateTermsList();
    if (data.openTerm) {
      const matched = termsData.terms.find((t) => t.term === data.openTerm);
      if (matched) {
        displayDefinition(matched);
      }
    } else {
      clearDefinition();
    }
  }

  async function saveSnapshotToDB(snapshot) {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction("snapshots", "readwrite");
      tx.objectStore("snapshots").add(snapshot);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function updateSnapshotInDB(snapshot) {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction("snapshots", "readwrite");
      tx.objectStore("snapshots").put(snapshot);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function deleteSnapshotFromDB(id) {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction("snapshots", "readwrite");
      tx.objectStore("snapshots").delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function getAllSnapshots() {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction("snapshots", "readonly");
      const req = tx.objectStore("snapshots").getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  function exportSnapshot(snapshot) {
    const dataStr = JSON.stringify(snapshot.data);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${snapshot.name || "snapshot"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function renderSnapshots() {
    const snapshots = await getAllSnapshots();
    snapshotList.innerHTML = "";
    snapshots.forEach((snap) => {
      const li = document.createElement("li");
      const nameInput = document.createElement("input");
      nameInput.value = snap.name;
      nameInput.addEventListener("change", async () => {
        snap.name = nameInput.value.trim();
        await updateSnapshotInDB(snap);
      });

      const restoreBtn = document.createElement("button");
      restoreBtn.textContent = "Restore";
      restoreBtn.addEventListener("click", () => applySnapshot(snap.data));

      const exportBtn = document.createElement("button");
      exportBtn.textContent = "Export";
      exportBtn.addEventListener("click", () => exportSnapshot(snap));

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", async () => {
        await deleteSnapshotFromDB(snap.id);
        renderSnapshots();
      });

      li.append(nameInput, restoreBtn, exportBtn, deleteBtn);
      snapshotList.appendChild(li);
    });
  }

  saveSnapshotBtn.addEventListener("click", async () => {
    const name = snapshotNameInput.value.trim() || "Snapshot";
    const snapshot = { name, data: captureSnapshot() };
    await saveSnapshotToDB(snapshot);
    snapshotNameInput.value = "";
    renderSnapshots();
  });

  if (importInput) {
    importInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        applySnapshot(data);
        const name = file.name.replace(/\.json$/, "");
        await saveSnapshotToDB({ name, data });
        renderSnapshots();
      } catch (err) {
        console.error("Failed to import snapshot", err);
      } finally {
        importInput.value = "";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", renderSnapshots);
})();
