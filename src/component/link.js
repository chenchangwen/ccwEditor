require.config({
    paths: {
        jquery: '../../lib/jquery-1.11.1.min',
        utils: '../component/utils'
    },
    shim: {
        utils: ['jquery'],
        "spin": ['jquery']
    },

    waitSeconds: 200
});
define(['jquery', '../component/utils'], function ($, utils) {
    var html = "<span>";
    html += '<input id="type0" value="_self" type="radio" name="radio">';
    html += '<label for="type0">当前窗口</label>';
    html += '</span>';
    html += '<span>';
    html += '<input id="type1" checked="checked" value="_blank" type="radio" name="radio">';
    html += '<label for="type1">新建窗口</label>';
    html += '</span>';
   
    var exports = {
        html: html,
        init: function () {
            var opts = {
                lable: '设定',
                callback: function () {
                    return '<label><input type="checkbox" class="linkicon"> 该链接是否显根据库存数等条件示"售罄"类图标</label>';
                }
            }
            $('.btngroup').before(utils.tempRow(opts));
        },
        show: function (el) {
            if(el!=undefined)
            if (el.attr('linkicon') != undefined) {
                $('.linkicon').prop("checked", "checked");
            }
        },
        save: function (el) {
            if (el != undefined) {
                if ($(".linkicon").prop("checked")) {
                    el.attr('linkicon', 'true');
                } else {
                    el.removeAttr('linkicon');
                }
            }
        }
    }
    return exports;
});
