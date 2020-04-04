const fb = require('./facebook');
async function init(options) {
    if (options)
        await fb.initialize(options.headless)

    if (options.login)
        if (options.login.twoFactors)
            await fb.manualLogin()
        else
            await fb.login(options.login.email, options.login.password)


    if (options.changeName)
        try {
            await fb.config.changeName(options.changeName.firstName, options.changeName.lastName)
        } catch (error) {
            console.log('nao deu')
        }

    if (options.addNewEmail)
        await fb.config.addNewEmail(options.addNewEmail.email)
}


module.exports = init