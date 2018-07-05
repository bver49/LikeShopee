const Nightmare = require('nightmare')
const nightmare = Nightmare({
    show: true
})
var userid = '';
var pw = '';

var mall = "https://shopee.tw/shopee24h";
nightmare.goto(mall)
    .wait('.shopee-svg-icon.icon-like-2')
    .click('.shopee-svg-icon.icon-like-2')
    .wait(2000)
    .type('.shopee-authen .input-with-status__input[type=text]', userid)
    .type('.shopee-authen .input-with-status__input[type=password]', pw)
    .wait(2000)
    .click('.shopee-authen .shopee-button-solid.shopee-button-solid--primary')
    .wait(25000)
    .evaluate(function () {
        var items = document.querySelectorAll('.shopee-svg-icon.icon-like-2');
        return items.length;
    })
    .then(async function (amount) {
        console.log("Total " + amount + " items");
        for (var i = 0 ; i < amount ; i++) {
            await like(nightmare, amount, i);
        }
        console.log('Done');
    });

function like(nightmare, amount, index) {
    return new Promise(function(res ,rej) {
        nightmare.click('.shopee-svg-icon.icon-like-2').wait(1000).then(function () {
            res();
        });
    });
}