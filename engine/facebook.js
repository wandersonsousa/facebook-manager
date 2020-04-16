const util = require('./utilPuppeteer')

const BASE_URL = 'https://m.facebook.com/'
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
        await util.page.goto(BASE_URL + "login", {waitOpt:'networkidle2', timeout:0})
    },

    openNewPage: async() => {
        util.page = await util.browser.newPage()
        /*await console.log( (await util.browser.pages())[1] )
        util.page = (await util.browser.pages())[1]*/
        await util.page.goto(BASE_URL , {waitOpt:'networkidle2', timeout:0})
    },

    manualLogin: async () => {
        //TERMINADO
        //espera até que o usuário sair da tela de login e entrar na tela inicial
        if (util.headlessOpt == false) {
            await util.page.waitForSelector('div#feed_jewel', { visible: true, timeout: 0 })
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
        await util.getElAndClearType('#m_login_password', facebook.user.password)
        await util.getElAndClickWait('#u_0_4 > button')
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
    deleteActivityPhotosAndAlbuns: async () => {
        const urlPerfil = 'https://mbasic.facebook.com/profile.php'
        await util.gotoPage(urlPerfil)

        await util.page.waitForXPath('//div[@id="m-timeline-cover-section"]/div[3]/a[contains(text(), "Registro de Atividades")]')
        const [$btnToActivityHistory] = await util.page.$x('//div[@id="m-timeline-cover-section"]/div[3]/a[contains(text(), "Registro de Atividades")]')
        await $btnToActivityHistory.click( {delay:0.7} )
        await util.page.waitFor(2000)

        let $allActivity = await util.page.$$('section[id]')
        const  activityLength =  $allActivity.length
        let pos = 0
        for (let index = 0; index < activityLength; index++) {
            await util.page.reload()
            await util.page.waitFor('section[id]', {visible:true, timeout:0})
            $allActivity = await util.page.$$('section[id]')

            if( index === ( activityLength - 1) && $allActivity.length > 1 ){
                index--
            }                

            await console.log($allActivity)
            //excluir sempre a primeira atividade
            const $activity = $allActivity[pos]
            //logica para apagar
            if(!$activity){
                break
            }

            let findLink = await util.page.evaluate(
                (act) => {
                    let links = act.querySelectorAll('div > span > a')
                    if( links ){
                        for (const link of links) {
                            if(link.innerText == 'Excluir'){
                                link.click()
                                return true
                            }else if( link.innerText == 'Desfazer amizade'){
                                link.click()
                                return true
                            }else if( link.innerText == 'Ocultar na linha do tempo' ){
                                link.click()                    
                                return true
                            }else if(link.innerText == 'Descurtir'){
                                link.click() 
                                return true
                            }else{
                                return false             
                            }
                        }
                    }else{
                        return false
                    }     
                    
                }, $activity
            )
            
            await console.log( findLink )
            if( findLink ){
                await util.page.waitForNavigation({waitUntil:'load'})
            }else{
                pos++
            }
            
            
            
            
            
        
        }


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
        deleteAllMessages: async () => {
            let urlDeleteAllMessages = 'https://mbasic.facebook.com/messages'
            
            await util.page.goto( urlDeleteAllMessages, { waitUntil: 'networkidle2' } )
            
            let $all_messages_divs = await util.getElements('table td h3 a')
            let msg_length = $all_messages_divs.length

            for (let index = 0; index < msg_length; index++) {
                await util.page.waitFor('table td h3 a', {visible:true, timeout:0})
                $all_messages_divs = await util.page.$$('table td h3 a')

                if( index === ( msg_length - 1) && $all_messages_divs.length > 1 ){
                    index--
                }                

                await console.log($all_messages_divs)
                //excluir sempre a primeira mensagem
                const $msg = $all_messages_divs[0]
                await $msg.click({delay:0.5})

                await util.page.waitFor('input[name="delete"]')
                const $btnDelete = await util.page.$('input[name="delete"]')
                await $btnDelete.click( {delay:0.6} )

               
                await util.page.waitForXPath('//*[@id="root"]/div[1]/div[2]/a[2]')
                const [$btnConfirmDelete] = await util.page.$x('//*[@id="root"]/div[1]/div[2]/a[2]')

                await $btnConfirmDelete.click( {delay:0.7} )
                await util.page.waitForNavigation()
                
                
                await util.gotoPage( urlDeleteAllMessages )
            }
        },

    },

}

module.exports = facebook
