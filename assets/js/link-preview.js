const linkPreviewCache = new Map();
let previewCard;

function createPreviewCard() {
  previewCard = document.createElement('div');
  previewCard.className = 'link-preview-card';
  previewCard.style.display = 'none';
  document.body.appendChild(previewCard);
}

async function fetchMetadata(url) {
  if (linkPreviewCache.has(url)) {
    return linkPreviewCache.get(url);
  }
  try {
    const response = await fetch('https://r.jina.ai/' + url);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const title =
      doc.querySelector('meta[property="og:title"]')?.content ||
      doc.title ||
      url;
    const description =
      doc.querySelector('meta[property="og:description"], meta[name="description"]')?.content ||
      '';
    const image = doc.querySelector('meta[property="og:image"]')?.content;
    const data = { title, description, image, url };
    linkPreviewCache.set(url, data);
    return data;
  } catch (e) {
    const data = { title: url, description: '', url };
    linkPreviewCache.set(url, data);
    return data;
  }
}

function showPreviewCard(metadata, x, y) {
  if (!previewCard) {
    createPreviewCard();
  }
  previewCard.innerHTML = '';
  if (metadata.image) {
    const img = document.createElement('img');
    img.src = metadata.image;
    previewCard.appendChild(img);
  }
  const titleEl = document.createElement('strong');
  titleEl.textContent = metadata.title;
  previewCard.appendChild(titleEl);
  if (metadata.description) {
    const p = document.createElement('p');
    p.textContent = metadata.description;
    previewCard.appendChild(p);
  }
  previewCard.style.left = `${x + 12}px`;
  previewCard.style.top = `${y + 12}px`;
  previewCard.style.display = 'block';
}

function hidePreviewCard() {
  if (previewCard) {
    previewCard.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('mouseover', async (event) => {
    const anchor = event.target.closest('a');
    if (!anchor || !anchor.href) {
      return;
    }
    const url = anchor.href;
    const metadata = await fetchMetadata(url);
    showPreviewCard(metadata, event.pageX, event.pageY);

    const moveHandler = (e) => {
      showPreviewCard(metadata, e.pageX, e.pageY);
    };
    anchor.addEventListener('mousemove', moveHandler);
    anchor.addEventListener(
      'mouseleave',
      () => {
        hidePreviewCard();
        anchor.removeEventListener('mousemove', moveHandler);
      },
      { once: true }
    );
  });
});
