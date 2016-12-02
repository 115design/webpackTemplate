/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/scripts/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/*!*********************************!*\
  !*** ./src/scripts/top/main.ts ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview top/main.ts
	 *
	 * @require  jquery1.8.3.js:above
	 * @version  1.1.7
	 * @update   2016/09/23
	 */
	/// <reference path="../../../typings/index.d.ts" />
	'use strict';
	var _utility_ts_1 = __webpack_require__(/*! ../_utility.ts */ 178);
	(function (window) {
	    var windowStatus = new _utility_ts_1.default.WindowStatusOperator();
	    var dialog = new _utility_ts_1.default.DialogOperator();
	    $(function () {
	        function neutralize() {
	        }
	        function clear() {
	        }
	        function getDirection(e, obj) {
	            var w = $(obj).width();
	            var h = $(obj).height();
	            var x = (e.pageX - $(obj).offset().left - (w / 2)) * (w > h ? (h / w) : 1);
	            var y = (e.pageY - $(obj).offset().top - (h / 2)) * (h > w ? (w / h) : 1);
	            var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;
	            return direction;
	        }
	        ;
	        function getDirectionForSP(e, obj) {
	            var w = $(obj).width();
	            var h = $(obj).height();
	            if (event.touches === void 0) {
	                event.touches = event.originalEvent.touches;
	            }
	            if (event.touches.length === 1) {
	                var x = (event.touches[0].pageX - $(obj).offset().left - (w / 2)) * (w > h ? (h / w) : 1);
	                var y = (event.touches[0].pageY - $(obj).offset().top - (h / 2)) * (h > w ? (w / h) : 1);
	                var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;
	                return direction;
	            }
	            return null;
	        }
	        ;
	        function fit() {
	            neutralize();
	            clear();
	        }
	        /* ------------------------------------------------
	        * リサイズ
	        ------------------------------------------------ */
	        (function () {
	            var defaultSize = 1200;
	            var currentView = null;
	            var previousView = null;
	            $(window).on('resize', function () {
	                if ($(window).outerWidth() < _utility_ts_1.default.configuration.tbWidth) {
	                    currentView = 'SP';
	                }
	                else if ($(window).outerWidth() >= _utility_ts_1.default.configuration.tbWidth && $(window).outerWidth() < _utility_ts_1.default.configuration.pcWidth) {
	                    currentView = 'TABLET';
	                }
	                else {
	                    currentView = 'PC';
	                }
	                if (currentView === 'PC') { }
	                else if (currentView === 'TABLET') { }
	                else { }
	                fit();
	                if (currentView !== previousView) {
	                    if (currentView === 'PC') { }
	                    else if (currentView === 'TABLET') { }
	                    else { }
	                    previousView = currentView;
	                }
	            });
	            $(window).trigger('resize');
	        })();
	        /* ------------------------------------------------
	        * オリエンテーションチェンジ
	        ------------------------------------------------ */
	        (function () {
	            var previousStatus = null;
	            var currentStatus = null;
	            $(window).on('orientationchange', function () {
	                if (Math.abs(Number(window.orientation)) === 90) {
	                    currentStatus = 'horizontal';
	                }
	                else {
	                    currentStatus = 'vertical';
	                }
	                if (currentStatus !== previousStatus) {
	                    previousStatus = currentStatus;
	                }
	            });
	            $(window).trigger('orientationchange');
	        })();
	    });
	}(window));


/***/ },

/***/ 178:
/*!*********************************!*\
  !*** ./src/scripts/_utility.ts ***!
  \*********************************/
