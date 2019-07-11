'use strict';

import {
    app,
    BrowserWindow,
    net,
    ipcMain,
} from 'electron';

import fs from 'fs';

import WeatherInfo from './WeatherInfo';
import PantengInfo from './PantengInfo';
import PictureShow from './PictureShow';


const os = require('os');
// const Parser = require('rss-parser');

// const parser = new Parser();
let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 480,
    });
    mainWindow.setMenu(null);
    mainWindow.loadURL(`file://${__dirname}/../sections/index.html`);
    mainWindow.webContents.openDevTools();
    // mainWindow.setFullScreen(true);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (commandLine, workingDirectory) => {
        console.log(commandLine + workingDirectory);
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
        }
    });
}

// (async() => {

//     const feed = await parser.parseURL('http://www.hudi.site/atom.xml');
//     console.log(feed.title);

//     feed.items.forEach(item => {
//         console.log(item.title + ':' + item.link);
//     });

// })();

function GetLocalWeatherinfo() {
    let tmp = '';
    try {
        const request = net.request('http://i.tianqi.com/index.php?c=code&id=112');
        request.on('response', (response) => {
            response.on('data', (chunk) => {
                tmp += chunk;
            });
            response.on('end', () => {
                console.log(WeatherInfo.GetLocalweatherInfo(tmp));
                mainWindow.webContents.send('askweatherinfo_r', WeatherInfo.GetLocalweatherInfo(tmp));
            });
        });
        request.end();
    } catch (error) {
        console.log(error);
    }
}

ipcMain.on('askweatherinfo', () => {
    GetLocalWeatherinfo();
});

function GetPantengValue() {
    try {
        mainWindow.webContents.send('askdeviceinfo_r', PantengInfo.GetPantengInfo());
    } catch (error) {
        console.log(error);
    }
}

ipcMain.on('askdeviceinfo', () => {
    if (os.platform() === 'linux') {
        GetPantengValue();
    }
});

ipcMain.on('getpic', () => {
    try {
        const pic = new PictureShow();
        fs.readFile(pic.GetRandomPic(), (err, data) => {
            mainWindow.webContents.send('getpic_r', {
                data,
            });
        });
    } catch (error) {
        console.log(error);
    }
});

// function action() {
//     if (os.platform() === 'linux') {
//         try {
//             GetLocalWeatherinfo();
//             // hardWaredataHandle.GetO2Value();
//             // hardWaredataHandle.GetPantengValue();
//         } catch (error) {
//             console.log(error);
//         }
//         try {
//             console.log('');
//             // netdataHandle.UpLoadData();
//         } catch (err) {
//             console.log(err);
//         }
//         mainWindow.webContents.send('action', [global.data.O2Value.value(),
//             global.data.PMValue.value(),
//             global.data.HCHOValue.value(),
//             global.data.HumdityValue.value(),
//             global.data.TemperatureValue.value(),
//             global.data.CO2Value.value(),
//         ]);
//     }
// }