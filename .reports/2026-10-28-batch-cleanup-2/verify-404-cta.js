const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = '/Users/jorgeaguilar/dev/portfolio';
const OUT = '/private/tmp/claude-501/-Users-jorgeaguilar-dev-portfolio/e9d7b666-ee2f-4f25-985b-68d73ac670bc/scratchpad/shots';
fs.mkdirSync(OUT, {recursive:true});

const MIME = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json',
  '.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.pdf':'application/pdf','.vcf':'text/vcard'};

const server = http.createServer((req,res)=>{
  let p = decodeURIComponent(req.url.split('?')[0]);
  let fp = path.join(ROOT, p);
  try {
    if (fs.existsSync(fp) && fs.statSync(fp).isDirectory()) fp = path.join(fp,'index.html');
    if (!fs.existsSync(fp)) { // 404 fallback like the real site
      const loc = p.startsWith('/de/') ? 'de/404.html' : p.startsWith('/es/') ? 'es/404.html' : '404.html';
      res.writeHead(404,{'Content-Type':'text/html'}); res.end(fs.readFileSync(path.join(ROOT,loc))); return;
    }
    res.writeHead(200,{'Content-Type':MIME[path.extname(fp)]||'application/octet-stream'});
    res.end(fs.readFileSync(fp));
  } catch(e){ res.writeHead(500); res.end(String(e)); }
});

