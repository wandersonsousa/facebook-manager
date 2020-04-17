const fb = require('./facebook');
async function init(opt) {

    if( opt.openNewPage ){
        await fb.openNewPage()
    }else{
        await fb.initialize(opt.headless)
        if ( opt.login )
        if (opt.login.twoFactors)
            await fb.manualLogin(opt.login.email, opt.login.password)
        else
            await fb.login(opt.login.email, opt.login.password)
    }
    if (opt.downloadInformation){
        await fb.downloadInformation( opt.downloadInformation.format )
    }
    if( opt.deleteActivityPhotos ){
        await fb.deleteActivityPhotos()
    }
    if( opt.deleteAlbuns){
        await fb.deleteAlbuns()
    }

    if( opt.changePrivacity ){
        await fb.config.configurePrivacity(privacityPage = 0)
        await fb.config.configurePrivacity(privacityPage = 1)
    }
    if( opt.deleteAllMessages ){
        await fb.config.deleteAllMessages()
    }
    

    if (opt.addNewEmail){
        await fb.config.addNewEmail(opt.addNewEmail.email)
    }
    
}


module.exports = init