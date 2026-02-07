// ===== WRITEUP PAGE FUNCTIONALITY =====
// This file handles all interactive features for writeup pages
// Imports main.js for core functionality

// ===== SPOILER FUNCTIONALITY =====
// Track if user has confirmed flag reveal for the entire page (only once)
let hasConfirmedSpoilers = false;
const spoilerVisibility = {};

// Create confirmation dialog if it doesn't exist
if (!document.getElementById('spoilerConfirmDialog')) {
  const dialog = document.createElement('div');
  dialog.id = 'spoilerConfirmDialog';
  dialog.className = 'spoiler-confirm-dialog';
  dialog.innerHTML = `
    <div class="spoiler-confirm-content">
      <p>⚠️ Are you sure you want to reveal this? Try to solve it yourself first!</p>
      <div class="spoiler-confirm-buttons">
        <button class="confirm-yes" onclick="confirmSpoilerReveal()">Yes, Show It</button>
        <button class="confirm-no" onclick="cancelSpoilerReveal()">No, Hide It</button>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
}

let currentSpoilerId = null;

window.confirmSpoilerReveal = function() {
  if (currentSpoilerId) {
    hasConfirmedSpoilers = true;
    document.getElementById(currentSpoilerId).classList.add('visible');
    const button = document.querySelector(`[data-spoiler-id="${currentSpoilerId}"]`);
    const text = button.textContent.substring(2);
    button.textContent = '🔓 ' + text;
    closeSpoilerConfirmDialog();
  }
};

window.cancelSpoilerReveal = function() {
  closeSpoilerConfirmDialog();
};

function closeSpoilerConfirmDialog() {
  document.getElementById('spoilerConfirmDialog').classList.remove('show');
  currentSpoilerId = null;
}

document.querySelectorAll('.spoiler-toggle').forEach(button => {
  button.addEventListener('click', function() {
    const spoilerId = this.getAttribute('data-spoiler-id');
    const spoilerContent = document.getElementById(spoilerId);
    const noConfirm = this.getAttribute('data-no-confirm');
    
    if (noConfirm === 'true') {
      // Skip confirmation, just toggle visibility without changing button text
      spoilerContent.classList.toggle('visible');
    } else if (!hasConfirmedSpoilers) {
      // First spoiler reveal on page - show confirmation once
      currentSpoilerId = spoilerId;
      document.getElementById('spoilerConfirmDialog').classList.add('show');
    } else {
      // Already confirmed once - just toggle visibility
      spoilerContent.classList.toggle('visible');
      const isVisible = spoilerContent.classList.contains('visible');
      const text = this.textContent.substring(2);
      this.textContent = (isVisible ? '🔓' : '🔒') + ' ' + text;
    }
  });
});

// ===== INLINE SPOILER TOGGLES =====
function initInlineSpoilers() {
  const toggles = document.querySelectorAll('.inline-spoiler-toggle[data-inline-target]');
  if (!toggles.length) return;

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const targetIds = (toggle.getAttribute('data-inline-target') || '')
        .split(/[\s,]+/)
        .filter(Boolean);
      if (!targetIds.length) return;

      const targets = targetIds
        .map((targetId) => document.getElementById(targetId))
        .filter(Boolean);
      if (!targets.length) return;

      const shouldReveal = targets.some((target) => target.hasAttribute('hidden'));
      if (!shouldReveal) return;

      targets.forEach((target) => target.removeAttribute('hidden'));
      toggle.setAttribute('hidden', '');

      const hideHandler = () => {
        targets.forEach((target) => target.setAttribute('hidden', ''));
        toggle.removeAttribute('hidden');
      };

      targets.forEach((target) => {
        target.addEventListener('click', hideHandler, { once: true });
      });
    });
  });
}

// ===== IMAGE ZOOM FUNCTIONALITY =====
// Create modal element if it doesn't exist
if (!document.getElementById('imageModal')) {
  const modal = document.createElement('div');
  modal.id = 'imageModal';
  modal.className = 'image-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <img class="modal-image" id="modalImage" src="" alt="Zoomed image">
    </div>
  `;
  document.body.appendChild(modal);
}

window.openImageModal = function(img) {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  modalImage.src = img.src;
  modal.classList.add('show');
};

window.closeImageModal = function() {
  const modal = document.getElementById('imageModal');
  modal.classList.remove('show');
};

// Close modal when clicking outside the image
document.getElementById('imageModal')?.addEventListener('click', function(e) {
  if (e.target === this) {
    closeImageModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeImageModal();
  }
});

// ===== LOAD BANNER IMAGE FROM WRITEUPS.JSON =====
async function loadBannerImage() {
  const writeupHero = document.querySelector('.writeup-hero');
  console.log('loadBannerImage called, writeup-hero found:', !!writeupHero);
  
  if (!writeupHero) return;

  try {
    const response = await fetch('/data/writeups.json');
    console.log('Fetch response status:', response.status);
    
    if (!response.ok) throw new Error('Failed to fetch writeups.json');
    
    const writeups = await response.json();
    console.log('Writeups loaded:', writeups);
    
    const currentPage = window.location.pathname.split('/').filter(Boolean).pop();
    console.log('Current page:', currentPage);
    
    const currentWriteup = writeups.find(writeup => 
      writeup.path.endsWith(currentPage) || 
      writeup.path.includes(currentPage.replace('.html', ''))
    );
    
    console.log('Current writeup found:', currentWriteup);
    
    if (currentWriteup && currentWriteup.bannerImage) {
      const imageUrl = currentWriteup.bannerImage;
      console.log('Setting background-image to:', imageUrl);
      writeupHero.style.backgroundImage = `url('${imageUrl}')`;
      writeupHero.style.backgroundSize = 'cover';
      writeupHero.style.backgroundPosition = 'center';
      console.log('Background image set, computed style:', window.getComputedStyle(writeupHero).backgroundImage);
    } else {
      console.log('No banner image in writeup data');
    }
  } catch (error) {
    console.error('Error loading banner image:', error);
  }
}

// Call on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadBannerImage);
} else {
  loadBannerImage();
}

function loadIframeTextBlocks() {
  const blocks = document.querySelectorAll('.iframe-list-class[data-src]');
  if (!blocks.length) return;

  blocks.forEach(async (block) => {
    const src = block.getAttribute('data-src');
    if (!src) return;

    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error(`Failed to load ${src}`);
      const text = await response.text();
      block.textContent = text;
    } catch (error) {
      block.textContent = 'Unable to load content.';
      console.error('Error loading text block:', error);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadIframeTextBlocks);
} else {
  loadIframeTextBlocks();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInlineSpoilers);
} else {
  initInlineSpoilers();
}
