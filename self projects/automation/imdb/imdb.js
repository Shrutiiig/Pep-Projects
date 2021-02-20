let cheerio = require("cheerio")
let puppeteer = require("puppeteer");
let fs = require("fs");
let request = require("request")
let wynkCred = process.argv[2];
let genre = process.argv[3];

(async function(){
    try{
        let data = await fs.promises.readFile(wynkCred);
        let { url, password, user } = JSON.parse(data);
        const browser = await puppeteer.launch(
            {
                headless :  false,
                slowMo : 50,
                defaultViewport: null,
                args: [ "--disable-notofications"]
    
            }
        );
        let tabs = await browser.pages();
         let tab = tabs[0]; 
        await tab.goto(url, { waitUntil: "networkidle0" });


        let signin =await tab.$("div._3cMNCrSVkxQhCkVs1JLIib.navbar__user.sc-kgoBCf.iTQkiJ a.ipc-button.ipc-button--single-padding.ipc-button--default-height.ipc-button--core-baseAlt.ipc-button--theme-baseAlt.ipc-button--on-textPrimary.ipc-text-button.imdb-header__signin-text")

        let href = await tab.evaluate(function (elem) {
            return elem.getAttribute("href");
          }, signin);
        
        await tab.goto("https://www.imdb.com"+href);

        let signinWithIMDB  = await tab.$("div.list-group a")

        let href1 = await tab.evaluate(function (elem) {
            return elem.getAttribute("href");
          }, signinWithIMDB);

        await tab.goto(href1);

        await tab.waitForSelector("input[type='email']", { visible: true });
        await tab.type('input[type="email"]',user, { delay: 50 });
        await tab.type('input[type="password"]',password, { delay: 50 });
        await Promise.all([tab.click('input[id="signInSubmit"]'), tab.waitForNavigation({ waitUntil: "networkidle0" })]);

        await tab.goto("https://www.imdb.com/feature/genre")

       await tab.goto(`https://www.imdb.com/search/title/?genres=${genre}&explore=title_type,genres&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=e0da8c98-35e8-4ebd-8e86-e7d39c92730c&pf_rd_r=1VNYX0ZGDF5FY2VVM2KD&pf_rd_s=center-2&pf_rd_t=15051&pf_rd_i=genre&ref_=ft_gnr_pr2_i_2`)
       
       var list_of_names = [];
       let movies  = await tab.$$("div.lister.list.detail.sub-list div.lister-list div.lister-item.mode-advanced div.lister-item-image.float-left a")

       for(let i=0; i<movies.length;i++){
           list_of_names.push(await tab.evaluate(function(el){
              return el.getAttribute("href")
           }, movies[i]))
        }

        let movieName  = await tab.$$("div.lister.list.detail.sub-list div.lister-list div.lister-item.mode-advanced div.lister-item-content h3 a")

        console.log(movieName.length);

        var list_of_movie = []
        for(let m of movieName){
            const element = await tab.evaluate( el => el.textContent, m);
            list_of_movie.push(element)
            

         }
        
        var top10_href = []
        for (let i = 0; i < 10; i++) {
            console.log(`${i+1 } ${list_of_movie[i]}`);
            top10_href.push(list_of_names[i]);
    
        }

        var pArr=[]
        for (let i = 0; i < top10_href.length; i++) {
            let newTab = await browser.newPage();
            let movieLinked = handleVideos(newTab, "https://www.imdb.com" + top10_href[i]);
            pArr.push(movieLinked)
            
        }
        
        
        
        
    }
    catch(Err){
        console.log(Err);
    }
})()

async function handleVideos(tab, link) {
    await tab.goto(link, { waitUntil: "networkidle0" })
    
    await tab.waitForSelector("div.uc-add-wl-button.uc-add-wl--not-in-wl.uc-add-wl button.ipc-button.uc-add-wl-button-icon--add.watchlist--title-main-desktop-standalone.ipc-button--core-base.ipc-button--single-padding.ipc-button--default-height", { visible: true });
    await tab.click("div.uc-add-wl-button.uc-add-wl--not-in-wl.uc-add-wl button.ipc-button.uc-add-wl-button-icon--add.watchlist--title-main-desktop-standalone.ipc-button--core-base.ipc-button--single-padding.ipc-button--default-height")
    
    await tab.close();
    }