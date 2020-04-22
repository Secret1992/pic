// /*******************************************************************************
//  *
//  ******************************************************************************/
//
$(function () {
// 记录所有滑动器
    var wbht_arraySwiper = {};
    // var hashMap  = window.location.href.split('#');
    // if (hashMap.length > 1){
    //     $(".wbht_slider_housetype").attr('initIndex',1);
    // }
    // 总览-详情关联容器
    $(".wbht_slider_housetype").each(function () {
        var objectDirection = (null != $(this).attr("direction") ? $(this).attr("direction") : 'vertical');
        var initIndexHouseType = (null != $(this).attr("initIndex") ? $(this).attr("initIndex") : 0);
        wbht_buildSlider($(this), {
            initialSlide: initIndexHouseType,
            direction: objectDirection,
            paginationClickable: true,
            hashnav: true,
            observer: true,
            observeParents: true,
            // effect: 'flip',
            onSlideChangeStart: function (swiper) {
                if ('prev' == swiper.swipeDirection) {
                    $(".wbht_slider_floor").each(function () {
                        var floorController = $(this).attr('controller');
                        var floorSlider = wbht_arraySwiper[floorController];
                        if (floorSlider) {
                            var initIndex = $(this).attr('initIndex');
                            var slideindex = (initIndex >= 0 && initIndex < floorSlider.slides.length) ? initIndex : floorSlider.slides.length - 1;

                            floorSlider.slideTo(slideindex, 0, false);
                            wbht_updateSliderMenuAction(floorController, slideindex);
                        }
                    });
                }
            }
        });
    });

    // 总览菜单容器
    $(".wbht_slider_overview").each(function () {
        var objectDirection = (null != $(this).attr("direction") ? $(this).attr("direction") : 'horizontal');
        wbht_buildSlider($(this), {
            direction: objectDirection,
            paginationClickable: true,
            hashnav: true,
            observer: true,
            observeParents: true,
            onSlideChangeStart: function (swiper) {
                // 同步菜单高亮
                wbht_updateSliderMenuAction(swiper.container.attr("controller"), swiper.activeIndex);

                // 滑动详情到对应户型
                var detailContainer = swiper.container.parent().parent().find('.swiper-slide>.wbht_slider_detail');
                detailContainer.parent().attr('data-hash', swiper.activeIndex + 1);
                var controller = detailContainer.attr('controller');
                wbht_arraySwiper[controller].slideTo(swiper.activeIndex, 0, false);
            }
        });
    });

    // 详情切换户型容器
    $(".wbht_slider_detail").each(function () {
        var objectDirection = (null != $(this).attr("direction") ? $(this).attr("direction") : 'horizontal');
        wbht_buildSlider($(this), {
            direction: objectDirection,
            paginationClickable: true,
            hashnav: true,
            observer: true,
            observeParents: true,
            onSlideChangeStart: function (swiper) {
                // 同步菜单高亮
                wbht_updateSliderMenuAction(swiper.container.attr("controller"), swiper.activeIndex);

                var overviewContainer = swiper.container.parent().parent().find('.wbht_slider_overview');
                ;
                if (overviewContainer) {
                    //
                    var controller = overviewContainer.attr('controller');
                    wbht_arraySwiper[controller].slideTo(swiper.activeIndex, 0, false);
                    wbht_updateSliderMenuAction(controller, swiper.activeIndex);
                }
            }
        });
    });

    // 多层切换容器
    $(".wbht_slider_detail .wbht_slider_floor").each(function () {
        var objectDirection = (null != $(this).attr("direction") ? $(this).attr("direction") : 'vertical');
        var slideover = (null != $(this).attr("slideover") ? $(this).attr("slideover") : 'next_menu');
        wbht_buildSlider($(this), {
            direction: objectDirection,
            paginationClickable: true,
            onSlideChangeStart: function (swiper) {
                // 同步菜单高亮
                wbht_updateSliderMenuAction(swiper.container.attr("controller"), swiper.activeIndex);
            },
            onTransitionStart: function (swiper) {
                // 切换回总览
                if ('next_menu' == slideover) {
                    if (swiper.previousIndex == swiper.activeIndex && 'next' == swiper.swipeDirection) {
                        var housetypeController = $(".wbht_slider_housetype").attr('controller');
                        if (swiper.isEnd) {
                            wbht_arraySwiper[housetypeController].slideNext();
                        }
                    }
                } else if ('prev_menu' == slideover) {
                    if (swiper.previousIndex == swiper.activeIndex && 'prev' == swiper.swipeDirection) {
                        var housetypeController = $(".wbht_slider_housetype").attr('controller');
                        if (swiper.isBeginning) {
                            wbht_arraySwiper[housetypeController].slidePrev();
                        }
                    }
                } else if ('slider_detail' == slideover) {
                    var detailController = $(".wbht_slider_detail").attr('controller');
                    if (swiper.previousIndex == swiper.activeIndex && 'prev' == swiper.swipeDirection) {
                        if (swiper.isBeginning) {
                            wbht_arraySwiper[detailController].slidePrev();
                        }
                    } else if (swiper.previousIndex == swiper.activeIndex && 'next' == swiper.swipeDirection) {
                        if (swiper.isEnd) {
                            wbht_arraySwiper[detailController].slideNext();
                        }
                    }
                }
            }
        });
    });

    //
    $(".wbht_slider_menu>img").click(function () {
        var showIndex = $(this).index();
        //
        wbht_updateAction($(this));
        //
        var controller = $(this).parent().attr("controller");
        wbht_arraySwiper[controller].slideTo(showIndex, 1000, false);

        // 同步总览户型位置
        var detailContainer = wbht_arraySwiper[controller].container;
        if (detailContainer.hasClass('wbht_slider_detail')) {
            var overviewContainer = detailContainer.parent().parent().find('.swiper-slide>.wbht_slider_overview');
            //
            var controller = overviewContainer.attr('controller');
            wbht_arraySwiper[controller].slideTo(showIndex, 0, false);
            wbht_updateSliderMenuAction(controller, showIndex);
        }

        // 同步详细户型位置
        var overviewContainer = wbht_arraySwiper[controller].container;
        if (overviewContainer.hasClass('wbht_slider_overview')) {
            var detailContainer = overviewContainer.parent().parent().find('.swiper-slide>.wbht_slider_detail');
            var controller = detailContainer.attr('controller');
            wbht_arraySwiper[controller].slideTo(showIndex, 0, false);
            wbht_updateSliderMenuAction(controller, showIndex);
        }
    });

    // 点击按钮弹出图
    $('.wbht_item_button').click(function () {
        //
        var showsrc = $(this).attr('showsrc');
        if (showsrc) {
            if ($(this).attr('showname')) {
                var showname = $(this).attr('showname');
                $('.' + showname).remove();
                $(this).attr('showname', null);
                if ($(this).hasClass('wbht_autozoom')) {
                    $(this).removeClass('wbht_animation_zoom');
                }
            } else {
                // 生成唯一的class名，便于重新定位删除
                var showname = 'show_' + new Date().getTime();
                // 附加按钮参数
                $(this).attr('showname', showname);
                if ($(this).hasClass('wbht_autozoom')) {
                    $(this).addClass('wbht_animation_zoom');
                }
                // 显示图
                var showstyle = $(this).attr('showstyle');
                var showclass = $(this).attr('showclass');
                $(this).parent().append('<img class="wbht_item_button_show ' + showname + ' ' + showclass + '" src="' + showsrc + '" style="' + showstyle + '">');
                // 点击弹出图直接隐藏删除
                $('.wbht_item_button_show').click(function () {
                    //
                    $(this).remove();
                    //
                    var curObjectImage = $(this);
                    $('.wbht_item_button').each(function () {
                        if (curObjectImage.hasClass($(this).attr('showname'))) {
                            $(this).attr('showname', null);
                            if ($(this).hasClass('wbht_autozoom')) {
                                $(this).removeClass('wbht_animation_zoom');
                            }
                        }
                    });
                });
            }
        }
    });
    $('.wbht_item_button_single').click(function () {
        // 每次只显示一个，故要先清楚其他同类状态
        $('.wbht_item_button_single_show').remove();
        if ($(this).hasClass('wbht_autozoom')) {
            $('.wbht_item_button_single').removeClass('wbht_animation_zoom');
        }

        var showsrc = $(this).attr('showsrc');
        if (showsrc) {
            if ($(this).attr('showname')) {
                var showname = $(this).attr('showname');
                $('.' + showname).remove();
                $(this).attr('showname', null);
            } else {
                $('.wbht_item_button_single').attr('showname', null);

                var showname = 'wbht_item_button_single_show';
                // 附加按钮参数
                $(this).attr('showname', showname);
                if ($(this).hasClass('wbht_autozoom')) {
                    $(this).addClass('wbht_animation_zoom');
                }
                // 显示图
                var showstyle = $(this).attr('showstyle');
                var showclass = $(this).attr('showclass');
                $(this).parent().append('<img class="wbht_item_button_show ' + showname + ' ' + showclass + '" src="' + showsrc + '" style="' + showstyle + '">');
                // 点击弹出图直接隐藏删除
                $('.wbht_item_button_show').click(function () {
                    //
                    $(this).remove();
                    //
                    var curObjectImage = $(this);
                    $('.wbht_item_button_single').each(function () {
                        if (curObjectImage.hasClass($(this).attr('showname'))) {
                            $(this).attr('showname', null);
                            if ($(this).hasClass('wbht_autozoom')) {
                                $(this).removeClass('wbht_animation_zoom');
                            }
                        }
                    });
                });
            }
        }
    });

    /***************************************************************************
     * 辅助函数
     */

    // 更新按钮菜单状态
    function wbht_updateSliderMenuAction(controller, showIndex) {
        $(".wbht_slider_menu").each(function () {
            if (controller == $(this).attr('controller')) {
                $(this).children('img').each(function (index) {
                    if (index == showIndex) {
                        wbht_updateAction($(this));
                    }
                    ;
                });
            }
        });
    }

    // 切换同级元素高亮
    function wbht_updateAction(curActionElement) {
        // TODO：此高亮逻辑有点弱，必须要求图片同名加_h作为高亮

        // 清除旧状态
        var oldActionElement = curActionElement.parent().find('.action');
        oldActionElement.attr('src', oldActionElement.attr('src').replace('_h.', '.'));
        //更新Action
        curActionElement.addClass("action").siblings().removeClass("action");
        // 添加新高亮
        curActionElement.attr('src', curActionElement.attr('src').replace('.', '_h.'));
    }

    // 根据controller创建滑动器
    function wbht_buildSlider(objectSlider, paramSlider) {
        var controller = objectSlider.attr("controller");
        if (controller) {
            objectSlider.addClass(controller);
            var objectController = "." + controller;
            wbht_arraySwiper[controller] = new Swiper(objectController, paramSlider);
        }
    }

});