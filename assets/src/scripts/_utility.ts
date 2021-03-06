/**
 * @fileoverview _utility.ts
 *
 * @require  jquery1.8.3.js:above
 * @version  1.1.7
 * @update   2016/09/04
 */

/// <reference path="../../typings/index.d.ts" />

'use strict';
import Config from './_config.ts';

/* ------------------------------------------------
*
* INTERFACE
*
*
------------------------------------------------ */
interface Window {
  requestAnimFrame: any; 
  cancelRequestAnimFrame: any;
  [key: string]: any;
}
declare var window: Window;

interface NumbersAndStringsAndObjects {
  [key: string]: any;
}

namespace Utility {
  /* ------------------------------------------------
  *
  * CONFIGURATION
  *
  *
  ------------------------------------------------ */
  export let configuration = {
    'pcWidth': 1020,
    'tbWidth': 640,
    'spWidth': 480,
    'defaultFontSize': 100,
    'ratio': 0,
    'globalScene': '',
    'scrollableElement': '',
    'animationProgress': {}
  };

  configuration.scrollableElement = (function() {
    let html = $('html'),
      top = html.scrollTop();
    let elm = $('<div/>').height(10000).prependTo('body');
    html.scrollTop(10000);
    let rs = !!html.scrollTop();
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
  export class WindowStatusOperator {
    constructor() {

    }

    public android(): boolean {
      return (/Android/i).test(navigator.userAgent);
    }

    public blackBerry(): boolean {
      return (/BlackBerry/i).test(navigator.userAgent);
    }

    public playBook(): boolean {
      return (/PlayBook/i).test(navigator.userAgent);
    }

    public iOS(): boolean {
      return (/iPhone|iPad|iPod/i).test(navigator.userAgent);
    }

    public operaPhone(): boolean {
      return (/Opera Mini/i).test(navigator.userAgent);
    }

    public windowsPhone(): boolean {
      return (/IEMobile/i).test(navigator.userAgent);
    }

    public anyMobile(): boolean {
      let this_ = this;
      return (this_.android() || this_.blackBerry() || this_.playBook() || this_.iOS() || this_.operaPhone() || this_.windowsPhone());
    }

    public IE(): boolean {
      return ((/(msie|MSIE)/i).test(navigator.userAgent) || (/(T|t)rident/i).test(navigator.userAgent));
    }

    public TOUCH(): boolean {
      return (typeof document.ontouchstart !== 'undefined');
    }
  }

  /* ------------------------------------------------
  *
  * StringOperator
  *
  *
  ------------------------------------------------ */
  export class StringOperator {
    constructor() {

    }

    public trim(
      targetString: string,
      maxNumber: number,
      replaceString: string = '...'
    ): string {
      let trimString:string;
      if (targetString !== null && targetString !== '') {
        if (maxNumber < targetString.length) {
          let tempString = targetString.substr(0, maxNumber) + replaceString;
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
    }
  }

  /* ------------------------------------------------
  *
  * DialogOperator
  *
  *
  ------------------------------------------------ */
  export class DialogOperator {
    private configuration_ = {
      'viewport': window,
      'container': '#container',
      'background': '.modal-window-area',
      'close': '.modal-close',
      'mask': '.mask',
      'centering': true,
      'topMargin': 15,
      'tabletThreshold': configuration.tbWidth,
      'spThreshold': configuration.spWidth,
      'fitTimerID': -1
    };

    constructor(option: {} = {}) {
      let this_ = this;
      $.extend(this_.configuration_, option);
    }

    public showDialog(option: {} = {}): void {
      let this_ = this;
      let mergedConfiguration = $.extend(this_.configuration_, option);
      let viewport = mergedConfiguration.viewport;
      let container = mergedConfiguration.container;
      let bg = mergedConfiguration.background;
      let closeBtn = mergedConfiguration.close;
      let mask = mergedConfiguration.mask;
      let dialog = mergedConfiguration.dialogID;

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
            adjustTop = adjustTop - (adjustTop + $(dialog).outerHeight() -  $(container).outerHeight())
          }

          $(dialog).css('margin-top', adjustTop);
        }

        adjustMaskHeight();
      }
      else {
        let adjustTop: number;
        let scrollTop: number;
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
        let timerCounter = 0;
        mergedConfiguration.fitTimerID = setInterval(function() {
          if ($(dialog).outerHeight() + mergedConfiguration.topMargin >= $(container).outerHeight()) {
            $(bg).find(mask).outerHeight($(dialog).outerHeight() + mergedConfiguration.topMargin * 2);
            // clearInterval(mergedConfiguration.fitTimerID);
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

      let currentView: string;
      let previousView: string;
      $(window).off('resize.dialog');
      $(window).on('resize.dialog', function(event) {
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
            let adjustTop = $(container).outerHeight() - $(dialog).outerHeight() * 1.2;
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
      $(dialog).find(closeBtn).on('click', function(event) {
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
      $(bg).find(mask).on('click', function() {
        $(bg).hide();
        $(dialog).hide();
        $(window).off('resize.dialog');
        clearInterval(mergedConfiguration.fitTimerID);

        if (typeof mergedConfiguration.onClosed === 'function') {
          mergedConfiguration.onClosed();
        }
      });
    }

    public closeDialog(option: {} = {}): void {
      let this_ = this;
      let mergedConfiguration = $.extend(this_.configuration_, option);

      let bg = mergedConfiguration.background;
      let dialog = mergedConfiguration.dialogID;

      $(bg).hide();
      $(dialog).hide();
      $(window).off('resize.dialog');
      clearInterval(mergedConfiguration.fitTimerID);

      if (typeof mergedConfiguration.onClosed === 'function') {
        mergedConfiguration.onClosed();
      }

    }
  }

  /* ------------------------------------------------
  *
  * CustomFunction
  *
  *
  ------------------------------------------------ */
  export class CustomFunction {
    constructor() {

    }

    public getData(url: string): {} {
      let deferredObject: {
        resolve(data: {}): {},
        reject(): {},
        promise(): {}
      } = $.Deferred();
      $.ajax({
        url: url,
        dataType: 'json',
        cache: false,
        success: function(data) {
          deferredObject.resolve(data);
        },
        error: deferredObject.reject
      });
      return deferredObject.promise();
    }

    public isArray(
      obj: {
        length ? : number,
        nodeType ? : {},
        item ? : {}
      }
    ): boolean {
      return !(!obj ||
        (!obj.length || obj.length === 0) ||
        typeof obj !== 'object' ||
        !obj.constructor ||
        obj.nodeType ||
        obj.item
      );
    }

    public stringify(obj: NumbersAndStringsAndObjects): string {
      let this_ = this;
      let t: string = typeof(obj);
      let formatString: string;
      if (t !== "object" || obj === null) {
        if (t === "string") {
          formatString = '"' + obj + '"';
        }
        return String(formatString);
      }
      else {
        let n: string,
          v: {},
          json: string[] = [];
        let arr = (obj && this_.isArray(obj));
        for (n in obj) {
          v = obj[n];
          t = typeof(v);
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
    }
  }

}

export default Utility;

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
(function() {
  let lastTime = 0;
  let vendors:string[] = ['ms', 'moz', 'webkit', 'o'];
  for (let x = 0, limit = vendors.length; x < limit && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
      let currTime = new Date().getTime();
      let timeToCall = Math.max(0, 16 - (currTime - lastTime));
      let id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }

  window.requestAnimFrame = window.requestAnimationFrame;
  window.cancelRequestAnimFrame = window.cancelAnimationFrame;
  
})();

/* ------------------------------------------------
* 共通イベント
------------------------------------------------ */
(function() {
  var windowStatus = new Utility.WindowStatusOperator();

  $(function() {
    // スクロール
    $('a[href^="#"]').not('.no-scroll').click(function() {
      var speed = 800;
      var href = $(this).attr('href');
      var target = $(href === '#' || href === '' ? 'html' : href);
      if (target[0]) {
        var position = target.offset().top;
        Utility.configuration.animationProgress['scroll'] = true;
        $(Utility.configuration.scrollableElement).stop().animate({
          scrollTop: position
        }, speed, 'swing', function() {
          Utility.configuration.animationProgress['scroll'] = false;
        });
      }
      return false;
    });

    // ホバー
    if (!windowStatus.anyMobile()) {
      $(window).on('pseudoHover', function() {
        var targetElementClass = '.element-hover';

        $(targetElementClass).off('mouseenter.pseudoHover');
        $(targetElementClass).off('mouseleave.pseudoHover');

        $(targetElementClass).on('mouseenter.pseudoHover', function() {
            $(this).addClass('pseudo-hover');
          })
          .on('mouseleave.pseudoHover', function() {
            $(this).removeClass('pseudo-hover');
          });
      });
      $(window).trigger('pseudoHover');
    }
  });
}());
