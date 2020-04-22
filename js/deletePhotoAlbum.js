/**
 * Auto Delete All Facebook Photos
 *
 * @link   github.com/wandersonsousa
 * @author Wanderson Sousa <wandersonsousa3004@gmail.com>
 */


function deletePhotoAlbum(v = 1000) {
    let $ = (sel) => { return document.querySelector(sel) }

    function findBtnToMenuDelete(){

        let btnOpenMenu = $('div[role="tabpanel"] a[data-tooltip="Editar ou remover"]')
        if( btnOpenMenu !== null ){
            btnOpenMenu.click()
            setTimeout( clickInOptDeleteThisPhoto , v)
        }else{
            console.log('There are no photos to delete')
        }
    }

    function clickInOptDeleteThisPhoto(){
        let btnDeletePhoto = $('a[data-action-type="delete_photo"]')
        btnDeletePhoto = btnDeletePhoto?btnDeletePhoto:$('a[data-action-type="delete_video"]')

        if( btnDeletePhoto ){
            btnDeletePhoto.click()
            setTimeout( clickInBtnConfirmDelete, v * 2 )
        }else{
            console.log('Not found action delete photo')
        }
    }

    function clickInBtnConfirmDelete() {
        let btnConfirm = document.evaluate('//div[@role="dialog"]//button[contains(text(), "Excluir")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        let btnConfirmVideo = document.evaluate('//div[@role="dialog"]//button[contains(text(), "Confirmar")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)

        btnConfirm = btnConfirm.singleNodeValue ? btnConfirm.singleNodeValue : btnConfirmVideo.singleNodeValue

        if(btnConfirm){
            btnConfirm.click()
        }else{
            console.log('Not Found Btn confirm role dialog')
        }      
    }

    findBtnToMenuDelete()
    
}


