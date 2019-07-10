'use strict';

import {
    execFile,
} from 'child_process';
import {
    fs,
} from 'fs';

import {
    sscanf,
} from 'scanf';

export default class PantengInfo {
    static GetPantengInfo() {
        let pm25;
        let hcho;
        let exef;
        try {
            if (fs.existsSync('./assets/panteng')) {
                exef = './assets/panteng';
            } else {
                exef = app.getAppPath().slice(0, app.getAppPath().length - 8) + '/../panteng';
            }

            const panteng = execFile(exef, [''], (error, stdout) => {
                console.log('次数：' + a);
                a++;
                if (error) {
                    RstPanteng();
                    console.log('读取攀腾传感器出错！');
                }

                if (stdout == null || stdout == '') {
                    console.log('读取攀腾传感器数据失败！');
                    RstPanteng();
                    return;
                }
                var result = sscanf(stdout, 'temperature=%f,humdity=%f,CO2=%d,HCHO=%d,PM=%d');
                if (result[4] != -1) {
                    global.data.TemperatureValue.addele(result[0]);
                    global.data.HumdityValue.addele(result[1]);
                    global.data.CO2Value.addele(result[2]);
                    global.data.HCHOValue.addele(result[3]);
                    global.data.PMValue.addele(result[4]);
                    console.log(stdout);
                } else {
                    console.log('读取攀腾传感器数据失败！');
                }
            });
            panteng.on('exit', (code) => {
                console.log('exit:' + code)
            });
        } catch (error) {
            return null;
        }
        return [pm25, hcho];
    }
}