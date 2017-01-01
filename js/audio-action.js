var backDa;
var flag = -1; //设置一个初始值 判断歌曲
// ================================解决代码冗余的处理数据部分 start=============================
function DisposeData(data) {
    document.querySelector('audio').src = data[flag].path; //待修改
    document.querySelector(lead.songName).innerHTML = data[flag].songName;
    document.querySelector(lead.singer).innerHTML = data[flag].name;
    document.querySelector(lead.cover).src = data[flag].musicimg;
    document.querySelector(lead.cover2).src = data[flag].musicimg;
    for (var i = 0, len = $(lead.musicList).children().length; i < len; i++) {
        $(lead.musicList).children()[i].style.backgroundColor = '';
    }
    $(lead.musicList).children()[flag].style.backgroundColor = lead.bgcolor;
}
// ================================解决代码冗余的处理数据部分 end=============================

// ==================================内部自用 start==========================================
function my_template(templateString, obj) {
    //用正则查找这类文字
    var reg = /{(\w+)}/; //1个或多个  +
    var result;
    while (result = reg.exec(templateString)) {
        var replaceString = result[0]; //需要更换的值
        var key = result[1]; //不带大括号的那个值
        templateString = templateString.replace(replaceString, obj[key]); //替换
    }
    return templateString;
}

function back(backDT, gain, target) {
    for (var i = 0; i < backDT.length; i++) {
        datas = backDT[i];
        var templateObj = document.querySelector(gain).innerHTML;
        document.querySelector(target).innerHTML += my_template(templateObj, datas);
    }
}
// ==================================内部自用 end==========================================
if ($(lead.musicList).children()[0] == undefined) {
    $.ajax({
        url: lead.url,
        success: function(backData) {
            backDa = backData.length;
            back(backData, lead.template, lead.musicList);
        }
    });
}

// ========================== 打开列表点击歌曲进行更换start ================================
/*
1.打开音乐列表的那个按钮
2.点击音乐列表中的单个歌曲更换当前歌曲
*/
function listToggle(listBtn, single) {
    $(listBtn).on('click', function() {
        $(single).on('click', function() {
            $.ajax({
                url: lead.url,
                success: function(backData) {
                    DisposeData(backData)
                }
            });
            flag = $(this).index();
            $('.play_backing').html('正在播放(' + ($(this).index() + 1) + '/' + backDa + ')');
        });
    });
}
// ========================== 打开列表点击歌曲进行更换 end ================================

//========================================切换歌曲start========================================
// 1.切换歌曲的按钮 ( .UpMusic or .DownMusic )
//  + 给上一首按钮 添加class =  'UpMusic'
//  + 给下一首按钮 添加class = 'DownMusic'

function CutMusic(button, boolean) {
    $(button).on('click', function() {
        $.ajax({
            url: lead.url,
            success: function(backData) {
                // 根据id判断歌曲切换
                if (button === '.DownMusic') {
                    if (flag == -1 || flag == backData.length - 1) {
                        flag = 0;
                    } else {
                        flag++;
                    }
                } else if (button === '.UpMusic') {
                    if (flag == -1 || flag == 0) {
                        flag = backData.length - 1;
                    } else {
                        flag--;
                    }
                }
                DisposeData(backData)
            }
        });
    });
}
//========================================切换歌曲 end======================================
// ====================================设置歌曲播放模式 start ===============================
    /*
        参数1 : 调节播放模式的按钮 '.pattern'   pattern
        参数2 : 顺序播放图标 的类名 'glyphicon-arrow-right'  order
        参数3 : 随机播放图标 的类名 'glyphicon-random'  random
        参数4 : 单曲循环图标 的类名 'glyphicon-refresh' circulation
    */

function Pattern(pattern, order, random, circulation) {
        $(pattern).on('click', function() {
            if ($(pattern).hasClass(order)) {
                $(pattern).removeClass(order).addClass(random)
            } else if ($(pattern).hasClass(random)) {
                $(pattern).removeClass(random).addClass(circulation)
            } else if ($(pattern).hasClass(circulation)) {
                $(pattern).removeClass(circulation).addClass(order)
            }
        })
        $('audio').on('ended', function() { //待修改
            $.ajax({
                url: lead.url,
                success: function(backData) {
                    // 根据id判断歌曲切换
                    // 定义播放模式 单曲循环 顺序播放 随机播放
                    //顺序播放已有 随机播放思路: 遍历歌单 拿到歌曲总数 在总数中随机取一个数赋给flag
                    if ($(pattern).hasClass(order)) {
                        //顺序播放
                        if (flag == -1 || flag == backData.length - 1) {
                            flag = 0;
                        } else {
                            flag++;
                        }
                    } else if ($(pattern).hasClass(random)) {
                        //随机播放
                        flag = Math.ceil(Math.random() * backData.length - 1)
                        if (flag == flag) {
                            flag = Math.ceil(Math.random() * backData.length - 1)
                        }
                    } else if ($(pattern).hasClass(circulation)) {
                        //单曲循环
                        flag = flag;
                    }
                    DisposeData(backData)
                }
            });
        });
}
// ====================================设置歌曲播放模式 end ===================================

