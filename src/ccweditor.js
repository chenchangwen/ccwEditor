function getMceActiveId() {
    return tinymce.activeEditor.windowManager.getWindows()[0]["_id"];
}


function isValidCheck() {
    $("body").focus();
    //如果父元素有cropwrap则还是选择图片
    if ($(tinymce.activeEditor.selection.getNode().parentNode).hasClass('cropwrap')) {
        //tinyMCE.activeEditor.selection.select(tinyMCE.activeEditor.dom.select('img')[0]);
        tinyMCE.activeEditor.dom.select(tinyMCE.activeEditor.dom.select('img')[0]);
    }
    else
    if (tinymce.activeEditor.selection.getNode().tagName !== "IMG") {
        alert("请选择图片");
        return false;
    }
    return true;
};

//获得所有属性
(function ($) {
    $.fn.getAttributes = function () {
        var attributes = {};
        if (this.length) {
            $.each(this[0].attributes, function (index, attr) {
                attributes[attr.name] = attr.value;
            });
        }
        return attributes;
    };
})(jQuery);

(function(exports) {
    var doc = exports.document,
        a = {},
        expose = +new Date(),
        rExtractUri = /((?:http|https|file):\/\/.*?\/[^:]+)(?::\d+)?:\d+/,
        isLtIE8 = ("" + doc.querySelector).indexOf("[native code]") === -1;
        exports.getCurrAbsPath = function() {
        // FF,Chrome
        if (doc.currentScript) {
            return doc.currentScript.src;
        }

        var stack;
        try {
            a.b();
        } catch (e) {
            stack = e.fileName || e.sourceURL || e.stack || e.stacktrace;
        }
        // IE10
        if (stack) {
            var absPath = rExtractUri.exec(stack)[1];
            if (absPath) {
                return absPath;
            }
        }

        // IE5-9
        for (var scripts = doc.scripts,
            i = scripts.length - 1,
            script; script = scripts[i--];) {
            if (script.className !== expose && script.readyState === "interactive") {
                script.className = expose;
                // if less than ie 8, must get abs path by getAttribute(src, 4)
                return isLtIE8 ? script.getAttribute("src", 4) : script.src;
            }
        }
    };
}(window));

//tinymce路径
var tinymcepath = getCurrAbsPath().replace(/src\/.+/, ""),
    cropwrap = 'cropwrap';
var mcequery = tinymce.dom.DomQuery;

