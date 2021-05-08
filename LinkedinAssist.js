const puppeteer = require('puppeteer');
const id = "civora1143@dghetian.com";
const pass = "";

let companyName = process.argv.slice(2)[0];
let jobId = process.argv.slice(2)[1];
let jobLink = process.argv.slice(2)[2];
let linkToResume = "https://drive.google.com/file/d/1Mb56bElFtgGCmcsEY0WITg-8JIVQNkcW/view?usp=sharing";
(async () => {
  const browser = await puppeteer.launch({
      headless:false,
      defaultViewport: null,
    args: ["--start-maximized"],
    });
    let page = await browser.newPage();
    await page.goto('https://www.linkedin.com/');
    await page.waitForSelector('[autocomplete="username"]');
    await page.type('[autocomplete="username"]',id);
    await page.waitForSelector('[autocomplete="current-password"]');
    await page.type('[autocomplete="current-password"]',pass);
    await page.waitForTimeout(5000);
    await page.click('[data-tracking-control-name="homepage-basic_signin-form_submit-button"]');
    await page.waitForTimeout(5000);
    if(await page.$('.card-layout') !== null){
        page.click('[data-cie-control-urn="checkpoint_remember_me_save_info_no"]');
    }
    if(await page.$('.cp-card-new')!==null){
        page.click('.secondary-action');
    }
    await page.waitForSelector('[data-link-to="mynetwork"]');
    await page.click('[data-link-to="mynetwork"]');
    await page.waitForSelector('.ember-view.mn-community-summary__link.link-without-hover-state');
    let connectionButton = await page.$('.ember-view.mn-community-summary__link.link-without-hover-state');
    await connectionButton.click();
    await page.waitForSelector('[data-control-name="search_with_filters"]');
    await page.click('[data-control-name="search_with_filters"]');
    await page.waitForTimeout(3000);
    await page.waitForSelector('.search-global-typeahead__input.always-show-placeholder');
    await page.click('.search-global-typeahead__input.always-show-placeholder');
    await page.type('.search-global-typeahead__input.always-show-placeholder',companyName)
    await page.keyboard.press('Enter');
    await page.waitForSelector('.entity-result__title .app-aware-link');
    let connections = await page.$$('.entity-result__title .app-aware-link');
    let connectionLinks = [];
    for(let i=0;i<connections.length;i++){
        let link = await page.evaluate(function(elem){return elem.getAttribute("href");},connections[i]);
        connectionLinks.push(link);
    }
    
    await sendMessage(connectionLinks,page);
})();

async function sendMessage(links,page){
    for(let i=0;i<links.length;i++){
        await page.goto(links[i]);
        await page.waitForSelector('.message-anywhere-button.pvs-profile-actions__action.artdeco-button');
        await page.click('.message-anywhere-button.pvs-profile-actions__action.artdeco-button');
        await page.waitForTimeout(3000);
        let name = links[i].split('/')[4].split('-')[0];
        name = name.charAt(0).toUpperCase()+name.slice(1);
        let message = `Dear ${name}, 

        I am writing to enquire about the opening for Software Engineer.
        
        I offer 2+ years of professional  experience in web development, and would make me a strong candidate for this opening.
        The top portion of my attached resume highlights my career profile and four significant accomplishments that are also  in alignment with this position.
        
        It would be stupendous if you can refer me for this role if you feel I'd be a strong candidate for this or any other position in your organisation.
        
        Job id - ${jobId}
        Link- ${jobLink}
        Resume - ${linkToResume}

        Best Regards
        Arvind Sangwan`;
        if(await page.$('.msg-s-message-list.full-width.scrollable')===null){
            await page.waitForSelector('.msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.full-height.notranslate');
            await page.type('.msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.full-height.notranslate',message);
            await page.waitForSelector('.msg-form__send-button.artdeco-button.artdeco-button--1');
            await page.waitForTimeout(5000);
            await page.click('.msg-form__send-button.artdeco-button.artdeco-button--1');
            await page.waitForSelector('[aria-label="Attach a file to your conversation with "]')
        }
    }
}