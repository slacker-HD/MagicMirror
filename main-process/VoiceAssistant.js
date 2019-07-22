'use strict';

// import path from 'path';
// import fs from 'fs';
// import querystring from 'querystring';
// import http from 'http';
// import {
//     tmpdir,
// } from 'os';

// import {
//     execFile,
// } from 'child_process';

const http = require('https');
const path = require('path');
const querystring = require('querystring');

const fs = require('fs');
const os = require('os');

const tmpdir = os.tmpdir();
const {
    execFile
} = require('child_process');

const HotwordDetector = require('node-hotworddetector');
const record = require('node-record-lpcm16');
const AipSpeechClient = require('baidu-aip-sdk').speech;

let BAIDU_APP_ID;
let BAIDU_API_KEY;
let BAIDU_SECRET_KEY;
let TULING_APIKEY;
const RECORDTIME = 3000;

let isrecording = false;

export default class VoiceAssistant {
    // eslint-disable-next-line class-methods-use-this
    initconfig() {
        const configfile = JSON.parse(fs.readFileSync(`${__dirname}/../assets/mykey.json`));
        // eslint-disable-next-line prefer-destructuring
        BAIDU_APP_ID = configfile.BAIDU_APP_ID;
        // eslint-disable-next-line prefer-destructuring
        BAIDU_API_KEY = configfile.BAIDU_API_KEY;
        // eslint-disable-next-line prefer-destructuring
        BAIDU_SECRET_KEY = configfile.BAIDU_SECRET_KEY;
        // eslint-disable-next-line prefer-destructuring
        TULING_APIKEY = configfile.TULING_APIKEY;
    }

    constructor() {
        this.initconfig();
        this.hotwordConfiguration = {
            detector: {
                resource: `${path.resolve(__dirname, '..')}/node_modules/snowboy/resources/common.res`,
            },
            models: [{
                file: `${path.resolve(__dirname, '..')}/assets/voiceres/hello.pmdl`,
                hotwords: '你好',
                sensitivity: '0.6',
            }],
            recorder: {},
        };
        this.hotwordDetector = new HotwordDetector(this.hotwordConfiguration.detector, this.hotwordConfiguration.models, this.hotwordConfiguration.recorder);
        this.hotwordDetector.on('hotword', (index, hotword) => {
            if (isrecording === false) {
                if (hotword === '你好') {
                    const play = execFile('play', [`${path.resolve(__dirname, '..')}/assets/voiceres/ding.wav`], (error, stdout) => {
                        if (error) {
                            throw error;
                        }
                        console.log(stdout);
                    });
                    play.on('exit', (code) => {
                        isrecording = true;
                        console.log(code);
                        console.log(hotword);
                        try {
                            this.recordsound();
                            setTimeout(() => {
                                this.speaking();
                            }, RECORDTIME + 2000);
                        } catch (error) {
                            console.log(error);
                        }
                    });
                }
            } else {
                console.log(hotword);
            }
        });
        this.hotwordDetector.on('error', (error) => {
            console.error(`hotwordDetector:${error}`);
        });
    }

    // eslint-disable-next-line class-methods-use-this
    recordsound() {
        const file = fs.createWriteStream(`${tmpdir}/output.raw`, {
            encoding: 'binary',
        });
        record.start({
                sampleRate: 16000,
                threshold: 0.5,
                thresholdStart: null,
                thresholdEnd: null,
                silence: '1.0',
                verbose: true,
                recordProgram: 'rec',
                device: null,
            })
            .pipe(file);
        setTimeout(() => {
            record.stop();
        }, RECORDTIME);
    }

    // eslint-disable-next-line class-methods-use-this
    speaking() {
        const voice = fs.readFileSync(`${tmpdir}/output.raw`);
        const voiceBase64 = Buffer.from(voice);
        // 识别本地语音文件
        const baiduspeechclient = new AipSpeechClient(BAIDU_APP_ID, BAIDU_API_KEY, BAIDU_SECRET_KEY);
        console.log('开始识别:');
        baiduspeechclient.recognize(voiceBase64, 'pcm', 16000).then((result) => {
            console.log(`语音识别本地音频文件结果:${JSON.stringify(result)}`);
            if (result.err_no === 0) {
                const postdata = querystring.stringify({
                    key: TULING_APIKEY,
                    info: result.result[0],
                    userid: '',
                });
                const options = {
                    host: 'www.tuling123.com',
                    port: 80,
                    path: '/openapi/api',
                    method: 'POST',
                    rejectUnauthorized: false,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                };
                const req = http.request(options, (res) => {
                    console.log(`STATUS:${res.statusCode}`);
                    console.log(`HEADERS:${JSON.stringify(res.headers)}`);
                    res.setEncoding('utf8');
                    res.on('data', (chunk) => {
                        console.log(`BODY:${chunk}`);
                        const obj = JSON.parse(chunk);
                        baiduspeechclient.text2audio(obj.text).then((baiduresult) => {
                            if (baiduresult.data) {
                                fs.writeFileSync(`${tmpdir}/tmp.mp3`, baiduresult.data);
                                const play = execFile('play', [`${tmpdir}/tmp.mp3`], (error, stdout) => {
                                    if (error) {
                                        throw error;
                                    }
                                    console.log(stdout);
                                });
                                play.on('exit', (code) => {
                                    isrecording = false;
                                    console.log(`play结束于:${code}`);
                                });
                            }
                        }, (err) => {
                            console.log(`百度没有给出语音,错误代码为:${err}`);
                            isrecording = false;
                        });
                    });
                });
                req.write(postdata);
                req.end();
            } else {
                console.log('语音识别出错');
                isrecording = false;
            }
        }, (err) => {
            console.log(`没识别,错误代码为:${err}`);
            isrecording = false;
        });
    }

    Start() {
        this.hotwordDetector.start();
    }

    Stop() {
        this.hotwordDetector.stop();
    }
}