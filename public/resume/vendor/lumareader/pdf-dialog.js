(function () {
  "use strict";
  let pending = false;
  window.LumaPdfDialog = {
    async open(language) {
      if (pending) return null;
      pending = true;
      try {
        const saved = await window.lumaDesktop?.getPreferences?.();
        const zh = language.startsWith("zh");
        const dialog = document.querySelector("#pdf-options-dialog");
        const input = dialog.querySelector("#pdf-footer-text");
        const footer = dialog.querySelector("#pdf-include-footer");
        const frame = dialog.querySelector("#pdf-color-frame");
        dialog.querySelector("h2").textContent = zh ? "匯出 PDF" : "Export PDF";
        dialog.querySelector('label[for="pdf-footer-text"] span').textContent = zh ? "頁尾名稱" : "Footer name";
        footer.nextElementSibling.textContent = zh ? "加上頁尾名稱" : "Add footer name";
        frame.nextElementSibling.textContent = zh ? "加上彩色外框" : "Add palette-colored frame";
        dialog.querySelector(".pdf-style-help").textContent = zh ? "兩項都不勾選，會輸出白底、沒有外框和頁尾名稱的 PDF。" : "Leave both unchecked for white pages without a frame or footer name.";
        dialog.querySelector(".pdf-footer-help").textContent = zh ? "接著會開啟瀏覽器列印視窗，請選擇儲存為 PDF。自訂頁尾與彩色外框的支援依瀏覽器而異。" : "The browser print dialog opens next. Choose Save as PDF. Custom footers and colored frames depend on browser support.";
        dialog.querySelector(".pdf-pagebreak-help").textContent = zh ? "想在指定位置換頁？請在 Markdown 中另起一行，加入：" : "To start a new PDF page, add this on its own line in Markdown:";
        dialog.querySelector("[value=cancel]").textContent = zh ? "取消" : "Cancel";
        dialog.querySelector("[value=cancel]").onclick = () => dialog.close("cancel");
        dialog.querySelector("[value=export]").textContent = zh ? "繼續" : "Continue";
        input.value = typeof saved?.pdfFooterText === "string" ? saved.pdfFooterText : "LumaReader";
        footer.checked = saved?.pdfIncludeFooter === true;
        frame.checked = saved?.pdfColorFrame === true;
        input.disabled = !footer.checked;
        footer.onchange = () => { input.disabled = !footer.checked; if (footer.checked) { input.focus(); input.select(); } };
        dialog.returnValue = "cancel";
        const result = new Promise(resolve => dialog.addEventListener("close", () => resolve(dialog.returnValue === "export" ? {footerText:input.value,includeFooter:footer.checked,colorFrame:frame.checked} : null), {once:true}));
        dialog.showModal();
        if (footer.checked) { input.focus(); input.select(); } else footer.focus();
        return await result;
      } finally { pending = false; }
    }
  };
})();
