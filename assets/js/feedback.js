const owner = 'Alex-Unnippillil';
const repo = 'CyberSecuirtyDictionary';

async function sendFeedback({ page, comment } = {}) {
  const token = typeof window !== 'undefined' ? window.GITHUB_TOKEN : process.env.GITHUB_TOKEN;
  const payload = {
    title: `Feedback for ${page}`,
    body: `${comment ? comment + '\n\n' : ''}Page: ${page}`,
  };

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `token ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const remaining = response.headers.get('X-RateLimit-Remaining');
  if (response.status === 403 || response.status === 429 || remaining === '0') {
    throw new Error('rate-limit');
  }

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

function createWidget() {
  const container = document.createElement('div');
  container.id = 'feedback-widget';
  container.innerHTML = `
    <button id="feedback-toggle" type="button" aria-label="Send feedback">Feedback</button>
    <form id="feedback-form" style="display:none;">
      <label for="feedback-comment">Comment (optional)</label>
      <textarea id="feedback-comment" rows="3"></textarea>
      <button type="submit">Submit</button>
      <div id="feedback-message" role="alert"></div>
    </form>`;
  document.body.appendChild(container);

  const toggle = container.querySelector('#feedback-toggle');
  const form = container.querySelector('#feedback-form');
  const comment = container.querySelector('#feedback-comment');
  const message = container.querySelector('#feedback-message');

  toggle.addEventListener('click', () => {
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    message.textContent = 'Sending...';
    try {
      await sendFeedback({ page: window.location.href, comment: comment.value.trim() });
      message.textContent = 'Thank you for your feedback!';
      comment.value = '';
    } catch (err) {
      if (err.message === 'rate-limit') {
        message.textContent = 'Rate limit exceeded. Please try again later.';
      } else {
        message.textContent = 'Failed to send feedback.';
      }
    }
  });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
}

if (typeof module !== 'undefined') {
  module.exports = { sendFeedback };
}
