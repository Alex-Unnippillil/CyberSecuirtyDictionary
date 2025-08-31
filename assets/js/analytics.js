(function(){
  const domain = 'alex-unnippillil.github.io';

  function track(eventName, props = {}) {
    if (typeof window.plausible === 'function') {
      window.plausible(eventName, { props });
    } else {
      window.plausible = window.plausible || function(){ (window.plausible.q = window.plausible.q || []).push(arguments); };
      window.plausible(eventName, { props });
    }
  }

  window.analytics = {
    trackEvent: track,
    trackSearch(query) {
      if (query) {
        track('Search', { query });
      }
    },
    trackQuizStart(quizId) {
      track('QuizStart', { quizId });
    },
    trackQuizAnswer(quizId, questionId, correct) {
      track('QuizAnswer', { quizId, questionId, correct });
    },
    trackQuizComplete(quizId, score) {
      track('QuizComplete', { quizId, score });
    }
  };
})();
