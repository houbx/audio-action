
#### audio-action

+ 使用方法  
    - 创建一个  <script type="text/template" id="template"> </script>
        * 这是一个显示在页面中的歌曲清单(如果不需要可忽略)
        * 将你要从后台数据中取出放到页面中的信息用 { 键 } 一对大括号包起来
        * 例如下面这样
```html
<script type="text/template" id="template">
    <li class="">
        <span class="">{songName}</span>
        <span class="">{name}</span>
    </li>
</script>
```


```js
/*定义数据配置 */
var lead = {
        url :       //后台歌曲信息数据地址      例 : 'music.json'
        template :  //歌曲清单模板             例 : '#template'
        songName :  //放置歌曲名的标签         例 : '.songName'
        singer :    //放置演唱者的标签         例 : '.singer'
        cover :     //放置封面的标签           例 : '.cover'
        cover2 :    //放置备用封面的标签       例 : '.cover2'   (正在考虑这个到底有没有用)
        musicList : //装载歌曲列表的父元素     例 : '.musiclist'
    }
```

+ 在之后 , 是已有的一些方法


```js

/*切换歌曲按钮 (上一首 下一首 ) */
/*
    参数1 : 切换歌曲的按钮 ( .UpMusic or .DownMusic )
     + 给上一首标签按钮添加一个class名  'UpMusic'  在调用这个方法就可以实现上一首功能
     + 给下一首标签按钮添加一个class名  'DownMusic'  在调用这个方法就可以实现下一首功能
*/
CutMusic('.UpMusic')
CutMusic('.DownMusic')


/*暂停与开始*/
// 参数1.传入开始 或 暂停的那个按钮
// 参数2.切换按钮图片 或者 字体图标...
//示例如下
Pause('.play','playIco')

/*播放模式(顺序播放 随机播放 单曲循环)*/
/*
    参数1 : 调节播放模式的按钮
    参数2 : 顺序播放图标 的类名
    参数3 : 随机播放图标 的类名   (随机播放有bug)
    参数4 : 单曲循环图标 的类名 
*/
Pattern('.pattern', 'order', 'random', 'circulation')

/*将音乐列表显示在页面中*/
/*
参数1.打开音乐列表的那个按钮
参数2.点击音乐列表中的单个歌曲更换当前歌曲
//示例如下
*/
listToggle('.openMusicList','.single')
/*播放时长播放进度*/
/*
 参数1.显示在页面上的播放计时
 参数2.进度条总长度
 参数3.进度条当前长度
 //示例如下
*/
ControlTime('.txtTime', '.allLength', '.planWidth')

/*音量调节相关*/
/*
 参数1.音量初始值  0--1   0 到 1
 参数2.音量控制按钮
 参数3.音量控制长度条
 参数4.静音按钮(小喇叭)
 参数5.小喇叭图标有音量时显示的图标  
 参数6.小喇叭图标无音量时显示的图标  
*/

Volume(0.5,'.volume','.plan','.mute','.muteIco','.voicedIco')
```
