require.config({
    paths: {
        link: '../component/link',
        button: '../component/button',
        regexp: '../component/regexp'
    }
});
define(['link', 'button', 'regexp'], function (ccwlink, ccwbutton, ccwregexp) {
    var exports= {
        link: ccwlink,
        button: ccwbutton,
        regexp: ccwregexp
    }
    return exports;
});