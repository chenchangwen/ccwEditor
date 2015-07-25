require.config({
    paths: {
        //vendor
        jquery: '../../../vendor/jquery.min',
        Jcrop: '../../../vendor/Jcrop/jquery.Jcrop.min',
        spectrum: '../../../vendor/spectrum/spectrum',
        "uikit": '../../../vendor/uikit/js/uikit.min',
        "spin": '../../../vendor/spin.min',
        'uikit!upload': '../uikit!upload',
        //自定义
        jqextend: '../core/jqextend',
        uikitextend: '../core/uikitextend',
        utils: '../core/utils',
        component: '../component/all'
    },
    shim: {
        jqextend: ['jquery'],
        uikitextend: ['jquery'],
        utils: ['jquery'],
        "spin": ['jquery'],
        Jcrop: ['jquery'],
        "uikit": ['jquery'],
        "uikit!upload": ['jquery'],
        spectrum: ['jquery']
    },
    config: {
        "uikit": {
            "base": "../../../vendor/uikit/js"
        }
    },
    waitSeconds: 200
});
