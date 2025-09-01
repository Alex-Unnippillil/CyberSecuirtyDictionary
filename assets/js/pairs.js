window.addEventListener("DOMContentLoaded", () => {
  fetch("pairs.json")
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("pairs-container");
      data.pairs.forEach((pair) => {
        const pairDiv = document.createElement("div");
        pairDiv.className = "pair";

        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = "Hide Pair";

        const wordsDiv = document.createElement("div");
        wordsDiv.className = "words";

        [
          { word: pair.word1, ipa: pair.ipa1 },
          { word: pair.word2, ipa: pair.ipa2 },
        ].forEach((w) => {
          const wordDiv = document.createElement("div");
          wordDiv.className = "word";

          const termSpan = document.createElement("span");
          termSpan.className = "term";
          termSpan.textContent = w.word;

          const ipaSpan = document.createElement("span");
          ipaSpan.className = "ipa";
          ipaSpan.textContent = ` ${w.ipa}`;

          const playBtn = document.createElement("button");
          playBtn.textContent = "🔊";
          playBtn.setAttribute(
            "aria-label",
            `Play pronunciation for ${w.word}`,
          );
          playBtn.addEventListener("click", () => {
            const utterance = new SpeechSynthesisUtterance(w.word);
            speechSynthesis.speak(utterance);
          });

          wordDiv.appendChild(termSpan);
          wordDiv.appendChild(ipaSpan);
          wordDiv.appendChild(playBtn);
          wordsDiv.appendChild(wordDiv);
        });

        toggleBtn.addEventListener("click", () => {
          wordsDiv.classList.toggle("hidden");
          toggleBtn.textContent = wordsDiv.classList.contains("hidden")
            ? "Show Pair"
            : "Hide Pair";
        });

        pairDiv.appendChild(toggleBtn);
        pairDiv.appendChild(wordsDiv);
        container.appendChild(pairDiv);
      });
    })
    .catch((err) => {
      console.error("Error loading pairs:", err);
    });
});