var ccweditor = {
    template: {
        p: function (content) {
            return '<p data-mce-style=\"display:inline\" style=\"display:inline\">' +(content|| '' )+'</p>';
        },
        b: function (compareelement) {
            var width = parseInt(compareelement.css('width').replace(/px/,''));
            var height = parseInt(compareelement.css('height').replace(/px/, ''));
            var centerleft = (accDiv(width, 2) - 45) || 0;
            var centertop = (accDiv(height, 2) - 45) || 0;
            var tipchildstyle = "left:" + centerleft + 'px;top:' + centertop + 'px;';
            var html = '<b style="' + tipchildstyle + '"></b>';
            return html;
        }
    },
    insertimage: function (editor) {
        ccweditor.fixEditorIndex(editor);
        if ($(tinymce.activeEditor.selection.getNode()).hasClass("imgpos")) {
            alert("请选择正确的区域");
            return false;
        }
        tinymce.activeEditor.windowManager.open({
            title: "插入/更换图片",
            url: tinymcepath + "src/upload/index.html?20152121940",
            width: 450,
            height: 250,
            buttons: [
                {
                    text: "Close",
                    onclick: "close"
                }
            ]
        });
    },
    editimage: function() {
        if (isValidCheck()) {
            var w = ($(document).width() < $("body").width() ? $(document).width() : $("body").width()) - 50,
                h = (document.all ? document.getElementsByTagName("html")[0].offsetHeight : window.innerHeight) - 100;
            tinymce.activeEditor.windowManager.open({
                title: "编辑图片(双击区域编辑,可点击其他区域快速保存)",
                url: tinymcepath + "src/edit/index.html?20152121940",
                width: w,
                height: h,
                buttons: [
                    {
                        text: "新建热点",
                        onclick: function () {
                            $("#" + getMceActiveId()).find("iframe").contents().find("#addhotlink").click();
                        }
                    },
                    {
                        text: "完成",
                        onclick: function () {
                            $("#" + getMceActiveId()).find("iframe").contents().find("#save").click();
                            var content = $("#" + getMceActiveId()).find("iframe").contents().find("#content").html();
//                            content = content.replace(/(\.)*\/public/ig, "\.\/public");
                            tinymce.activeEditor.windowManager.close();
                            //如果父存在DIV,即不是第一次编辑,则删除.
                            if (tinymce.activeEditor.selection.getNode().parentNode.tagName === "DIV") {
                                tinyMCE.activeEditor.dom.remove(tinymce.activeEditor.selection.getNode().parentNode);
                            }
                            tinymce.activeEditor.selection.setContent(content);
                        }
                    },
                    {
                        text: "Close",
                        onclick: "close"
                    }
                ]
            });
        }
    },
    insertanchor: function() {
        if ($(tinymce.activeEditor.selection.getNode()).hasClass("imgpos")) {
            alert("请选择正确的区域.");
            return false;
        }
        var thisobj = this;
        tinymce.activeEditor.windowManager.open({
            title: "锚点",
            body: { type: "textbox", name: "name", size: 40, label: "Name" },
            onsubmit: function (e) {
                mcequery(ccweditor.getParents()).remove();
                tinymce.activeEditor.execCommand("mceInsertContent", false, thisobj.template.p("<a class=\"tempanchor\" id=\"" + e.data.name + "\"></a>"));
            }
        });
    },
    //修正就算没有焦点,也能正确全屏对应的编辑器
    //原因:如果有多个编辑器对象,因为还没有在编辑器内存在焦点,全屏会认为最后一个初始化的为激活对象.
    fullscreen: function (editor) {
        ccweditor.fixEditorIndex(editor);
        tinymce.editors[tinymce.activeEditor.fsindex].execCommand("mceFullScreen");
    },
    fixEditorIndex: function(editor) {
        tinymce.activeEditor.fsindex = 0;
        if (editor.id === "mce2") {
            tinymce.activeEditor.fsindex = 1;
        }
    },
    getParents: function () {
        var focusNode = tinyMCE.activeEditor.selection.getSel().focusNode;
        var parents = tinymce.activeEditor.dom.getParents(focusNode, 'p');
        if (parents.length === 0) {
            parents = tinymce.activeEditor.dom.getParents(focusNode, 'div');
        }
        return parents;
    },
    setAttributes: function (fromelement, toelement) {
        var attribute = fromelement.getAttributes();
        var content = '', str;
        for (var key in attribute) {
            var value = attribute[key];
            if (key !== 'contenteditable') {
                if (typeof toelement == "string") {
                    content += key + '="' + value + '"';
                } else {
                    toelement.attr(key, value);
                }
            }
        }
        if (toelement === 'a') {
            content = content.replace(/linktarget/g, 'target').replace(/新建窗口/g, '_blank').replace(/当前窗口/g, '_self').replace(/link=/g,'href=');
            str = '<rename ' + content+ '>' + '<rename>';
            str = str.replace(/rename/ig, toelement);
            fromelement.wrap(str);
            //锚点不加图片提示
            var parent = fromelement.parent();
            if (fromelement.attr('linktype') !== 'anchor') {
                parent.append(this.template.b(fromelement));
            } else {
                //并且删除该属性
                parent.attr('href','#'+parent.attr('target')).removeAttr('target').removeAttr('cdsuffix');
            }

        }
    },
    //转换旧编辑器内容
    convert: function(el) {
        var $el = $(el);
        var $parent;
        //div.cropwrap
        if ($el.hasClass(cropwrap)) {
            var $img = $el.children('img'),
                $map = $el.children('map'),
                $imgpos = $el.children('.imgpos');
            if ($map.length > 0) {
                //获得所有map的属性
                this.setAttributes($map, $img);
                $map.remove();
                $img.removeAttr('usemap');
                
            }
            //将所有imgpos转换为a
            $imgpos.each(function () {
                var $this = $(this);
                $this.attr('target', $this.attr('linktarget'));
                if ($this[0].tagName !== 'MAP' && $this.attr('linktype') !== 'link' && $this.attr('linktype') !== 'anchor') {
                    return false;
                } else {
                    ccweditor.setAttributes($(this), 'a');
                    $(this).remove();
                }
            });
        }
        //a
        else if ($el[0].tagName === 'A') {
            var data = $el.attr('data');
            if (data != undefined) {
                data = data.split('|||');
                //最多6个属性(超链接)
                if (data[0] == 1) {
                    if ($el.attr('href').indexOf('#') >= 0) {
                        $el.attr('linktype', 'anchor');
                    } else {
                        if (data[1] !== '') {
                            $el.attr('href', data[1]);
                        }
                        $el.attr('linktype', 'link');
                    }

                    if (data[2] !== '') {
                        $el.attr('target', data[2]);
                    }
                    if (data[3] !== '') {
                        $el.css('left', data[3]);
                    }
                    if (data[4] !== '') {
                        $el.css('width', data[4]);
                    }
                    if (data[5] !== '') {
                        $el.css('top', data[5]);
                    }
                    if (data[5] !== '') {
                        $el.css('width', data[5]);
                    }
                    if (data[6] !== '') {
                        $el.css('height', data[6]);
                    }
                    var centerleft = (accDiv(data[5], 2) - 45) || 0;
                    var centertop = (accDiv(data[6], 2) - 45) || 0;
                    var tipchildstyle = "left:" + centerleft + 'px;top:' + centertop + 'px;';
                    var html = '<b style="' + tipchildstyle + '"></b>';
                    $el.removeAttr('data');
                    $el.append(html);
                }
                $el.removeAttr('class');
                $el.addClass('imgpos');
                $el.css('position', 'absolute');
                $parent = $el.parent('div');
                $parent.removeAttr('id');
                $parent.removeAttr('class');
                $parent.addClass(cropwrap);
                $parent.children('img').removeAttr('id');
            }
            var name = $el.attr('name');
            if (name !== '') {
                $parent = $el.parent();
                if ($parent[0].tagName === 'P') {
                    $parent.css('display', 'inline');
                    $parent.attr('data-mce-style', 'inline');
                } else {
                    $el.wrap(ccweditor.template.p());
                }
                $el.attr('id', name);
                $el.addClass('tempanchor');
            }
        }
    },
    //清理格式
    clean: function (el) {
        for (var i = 0, len = el.length; i < len; i++) {
            var $el = $(el[i]);
            $el.css('border', '0').removeAttr('contenteditable');
            var style = $el.attr('style');
            $el.attr('data-mce-style',style);
        }
    }
}

