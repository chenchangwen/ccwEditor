require.config({
    paths: {
        jquery: '../../lib/jquery-1.11.1.min',
        Jcrop: '../../lib/Jcrop/jquery.Jcrop.min',
        "uikit": '../../css/uikit/js/uikit.min',
        "spin": '../../lib/spin.min',
        component: '../component/all',
        jqextend: '../core/jqextend',
        uikitextend: '../core/uikitextend',
        utils: '../core/utils'
    },
    shim: {
        jqextend: ['jquery'],
        uikitextend: ['jquery'],
        utils: ['jquery'],
        "spin": ['jquery']
    },
    config: {
        "uikit": {
            "base": "../../css/uikit/js"
        }
    },
    waitSeconds: 200
});