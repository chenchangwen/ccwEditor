require.config({
    paths: {
        link: "src/js/component/link",
        button: "src/js/component/button",
        regexp: "src/js/component/regexp",
        countdown: "src/js/component/countdown",
        componentutils: 'src/js/component/utils'
    }
});
define(["link", "button", "regexp", "countdown"], function (ccwlink, ccwbutton, ccwregexp, ccwcountdown) {
    var exports = {
        link: ccwlink,
        button: ccwbutton,
        regexp: ccwregexp,
        countdown:ccwcountdown,
        show: function (el) {
            callFn('show',el);
        },
        save: function (el) {
            callFn('save',el);
        }
    };

    function callFn(fnname, el) {
        for (var pfn in exports) {
            if (pfn !== 'show' && pfn !== 'save') {
                var fn = exports[pfn][fnname];
                if (typeof (fn) == "function") {
                    fn(el);
                }
            }
        }
    }

    return exports;
});