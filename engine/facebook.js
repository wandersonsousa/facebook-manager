const util = require('./utilPuppeteer')

const BASE_URL = 'https://m.facebook.com/'
const CONFIG_URL = BASE_URL + 'settings'
const PERFIL_URL = BASE_URL + 'profile/intro/edit/public/'

const facebook = {
    user: {
        username: null,
        password: null
    },

    initialize: async (headlessOpt = false) => {
        util.headlessOpt = headlessOpt

        await util.init(util.headlessOpt)
        await util.gotoPage(BASE_URL + "login")
    },

    manualLogin: async () => {
        //espera até que o usuário sair da tela de login e entrar na tela inicial
        if (util.headlessOpt == false) {
            await util.page.waitForSelector('div#feed_jewel', { visible: true, timeout: 0 })
            util.minimizeBrowser()
        } else {
            throw new Error('"manualLogin" expects "headlessOpt" in "initialize" to false')
        }

    },

    login: async (username, password) => {
        facebook.user.username = username
        facebook.user.password = password

        await util.getElAndClearType('#m_login_email', facebook.user.username)
        await util.getElAndClearType('#m_login_password', facebook.user.password)
        await util.getElAndClickWait('#u_0_4 > button')
        await util.gotoPage(BASE_URL)
    },
    downloadInformation: async () => {
        //acessar pagina de download das informacoes
        console.log('acessando pagina')
        const urlDownloadInformation = 'https://m.facebook.com/your_information'
        await util.gotoPage(urlDownloadInformation)
        await util.getElAndClickWait('#u_0_o > div._24c7 > div:nth-child(2) > span > a')

        //desmarcar tudo button
        await util.getElAndWaitClick('#root > div._7om2 > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > button')
        //marcar apenas comentarios
        await util.getElAndWaitClick('#root > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(4)')

    },
    config: {
        changeName: async (newFirstName, newLastName) => {
            const urlChangeName = CONFIG_URL + '/account/?name'
            await util.gotoPage(urlChangeName)

            await util.getElAndClearType('input[name="primary_first_name', newFirstName)
            await util.getElAndClearType('input[name="primary_middle_name"]', ' ')
            await util.getElAndClearType('input[name="primary_last_name"]', newLastName)
            await util.getElAndClickWait('button[name="save"]')

            await util.getElAndClearType('input[name="save_password"]', facebook.user.password)

            await util.getElAndClickWait('button[name="save"]')
        },
        addNewEmail: async (newEmail) => {
            const urlAddNewEmail = CONFIG_URL + '/email/'
            await util.gotoPage(urlAddNewEmail)

            await util.getElAndClickWait('div._55wr._8uir > a:nth-child(1)')
            await util.getElAndClearType('#m-settings-form > div:nth-child(4) > input._5whq.input', newEmail)

            await util.getElAndClickWait('button[name="save"]')
            //@TODO fazer verificacao pra quando deu certo e errado
        },
        addNewPhone: {
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
        changeImagePerfil: async () => {
            await facebook.gotoPage(PERFIL_URL)
            let $addImage = await facebook.getElement('div#u_0_4')
            await facebook.clickAndWait($addImage)

            await facebook.page.waitForSelector('button#nuxChoosePhotoButton', { visible: true })
            let $uploadImage = await facebook.getElement('button#nuxChoosePhotoButton')

            await $uploadImage.click()

            await facebook.page.waitForSelector(
                '#nuxUploadPhotoButton > div > button._134j.btn.btnC.largeBtn.mfsl.touchable',
                { visible: true, timeout: 0 }
            )

            let $confirmAlteration = await facebook.getElement('#nuxUploadPhotoButton > div > button._134j.btn.btnC.largeBtn.mfsl.touchable')

            await facebook.clickAndWait($confirmAlteration)

        },
    },

}

module.exports = facebook
