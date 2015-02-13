define(function () {
    var html = "<span>";
    html += '<input id="type0" value="_self" type="radio" name="radio">';
    html += '<label for="type0">当前窗口</label>';
    html += '</span>';
    html += '<span>';
    html += '<input id="type1" checked="checked" value="_blank" type="radio" name="radio">';
    html += '<label for="type1">新建窗口</label>';
    html += '</span>';
    return html;
});
