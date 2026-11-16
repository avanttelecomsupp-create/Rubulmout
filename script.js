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

  // 2. Solidarity Pledge Button
  const pledgeBtn = document.getElementById('pledge-btn');
  const countEl = document.getElementById('support-count');
  const feedbackEl = document.getElementById('pledge-feedback');

  let baseCount = 1248;
  const hasPledged = localStorage.getItem('rubulmout_pledged') === 'true';

  if (hasPledged) {
    baseCount += 1;
    countEl.textContent = baseCount.toLocaleString();
    pledgeBtn.disabled = true;
    pledgeBtn.style.opacity = '0.75';
    pledgeBtn.textContent = currentLang === 'en' ? 'Thank You for Standing With Him' : 'সংহতি জনোৱাৰ বাবে ধন্যবাদ';
  }

  pledgeBtn.addEventListener('click', () => {
    if (localStorage.getItem('rubulmout_pledged') === 'true') return;

    baseCount += 1;
    countEl.textContent = baseCount.toLocaleString();
    localStorage.setItem('rubulmout_pledged', 'true');

    pledgeBtn.disabled = true;
    pledgeBtn.style.opacity = '0.75';
    pledgeBtn.textContent = currentLang === 'en' ? 'Thank You for Standing With Him' : 'সংহতি জনোৱাৰ বাবে ধন্যবাদ';
    feedbackEl.textContent = currentLang === 'en'
      ? 'Your solidarity has been recorded. Let us celebrate Assam’s achievers.'
      : 'আপোনাৰ সমৰ্থন নথিভুক্ত কৰা হৈছে। আহক আমি অসমৰ কৃতী সন্তানসকলক সন্মান জনাওঁ।';
  });
});