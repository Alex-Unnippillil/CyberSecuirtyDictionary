const accessDate = new Date().toISOString().split('T')[0];

function linkify(text, date = accessDate) {
  if (!text) return '';
  return text
    .replace(/\bRFC\s(\d{3,4})\b/g, (_, num) =>
      `<a href="https://www.rfc-editor.org/rfc/rfc${num}.html">RFC ${num}</a> (accessed ${date})`
    )
    .replace(/\bNIST\sSP\s([0-9]+-[0-9A-Za-z]+)\b/gi, (_, id) => {
      const slug = id.toLowerCase();
      return `<a href="https://csrc.nist.gov/publications/detail/sp/${slug}/final">NIST SP ${id.toUpperCase()}</a> (accessed ${date})`;
    })
    .replace(/\bISO\/IEC\s(\d+)\b/g, (_, num) =>
      `<a href="https://www.iso.org/obp/ui/#iso:std:iso-iec:${num}:en">ISO/IEC ${num}</a> (accessed ${date})`
    );
}

function extractUrls(text, date = accessDate) {
  const urls = [];
  if (!text) return urls;
  text.replace(/\bRFC\s(\d{3,4})\b/g, (_, num) => {
    urls.push(`https://www.rfc-editor.org/rfc/rfc${num}.html`);
    return '';
  });
  text.replace(/\bNIST\sSP\s([0-9]+-[0-9A-Za-z]+)\b/gi, (_, id) => {
    urls.push(`https://csrc.nist.gov/publications/detail/sp/${id.toLowerCase()}/final`);
    return '';
  });
  text.replace(/\bISO\/IEC\s(\d+)\b/g, (_, num) => {
    urls.push(`https://www.iso.org/obp/ui/#iso:std:iso-iec:${num}:en`);
    return '';
  });
  return urls;
}

module.exports = { linkify, extractUrls, accessDate };
