/* Uses the browser's native print-to-PDF pipeline; document text remains unchanged. */
(() => {
  const cssString = (value) => '"' + String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/[\n\r\f]/g, ' ') + '"';
  window.ResumePrint = {
    async export({footerText = '', includeFooter = false, colorFrame = false}) {
      const style = document.createElement('style');
      style.textContent = `@media print { @page { @bottom-right { content: ${cssString(includeFooter ? footerText : '')}; font: 9pt sans-serif; color: #68616a; } } }`;
      document.head.append(style);
      document.documentElement.dataset.pdfFrame = colorFrame ? 'color' : 'plain';
      await window.lumaDesktop.setPreferences({pdfFooterText: footerText, pdfIncludeFooter: includeFooter, pdfColorFrame: colorFrame});
      try {
        await new Promise((resolve, reject) => {
          // Safari can return from print() before its sheet closes.
          const finish = () => { clearTimeout(timer); window.removeEventListener('afterprint', finish); resolve(); };
          const timer = setTimeout(finish, 120000);
          window.addEventListener('afterprint', finish, {once: true});
          try { window.print(); }
          catch (error) { clearTimeout(timer); window.removeEventListener('afterprint', finish); reject(error); }
        });
        // Browsers do not report whether the visitor saved or canceled the PDF.
        return {canceled: true};
      } finally { style.remove(); }
    },
  };
})();
