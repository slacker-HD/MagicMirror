'use strict';

import {
    ipcRenderer as ipc,
} from 'electron';
// const shell = require('electron').shell;
const showDay = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

let askdeviceinfo = 30;
let askweatherinfo = 1800;

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
    const now = new Date();
    document.getElementById('mtime').innerHTML = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    document.getElementById('mdate').innerHTML = `${now.getFullYear()}年${now.getMonth()}月${now.getDate()}日  ${showDay[now.getDay()]}`;
    askdeviceinfo += 1;
    askweatherinfo += 1;
    if (askweatherinfo > 1800) {
        askweatherinfo = 0;
        ipc.send('askweatherinfo', null);
    }
    if (askdeviceinfo > 30) {
        askdeviceinfo = 0;
        ipc.send('askdeviceinfo', null);
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