'use strict';

import {
    homedir,
} from 'os';

import fs from 'fs';

const PicDir = `${homedir()}/Pictures/`;

export default class PictureShow {
    constructor() {
        this.imageList = [];
    }

    getlists() {
        this.imageList = [];
        const pa = fs.readdirSync(PicDir);
        pa.forEach((ele) => {
            const info = fs.statSync(PicDir + ele);
            if (!info.isDirectory()) {
                const filePath = PicDir + ele;
                const fileNameReg = /.jpg/g;
                const shouldFormat = fileNameReg.test(filePath);
                if (shouldFormat) {
                    this.imageList.push(filePath);
                }
            }
        });
    }

    GetRandomPic() {
        this.getlists();
        if (this.imageList.length > 0) {
            return this.imageList[Math.floor((Math.random() * this.imageList.length) + 1)];
        }
        return null;
    }
}