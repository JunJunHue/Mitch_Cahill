/**
 * edit.js — Edit Mode for Mitch Cahill Portfolio
 * ════════════════════════════════════════════════
 *
 * EDIT PASSWORD: Stern#27Pitch
 *
 * WHAT YOU CAN DO IN EDIT MODE:
 *  • Click any text to edit it directly on the page
 *  • Hover over any card → click ✏ to edit all fields
 *  • Hover over any card → click ✕ to delete it
 *  • Click "+ Add Experience / Activity / Work" to add new entries
 *  • "Export Data" → downloads an updated data.js file for permanent backup
 *  • "Reset" → restores original resume content
 *  • "Done Editing" → exits edit mode (changes are auto-saved)
 */

/* ══════════════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════════════ */
window.editState = {
  active:           false,
  pendingSection:   null,   // section for add/edit modal
  pendingId:        null,   // null = new, string = editing existing
  deleteSection:    null,
  deleteId:         null,
};

// Password: Stern#27Pitch — stored as btoa to avoid plain text
const PASS_HASH = 'U3Rlcm4jMjdQaXRjaA==';

/* ══════════════════════════════════════════════════════════
   BOOT — attach all event listeners on DOMContentLoaded
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  // Lock button
  $('edit-lock-btn')?.addEventListener('click', () => {
    editState.active ? exitEditMode() : showPasswordModal();
  });

  // Password modal
  $('pw-close')?.addEventListener('click', closePasswordModal);
  $('password-modal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closePasswordModal();
  });
  $('pw-submit')?.addEventListener('click', checkPassword);
  $('pw-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter')  checkPassword();
    if (e.key === 'Escape') closePasswordModal();
  });

  // Edit toolbar buttons
  $('export-btn')?.addEventListener('click',   exportData);
  $('reset-btn')?.addEventListener('click',    confirmReset);
  $('exit-edit-btn')?.addEventListener('click', exitEditMode);

  // "+ Add" buttons (event delegation on the whole page)
  document.addEventListener('click', e => {
    const btn = e.target.closest('.add-btn');
    if (btn && editState.active) openAddModal(btn.dataset.section);
  });

  // Card modal
  $('card-modal-close')?.addEventListener('click',  closeCardModal);
  $('card-modal-cancel')?.addEventListener('click', closeCardModal);
  $('card-modal-save')?.addEventListener('click',   saveCardModal);
  $('card-modal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeCardModal();
  });

  // Delete confirm modal
  $('confirm-cancel')?.addEventListener('click',  closeConfirmModal);
  $('confirm-delete')?.addEventListener('click',  executeDelete);
  $('confirm-modal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeConfirmModal();
  });

  // Keyboard: Escape closes any open modal
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!$('password-modal').classList.contains('hidden')) closePasswordModal();
    if (!$('card-modal').classList.contains('hidden'))     closeCardModal();
    if (!$('confirm-modal').classList.contains('hidden'))  closeConfirmModal();
  });
});

/* ══════════════════════════════════════════════════════════
   PASSWORD MODAL
══════════════════════════════════════════════════════════ */
function showPasswordModal() {
  $('pw-error').classList.add('hidden');
  $('pw-input').value = '';
  $('password-modal').classList.remove('hidden');
  setTimeout(() => $('pw-input').focus(), 80);
}

function closePasswordModal() {
  $('password-modal').classList.add('hidden');
}

function checkPassword() {
  const val = $('pw-input').value;
  if (btoa(val) === PASS_HASH) {
    closePasswordModal();
    enableEditMode();
  } else {
    $('pw-error').classList.remove('hidden');
    $('pw-input').value = '';
    $('pw-input').focus();
    // Shake the box
    const box = $('pw-modal-box');
    box.classList.remove('shake');
    void box.offsetWidth; // reflow
    box.classList.add('shake');
    setTimeout(() => box.classList.remove('shake'), 500);
  }
}

/* ══════════════════════════════════════════════════════════
   EDIT MODE ON / OFF
══════════════════════════════════════════════════════════ */
function enableEditMode() {
  editState.active = true;
  document.body.classList.add('edit-mode');
  $('edit-toolbar').classList.remove('hidden');

  // Show + Add buttons
  ['add-exp-row', 'add-lead-row', 'add-work-row'].forEach(id => {
    $(id)?.classList.remove('hidden');
  });

  attachEditableListeners();
  showToast('Edit mode active — click any text to edit it.', 'info');
}

