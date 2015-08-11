define(['jquery', 'componentutils'], function ($, utils) {
    var exports = {
        init: function (el) {
            var $btngroup = $('.btngroup');
            var opts1 = {
                lable: '链接动作',
                callback: function () {
                    var html = '<select id="tabaction">';
                    html += '<option value="click">点击</option>';
                    html += '<option value="hover">鼠标经过</option>';
                    html += '</select>';
                    return html;
                }
            };

            $btngroup.before(utils.tempRow(opts1));
            var $cropwrap = $('.cropwrap');
            var opts2 = {
                lable: '链接目标',
                callback: function () {
                    var $alltab = parent.tinymce.dom.DomQuery(parent.tinymce.activeEditor.dom.select('div[tabname]'));
                    var notabtarget = '<div class=\"uk-alert\" id="notabtarget">没有TAB</div>';
                    if ($alltab.length === 0) {
                        return notabtarget;
                    }
                    var html = '<select id="tabtarget">';
                    var sum = 0;
                    $alltab.each(function () {
                        var $this = $(this);
                        if ($cropwrap.attr('rid') !== $this.attr('rid')) {
                            sum += 1;
                            html += '<option value="' + $.trim($this.attr('tabname')) + '">' + $.trim($this.attr('tabname')) + '</option>';
                        }
                    });
                    html += '</select>';
                    if (sum === 0) {
                        return notabtarget;
                    }
                    return html;
                }
            };
  
            $btngroup.before(utils.tempRow(opts2));
            $('#tabaction option[value="' + el.attr('tabaction') + '"').prop("selected", "selected").trigger("click");
            $('#tabtarget option[value="' + el.attr('tabtarget') + '"').prop("selected", "selected").trigger("click");
        },
        show: function (el) {
            if (el !== undefined)
                if (el.attr('linkicon') !== undefined) {
                    $('.linkicon').prop("checked", "checked");
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