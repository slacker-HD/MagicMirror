'use strict';


import {
    execFile,
} from 'child_process';
import fs from 'fs';

const HCSR501PIN = 12;

export default class HCSR501 {
    constructor() {
        this.istriggled = false;
        setInterval(() => {
            let exef;
            try {
                if (fs.existsSync('./assets/pinRead')) {
                    exef = './assets/panteng';
                } else {
                    exef = `${__dirname}/../pinRead`;
                }
                const hcs = execFile(exef, [HCSR501PIN], (error, stdout) => {
                    if (error) {
                        console.log('读取红外传感器出错！');
                    } else if (stdout === '1') {
                        if (this.istriggled === false) {
                            console.log(stdout);
                            this.istriggled = true;
                        }
                    } else {
                        this.istriggled = false;
                    }
                });
                hcs.on('exit', (code) => {
                    console.log(`exit:${code}`);
                });
            } catch (error) {
                console.log(`error :${error}`);
            }
        }, 100);
    }
}