function exitEditMode() {
  editState.active = false;
  document.body.classList.remove('edit-mode');
  $('edit-toolbar').classList.add('hidden');

  ['add-exp-row', 'add-lead-row', 'add-work-row'].forEach(id => {
    $(id)?.classList.add('hidden');
  });

  // Remove contenteditable from all fields
  document.querySelectorAll('.editable[contenteditable]').forEach(el => {
    el.removeAttribute('contenteditable');
    el.removeEventListener('click',  handleEditableClick);
    el.removeEventListener('blur',   handleEditableBlur, true);
    el.removeEventListener('keydown', handleEditableKeydown, true);
  });

  showToast('Changes saved!', 'success');
}

/* ══════════════════════════════════════════════════════════
   INLINE EDITABLE FIELDS
══════════════════════════════════════════════════════════ */
function attachEditableListeners() {
  document.querySelectorAll('.editable').forEach(el => {
    // Prevent duplicate listeners
    el.removeEventListener('click',   handleEditableClick);
    el.removeEventListener('blur',    handleEditableBlur, true);
    el.removeEventListener('keydown', handleEditableKeydown, true);

    el.addEventListener('click',   handleEditableClick);
    el.addEventListener('blur',    handleEditableBlur, true);
    el.addEventListener('keydown', handleEditableKeydown, true);
  });
}

function handleEditableClick(e) {
  if (!editState.active) return;
  const el = e.currentTarget;
  el.setAttribute('contenteditable', 'true');
  el.focus();
  // Select all on first click
  const sel = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(el);
  sel.removeAllRanges();
  sel.addRange(range);
}

function handleEditableBlur(e) {
  const el = e.target;
  if (!el.classList.contains('editable')) return;
  el.removeAttribute('contenteditable');

  const field = el.getAttribute('data-field');
  if (!field) return;

  const newValue = el.textContent.trim();
  setPath(portfolioState.data, field, newValue);
  portfolioState.save();
}

function handleEditableKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.target.blur(); }
  if (e.key === 'Escape') { e.target.blur(); }
}

/**
 * Set a deeply nested value using dot-notation path
 * e.g. setPath(data, 'experience.0.company', 'Goldman Sachs')
 */
