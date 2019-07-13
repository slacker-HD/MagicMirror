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
import VoiceAssistant from './VoiceAssistant';

const voiceAssistant = new VoiceAssistant();
voiceAssistant.Start();

const os = require('os');
const Parser = require('rss-parser');

const parser = new Parser();
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
            if (!err) {
                mainWindow.webContents.send('getpic_r', {
                    data,
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
});

ipcMain.on('getrss', () => {
    try {
        parser.parseURL('http://www.people.com.cn/rss/politics.xml', (err, data) => {
            if (!err) {
                mainWindow.webContents.send('getrss_r', {
                    data,
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
});