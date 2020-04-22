const fb = require('./facebook');
const configName = 'core principal'
async function init(opt, breakPage = false) {
    if( breakPage ){
        fb.breakPage()
        return
    }
    if( opt.openNewPage ){
        await app.addLog(configName, 'iniciando nova pagina')
        try {
            await fb.openNewPage()
            await app.addLog(configName, 'pagina carregada com sucesso')
        } catch (error) {
            await app.addLog(configName, 'falha ao carregar pagina')
        }
    }else{
        await app.addLog(configName, 'iniciando browser')
        await fb.initialize(opt.headless)
        /*if ( opt.login ){
            if (opt.login.twoFactors){
                await app.addLog(configName, 'digitando usuario e senha...')
                await fb.manualLogin(opt.login.email, opt.login.password)
                await app.addLog(configName, 'logado com sucesso')
            }else{
                await fb.login(opt.login.email, opt.login.password)
                await app.addLog(configName, 'logado com sucesso')
            }
        }*/
    }
    if (opt.downloadInformation){
        await fb.downloadInformation( opt.downloadInformation.format )
    }
    
    
    

    if( opt.changePrivacity ){
        await fb.config.configurePrivacity(privacityPage = 0)
        await fb.config.configurePrivacity(privacityPage = 1)
    }

    if (opt.addNewEmail){
        await fb.config.addNewEmail(opt.addNewEmail.email)
    }

    
    
    if( opt.deleteAllMessages ){
        await fb.config.deleteAllMessages()
    }

    //need be last
    if( opt.deleteActivityPhotos ){
        await fb.deleteActivityPhotos(0)
        await fb.deleteActivityPhotos(1)
        await app.addLog(configName, 'ETAPA TERMINADA !')
    }
    if( opt.deleteAlbuns){
        await fb.deleteAlbuns()
    }

}


module.exports = init