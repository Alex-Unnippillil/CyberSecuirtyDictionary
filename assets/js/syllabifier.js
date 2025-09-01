(function () {
  const input = document.getElementById("word-input");
  const output = document.getElementById("output");

  function syllabifyWord(word) {
    if (!word) return "";
    const parts = word
      .toLowerCase()
      .match(/[^aeiou]*[aeiouy]+(?:[^aeiouy\s]|(?=e\b))/gi);
    if (!parts) return word;
    const stressIndex = parts.length > 1 ? parts.length - 2 : 0;
    return parts
      .map((part, i) => (i === stressIndex ? "ˈ" + part : part))
      .join("-");
  }

  input.addEventListener("input", () => {
    const words = input.value.trim().split(/\s+/).filter(Boolean);
    const results = words.map(syllabifyWord);
    output.textContent = results.join(" ");
  });
})();
