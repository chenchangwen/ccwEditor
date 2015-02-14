
(function (exports) {
    var doc = exports.document,
        a = {},
        expose = +new Date(),
        rExtractUri = /((?:http|https|file):\/\/.*?\/[^:]+)(?::\d+)?:\d+/,
        isLtIE8 = ("" + doc.querySelector).indexOf("[native code]") === -1;
    exports.getCurrAbsPath = function () {
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
var tinymcepath = getCurrAbsPath().replace(/src\/.+/, "");

require.config({
    paths: {
        jquery: '../../lib/jquery-1.11.1.min',
        tinymce: '../../lib/tinymce/js/tinymce/tinymce.min',
        utils: '../core/utils',
        jqextend: '../core/jqextend',
        uikitextend: '../core/uikitextend'
    }
});
require(["jquery", "utils", "tinymce"], function ($, utils) {
    var $jq = $.noConflict(true);
    var cropwrap = "cropwrap",
        imgpos = "imgpos",

        mcequery = tinymce.dom.DomQuery,

        zhMsg1 = '请选择正确的区域',

        zhTitle1 = '插入/更换图片',
        zhTitle2 = '新建热点',
        zhTitle3 = '完成',
        zhTitle4 = '锚点',
        zhTitle5 = '编辑图片(双击区域编辑,可点击其他区域快速保存)',

        zhTip1 = '插入/更换图片',
        zhTip2 = '多图上传',
        zhTip3 = '插入锚点',
        zhTip4 = '预览',
        zhTip5 = '全屏',
        zhTip6 = '使用帮助',
        zhTip7 = '转换为切换图片',
        zhTip8 = '编辑图片',

        display = 'display',
        inline = 'inline',
        linketype = 'linketype',
        target = 'target',
        href = 'href',
        iframe = 'iframe',
        anchor = 'anchor',
        img = 'img',
        p = 'p',
        div = 'div',
        body = 'body',
        a = 'a',
        br = 'br',
        usemap = 'usemap',
        temparea = [];
        

    var ccweditor = {
        template: {
            p: function (str) {
                return "<p data-mce-style=\"display:inline\" style=\"display:inline\">" + (str || "") + "</p>";
            },
            b: function (compareelement) {
                var width = parseInt(compareelement.css("width").replace(/px/, ""));
                var height = parseInt(compareelement.css("height").replace(/px/, ""));
                var centerleft = (utils.accDiv(width, 2) - 45) || 0;
                var centertop = (utils.accDiv(height, 2) - 45) || 0;
                var tipchildstyle = "left:" + centerleft + "px;top:" + centertop + "px;";
                var html = "<b style=\"" + tipchildstyle + "\"></b>";
                return html;
            },
            cropwrap: function () {
                return '<div class="cropwrap" data-mce-style="position:relative;" style="position:relative"></div>';
            }
        },
        insertimage: function (editor) {
            ccweditor.fixEditorIndex(editor);
            if ($jq(tinymce.activeEditor.selection.getNode()).hasClass(imgpos)) {
                alert(zhMsg1);
                return false;
            }
            tinymce.activeEditor.windowManager.open({
                title: zhTitle1,
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
        editimage: function () {
            if (isValidCheck()) {
                var w = ($jq(document).width() < $jq(body).width() ? $jq(document).width() : $jq(body).width()) - 50,
                    h = (document.all ? document.getElementsByTagName("html")[0].offsetHeight : window.innerHeight) - 100;
                tinymce.activeEditor.windowManager.open({
                    title: zhTitle5,
                    url: tinymcepath + "src/edit/index.html?20152121940",
                    width: w,
                    height: h,
                    buttons: [
                        {
                            text: zhTitle2,
                            onclick: function () {
                                $jq("#" + getMceActiveId()).find(iframe).contents().find("#addhotlink").click();
                            }
                        },
                        {
                            text: zhTitle3,
                            onclick: function () {
                                $jq("#" + getMceActiveId()).find(iframe).contents().find("#save").click();
                                var content = $jq("#" + getMceActiveId()).find(iframe).contents().find("#content").html();
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
        insertanchor: function () {
            if ($jq(tinymce.activeEditor.selection.getNode()).hasClass(imgpos)) {
                alert(zhMsg1);
                return false;
            }
            var thisobj = this;
            tinymce.activeEditor.windowManager.open({
                title: zhTitle4,
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
        fixEditorIndex: function (editor) {
            tinymce.activeEditor.fsindex = 0;
            if (editor.id === "mce2") {
                tinymce.activeEditor.fsindex = 1;
            }
        },
        getParents: function () {
            var focusNode = tinyMCE.activeEditor.selection.getSel().focusNode;
            var parents = tinymce.activeEditor.dom.getParents(focusNode, p);
            if (parents.length === 0) {
                parents = tinymce.activeEditor.dom.getParents(focusNode, div);
            }
            return parents;
        },
        setAttributes: function (fromelement, toelement) {
            var attribute = fromelement.getAttributes();
            var content = "", str;
            for (var key in attribute) {
                var value = attribute[key];
                if (key !== "contenteditable") {
                    if (typeof toelement == "string") {
                        
                        content += key + "=\"" + value + "\"";
                    } else {
                        toelement.attr(key, value);
                    }
                }
            }
            if (toelement === "a") {
                content = content.replace(/linktarget/g, target).replace(/新建窗口/g, "_blank").replace(/当前窗口/g, "_self").replace(/link=/g, "href=");
                str = "<rename " + content + ">" + "<rename>";
                str = str.replace(/rename/ig, toelement);
                fromelement.wrap(str);
                //锚点不加图片提示
                var parent = fromelement.parent();
                //是否有coords
                var pcoords = parent.attr('coords');
                if (pcoords != undefined) {
                    var tcoords = pcoords.split(',');
                    var coords = {
                        x: tcoords[0], //left
                        y: tcoords[1], //top
                        w: tcoords[2], //width
                        h: tcoords[3]  //heigth
                    };
                    var style = 'position:absolute;left:' + coords.x + 'px;top:' + coords.y + 'px;width:' + (coords.w - coords.x) + 'px;';
                    parent.attr('style', style).removeAttr('coords').removeAttr('shape');
                }
                if (fromelement.attr(linketype) !== anchor) {
                    parent.append(this.template.b(fromelement));
                } else {
                    //并且删除该属性
                    parent.attr(href, "#" + parent.attr(target)).removeAttr(target).removeAttr("cdsuffix");
                }
            }
        },
        //转换旧编辑器内容
        convert: function (el) {
            var $jqel = $jq(el);
            var $jqparent, $jqmap, $jqchildren;
            //img
            if ($jqel[0].tagName === "IMG") {
                var id = $jqel.attr(usemap).replace(/#/g, '');
                $jqmap = tinymce.activeEditor.dom.select("#" + id);
                $jqchildren = mcequery($jqmap).children('area');

                //如果有area必须加cropwrap
//                if ($jqchildren.length > 0) {
//                    $jqel.wrap(ccweditor.template.cropwrap());
//                }

                $jqchildren.each(function () {
                    //将area转换成a
                    var $jqthis = $jq(this);
                    ccweditor.setAttributes($jqthis, a);
                    //$jqthis.remove();
                });
                //不让图片隐藏
                $jqel.css(display, '').css(display, 'block');
            }
            //div.cropwrap
            else if ($jqel.hasClass(cropwrap)) {
                var $jqimg = $jqel.children(img);
                $jqmap = $jqel.children("map");
                var $jqimgpos = $jqel.children(".imgpos");
                if ($jqmap.length > 0) {
                    $jqmap.remove();
                    //获得所有map的属性
                    this.setAttributes($jqmap, $jqimg);
                    $jqimg.removeAttr(usemap);
                }
                //将所有imgpos转换为a
                $jqimgpos.each(function () {
                    var $jqthis = $jq(this);
                    $jqthis.attr(target, $jqthis.attr("linktarget"));
                    if ($jqthis[0].tagName !== "MAP" && $jqthis.attr(linketype) !== "link" && $jqthis.attr(linketype) !== anchor) {
                        return false;
                    } else {
                        ccweditor.setAttributes($jq(this), a);
                        $jq(this).remove();
                    }
                });
            }
                //a
            else if ($jqel[0].tagName === "A") {
                var data = $jqel.attr("data");
                if (data != undefined) {
                    data = data.split("|||");
                    //最多6个属性(超链接)
                    if (data[0] == 1) {
                        if ($jqel.attr(href).indexOf("#") >= 0) {
                            $jqel.attr(linketype, anchor);
                        } else {
                            if (data[1] !== "") {
                                $jqel.attr(href, data[1]);
                            }
                            $jqel.attr(linketype, "link");
                        }

                        if (data[2] !== "") {
                            $jqel.attr(target, data[2]);
                        }
                        if (data[3] !== "") {
                            $jqel.css("left", data[3]);
                        }
                        if (data[4] !== "") {
                            $jqel.css("width", data[4]);
                        }
                        if (data[5] !== "") {
                            $jqel.css("top", data[5]);
                        }
                        if (data[5] !== "") {
                            $jqel.css("width", data[5]);
                        }
                        if (data[6] !== "") {
                            $jqel.css("height", data[6]);
                        }
                        var centerleft = (utils.accDiv(data[5], 2) - 45) || 0;
                        var centertop = (utils.accDiv(data[6], 2) - 45) || 0;
                        var tipchildstyle = "left:" + centerleft + "px;top:" + centertop + "px;";
                        var html = "<b style=\"" + tipchildstyle + "\"></b>";
                        $jqel.removeAttr("data");
                        $jqel.append(html);
                    }
                    $jqel.removeAttr("class");
                    $jqel.addClass(imgpos);
                    $jqel.css("position", "absolute");
                    $jqparent = $jqel.parent(div);
                    $jqparent.removeAttr("id");
                    $jqparent.removeAttr("class");
                    $jqparent.addClass(cropwrap);
                    $jqparent.children(img).removeAttr("id");
                }
                var name = $jqel.attr("name");
                if (name != undefined) {
                    $jqparent = $jqel.parent();
                    if ($jqparent[0].tagName === "P") {
                        $jqparent.css(display,inline);
                        $jqparent.attr("data-mce-style",inline);
                    } else {
                        $jqel.wrap(ccweditor.template.p());
                    }
                    $jqel.attr("id", name);
                    $jqel.addClass("tempanchor");
                }
            }
        },
        //清理格式
        clean: function (el) {
            for (var i = 0, len = el.length; i < len; i++) {
                var $jqel = $jq(el[i]);
                $jqel.css("border", "0").removeAttr("contenteditable");
                var style = $jqel.attr("style");
                $jqel.attr("data-mce-style", style);
            }
        }
    }

    tinymce.init({
        selector: "#mce1,#mce2",
        theme: "modern",
        width: "100%",
        height: 500,
        cleanup: true,
        object_resizing: false,
        plugins: [
            "code fullscreen link",
            "save contextmenu"
        ],
        menu: {},
        content_css: tinymcepath + "css/ccweditor.css",
        contextmenu: "insertAnchore | hotlink | convertpic | insertpic | preview | fullscreen |",
        language: "zh_CN",
        toolbar: "undo redo newdocument link btnanchor btninsertimage btnmupload btnpreview code btnfullscreen btndocument",
        relative_urls: false,
        valid_elements: "*[*]",
        setup: function (editor) {
            var tplp = ccweditor.template.p();

            editor.on("init", function () {
                var classcropwrap = '.cropwrap';
                var $img = editor.dom.select(classcropwrap);
                var i;
                for (i = 0; i < $img.length; i++) {
                    $jq($img[i]).wrap(tplp);
                }

                //测试用
                 editor.setContent('');
                 editor.insertContent('<div class="bbbb"><div class="aaaa"><img usemap="mymap" src="http://localhost:1617/images/test.jpg?123" /><map name="mymap"><AREA SHAPE=\"rect\"COORDS=\"0,0,82,126\"href=\"#\"></map></div>');

                var selectel, el;
                //清除br
                selectel = editor.dom.select(br);
                for (i = 0; i < selectel.length; i++) {
                    el = selectel[i];
                    tinymce.activeEditor.dom.remove(el);
                }
                //将map转换为a
                selectel = editor.dom.select(classcropwrap);
                for (i = 0; i < selectel.length; i++) {
                    el = selectel[i];
                    ccweditor.convert(el);
                }

                //将img转换为a
                selectel = editor.dom.select(img);
                for (i = 0; i < selectel.length; i++) {
                    el = selectel[i];
                    ccweditor.convert(el);
                }

                //还原border,及超链接,及锚点
                selectel = editor.dom.select(a);
                for (i = 0; i < selectel.length; i++) {
                    el = selectel[i];
                    ccweditor.convert(el);
                    var querya = mcequery(el);
                    var parent = querya.parent();
                    //如果不是锚点,并且子元素没有img
                    if (!editor.dom.hasClass(el, "tempanchor") && querya.children(img).length <= 0)
                        editor.dom.setStyle(el, "border", "2px solid blue");
                    editor.dom.setAttrib(el, "contenteditable", "false");
                    //如果父元素是p
                    if (parent[0].tagName === "P") {
                        parent.css(display, inline).attr("data-mce-style", inline);
                    } else {
                        querya.wrap(tplp);
                    }
                }

                tinymce.activeEditor.transitionPic = [];
            });

            editor.addButton("btninsertimage", {
                icon: "btninsertimage",
                tooltip: zhTip1,
                onclick: function () {
                    ccweditor.insertimage(editor);
                }
            });

            editor.addButton("btnmupload", {
                icon: "btnmupload",
                tooltip: zhTip2,
                onclick: function () {
                    tinymce.activeEditor.fsindex = 0;
                    if (editor.id === "mce2") {
                        tinymce.activeEditor.fsindex = 1;
                    }
                    tinymce.activeEditor.windowManager.open({
                        title: zhTip2,
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
                tooltip: zhTip3,
                onclick: function () {
                    ccweditor.insertanchor();
                }
            });

            editor.addButton("btnpreview", {
                icon: "btnpreview",
                tooltip: zhTip4,
                onclick: function () {
                    window.open(tinymcepath + "src/preview/index.html?20152121940");
                }
            });

            editor.addButton("btnfullscreen", {
                icon: "btnfullscreen",
                tooltip: zhTip5,
                onclick: function () {
                    ccweditor.fullscreen(editor);
                }
            });

            editor.addButton("btndocument", {
                icon: "btndocument",
                tooltip: zhTip6,
                onclick: function () {
                    window.open(tinymcepath + "src/document/index.html?20152121940");
                }
            });

            editor.addMenuItem("insertpic", {
                text: zhTip1,
                onclick: function () {
                    ccweditor.insertimage(editor);
                }
            });

            editor.addMenuItem("convertpic", {
                text: zhTip7,
                onclick: function () {
                    if (isValidCheck()) {
                        var pnode, isimgpos = false, src;
                        var pic = tinymce.activeEditor.selection.getNode();
                        //是否一个imgpos
                        if ($jq(pic).hasClass("imgpos")) {
                            var img = $jq(pic.parentNode).children("img");
                            src = img.attr("data-mce-src") || img.attr("src");
                            isimgpos = true;
                        } else {
                            src = $jq(pic).attr("data-mce-src") || $jq(pic).attr("src");
                        }
                        if (src[0] === ".") {
                            src = src.substr(1, src.length);
                        }
                        tinymce.activeEditor.transitionPic.push(src);
                        if ($jq(pic.parentNode).hasClass(cropwrap) || isimgpos) {
                            //wrap div 是否一个p
                            if (pic.parentNode.parentNode.tagName === "P") {
                                pnode = pic.parentNode.parentNode;
                            } else {
                                pnode = pic.parentNode;
                            }
                            //tinyMCE.activeEditor.execCommand("mceRemoveNode", false, pic);
                        }
                        tinyMCE.activeEditor.execCommand("mceRemoveNode", true, pic);
                        if (pnode != undefined) {
                            if (pnode.parentNode.tagName === "P") {
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
                    text: zhTip3,
                    onclick: function () {
                        ccweditor.insertanchor();
                    }
                });
            }
            editor.on("click", function (e) {
                if (e.target.tagName === "A") {
                    e.preventDefault();
                }
            });
            editor.on("keydown", function (e) {
                var ev = document.all ? window.event : e;
                var selectNode = tinymce.activeEditor.selection.getNode();
                if (selectNode.tagName === "BODY") {
                    return true;
                }
                var children = mcequery(selectNode).children(img);
                if (children.length === 0 && selectNode.tagName === "P" || selectNode.tagName === "BR") {
                    return true;
                }
                var parents = ccweditor.getParents();
                var keycode = parseInt(ev.keyCode);
                //正确输入
                if (keycode === 8 || keycode === 13 || (keycode >= 37 && keycode <= 40) || keycode === 46) {
                    if (keycode === 13) {
                        if (selectNode.tagName === "IMG") {
                            mcequery(parents).remove();
                            return false;
                        }
                        if (parents.length >= 1) {
                            var p = ccweditor.template.b("<br/>");
                            mcequery(parents).before(p).after(p);
                            return false;
                        }
                    }
                    if (keycode === 8 || keycode === 46) {
                        var prev = mcequery(tinymce.activeEditor.selection.getNode()).prev();
                        if (prev.find(img).length > 0) {
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
                text: zhTip8,
                onclick: function () {
                    ccweditor.editimage();
                }
            });

            editor.addMenuItem("preview", {
                text: zhTip4,
                onclick: function () {
                    window.open(tinymcepath + "src/preview/index.html?20152121940");
                }
            });

            editor.addMenuItem("fullscreen", {
                text: zhTip5,
                onclick: function (editor) {
                    ccweditor.fullscreen(editor);
                }
            });
        }
    });

    function getMceActiveId() {
        return tinymce.activeEditor.windowManager.getWindows()[0]["_id"];
    }

    function isValidCheck() {
        $jq("body").focus();
        //如果父元素有cropwrap则还是选择图片
        if (mcequery(tinymce.activeEditor.selection.getNode().parentNode).hasClass(cropwrap)) {
            tinyMCE.activeEditor.dom.select(tinyMCE.activeEditor.dom.select(img)[0]);
        }
        else
            if (tinymce.activeEditor.selection.getNode().tagName !== "IMG") {
                alert("请选择图片");
                return false;
            }
        return true;
    };

    $jq(document).ready(function () {
        $jq("form").submit(function () {
            //提交前清理
            for (var j = 0; j < tinyMCE.editors.length; j++) {
                var editortemp = tinyMCE.editors[j];
                var imgpos = editortemp.dom.select(".imgpos");
                ccweditor.clean(imgpos);
            }
        });
    });

});