tinymce.init({
    selector: "#mce1,#mce2",
    theme: "modern",
    width: "100%",
    height: 500,
    cleanup: true,
    object_resizing : false, /* THIS might do the trick */
    plugins: [
        "code fullscreen link",
        "save contextmenu"
    ],
//    menu: {
//        file: { title: 'File', items: 'newdocument' },
//        tools: { title: 'Tools', items: 'spellchecker code ccwinsertimage fullscreen image' }
//    },
//    external_filemanager_path: tinymcepath + "lib/tinymce/js/tinymce/plugins/filemanager/",
//    filemanager_title:"多图上传" ,
//    external_plugins: { "filemanager": tinymcepath + "lib/tinymce/js/tinymce/plugins/filemanager/plugin.min.js" },
    menu: {},
//    image_advtab: true,
    content_css:  tinymcepath +"css/ccweditor.css",
    contextmenu: "insertAnchore | hotlink | convertpic | insertpic | preview | fullscreen |",
    language: "zh_CN",
    //    toolbar: false,
    toolbar: "undo redo newdocument link btnanchor btninsertimage btnmupload btnpreview code btnfullscreen btndocument",
    relative_urls: false,
    valid_elements: "*[*]",
    setup: function (editor) {

        editor.on("init", function () {
            var img = editor.dom.select(".cropwrap");
            for (var i = 0; i < img.length; i++) {
                $(img[i]).wrap('<p data-mce-style=\"display:inline\" display="display:inline"></p>');
            }

            //测试用
            // editor.setContent('');
            // editor.insertContent('<div class="bbbb"><div class="aaaa"><img usemap="mymap" src="http://localhost:2735/ccweditor/images/test.jpg?123" /><map name="mymap"><AREA SHAPE=\"rect\"COORDS=\"0,0,82,126\"href=\"#\"></map></div>');

            var selectel, el;
            //清除BR
            selectel = editor.dom.select("br");
            for (var i = 0; i < selectel.length; i++) {
                el = selectel[i];
                tinymce.activeEditor.dom.remove(el);
            }
            //将map转换为a
            selectel = editor.dom.select(".cropwrap");
            for (var i = 0; i < selectel.length; i++) {
                el = selectel[i];
                ccweditor.convert(el);
            }

            //还原border,及超链接,及锚点
            selectel = editor.dom.select("a");
            for (var i = 0; i < selectel.length; i++) {
                el = selectel[i];
                ccweditor.convert(el);
                var querya = mcequery(el);
                var parent = querya.parent();
                //如果不是锚点
                if (!editor.dom.hasClass(el, 'tempanchor') && querya.children('img').length <= 0)
                    editor.dom.setStyle(el, 'border', '2px solid blue');
                editor.dom.setAttrib(el, 'contenteditable', 'false');
                //如果父元素是p
                if (parent[0].tagName === 'P') {
                    parent.css('display', 'inline');
                    parent.attr('data-mce-style', 'inline');
                } else {
                    querya.wrap('<p data-mce-style=\"display:inline\" display="display:inline"></p>');
                }
            }

            tinymce.activeEditor.transitionPic = [];
        });

        editor.addButton("btninsertimage", {
            icon: "btninsertimage",
            tooltip: "插入/更换图片",
            onclick: function () {
                ccweditor.insertimage(editor);
            }
        });

        editor.addButton("btnmupload", {
            icon: "btnmupload",
            tooltip: "多图上传",
            onclick: function () {
                tinymce.activeEditor.fsindex = 0;
                if (editor.id === "mce2") {
                    tinymce.activeEditor.fsindex = 1;
                }
                tinymce.activeEditor.windowManager.open({
                    title: "多图上传",
                    //url: tinymcepath + 'lib/tinymce/js/tinymce/plugins/filemanager/dialog.php?type=1&lang=zh_CN',
                    url: tinymcepath + "src/mupload/index.html?20152121940",
                    width: 750,
                    height: 326,
                    buttons: [
                        {
                            text: "Close",
                            onclick: "close"
                        }
                    ]
                });
            }
        });

        editor.addButton("btnanchor", {
            icon: "btnanchor",
            tooltip:"插入锚点",
            onclick: function () {
                ccweditor.insertanchor();
            }
        });

        editor.addButton("btnpreview", {
            icon: "btnpreview",
            tooltip: "预览",
            onclick: function () {
                window.open(tinymcepath + "src/preview/index.html?20152121940");
            }
        });

        editor.addButton("btnfullscreen", {
            icon: "btnfullscreen",
            tooltip: "全屏",
            onclick: function () {
                ccweditor.fullscreen(editor);
            }
        });

        editor.addButton("btndocument", {
            icon: "btndocument",
            tooltip: "使用帮助",
            onclick: function () {
                window.open(tinymcepath + "src/document/index.html?20152121940");
            }
        });

        editor.addMenuItem("insertpic", {
            text: "插入/更换图片",
            onclick: function () {
                ccweditor.insertimage(editor);
            }
        });

        editor.addMenuItem("convertpic", {
            text: "转换为切换图片",
            onclick: function () {
                if (isValidCheck()) {
                    var pnode, isimgpos = false, src;
                    var pic = tinymce.activeEditor.selection.getNode();
                    //是否一个imgpos
                    if ($(pic).hasClass('imgpos')) {
                        var img = $(pic.parentNode).children('img');
                        src = img.attr("data-mce-src") || img.attr("src");
                        isimgpos = true;
                    } else {
                        src = $(pic).attr("data-mce-src") || $(pic).attr("src");
                    }
                    if (src[0] === ".") {
                        src = src.substr(1, src.length);
                    }
                    tinymce.activeEditor.transitionPic.push(src);
                    if ($(pic.parentNode).hasClass(cropwrap) || isimgpos) {
                        //wrap div 是否一个p
                        if (pic.parentNode.parentNode.tagName === 'P') {
                            pnode = pic.parentNode.parentNode;
                        } else {
                            pnode = pic.parentNode;
                        }
                        //tinyMCE.activeEditor.execCommand("mceRemoveNode", false, pic);
                    }
                    tinyMCE.activeEditor.execCommand("mceRemoveNode", true, pic);
                    if (pnode != undefined) {
                        if (pnode.parentNode.tagName === 'P') {
                            tinyMCE.activeEditor.dom.remove(pnode.parentNode);
                        }
                        tinyMCE.activeEditor.dom.remove(pnode);
                    }
                    // tinyMCE.activeEditor.dom.remove(tinymce.activeEditor.selection.getNode());
                }
            }
        });

        //mce2('侧边导航')就不需要插入锚点了
        if (editor.id == "mce1") {
            editor.addMenuItem("insertAnchore", {
                text: "插入锚点",
                onclick: function () {
                    ccweditor.insertanchor();
                }
            });
        }
        editor.on("click", function (e) {
            if (e.target.tagName === 'A') {
                e.preventDefault();
            }
        });
        editor.on("keydown", function (e) {
            var ev = document.all ? window.event : e;
            //当前焦点节点
            var selectNode = tinymce.activeEditor.selection.getNode();
            if (selectNode.tagName === 'BODY') {
                return true;
            }
            var focusNode = tinyMCE.activeEditor.selection.getSel().focusNode;
            var children = mcequery(selectNode).children('img');
            if (children.length === 0 && selectNode.tagName === 'P' || selectNode.tagName === 'BR') {
                return true;
            }
            var parents = ccweditor.getParents();
            var keycode = parseInt(ev.keyCode);
            //正确输入
            if (keycode === 8 || keycode === 13 || (keycode >= 37 && keycode <= 40) || keycode === 46) {
                if (keycode === 13) {
                    if (selectNode.tagName === 'IMG') {
                        mcequery(parents).remove();
                        return false;
                    }
                    if (parents.length >= 1) {
                        var p = '<p style="display:inline" data-mce-style="display:inline"><br/></p>';
                        mcequery(parents).before(p).after(p);
                        return false;
                    }
                }
                if (keycode === 8 || keycode === 46) {
                    var prev = mcequery(tinymce.activeEditor.selection.getNode()).prev();
                    if (prev.find('img').length > 0) {
                        mcequery(tinymce.activeEditor.selection.getNode()).remove();
                        //return false;
                    }
                    tinyMCE.activeEditor.dom.remove(parents);
                    return false;
                }
            } else {
                if (parents.length >= 1) {
                    return false;
//                  console.log('这儿只能输入回车/退格/Delete键');
                }
            }
        });

        editor.addMenuItem("hotlink", {
            text: "编辑图片",
            onclick: function () {
                ccweditor.editimage();
            }
        });

        editor.addMenuItem("preview", {
            text: "预览",
            onclick: function () {
                window.open(tinymcepath + "src/preview/index.html?20152121940");
            }
        });

        editor.addMenuItem("fullscreen", {
            text: "全屏",
            onclick: function(editor) {
                ccweditor.fullscreen(editor);
            }
        });
    }
});

$(document).ready(function() {
    $("form").submit(function () {
        //提交前清理
        for (var j = 0; j < tinyMCE.editors.length; j++) {
            var editortemp = tinyMCE.editors[j];
            var imgpos = editortemp.dom.select(".imgpos");
            ccweditor.clean(imgpos);
        }
    });
});

function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    } catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    } catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
}