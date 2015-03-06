require.config({
    paths: {
        link: "../component/link",
        button: "../component/button",
        regexp: "../component/regexp"
    }
});
define(["link", "button", "regexp"], function(ccwlink, ccwbutton, ccwregexp) {
    var exports = {
        link: ccwlink,
        button: ccwbutton,
        regexp: ccwregexp,
        show: function (el) {
            debugger;
            for (var pfn in exports) {
                if (pfn !== "show") {
                    var fn = exports[pfn]['show'];
                    if (typeof (fn) == "function") {
                        fn(el);
                    }
                }
            }
        }
    };
    return exports;
});