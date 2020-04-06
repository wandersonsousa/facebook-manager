const fb = require('./facebook');
async function init(opt) {
    if (opt)
        await fb.initialize(opt.headless)

    if (opt.login)
        if (opt.login.twoFactors)
            await fb.manualLogin()
        else
            await fb.login(opt.login.email, opt.login.password)

    if (opt.downloadInformation)
        await fb.downloadInformation( opt.downloadInformation.format )

    if (opt.addNewEmail)
        await fb.config.addNewEmail(opt.addNewEmail.email)
       
    
}


module.exports = init