'use strict';

const ipc = require('electron').ipcRenderer;
// const shell = require('electron').shell;


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