/***/ function(module, exports) {

	/**
	 * @fileoverview _utility.ts
	 *
	 * @require  jquery1.8.3.js:above
	 * @version  1.1.7
	 * @update   2016/09/04
	 */
	/// <reference path="../../typings/index.d.ts" />
	'use strict';
	var Utility;
	(function (Utility) {
	    /* ------------------------------------------------
	    *
	    * CONFIGURATION
	    *
	    *
	    ------------------------------------------------ */
	    Utility.configuration = {
	        'pcWidth': 1020,
	        'tbWidth': 640,
	        'spWidth': 480,
	        'defaultFontSize': 100,
	        'ratio': 0,
	        'globalScene': '',
	        'scrollableElement': '',
	        'animationProgress': {}
	    };
	    Utility.configuration.scrollableElement = (function () {
	        var html = $('html'), top = html.scrollTop();
	        var elm = $('<div/>').height(10000).prependTo('body');
	        html.scrollTop(10000);
	        var rs = !!html.scrollTop();
	        html.scrollTop(top);
	        elm.remove();
	        return rs;
	    }()) ? 'html' : 'body';
	    /* ------------------------------------------------
	    *
	    * WindowStatusOperator
	    *
	    *
	    ------------------------------------------------ */
	    var WindowStatusOperator = (function () {
	        function WindowStatusOperator() {
	        }
	        WindowStatusOperator.prototype.android = function () {
	            return (/Android/i).test(navigator.userAgent);
	        };
	        WindowStatusOperator.prototype.blackBerry = function () {
	            return (/BlackBerry/i).test(navigator.userAgent);
	        };
	        WindowStatusOperator.prototype.playBook = function () {
	            return (/PlayBook/i).test(navigator.userAgent);
	        };
	        WindowStatusOperator.prototype.iOS = function () {
	            return (/iPhone|iPad|iPod/i).test(navigator.userAgent);
	        };
	        WindowStatusOperator.prototype.operaPhone = function () {
	            return (/Opera Mini/i).test(navigator.userAgent);
	        };
	        WindowStatusOperator.prototype.windowsPhone = function () {
	            return (/IEMobile/i).test(navigator.userAgent);
	        };
	        WindowStatusOperator.prototype.anyMobile = function () {
	            var this_ = this;
	            return (this_.android() || this_.blackBerry() || this_.playBook() || this_.iOS() || this_.operaPhone() || this_.windowsPhone());
	        };
	        WindowStatusOperator.prototype.IE = function () {
	            return ((/(msie|MSIE)/i).test(navigator.userAgent) || (/(T|t)rident/i).test(navigator.userAgent));
	        };
	        WindowStatusOperator.prototype.TOUCH = function () {
	            return (typeof document.ontouchstart !== 'undefined');
	        };
	        return WindowStatusOperator;
	    }());
	    Utility.WindowStatusOperator = WindowStatusOperator;
	    /* ------------------------------------------------
	    *
	    * StringOperator
	    *
	    *
	    ------------------------------------------------ */
	    var StringOperator = (function () {
	        function StringOperator() {
	        }
	        StringOperator.prototype.trim = function (targetString, maxNumber, replaceString) {
	            if (replaceString === void 0) {
	                replaceString = '...';
	            }
	            var trimString;
	            if (targetString !== null && targetString !== '') {
	                if (maxNumber < targetString.length) {
	                    var tempString = targetString.substr(0, maxNumber) + replaceString;
	                    trimString = tempString;
	                }
	                else {
	                    trimString = targetString;
	                }
	                return trimString;
	            }
	            else {
	                return targetString;
	            }
	        };
	        return StringOperator;
	    }());
	    Utility.StringOperator = StringOperator;
	    /* ------------------------------------------------
	    *
	    * DialogOperator
	    *
	    *
	    ------------------------------------------------ */
	    var DialogOperator = (function () {
	        function DialogOperator(configuration) {
	            if (configuration === void 0) {
	                configuration = {};
	            }
	            this.configuration_ = {
	                'viewport': window,
	                'container': '#container',
	                'background': '.modal-window-area',
	                'close': '.modal-close',
	                'mask': '.mask',
	                'centering': true,
	                'topMargin': 15,
	                'tabletThreshold': 1010,
	                'spThreshold': 480,
	                'fitTimerID': -1
	            };
	            var this_ = this;
	            $.extend(this_.configuration_, configuration);
	        }
	        DialogOperator.prototype.showDialog = function (configuration) {
	            if (configuration === void 0) {
	                configuration = {};
	            }
	            var this_ = this;
	            var mergedConfiguration = $.extend(this_.configuration_, configuration);
	            var viewport = mergedConfiguration.viewport;
	            var container = mergedConfiguration.container;
	            var bg = mergedConfiguration.background;
	            var closeBtn = mergedConfiguration.close;
	            var mask = mergedConfiguration.mask;
	            var dialog = mergedConfiguration.dialogID;
	            $(bg).css('visibility', 'hidden').show();
	            $(dialog).css('visibility', 'hidden').show();
	            if ($(container).outerHeight() >= $(viewport).outerHeight()) {
	                $(bg).find(mask).outerHeight($(container).outerHeight());
	            }
	            else {
	                $(bg).find(mask).outerHeight($(viewport).outerHeight());
	            }
	            if ($(dialog).outerHeight() + mergedConfiguration.topMargin >= $(viewport).outerHeight()) {
	                $(container).css('top', 0);
	                $(dialog).css('margin-top', mergedConfiguration.topMargin);
	                if ($(dialog).outerHeight() + mergedConfiguration.topMargin >= $(container).outerHeight()) {
	                    $(bg).find(mask).outerHeight($(dialog).outerHeight() + mergedConfiguration.topMargin * 2);
	                }
	                else {
	                    $(bg).find(mask).outerHeight($(container).outerHeight());
	                    if (viewport === window) {
	                        scrollTop = $(window).scrollTop();
	                        adjustTop = scrollTop + $(window).outerHeight() / 2 - $(dialog).outerHeight() / 2;
	                    }
	                    else {
	                        scrollTop = Number(($(container).css('top').match(/(\d+)/) || [])[1]);
	                        adjustTop = scrollTop + $(window).outerHeight() / 2 - $(dialog).outerHeight() / 2;
	                    }
	                    if (scrollTop > adjustTop || !mergedConfiguration.centering) {
	                        adjustTop = scrollTop + mergedConfiguration.topMargin;
	                    }
	                    if (adjustTop + $(dialog).outerHeight() >= $(container).outerHeight()) {
	                        adjustTop = adjustTop - (adjustTop + $(dialog).outerHeight() - $(container).outerHeight());
	                    }
	                    $(dialog).css('margin-top', adjustTop);
	                }
	                adjustMaskHeight();
	            }
	            else {
	                var adjustTop = void 0;
	                var scrollTop = void 0;
	                if (viewport === window) {
	                    scrollTop = $(window).scrollTop();
	                    adjustTop = scrollTop + $(window).outerHeight() / 2 - $(dialog).outerHeight() / 2;
	                }
	                else {
	                    scrollTop = Number(($(container).css('top').match(/(\d+)/) || [])[1]);
	                    adjustTop = scrollTop + $(window).outerHeight() / 2 - $(dialog).outerHeight() / 2;
	                }
	                if (scrollTop > adjustTop || !mergedConfiguration.centering) {
	                    adjustTop = scrollTop + mergedConfiguration.topMargin;
	                }
	                $(dialog).css('margin-top', adjustTop);
	            }
	            if (typeof mergedConfiguration.onOpened === 'function') {
	                mergedConfiguration.onOpened(mergedConfiguration.topMargin * 2);
	            }
	            $(bg).css('visibility', 'visible').hide().fadeIn(400);
	            $(dialog).css('visibility', 'visible');
	            function adjustMaskHeight() {
	                var timerCounter = 0;
	                mergedConfiguration.fitTimerID = setInterval(function () {
	                    if ($(dialog).outerHeight() + mergedConfiguration.topMargin >= $(container).outerHeight()) {
	                        $(bg).find(mask).outerHeight($(dialog).outerHeight() + mergedConfiguration.topMargin * 2);
	                    }
	                    else {
	                        $(bg).find(mask).outerHeight($(container).outerHeight());
	                    }
	                    timerCounter++;
	                    if (timerCounter >= 50) {
	                        clearInterval(mergedConfiguration.fitTimerID);
	                    }
	                }, 200);
	            }
	            var currentView;
	            var previousView;
	            $(window).off('resize.dialog');
	            $(window).on('resize.dialog', function (event) {
	                if ($(viewport).outerWidth() > mergedConfiguration.tabletThreshold) {
	                    currentView = 'PC';
	                }
	                else if ($(viewport).outerWidth() <= mergedConfiguration.tabletThreshold &&
	                    $(viewport).outerWidth() > mergedConfiguration.spThreshold) {
	                    currentView = 'TABLET';
	                }
	                else {
	                    currentView = 'SP';
	                }
	                $(bg).find(mask).outerHeight($(container).outerHeight());
	                if (currentView !== previousView) {
	                    if ($(dialog).offset().top + $(dialog).outerHeight() >= $(container).outerHeight()) {
	                        var adjustTop = $(container).outerHeight() - $(dialog).outerHeight() * 1.2;
	                        $(dialog).css('margin-top', adjustTop);
	                        if ($(dialog).outerHeight() + mergedConfiguration.topMargin >= $(container).outerHeight()) {
	                            $(dialog).css('margin-top', mergedConfiguration.topMargin);
	                            $(bg).find(mask).outerHeight($(dialog).outerHeight() + mergedConfiguration.topMargin * 2);
	                        }
	                    }
	                    adjustMaskHeight();
	                    previousView = currentView;
	                }
	            });
	            $(dialog).find(closeBtn).off('click');
	            $(dialog).find(closeBtn).on('click', function (event) {
	                event.preventDefault();
	                $(bg).hide();
	                $(dialog).hide();
	                $(window).off('resize.dialog');
	                clearInterval(mergedConfiguration.fitTimerID);
	                if (typeof mergedConfiguration.onClosed === 'function') {
	                    mergedConfiguration.onClosed();
	                }
	            });
	            $(bg).find(mask).off('click');
	            $(bg).find(mask).on('click', function () {
	                $(bg).hide();
	                $(dialog).hide();
	                $(window).off('resize.dialog');
	                clearInterval(mergedConfiguration.fitTimerID);
	                if (typeof mergedConfiguration.onClosed === 'function') {
	                    mergedConfiguration.onClosed();
	                }
	            });
	        };
	        DialogOperator.prototype.closeDialog = function (configuration) {
	            if (configuration === void 0) {
	                configuration = {};
	            }
	            var this_ = this;
	            var mergedConfiguration = $.extend(this_.configuration_, configuration);
	            var bg = mergedConfiguration.background;
	            var dialog = mergedConfiguration.dialogID;
	            $(bg).hide();
	            $(dialog).hide();
	            $(window).off('resize.dialog');
	            clearInterval(mergedConfiguration.fitTimerID);
	            if (typeof mergedConfiguration.onClosed === 'function') {
	                mergedConfiguration.onClosed();
	            }
	        };
	        return DialogOperator;
	    }());
	    Utility.DialogOperator = DialogOperator;
	    /* ------------------------------------------------
	    *
	    * CustomFunction
	    *
	    *
	    ------------------------------------------------ */
	    var CustomFunction = (function () {
	        function CustomFunction() {
	        }
	        CustomFunction.prototype.getData = function (url) {
	            var deferredObject = $.Deferred();
	            $.ajax({
	                url: url,
	                dataType: 'json',
	                cache: false,
	                success: function (data) {
	                    deferredObject.resolve(data);
	                },
	                error: deferredObject.reject
	            });
	            return deferredObject.promise();
	        };
	        CustomFunction.prototype.isArray = function (obj) {
	            return !(!obj ||
	                (!obj.length || obj.length === 0) ||
	                typeof obj !== 'object' ||
	                !obj.constructor ||
	                obj.nodeType ||
	                obj.item);
	        };
	        CustomFunction.prototype.stringify = function (obj) {
	            var this_ = this;
	            var t = typeof (obj);
	            var formatString;
	            if (t !== "object" || obj === null) {
	                if (t === "string") {
	                    formatString = '"' + obj + '"';
	                }
	                return String(formatString);
	            }
	            else {
	                var n = void 0, v = void 0, json = [];
	                var arr = (obj && this_.isArray(obj));
	                for (n in obj) {
	                    v = obj[n];
	                    t = typeof (v);
	                    if (obj.hasOwnProperty(n)) {
	                        if (t === "string") {
	                            v = '"' + v + '"';
	                        }
	                        else if (t === "object" && v !== null) {
	                            v = this_.stringify(v);
	                        }
	                        json.push((arr ? "" : '"' + n + '":') + String(v));
	                    }
	                }
	                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
	            }
	        };
	        return CustomFunction;
	    }());
	    Utility.CustomFunction = CustomFunction;
	})(Utility || (Utility = {}));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Utility;
	/* ------------------------------------------------
	* ベンダー
	------------------------------------------------ */
	/* ------------------------------------------------
	* Alias requestAnimationFrame / cancelAnimationFrame
	* function loop() {
	*   timerID = requestAnimFrame(loop);
	* }
	* cancelRequestAnimFrame(timerID);
	------------------------------------------------ */
	(function () {
	    var lastTime = 0;
	    var vendors = ['ms', 'moz', 'webkit', 'o'];
	    for (var x = 0, limit = vendors.length; x < limit && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	    }
	    if (!window.requestAnimationFrame) {
	        window.requestAnimationFrame = function (callback) {
	            var currTime = new Date().getTime();
	            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	            var id = window.setTimeout(function () {
	                callback(currTime + timeToCall);
	            }, timeToCall);
	            lastTime = currTime + timeToCall;
	            return id;
	        };
	    }
	    if (!window.cancelAnimationFrame) {
	        window.cancelAnimationFrame = function (id) {
	            clearTimeout(id);
	        };
	    }
	    window.requestAnimFrame = window.requestAnimationFrame;
	    window.cancelRequestAnimFrame = window.cancelAnimationFrame;
	})();
	/* ------------------------------------------------
	* 共通イベント
	------------------------------------------------ */
	(function () {
	    var windowStatus = new Utility.WindowStatusOperator();
	    $(function () {
	        // スクロール
	        $('a[href^="#"]').not('.no-scroll').click(function () {
	            var speed = 800;
	            var href = $(this).attr('href');
	            var target = $(href === '#' || href === '' ? 'html' : href);
	            if (target[0]) {
	                var position = target.offset().top;
	                Utility.configuration.animationProgress['scroll'] = true;
	                $(Utility.configuration.scrollableElement).stop().animate({
	                    scrollTop: position
	                }, speed, 'swing', function () {
	                    Utility.configuration.animationProgress['scroll'] = false;
	                });
	            }
	            return false;
	        });
	        // ホバー
	        if (!windowStatus.anyMobile()) {
	            $(window).on('pseudoHover', function () {
	                var targetElementClass = '.element-hover';
	                $(targetElementClass).off('mouseenter.pseudoHover');
	                $(targetElementClass).off('mouseleave.pseudoHover');
	                $(targetElementClass).on('mouseenter.pseudoHover', function () {
	                    $(this).addClass('pseudo-hover');
	                })
	                    .on('mouseleave.pseudoHover', function () {
	                    $(this).removeClass('pseudo-hover');
	                });
	            });
	            $(window).trigger('pseudoHover');
	        }
	    });
	}());


/***/ }

/******/ });
//# sourceMappingURL=main.js.map