function setPath(obj, path, value) {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (cur[parts[i]] === undefined) return;
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

/* ══════════════════════════════════════════════════════════
   CARD MODAL — ADD / EDIT
══════════════════════════════════════════════════════════ */

// Called from card's ✏ button (rendered in app.js)
function openEditCard(section, id) {
  if (!editState.active) return;
  const arr  = getSectionArray(section);
  const item = arr.find(x => x.id === id);
  if (!item) return;

  editState.pendingSection = section;
  editState.pendingId      = id;

  const cfg = buildFormConfig(section, item);
  $('card-modal-title').textContent = `Edit ${cfg.label}`;
  $('card-modal-form').innerHTML    = cfg.html;
  $('card-modal').classList.remove('hidden');
}

function openAddModal(section) {
  editState.pendingSection = section;
  editState.pendingId      = null;

  const cfg = buildFormConfig(section, null);
  $('card-modal-title').textContent = `Add ${cfg.label}`;
  $('card-modal-form').innerHTML    = cfg.html;
  $('card-modal').classList.remove('hidden');
  $('card-modal-form').querySelector('.form-input')?.focus();
}

function closeCardModal() {
  $('card-modal').classList.add('hidden');
  editState.pendingSection = null;
  editState.pendingId      = null;
}

function saveCardModal() {
  const section = editState.pendingSection;
  if (!section) return;

  const form    = $('card-modal-form');
  const newItem = readForm(section, form);

  if (!newItem) return; // validation failed

  const arr = getSectionArray(section);

  if (editState.pendingId) {
    const idx = arr.findIndex(x => x.id === editState.pendingId);
    if (idx !== -1) { newItem.id = editState.pendingId; arr[idx] = newItem; }
  } else {
    newItem.id = `${section}-${Date.now()}`;
    arr.push(newItem);
  }

  portfolioState.save();
  closeCardModal();
  renderAll();
  showToast(editState.pendingId ? 'Entry updated!' : 'Entry added!', 'success');
}

/* ── Form Configs ───────────────────────────────────────── */
function v(val) { return val ? `value="${esc(val)}"` : ''; }
function t(val) { return val ? esc(val) : ''; }

function buildFormConfig(section, item) {
  if (section === 'experience') {
    return {
      label: 'Experience',
      html: `
        <div class="form-group">
          <label class="form-label">Company Name *</label>
          <input class="form-input" name="company" placeholder="e.g. Goldman Sachs" ${v(item?.company)} required>
        </div>
        <div class="form-group">
          <label class="form-label">Your Role *</label>
          <input class="form-input" name="role" placeholder="e.g. Investment Banking Analyst" ${v(item?.role)} required>
        </div>
        <div class="form-group">
          <label class="form-label">Location</label>
          <input class="form-input" name="location" placeholder="e.g. New York, NY" ${v(item?.location)}>
        </div>
        <div class="form-group">
          <label class="form-label">Time Period</label>
          <input class="form-input" name="period" placeholder="e.g. Jun 2026 – Aug 2026" ${v(item?.period)}>
        </div>
        <div class="form-group">
          <label class="form-label">Type / Category</label>
          <input class="form-input" name="type" placeholder="e.g. Finance, Operations, Technology" ${v(item?.type)}>
        </div>
        <div class="form-group">
          <label class="form-label">Bullet Points</label>
          <span class="form-hint">One bullet per line. No need for bullet symbols.</span>
          <textarea class="form-textarea" name="bullets" placeholder="Led team of 5 analysts building equity models&#10;Increased revenue by 20% through new market entry&#10;Presented findings to senior partners weekly">${t(item?.bullets?.join('\n'))}</textarea>
        </div>
      `,
    };
  }

  if (section === 'leadership') {
    return {
      label: 'Activity',
      html: `
        <div class="form-group">
          <label class="form-label">Organization Name *</label>
          <input class="form-input" name="organization" placeholder="e.g. Finance Club" ${v(item?.organization)} required>
        </div>
        <div class="form-group">
          <label class="form-label">Your Role *</label>
          <input class="form-input" name="role" placeholder="e.g. President" ${v(item?.role)} required>
        </div>
        <div class="form-group">
          <label class="form-label">Location</label>
          <input class="form-input" name="location" placeholder="e.g. New York, NY" ${v(item?.location)}>
        </div>
        <div class="form-group">
          <label class="form-label">Time Period</label>
          <input class="form-input" name="period" placeholder="e.g. Sep 2026 – Present" ${v(item?.period)}>
        </div>
        <div class="form-group">
          <label class="form-label">Type / Category</label>
          <input class="form-input" name="type" placeholder="Finance | Product | VC/Investing | Entrepreneurship | Operations" ${v(item?.type)}>
        </div>
        <div class="form-group">
          <label class="form-label">Bullet Points</label>
          <span class="form-hint">One bullet per line.</span>
          <textarea class="form-textarea" name="bullets" placeholder="Organized weekly events for 200+ members&#10;Grew membership by 50% in one semester">${t(item?.bullets?.join('\n'))}</textarea>
        </div>
      `,
    };
  }

  if (section === 'works') {
    return {
      label: 'Published Work',
      html: `
        <div class="form-group">
          <label class="form-label">Title *</label>
          <input class="form-input" name="title" placeholder="e.g. Micron Technology: HBM3E Thesis" ${v(item?.title)} required>
        </div>
        <div class="form-group">
          <label class="form-label">Publication / Platform</label>
          <input class="form-input" name="publication" placeholder="e.g. Substack, Medium, KMF Investments" ${v(item?.publication)}>
        </div>
        <div class="form-group">
          <label class="form-label">Date</label>
          <input class="form-input" name="date" placeholder="e.g. Sep 2025" ${v(item?.date)}>
        </div>
        <div class="form-group">
          <label class="form-label">Type</label>
          <input class="form-input" name="type" placeholder="Research | Article | Paper | White Paper | Other" ${v(item?.type || 'Research')}>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-textarea" name="description" placeholder="Brief summary of what this work covers...">${t(item?.description)}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Link / URL (optional)</label>
          <input class="form-input" name="url" type="url" placeholder="https://..." ${v(item?.url)}>
          <span class="form-hint">Where readers can find this piece online.</span>
        </div>
      `,
    };
  }

  return { label: 'Entry', html: '' };
}

function readForm(section, form) {
  const get = (name) => form.querySelector(`[name="${name}"]`)?.value.trim() || '';

  const parseBullets = (raw) =>
    raw.split('\n')
       .map(b => b.replace(/^[•\-\*–]\s*/, '').trim())
       .filter(b => b.length > 0);

  if (section === 'experience') {
    if (!get('company') || !get('role')) { showToast('Company and Role are required.', 'error'); return null; }
    return { company: get('company'), role: get('role'), location: get('location'), period: get('period'), type: get('type') || 'Work', bullets: parseBullets(get('bullets')) };
  }

  if (section === 'leadership') {
    if (!get('organization') || !get('role')) { showToast('Organization and Role are required.', 'error'); return null; }
    return { organization: get('organization'), role: get('role'), location: get('location'), period: get('period'), type: get('type') || 'Club', bullets: parseBullets(get('bullets')) };
  }

  if (section === 'works') {
    if (!get('title')) { showToast('Title is required.', 'error'); return null; }
    return { title: get('title'), publication: get('publication'), date: get('date'), type: get('type') || 'Research', description: get('description'), url: get('url') };
  }

  return null;
}

/* ══════════════════════════════════════════════════════════
   DELETE
══════════════════════════════════════════════════════════ */
function confirmDeleteCard(section, id) {
  if (!editState.active) return;
  editState.deleteSection = section;
  editState.deleteId      = id;
  $('confirm-modal').classList.remove('hidden');
}

function closeConfirmModal() {
  $('confirm-modal').classList.add('hidden');
  editState.deleteSection = null;
  editState.deleteId      = null;
}

function executeDelete() {
  const { deleteSection: section, deleteId: id } = editState;
  if (!section || !id) return;

  const arr = getSectionArray(section);
  const idx = arr.findIndex(x => x.id === id);
  if (idx !== -1) arr.splice(idx, 1);

  portfolioState.save();
  closeConfirmModal();
  renderAll();
  showToast('Entry deleted.', 'info');
}

/* ══════════════════════════════════════════════════════════
   EXPORT
══════════════════════════════════════════════════════════ */
function exportData() {
  const now  = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
  const json = JSON.stringify(portfolioState.data, null, 2);
  const file = `/**
 * ═══════════════════════════════════════════════════════════════
 *  PORTFOLIO DATA — Exported ${now}
 *  ─────────────────────────────────────────────────────────────
 *  HOW TO USE:
 *  Replace the contents of js/data.js with this file.
 *  This will permanently save all your edits.
 *
 *  EDIT PASSWORD: Stern#27Pitch
 * ═══════════════════════════════════════════════════════════════
 */

const PORTFOLIO_DATA = ${json};
`;

  const blob = new Blob([file], { type: 'application/javascript' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `portfolio-data-${Date.now()}.js`;
  a.click();
  URL.revokeObjectURL(url);

  showToast('Exported! Rename to data.js and place in the js/ folder to make changes permanent.', 'success', 6000);
}

function confirmReset() {
  if (!confirm('Reset all changes and restore the original resume content? This cannot be undone.')) return;
  portfolioState.reset();
  renderAll();
  showToast('Reset to original content.', 'info');
}

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
function getSectionArray(section) {
  const map = {
    experience: portfolioState.data.experience,
    leadership: portfolioState.data.leadership,
    education:  portfolioState.data.education,
    works:      portfolioState.data.publishedWorks,
  };
  return map[section] || [];
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function $(id) { return document.getElementById(id); }

/* ══════════════════════════════════════════════════════════
   TOAST NOTIFICATIONS
══════════════════════════════════════════════════════════ */
let toastTimer;

function showToast(msg, type = 'default', duration = 3200) {
  document.querySelector('.toast')?.remove();
  clearTimeout(toastTimer);

  const colors = {
    default: '#374151',
    success: '#065F46',
    info:    '#1E3A8A',
    error:   '#991B1B',
  };

  const el       = document.createElement('div');
  el.className   = 'toast';
  el.textContent = msg;
  el.style.background = colors[type] || colors.default;

  document.body.appendChild(el);
  toastTimer = setTimeout(() => el.remove(), duration);
}
