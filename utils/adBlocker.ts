// Simple ad-blocker script to inject into WebView
export const adBlockScript = `
(function() {
  // Common ad-related selectors and domains
  const adSelectors = [
    '[id*="google_ads"]',
    '[id*="ad-"]',
    '[class*="ad-"]',
    '[class*="banner"]',
    '[class*="popup"]',
    'iframe[src*="doubleclick.net"]',
    'iframe[src*="googleadservices"]',
    'iframe[src*="adsystem"]',
    '[id*="taboola"]',
    '[class*="taboola"]',
    '[id*="outbrain"]',
    '[class*="outbrain"]',
    '.adsbygoogle',
    '.ad-container',
    '.ad-wrapper',
    '#overlay',
    '.overlay'
  ];

  // Function to remove ad elements
  function removeAds() {
    adSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    });

    // Remove any fixed position elements that might be overlays/popups
    const allFixed = document.querySelectorAll('div[style*="position:fixed"], div[style*="position: fixed"]');
    allFixed.forEach(el => {
      if (el.id !== 'reader-container' && !el.classList.contains('navigation') && !el.classList.contains('reader-controls')) {
        el.style.display = 'none';
      }
    });
  }

  // Remove ads immediately
  removeAds();

  // Set up an observer to catch dynamically added ads
  const observer = new MutationObserver(function(mutations) {
    removeAds();
  });

  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });

  // Also try to catch ads loaded through setTimeout
  const originalSetTimeout = window.setTimeout;
  window.setTimeout = function(callback, timeout, ...args) {
    const wrappedCallback = function() {
      const result = callback.apply(this, args);
      removeAds();
      return result;
    };
    return originalSetTimeout(wrappedCallback, timeout);
  };
})();
`;