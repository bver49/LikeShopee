$(function() {
    const Nightmare = require("nightmare");

    var likeBtnCSS = ".shop-search-result-view .shopee-item-card .shopee-svg-icon.icon-like-2";
    var nextPageCSS = ".shopee-icon-button.shopee-icon-button--right";
    var inputUseridCSS = ".shopee-authen .input-with-status__input[type=text]";
    var inputPwCSS = ".shopee-authen .input-with-status__input[type=password]";
    var loginBtnCSS = ".shopee-authen .shopee-button-solid.shopee-button-solid--primary";
    var followBtnCSS = ".section-seller-overview-horizontal__button button";

    $("#start").on("click", function(){
        var userid = $("#userid").val();
        var password = $("#password").val();
        var mall = $("#mall").val();
        $("#error").empty();
        var errors = [];
        if (userid == "") {
            errors.push("請輸入蝦皮帳號");
                }
        if (password == "") {
            errors.push("請輸入蝦皮密碼");
                }
        if (mall == "") {
            errors.push("請輸入蝦皮賣場網址");
                }
        if (errors.length == 0) {
            start(userid, password, mall);
        } else {
            for (var i in errors) {
                $("#error").append("<p>" + errors[i] + "</p>");
            }
        }
    });

    function start(userid, pw, mall) {
        var website = Nightmare({
            electronPath: require('./node_modules/electron'),
            waitTimeout: 300000,
            show: true
        });
        $("#stop").unbind("click");
        $("#stop").on("click", function(){
            website.end()
            .then(function() {
                log("使用者停止操作");
            });
        });
        website.goto(mall)
            .wait(likeBtnCSS)
            .click(likeBtnCSS)
            .wait(2000)
            .type(inputUseridCSS, userid)
            .type(inputPwCSS, pw)
            .wait(2000)
            .click(loginBtnCSS)
            .wait(30000)
            .scrollTo(3000, 0)
            .evaluate(function(followBtnCSS) {
                var followBtn = document.querySelector(followBtnCSS);
                if (followBtn) {
                    followBtn.click();
                }
            }, followBtnCSS)
            .then(async function() {
                log("開始按愛心!");
                likeAllItems(website, 1);
            }).catch(function(err){
                log(err);
            });
    }

    function likeAllItems(website, page) {
        website.evaluate(function(likeBtnCSS) {
            var items = document.querySelectorAll(likeBtnCSS);
            return items.length;
        }, likeBtnCSS)
        .then(async function(amount) {
            log("第" + page + "頁有 " + amount + " 個商品需要按愛心");
            for (var i = 0 ; i < amount ; i++) {
                await like(website);
            }
            log("第" + page + "頁處理完畢");
            page++;
            website.evaluate(function(nextPageCSS) {
                var nextPage = document.querySelectorAll(nextPageCSS);
                return nextPage.length > 0;
            }, nextPageCSS).then(function(hasNext) {
                if (hasNext) {
                    website.click(nextPageCSS)
                        .wait(likeBtnCSS)
                        .wait(5000)
                        .then(function() {
                            likeAllItems(website, page);
                        });
                } else {
                    website.end()
                        .then(function() {
                            log("此賣場按愛心完畢");
                        });
                }
            });
        }).catch(function(err){
            log(err);
        });
    }

    function like(website) {
        return new Promise(function(res) {
            website.click(likeBtnCSS).wait(1000).then(function() {
                res();
            }).catch(function(err){
                log(err);
            });
        });
    }

    function log(content) {
        $("#log").append("<p>" + content + "</p>");
    }
});
