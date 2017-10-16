/**
 * @fileoverview top/main.ts
 *
 * @require  jquery1.8.3.js:above
 * @version  1.1.7
 * @update   2016/09/23
 */

/// <reference path="../../../typings/index.d.ts" />

'use strict';
import Utility from '../_utility.ts';
import Collection from '../_collection.ts';
import Loader from '../_loader.ts';

/* ------------------------------------------------
*
* INTERFACE
*
*
------------------------------------------------ */
interface Window {
  WebFontConfig: any;
  WebFont: any;
  [key: string]: any;
}
declare var window: Window;

interface NumbersAndStringsAndObjects {
  [key: string]: any;
}


(function(window) {
  let windowStatus = new Utility.WindowStatusOperator();
  let dialog = new Utility.DialogOperator();
  let currentView = null;
  let previousView = null;
  let currentStatus = null;
  let previousStatus = null;

  $(function() {

    function neutralize() {

    }

    function clear() {

    }

    function getDirection(e, obj) {
      var w = $(obj).width();
      var h = $(obj).height();
      var x = (e.pageX - $(obj).offset().left - (w / 2)) * (w > h ? (h / w) : 1);
      var y = (e.pageY - $(obj).offset().top  - (h / 2)) * (h > w ? (w / h) : 1);
      var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3)  % 4;
      return direction;
    };

    function getDirectionForSP(e, obj) {
      var w = $(obj).width();
      var h = $(obj).height();
      if (event.touches === void 0) {
        event.touches = event.originalEvent.touches;
      }
      if (event.touches.length === 1) {
        var x = (event.touches[0].pageX - $(obj).offset().left - (w / 2)) * (w > h ? (h / w) : 1);
        var y = (event.touches[0].pageY - $(obj).offset().top  - (h / 2)) * (h > w ? (w / h) : 1);
        var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3)  % 4;
        return direction;
      }
      return null;
    };

    function fit() {
      neutralize();
      clear();
    }

    /* ------------------------------------------------
    * リサイズ
    ------------------------------------------------ */
    (function() {
      $(window).on('resize', function() {
        if ($(window).outerWidth() < Utility.configuration.tbWidth) {
          currentView = 'SP';
        }
        else if ($(window).outerWidth() >= Utility.configuration.tbWidth && $(window).outerWidth() < Utility.configuration.pcWidth) {
          currentView = 'TABLET';
        }
        else {
          currentView = 'PC';
        }

        if (currentView === 'PC') {}
        else if (currentView === 'TABLET') {}
        else {}

        fit();

        if (currentView !== previousView) {

          if (currentView === 'PC') {}
          else if (currentView === 'TABLET') {}
          else {}
          previousView = currentView;
        }
      });
      $(window).trigger('resize');
    })();

    /* ------------------------------------------------
    * オリエンテーションチェンジ
    ------------------------------------------------ */
    (function() {
      $(window).on('orientationchange', function() {
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
