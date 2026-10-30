const puppeteer = require(process.cwd()+'/node_modules/puppeteer'); const fs=require('fs');
(async()=>{const b=await puppeteer.launch({executablePath:process.env.PUPPETEER_EXECUTABLE_PATH});const p=await b.newPage();
for(const n of ['cv-before','cv-after']){const d='data:image/png;base64,'+fs.readFileSync(process.argv[2]+'/'+n+'.png').toString('base64');
console.log(n, await p.evaluate(async d=>{const i=new Image();i.src=d;await i.decode();const c=document.createElement('canvas');c.width=i.width;c.height=i.height;const x=c.getContext('2d');x.drawImage(i,0,0);
const reg=(x0,y0,w,h)=>{const a=x.getImageData(x0,y0,w,h).data;let m=[0,0,0];for(let k=0;k<a.length;k+=4) if(a[k]+a[k+1]+a[k+2]>m[0]+m[1]+m[2]) m=[a[k],a[k+1],a[k+2]];return 'rgb('+m+')'};
return 'org "Nexio Fleet GmbH" brightest px: '+reg(250,327,115,16)+' | place "Berlin": '+reg(66,328,35,14)},d));}
await b.close()})();
