'use strict';

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