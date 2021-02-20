let puppeteer = require("puppeteer");
(async function () {
  // browser open => visible 
  try{
  let browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized", "--disable-notifications"]
  });
  // let page = await browser.newPage();
  let tabs = await browser.pages();
  let tab = tabs[0];
  await tab.goto("https://www.olx.in/")
  await tab.waitFor(3000)
  await tab.click(".rui-3sH3b.rui-byaEk.rui-1zK8h.RgSo4", { waitUntil: "networkidle2" })
  await tab.waitFor(1000)
  await tab.waitForSelector(".rui-3sH3b.rui-1001X.rui-1zK8h._2_t7-.rui-3uQ0M")
  await tab.click("BUTTON[data-aut-id=emailLogin]", { waitUntil: "networkidle2" })
  
  await tab.waitForSelector(".rui-RcLUE", { visible: true })
  await tab.type(".rui-RcLUE","sewiwak816@mailcupp.com", { delay: 100 });
  await tab.click("button[type=submit] > span", { waitUntil: "networkidle2" })
  
  await tab.waitForSelector(".rui-RcLUE", { visible: true })
  await tab.type("#password","123456@a", { delay: 100 });
  await tab.click("button[type=submit] > span", { waitUntil: "networkidle2" })
  
  await tab.waitForSelector("div[data-aut-id=btnSearch]", { visible: true })
  await tab.waitFor(2000)
  await tab.type("input[data-aut-id=searchBox]","iphone-11", { delay: 100 })
  await tab.click("._3b3oR", { waitUntil: "networkidle2" })

  await tab.waitFor(10000);
  await autoScroll(tab);
await tab.screenshot({ path: 'screenshot.png', fullPage: true })

await browser.close();
  }catch(err){
      console.log(err);
  }
  console.log("CHECK YOUR CODE FOLDER FOR THE SCREEENSHOT");

})();

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 2000;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}