const puppeteer = require(process.cwd()+'/node_modules/puppeteer');
(async()=>{
 const b=await puppeteer.launch({executablePath:process.env.PUPPETEER_EXECUTABLE_PATH});
 const p=await b.newPage();
 await p.goto('file://'+process.cwd()+'/cv/index.html',{waitUntil:'networkidle0'});
 await p.emulateMediaType('print');
 console.log(await p.evaluate(()=>{
  const muted=getComputedStyle(document.documentElement).getPropertyValue('--muted').trim();
  const seen={};
  for(const el of document.querySelectorAll('body *')){
   if(!el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})) continue;
   const own=[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()); if(!own) continue;
   const c=getComputedStyle(el).color; if(c==='rgb(230, 230, 230)'||c==='rgb(255, 255, 255)'||c==='rgb(16, 185, 129)') continue;
   const k=c+' .'+(el.className||el.tagName); seen[k]=(seen[k]||0)+1;
  }
  return '--muted='+muted+'\n'+Object.entries(seen).map(([k,v])=>'  '+k+' x'+v).join('\n');
 }));
 await b.close();
})();
