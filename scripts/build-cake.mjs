import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const output = new URL('public/resume/cake/', root);
const check = process.argv.includes('--check');
await mkdir(output, {recursive:true});
const context = vm.createContext({});
vm.runInContext(await read('public/resume/vendor/lumareader/vendor/marked/marked.umd.js'), context);
const marked = new context.marked.Marked();
marked.use({renderer:{html(){return '';}}});
const escape = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const plain = md => md.replace(/^#{1,6} /gm,'').replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_,label,url)=>label===url||url===`mailto:${label}`||url===`https://${label}`?label:`${label}\n${url}`).replace(/\*\*([^*]+)\*\*/g,'$1').replace(/\\\n/g,'\n').replace(/^---$/gm,'').trim();
const styled = md => marked.parse(md).replace(/<(h[1-6])>/g,'<$1 style="font-family:Arial,sans-serif;font-size:20px;line-height:1.4;color:#17202a;margin:0 0 12px;font-weight:700;">').replace(/<p>/g,'<p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.75;color:#27313c;margin:0 0 12px;">').replace(/<ul>/g,'<ul style="font-family:Arial,sans-serif;font-size:14px;line-height:1.75;color:#27313c;margin:0 0 12px;padding-left:22px;">').replace(/<li>/g,'<li style="margin-bottom:8px;">').replace(/<a href=/g,'<a style="color:#243c56;text-decoration:underline;" href=');
const records = {};
const files = [];
const addFile = async (name, value) => {
  const data = Buffer.isBuffer(value) ? value : Buffer.from(value);
  const path = new URL(name, output);
  if(check){if(!(await readFile(path)).equals(data))throw new Error(`Out of date: ${name}`);}
  else {await mkdir(new URL('./',path),{recursive:true});await writeFile(path,data);}
  files.push({name,data});
};
for (const lang of ['zh','en']) {
  const source = await read(`public/resume/resume.${lang}.md`);
  const chunks=source.split(/^## /m),intro=chunks.shift();
  const sections=chunks.map(chunk=>({heading:chunk.slice(0,chunk.indexOf('\n')),body:chunk.slice(chunk.indexOf('\n')+1).trim()}));
  const leaves = section => section.body.split(/^### /m).filter(x=>x.trim()).map(text=>({title:text.slice(0,text.indexOf('\n')),body:text.slice(text.indexOf('\n')+1).trim()}));
  const jobs=leaves(sections[0]),project=leaves(sections[1]),others=leaves(sections[2]),education=leaves(sections[4]);
  if(jobs.length!==3||project.length!==1||others.length!==2||education.length!==3)throw new Error('Résumé structure changed. Review Cake module mapping.');
  const lines=intro.split('\n'),name=lines[0].replace(/^# /,''),tagline=lines.filter(x=>x.trim()&&!x.startsWith('#')&&!x.startsWith('!')&&!x.startsWith('-'))[0];
  const summary=intro.slice(intro.indexOf('- **'),intro.indexOf('\n---')).trim();
  const contact=intro.slice(intro.indexOf('\n---')+4).trim();
  const role=jobs[0].body.split('\n')[0].split(lang==='zh'?'｜':' | ')[0];
  const modules = [
    {id:'01-profile',type:'Profile',title:name,body:`${role}\n\n${tagline}\n\n${contact}`},
    {id:'02-summary',type:'Lists',title:lang==='zh'?'個人簡介':'Profile Summary',body:summary},
    ...jobs.map((item,index)=>({id:`0${index+3}-experience`,type:'Paragraph',...item})),
    {id:'06-lumareader',type:'Lists',...project[0]},
    {id:'07-wikinb',type:'Lists',...others[0]},
    {id:'08-ai-tools',type:'Lists',...others[1]},
    {id:'09-skills',type:'Lists',title:sections[3].heading,body:sections[3].body},
    {id:'10-masters',type:'Paragraph',...education[0]},
    {id:'11-bachelors',type:'Paragraph',...education[1]},
    {id:'12-thesis',type:'Paragraph',...education[2]},
    {id:'13-creative',type:'Paragraph',title:sections[5].heading,body:sections[5].body},
  ].map(module=>({...module,markdown:`### ${module.title}\n\n${module.body}\n`,text:`${plain(module.title)}\n\n${plain(module.body)}`,bodyText:plain(module.body),html:styled(`### ${module.title}\n\n${module.body}`)}));
  records[lang]={sourceSha256:createHash('sha256').update(source).digest('hex'),modules};
  for(const module of modules){
    await addFile(`${lang}/${module.id}.txt`,module.text+'\n');
    await addFile(`${lang}/${module.id}.html`,`<!doctype html><html lang="${lang==='zh'?'zh-Hant':'en'}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(module.title)}</title><body style="max-width:760px;margin:40px auto;padding:0 24px;background:#fff;">${module.html}</body></html>`);
  }
  await addFile(`${lang}/all-modules.txt`,modules.map(module=>module.text).join('\n\n────────────────────────\n\n')+'\n');
  await addFile(`${lang}/source.md`,source);
}
await addFile('portrait.jpg',await readFile(new URL('public/resume/assets/portrait.jpg',root)));
await addFile('modules.json',JSON.stringify(records,null,2)+'\n');
const guide=`Cake résumé modules / Cake 履歷模組\n\n1. Open index.html or https://kainnne.com/resume/cake/ .\n2. Add a Profile, Lists or Paragraph snippet inside Cake.\n3. Copy one module and paste it into the text area. Use body-only copy for templates with a separate heading field.\n4. If Cake changes the formatting, use the plain-text file and adjust the native Cake snippet.\n5. Upload portrait.jpg separately through an image block.\n\n在 Cake 先新增對應區塊，再逐塊複製貼上。本素材包不是 Cake 的專用匯入檔。\n每塊有 TXT 與 HTML，zh / en 各有全套文字檔與原始 Markdown。\n文字由已確認的 Markdown 自動拆分，未改寫成果。中文論文摘要依原稿保留英文。\n\n建議順序：個人資訊 → 簡介 → 三筆工作經歷 → LumaReader → WikiNB → AI Tools → 核心能力 → 碩士 → 學士 → 碩士論文 → 創作與領導。\n版面：白底、深灰字、單欄正文。聯絡資訊可與照片分欄，工作／專案描述保留完整寬度。\n\nCake official snippet guide:\nhttps://help.cake.me/en/articles/11532128-how-to-add-and-edit-snippet-or-block\n`;
await addFile('READ-ME.txt',guide);
const blocks=records.zh.modules.map((module,index)=>`<section class="module" id="${module.id}"><header class="module-bar"><span class="number">${String(index+1).padStart(2,'0')}</span><h2>${escape(module.title)}</h2><span class="type">${module.type}</span></header><div class="pair">${['zh','en'].map(lang=>{const m=records[lang].modules[index];return `<article class="language-pane" data-lang="${lang}" lang="${lang==='zh'?'zh-Hant':'en'}"><div class="language-label">${lang==='zh'?'繁體中文':'English'}</div><div class="paste-content">${m.html}</div><footer><button data-copy="rich" data-lang="${lang}" data-index="${index}">複製整塊</button><button class="secondary" data-copy="body" data-lang="${lang}" data-index="${index}">複製內文</button><a href="${lang}/${m.id}.txt" download>TXT</a></footer></article>`;}).join('')}</div></section>`).join('\n');
const nav=records.zh.modules.map((m,i)=>`<a href="#${m.id}"><span>${String(i+1).padStart(2,'0')}</span>${escape(m.title)}</a>`).join('');
const template=await read('scripts/cake/template.html');
const html=template.replace('{{CSS}}',await read('scripts/cake/style.css')).replace('{{BLOCKS}}',blocks).replace('{{NAV}}',nav).replace('{{DATA}}',JSON.stringify(records).replace(/</g,'\\u003c')).replace('{{SCRIPT}}',await read('scripts/cake/copy.js'));
await addFile('index.html',html);
// A dependency-free, deterministic ZIP using the standard uncompressed ZIP format.
const crcTable=Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
const crc32=buffer=>{let crc=0xffffffff;for(const byte of buffer)crc=crcTable[(crc^byte)&255]^(crc>>>8);return (crc^0xffffffff)>>>0;};
const local=[],central=[];let offset=0;
for(const {name,data} of files){
 const n=Buffer.from(name),crc=crc32(data),h=Buffer.alloc(30);h.writeUInt32LE(0x04034b50);h.writeUInt16LE(20,4);h.writeUInt16LE(0x800,6);h.writeUInt16LE(33,12);h.writeUInt32LE(crc,14);h.writeUInt32LE(data.length,18);h.writeUInt32LE(data.length,22);h.writeUInt16LE(n.length,26);local.push(h,n,data);
 const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt16LE(0x800,8);c.writeUInt16LE(33,14);c.writeUInt32LE(crc,16);c.writeUInt32LE(data.length,20);c.writeUInt32LE(data.length,24);c.writeUInt16LE(n.length,28);c.writeUInt32LE(offset,42);central.push(c,n);offset+=h.length+n.length+data.length;
}
const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(files.length,8);end.writeUInt16LE(files.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
const archive=Buffer.concat([...local,directory,end]);
if(check){if(!(await readFile(new URL('cake-resume-modules.zip',output))).equals(archive))throw new Error('Out of date: Cake ZIP');}
else await writeFile(new URL('cake-resume-modules.zip',output),archive);
console.log(`Cake package: ${records.zh.modules.length} paired modules, text/HTML files, photo and ZIP generated from current Markdown.`);
