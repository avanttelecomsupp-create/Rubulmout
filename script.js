const SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
const BASE_SUPPORTERS = 1248;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Bilingual Toggle (English / Assamese)
  const langToggleBtn = document.getElementById('lang-toggle');
  let currentLang = 'en';

  langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'as' : 'en';
    langToggleBtn.textContent = currentLang === 'en' ? 'অসমীয়া' : 'English';

    document.querySelectorAll('[data-en]').forEach((el) => {
      el.innerHTML = el.getAttribute(`data-${currentLang}`);
    });
  });

  // 2. Escape HTML to prevent XSS from user messages
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // 3. Load Messages from Google Sheet
  const messagesList = document.getElementById('messages-list');
  const countEl = document.getElementById('support-count');

  async function loadMessages() {
    if (!SCRIPT_URL || SCRIPT_URL.includes("PASTE_YOUR")) {
      messagesList.innerHTML = `
        <div class="msg-item">
          <div class="msg-header"><strong>Sandhan</strong><span>Guwahati, Assam</span></div>
          <p>Standing proud with Dr. Rubul Mout and every student from Assam dreaming big in science.</p>
        </div>`;
      return;
    }

    try {
      const res = await fetch(SCRIPT_URL);
      const data = await res.json();

      const total = BASE_SUPPORTERS + (data.totalCount || 0);
      countEl.textContent = total.toLocaleString();

      if (!data.messages || data.messages.length === 0) {
        messagesList.innerHTML = `<p class="loading-text">Be the first to leave a message of support!</p>`;
        return;
      }

      messagesList.innerHTML = data.messages.map(item => `
        <div class="msg-item">
          <div class="msg-header">
            <strong>${escapeHTML(item.name)}</strong>
            <span>${escapeHTML(item.location)}</span>
          </div>
          <p>${escapeHTML(item.message)}</p>
        </div>
      `).join('');
    } catch (err) {
      messagesList.innerHTML = `<p class="loading-text">Unable to load live messages right now.</p>`;
    }
  }

  loadMessages();

  // 4. Submit New Solidarity Message
  const form = document.getElementById('solidarity-form');
  const submitBtn = document.getElementById('submit-btn');
  const feedbackEl = document.getElementById('pledge-feedback');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('supporter-name').value.trim();
    const location = document.getElementById('supporter-location').value.trim();
    const message = document.getElementById('supporter-message').value.trim();

    if (!name || !location || !message) return;

    if (!SCRIPT_URL || SCRIPT_URL.includes("PASTE_YOUR")) {
      feedbackEl.textContent = "Connect your Google Apps Script URL in script.js to publish live messages.";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = currentLang === 'en' ? 'Submitting...' : 'প্ৰেৰণ হৈ আছে...';

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, location, message })
      });

      feedbackEl.textContent = currentLang === 'en'
        ? 'Thank you! Your solidarity message has been published.'
        : 'ধন্যবাদ! আপোনাৰ সমৰ্থন বাৰ্তা প্ৰকাশ কৰা হৈছে।';

      form.reset();
      setTimeout(loadMessages, 1200);
    } catch (err) {
      feedbackEl.textContent = 'Submission failed. Please try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = currentLang === 'en' ? 'Post Solidarity Message' : 'সমৰ্থন বাৰ্তা প্ৰেৰণ কৰক';
    }
  });
});
