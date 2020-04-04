const fb = require('./facebook');
async function init() {
    await fb.initialize()
    await fb.login('Wanderson3004@yandex.com', 'Darksouls29')
    await fb.downloadInformation()
}

init()
