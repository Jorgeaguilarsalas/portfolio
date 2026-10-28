const puppeteer=require('puppeteer'),http=require('http'),fs=require('fs'),path=require('path');
const ROOT='/Users/jorgeaguilar/dev/portfolio';
const OUT='/private/tmp/claude-501/-Users-jorgeaguilar-dev-portfolio/e9d7b666-ee2f-4f25-985b-68d73ac670bc/scratchpad/shots';
const MIME={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.pdf':'application/pdf','.vcf':'text/vcard'};
const server=http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);let fp=path.join(ROOT,p);
 try{if(fs.existsSync(fp)&&fs.statSync(fp).isDirectory())fp=path.join(fp,'index.html');
 if(!fs.existsSync(fp)){const loc=p.startsWith('/de/')?'de/404.html':p.startsWith('/es/')?'es/404.html':'404.html';
  res.writeHead(404,{'Content-Type':'text/html'});res.end(fs.readFileSync(path.join(ROOT,loc)));return;}
 res.writeHead(200,{'Content-Type':MIME[path.extname(fp)]||'application/octet-stream'});res.end(fs.readFileSync(fp));}catch(e){res.writeHead(500);res.end();}});
(async()=>{
 await new Promise(r=>server.listen(8097,r));
 const b=await puppeteer.launch({args:['--no-sandbox']});
 let fail=0; const ok=(c,m)=>{console.log(`   ${c?'PASS':'FAIL'}  ${m}`);if(!c)fail++;};
 for(const L of [{n:'en',u:'/nope'},{n:'de',u:'/de/nope'},{n:'es',u:'/es/nope'}]){
  const page=await b.newPage();
  await page.setViewport({width:390,height:844,deviceScaleFactor:2});
  await page.goto('http://localhost:8097'+L.u,{waitUntil:'domcontentloaded'});
  // dismiss consent the way a returning visitor has it
  await page.evaluate(()=>localStorage.setItem('consent_decision',JSON.stringify({analytics:false,ts:Date.now(),v:1})));
  await page.reload({waitUntil:'networkidle0'});
  console.log(`\n=== 404 ${L.n.toUpperCase()} mobile 390px, consent dismissed`);
  const r=await page.evaluate(()=>{
   const a=[...document.querySelectorAll('main .actions a')];
   const banner=document.querySelector('.cc-banner');
   const bx=el=>{const b=el.getBoundingClientRect();return{x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),h:Math.round(b.height),bottom:Math.round(b.bottom)};};
   return {n:a.length,boxes:a.map(bx),bannerVisible:banner?getComputedStyle(banner).display!=='none'&&banner.getBoundingClientRect().height>0:false,
           vh:innerHeight, scrollW:document.documentElement.scrollWidth, clientW:document.documentElement.clientWidth};});
  ok(r.n===2,`2 CTAs present (${r.n})`);
  ok(!r.bannerVisible,`consent banner dismissed for this check`);
  const [p,s]=r.boxes;
  ok(r.scrollW<=r.clientW+1,`no horizontal overflow (${r.scrollW}<=${r.clientW})`);
  ok(s.bottom<=r.vh,`secondary CTA fully above the fold (bottom ${s.bottom} <= ${r.vh})`);
  ok(s.x>=16,`secondary CTA respects the 20px gutter (x=${s.x})`);
  const stacked = s.y >= p.bottom;
  console.log(`   layout: primary ${JSON.stringify(p)}  secondary ${JSON.stringify(s)}`);
  console.log(`   -> ${stacked?'stacked (wrapped to its own row)':'same row'}`);
  ok(s.w>0&&s.h>0,`secondary CTA rendered with a box`);
  // touch target >= 24px min for the text link (WCAG 2.5.8 AA is 24x24)
  const tap=await page.evaluate(()=>{const a=document.querySelector('main .hub-cta-secondary a');
   const cs=getComputedStyle(a,'::after');const ab=a.getBoundingClientRect();
   const h=parseFloat(cs.height)||0;
   // does the extended area overlap the primary pill?
   const pb=document.querySelector('main .actions .btn-primary').getBoundingClientRect();
   const tapBox={left:ab.left,right:ab.right,top:ab.top+ab.height/2-h/2,bottom:ab.top+ab.height/2+h/2};
   const overlap=!(tapBox.right<=pb.left||tapBox.left>=pb.right||tapBox.bottom<=pb.top||tapBox.top>=pb.bottom);
   return {h,w:Math.round(ab.width),overlap,content:cs.content};});
  ok(tap.h>=44,`secondary CTA tap area height >= 44px (${tap.h}px, text box ${s.h}px)`);
  ok(tap.w>=44,`secondary CTA tap area width >= 44px (${tap.w}px)`);
  ok(!tap.overlap,`tap area does not overlap the primary pill`);
  await page.screenshot({path:`${OUT}/404-${L.n}-mobile-noconsent.png`});
  // overlay foot visible, with banner gone
  await page.click('#navToggle'); await new Promise(x=>setTimeout(x,500));
  const f=await page.evaluate(()=>{const el=document.querySelector('.mobile-menu-foot');const b=el.getBoundingClientRect();
   return {txt:el.textContent.trim(),op:getComputedStyle(el).opacity,visible:b.height>0&&b.top<innerHeight,top:Math.round(b.top)};});
  ok(f.visible,`.mobile-menu-foot "${f.txt}" visible in overlay at opacity ${f.op}`);
  await page.screenshot({path:`${OUT}/404-${L.n}-menu-noconsent.png`});
  await page.close();
 }
 await b.close();server.close();
 console.log(`\n${fail===0?'ALL CHECKS PASSED':fail+' FAILED'}`);process.exit(fail?1:0);
})();
