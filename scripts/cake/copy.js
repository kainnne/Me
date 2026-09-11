(() => {
  const data=JSON.parse(document.querySelector('#module-data').textContent);
  const status=document.querySelector('#status');let statusTimer;
  const notify=message=>{status.textContent=message;status.hidden=false;clearTimeout(statusTimer);statusTimer=setTimeout(()=>status.hidden=true,2500);};
  document.querySelectorAll('button[data-view]').forEach(button=>button.addEventListener('click',()=>{document.body.dataset.view=button.dataset.view;document.querySelectorAll('button[data-view]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));}));
  const manual=document.querySelector('#manual-copy'),textarea=manual.querySelector('textarea');
  const manualCopy=text=>{textarea.value=text;manual.showModal();textarea.focus();textarea.select();};
  manual.querySelector('button').addEventListener('click',()=>manual.close());
  document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{
    const module=data[button.dataset.lang].modules[Number(button.dataset.index)];
    const rich=button.dataset.copy==='rich',text=rich?module.text:module.bodyText;
    try{
      if(rich&&window.ClipboardItem&&navigator.clipboard?.write){
        await navigator.clipboard.write([new ClipboardItem({'text/plain':new Blob([text],{type:'text/plain'}),'text/html':new Blob([module.html],{type:'text/html'})})]);
      }else if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(text);
      else {manualCopy(text);return;}
      notify(rich?'已複製整塊，可貼進 Cake':'已複製內文');
    }catch{manualCopy(text);}
  }));
})();
