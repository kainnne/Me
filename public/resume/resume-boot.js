/* Keep the upstream loading screen visible until the résumé is ready. */
(() => {
  const content = document.querySelector('#content');
  const initialContent = content.innerHTML;
  const app = document.querySelector('#app');
  app.inert = true;
  app.setAttribute('aria-busy', 'true');
  let failed = false;
  let settled = false;
  const reveal = () => {
    document.body.classList.remove('booting');
    document.querySelector('#boot-loader').setAttribute('aria-hidden', 'true');
    app.inert = false;
    app.setAttribute('aria-busy', 'false');
  };
  const fail = () => {
    if (settled) return;
    failed = true;
    settled = true;
    clearTimeout(timeout);
    content.innerHTML = initialContent;
    content.hidden = false;
    document.body.classList.add('resume-static-fallback');
    reveal();
  };
  const timeout = setTimeout(fail, 20000);
  window.ResumeBoot = Object.freeze({
    get failed() { return failed; },
    fail,
    complete() {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reveal();
    },
  });
  window.addEventListener('error', (event) => {
    if (event.target instanceof HTMLScriptElement) fail();
  }, true);
})();
