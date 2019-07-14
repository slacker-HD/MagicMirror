'use strict';

import {
    execFile,
} from 'child_process';
import fs from 'fs';

import {
    sscanf,
} from 'scanf';

export default class PantengInfo {
    /* eslint-disable class-methods-use-this */
    GetPantengInfo() {
        let pm25 = -1;
        let hcho = -1;
        let exef;
        try {
            if (fs.existsSync('./assets/panteng')) {
                exef = './assets/panteng';
            } else {
                exef = `${__dirname}/dpanteng`;
            }

            const panteng = execFile(exef, [''], (error, stdout) => {
                if (error) {
                    console.log('读取攀腾传感器出错！');
                }
                if (stdout === null || stdout === '') {
                    console.log('读取攀腾传感器数据失败！');
                    return;
                }
                const result = sscanf(stdout, 'HCHO=%d,PM=%d');
                if (result[4] !== -1) {
                    hcho = result[3];
                    pm25 = result[4];
                    console.log(stdout);
                } else {
                    console.log('读取攀腾传感器数据失败！');
                }
            });
            panteng.on('exit', (code) => {
                console.log(`exit:${code}`);
            });
        } catch (error) {
            console.log(`error :${error}`);
        }
        return [pm25, hcho];
    }
}