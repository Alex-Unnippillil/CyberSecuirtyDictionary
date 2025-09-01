(function () {
  const modeTermDefBtn = document.getElementById('mode-term-def');
  const modeDefTermBtn = document.getElementById('mode-def-term');
  const quizEl = document.getElementById('quiz');
  const questionEl = document.getElementById('question');
  const optionsEl = document.getElementById('options');
  const feedbackEl = document.getElementById('feedback');
  const scoreEl = document.getElementById('score');
  const nextBtn = document.getElementById('next');

  let terms = [];
  let mode = '';
  let current = null;
  let score = 0;
  let total = 0;

  function getPartOfSpeech(term) {
    const firstWord = term.trim().split(/\s+/)[0];
    return /ing$/i.test(firstWord) ? 'verb' : 'noun';
  }

  async function loadTerms() {
    const response = await fetch('terms.json');
    const data = await response.json();
    terms = data.terms.map((t) => ({ ...t, pos: getPartOfSpeech(t.term) }));
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function pickQuestion() {
    current = terms[Math.floor(Math.random() * terms.length)];
    const samePos = terms.filter((t) => t.pos === current.pos && t !== current);
    shuffle(samePos);
    const distractors = samePos.slice(0, 3);
    while (distractors.length < 3) {
      const candidate = terms[Math.floor(Math.random() * terms.length)];
      if (candidate !== current && !distractors.includes(candidate)) {
        distractors.push(candidate);
      }
    }
    const options = shuffle([...distractors, current]);

    questionEl.textContent =
      mode === 'term-to-definition' ? current.term : current.definition;
    optionsEl.innerHTML = '';
    options.forEach((opt) => {
      const text = mode === 'term-to-definition' ? opt.definition : opt.term;
      const btn = document.createElement('button');
      btn.textContent = text;
      btn.className = 'quiz-option';
      btn.addEventListener('click', () => handleAnswer(btn, opt === current));
      optionsEl.appendChild(btn);
    });
    feedbackEl.textContent = '';
    nextBtn.style.display = 'none';
    scoreEl.textContent = `Score: ${score}/${total}`;
  }

  function handleAnswer(button, correct) {
    Array.from(optionsEl.querySelectorAll('button')).forEach((b) => {
      b.disabled = true;
    });
    if (correct) {
      button.classList.add('correct');
      feedbackEl.textContent = 'Correct!';
      score++;
    } else {
      button.classList.add('incorrect');
      const correctText =
        mode === 'term-to-definition' ? current.definition : current.term;
      feedbackEl.textContent =
        mode === 'term-to-definition'
          ? `Incorrect! The correct definition is: ${current.definition}`
          : `Incorrect! The correct term is: ${current.term}`;
      Array.from(optionsEl.querySelectorAll('button')).forEach((b) => {
        if (b.textContent === correctText) {
          b.classList.add('correct');
        }
      });
    }
    total++;
    scoreEl.textContent = `Score: ${score}/${total}`;
    nextBtn.style.display = 'block';
  }

  async function start(selectedMode) {
    mode = selectedMode;
    score = 0;
    total = 0;
    quizEl.style.display = 'block';
    if (!terms.length) {
      await loadTerms();
    }
    pickQuestion();
  }

  modeTermDefBtn.addEventListener('click', () => start('term-to-definition'));
  modeDefTermBtn.addEventListener('click', () => start('definition-to-term'));
  nextBtn.addEventListener('click', pickQuestion);
})();
