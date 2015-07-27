var goodIdAry = [],
    showGoodIdAry = [];
var patterns = [/goods_id=\d+/, /\d+.html/ig, /goods-\d+/],
    $imgpos,
    $countdown,
    serverTime = new Date().getTime() / 1000;
var ccweditor = {
    /* 图片热点事件 */
    imgPosEvent: function() {
        $imgpos.each(function(i) {
            var $this = $(this);
            /* 显示a标签 */
            if ($this[0].tagName === "A" || $this.attr("linktype") === "countdown") {
                $this.css("display", "block!important");
            } else {
                $this.css("display", "none");
            }
            var str = $this.attr("href");
            if (str) {
                if (str.indexOf("item.shenba.com") >= 0) {
                    for (var k = 0; k < patterns.length; k++) {
                        if (patterns[k].test(str)) {
                            str = str.toString();
                            str = str.match(patterns[k]);
                        }
                    }
                    if (str != null) {
                        str = str.toString().match(/\d+/);
                        if ($this.attr("linkicon") == undefined) {
                            if (str != null) {
                                goodIdAry.push(str);
                            }
                        }
                    }
                }
            }
            /* 如果是最后一个,则显示图片tip */
            if (i === ($imgpos.length - 1)) {
                ccweditor.showGoodPicTip();
            }
        });
    },
    /* 切换图片事件 */
    trnpicEvent: function () {
        $('.cropwrap img').each(function () {
            var $this = $(this);
            if ($this.attr("trnpic") != undefined) {
                /* 切换图片src */
                var trnpic = $this.attr("trnpic").split(",");
                /* 切换图片时间 */
                var trndate = $this.attr("trndate").split(",");
                if (trndate !== "") {
                    $this.hide();
                    var timeNow = serverTime * 1000;
                    var timeNowDate = new Date(timeNow);
                    var timeNowHour = timeNowDate.getHours();
                    for (var i = 0; i < trnpic.length; i++) {
                        //如果设定的小时等于当前的小时 并且 当前图片src不等于切换图片的src
                        if (parseInt(trndate[i]) === timeNowHour && $this.attr("src") !== trnpic[i]) {
                            $this.attr("src", trnpic[i]);
                        }
                    }
                    $this.show();
                }
            }
        });
    },
    /* 倒计时事件 */
    countdownEvent: function() {
        var timeDistance; //时间差
        var $img = $(".imgpos[linktype='countdown']:first").parent().children("img");
        var $parent = $img.parent('.cropwrap');
        var startdate = $parent.attr("startdate");
        var enddate = $parent.attr("enddate");
        var dayhours = $img.attr("dayhours");
        $img.removeAttr('dayhours');
        if (startdate != undefined) {
            startdate = new Date(startdate);
        }
        if (enddate != undefined) {
            enddate = new Date(enddate);
        }
        $parent.removeAttr('startdate').removeAttr('enddate');

        $countdown.each(function () {
            var $this = $(this);
            var html = '';
            html += "<span class='edtip'></span>";
            if ($this.attr("cdsuffix")) {
                html += "<span class='edh'></span>" + "<span>时</span>";
                html += "<span class='edm'></span>" + "<span>分</span>";
                html += "<span class='eds'></span>" + "<span>秒</span>";
                $this.removeAttr('cdsuffix');
            } else {
                html += "<span class='edh'></span>";
                html += "<span class='edm'></span>";
                html += "<span class='eds'></span>";
            }
            $this.html(html);
        });
        var $hour = $(".edh"),
            $minute = $(".edm"),
            $tip = $(".edtip"),
            $second = $(".eds");

        function countDown() {
            //获取当前服务器时间
            var timeNow = serverTime * 1000;
            var tip = '';
            if (startdate > timeNow && timeNow < enddate || startdate > timeNow && enddate == undefined) {
                tip = '距离开始时间还有: ';
                timeDistance = startdate - timeNow;
            }
            else if (startdate == undefined && timeNow <= enddate || timeNow <= enddate) {
                tip = '距离结束时间还有: ';
                timeDistance = enddate - timeNow;
            }
           
            var intDay, intHour, intMinute, intSecond, maxintHour;
            if (timeDistance >= 0) {
                // 相减的差数换算成天数   
                intDay = Math.floor(timeDistance / 86400000);
                timeDistance -= intDay * 86400000;
                // 相减的差数换算成小时
                intHour = Math.floor(timeDistance / 3600000);
                //alert(intHour)
                timeDistance -= intHour * 3600000;
                // 相减的差数换算成分钟   
                intMinute = Math.floor(timeDistance / 60000);
                timeDistance -= intMinute * 60000;
                // 相减的差数换算成秒数  
                intSecond = Math.floor(timeDistance / 1000); //判断小时小于10时，前面加0进行占位
                if (intHour < 10)
                    intHour = "0" + intHour;
                // 判断分钟小于10时，前面加0进行占位      
                if (intMinute < 10)
                    intMinute = "0" + intMinute;
                // 判断秒数小于10时，前面加0进行占位 
                if (intSecond < 10)
                    intSecond = "0" + intSecond;
                //转换后:最大小时
                maxintHour = parseInt(intHour) + (intDay * 24);
                //如果剩余天数大于1,并且开启天数转换
                if (intDay > 0 && dayhours === "true" && maxintHour >= 24) {
                    $hour.html(intDay + "天" + intHour);
                } else {
                    //intHour = parseInt(intHour) + (intDay * 24);
                    $hour.html(maxintHour);
                }
                $tip.html(tip);
                $minute.html(intMinute);
                $second.html(intSecond);

                cdtimeout = setTimeout(countDown, 1000);
                serverTime += 1;
            } else {
                if (typeof cdtimeout != "undefined")
                    clearTimeout(cdtimeout);
                $countdown.remove();
            }
        }
        countDown();
    },
    /* 显示商品图片提示 */
    showGoodPicTip: function() {
        if (goodIdAry.length === 0)
            return false;
        var query = {
            url: "/index.php?act=index&op=getgoods_storage",
            data: {
                client: "pc",
                goods_id: goodIdAry.toString()
            }
        };

        function requestData(option, cb) {
            var settings = {
                type: "post"
            };
            var options = $.extend({}, settings, option);
            $.ajax({
                url: options.url,
                data: options.data,
                type: options.type,
                success: function(msg) {
                    if (typeof cb == "function") {
                        cb(msg);
                    }
                }
            });
        }

        /* 请求是否显示图片id的商品 */
        requestData(query, function(response) {
            var json = $.parseJSON(response);
            if (json.data != undefined) {
                var jsondata = json.data;
                if (jsondata.status === 1) {
                    if (jsondata.list != undefined) {
                        var jsonlist = jsondata.list;
                        var i = 0, len = 0;
                        for (i = 0, len = jsonlist.length; i < len; i++) {
                            /* 如果数量大于1则存储 */
                            if (jsonlist[i].goods_storage <= 0) {
                                if (jsonlist[i].goods_id !== "")
                                    showGoodIdAry.push(jsonlist[i].goods_id);
                            }
                        };
                        /* 遍历需要显示的id数组 */
                        for (i = 0, len = showGoodIdAry.length; i < len; i++) {
                            $(".imgpos").each(function() {
                                var $this = $(this);
                                var href = $this.attr("href");
                                if (href) {
                                    for (var j = 0; j < patterns.length; j++) {
                                        href = href.toString().match(/\d+/);
                                        if (href[0] == showGoodIdAry[i]) {
                                            $this.children("b").css("display", "block");
                                        }
                                    }
                                }
                            });
                        };
                    }
                }
            }
        });
    },
    /* dom缓存 */
    domCache: function() {
        $imgpos = $(".imgpos");
        $countdown = $(".imgpos[linktype='countdown']");
    },
    /* 绑定事件 */
    bindEvents: function () {
        ccweditor.trnpicEvent();
        ccweditor.imgPosEvent();
        ccweditor.countdownEvent();
    },
    /* 构造方法 */
    struc: function() {
        $(document).ready(function() {
            ccweditor.domCache();
            ccweditor.bindEvents();
        });
    }
};
ccweditor.struc();