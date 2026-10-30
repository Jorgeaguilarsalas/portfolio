const puppeteer = require(process.cwd()+'/node_modules/puppeteer'); const fs=require('fs');
const pages=fs.readFileSync(process.argv[2],'utf8').trim().split('\n').map(f=>'/'+f.replace(/index\.html$/,''));
(async()=>{const b=await puppeteer.launch({executablePath:process.env.PUPPETEER_EXECUTABLE_PATH});const p=await b.newPage();await p.setViewport({width:390,height:844});
const tally={};
for(const u of pages){await p.goto('http://localhost:8765'+u,{waitUntil:'load'});
 const ops=await p.evaluate(()=>[...document.querySelectorAll('.mobile-menu-links a .num')].map(n=>getComputedStyle(n).opacity+(n.closest('a').matches('[aria-current],.active')?'(active)':'')));
 const k=[...new Set(ops)].sort().join(','); (tally[k]=tally[k]||[]).push(u+'['+ops.length+']');}
for(const [k,v] of Object.entries(tally)) console.log(k,' -> ',v.length,'pages:',v.join(' '));
await b.close()})();
