---
layout: default
---

<!-- HERO IMAGE -->
<section class="hero-image-section">
  <video class="hero-image" autoplay muted loop playsinline>
    <source src="{{ '/assets/images/hero-banner.mp4' | relative_url }}" type="video/mp4">
  </video>
  <div class="hero-image-overlay"></div>
  <div class="hero-image-content">
    <h1>voidwr</h1>
    <p class="hero-code-typing">
      <span class="hero-code-prefix">kali@kali$&gt;</span>
      <span class="hero-code-dynamic" data-commands='[{"text":"nmap -sC -sV -oA recon target.local","prefix":true},{"text":"gobuster dir -u http://target.local -w wordlist.txt","prefix":true},{"text":"ffuf -u http://target.local/FUZZ -w common.txt","prefix":true},{"text":"sqlmap -u http://target.local/login --batch","prefix":true},{"text":"ssh user@target.local -p 22","prefix":true},{"text":"nikto -h http://target.local","prefix":true},{"text":"mainframe hacked","prefix":false},{"text":"kernel.panic","prefix":false},{"text":"access granted","prefix":false},{"text":"payload delivered","prefix":false},{"text":"the quieter you become, the more you are able to hear","prefix":false}]'>nmap -sC -sV -oA recon target.local</span>
    </p>
  </div>
</section>

<!-- HERO -->
<section class="hero">
  <div class="hero-content">
    <div class="hero-image-frame">
      <img src="{{ '/assets/images/profile.jpg' | relative_url }}" alt="voidwr profile" class="hero-profile-img">
    </div>
    <div class="hero-text">
      <h1>voidwr</h1>
      <p class="tagline">Cybersecurity Writeups & CTF Solutions</p>
      <p class="description">In-depth solutions, techniques, and learnings from Capture The Flag competitions and security challenges</p>
      <a href="#writeups" class="cta-button">Explore Writeups</a>
    </div>
  </div>
</section>

<!-- STATS -->
<section class="stats-section">
  <div class="container">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">{{ site.writeups | size }}</div>
        <div class="stat-label">Writeups</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">2026</div>
        <div class="stat-label">Year Active</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">CTF</div>
        <div class="stat-label">Focused</div>
      </div>
    </div>
  </div>
</section>

<!-- FEATURED -->
<section class="featured-section" id="writeups">
  <div class="container">
    <h2>Latest Writeups</h2>
    <div class="featured-grid">
      {% for writeup in site.writeups limit:1 %}
      <a href="{{ writeup.url | relative_url }}" class="featured-card">
        <div class="card-label">{{ writeup.platform }}</div>
        <h3>{{ writeup.title }}</h3>
        <p class="card-date">{{ writeup.date | date: "%b %d, %Y" }}</p>
        <p class="card-desc">{{ writeup.excerpt | strip_html }}</p>
        <span class="card-arrow">→</span>
      </a>
      {% endfor %}
    </div>
  </div>
</section>

<!-- UPCOMING -->
<section class="upcoming-section">
  <div class="container">
    <h2>Coming Soon</h2>
    <p class="section-subtitle">Writeups in progress and planned for the future</p>
    <div class="upcoming-grid">
      <div class="upcoming-card">
        <div class="card-label upcoming-label">HTB</div>
        <h3>Photobomb</h3>
        <p class="card-status">In Progress</p>
        <p class="card-desc">Web challenge exploitation techniques</p>
      </div>
      <div class="upcoming-card">
        <div class="card-label upcoming-label">TryHackMe</div>
        <h3>Linux Privilege Escalation</h3>
        <p class="card-status">Planned</p>
        <p class="card-desc">Complete methodology and common vectors</p>
      </div>
      <div class="upcoming-card">
        <div class="card-label upcoming-label">CTF</div>
        <h3>PicoCTF 2026</h3>
        <p class="card-status">Planned</p>
        <p class="card-desc">Selected challenges and solutions</p>
      </div>
    </div>
  </div>
</section>
