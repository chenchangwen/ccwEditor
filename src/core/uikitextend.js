define(['uikit!notify'], function (UI) {
    var exports = {
        uikit: {
            notify: function (option) {
                var defaultopt = {
                    message: '',
                    status: 'danger',
                    timeout: 800,
                    pos: 'top-left'
                };
                var opt = $.extend({}, defaultopt, option);
                UI.notify(opt);
            }
        }
    }
    return exports;
});