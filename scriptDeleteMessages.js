/**
 * Auto Delete All Facebook Messages
 *
 * @link   github.com/wandersonsousa
 * @author Wanderson Sousa <wandersonsousa3004@gmail.com>
 */
(function($){
    var 
        stepOne = function(){
            if (null !== $('div[aria-label="Ações de conversa"]')) {
                $('div[aria-label="Ações de conversa"]').click();
                setTimeout(stepTwo, 100);
            } else {
                console.log('There are no messages to delete');
            }
        },
        stepTwo = function(){
            var elements = document.evaluate('//span[text()="Excluir"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (var i = 0; i < elements.snapshotLength; i++) {
                elements.snapshotItem(i).click();
            }
            setTimeout(stepThree, 150);
        },
        stepThree = function(){
            let btnConfirm = document.evaluate('//div[@role="dialog"]//button[contains(text(), "Excluir")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            btnConfirm.singleNodeValue.click()
            if (null !== $('div[aria-label="Ações de conversa"]')) {
                setTimeout(stepOne, 300);
            } else {
                console.log('No more messages to delete');
            }
        };
    
    console.log('Script finished');
    stepOne();

    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("done!"), 200)
    })
    
})(function(sel){ return document.querySelector(sel); });