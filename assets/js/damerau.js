(function (global) {
  function damerauLevenshtein(a, b) {
    if (!a || !b) return Math.max((a || '').length, (b || '').length);
    const alen = a.length;
    const blen = b.length;
    const maxDist = 2;
    if (Math.abs(alen - blen) > maxDist) return maxDist + 1;
    const dp = Array.from({ length: alen + 1 }, () => new Array(blen + 1).fill(0));
    for (let i = 0; i <= alen; i++) dp[i][0] = i;
    for (let j = 0; j <= blen; j++) dp[0][j] = j;
    for (let i = 1; i <= alen; i++) {
      let rowMin = maxDist + 1;
      for (let j = 1; j <= blen; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
        if (
          i > 1 &&
          j > 1 &&
          a[i - 1] === b[j - 2] &&
          a[i - 2] === b[j - 1]
        ) {
          dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + cost);
        }
        if (dp[i][j] < rowMin) rowMin = dp[i][j];
      }
      if (rowMin > maxDist) return maxDist + 1;
    }
    return dp[alen][blen];
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = damerauLevenshtein;
  } else {
    global.damerauLevenshtein = damerauLevenshtein;
  }
})(this);
