'use strict';

import {
    ipcRenderer as ipc,
} from 'electron';
// const shell = require('electron').shell;
const showDay = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

let askdeviceinfo = 30;
let askweatherinfo = 1800;
let showimginfo = 8;
// 屏蔽drag&drop，防止文件拖到主界面出错
function blockdrag() {
    const holder = document.getElementById('drag-file');
    holder.ondragover = () => false;
    holder.ondragleave = () => false;
    holder.ondragend = () => false;
    holder.ondrop = (e) => {
        e.preventDefault();
        // for (let f of e.dataTransfer.files) {
        //     alert(f.path)
        // }
        return false;
    };
}

blockdrag();

ipc.on('action', (Content) => {
    try {
        console.log(Content);
    } catch (error) {
        console.log('读取传感器出错！');
    }
});

setInterval(() => {
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    if (hours < 10) {
        hours = `0${hours}`;
    }

    document.getElementById('mtime').innerHTML = `${hours}:${minutes}:${seconds}`;
    document.getElementById('mdate').innerHTML = `${date.getFullYear()}年${date.getMonth()}月${date.getDate()}日  ${showDay[date.getDay()]}`;
    askdeviceinfo += 1;
    askweatherinfo += 1;
    showimginfo += 1;
    if (askweatherinfo > 1800) {
        askweatherinfo = 0;
        ipc.send('askweatherinfo', null);
    }
    if (askdeviceinfo > 30) {
        askdeviceinfo = 0;
        ipc.send('askdeviceinfo', null);
    }
    if (showimginfo > 8) {
        showimginfo = 0;
        ipc.send('getpic', null);
    }
}, 1000);

ipc.on('askweatherinfo_r', (Event, Content) => {
    if (Content !== null) {
        document.getElementById('location').innerHTML = Content[0];
        document.getElementById('temperature').innerHTML = `${Content[1]}℃`;
        document.getElementById('weathertext').innerHTML = Content[2];
        document.getElementById('weatherimg').src = Content[3];
    }
});

ipc.on('askdeviceinfo_r', (Event, Content) => {
    if (Content !== null) {
        document.getElementById('pm25').innerHTML = Content[0];
        document.getElementById('hcho').innerHTML = Content[1];
    }
});

ipc.on('getpic_r', (e, {
    data,
}) => {
    const file = new File([data], 'getpic_r.jpg', {
        type: 'image/jpg',
    });
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        const newUrl = this.result;
        document.getElementById('showimg').src = newUrl;
    };
});


// var reader = new FileReader();
// reader.onload = (function (file) {
//     return function (e) {
//         var span = document.createElement('span');
//         span.innerHTML = ['<br><div><img id="image_', index, '" class="thumb" src="', e.target.result, '" title="', escape(file.name), '"/><br> <input id="text_', index, '" type="text" onkeydown="handleEvent(', index, ')" /><br> <input id="button_', index, '" type="button" value="upload" onclick="upload(', index, ')"/> </div>'].join('');
//         document.getElementById('results').insertBefore(span, null);
//     };
// })(img);
// reader.readAsDataURL(img);