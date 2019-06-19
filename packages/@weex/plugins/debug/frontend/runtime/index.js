var worker;
var instanceMaps = {};
var RuntimeSocket
var BrowserChannelId
var cacheWeexEnv;
var cacheJsbundleImportMessage;
var cacheRegisterLoop = [];
var cacheSyncList = [];
var activeWorkerId;
var cacheLogLevel;
var EntrySocket = new WebsocketClient('ws://' + location.host + '/page/entry');

EntrySocket.on('WxDebug.startDebugger', function(message) {
    if (!RuntimeSocket) {
        location.href = `http://${location.host}/runtime/runtime.html?channelId=${message.params}`
    } else if (RuntimeSocket && BrowserChannelId !== message.params) {
        location.href = `http://${location.host}/runtime/runtime.html?channelId=${message.params}`
    }
})

BrowserChannelId = new URLSearchParams(location.search).get('channelId');

if (BrowserChannelId) {
    connect(BrowserChannelId)
}

function connect(channelId) {
    RuntimeSocket = new WebsocketClient('ws://' + window.location.host + '/debugProxy/runtime/' + channelId);

    RuntimeSocket.on('*', function(message) {
        if (!message) return;
        var domain = message.method.split('.')[0];
        if (domain === 'WxDebug' && worker) {
            worker.postMessage(message);
        }
    });

    RuntimeSocket.on('WxDebug.deviceDisconnect', function() {
        location.href = `http://${location.host}/runtime/runtime.html`
    })

    RuntimeSocket.on('WxDebug.setLogLevel', function(message) {
        cacheLogLevel = message.params.logLevel
        if (worker) {
            worker.postMessage(message);
        }
    })

    RuntimeSocket.on('WxDebug.refresh', function() {
        location.reload();
    });

    RuntimeSocket.on('WxDebug.callJS', function(message) {
        var instanceId = message.params.args[0];
        if (message.params.method === 'createInstanceContext') {
            message.channelId = BrowserChannelId;
            message.method = 'WxDebug.initSandboxWorker';
        } else if (message.params.method === 'createInstance') {
            message.channelId = BrowserChannelId;
            message.method = 'WxDebug.initWorker';
            message.params.env = cacheWeexEnv;
        }
        worker && worker.postMessage(message);
    });

    RuntimeSocket.on('WxDebug.initJSRuntime', function(message) {
        destroyJSRuntime();
        var logLevel = localStorage.getItem('logLevel');
        if (logLevel) {
            message.params.env.WXEnvironment.logLevel = logLevel;
        }
        message.channelId = BrowserChannelId;
        initJSRuntime(message);
    });
}

function destroyJSRuntime() {
    if (worker) {
        worker.terminate();
        worker.onmessage = null;
        worker = null;
    }
}

function firstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function initJSRuntime(message) {
    worker = new Worker('Runtime.' + firstLetter(message.params.env.WXEnvironment.platform) + '.js', {
        name: 'uni-app'
    });
    worker.onmessage = function(message) {
        message = message.data;
        RuntimeSocket.send(message);
    };
    worker.postMessage(message);
}
