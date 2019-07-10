'use strict';

import {
    app,
    BrowserWindow,
    net,
} from 'electron';

import weatherInfo from './weatherInfo';

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
                mainWindow.webContents.send('getnews', weatherInfo.GetLocalWeatherinfo(tmp));
            });
        });
        request.end();
    } catch (error) {
        console.log(error);
    }
}

function action() {
    if (os.platform() === 'linux') {
        try {
            GetLocalWeatherinfo();
            // hardWaredataHandle.GetO2Value();
            // hardWaredataHandle.GetPantengValue();
        } catch (error) {
            console.log(error);
        }
        try {
            console.log('');
            // netdataHandle.UpLoadData();
        } catch (err) {
            console.log(err);
        }
        mainWindow.webContents.send('action', [global.data.O2Value.value(),
            global.data.PMValue.value(),
            global.data.HCHOValue.value(),
            global.data.HumdityValue.value(),
            global.data.TemperatureValue.value(),
            global.data.CO2Value.value(),
        ]);
    }
}

setInterval(() => {
    console.log('time inteval');
    action();
    // time++;
    // if (time == 60) {
    //     time = 0;
    //     getweather();
    //     getnews();
    // }
    // hardWaredataHandle.SetPMSwitch();
    // hardWaredataHandle.SetHumditySwitch();
    // hardWaredataHandle.SetO2Switch();
}, 1000);