function srgb(c){c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
function lum([r,g,b]){return 0.2126*srgb(r)+0.7152*srgb(g)+0.0722*srgb(b);}
function ratio(a,b){const la=lum(a),lb=lum(b);const hi=Math.max(la,lb),lo=Math.min(la,lb);return (hi+0.05)/(lo+0.05);}
function parseRGB(s){const m=s.match(/[\d.]+/g).map(Number);return [m[0],m[1],m[2],m[3]===undefined?1:m[3]];}
function over(fg,bg,a){return fg.map((f,i)=>Math.round(f*a+bg[i]*(1-a)));}
const hex=c=>'#'+c.map(v=>v.toString(16).padStart(2,'0').toUpperCase()).join('');

(async()=>{
  await new Promise(r=>server.listen(8099,r));
  const browser = await puppeteer.launch({args:['--no-sandbox']});
  const LOCALES = [
    {name:'en', url:'http://localhost:8099/nope-does-not-exist', about:'/about/#cv', label:'View my CV'},
    {name:'de', url:'http://localhost:8099/de/nope-does-not-exist', about:'/de/about/#cv', label:'Zu meinem Lebenslauf'},
    {name:'es', url:'http://localhost:8099/es/nope-does-not-exist', about:'/es/about/#cv', label:'Ver mi CV'},
  ];
  let fails = 0;
  const ok=(c,m)=>{console.log(`   ${c?'PASS':'FAIL'}  ${m}`); if(!c) fails++;};

  for (const L of LOCALES) {
    console.log(`\n=== 404 ${L.name.toUpperCase()} — ${L.url}`);
    for (const vp of [{w:1280,h:900,tag:'desktop'},{w:390,h:844,tag:'mobile'}]) {
      const page = await browser.newPage();
      await page.setViewport({width:vp.w,height:vp.h,deviceScaleFactor:2});
      await page.goto(L.url,{waitUntil:'networkidle0'});

      const r = await page.evaluate(()=>{
        const acts=[...document.querySelectorAll('main .actions a')];
        const sec=document.querySelector('main .hub-cta-secondary a');
        const box=el=>{const b=el.getBoundingClientRect();return {x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),h:Math.round(b.height)};};
        return {
          count:acts.length,
          ctas:acts.map(a=>({text:a.textContent.replace(/\s+/g,' ').trim(),href:a.getAttribute('href'),
                             dl:a.hasAttribute('download'), box:box(a)})),
          secHasDownload: sec?sec.hasAttribute('download'):null,
          bodyScrollW: document.documentElement.scrollWidth,
          clientW: document.documentElement.clientWidth,
        };
      });

      if (vp.tag==='desktop') {
        ok(r.count===2, `2 CTAs in main .actions (got ${r.count})`);
        const sec=r.ctas[1];
        ok(sec && sec.href===L.about, `secondary href = ${L.about} (got ${sec&&sec.href})`);
        ok(sec && sec.text.startsWith(L.label), `label = "${L.label}" (got "${sec&&sec.text}")`);
        ok(r.secHasDownload===false, `secondary has NO download attribute (critical)`);
        ok(r.ctas.every(c=>!c.dl), `no CTA in .actions downloads`);
        ok(!r.ctas.some(c=>/\.pdf$/i.test(c.href||'')), `no CTA points at a PDF`);
      }
      // layout: both CTAs on-screen, vertically aligned centers on one row (desktop)
      const [p,s]=r.ctas;
      ok(p.box.x>=0 && s.box.x>=0 && s.box.x+s.box.w<=vp.w, `${vp.tag}: both CTAs within viewport width`);
      ok(r.bodyScrollW<=r.clientW+1, `${vp.tag}: no horizontal overflow (${r.bodyScrollW} <= ${r.clientW})`);
      if (vp.tag==='desktop'){
        const pc=p.box.y+p.box.h/2, sc=s.box.y+s.box.h/2;
        ok(Math.abs(pc-sc)<=1.5, `desktop: CTAs share a row, centers aligned (Δ${Math.abs(pc-sc).toFixed(1)}px)`);
      }

      // Fix 2 + navigation + contrast, measured on the real page
      if (vp.tag==='mobile') {
        await page.click('#navToggle');
        await new Promise(r=>setTimeout(r,500));
        const c = await page.evaluate(()=>{
          const foot=document.querySelector('.mobile-menu-foot');
          const num=document.querySelector('.mobile-menu-links a .num');
          const menu=document.querySelector('.mobile-menu');
          const g=el=>getComputedStyle(el);
          return {
            footOpacity:g(foot).opacity, footColor:g(foot).color, footSize:g(foot).fontSize,
            footText:foot.textContent.trim(),
            numOpacity:g(num).opacity,
            menuBg:g(menu).backgroundColor,
            menuZ:g(menu).zIndex,
            navZ:g(document.querySelector('.nav')).zIndex,
            bodyBg:g(document.body).backgroundColor,
          };
        });
        const bodyBg=parseRGB(c.bodyBg).slice(0,3);
        let mb=parseRGB(c.menuBg); let menuBg = mb[3]<1 ? over(mb.slice(0,3),bodyBg,mb[3]) : mb.slice(0,3);
        const fg=parseRGB(c.footColor).slice(0,3);
        const eff=over(fg,menuBg,parseFloat(c.footOpacity));
        const rr=ratio(eff,menuBg);
        console.log(`   .mobile-menu-foot "${c.footText}" ${c.footSize} opacity=${c.footOpacity}`);
        console.log(`     fg ${hex(fg)} @${c.footOpacity} over ${hex(menuBg)} -> effective ${hex(eff)} = ${rr.toFixed(2)}:1`);
        ok(c.footOpacity==='0.72', `foot opacity is .72 (got ${c.footOpacity})`);
        ok(rr>=4.5, `foot contrast >= 4.5:1 AA (got ${rr.toFixed(2)}:1)`);
        ok(c.numOpacity==='0.72', `numerales still .72 (not regressed) (got ${c.numOpacity})`);
        console.log(`     stack: .nav z=${c.navZ}, .mobile-menu z=${c.menuZ}`);
        await page.screenshot({path:`${OUT}/404-${L.name}-menu.png`});
        await page.keyboard.press('Escape');
        await new Promise(r=>setTimeout(r,400));
      }

      await page.screenshot({path:`${OUT}/404-${L.name}-${vp.tag}.png`, fullPage:true});

      // the critical one: click the secondary CTA, confirm navigation not download
      if (vp.tag==='desktop'){
        let dl=null;
        page.on('response',res=>{const h=res.headers()['content-disposition']; if(h&&/attachment/i.test(h)) dl=res.url();});
        await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),
                           page.click('main .hub-cta-secondary a')]);
        const after = await page.evaluate(()=>({url:location.href, hash:location.hash,
          cvSectionExists: !!document.getElementById('cv'),
          scrolledToCv: (()=>{const e=document.getElementById('cv'); if(!e) return null;
            return Math.abs(e.getBoundingClientRect().top) < 120;})()}));
        console.log(`   clicked secondary -> ${after.url}`);
        ok(after.url.endsWith(L.about), `navigated to ${L.about}`);
        ok(after.cvSectionExists, `target #cv section exists on the about page`);
        ok(after.scrolledToCv===true, `landed scrolled at #cv (top offset < 120px)`);
        ok(dl===null, `NO download was triggered by the click (critical)`);
      }
      await page.close();
    }
  }
  await browser.close(); server.close();
  console.log(`\n${fails===0?'ALL CHECKS PASSED':fails+' CHECK(S) FAILED'}`);
  process.exit(fails===0?0:1);
})();
