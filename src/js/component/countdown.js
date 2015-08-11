define(['jquery', 'componentutils'], function ($, utils) {
    var html = '<div class=\"uk-alert\">无</div>';
    var exports = {
        html: html,
//        init: function () {
//            if ($(".temprow").length === 1) {
//                $(".temprow").find("select").children("option").eq(0).prop("selected", "selected").trigger("click");
//            }
//        },
        init: function (el) {
            var opts = {
                lable: '设定',
                callback: function () {
                    var cdsuffixischecked = "";
                    if (el.attr("cdsuffix") === "false") {
                        cdsuffixischecked = "";
                    } else {
                        cdsuffixischecked = "checked=\"checked\"";
                    }
                    var cdsuffixhtml = "&nbsp;<label><input type=\"checkbox\"  " + cdsuffixischecked + " class=\"cdsuffix\"> 保留中文后缀</label>";
                    return cdsuffixhtml;
                }
            };
            $('.btngroup').before(utils.tempRow(opts));
        },
        show: function (el) {
            if (el !== undefined)
                if (el.attr('cdsuffix') !== undefined) {
                    $('.cdsuffix').prop("checked", "checked");
                }
            var $cdsuffix = $('input[class="cdsuffix"]');
            if (el.attr("cdsuffix") === "false") {
                $cdsuffix.prop('checked', '');
            } else {
                $cdsuffix.prop('checked', 'checked');
            }
        },
        save: function (el) {

        }
    };
    return exports;
});