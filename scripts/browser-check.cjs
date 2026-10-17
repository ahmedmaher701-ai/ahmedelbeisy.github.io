const {chromium}=require('playwright');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL || 'chrome'});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 fs.mkdirSync('qa',{recursive:true});
 for(const width of [1440,1024,768,390,320]){
  await page.setViewportSize({width,height:900});
  await page.screenshot({path:`qa/desktop-${width}.png`,fullPage:true});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  if(overflow)throw Error('Overflow at '+width);
  console.log(`PASS layout ${width}px; no horizontal overflow`);
 }
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'Menu'}).click();
 if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='true')throw Error('menu');
 await page.keyboard.press('Escape');
 if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='false')throw Error('escape');
 await page.getByRole('button',{name:'Menu'}).click();
 await page.locator('#navigation').getByRole('link',{name:'Projects',exact:true}).click();
 if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='false')throw Error('nav close');
 for(const category of ['Analytics','Automation','Transformation']){
  await page.getByRole('button',{name:category,exact:true}).click();
  if(await page.locator('.project-card:visible').count()!==1)throw Error('filter '+category);
 }
 await page.getByRole('button',{name:'All projects'}).click();
 if(await page.locator('.project-card:visible').count()!==3)throw Error('all filter');
 const first=page.locator('.project-card details').first();await first.locator('summary').focus();await page.keyboard.press('Enter');
 if(!(await first.getAttribute('open')!==null))throw Error('case keyboard');
 await page.keyboard.press('Enter');
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('.actions').getByRole('link',{name:'Download CV'}).click()]);
 if(download.suggestedFilename()!=='Ahmed_ElBeisy_Resume_2026.pdf')throw Error('CV');
 await page.emulateMedia({reducedMotion:'reduce'});
 if(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)!=='auto')throw Error('motion');
 const broken=await page.evaluate(()=>[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash));
 if(broken.length)throw Error('anchors '+broken);
 const assets=['styles.css','script.js','assets/ahmed-el-beisy.jpg','assets/Ahmed_ElBeisy_Resume_2026.pdf','assets/social-preview.png','assets/favicon.svg'];
 for(const asset of assets){if(!(await page.request.get('http://127.0.0.1:4173/'+asset)).ok())throw Error('asset '+asset);}
 console.log('PASS mobile navigation, Escape, section focus, project filters, keyboard case studies, CV download, reduced motion, anchors and assets');
 const noJS=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await noJS.goto('http://127.0.0.1:4173');
 if(!await noJS.locator('#navigation').isVisible()||await noJS.locator('.project-card:visible').count()!==3)throw Error('no JS');
 await noJS.locator('.project-card summary').first().click();if(!await noJS.locator('.case-content').first().isVisible())throw Error('no JS case');
 console.log('PASS no-JavaScript navigation and case studies');
 if(errors.length)throw Error(errors.join('\n'));console.log('PASS no JavaScript runtime errors');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