//========================================暂停和开始 start=======================================
// 1.开始or暂停按钮
// 2.切换按钮图片 或者 字体图标...
function Pause(play, icon) {
    var audio = document.querySelector('audio');
    $(play).on('click', function() {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
        $(this).toggleClass(icon);
    });
}
//========================================暂停和开始 end=======================================

//======================================播放时长控制start==================================
/*
 1.显示在页面上的播放计时
 2.进度条总长度
 3.进度条当前长度
*/
function ControlTime(txtTime, allLength, nowLength) {
    //视频音频可以播放时的事件
    //记录比例 记录总时长 和 当前时长 时分秒
    var proportion, time, atTime, h, m, s;
    audio.addEventListener('canplay', function() {
        //获取总时间
        time = audio.duration;
        //获取当前播放时长
        audio.addEventListener('timeupdate', function() {
            //当前播放时间
            atTime = audio.currentTime;
            //拆分时间
            h = Math.floor(atTime / 360);
            m = Math.floor(atTime / 60);
            s = Math.floor(atTime % 60);
            h = h < 10 ? '0' + h : h;
            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;
            // 文本的方式显示文本
            $(txtTime).html(h + ":" + m + ":" + s);
            //进度条同步   获取比例		进度条长度
            proportion = parseInt($(allLength).width()) / time;
            // 已播放长度
            $(nowLength).css('width', proportion * atTime);
        }, false);
    }, false);
    //跳播 要单独拿出来放到外面
    // 同为-进度条长度
    $(allLength).on('click', function(e) {
        var width = $(this).width();
        //获取点击位置
        var point = e.offsetX;
        audio.currentTime = point / width * audio.duration;
    });
}
//======================================播放时长控制end=====================================

//=====================================音量调节 start========================================
/*
 1.音量初始值  0--1   0 到 1
 2.音量控制按钮
 3.音量控制条
 4.静音按钮
 5.小喇叭图标有音量时显示的图标  'glyphicon-volume-down'
 6.小喇叭图标无音量时显示的图标   'glyphicon-volume-off'
*/
function Volume(normal, control, controller, muteControl, on, off) {
    //如果播放进度等于了 总长度 flag++
    //音量初始值
    audio.volume = normal;
    //音量调节
    $(control).on('mousedown', function(e) {
        //鼠标按下获取此时调节按钮横坐标 ,获取此时距离左边的距离
        var spaceX = e.clientX - $(control).offset().left;
        $(document).on('mousemove', function(e) {
            //重新获取距离
            var left = e.clientX - spaceX;
            //限制最小最大距离
            left = left < $(controller).offset().left ? $(controller).offset().left : left;
            left = left > $(controller).width() + $(controller).offset().left ? $(controller).width() + $(controller).offset().left : left;
            $(control).offset({
                left: left
            });
            //禁止拉动时选中
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            //音量调节
            audio.volume = Math.abs($(controller).offset().left - $(control).offset().left) / 80;
            //如果此时的音量为静音状态 这个时候去调整音量大小  静音的图标就切换为有声的图标
            if ($(muteControl).hasClass(off)) {
                //检测 切换图标
                $(muteControl).removeClass(off).addClass(on);
            }
        });
    });
    //静音
    $(muteControl).on('click', function() {
        if (audio.volume) {
            audio.volume = 0;
            $(this).removeClass(on).addClass(off);
        } else {
            audio.volume = Math.abs($(controller).offset().left - $(control).offset().left) / 80;
            $(this).removeClass(off).addClass(on);
        }
    });
    //鼠标抬起事件取消
    $(document).on('mouseup', function() {
        $(document).off('mousemove');
    });
}
//=====================================音量调节 end ========================================


//=======================================杂项 or 未封装 ====================================
$('.m-list').css({
    'overflow': 'auto',
    'height': '200px'
})


//音乐盒显示和隐藏
$('#fiexible').on('click', function() {
    $('.bigmusic').css({
        'transition': 'all .5s ease',
        'transform': 'translate(-620px,0)'
    });
    $('.minimusic').css({
        'transition': 'all .5s ease .5s',
        'transform': 'translate(0,0)'
    });
});
//音乐列表显示  bigMusic-list
$('.musicList-button').on('click', function() {
    $('.bigMusic-list').fadeIn();
});
$('.closeMusic_list').on('click', function() {
    $('.bigMusic-list').fadeOut();
});
//小音乐盒展开按钮
$('#appear').on('click', function() {
    $('.minimusic').css({
        'transition': 'all .3s ease',
        'transform': 'translate(-70px,0)'
    });
    $('.bigmusic').css({
        'display': 'block',
        'transition': 'all 1s ease .3s',
        'transform': 'translate(0,0)'
    });
});

//开始暂停阴影
$('.miniplay').on('click', function() {
    if (audio.paused) {
        $(this).css('background-color', 'rgba(0,0,0,0.5)');
    } else {
        $(this).css('background-color', 'transparent');
    }
});
//=========================================杂项 or 未封装 =========================================
