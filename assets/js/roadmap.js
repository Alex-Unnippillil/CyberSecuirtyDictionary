async function fetchRoadmap() {
  const container = document.getElementById('roadmap');
  const repo = 'alex-unnippillil/CyberSecuirtyDictionary';

  try {
    const milestonesResponse = await fetch(`https://api.github.com/repos/${repo}/milestones?state=open`);
    const milestones = await milestonesResponse.json();

    if (!Array.isArray(milestones) || milestones.length === 0) {
      container.textContent = 'No roadmap items found.';
      return;
    }

    const fragment = document.createDocumentFragment();

    for (const milestone of milestones) {
      const section = document.createElement('section');
      const header = document.createElement('h2');
      const link = document.createElement('a');
      link.href = milestone.html_url;
      link.textContent = milestone.title;
      header.appendChild(link);
      section.appendChild(header);

      const issuesResponse = await fetch(`https://api.github.com/repos/${repo}/issues?state=open&milestone=${milestone.number}`);
      const issues = await issuesResponse.json();

      if (Array.isArray(issues) && issues.length > 0) {
        const list = document.createElement('ul');
        for (const issue of issues) {
          const item = document.createElement('li');
          const issueLink = document.createElement('a');
          issueLink.href = issue.html_url;
          issueLink.textContent = issue.title;
          item.appendChild(issueLink);
          list.appendChild(item);
        }
        section.appendChild(list);
      } else {
        const p = document.createElement('p');
        p.textContent = 'No open items.';
        section.appendChild(p);
      }

      fragment.appendChild(section);
    }

    container.textContent = '';
    container.appendChild(fragment);
  } catch (error) {
    container.textContent = 'Failed to load roadmap.';
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', fetchRoadmap);
