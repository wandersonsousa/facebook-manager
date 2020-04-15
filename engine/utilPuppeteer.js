const puppeteer = require('puppeteer-core')
const db = require('../renderer.js')
const BROWSER_PATH = db.get('settings').get('browserPath').value()

const pupapi = {
    headlessOpt: null,
    browser: null,
    page: null,
    waitOpt: 'networkidle2',
    options: {visible:true, timeout:0},
    puppeteer:puppeteer,

    init: async (headlessOpt) => {
        //instancia o browser e inicia uma page, ambas sao variaveis globais da api
        pupapi.headlessOpt = headlessOpt
        
        pupapi.browser = await puppeteer.launch(
            {
                headless: pupapi.headlessOpt,
                executablePath: BROWSER_PATH,
                args: ['--start-maximized'],
            }
        )
        pupapi.page = (await pupapi.browser.pages())[0]
    },

    gotoPage: async (url, optWait = pupapi.waitOpt) => {
        //vai pra pagina e espera evento, por padrao espera que a pagina seja carregada
        await pupapi.page.goto(url, { waitUntil: optWait })
    },


    getElement: async (selector) => {
        //pega elemento e retorna pra uma variavel
        return await pupapi.page.$$( selector )
    },

    getElements: async(selector) => {
        return await pupapi.page.$$( selector )
    },


    waitAndGetEl: async (selector, options = pupapi.options) => {
        //espera ate que o elemento apareca na tela pra pegar, vem com opcoes padroes de timeout, sempre que puder use esse metodo ao getElement
        await pupapi.page.waitForSelector(selector, options)
        return await pupapi.getElement(selector)
    },


    getElAndWaitClick: async (selector, options = pupapi.options ) => {
        await pupapi.page.waitForSelector(selector, options)
        await pupapi.page.click(selector, { delay: Math.random() * 10 })
    },


    getElAndWaitTap: async (selector, options = pupapi.options) => {
        await pupapi.page.waitForSelector(selector, options)
        await pupapi.page.tap(selector)
    },


    getElAndClickWait: async (selector, waitOpt = pupapi.waitOpt, options =  pupapi.options) => {
        //espera ate que o elemento apareca na tela pra pegar, entao clica e espera ate que a proxima pagina seja carregada
        await pupapi.page.waitForSelector(selector, options)
        await pupapi.page.click( selector, { delay: Math.random() * 10 } )
        await pupapi.page.waitForNavigation({ waitUntil: waitOpt })
    },


    getElAndClearType: async (selector, text, options = pupapi.options) => {
        await pupapi.page.waitForSelector(selector, options)
        await pupapi.clearAndType(selector, text)
    },


    clickAndWait: async (selector, waitOpt = pupapi.waitOpt) => {
        //clica e espera evento, por padrao espera que a nova pagina seja carregada, recomendado pra botoes que levem a outras paginas
        await pupapi.page.click( selector, { delay: Math.random() * 10 } )
        await pupapi.page.waitForNavigation({ waitUntil: waitOpt })
    },


    clearAndType: async (selector, text) => {
        //limpa um campo de texto com a tecnica de clicar tres vezes e digitar, uso math random  pra fazer um delay mais realista
        await pupapi.page.click(selector, { clickCount: 3, delay: Math.random() * 20 } )
        await pupapi.page.type(selector, text, { delay: Math.random() * 120 });
    }
    ,
    minimizeBrowser: async () => {
        //usado pra minimizar o browser
        const session = await pupapi.page.target().createCDPSession();
        const { windowId } = await session.send('Browser.getWindowForTarget');
        await session.send('Browser.setWindowBounds', { windowId, bounds: { windowState: 'minimized' } })
    }
}



module.exports = pupapi