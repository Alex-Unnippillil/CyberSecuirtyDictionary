(function(){
  const labs = [
    {
      name: 'Damn Vulnerable Web Application (DVWA)',
      url: 'https://dvwa.co.uk/',
      domain: 'Web',
      difficulty: 'Beginner',
      safety: 'Never expose this application to the internet.'
    },
    {
      name: 'OWASP Juice Shop',
      url: 'https://owasp.org/www-project-juice-shop/',
      domain: 'Web',
      difficulty: 'Intermediate',
      safety: 'Use the official Docker image or hosted instance.'
    },
    {
      name: 'Metasploitable 2',
      url: 'https://sourceforge.net/projects/metasploitable/',
      domain: 'Network',
      difficulty: 'Advanced',
      safety: 'Run inside an isolated virtual machine.'
    },
    {
      name: 'Hack The Box',
      url: 'https://www.hackthebox.com/',
      domain: 'CTF',
      difficulty: 'Varied',
      safety: 'Follow platform rules and guidelines.'
    },
    {
      name: 'picoCTF',
      url: 'https://picoctf.org/',
      domain: 'CTF',
      difficulty: 'Beginner',
      safety: 'Use the official challenge environment.'
    }
  ];

  const list = document.getElementById('labs-list');
  const domainFilter = document.getElementById('domain-filter');
  const difficultyFilter = document.getElementById('difficulty-filter');

  document.addEventListener('DOMContentLoaded', () => {
    populateFilters();
    renderLabs();
    domainFilter.addEventListener('change', renderLabs);
    difficultyFilter.addEventListener('change', renderLabs);
  });

  function populateFilters(){
    const domains = Array.from(new Set(labs.map(l => l.domain))).sort();
    domains.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      domainFilter.appendChild(opt);
    });

    const difficulties = Array.from(new Set(labs.map(l => l.difficulty))).sort();
    difficulties.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      difficultyFilter.appendChild(opt);
    });
  }

  function renderLabs(){
    list.innerHTML = '';
    const domainVal = domainFilter.value;
    const diffVal = difficultyFilter.value;
    labs
      .filter(lab => (!domainVal || lab.domain === domainVal) && (!diffVal || lab.difficulty === diffVal))
      .forEach(lab => {
        const li = document.createElement('li');

        const link = document.createElement('a');
        link.href = lab.url;
        link.textContent = lab.name;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        li.appendChild(link);

        const tags = document.createElement('span');
        tags.className = 'tags';
        tags.textContent = ` [${lab.domain}] [${lab.difficulty}]`;
        li.appendChild(tags);

        const note = document.createElement('p');
        note.className = 'safety-note';
        note.textContent = `Safety: ${lab.safety}`;
        li.appendChild(note);

        list.appendChild(li);
      });
  }
})();
