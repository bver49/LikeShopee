const Nightmare = require("nightmare");
const website = Nightmare({
    show: true
});

var userid = "";
var pw = "";
var mall = "https://shopee.tw/shopee24h";
var likeBtnCSS = ".shopee-svg-icon.icon-like-2";
var nextPageCSS = ".shopee-icon-button.shopee-icon-button--right";
var inputUseridCSS = ".shopee-authen .input-with-status__input[type=text]";
var inputPwCSS = ".shopee-authen .input-with-status__input[type=password]";
var loginBtnCSS = ".shopee-authen .shopee-button-solid.shopee-button-solid--primary";

website.goto(mall)
    .wait(likeBtnCSS)
    .click(likeBtnCSS)
    .wait(2000)
    .type(inputUseridCSS, userid)
    .type(inputPwCSS, pw)
    .wait(2000)
    .click(loginBtnCSS)
    .wait(25000)
    .then(async function() {
        likeAllItems(website);
    });

function likeAllItems(website) {
    website.evaluate(function(likeBtnCSS) {
        var items = document.querySelectorAll(likeBtnCSS);
        return items.length;
    }, likeBtnCSS)
    .then(async function(amount) {
        console.log("This page has total " + amount + " items");
        for (var i = 0 ; i < amount ; i++) {
            await like(website);
        }
        console.log('This page done');
        website.evaluate(function(nextPageCSS) {
            var nextPage = document.querySelectorAll(nextPageCSS);
            return nextPage.length > 0;
        }, nextPageCSS).then(function(hasNext) {
            if (hasNext) {
                website.click(nextPageCSS)
                    .wait(10000)
                    .then(function() {
                        likeAllItems(website);
                    });
            } else {
                website.end()
                    .then(function() {
                        console.log('All done');
                    });
            }
        });
    });
}

function like(website) {
    return new Promise(function(res) {
        website.click(likeBtnCSS).wait(1000).then(function() {
            res();
        });
    });
}