const fb = require('./facebook');
async function init() {
    await fb.initialize()
    await fb.login('ruandasilva273@gmail.com', 'Darksouls29')
    await fb.config.configurePrivacity()
}

init()
