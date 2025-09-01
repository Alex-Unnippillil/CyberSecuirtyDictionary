function switchTab(selected) {
  document.querySelectorAll('.tab-buttons [role="tab"]').forEach((btn) => {
    const active = btn.dataset.tab === selected;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", active);
  });
  document.querySelectorAll(".tab-content").forEach((panel) => {
    const show = panel.id === selected;
    panel.classList.toggle("active", show);
    panel.hidden = !show;
  });
}

document.querySelectorAll('.tab-buttons [role="tab"]').forEach((btn) => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

async function processInChunks(str, size, fn) {
  let result = "";
  for (let i = 0; i < str.length; i += size) {
    result += fn(str.slice(i, i + size));
    await new Promise((r) => setTimeout(r));
  }
  return result;
}

async function base64Encode(str) {
  return processInChunks(str, 3072, (chunk) => {
    const binary = unescape(encodeURIComponent(chunk));
    return btoa(binary);
  });
}

async function base64Decode(str) {
  return processInChunks(str, 4096, (chunk) => {
    const decoded = atob(chunk);
    return decodeURIComponent(escape(decoded));
  });
}

async function urlEncode(str) {
  return processInChunks(str, 5000, encodeURIComponent);
}

async function urlDecode(str) {
  return processInChunks(str, 5000, decodeURIComponent);
}

async function hexEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, "0");
    if (i % 1024 === 1023) {
      await new Promise((r) => setTimeout(r));
    }
  }
  return out;
}

async function hexDecode(str) {
  if (str.length % 2 !== 0 || /[^0-9a-f]/i.test(str)) {
    throw new Error("Invalid hex string");
  }
  const bytes = new Uint8Array(str.length / 2);
  for (let i = 0; i < str.length; i += 2) {
    bytes[i / 2] = parseInt(str.substr(i, 2), 16);
    if (i % 2048 === 0) {
      await new Promise((r) => setTimeout(r));
    }
  }
  return new TextDecoder().decode(bytes);
}

function setupTab(prefix, encodeFn, decodeFn) {
  const input = document.getElementById(`${prefix}-input`);
  const output = document.getElementById(`${prefix}-output`);
  const error = document.getElementById(`${prefix}-error`);
  document
    .getElementById(`${prefix}-encode`)
    .addEventListener("click", async () => {
      error.textContent = "";
      output.textContent = "";
      try {
        output.textContent = await encodeFn(input.value);
      } catch (e) {
        error.textContent = e.message;
      }
    });
  document
    .getElementById(`${prefix}-decode`)
    .addEventListener("click", async () => {
      error.textContent = "";
      output.textContent = "";
      try {
        output.textContent = await decodeFn(input.value);
      } catch (e) {
        error.textContent = e.message;
      }
    });
  document.getElementById(`${prefix}-copy`).addEventListener("click", () => {
    navigator.clipboard.writeText(output.textContent);
  });
  document.getElementById(`${prefix}-clear`).addEventListener("click", () => {
    input.value = "";
    output.textContent = "";
    error.textContent = "";
  });
}

setupTab("base64", base64Encode, base64Decode);
setupTab("url", urlEncode, urlDecode);
setupTab("hex", hexEncode, hexDecode);

switchTab("base64");
