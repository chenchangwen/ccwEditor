require.config({
    paths: {
        link: "../component/link",
        button: "../component/button",
        regexp: "../component/regexp",
        countdown: "../component/countdown",
        tab: "../component/tab",
        componentutils: "../component/utils"
    }
});
define(["link", "button", "regexp", "countdown",'tab'], function (ccwlink, ccwbutton, ccwregexp, ccwcountdown,ccwtab) {
    var exports = {
        link: ccwlink,
        button: ccwbutton,
        regexp: ccwregexp,
        countdown: ccwcountdown,
        tab: ccwtab,
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