function tokenize(text) {
  return text.split(/(\s+)/).filter(t => t.length > 0);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function diffTokens(oldTokens, newTokens) {
  const dp = Array.from({ length: oldTokens.length + 1 }, () =>
    Array(newTokens.length + 1).fill(0)
  );
  for (let i = 1; i <= oldTokens.length; i++) {
    for (let j = 1; j <= newTokens.length; j++) {
      if (oldTokens[i - 1] === newTokens[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  const diff = [];
  let i = oldTokens.length;
  let j = newTokens.length;
  while (i > 0 && j > 0) {
    if (oldTokens[i - 1] === newTokens[j - 1]) {
      diff.unshift({ type: 'same', text: oldTokens[i - 1] });
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      diff.unshift({ type: 'removed', text: oldTokens[i - 1] });
      i--;
    } else {
      diff.unshift({ type: 'added', text: newTokens[j - 1] });
      j--;
    }
  }
  while (i > 0) {
    diff.unshift({ type: 'removed', text: oldTokens[i - 1] });
    i--;
  }
  while (j > 0) {
    diff.unshift({ type: 'added', text: newTokens[j - 1] });
    j--;
  }
  return diff;
}

function generateDiff(oldText, newText) {
  const oldTokens = tokenize(oldText);
  const newTokens = tokenize(newText);
  const diff = diffTokens(oldTokens, newTokens);
  const htmlParts = [];
  diff.forEach((part, idx) => {
    const next = diff[idx + 1];
    const text = escapeHtml(part.text);
    let token = text;
    if (part.type === 'added') {
      token = `<span class="diff-added">${text}</span>`;
    } else if (part.type === 'removed') {
      token = `<span class="diff-removed">${text}</span>`;
    }
    htmlParts.push(token);
    if (
      next &&
      !/\s/.test(next.text[0]) &&
      (part.type === 'added' || part.type === 'removed') &&
      (next.type === 'added' || next.type === 'removed')
    ) {
      htmlParts.push(' ');
    }
  });
  return htmlParts.join('');
}

if (typeof module !== 'undefined') {
  module.exports = { generateDiff };
}

