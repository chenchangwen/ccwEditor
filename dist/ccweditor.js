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
        var timeEnd, //结束时间
                 timeDistance, //时间差
                 cycleTimeEnd; //循环时间
        var $img = $(".imgpos[linktype=\"countdown\"]:first").parent().children("img");
        var startdate = $img.attr("startdate");
        var enddate = $img.attr("enddate");
        var dayhours = $img.attr("dayhours");

        if (startdate != undefined) {
            startdate = new Date($img.attr("startdate").replace(/-/ig, "/"));
        }
        if (enddate != undefined) {
            enddate = new Date($img.attr("enddate").replace(/-/ig, "/"));
        }

        var fontstyle = $img.attr("fontstyle");
        if (fontstyle != undefined) {
            fontstyle = $img.attr("fontstyle").replace(/\$\$/ig, ";");
        }

        $countdown.each(function () {
            var $this = $(this);
            var linktarget = $this.attr("target") || $this.attr("linktarget"),
                datetype = $this.attr("datetype"),
                cdsuffix = $this.attr("cdsuffix");
            //替换'-'为能被Date对象所处理的字符串
            date = $this.data("id") == undefined ? "0" : $this.data("id").replace(/-/ig, "/");
            if (linktarget === "2") {
                cycleTimeEnd = date.split(",");
            } else if (linktarget === "0") {
                timeEnd = startdate;
            } else if (linktarget === "1") {
                timeEnd = enddate;
            }

            var style = $this.attr("style") + (fontstyle === ';font-size:;color:;' ? '' : fontstyle);
            $this.attr("style", style);
            if ($this.css("font-size") !== "") {
                style += "line-height:" + $this.css("font-size");
            }
            $this.attr("style", style);
            var html = "";
            var issuffix = cdsuffix === "true" ? true : "";
            switch (datetype) {
                case "hour":
                    if (issuffix) {
                        issuffix = "时";
                    }
                    html += "<span class='hour'></span>" + "<span>" + issuffix + "</span>";
                    break;
                case "minute":
                    if (issuffix) {
                        issuffix = "分";
                    }
                    html += "<span class='minute'></span>" + "<span>" + issuffix + "</span>";
                    break;
                case "second":
                    if (issuffix) {
                        issuffix = "秒";
                    }
                    html += "<span class='second'></span>" + "<span>" + issuffix + "</span>";
                    break;
            }
            $this.html(html);
        });

        var timeHour = $(".hour"),
            timeMinute = $(".minute"),
            timeSecond = $(".second");

        function countDown() {
            //获取当前服务器时间
            var timeNow = serverTime * 1000;
            if (cycleTimeEnd != undefined) {
                for (var i = 0; i < cycleTimeEnd.length - 1; i++) {
                    //活动未开始
                    if (timeNow <= startdate) {
                        timeDistance = startdate - timeNow;
                    }
                        //活动开始
                    else if (timeNow > startdate) {
                        //开始根据循环时间(小时)处理
                        var timeNowDate = new Date(timeNow);
                        var timeNowHour = timeNowDate.getHours();
                        var year = timeNowDate.getFullYear();
                        var month = timeNowDate.getMonth() + 1;
                        var day = timeNowDate.getDate();
                        var cycleHour = parseInt(cycleTimeEnd[i]);
                        //如果当前时间小于循环时间
                        //时间循环只要不超过结束时间,用cycleHour构建的时间减去当前时间即可
                        if (timeNowHour < cycleHour) {
                            var edate = year + "/" + month + "/" + day + " " + cycleHour + ":00:00";
                            timeDistance = new Date(edate) - timeNow;
                            break;
                        }
                    }
                }
            }
                //距离开始时间, 距离结束时间类型
            else if (timeEnd != undefined) {
                timeDistance = timeEnd - timeNow;
            } else {
                //先开始后结束类型
                if (timeNow <= startdate) {
                    timeDistance = startdate - timeNow;
                } else if (timeNow > startdate) {
                    timeDistance = enddate - timeNow;
                }
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
                    timeHour.html(intDay + "天 " + intHour);
                } else {
                    //intHour = parseInt(intHour) + (intDay * 24);
                    timeHour.html(maxintHour);
                }

                timeMinute.html(intMinute);
                timeSecond.html(intSecond);

                cdtimeout = setTimeout(countDown, 1000);
                serverTime += 1;
            } else {
                //活动结束
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