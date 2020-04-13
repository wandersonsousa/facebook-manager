const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)


db.defaults({ contas: [], session:[], count: 0 })
    .write()

//limpa a session

module.exports = db