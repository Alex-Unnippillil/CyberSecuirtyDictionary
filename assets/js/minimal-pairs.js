const minimalPairs = [
  { word1: "bit", ipa1: "/bɪt/", word2: "beat", ipa2: "/biːt/" },
  { word1: "ship", ipa1: "/ʃɪp/", word2: "sheep", ipa2: "/ʃiːp/" },
  { word1: "full", ipa1: "/fʊl/", word2: "fool", ipa2: "/fuːl/" },
];

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("pairs-list");

  minimalPairs.forEach((pair) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${pair.word1} <span class="ipa">${pair.ipa1}</span></span>
      <button type="button" class="play" data-word="${pair.word1}" aria-label="Play ${pair.word1}">▶</button>
      <span>${pair.word2} <span class="ipa">${pair.ipa2}</span></span>
      <button type="button" class="play" data-word="${pair.word2}" aria-label="Play ${pair.word2}">▶</button>
    `;
    list.appendChild(li);
  });

  list.addEventListener("click", (e) => {
    if (e.target.matches("button.play")) {
      const word = e.target.getAttribute("data-word");
      const utterance = new SpeechSynthesisUtterance(word);
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  });
});
