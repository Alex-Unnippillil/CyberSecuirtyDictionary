(async function () {
  const response = await fetch("terms.json");
  const data = await response.json();
  const terms = data.terms;

  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  const nextBtn = document.getElementById("next-question");
  const typeSelect = document.getElementById("question-type");

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function newQuestion() {
    const questionType = typeSelect.value; // 'definition' or 'term'
    const correct = terms[Math.floor(Math.random() * terms.length)];
    const choices = [correct];
    while (choices.length < 4) {
      const candidate = terms[Math.floor(Math.random() * terms.length)];
      if (!choices.includes(candidate)) choices.push(candidate);
    }
    shuffle(choices);

    if (questionType === "definition") {
      questionEl.textContent = correct.definition;
    } else {
      questionEl.textContent = correct.term;
    }

    optionsEl.innerHTML = "";
    choices.forEach((choice) => {
      const btn = document.createElement("button");
      btn.className = "option-button";
      btn.textContent =
        questionType === "definition" ? choice.term : choice.definition;
      btn.addEventListener("click", () => {
        Array.from(optionsEl.children).forEach((b) => {
          b.disabled = true;
          const isCorrect =
            (questionType === "definition" && b.textContent === correct.term) ||
            (questionType === "term" && b.textContent === correct.definition);
          if (isCorrect) {
            b.classList.add("correct");
          }
          if (b === btn && !isCorrect) {
            b.classList.add("incorrect");
          }
        });
      });
      optionsEl.appendChild(btn);
    });
  }

  nextBtn.addEventListener("click", () => {
    Array.from(optionsEl.children).forEach((b) => {
      b.disabled = false;
      b.classList.remove("correct", "incorrect");
    });
    newQuestion();
  });

  typeSelect.addEventListener("change", () => {
    Array.from(optionsEl.children).forEach((b) => {
      b.disabled = false;
      b.classList.remove("correct", "incorrect");
    });
    newQuestion();
  });

  newQuestion();
})();
