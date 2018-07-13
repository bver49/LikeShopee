$(function() {
    const Nightmare = require("nightmare");
    var website = Nightmare({
        electronPath: require('./node_modules/electron'),
        show: true
    });

    var app = new Vue({
        el:"#app",
        data:{
            "website": website,
            "userid": "",
            "password": "",
            "mall": "",
            "status": 0,
            "errors": [],
            "logs": []
        },
        methods:{
            start: function() {
                app.errors = [];
                if (app.userid == "") {
                    app.errors.push("請輸入蝦皮帳號");
                }
                if (app.password == "") {
                    app.errors.push("請輸入蝦皮密碼");
                }
                if (app.mall == "") {
                    app.errors.push("請輸入蝦皮賣場網址");
                }
                if (app.errors.length == 0) {
                    app.status = 1;
                    start(app.website, app.userid, app.password, app.mall);
                }
            },
            stop: function() {
                app.website.end().then(function() {
                    console.log('Stop by user');
                    app.status = 0;
                });
            }
        }
    });

    function start(website, userid, pw, mall) {

        var likeBtnCSS = ".shopee-item-card .shopee-svg-icon.icon-like-2";
        var nextPageCSS = ".shopee-icon-button.shopee-icon-button--right";
        var inputUseridCSS = ".shopee-authen .input-with-status__input[type=text]";
        var inputPwCSS = ".shopee-authen .input-with-status__input[type=password]";
        var loginBtnCSS = ".shopee-authen .shopee-button-solid.shopee-button-solid--primary";
        var followBtnCSS = ".b2c-shop-name-action__follow .shopee-button-outline";

        website.goto(mall)
            .wait(likeBtnCSS)
            .click(likeBtnCSS)
            .wait(2000)
            .type(inputUseridCSS, userid)
            .type(inputPwCSS, pw)
            .wait(2000)
            .click(loginBtnCSS)
            .wait(20000)
            .evaluate(function(followBtnCSS) {
                var followBtn = document.querySelector(followBtnCSS);
                if (followBtn) {
                    followBtn.click();
                }
            }, followBtnCSS)
            .then(async function() {
                likeAllItems(website);
            });
    }

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
                            app.status = 0;
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
});
