/**
 * Auto Delete All Facebook Messages
 *
 * @link   github.com/wandersonsousa
 * @author Wanderson Sousa <wandersonsousa3004@gmail.com>
 */

function initDelete(v1 = 150) {
    let v2 = v1 * 2
    let v3 = v2 * 2

    let $ = (sel) => { return document.querySelector(sel) }

    var
        stepOne = function () {

            if (null !== $('div[aria-label="Ações de conversa"]')) {
                $('div[aria-label="Ações de conversa"]').click();
                setTimeout(stepTwo, v1);
            } else {
                console.log('There are no messages to delete');
            }
            console.log('Oiaisoasao')

        },
        stepTwo = function () {
            var elements = document.evaluate('//span[text()="Excluir"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (var i = 0; i < elements.snapshotLength; i++) {
                elements.snapshotItem(i).click();
            }
            //setTimeout(stepThree, 150);
            setTimeout(stepThree, v2);
        },
        stepThree = function () {
            let btnConfirm = document.evaluate('//div[@role="dialog"]//button[contains(text(), "Excluir")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            btnConfirm.singleNodeValue.click()
            if (null !== $('div[aria-label="Ações de conversa"]')) {
                //setTimeout(stepOne, 300);
                setTimeout(stepOne, v3);
            } else {
                console.log('No more messages to delete');
            }
        };

    console.log('Script launching');
    stepOne()

}


module.exports = initDelete