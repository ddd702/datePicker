/* 
   datePicker.js
   description:滑动选取日期（年，月，日,时间）
   vaersion:1.0
   author:ddd
   https://github.com/ddd702/datePicker
   update：2015-5-5(with iscroll4)
 */
(function($) {
    "use strict";
    $.fn.datePicker = function(options) {
        return this.each(function(e) {
            //插件默认选项
            var that = $(this),
                docType = $(this).is('input'),
                nowdate = new Date(),
                yearScroll = null,
                monthScroll = null,
                dayScroll = null,
                hourScroll = null,
                minuteScroll = null,
                initY = null,
                initM = null,
                initD = null,
                initH = null,
                initI = null,
                initS = null,
                initVal = null;
            /*使用到的全局函数-e*/
            $.fn.datePicker.defaultOptions = {
                beginyear: 2010, //日期--年--份开始
                endyear: 2020, //日期--年--份结束
                monthDay: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], //日期--12个月天数(默认2月是28,闰年为29)--份结束
                days: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                beginhour: 0,
                endhour: 23,
                beginminute: 0,
                endminute: 59,
                curdate: false, //打开日期是否定位到当前日期
                liH: 40,
                theme: "date", //控件样式（1：日期(date)，2：日期+时间(datetime),3:时间(time),4:年月(month)）
                mode: null, //操作模式（滑动模式）
                event: "click", //打开日期插件默认方式为点击后后弹出日期 
                show: true,
                scrollOpt: {
                    snap: "li",
                    checkDOMChanges: true,
                    vScrollbar:false,
                    hScrollbar:false,
                    hScroll:false
                },
                callBack: function() {}
            }
            var opts = $.extend(true, {}, $.fn.datePicker.defaultOptions, options);
            if (!opts.show) {
                that.off('click');
            } else {
                //绑定事件（默认事件为获取焦点）
                that.on(opts.event, function() {
                    init();
                });
            }

            function init() { //初始化函数
                initVal = that.val();
                if (!$('#datePlugin').size()) {
                    $('body').append('<div id="datePlugin"></div>');
                }
                document.getElementsByTagName('body')[0].addEventListener('touchmove', cancleDefault, false);
                if (!opts.curdate && $.trim(initVal) != '') {
                    var inputDate = null,
                        inputTime = null;
                    if (opts.theme == 'date' || opts.theme == 'datetime') {
                        inputDate = initVal.split(' ')[0];
                        initY = parseInt(inputDate.split('-')[0] - parseInt(opts.beginyear)) + 1,
                            initM = parseInt(inputDate.split('-')[1]),
                            initD = parseInt(inputDate.split('-')[2]);
                    }
                    if (opts.theme == 'datetime') {
                        inputTime = initVal.split(' ')[1];
                        initH = parseInt(inputTime.split(':')[0]) + 1,
                            initI = parseInt(inputTime.split(':')[1]) + 1;
                    }
                    if (opts.theme == 'time') {
                        inputTime = initVal;
                        initH = parseInt(inputTime.split(':')[0]) + 1,
                            initI = parseInt(inputTime.split(':')[1]) + 1;
                    }
                    if (opts.theme == 'month') {
                        inputDate = initVal;
                        initY = parseInt(inputDate.split('-')[0] - parseInt(opts.beginyear)) + 1,
                            initM = parseInt(inputDate.split('-')[1]);
                    }
                } else {
                    initY = parseInt(nowdate.getFullYear()) - parseInt(opts.beginyear) + 1,
                        initM = parseInt(nowdate.getMonth()) + 1,
                        initD = parseInt(nowdate.getDate()),
                        initH = parseInt(nowdate.getHours()) + 1,
                        initI = parseInt(nowdate.getMinutes()) + 1,
                        initS = parseInt(nowdate.getSeconds());
                }
                $('#datePlugin').show();
                destroyScroll();
                renderDom();
                $('#d-okBtn').on('click', function(event) {
                    destroyScroll();
                    document.getElementsByTagName('body')[0].removeEventListener('touchmove', cancleDefault, false);
                    var y = $('#yearScroll li').eq(initY).data('num');
                    var M = $('#monthScroll li').eq(initM).data('num');
                    var d = $('#dayScroll li').eq(initD).data('num');
                    var h = $('#hourScroll li').eq(initH).data('num');
                    var m = $('#minuteScroll li').eq(initI).data('num');
                    that.val($('.d-return-info').html());
                    $('#datePlugin').hide().html('');
                    opts.callBack({y:y,M:M,d:d,h:h,m:m});
                });
                $('#d-cancleBtn').on('click', function(event) {
                    destroyScroll();
                    $('#datePlugin').hide().html('');
                    document.getElementsByTagName('body')[0].removeEventListener('touchmove', cancleDefault, false);
                });
            }

            function cancleDefault(event) {
                event.preventDefault();
            }

            function isLeap(y) {
                if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
                    return true;
                } else {
                    return false;
                }
            }

            function renderDom() {
                var mainHtml = ' <div class="d-date-box"><div class="d-date-title">请选择日期</div><p class="d-date-info"><span class="d-day-info"></span><span class="d-return-info"></span></p></div>';
                var btnHtml = '<div class="d-date-btns"><button class="d-btn" id="d-okBtn">确定</button><button class="d-btn" id="d-cancleBtn">取消</button></div>';
                var dateHtml = '<div class="d-date-wrap">';
                dateHtml += '<div class="d-date-mark"></div>';
                dateHtml += '<div class="d-year-wrap d-date-cell" id="yearScroll"><ul></ul></div>';
                dateHtml += '<div class="d-month-wrap d-date-cell" id="monthScroll"><ul></ul></div>';
                dateHtml += '<div class="d-day-wrap d-date-cell" id="dayScroll"><ul></ul></div>';
                dateHtml += '</div>';
                var timeHtml = '<div class="d-date-wrap d-time-wrap">';
                timeHtml += '<div class="d-date-mark"></div>';
                timeHtml += '<div class="d-hour-wrap d-date-cell" id="hourScroll"><ul></ul></div>';
                timeHtml += '<div class="d-minute-wrap d-date-cell" id="minuteScroll"><ul></ul></div>';
                timeHtml += '</div>';
                var monthHtml = '<div class="d-date-wrap">';
                monthHtml += '<div class="d-date-mark"></div>';
                monthHtml += '<div class="d-year-wrap d-date-cell" style="width:50%" id="yearScroll"><ul></ul></div>';
                monthHtml += '<div class="d-month-wrap d-date-cell" style="width:50%" id="monthScroll"><ul></ul></div>';
                monthHtml += '</div>';
                $('#datePlugin').html(mainHtml);
                switch (opts.theme) {
                    case 'date':
                        $('.d-date-box').append(dateHtml);
                        createYear();
                        createMonth();
                        createDay(opts.monthDay[initM - 1]);
                        break;
                    case 'datetime':
                        $('.d-date-box').append(dateHtml);
                        $('.d-date-box').append(timeHtml);
                        createYear();
                        createMonth();
                        createDay(opts.monthDay[initM - 1]);
                        createHour();
                        createMinute();
                        break;
                    case 'time':
                        $('.d-date-box').append(timeHtml);
                        createHour();
                        createMinute();
                        break;
                    case 'month':
                        $('.d-date-box').append(monthHtml);
                        createYear();
                        createMonth();
                        break;
                    default:
                        $('.d-date-box').append(dateHtml);
                        createYear();
                        createMonth();
                        createDay(opts.monthDay[initM - 1]);
                        break;
                }
                $('.d-date-box').append(btnHtml);
                showTxt();
            }

            function showTxt() {
                var y = $('#yearScroll li').eq(initY).data('num'),
                    m = $('#monthScroll li').eq(initM).data('num'),
                    d = $('#dayScroll li').eq(initD).data('num'),
                    h = $('#hourScroll li').eq(initH).data('num'),
                    i = $('#minuteScroll li').eq(initI).data('num'),
                    date = new Date(y + '-' + m + '-' + d);
                switch (opts.theme) {
                    case 'date':
                        $('.d-day-info').html(opts.days[date.getDay()] + "&nbsp;");
                        $('.d-return-info').html(y + '-' + m + '-' + d);
                        break;
                    case 'datetime':
                        $('.d-day-info').html(opts.days[date.getDay()] + "&nbsp;");
                        $('.d-return-info').html(y + '-' + m + '-' + d + ' ' + h + ':' + i);
                        break;
                    case 'time':
                        $('.d-return-info').html(h + ':' + i);
                        break;
                    case 'month':
                        $('.d-return-info').html(y + '-' + m);
                        break;
                    default:
                        $('.d-day-info').html(opts.days[date.getDay()] + "&nbsp;");
                        $('.d-return-info').html(y + '-' + m + '-' + d);
                        break;
                }
            }
            function destroyScroll(){//销毁iscroll滚动
                var scrollArr=[yearScroll,monthScroll,dayScroll,hourScroll,minuteScroll];
                scrollArr.forEach(function(itm){
                    if (itm!=null) {
                        itm.destroy();
                        itm=null;
                    }
                });
            }
            function createYear() {
                var yearDom = $('#yearScroll'),
                    yearNum = opts.endyear - opts.beginyear,
                    yearHtml = '<li></li>';
                for (var i = 0; i <= yearNum; i++) {
                    yearHtml += '<li data-num=' + (opts.beginyear + i) + '>' + (opts.beginyear + i) + '年</li>';
                };
                yearDom.find('ul').html(yearHtml).append('<li></li>');
                yearScroll = new iScroll('yearScroll', $.extend(true, {}, opts.scrollOpt, {
                    onScrollEnd: function() {
                        yearScrollEnd(this);
                    }
                }));
                yearScroll.scrollTo(0, -(initY - 1) * opts.liH);

                function yearScrollEnd(_this) {
                    var yIndex = Math.floor(-_this.y / opts.liH);
                    initY = yIndex + 1;
                    if (isLeap(parseInt(yearDom.find('li').eq(initY).data('num')))) {
                        opts.monthDay[1] = 29;
                    } else {
                        opts.monthDay[1] = 28;
                    }
                    if (initM == 2 && opts.theme != 'month') {
                        createDay(opts.monthDay[initM - 1]);
                    }
                    showTxt();
                };
            }

            function createMonth() {
                var monthDom = $('#monthScroll'),
                    monthHtml = '<li></li>';
                for (var i = 1; i <= 12; i++) {
                    if (i < 10) {
                        monthHtml += '<li data-num="0' + i + '">0' + i + '月</li>';
                    } else {
                        monthHtml += '<li data-num="' + i + '">' + i + '月</li>';
                    }
                };
                monthDom.find('ul').html(monthHtml).append('<li></li>');
                monthScroll = new iScroll('monthScroll', $.extend(true, {}, opts.scrollOpt, {
                    onScrollEnd: function() {
                        monthScrollEnd(this);
                    }
                }));
                monthScroll.scrollTo(0, -(initM - 1) * opts.liH);

                function monthScrollEnd(_this) {
                    console.log('month');
                    var mIndex = Math.floor(-_this.y / opts.liH);;
                    var dayNum = opts.monthDay[mIndex];
                    initM = mIndex + 1;
                    if (opts.theme != 'month') {
                        createDay(dayNum);
                    }
                    showTxt();
                }
            }

            function createDay(dayNum) {
                var dayDom = $('#dayScroll'),
                    dayHtml = '<li></li>';
                for (var i = 1; i <= dayNum; i++) {
                    if (i < 10) {
                        dayHtml += '<li data-num="0' + i + '">0' + i + '日</li>';
                    } else {
                        dayHtml += '<li data-num="' + i + '">' + i + '日</li>';
                    }
                };
                dayDom.find('ul').html(dayHtml).append('<li></li>');
                dayScroll = new iScroll('dayScroll', $.extend(true, {}, opts.scrollOpt, {
                    onScrollEnd: function() {
                        dayScrollEnd(this);
                    }
                }));
                if (initD > opts.monthDay[initM - 1]) {
                    initD = 1;
                }
                dayScroll.scrollTo(0, -(initD - 1) * opts.liH);

                function dayScrollEnd(_this) {
                    initD = Math.floor(-_this.y / opts.liH) + 1;
                    showTxt();
                }
            }

            function createHour() {
                var hourDom = $('#hourScroll'),
                    hourHtml = '<li></li>';
                for (var i = opts.beginhour; i <= opts.endhour; i++) {
                    if (i < 10) {
                        hourHtml += '<li data-num="0' + i + '">0' + i + '时</li>';
                    } else {
                        hourHtml += '<li data-num="' + i + '">' + i + '时</li>';
                    }
                };
                hourDom.find('ul').html(hourHtml).append('<li></li>');
                hourScroll = new iScroll('hourScroll',  $.extend(true, {}, opts.scrollOpt, {
                    onScrollEnd: function() {
                        hourScrollEnd(this);
                    }
                }));
                hourScroll.scrollTo(0, -(initH - 1) * opts.liH);
                function hourScrollEnd(_this) {
                    initH = Math.floor(-_this.y / opts.liH) + 1;
                    showTxt();
                }
            }

            function createMinute() {
                var minuteDom = $('#minuteScroll'),
                    minuteHtml = '<li></li>';
                for (var i = 0; i <= 59; i++) {
                    if (i < 10) {
                        minuteHtml += '<li data-num="0' + i + '">0' + i + '分</li>';
                    } else {
                        minuteHtml += '<li data-num="' + i + '">' + i + '分</li>';
                    }
                };
                minuteDom.find('ul').html(minuteHtml).append('<li></li>');
                minuteScroll = new iScroll('minuteScroll', $.extend(true, {}, opts.scrollOpt, {
                    onScrollEnd: function() {
                        minuteScrollEnd(this);
                    }
                }));
                minuteScroll.scrollTo(0, -(initI - 1) * opts.liH);
                function minuteScrollEnd(_this) {
                    initI = Math.floor(-_this.y / opts.liH) + 1;
                    showTxt();
                }
            }
        });
    }
})(typeof(Zepto) != 'undefined' ? Zepto : jQuery);
