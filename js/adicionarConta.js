window.onload = () => {
    const db = require('../renderer')

    let $btnSalvar = document.querySelector('#btn_salvar')
    let $inputUsername = document.querySelector('#username')
    let $inputEmail = document.querySelector('#email')
    let $inputPassword = document.querySelector('#password')
    let salvo = false

    $btnSalvar.addEventListener('click', saveAccountInDB)

    function saveAccountInDB(e) {
        e.preventDefault()
        if (!validText($inputEmail.value)) {
            alert('Email inválido')
            return
        }
        if (!validText($inputPassword.value)) {
            alert('Senha Inválida')
            return
        }

        let id = db.get('contas').size().value()

        db.get('contas')
            .push({ id: id, email: $inputEmail.value, password: $inputPassword.value })
            .write()

        db.update('count', n => n + 1)
            .write()

        document.querySelector('#form_cadastro').reset()

        document.querySelector('#container-resp').innerText = 'Sucesso ao salvar !'
        setTimeout(sucess, 3000)
        function sucess() {
            document.querySelector('#container-resp').innerText = ''
        }
    }

    function validEmail(email) {
        return /^[\w+.]+@\w+\.\w{2,}(?:\.\w{2})?$/.test(email)
    }
    
    function validText(username) {
        return username !== '' && username !== ' '
    }
}