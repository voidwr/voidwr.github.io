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
    document.querySelector(`[data-spoiler-id="${currentSpoilerId}"]`).textContent = '🔓 ' + document.querySelector(`[data-spoiler-id="${currentSpoilerId}"]`).textContent.substring(2);
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
    
    if (!hasConfirmedSpoilers) {
      // First spoiler reveal on page - show confirmation once
      currentSpoilerId = spoilerId;
      document.getElementById('spoilerConfirmDialog').classList.add('show');
    } else {
      // Already confirmed once - just toggle visibility
      spoilerContent.classList.toggle('visible');
      const isVisible = spoilerContent.classList.contains('visible');
      this.textContent = (isVisible ? '🔓' : '🔒') + ' ' + this.textContent.substring(2);
    }
  });
});

// ===== IMAGE ZOOM FUNCTIONALITY =====
// Create modal element if it doesn't exist
if (!document.getElementById('imageModal')) {
  const modal = document.createElement('div');
  modal.id = 'imageModal';
  modal.className = 'image-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="modal-close" onclick="closeImageModal()">&times;</span>
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
