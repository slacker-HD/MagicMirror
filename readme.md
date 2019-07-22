# 树莓派魔镜

准备实现功能如下：

## 1. 实时本地天气 OK

## 2. 时间显示 OK

## 3. rss新闻源显示 OK

## 4. 股票信息 不做了

## 5. 实时室内空气质量显示 主程序OK，待测试c程序

## 6. 电子相册，图片位于 /home/pi/Pictures下 OK

## 7. 语音助手OK，语音助手实在是不智能，用的图灵机器人

assets下面有个mykey.json,格式如下，加入自己的key
 {    "BAIDU_APP_ID": "",
    "BAIDU_API_KEY": "",
    "BAIDU_SECRET_KEY": "",
    "TULING_APIKEY": ""}

## 配备蓝牙（与串口冲突需解决）和手机app连接  不做了，与串口冲突，不想加硬件了

## snowboy的依赖

apt install libblas-dev libgslcblas0 swig3.0 sox libatlas-base-dev libasound2-dev
