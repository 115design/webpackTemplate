/**
 * @fileoverview top/main.ts
 *
 * @require  jquery1.8.3.js:above
 * @version  1.1.7
 * @update   2016/09/04
 */

/// <reference path="../../../typings/index.d.ts" />

'use strict';
import Utility from '../_utility.ts';
// import $ = require('jquery');

(function() {
  var windowStatus = new Utility.WindowStatusOperator();

  $(function() {
    console.log(Utility.configuration);
    console.log(windowStatus.anyMobile());
  });

}());
