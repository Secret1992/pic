/*******************************************************************************
 *
 ******************************************************************************/

$(function () {

    // 记录所有滑动器
    var wbps_arraySwiper = {};

    // 初始化滑动器
    $(".wbps_slider").each(function () {
        //
        var controller = $(this).attr("controller");
        if (controller) {
            //
            $(this).addClass(controller);
            //
            var objectController = "." + controller;
            var objectDirection = ( null != $(this).attr("direction") ? $(this).attr("direction") : 'vertical');
            wbps_arraySwiper[controller] = new Swiper(objectController, {
                direction: objectDirection,
                paginationClickable: true,
                onSlideChangeStart: function (swiper) {
                    // 同步菜单高亮
                    var sliderController = swiper.container.attr("controller");
                    $(".wbps_slider_menu").each(function () {
                        if (sliderController == $(this).attr('controller')) {
                            $(this).children('img').each(function (index) {
                                if (index == swiper.activeIndex) {
                                    wbps_updateMenuStatu($(this));
                                };
                            });
                        }
                    });
                    // 滑动强制重做动画
                    $("." + sliderController + ">.swiper-wrapper>.swiper-slide>img").each(function () {
                        if ($(this).hasClass("autorun")) {
                            var valClass = $(this).attr("class");
                            $(this).removeClass(valClass);
                            $(this).width();
                            $(this).addClass(valClass);
                        }
                    });
                }
                ,
                onTransitionStart: function (swiper) {
                    if (swiper.previousIndex == swiper.activeIndex) {
                        // 回溯上级滑动器，如果有则自动滑动到下一个兄弟
                        var slideObjectController = $("." + swiper.container.attr("controller"));
                        var parentController = slideObjectController.parent().parent().parent().attr("controller");
                        if ('prev' == swiper.swipeDirection) {
                            while (parentController) {
                                if (wbps_arraySwiper[parentController].isBeginning) {
                                    // 到达父容器的最前或最后，追溯更上一级父容器
                                    parentController = $('.' + parentController).parent().parent().parent().attr("controller");
                                } else {
                                    wbps_arraySwiper[parentController].slidePrev();
                                    parentController = null;
                                }
                            }
                        } else if ('next' == swiper.swipeDirection) {
                            while (parentController) {
                                if (wbps_arraySwiper[parentController].isEnd) {
                                    // 到达父容器的最前或最后，追溯更上一级父容器
                                    parentController = $('.' + parentController).parent().parent().parent().attr("controller");
                                } else {
                                    wbps_arraySwiper[parentController].slideNext();
                                    parentController = null;
                                }
                            }
                        }
                    }
                }
            });
        }
    });

    // 加入根据参数跳转滑动起功能，参数格式:param={controller},{index},{controller},{index}...
    var param = wbps_GetUrlParam(window.location.href, 'param');
    if ( param && param.length > 0 ) {
        var paramSplit = param.split(',');
        for (var index = 0; index < paramSplit.length; index+= 2) {
            var sliderController = paramSplit[index];
            var sliderIndex = paramSplit[index+1];
            $(".wbps_slider_menu").each(function () {
                if (sliderController == $(this).attr('controller')) {
                    $(this).children('img').each(function (index) {
                        if (index == sliderIndex) {
                            wbps_updateMenuStatu($(this));
                        };
                    });
                }
            });
            wbps_arraySwiper[sliderController].slideTo( sliderIndex, 0, false );
        }
    }

    //
    $(".wbps_slider_menu>img").click(function () {
        //
        wbps_updateMenuStatu($(this));
        //
        var controller = $(this).parent().attr("controller");
        wbps_arraySwiper[controller].slideTo($(this).index(), 1000, false);
    });

    // 点击按钮弹出图
    $('.wbps_item_button').click(function () {
        //
        var showsrc = $(this).attr('showsrc');
        if ( showsrc ) {
            if ($(this).attr('showname')) {
                var showname = $(this).attr('showname');
                $('.' + showname).remove();
                $(this).attr('showname', null);
                if ( $(this).hasClass('wbps_autozoom') ) {
                    $(this).removeClass('wbps_animation_zoom');
                }
            } else {
                // 生成唯一的class名，便于重新定位删除
                var showname = 'show_' + new Date().getTime();
                // 附加按钮参数
                $(this).attr('showname', showname);
                if ( $(this).hasClass('wbps_autozoom') ) {
                    $(this).addClass('wbps_animation_zoom');
                }
                // 显示图
                var showstyle = $(this).attr('showstyle');
                var showclass = $(this).attr('showclass');
                $(this).parent().append('<img class="wbps_item_button_show ' + showname + ' ' + showclass + '" src="' + showsrc + '" style="' + showstyle + '">');
                // 点击弹出图直接隐藏删除
                $('.wbps_item_button_show').click(function () {
                    //
                    $(this).remove();
                    //
                    var curObjectImage = $(this);
                    $('.wbps_item_button').each(function () {
                        if (curObjectImage.hasClass($(this).attr('showname'))) {
                            $(this).attr('showname', null);
                            if ( $(this).hasClass('wbps_autozoom') ) {
                                $(this).removeClass('wbps_animation_zoom');
                            }
                        }
                    });
                });
            }
        }
    });
    $('.wbps_item_button_single').click(function () {
        // 每次只显示一个，故要先清楚其他同类状态
        $('.wbps_item_button_single_show').remove();
        if ( $(this).hasClass('wbps_autozoom') ) {
            $('.wbps_item_button_single').removeClass('wbps_animation_zoom');
        }

        var showsrc = $(this).attr('showsrc');
        if ( showsrc ) {
            if ($(this).attr('showname')) {
                var showname = $(this).attr('showname');
                $('.' + showname).remove();
                $(this).attr('showname', null);
            } else {
                $('.wbps_item_button_single').attr('showname', null);

                var showname = 'wbps_item_button_single_show';
                // 附加按钮参数
                $(this).attr('showname', showname);
                if ( $(this).hasClass('wbps_autozoom') ) {
                    $(this).addClass('wbps_animation_zoom');
                }
                // 显示图
                var showstyle = $(this).attr('showstyle');
                var showclass = $(this).attr('showclass');
                $(this).parent().append('<img class="wbps_item_button_show ' + showname + ' ' + showclass + '" src="' + showsrc + '" style="' + showstyle + '">');
                // 点击弹出图直接隐藏删除
                $('.wbps_item_button_show').click(function () {
                    //
                    $(this).remove();
                    //
                    var curObjectImage = $(this);
                    $('.wbps_item_button_single').each(function () {
                        if (curObjectImage.hasClass($(this).attr('showname'))) {
                            $(this).attr('showname', null);
                            if ( $(this).hasClass('wbps_autozoom') ) {
                                $(this).removeClass('wbps_animation_zoom');
                            }
                        }
                    });
                });
            }
        }
    });

    /***************************************************************************
     * 辅助函数
     * TODO：此高亮逻辑有点弱，必须要求图片同名加_h作为高亮
     */
    // 更新按钮菜单状态
    function wbps_updateMenuStatu(curMenu) {
        // 清除旧状态
        var oldActionMenu = curMenu.parent().find('.action');
        oldActionMenu.attr('src', oldActionMenu.attr('src').replace('_h.', '.'));
        //更新Action
        curMenu.addClass("action").siblings().removeClass("action");
        // 添加新高亮
        curMenu.attr('src', curMenu.attr('src').replace('.', '_h.'));
    }

    function wbps_GetUrlParam(url, arg) {
        if ( '#' == url[url.length-1] ) {
            url = url.substr(0, url.length-1);
        }

        var urlSplit = url.split("?");
        if (urlSplit.length > 1) {
            var reg = new RegExp("(^|&)" + arg + "=([^&]*)(&|$)", "i");
            var result = urlSplit[1].match(reg);
            if (result != null) {
                return unescape(result[2]);
            }
        }
        return null;
    }

});