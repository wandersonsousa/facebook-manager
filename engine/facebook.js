const util = require('./utilPuppeteer')

const BASE_URL = 'https://m.facebook.com/'
const LOGIN_URL = 'https://mbasic.facebook.com/login'
const CONFIG_URL = BASE_URL + 'settings'
const PERFIL_URL = BASE_URL + 'profile/intro/edit/public/'

const facebook = {
    user: {
        username: null,
        password: null
    },
    browser: util.browser,

    initialize: async (headlessOpt = false) => {
        //TERMINADO
        util.headlessOpt = headlessOpt
        await util.init(util.headlessOpt)
        await util.page.goto(LOGIN_URL, {waitOpt:'networkidle2', timeout:0})
    },

    openNewPage: async() => {
        util.page = await util.browser.newPage()
        /*await console.log( (await util.browser.pages())[1] )
        util.page = (await util.browser.pages())[1]*/
        await util.page.goto(BASE_URL , {waitOpt:'networkidle2', timeout:0})
    },

    manualLogin: async (username, password) => {
        //TERMINADO
        facebook.user.username = username
        facebook.user.password = password

        await util.getElAndClearType('#m_login_email', facebook.user.username)
        await util.getElAndClearType('input[type="password"]', facebook.user.password)
        await Promise.all([
            util.page.waitFor('[name="login"]'),
            util.page.waitForNavigation(),
            util.page.click('[name="login"]')    
        ])
        //espera até que o usuário sair da tela de login e entrar na tela inicial
        if (util.headlessOpt == false) {
            await util.page.waitForSelector('div#m_newsfeed_stream', { visible: true, timeout: 0 })
            util.minimizeBrowser()
        } else {
            throw new Error('"manualLogin" expects "headlessOpt" in "initialize" to false')
        }

    },

    login: async (username, password) => {
        //TERMINADO
        facebook.user.username = username
        facebook.user.password = password

        await util.getElAndClearType('#m_login_email', facebook.user.username)
        await util.getElAndClearType('input[type="password"]', facebook.user.password)
        await Promise.all([
            util.page.waitFor('[name="login"]'),
            util.page.waitForNavigation(),
            util.page.click('[name="login"]')
            
            
          ])
        await util.gotoPage(BASE_URL)
       
    },


    downloadInformation: async (format) => {
        //TERMINADO
        //acessar pagina de download das informacoes
        const urlDownloadInformation = 'https://m.facebook.com/your_information'
        await util.gotoPage(urlDownloadInformation)
        await util.getElAndWaitClick('#u_0_o > div._24c7 > div:nth-child(2) > span > a')

        //desmarcar tudo button
        await util.getElAndWaitClick('#root > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > button')
        //marcar apenas comentarios
        await util.getElAndWaitClick('#root > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(4)')

        //pegando select de formato
        await util.getElAndWaitClick('#root > div > div > div:nth-child(2) > div:nth-child(4) > div._2uak._5hrm > select')

        if(format == 'JSON'){
            await util.page.select('select[name="format"]', 'JSON')
        }else {
            await util.page.select('select[name="format"]', 'HTML')
        }

        await util.getElAndClickWait('#root > div > div > div:nth-child(2) > div._3l2- > div > div > button')
    },



    deleteActivityPhotos: async( option = 0 ) =>{
        let urlDeleteAllMessages = selBtnDeletePhoto = selBtnConfirmDelete = null
        if( option === 0 ){
            urlDeleteAllMessages = 'https://www.facebook.com/profile.php?sk=photos_all'
            selBtnDeletePhoto = 'a[data-action-type="delete_photo"]'
            selBtnConfirmDelete = '//div[@role="dialog"]//button[contains(text(), "Excluir")]'
        }else if(option === 1){
            urlDeleteAllMessages = 'https://www.facebook.com/profile.php?sk=photos'
            selBtnDeletePhoto = 'a[data-action-type="remove_tag"]'
            selBtnConfirmDelete = '//div[@role="dialog"]//button[contains(text(), "OK")]'
        }
        await Promise.all(
            [
                util.page.waitForNavigation({waitUntil:'networkidle2', timeout:0}),
                util.page.goto(urlDeleteAllMessages)
            ]
        )

        async function hasBtnToMenuDelete(){
            try {
                await util.page.waitFor('div[role="tabpanel"] ul.fbStarGrid li.fbPhotoStarGridElement a[data-tooltip="Editar ou remover"]:not([aria-expanded="false"])',{timeout:20000})
                return true
            } catch (error) {
                return false
            }
        }

        async function hasInDom(sel){
            try {
                await util.page.waitFor(sel,{timeout:10000})
                return true 
            } catch (error) {
                return false
            }
        }

        async function hasInXDom(sel){
            try {
                await util.page.waitForXPath(sel, {timeout:10000})
                return true 
            } catch (error) {
                return false
            }
        }

        async function initDelete() {
            if( await hasBtnToMenuDelete() ){
                try {
                    let $btnOpenMenu = await util.page.$('div[role="tabpanel"] ul.fbStarGrid li.fbPhotoStarGridElement a[data-tooltip="Editar ou remover"]:not([aria-expanded="false"])')
                    if(option === 1){
                        await util.page.waitFor(1000)
                    }else{
                        await util.page.waitFor(800)
                    }
                    await $btnOpenMenu.click( {delay:0.8} )
                    await clickInOptDeleteThisPhoto() 
                } catch (error) {
                    await console.log( 'não conseguiu clicar no Btn abrir menu' )
                }
                  
            }else {
                await console.log('Sem fotos para deletar !')
            }  
        }

        async function clickInOptDeleteThisPhoto() {
            if( await hasInDom( selBtnDeletePhoto ) ){

                try {
                    let $btnDeletePhoto = await util.page.$( selBtnDeletePhoto )
                    if(option === 1){
                        await util.page.waitFor(1000)
                    }else{
                        await util.page.waitFor(800)
                    }
                    
                    await $btnDeletePhoto.click( {delay:0.8} )
                    await clickInBtnConfirmDelete()
                } catch (error) {
                    await console.log('não foi possivel clicar no "Btn excluir essa foto"')
                }

            }else{
                await console.log('opcao deletar foto nao encontrada')
            }
        }

        async function clickInBtnConfirmDelete(){
            if( await hasInXDom(selBtnConfirmDelete) ){
                let [$btnConfirm] = await util.page.$x(selBtnConfirmDelete)

                if(option === 1){
                    Promise.all([
                        util.page.waitForNavigation(),
                        $btnConfirm.click( {delay:0.8} )
                    ])
                }else{
                    await $btnConfirm.click( {delay:0.8} )
                }
                
                if(option === 1){
                    await util.page.waitFor(4000)
                }else {
                    await util.page.waitFor(2500)
                }
                
                if( await hasInDom('div[role="tabpanel"] ul.fbStarGrid li.fbPhotoStarGridElement a[data-tooltip="Editar ou remover"]:not([aria-expanded])') ){
                    await initDelete()
                }else{
                    await console.log('Sem fotos para deletar')
                }
                
            } else {
                await console.log('Não encontrou Btn confirmar exlusao')
            }
        }
        await initDelete()       
        await console.log('todas as fotos excluidas')
    },




    deleteAlbuns:async() => {
        const urlProfilePhotos = 'https://www.facebook.com/profile.php?sk=photos_albums'
        //pega todos os albuns que tem opcao de menu pra excluir
        //document.querySelectorAll('td a[aria-label="Mais"]')
        //usar script pra apagalos

        //pega todos os albuns que sobraram
        //document.querySelectorAll('[id*="collection_wrapper"] td a:not([aria-label="Mais"]):not([ajaxify])')
        //clica sobre o primeiro, espera carregar ,usar mesmo script de apagar photos nele
        //volta e clicar sobre o outro e assim por diante até terminar

        await Promise.all([
            util.page.goto(urlProfilePhotos),
            util.page.waitForNavigation({waitUntil:'networkidle2', timeout:0})
        ]) 

        try {
            await util.page.waitFor('td a[aria-label="Mais"]', {timeout:10000})
        } catch (error) {
            return 'Sem album pra deletar'
        }  
    },
    deleteAlbunsDISABLED: async() => {
        const urlProfilePhotos = 'https://www.facebook.com/profile.php?sk=photos_albums'
        await Promise.all([
            util.page.goto(urlProfilePhotos),
            util.page.waitForNavigation({waitUntil:'networkidle2', timeout:0})
        ])

        
        try {
            await util.page.waitFor('td a[aria-label="Mais"]')
        } catch (error) {
            return 'Sem album pra deletar'
        }

        $allMenuLinks = await util.page.$$('td a[aria-label="Mais"]')
        const menuLinksLength = $allMenuLinks.length
        let posFirstLinkClickable = 0
        for (let index = 0; index < menuLinksLength; index++) {
            $allMenuLinks = await util.page.$$('td a[aria-label="Mais"]')
            

            if( index === ( menuLinksLength - 1) && $allMenuLinks.length > 1 ){
                index--
            }  
            const $linkContext = $allMenuLinks[posFirstLinkClickable]

            if( !$linkContext ){
                break
            }

            let linkClicked = util.page.evaluate(
                ( btnForMenu )=>{
                    btnForMenu.click()
                    let idBtn = btnForMenu.id
                    let $optionsInMenu = document.querySelectorAll( 'div[data-ownerid="'+idBtn+'"] a[role="menuitem"]' )
                    for (const $opt of $optionsInMenu) {
                        if($opt.innerText === 'Excluir álbum'){
                            $opt.click()
                            return true
                        }
                    }
                }, $linkContext
            )

            if( linkClicked ){
                await util.page.waitFor('div.uiOverlayFooter button.layerConfirm', {visible:true,timeout:0})
                await util.page.click('div.uiOverlayFooter button.layerConfirm')    
                await util.page.waitFor(500)
                
                await util.page.reload({waitUntil:'load'})
            }else{
                posFirstLinkClickable++
            }
            
        }

        await console.log('Albuns deletados com sucesso !')
        //pega todos os botoes que abrem as opçoes dos albuns
        //'td a[aria-label="Mais"]'

        //pega a div de menu que corresponde ao botao
        //div.[data-ownerid="u_0_2y"]

    },
    config: {  
        changeName: async (newFirstName, newLastName) => {
            //TERMINADO
            const urlChangeName = CONFIG_URL + '/account/?name'
            await util.gotoPage(urlChangeName)

            await util.getElAndClearType('input[name="primary_first_name', newFirstName)
            await util.getElAndClearType('input[name="primary_middle_name"]', ' ')
            await util.getElAndClearType('input[name="primary_last_name"]', newLastName)
            await util.getElAndClickWait('button[name="save"]')

            await util.getElAndClearType('input[name="save_password"]', facebook.user.password)

            await util.getElAndClickWait('button[name="save"]')

        },


        configurePrivacity: async ( privacityPage = 0 ) => {
            let urlConfigurePrivacity = null
            if(privacityPage == 0){
                urlConfigurePrivacity = BASE_URL + 'privacy/touch/basic/'
            }else if(privacityPage == 1){
                urlConfigurePrivacity = BASE_URL + 'privacy/touch/timeline_and_tagging/'
            }
            
            

            await util.gotoPage(urlConfigurePrivacity)

            
            let $urlLinks = await util.page.$$('._55wo._55x2._56bf > div > div:nth-child(3) > a')
            let $links = null
            let $link = null
            let $options = null
            let $opt = null
            let $optHandle = null
            let $optValue = null
            let $optionName = null

            for (let indexOpt = 0; indexOpt < $urlLinks.length; indexOpt++){

                await util.page.waitFor(1000)

                $links = await util.page.$$('._55wo._55x2._56bf > div > div:nth-child(3) > a')

                $link = $links[indexOpt]

                await $link.click({delay:0.5})

                await console.log('questao: '+ (indexOpt + 1) )

                try {
                    await util.page.waitFor('fieldset', {visible:true, timeout:2000})
                    $options = await util.page.$$('fieldset label[data-sigil] div[id]')

                    for (let index = 1; index <= $options.length; index++) {
                        $opt = await util.page.$('fieldset label[data-sigil]:nth-child('+index+') div[id]' )
                        
                        $optHandle = await $opt.getProperty('innerText')
                        $optValue = await $optHandle.jsonValue()

                        if(indexOpt == 5 && privacityPage == 0){
                            await console.log($optValue)
                            if ($optValue === 'Seus amigos de amigos'){
                                await util.page.evaluate(( index ) => {
                                    let $radio = document.querySelector('fieldset label[data-sigil]:nth-child('+index+') input[type="radio"]' )
                                    let $divToClick = document.querySelector('fieldset label[data-sigil]:nth-child('+index+')')
    
                                    if($radio.checked == false){
                                        $divToClick.click()
                                    }
                            
                                }, index)
                                await console.log('selecionado com sucesso')
                                break
                            }
                        }
                        
                        if ($optValue === 'Somente eu'){

                            await util.page.evaluate(( index ) => {
                                let $radio = document.querySelector('fieldset label[data-sigil]:nth-child('+index+') input[type="radio"]' )
                                let $divToClick = document.querySelector('fieldset label[data-sigil]:nth-child('+index+')')

                                if($radio.checked == false){
                                    $divToClick.click()
                                }
                                

                            }, index)
                            await console.log('Selecionado com sucesso')
                            break
                            
                        }

                    } 
                } catch (error) {
                    await console.log(error)
                }
                await util.page.waitFor(1000)
                await util.gotoPage(urlConfigurePrivacity)
                
            }


            
        },



        addNewEmail: async (newEmail) => {
            //PRECISA CONFIRMAR
            const urlAddNewEmail = CONFIG_URL + '/email/'
            await util.gotoPage(urlAddNewEmail)

            await util.getElAndWaitClick('a#u_0_2')

            await util.getElAndClearType('input[name="email"]', newEmail)
            
            try {
                await util.page.waitForSelector('input[name="save_password"]', {visible: true, timeout:2000})
                await getElAndClearType('input[name="save_password"]', facebook.user.password)
            } catch (error) {
                await console.log('Sem botão de confirmação de senha')
            }

            await util.getElAndClickWait('button[name="save"]')

        },

        addNewPhone: {
            //PRECISA CONFIRMAR
            addPhone: async (newPhone) => {
                let urlAddNewPhone = BASE_URL + 'phoneacquire/?source=m_account'
                await facebook.gotoPage(urlAddNewPhone)

                let $inputAddPhone = await facebook.getElement('input[name="contact_point"]')
                await facebook.clearAndType($inputAddPhone, newPhone)

                let $btnContinue = await facebook.getElement('button#u_0_0')
                await $btnContinue.click()
            },

            confirmAutenticationCode: async (codeConfirmation) => {
                await facebook.page.waitForSelector('input[name="pin"]')
                let $inputCodeConfirm = await facebook.getElement('input[name="pin"]')
                await facebook.clearAndType($inputCodeConfirm, codeConfirmation)

                let $confirmAlteration = await facebook.getElement('button[value="Confirmar"]')
                await facebook.clickAndWait($confirmAlteration)
            }
        },
        deleteAllMessages:async()=>{
            let urlDeleteAllMessages = 'https://www.facebook.com/messages'
            await util.page.goto( urlDeleteAllMessages, { waitUntil: 'networkidle2', timeout:0 } )
            await util.page.evaluate(
                () => {
                    function initDelete( v1 = 100 ){
                        let v2 = v1 * 2
                        let v3 = v2 * 2
                    
                        let $ = (sel) => {return document.querySelector(sel) }
                    
                        var 
                            stepOne = function(){
                    
                                if (null !== $('div[aria-label="Ações de conversa"]')) {
                                    $('div[aria-label="Ações de conversa"]').click();
                                    //setTimeout(stepTwo, 100);
                                    setTimeout(stepTwo, v1);
                                } else {
                                    console.log('There are no messages to delete');
                                }
                            },
                            stepTwo = function(){
                                var elements = document.evaluate('//span[text()="Excluir"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                                for (var i = 0; i < elements.snapshotLength; i++) {
                                    elements.snapshotItem(i).click();
                                }
                                //setTimeout(stepThree, 150);
                                setTimeout(stepThree, v2);
                            },
                            stepThree = function(){
                                let btnConfirm = document.evaluate('//div[@role="dialog"]//button[contains(text(), "Excluir")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
                                btnConfirm.singleNodeValue.click()
                                if (null !== $('div[aria-label="Ações de conversa"]')) {
                                    //setTimeout(stepOne, 300);
                                    setTimeout(stepOne, v3);
                                } else {
                                    console.log('No more messages to delete');
                                }
                            };
                        
                        console.log('Script launching');
                        stepOne();
                        
                    }
                    initDelete()
                }
                
            )
        }






    }
}

module.exports = facebook
