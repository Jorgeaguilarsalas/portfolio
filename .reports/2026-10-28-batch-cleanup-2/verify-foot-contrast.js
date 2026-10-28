const puppeteer=require('puppeteer'),http=require('http'),fs=require('fs'),path=require('path');
const ROOT='/Users/jorgeaguilar/dev/portfolio';
const MIME={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.pdf':'application/pdf','.vcf':'text/vcard'};
const server=http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);let fp=path.join(ROOT,p);
 try{if(fs.existsSync(fp)&&fs.statSync(fp).isDirectory())fp=path.join(fp,'index.html');
 if(!fs.existsSync(fp)){res.writeHead(404);res.end('nf');return;}
 res.writeHead(200,{'Content-Type':MIME[path.extname(fp)]||'application/octet-stream'});res.end(fs.readFileSync(fp));}catch(e){res.writeHead(500);res.end();}});
function srgb(c){c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
function lum([r,g,b]){return 0.2126*srgb(r)+0.7152*srgb(g)+0.0722*srgb(b);}
function ratio(a,b){const la=lum(a),lb=lum(b),hi=Math.max(la,lb),lo=Math.min(la,lb);return (hi+0.05)/(lo+0.05);}
const parseRGB=s=>{const m=s.match(/[\d.]+/g).map(Number);return [m[0],m[1],m[2],m[3]===undefined?1:m[3]];};
const over=(f,b,a)=>f.map((v,i)=>Math.round(v*a+b[i]*(1-a)));
const hex=c=>'#'+c.map(v=>v.toString(16).padStart(2,'0').toUpperCase()).join('');

// every page that declares .mobile-menu-foot, as URLs
const PAGES=process.argv.slice(2);
(async()=>{
 await new Promise(r=>server.listen(8098,r));
 const b=await puppeteer.launch({args:['--no-sandbox']});
 let fail=0, worst=99, rows=[];
 for(const u of PAGES){
  const page=await b.newPage();
  await page.setViewport({width:390,height:844});
  try{
   await page.goto('http://localhost:8098'+u,{waitUntil:'domcontentloaded',timeout:20000});
   const c=await page.evaluate(()=>{const f=document.querySelector('.mobile-menu-foot');
    if(!f) return null; const m=document.querySelector('.mobile-menu');const g=el=>getComputedStyle(el);
    return {op:g(f).opacity,col:g(f).color,sz:g(f).fontSize,mbg:g(m).backgroundColor,bbg:g(document.body).backgroundColor};});
   if(!c){console.log(`SKIP ${u} (no .mobile-menu-foot)`);await page.close();continue;}
   const bbg=parseRGB(c.bbg).slice(0,3);const mb=parseRGB(c.mbg);
   const mbg=mb[3]<1?over(mb.slice(0,3),bbg,mb[3]):mb.slice(0,3);
   const eff=over(parseRGB(c.col).slice(0,3),mbg,parseFloat(c.op));
   const r=ratio(eff,mbg); worst=Math.min(worst,r);
   const pass=parseFloat(c.op)===0.72 && r>=4.5; if(!pass)fail++;
   rows.push(`${pass?'PASS':'FAIL'}  ${r.toFixed(2)}:1  op=${c.op}  ${c.sz}  bg ${hex(mbg)} -> ${hex(eff)}  ${u}`);
  }catch(e){console.log(`ERR ${u}: ${e.message}`);fail++;}
  await page.close();
 }
 rows.sort(); rows.forEach(r=>console.log('  '+r));
 await b.close();server.close();
 console.log(`\n${PAGES.length} pages checked | worst ratio ${worst.toFixed(2)}:1 | ${fail===0?'ALL PASS (AA >= 4.5:1)':fail+' FAILED'}`);
 process.exit(fail?1:0);
})();
