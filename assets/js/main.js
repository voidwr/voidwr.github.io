document.addEventListener('DOMContentLoaded', () => {
  initHeroParallax();
  initTypingHero();
  initCursorParticles();
  initHeroTips();
  initWriteupsSearch();
  loadFeaturedFromConfig();
  loadWriteupsFromConfig();
  loadUpcomingFromConfig();
});

function initHeroParallax() {
  const heroImg = document.querySelector('.hero-image');
  if (!heroImg) return;

  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    heroImg.style.transform = `translateY(${scrollPosition}px)`;
  });
}

function initTypingHero() {
  const heroCode = document.querySelector('.hero-code-dynamic');
  const heroPrefix = document.querySelector('.hero-code-prefix');

  if (!heroCode || !heroCode.dataset.commands) return;

  let commands = [];

  try {
    commands = JSON.parse(heroCode.dataset.commands);
  } catch (error) {
    commands = [];
  }

  const pickCommand = () => {
    if (!commands.length) return;
    let next = commands[Math.floor(Math.random() * commands.length)];
    const currentText = heroCode.textContent;

    if (commands.length > 1 && next.text === currentText) {
      const fallback = commands.filter((command) => command.text !== currentText);
      next = fallback[Math.floor(Math.random() * fallback.length)];
    }

    heroCode.textContent = next.text;
    heroCode.style.setProperty('--typing-width', `${Math.max(next.text.length, 10)}ch`);

    if (heroPrefix) {
      heroPrefix.style.display = next.prefix ? 'inline' : 'none';
    }
  };

  pickCommand();

  heroCode.addEventListener('animationiteration', (event) => {
    if (event.animationName === 'typing') {
      pickCommand();
    }
  });
}

function initCursorParticles() {
  const shouldEnable = document.querySelector('.hero-image-section') || document.querySelector('.writeups-container') || document.querySelector('.about-container');
  if (!shouldEnable) return;

  document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.8) {
      createParticle(e.clientX, e.clientY);
    }
  });

  function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    particle.textContent = Math.random() > 0.5 ? '●' : '▪';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.color = Math.random() > 0.5 ? '#9d4edd' : '#c77dff';
    document.body.appendChild(particle);

    let opacity = 1;
    let yPos = y;
    const interval = setInterval(() => {
      opacity -= 0.05;
      yPos -= 2;
      particle.style.opacity = opacity;
      particle.style.transform = `translateY(${yPos - y}px)`;
      if (opacity <= 0) {
        clearInterval(interval);
        particle.remove();
      }
    }, 30);
  }
}

function initHeroTips() {
  const tipElement = document.getElementById('heroTip');
  if (!tipElement) return;

  const tips = [
    'nmap -A target.com  // Always scan first',
    'gobuster dir -u target.com -w wordlist.txt',
    'nc -lvnp 1337  // Reverse shell listener ready',
    'chmod +x exploit.sh && ./exploit.sh',
    'wireshark &',
    'hydra -l admin -P passwords.txt ftp://target.com',
    'burpsuite &',
    'john --wordlist=rockyou.txt hashes.txt  // Cracked it!',
    'echo $((16#DEADBEEF))  // Hex to decimal magic',
    'The best vulnerability is the one you find first',
    'grep -r "password" .  // Secrets in comments',
    "Keep calm and sudo -l"
  ];

  function displayRandomTip() {
    const tip = tips[Math.floor(Math.random() * tips.length)];
    tipElement.textContent = "$> " + tip;
    tipElement.style.animation = 'fadeInUp 0.8s ease forwards';
  }

  displayRandomTip();
  setInterval(displayRandomTip, 8000);
}

function initWriteupsSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  const writeupItems = document.querySelectorAll('.writeups-item');
  const categories = document.querySelectorAll('.category-section, .writeups-category-section');

  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    writeupItems.forEach((item) => {
      const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
      const desc = item.querySelector('.writeups-desc')?.textContent.toLowerCase() || '';
      const tags = Array.from(item.querySelectorAll('.writeups-tag')).map((tag) => tag.textContent.toLowerCase());

      const matches = title.includes(searchTerm) || desc.includes(searchTerm) || tags.some((tag) => tag.includes(searchTerm));

      if (matches || searchTerm === '') {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });

    categories.forEach((category) => {
      const visibleItems = category.querySelectorAll('.writeups-item:not(.hidden)');
      if (visibleItems.length === 0) {
        category.classList.add('empty');
      } else {
        category.classList.remove('empty');
      }
    });
  });

  document.querySelectorAll('.writeups-tag').forEach((tag) => {
    tag.addEventListener('click', () => {
      searchInput.value = tag.textContent.toLowerCase();
      searchInput.dispatchEvent(new Event('input'));
    });
  });
}

