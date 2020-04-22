var wbpz_moduleconfig = {
    support_css: '<link rel="stylesheet" href="./public/css/photoswipe.css">',
    support_js: "./public/css/photoswipe.min.js",
    controller: null,
    on_zooming: false
};

// 瀵瑰鎺ュ彛
function wbpz_zoomimage(srcImage, zoomStyle) {
    if (wbpz_moduleconfig.on_zooming) {
        return;
    }
    wbpz_moduleconfig.on_zooming = true;

    $.getScript(wbpz_moduleconfig.support_js, function() {
        var zoomImage = new Image();
        zoomImage.src = srcImage;
        zoomImage.onload = function() {
            // 鐢熸垚缂╂斁鎺т欢
            wbpz_moduleconfig.controller = new PhotoSwipe(
                $(".wspz_content")[0],
                null, [{ src: srcImage, w: zoomImage.width, h: zoomImage.height }], { history: false, focus: false }
            );

            $(".wbpz_button_back").css("display", "block");

            wbpz_moduleconfig.controller.init();

            wbpz_moduleconfig.controller.listen('close', function() {
                wbpz_moduleconfig.on_zooming = false;
            });

            if (zoomStyle) {
                $(".wspz_content").attr("style", zoomStyle);
            } else {
                $(".wspz_content").attr("style", "z-index: 9999998;");
            }
        }
    });
};


$(function() {

    // 鐣岄潰鎻忚堪
    $("head").append(wbpz_moduleconfig.support_css);
    $("body").append(
        '\
        <style>\
            .wbpz_button_back {\
                display: none;\
                position: absolute;\
                background: rgba(255, 255, 255, 0.6);\
                border-radius: 44px;\
                width: 38px;\
                height: 38px;\
                right: 6px;\
                top: 50px;\
                box-shadow: 0px 0px 1px 0px rgba(120, 120, 120, 1);\
                z-index: 9999999;\
            }\
            .wbpz_button_back>div {\
                position: absolute;\
                color: #007aff;\
                border-left: 3px solid; border-bottom: 3px solid;\
                border-radius: 5px;\
                width: 40%; \
                height: 40%;\
                top: 0;\
                bottom: 0;\
                left: 0;\
                right: 0;\
                margin: auto;\
                margin-left: 35%;\
                transform: rotate(45deg);\
            }\
        </style>\
        <div class="pswp wspz_content" tabindex="-1" role="dialog" aria-hidden="false">\
            <div class="pswp__bg"></div>\
            <div class="pswp__scroll-wrap">\
                <div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div>\
            </div>\
            <div class="wbpz_button_back"><div></div></div>\
        </div>'
    );

    $(".wbpz_button_back").click(function() {
        wbpz_moduleconfig.controller.close();
        wbpz_moduleconfig.on_zooming = false;
    });

    // 娣诲姞鍏ㄥ眬img宓屽叆
    $("img").click(function() {
        var zoomSrc = $(this).attr("zoomsrc");
        if (zoomSrc) {
            if (zoomSrc == "auto") {
                zoomSrc = $(this).attr("src");
            }
            wbpz_zoomimage(zoomSrc, $(this).attr("zoomstyle"));
        }
    });
});