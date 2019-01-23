$(document).ready(function () {
    function smallSlider(spec) {
        var that = {}

        that._tabs = $(spec.tabElement);
        that.margin = spec.margin;
        //that.over = spec.over;

        that._conteiners = that._tabs.children();
        that.currentTab = 0;
        that.sumWidth = 0;
        that.currentLeft = 0;
        that.oneTab;
        that.tabIndexes = [];
        that.currentIndex = 0;
        that.tabCount = 0;
        that.currentItem = that._conteiners.eq(that.currentIndex);
        that.currentHeight = that.currentItem.height();

        that.createSlider = function () {
            //if(over === undefined) {
            that.oneTab = that._tabs.parent().width();
            //} else {
            //    oneTab = _conteiners.width() + (margin * 2);
            //}
            that.sumWidth = 0;
            that.tabCount = that._conteiners.length;
            that._conteiners.each(function (index) {
                var _this = $(this);
                that.sumWidth += that.oneTab;
                var id = _this.attr('id');
                if(id === undefined) {
                    var prefix = spec.tabElement.substr(1, spec.tabElement.length);
                    id = prefix + '_tab-' + index;
                    _this.attr('id' ,id);
                    that.createDot('#' + id);
                }
                if (that.currentTab == 0) {
                    that.currentTab = id;
                }
                that.tabIndexes[id] = index;

                _this.css('width', (that.oneTab - (that.margin*2)) + 'px');
            });
            that.currentLeft = that.currentIndex * that.oneTab * -1;

            that._conteiners.css('float', 'left');
            if(that.margin != 0) {
                that._conteiners.css('margin-left', that.margin + 'px');
                that._conteiners.css('margin-right', that.margin + 'px');
            }

            that._tabs.css('margin-right', 'auto');
            that._tabs.css('margin-left', 'auto');
            that._tabs.css('width', that.sumWidth + 'px');
            that._tabs.css('position', 'relative');
            that._tabs.css('clear', 'both');
            that._tabs.css('overflow', 'hidden');
            that._tabs.css('left', that.currentLeft + 'px');
            that.currentHeight = that.currentItem.height();
            that._tabs.css('height', that.currentHeight + 'px');
            that.buttonVerticalCenter();
            that._tabs.parent().css('overflow', 'hidden');
            that._tabs.parent().css('display', 'block');

            that.setActiveDot(that.currentIndex);

            that.hideButton();
        };

        that.setPosition = function () {
            that.currentItem = that._conteiners.eq(that.currentIndex);
            that.currentHeight = that.currentItem.height();
            that.currentTab = that.currentItem.attr('id');
            that.currentLeft = that.currentIndex * that.oneTab * -1;

            that._tabs.css('height', that.currentHeight + 'px');
            that._tabs.css('left', that.currentLeft + 'px');

            that.setActiveDot(that.currentIndex);
            that.hideButton();
        };

        /******
         * Abstract Methods
         *
         * */
        that.hideButton = function () {};
        that.buttonVerticalCenter = function () {};
        that.createDot = function (id) {};
        that.setActiveDot = function (index) {};

        return that;
    }
    function inclPrevNaxt(spec) {
        /******************
         * parent function
         */
        var that = smallSlider(spec);

        that._next = $(spec.nextKey);
        that._prev = $(spec.prevKey);

        that._prev.click(function () {
            if (that.currentIndex <= 0) {
                return false
            }
            that.currentIndex--;
            that.setPosition();
            return false;
        });

        that._next.click(function () {
            if (that.currentIndex >= (that.tabCount - 1)) {
                return false
            }
            //if (that.over !== undefined) {
            //    if ((that.currentLeft * -1) >= (that.sumWidth - that._tabs.parent().width() - that.margin * 2)) {
            //        return false;
            //    }
            //}
            that.currentIndex++;
            that.setPosition();
            return false;
        });

        return that;
    }
    /****
     * Hide prev or next button
     *
     *
     */
    function inclHideButton(spec) {
        /******************
         * parent function
         */
        var that = inclPrevNaxt(spec);

        that.hideButton = function() {
            if(that.currentIndex == 0) {
                that._prev.hide();
            } else {
                that._prev.show();
            }
            //if (that.over !== undefined) {
            //    if ((that.currentLeft * -1) >= (that.sumWidth - that._tabs.parent().width() - that.margin * 2)) {
            //        that._next.hide();
            //        return false;
            //    }
            //}
            if(that.currentIndex >= that.tabCount-1) {
                that._next.hide();
            } else {
                that._next.show();
            }
        };

        return that;
    }
    /****
     * Set vertical center position for prev and next button
     *
     *
     */
    function inclButtonCenter(spec) {
        /******************
         * parent function
         */
        var that = inclHideButton(spec);

        that.buttonVerticalCenter = function () {
            that._next.css('top', that.currentHeight / 2 - (that._next.height() / 2));
            that._prev.css('top', that.currentHeight / 2 - (that._prev.height() / 2));
        };

        return that;

    }
    function inclDots(spec) {
        var that = smallSlider(spec);

        that.dotsBox = $(spec.dotsBox);
        that.dotsStyle = spec.dotsStyleClass;
        that.selectDotStyle = spec.selectDotStyleClass;

        that.createDot = function (id) {
            var a = $('<a>').addClass(that.dotsStyle).attr('href', id);
            that.dotsBox.append(a)
        };

        that.setActiveDot = function (index) {
            that.dotsBox.children().removeClass(that.selectDotStyle);
            that.dotsBox.children().eq(index).addClass(that.selectDotStyle);
        };

        that.dotsBox.on('click', 'a', function (index) {
            var href = $(this).attr('href');
            href = href.substr(1, href.length);
            that.currentIndex = that.tabIndexes[href];
            that.setPosition();

            return false;
        });

        return that;

    }

    $('.teamSlider').css('transition', 'all .5s');
    var tsl = inclPrevNaxt({
        tabElement: '.teamSlider',
        nextKey: '.teamSlideControl>.next',
        prevKey: '.teamSlideControl>.prev',
        margin: 0
    });
    tsl.createSlider();
    $(window).resize(function () {
        tsl.createSlider();
    });

    $('.testimonialSlides').css('transition', 'all .5s');
    var sl = inclDots({
        tabElement: '.testimonialSlides',
        dotsBox: '.dotsBox',
        dotsStyleClass: 'dot',
        selectDotStyleClass: 'activeDot',
        margin: 0
    });
    sl.createSlider();
    $(window).resize(function () {
        sl.createSlider();
    });



    function paralax(target, speed) {
        var element = $(target);
        var elementYPosition = element.position().top;
        element.css('background-position', 'center 0px');
        target = document.querySelector(target);
        window.addEventListener('scroll', function() {
            worker (target);
        });
        worker(target);

        function worker(target) {
            var targetPosition = {
                    top: window.pageYOffset + target.getBoundingClientRect().top,
                    left: window.pageXOffset + target.getBoundingClientRect().left,
                    right: window.pageXOffset + target.getBoundingClientRect().right,
                    bottom: window.pageYOffset + target.getBoundingClientRect().bottom
                },
                windowPosition = {
                    top: window.pageYOffset,
                    left: window.pageXOffset,
                    right: window.pageXOffset + document.documentElement.clientWidth,
                    bottom: window.pageYOffset + document.documentElement.clientHeight
                };

            if (targetPosition.bottom > windowPosition.top &&
                targetPosition.top < windowPosition.bottom &&
                targetPosition.right > windowPosition.left &&
                targetPosition.left < windowPosition.right) {

                element.css('background-position', 'center 0px');

                var pos = Math.floor((window.pageYOffset - elementYPosition) / speed);
                element.css('background-position', 'center ' + pos + 'px');
            }
        }
    };
    paralax('body>header', 2.8);




    // Fixed header
    //-----------------------------------------------
    function fixedHeader(selector, fixedClass) {
        var $navMenu = $(selector);
        var initPosition = $navMenu.position().top;
        var balast = $('<div id="balast">').css({
            'position': 'relative',
            'height': $navMenu.outerHeight()
        });

        $navMenu.css({
            'transition': 'all ease-in-out 0.3s'
        })

        $navMenu.wrap(balast);

        function worker() {
            if (($navMenu.length > 0)) {
                if(($(this).scrollTop() > initPosition) && (!$navMenu.hasClass(fixedClass))) {
                    $navMenu.addClass(fixedClass);
                } else if(($(this).scrollTop() < initPosition) && $navMenu.hasClass(fixedClass)) {
                    $navMenu.removeClass(fixedClass);
                }
            };
        }
        $(window).scroll(worker);
    }
    fixedHeader(".navigation",'navbar-fixed');


    // Anchor Scroller
    function anchorScroller(anchor) {
        var link = $('a[href="#' + anchor + '"]');
        var target = $('#' + anchor + '');
        link.click(function (e) {
            e.preventDefault();
            var body = $("html, body");
            body.stop().animate({scrollTop:target.offset().top},
                500, 'swing', function(){});
        });
        $(window).scroll(function() {
            var targetPosition = {
                    top: window.pageYOffset + target[0].getBoundingClientRect().top,
                    left: window.pageXOffset + target[0].getBoundingClientRect().left,
                    right: window.pageXOffset + target[0].getBoundingClientRect().right,
                    bottom: window.pageYOffset + target[0].getBoundingClientRect().bottom
                },
                windowPosition = {
                    top: window.pageYOffset,
                    left: window.pageXOffset,
                    right: window.pageXOffset + document.documentElement.clientWidth,
                    bottom: window.pageYOffset + document.documentElement.clientHeight
                };
            var viewportCenter = windowPosition.top + ((windowPosition.bottom - windowPosition.top) / 2);

            //if (targetPosition.bottom > windowPosition.top &&
            //    targetPosition.top < windowPosition.bottom &&
            //    targetPosition.right > windowPosition.left &&
            //    targetPosition.left < windowPosition.right) {
            if((targetPosition.bottom > viewportCenter || targetPosition.top > (windowPosition.top-10) ) &&
                targetPosition.top < viewportCenter) {
                /*console.log({
                    item : {tb : targetPosition.bottom, tt : targetPosition.top},
                    itemHeight : {h : targetPosition.bottom - targetPosition.top},
                    viewport: {wb : windowPosition.bottom, wt : windowPosition.top},
                    viewportHeight: {h : windowPosition.bottom - windowPosition.top},
                    viewportCenter: windowPosition.top + (windowPosition.bottom - windowPosition.top),
                });*/
                link.addClass('link__active');
            } else {
                link.removeClass('link__active');
            }
        });
    }
    anchorScroller('feature');
    anchorScroller('about');
    anchorScroller('team');
    anchorScroller('service');
    anchorScroller('portfolio');
    anchorScroller('contact');
});