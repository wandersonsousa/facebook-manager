const fb = require('./facebook');
async function init() {
    await fb.initialize()
    await fb.manualLogin('Wanderson3004@yandex.com', 'Darksouls29')
}

init()
