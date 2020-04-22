function initializeProcess( vel = 200 ) {

    function $(sel){
        return document.querySelector(sel)
    }

    function getClickBtnOpenMenu(){
        const $btnOpenMenu = $(' td a[aria-label="Mais"] ')
        if( $btnOpenMenu ){
            $btnOpenMenu.click()
            setTimeout( getClickOptionDelete, vel )
        }else{
            console.log('não encontrou álbum para apagar')
        }
        
    }

    function getClickOptionDelete(){
        let $optionDeleteInMenu = document.evaluate('//span[text()="Excluir álbum"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)

        $optionDeleteInMenu = $optionDeleteInMenu.singleNodeValue
        if( $optionDeleteInMenu ){
            $optionDeleteInMenu.click()
            setTimeout(getClickBtnConfirm, vel * 2)
        }else{
            console.log('não encontrou opção "Excluir álbum"')
        }
    }

    function getClickBtnConfirm(){
        let $btnConfirm = document.evaluate('//div[@role="dialog"]//button[contains(text(), "Excluir")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        
        $btnConfirm = $btnConfirm.singleNodeValue
        if($btnConfirm){
            $btnConfirm.click()
        }else{
            console.log('não encontrou botão de confirmar "Excluir"')
        }
    }

    getClickBtnOpenMenu()

}