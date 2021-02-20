let puppeteer = require("puppeteer");
let fs = require("fs");
let searchePage = process.argv[3];
let numPosts = process.argv[4];
let metafile = process.argv[2];


(async function(){
    // ******************browser launch*********************
    let browser = await puppeteer.launch({
        headless : false,
        defaultViewport : null,
        args :["--incognito","--start-maximized"],
        slowMo : 250
    
    })
    let pages = await browser.pages();

    let page = pages[0];
    let data = await fs.promises.readFile(metafile);
                data=JSON.parse(data);
    let user = data.user;
    let pwd = data.pwd;
    let url = data.url;
    // ***************************login********************
    await page.goto(url,{ waitUntil : "networkidle2" });
    await page.waitForSelector("input[name=username]");

    await page.type("input[name=username]",user, {delay:120});
    await page.type("input[name=password]",pwd, {delay:120});

    await Promise.all([
        page.click(".sqdOP.L3NKy.y3zKF"),
        page.waitForNavigation({waitUntil:"networkidle2"})
    ]
    )

    // *********************page search********************
    await page.waitForSelector(".LWmhU._0aCwM input");
    await page.type( ".LWmhU._0aCwM input", searchePage );
    

 await page.waitForSelector( "div .fuqBx" );
 let searchResults=await page.$$( "div .fuqBx a" );
 

// ********************page link click*******************
await Promise.all([
    searchResults[0].click( "div .fuqBx a" ),
    page.waitForNavigation({ waitUntil:"networkidle2" })
]
)

// *******************post select************************

await page.waitForSelector( ".Nnq7C.weEfm" );

let posts=await page.$$( ".Nnq7C.weEfm div a" );
let post=posts[0];
    await Promise.all([
        await post.click(),
        page.waitForNavigation({ waitUntil:"networkidle2" })
    ]
    )
let i=0;
do{
    
    await page.waitForSelector(".fr66n button")
   
    await page.click(".fr66n button");
        
    await Promise.all([
        page.click(" ._65Bje.coreSpriteRightPaginationArrow "),
        //page.waitForNavigation({ waitUntil:" networkidle2 "})
    ]
    )
    i++;
    console.log( (i)+" Post liked" );
    

}while( i < numPosts )


    
})();