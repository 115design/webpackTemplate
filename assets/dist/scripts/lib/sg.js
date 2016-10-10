var sohga;
if (sohga === undefined) sohga = {};
if (sohga.common === undefined) sohga.common = {};

with(sohga.common) {
  with({ scope: function() { return this; } }) {
    with({ scope: scope(), ns: sohga.common }) {
      //
      // private 定数
      //
      scope.LOADING_TIMELIMIT_MS = 25000;
      //
      // private 変数
      //
      //scope.private = "private";
      scope.ajax_queue = [];
      scope.ajax_queue_wait = 0;
      scope.loading_timer_id = 0;
      scope.loading_wait_timer_id = 0;
      scope.loading_wait_dialog = null;
      scope.is_scroll_elem = null;

      //
      // private 関数
      //
      //scope.func = function() { };
      scope.on_loading_timelimit = function() {
        if (scope.loading_wait_dialog === null) {
          if (!ns.namespace('sohga.language.common.error_on_loading_timelimit').length) {
            sohga.language.common.error_on_loading_timelimit = 'アクセス過多のため、処理を中断された可能性があります。<br />お手間をお掛けして申し訳ありませんが、入力を破棄してページを再読み込みしてもよろしいですか？';
          }
          if (!ns.namespace('sohga.language.common.title_on_loading_timelimit').length) {
            sohga.language.common.title_on_loading_timelimit = '再読み込みの確認';
          }
          if (!ns.namespace('sohga.language.common.button_keep_on_loading_timelimit').length) {
            sohga.language.common.button_keep_on_loading_timelimit = 'さらに10秒待つ';
          }
          if (!ns.namespace('sohga.language.common.button_reload_on_loading_timelimit').length) {
            sohga.language.common.button_reload_on_loading_timelimit = 'ページを再読み込みする';
          }
          var btn = {};
          btn[ns.lang('common.button_keep_on_loading_timelimit')] = function() {
            ns.close($(this));
          };
          btn[ns.lang('common.button_reload_on_loading_timelimit')] = function() {
            location.reload();
          };
          scope.loading_wait_dialog = ns.dialog(ns.lang('common.error_on_loading_timelimit'), {
            title: ns.lang('common.title_on_loading_timelimit'),
            modal: true,
            resizable: false,
            width: 700,
            buttons: btn,
            close: function() {
              if (scope.loading_wait_timer_id > 0) {
                clearInterval(scope.loading_wait_timer_id);
                scope.loading_wait_timer_id = 0;
              }
              if (scope.loading_timer_id > 0) {
                scope.loading_wait_timer_id = setInterval(function() {
                  if (scope.loading_timer_id > 0) {
                    scope.on_loading_timelimit();
                  }
                }, 10000);
              }
            },
            keep_loading: true,
            autoOpen: false
          });
        }
        ns.open(scope.loading_wait_dialog);

      };

      scope.next_ajax_queue = function() {
        var do_dequeue = function() {
          scope.ajax_queue_wait--;
          scope.dequeue_ajax_queue();
        };
        if (scope.ajax_queue_wait > 2) {
          //蓄積が多い場合は遅延させる
          do_dequeue();
          //setTimeout(do_dequeue, 3000);
        }
        else {
          do_dequeue();
        }
      };
      scope.dequeue_ajax_queue = function() {
        var values = scope.ajax_queue.shift();
        if (!values) {
          return;
        }
        if (typeof values == 'function') {
          var self_play_queue = values(scope.next_ajax_queue);
          if (!self_play_queue) {
            scope.next_ajax_queue();
          }
        }
        else {
          var after_success = (typeof values.success == 'function') ? values.success : null;
          values._retried = false;
          values.success = function(data, dataType) {
            if (data && typeof data._retry != 'undefined') {
              //自動リトライ(IEのKeepAlive等のバグでPOSTが欠損する場合の対策)
              if (values._retried) {
                if (!ns.namespace('sohga.language.common.error_on_retry').length) {
                  sohga.language.common.error_on_retry = 'アクセスが集中しているため、処理が正常に終了しませんでした。<br />時間をおいて改めてアクセスをお願いいたします。<br /><br />(OKを押すと5秒後に自動で再読み込みいたします。)';
                }
                if (!ns.namespace('sohga.language.common.title_on_retry').length) {
                  sohga.language.common.title_on_retry = 'ご迷惑をおかけして申し訳ありません。';
                }
                ns.dialog(ns.lang('common.error_on_retry'), {
                  'modal': true,
                  'resizable': false,
                  'title': ns.lang('common.title_on_retry'),
                  'width': 700,
                  'moveToTop': true,
                  'close': function() {
                    setTimeout(function() {
                      location.reload();
                    }, 5000);
                  }
                });
                return;
              }
              values._retried = true;
              return $.ajax(values);
            }
            if (after_success !== null) {
              after_success(data, dataType);
            }
            scope.next_ajax_queue();
          };

          var after_error = (typeof values.error == 'function') ? values.error : null;
          values.error = function(jqXHR, textStatus, errorThrown) {
            if (after_error !== null) {
              after_error(jqXHR, textStatus, errorThrown);
              scope.next_ajax_queue();
              return;
            }

            //ネットワークをチェックし、不通ならダイアログを出して閉じるまで遅延
            if (jqXHR.readyState == 4 && textStatus != 'timeout' && ((typeof window.navigator.onLine === 'undefined') || window.navigator.onLine)) {
              ns.ajax_error(jqXHR, textStatus, errorThrown);
              scope.next_ajax_queue();
            }
            else {
              if (!ns.namespace('sohga.language.common.error_on_offline').length) {
                sohga.language.common.error_on_offline = 'インターネットに繋がっているか、ご確認ください。<br />(OKを押すと再度通信を試みます。)';
              }
              if (!ns.namespace('sohga.language.common.title_on_offline').length) {
                sohga.language.common.title_on_offline = '通信に失敗しました。';
              }
              ns.dialog(ns.lang('common.error_on_offline'), {
                'modal': true,
                'resizable': false,
                'title': ns.lang('common.title_on_offline'),
                'width': 700,
                'close': function() {
                  $.ajax(values);
                }
              });
            }
          };
          if (typeof values.timeout == 'undefined') {
            //15秒
            values.timeout = 15000;
          }

          $.ajax(values);
        }
      };
      //
      // public 変数
      //
      ns.public = "public";
      //
      // public メソッド
      //
      //$.ajax#error でcommonエラーダイアログ化などに使用
      ns.ajax_error = function(jqXHR, textStatus, errorThrown) {
        if (jqXHR.status == 401 || textStatus == 'parsererror') {
          if (!ns.namespace('sohga.language.common.error_on_logouted').length) {
            sohga.language.common.error_on_logouted = 'ログインの有効期限が切れています。<br />処理を中断しましたので、再度ログインください。<br /><br />(OKを押すと自動で再読み込みいたします。)';
          }
          if (!ns.namespace('sohga.language.common.title_on_logouted').length) {
            sohga.language.common.title_on_logouted = '安心してお使いいただくための対策';
          }
          ns.dialog(ns.lang('common.error_on_logouted'), {
            'modal': true,
            'resizable': false,
            'title': ns.lang('common.title_on_logouted'),
            'width': 700,
            'moveToTop': true,
            'close': function() {
              location.reload();
            }
          });
          return;
        }
        else if (jqXHR.responseText.indexOf("You don't have permission to access") > 0) {
          if (!ns.namespace('sohga.language.common.error_on_retry').length) {
            sohga.language.common.error_on_retry = 'アクセスが集中しているため、処理が正常に終了しませんでした。<br />時間をおいて改めてアクセスをお願いいたします。<br /><br />(OKを押すと5秒後に自動で再読み込みいたします。)';
          }
          if (!ns.namespace('sohga.language.common.title_on_retry').length) {
            sohga.language.common.title_on_retry = 'ご迷惑をおかけして申し訳ありません。';
          }
          ns.dialog(ns.lang('common.error_on_retry'), {
            'modal': true,
            'resizable': false,
            'title': ns.lang('common.title_on_retry'),
            'width': 700,
            'moveToTop': true,
            'close': function() {
              setTimeout(function() {
                location.reload();
              }, 5000);
            }
          });
          return;
        }

        if (!ns.namespace('sohga.language.common.title_on_error').length) {
          sohga.language.common.title_on_error = 'Error';
        }
        ns.dialog(jqXHR.responseText, {
          'modal': true,
          'resizable': false,
          'title': ns.lang('common.title_on_error'),
          'width': 700,
          'moveToTop': true
        });
      };
      //namespace宣言ヘルパ
      //var ns = sohga.common.namespace('foo.bar.hoge');
      ns.namespace = function(str) {
          var ns = str.split('.');
          var here = window;
          for (var i = 0, l = ns.length; i < l; i++) {
            if (typeof(here[ns[i]]) == 'undefined') here[ns[i]] = {};
            here = here[ns[i]];
          }
          return here;
        };
      //指定セレクタが見えるところまでスクロール
      ns.scroll_to = function(selector, duration, easing, callback) {
          if (duration === undefined) duration = 400;
          if (easing === undefined) easing = 'swing';
          if (scope.is_scroll_elem === null) {
            var isHtmlScroll = (function() {
              var html = $('html');
              var top = html.scrollTop();
              var el = $('<div/>').height(10000).prependTo('body');
              html.scrollTop(10000);
              var rs = !!html.scrollTop();
              html.scrollTop(top);
              el.remove();
              return rs;
            })();
            scope.is_scroll_elem = isHtmlScroll ? $('html') : $('body');
          }
          scope.is_scroll_elem.animate({
            scrollTop: $(selector).offset().top
          }, duration, easing, callback);
        };
      //ダイアログの上端がスクロール範囲から外れているなら上端にスクロール
      ns.scroll_to_dialog = function(selector) {
          if (selector === undefined) selector = '.ui-dialog:visible:first';
          var target = $(selector);
          if (target.length > 0) {
            var t = target.offset().top;
            var area = $('html, body');
            if (area.scrollTop() > t) {
              ns.scroll_to(target, 0);
            }
          }
        };
      //指定セレクタ内のinput,select,textareaの値を収集して返します
      ns.get_form_values = function(selector, params) {
        if (typeof(params) == 'undefined') {
          params = {};
        }
        var target = $(selector);
        if (target.length === 0) {
          return params;
        }
        if (target.get(0).tagName.toLowerCase() == 'form') {
          target = target.find('textarea,select,input').not(':radio:not(:checked),:checkbox:not(:checked),input[type="file"]').filter('[name]:visible:not(:disabled)').add(target.find('input[type="hidden"]'));
        }
        target.each(function() {
          var self = $(this);
          var name = self.attr('name');
          if (name === null || name === '') {
            return;
          }
          var val = self.val();
          if (this.tagName.toLowerCase() == 'select' && val === null && !self.is('[multiple]')) {
            val = self.find('option:visible:first').attr('value');
          }
          if (name in params) {
            if (params[name] instanceof Array) {
              params[name].push(val);
            }
            else {
              params[name] = [params[name], val];
            }
          }
          else {
            params[name] = val;
          }
        });
        return params;
      };
      ns.number_format = function(str) {
        var num = new String(str).replace(/,/g, '');
        while (num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2"))) {}
        return num;
      };
      ns.sprintf = function(args___) {

        var rv = [],
          i = 0,
          v, width, precision, sign, idx, argv = arguments,
          next = 0;
        var s = (argv[0] + "     ").split(""); // add dummy 5 chars.
        var unsign = function(val) {
          return (val >= 0) ? val : val % 0x100000000 + 0x100000000;
        };
        var getArg = function() {
          return argv[1][(idx ? idx - 1 : next++)];
        };

        var repeat = function(txt, n) {
          var rv = [],
            i = 0,
            sz = n || 1,
            s = txt.toString();
          for (; i < sz; ++i) {
            rv.push(s);
          }
          return rv.join("");
        };

        for (; i < s.length - 5; ++i) {
          if (s[i] !== "%") {
            rv.push(s[i]);
            continue;
          }

          ++i, idx = 0, precision = undefined;

          // arg-index-specifier
          if (!isNaN(parseInt(s[i])) && s[i + 1] === "$") {
            idx = parseInt(s[i]);
            i += 2;
          }
          // sign-specifier
          sign = (s[i] !== "#") ? false : ++i, true;
          // width-specifier
          width = (isNaN(parseInt(s[i]))) ? 0 : parseInt(s[i++]);
          // precision-specifier
          if (s[i] === "." && !isNaN(parseInt(s[i + 1]))) {
            precision = parseInt(s[i + 1]);
            i += 2;
          }

          switch (s[i]) {
            case "d":
              v = parseInt(getArg()).toString();
              break;
            case "u":
              v = parseInt(getArg());
              if (!isNaN(v)) {
                v = unsign(v).toString();
              }
              break;
            case "o":
              v = parseInt(getArg());
              if (!isNaN(v)) {
                v = (sign ? "0" : "") + unsign(v).toString(8);
              }
              break;
            case "x":
              v = parseInt(getArg());
              if (!isNaN(v)) {
                v = (sign ? "0x" : "") + unsign(v).toString(16);
              }
              break;
            case "X":
              v = parseInt(getArg());
              if (!isNaN(v)) {
                v = (sign ? "0X" : "") + unsign(v).toString(16).toUpperCase();
              }
              break;
            case "f":
              v = parseFloat(getArg()).toFixed(precision);
              break;
            case "c":
              width = 0;
              v = getArg();
              v = (typeof v === "number") ? String.fromCharCode(v) : NaN;
              break;
            case "s":
              width = 0;
              v = getArg().toString();
              if (precision) {
                v = v.substring(0, precision);
              }
              break;
            case "%":
              width = 0;
              v = s[i];
              break;
            default:
              width = 0;
              v = "%" + ((width) ? width.toString() : "") + s[i].toString();
              break;
          }
          if (isNaN(v)) {
            v = v.toString();
          }
          (v.length < width) ? rv.push(repeat(" ", width - v.length), v): rv.push(v);
        }
        return rv.join("");
      };
      ns.dialog = function(content_selector, dialog_option) {
        if (typeof content_selector != 'object') {
          content_selector = $('<div data-sg-generate="auto-dialog">' + content_selector + '</div>');
        }
        if (typeof dialog_option == 'undefined') {
          dialog_option = {
            'width': 700,
            'modal': true,
            'resizable': false
          };
        }
        if (typeof dialog_option.buttons == 'undefined') {
          dialog_option.buttons = {
            'OK': function() {
              ns.close($(this));
            }
          };
        }
        if (typeof dialog_option.title == 'undefined') {
          dialog_option.title = content_selector.attr('data-title');
          if (!dialog_option.title) {
            if (!ns.namespace('sohga.language.common.title_on_default').length) {
              sohga.language.common.title_on_default = 'Message';
            }
            dialog_option.title = ns.lang('common.title_on_default');
          }
        }

        ns.loading(false);
        var dialog;
        if ($.mobile) {
          dialog = $('<div data-role="dialog"><div data-role="header" data-theme="c"><h3></h3></div><div data-role="content"></div></div>');
          dialog.find('[data-role="header"] h3').text(dialog_option.title);
          dialog.find('[data-role="content"]').append(content_selector);
          if (dialog_option.buttons) {
            var group = $('<div data-role="controlgroup"></div>');
            $.each(dialog_option.buttons, function(k, v) {
              $('<a href="" data-role="button"></a>').text(k).click(v).appendTo(group);
            });
            dialog.find('[data-role="content"]').append(group);
          }
          dialog.appendTo('body');
          $.mobile.changePage(dialog, {
            role: 'dialog'
          });
        }
        else if (dialog_option.modal && $.isFunction(content_selector.modal)) {
          dialog = $('<div class="modal" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title"></h4></div><div class="modal-body"></div><div class="modal-footer"></div></div></div></div>');
          if (dialog_option.buttons) {
            var footer = dialog.find('div.modal-footer');
            $.each(dialog_option.buttons, function(k, v) {
              $('<button type="button" class="btn btn-default" data-dismiss="modal"></button>').text(k).click(v).appendTo(footer);
            });
          }

          dialog.find('h4.modal-title').text(dialog_option.title);
          dialog.find('div.modal-body').append(content_selector.show());
          dialog = dialog.modal({
            'backdrop': 'static'
          });
          if (dialog_option.keyboard === false) {
            dialog.removeAttr('tabindex').modal({
              'keyboard': false
            });
          }
          if (dialog_option.autoOpen === false) {
            dialog.modal('hide');
          }
          else {
            dialog.modal('show');
          }

          dialog.on('hidden.bs.modal', function(e) {
            if ($.isFunction(dialog_option.close)) {
              dialog_option.close(e);
            }
            if (dialog.find('div[data-sg-generate="auto-dialog"]').length > 0) {
              dialog.remove();
            }
          });

          if (dialog_option.width !== null) {
            dialog.find('.modal-dialog').css('width', dialog_option.width);
          }
        }
        else if ($.isFunction(content_selector.dialog)) {
          dialog = content_selector.dialog(dialog_option);
          if (typeof dialog_option.moveToTop != 'undefined') {
            dialog.dialog('moveToTop');
          }
        }

        return dialog;
      };
      ns.show_dialog = function(content_selector, dialog_option) {
        return ns.dialog(content_selector, dialog_option);
      };
      ns.open = function(dialog) {
        if ($.mobile) {
          $.mobile.changePage(dialog, {
            role: 'dialog'
          });
        }
        else if ($.isFunction(dialog.modal)) {
          dialog.modal('show');
        }
        else if ($.isFunction(dialog.dialog)) {
          dialog.dialog('open');
          var lz = $('#loading>p').css('z-index') - 0;
          var dp = dialog.parents('.ui-dialog:first');
          var dz = dp.css('z-index') - 0;
          if (lz > dz) {
            dp.css('z-index', lz + 1);
          }
        }
      };
      ns.close = function(dialog) {
        if ($.mobile) {
          (dialog.hasClass('.ui-dialog') ? dialog : dialog.parents('.ui-dialog')).dialog('close');
        }
        else if ($.isFunction(dialog.modal)) {
          dialog.modal('hide');
        }
        else if ($.isFunction(dialog.dialog)) {
          dialog.dialog('close');
        }
      };

      ns.ajax = function(values, merge_id) {
        //TODO ★merge_idがあれば、重複を単一化する
        scope.ajax_queue.push(values);
        scope.ajax_queue_wait++;
        if (scope.ajax_queue_wait == 1) {
          scope.dequeue_ajax_queue();
        }
      };
      ns.push_ajax_queue = function(values, merge_id) {
        return ns.ajax(values, merge_id);
      };

      ns.array_merge = function(src, p) {
        var o = src;
        for (var z in p) {
          if (p.hasOwnProperty(z)) {
            if (typeof p[z] == 'object' && typeof o[z] == 'object') {
              o[z] = array_merge(o[z], p[z]);
            }
            else {
              o[z] = p[z];
            }
          }
        }
        return o;
      };

      ns.loading = function(to_show, speed, ignore_timeover) {
        if (scope.loading_timer_id > 0) {
          clearInterval(scope.loading_timer_id);
          scope.loading_timer_id = 0;
        }
        if (scope.loading_wait_timer_id > 0) {
          clearInterval(scope.loading_wait_timer_id);
          scope.loading_wait_timer_id = 0;
        }
        if (scope.loading_wait_dialog) {
          ns.close(scope.loading_wait_dialog);
          //scope.loading_wait_dialog.dialog('close');
        }
        if (to_show) {
          var loading = $('#loading');
          if (loading.length === 0) {
            loading = $('<div id="loading"><div class="overlay"></div><div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div></div>').appendTo('body');
          }
          loading.fadeIn((typeof speed == 'undefined') ? 'fast' : speed);
          if (!ignore_timeover) {
            scope.loading_timer_id = setInterval(scope.on_loading_timelimit, scope.LOADING_TIMELIMIT_MS);
          }
        }
        else {
          var loading = $('#loading');
          if (loading.length > 0) {
            loading.fadeOut((typeof speed == 'undefined') ? 'fast' : speed);
          }
        }
      };

      ns.lang = function(args___) {
        var argv = [];
        if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
            argv.push(arguments[i]);
          }
        }
        var id = 'sohga.language.' + arguments[0];
        return sprintf(namespace(id), argv);
      };

    }
  }
}
