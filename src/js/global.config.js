require.config({
    baseUrl:'../../',
    paths: {
        jquery: 'vendor/jquery.min',
        Jcrop: 'vendor/Jcrop/jquery.Jcrop.min',
        "uikit": 'vendor/uikit/js/uikit.min',
        "spin": 'vendor/spin.min',
        jqextend: 'src/js/core/jqextend',
        uikitextend: 'src/js/core/uikitextend',
        utils: 'src/js/core/utils',
        'uikit!upload': 'uikit!upload',
        component: 'src/js/component/all'
    },
    shim: {
        jqextend: ['jquery'],
        uikitextend: ['jquery'],
        utils: ['jquery'],
        "spin": ['jquery'],
        Jcrop: ['jquery'],
        "uikit": ['jquery'],
        "uikit!upload": ['jquery']
    },
    config: {
        "uikit": {
            "base": "vendor/uikit/js"
        }
    },
    waitSeconds: 200
});
