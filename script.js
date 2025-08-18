const termsList = document.getElementById('terms-list');
const definitionContainer = document.getElementById('definition-container');
const searchInput = document.getElementById('search');
const alphaNav = document.getElementById('alpha-nav');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
const quizBtn = document.getElementById('quiz-btn');
const quizContainer = document.getElementById('quiz-container');

let currentLetterFilter = 'All';
let termsData = { terms: [] };
const QUIZ_TOTAL = 5; // configurable number of quiz questions
let quizScore = 0;
let quizCount = 0;

// Apply persisted theme preference
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

// Toggle dark mode and store the preference
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Fetch terms and initialize
document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      termsData = data;
      removeDuplicateTermsAndDefinitions();
      buildAlphaNav();
      populateTermsList();
    })
    .catch((error) => {
      definitionContainer.style.display = 'block';
      definitionContainer.textContent = 'Failed to load dictionary data.';
      console.error('Error fetching data:', error);
    });
});

function removeDuplicateTermsAndDefinitions() {
  const uniqueTerms = new Set();
  const uniqueTermsData = [];

  termsData.terms.forEach((item) => {
    const lowerCaseTerm = item.term.toLowerCase();
    if (!uniqueTerms.has(lowerCaseTerm)) {
      uniqueTerms.add(lowerCaseTerm);
      uniqueTermsData.push(item);
    }
  });

  termsData.terms = uniqueTermsData;
}

function highlightActiveButton(button) {
  alphaNav.querySelectorAll('button').forEach((btn) => btn.classList.remove('active'));
  button.classList.add('active');
}

function buildAlphaNav() {
  const letters = Array.from(
    new Set(termsData.terms.map((t) => t.term.charAt(0).toUpperCase()))
  ).sort();

  const allButton = document.createElement('button');
  allButton.textContent = 'All';
  allButton.addEventListener('click', () => {
    currentLetterFilter = 'All';
    highlightActiveButton(allButton);
    populateTermsList();
  });
  alphaNav.appendChild(allButton);

  letters.forEach((letter) => {
    const btn = document.createElement('button');
    btn.textContent = letter;
    btn.addEventListener('click', () => {
      currentLetterFilter = letter;
      highlightActiveButton(btn);
      populateTermsList();
    });
    alphaNav.appendChild(btn);
  });

  highlightActiveButton(allButton);
}

function populateTermsList() {
  termsList.innerHTML = '';
  const searchValue = searchInput.value.trim().toLowerCase();

  termsData.terms.forEach((term) => {
    if (isMatchingTerm(term)) {
      const listItem = document.createElement('li');
      if (searchValue) {
        const termText = term.term;
        const index = termText.toLowerCase().indexOf(searchValue);
        const before = termText.slice(0, index);
        const match = termText.slice(index, index + searchValue.length);
        const after = termText.slice(index + searchValue.length);
        listItem.innerHTML = `${before}<mark>${match}</mark>${after}`;
      } else {
        listItem.textContent = term.term;
      }
      listItem.addEventListener('click', () => {
        displayDefinition(term);
      });
      termsList.appendChild(listItem);
    }
  });
}

function isMatchingTerm(term) {
  const searchValue = searchInput.value.trim().toLowerCase();
  const matchesSearch = searchValue === '' || term.term.toLowerCase().includes(searchValue);
  const matchesLetter =
    currentLetterFilter === 'All' ||
    term.term.charAt(0).toUpperCase() === currentLetterFilter;
  return matchesSearch && matchesLetter;
}

function displayDefinition(term) {
  definitionContainer.style.display = 'block';
  definitionContainer.innerHTML = `<h3>${term.term}</h3><p>${term.definition}</p>`;
}

searchInput.addEventListener('input', populateTermsList);

// Scroll to top button
const scrollThreshold = 200;

function toggleScrollToTopBtn() {
  if (window.scrollY > scrollThreshold) {
    scrollToTopBtn.style.display = 'block';
  } else {
    scrollToTopBtn.style.display = 'none';
  }
}

window.addEventListener('scroll', toggleScrollToTopBtn);
scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

toggleScrollToTopBtn();

// Quiz functionality
quizBtn.addEventListener('click', startQuiz);

function startQuiz() {
  quizScore = 0;
  quizCount = 0;
  quizContainer.innerHTML = '';
  quizContainer.style.display = 'block';
  showNextQuestion();
}

function showNextQuestion() {
  if (quizCount >= QUIZ_TOTAL) {
    quizContainer.innerHTML = `<div class="quiz-results">You scored ${quizScore} out of ${QUIZ_TOTAL}</div>`;
    return;
  }

  quizCount++;
  const correctTerm = termsData.terms[Math.floor(Math.random() * termsData.terms.length)];

  const options = new Set([correctTerm]);
  while (options.size < Math.min(4, termsData.terms.length)) {
    options.add(termsData.terms[Math.floor(Math.random() * termsData.terms.length)]);
  }
  const optionArray = Array.from(options).sort(() => Math.random() - 0.5);

  quizContainer.innerHTML = `<div class="quiz-question">${correctTerm.definition}</div>`;
  const optionsDiv = document.createElement('div');
  optionsDiv.className = 'quiz-options';

  optionArray.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt.term;
    btn.addEventListener('click', () => {
      if (opt === correctTerm) {
        quizScore++;
      }
      showNextQuestion();
    });
    optionsDiv.appendChild(btn);
  });

  quizContainer.appendChild(optionsDiv);
}