// LOAD FEATURED WRITEUP FROM CONFIG
async function loadFeaturedFromConfig() {
  try {
    const response = await fetch('../data/writeups.json');
    const writeups = await response.json();
    
    // Get all published writeups (max 3)
    const featured = writeups.filter(wp => wp.status === 'published').slice(0, 3);
    if (featured.length === 0) return;

    const grid = document.querySelector('.featured-grid');
    if (!grid) return;

    grid.innerHTML = featured.map(wp => `
      <a href="${wp.path}" class="featured-card">
        <img src="${wp.bannerImage}" alt="${wp.title}" class="card-image">
        <div class="card-label">${wp.categoryShort}</div>
        <h3>${wp.title}</h3>
        <p class="card-date">${wp.date}</p>
        <p class="card-desc">${wp.description}</p>
        <div class="card-tags">
          ${wp.tags.map(tag => `<span class="card-tag">${tag}</span>`).join('')}
        </div>
      </a>
    `).join('');
  } catch (error) {
    console.error('Error loading featured writeup:', error);
  }
}

// LOAD WRITEUPS FROM CONFIG
async function loadWriteupsFromConfig() {
  try {
    const response = await fetch('../data/writeups.json');
    const writeups = await response.json();
    
    // Group by category
    const grouped = {};
    writeups.forEach(wp => {
      if (!grouped[wp.category]) {
        grouped[wp.category] = {
          emoji: wp.categoryEmoji,
          items: []
        };
      }
      grouped[wp.category].items.push(wp);
    });

    // Find or create container
    const container = document.querySelector('.writeups-container');
    if (!container) return;

    // Find search bar to insert after
    const searchBar = container.querySelector('.writeups-search-bar');
    
    // Remove old sections
    document.querySelectorAll('.category-section, .writeups-category-section').forEach(el => el.remove());

    // Insert new sections
    Object.entries(grouped).forEach(([category, data]) => {
      const section = document.createElement('div');
      section.className = 'writeups-category-section';
      
      const title = document.createElement('h2');
      title.className = 'writeups-category-title';
      title.textContent = `${data.emoji} ${category}`;
      section.appendChild(title);

      const list = document.createElement('div');
      list.className = 'writeups-list';

      data.items.forEach(wp => {
        const item = document.createElement('a');
        item.className = 'writeups-item';
        item.href = wp.path;
        item.innerHTML = `
          <img src="${wp.bannerImage}" alt="${wp.title}" class="writeups-item-image">
          <div class="writeups-item-body">
            <div class="writeups-label">${wp.categoryShort}</div>
            <h3>${wp.title}</h3>
            <p class="writeups-date">${wp.date}</p>
            <p class="writeups-desc">${wp.description}</p>
            <div class="writeups-tags">
              ${wp.tags.map(tag => `<span class="writeups-tag">${tag}</span>`).join('')}
            </div>
            <span class="writeups-status ${wp.status}">${wp.status === 'published' ? 'Published' : wp.status === 'in-progress' ? 'In Progress' : 'Planned'}</span>
          </div>
        `;
        list.appendChild(item);
      });

      section.appendChild(list);
      container.appendChild(section);
    });

    // Re-attach search listeners
    initWriteupsSearch();
  } catch (error) {
    console.error('Error loading writeups:', error);
  }
}

// LOAD UPCOMING FROM CONFIG
async function loadUpcomingFromConfig() {
  try {
    const response = await fetch('../data/upcoming.json');
    const upcoming = await response.json();

    const grid = document.querySelector('.upcoming-grid');
    if (!grid || !upcoming.length) return;

    grid.innerHTML = '';

    upcoming.forEach(item => {
      const card = document.createElement('div');
      card.className = 'upcoming-card';
      const statusText = item.status === 'in-progress' ? 'In Progress' : item.status === 'locked' ? 'Locked' : 'Planned';
      card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="card-image">
        <div class="card-label upcoming-label">${item.category}</div>
        <h3>${item.title}</h3>
        <p class="card-status">${statusText}</p>
        <p class="card-desc">${item.description}</p>
      `;
      grid.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading upcoming:', error);
  }
}
