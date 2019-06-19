const {
    convertLocation,
    json2buffer,
    utf8ByteToUnicodeStr
} = require('../lib/util')

const RadarWebSocket = require('../lib/RadarSocket')
const genRequestId = require('../../util/genRequestId');

const {
    SOCKET,
    WIDE_SEARCH
} = require('../lib/config')

const sockets = []

function initSockets(param, resolve) {
    // MAX_SOCKETS: this.$parent.mode === 'normal' ? 1 : WIDE_SEARCH.MAX_SOCKETS,

    //let max = this.mode === 'normal' ? 1 : this.thread;
    let max = 10;
    let maxTimeout = 3000;
    for (let index = 0; index < max; index++) {
        let socket = new RadarWebSocket({
            url: SOCKET.URL,
            maxReconnectTime: SOCKET.MAX_RECONNECT_TIME,
            reconnectTimeout: SOCKET.RECONNECT_TIMEOUT,
            index: index,
            maxTimeout: maxTimeout,
            onopen: ()=>{
                sendMessage(
                    initSocketMessage('1001', {
                        longitude: param.longitude,
                        latitude: param.latitude
                    }), socket
                )
            },
            onmessage: (event)=>{
                console.log('message:', event.data)
                onSocketMessage(event, resolve, socket)
            },
            onclose: ()=>{}
        });
        sockets.push(socket);
    }
}

function sendMessage(message, socket) {
    // console.log('sendMessage', message, socket);
    let _socket = socket || sockets[0];
    if (_socket) {
        _socket.send(json2buffer(message));
    }
}

function handleMessage(data, socket) {
    console.log(data)
}

// var FileReader = require('filereader')
// var fs = require('fs')

function onSocketMessage(event, resolve, socket) {
    let blob = event.data;

    if (typeof blob !== 'string') {
        const msg = JSON.parse(Buffer.from(blob, 'UTF-8').slice(4))
        resolve(msg)
        console.log('msg', msg)
        sockets = []
        // const path = '/Users/lumotian/Desktop'
        // fs.appendFileSync(`${path}/ws${socket.index}.json`, msg)
    }
}

function initSocketMessage(type, options) {
    let message = null;
    switch (type) {
        case '1001': // 查询妖灵
            message = {
                request_type: '1001',
                longitude: options.longitude,
                latitude: options.latitude,
                requestid: genRequestId('1001'),
                platform: 0
            };
            break;
        case '1002': // 查询擂台
            message = {
                request_type: '1002',
                longitude: options.longitude,
                latitude: options.latitude,
                requestid: genRequestId('1002'),
                platform: 0
            };
            break;
        case '10041': // 查询最新妖灵配置文件
            message = {
                request_type: '1004',
                cfg_type: 1,
                requestid: genRequestId('10041'),
                platform: 0
            };
            break;
        case '10040': // 暂未使用
            message = {
                request_type: '1004',
                cfg_type: 0,
                requestid: genRequestId('10040'),
                platform: 0
            };
            break;
        default:
            break;
    }

    if (message && options) {
        message = Object.assign({}, message, options);
    }

    // 坐标处理
    // longitude -> longtitude
    if (message.latitude && message.longitude) {
        message.latitude = convertLocation(message.latitude);
        message.longtitude = convertLocation(message.longitude);
        delete message.longitude;
    }

    return message;
}

module.exports = {initSockets}