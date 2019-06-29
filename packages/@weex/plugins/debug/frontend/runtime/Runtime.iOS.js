var $$frameworkFlag = {}
var __channelId__
var lastConfig
var lastData
// event constructor
function __EventEmitter__() {
    this._handlers = {};
}

__EventEmitter__.prototype = {
    constructor: __EventEmitter__,
    off: function(method, handler) {
        if (handler) {
            for (var i = 0; i < this._handlers[method].length; i++) {
                if (this._handlers[method][i] === handler) {
                    this._handlers[method].splice(i, 1);
                    i--;
                }
            }
        } else {
            this._handlers[method] = [];
        }
    },
    once: function(method, handler) {
        var self = this;
        var fired = false;

        function g() {
            self.off(method, g);
            if (!fired) {
                fired = true;
                handler.apply(self, Array.prototype.slice.call(arguments));
            }
        }
        this.on(method, g);
    },
    on: function(method, handler) {
        if (this._handlers[method]) {
            this._handlers[method].push(handler);
        } else {
            this._handlers[method] = [handler];
        }
    },
    _emit: function(method, args, context) {
        var handlers = this._handlers[method];
        if (handlers && handlers.length > 0) {
            handlers.forEach(function(handler) {
                handler.apply(context, args)
            });
            return true;
        } else {
            return false;
        }
    },
    emit: function(method) {
        var context = {};
        var args = Array.prototype.slice.call(arguments, 1);
        if (!this._emit(method, args, context)) {
            this._emit('*', args, context)
        }
        this._emit('$finally', args, context);
        return context;
    }
};

// Redefine navigator
Object.defineProperty(navigator, 'appCodeName', {
    get: function() {
        return 'WeexPlayground';
    }
});

Object.defineProperty(navigator, 'appName', {
    get: function() {
        return 'WeexDemo';
    }
});

Object.defineProperty(navigator, 'appVersion', {
    get: function() {
        return '4.0';
    }
});

Object.defineProperty(navigator, 'product', {
    get: function() {
        return 'WeexPlayground';
    }
});

Object.defineProperty(navigator, 'platform', {
    get: function() {
        return 'iOS';
    }
});

Object.defineProperty(navigator, 'userAgent', {
    get: function() {
        return 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25';
    }
});

// Redefine console
var __origConsole__ = this.console;
var __rewriteLog__ = function() {
    var LEVELS = ['error', 'warn', 'info', 'log', 'debug'];
    var backupConsole = {
        error: __origConsole__.error,
        warn: __origConsole__.warn,
        info: __origConsole__.info,
        log: __origConsole__.log,
        debug: __origConsole__.debug
    };

    function resetConsole() {
        self.console.error = backupConsole.error;
        self.console.warn = backupConsole.warn;
        self.console.info = backupConsole.info;
        self.console.log = backupConsole.log;
        self.console.debug = backupConsole.debug;
        self.console.time = __origConsole__.time;
        self.console.timeEnd = __origConsole__.timeEnd;
    }

    function noop() {}
    return function(logLevel) {
        resetConsole();
        LEVELS.slice(LEVELS.indexOf(logLevel) + 1).forEach(function(level) {
            self.console[level] = noop;
        })
    }
}();

// Redefine timer
var __cachedSetTimeout__ = this.setTimeout;
Object.defineProperty(this, 'setTimeout', {
    get: function() {
        return __cachedSetTimeout__;
    },
    set: function() {}
});
var __cachedSetInterval__ = this.setInterval;
Object.defineProperty(this, 'setInterval', {
    get: function() {
        return __cachedSetInterval__;
    },
    set: function() {}
});
var __cachedClearTimeout__ = this.clearTimeout;
Object.defineProperty(this, 'clearTimeout', {
    get: function() {
        return __cachedClearTimeout__;
    },
    set: function() {}
});
var __cachedClearInterval__ = this.clearInterval;
Object.defineProperty(this, 'clearInterval', {
    get: function() {
        return __cachedClearInterval__;
    },
    set: function() {}
});

// Redefine onmessage
var __eventEmitter__ = new __EventEmitter__();
var __postmessage__ = self.postMessage
self.addEventListener('message', function(message) {
    __eventEmitter__.emit(message.data && message.data.method, message.data);
}, false);



// Redefine the JSFramework API
var __syncRequest__ = function(data, channelId) {
    var request = new XMLHttpRequest();
    request.open("POST", `/syncCallNative/${channelId}`, false); // "false" makes the request synchronous
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(data));
    if (request.status === 200) {
        return JSON.parse(request.responseText);
    } else {
        return {
            error: request.responseText
        };
    }
};

self.callNativeModule = function() {
    var message = {
        method: 'WxDebug.syncCall',
        params: {
            method: 'callNativeModule',
            args: __protectedAragument__(arguments)
        }
    }
    var result = __syncRequest__(message, __channelId__);
    if (result && result.error) {
        self.console.error(result.error);
        // throw new Error(result.error);
    } else {
        return result && result.ret
    };
}

self.callNativeComponent = function() {
    var args = Array.prototype.slice.call(arguments);
    for (var i = 0; i < args.length; i++) {
        if (!args[i]) {
            args[i] = ''
        }
    }
    var message = {
        method: 'WxDebug.syncCall',
        params: {
            method: 'callNativeComponent',
            args: args
        }
    }
    var result = __syncRequest__(message, __channelId__);
    if (result.error) {
        self.console.error(result.error);
        // throw new Error(result.error);
    } else {
        return result.ret;
    };
};

self.callNative = function(instance, tasks, callback) {
    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        if (task.method == 'addElement') {
            for (var key in task.args[1].style) {
                if (Number.isNaN(task.args[1].style[key])) {
                    self.console.error('invalid value [NaN] for style [' + key + ']', task);
                }
            }
        }
    }
    var payload = {
        method: 'WxDebug.callNative',
        params: {
            instance: instance,
            tasks: tasks,
            callback: callback
        }
    };
    __postData__(payload);
};

self.callAddElement = function(instance, ref, dom, index, callback) {
    var payload = {
        method: 'WxDebug.callAddElement',
        params: {
            instance: instance,
            ref: ref,
            dom: dom,
            index: index,
            callback: callback
        }
    };
    __postData__(payload);
};

self.callUpdateStyle = function(instance, ref, data) {
  self.callNative(instance,[{ module: 'dom', method: 'updateStyle', args: [ref,data] }],-1)
}


self.__updateComponentData = function(instance, componentId, data) {
    var payload = {
        method: 'WxDebug.callUpdateComponentData',
        params: {
            instance: instance,
            componentId: componentId + '',
            data: data
        }
    };
    __postData__(payload);
};

self.nativeLog = function(args) {
    // self.console.log(args)
};

importScripts('/source/js-framework.js');

var instanceMaps = {}
var __instanceId__
// The argument maybe an undefine value
var __protectedAragument__ = function(arg) {
    var args = Array.prototype.slice.call(arg)
    for (var i = 0; i < args.length; i++) {
        if (!args[i]) {
            args[i] = ''
        }
    }
    return args
}

var __postData__ = function(payload) {
    if (payload.method === 'WxDebug.callCreateBody' && !payload.params.domStr) {
        return
    }
    try {
        __postmessage__(payload)
    } catch (e) {
        payload = JSON.parse(JSON.stringify(payload))
        __postmessage__(payload)
    }
}

self.__WEEX_DEVTOOL__ = true

//fixed by xxxxxx
__eventEmitter__.on('WxDebug.initJSRuntime', function(message) {
    for (var key in message.params.env) {
        if (message.params.env.hasOwnProperty(key)) {
            self[key] = message.params.env[key]
        }
    }
    __rewriteLog__(message.params.logLevel)
})

__eventEmitter__.on('WxDebug.callJS', function(data) {
    var method = data.params.method

    if (method === '__WEEX_CALL_JAVASCRIPT__') {
        method = 'callJS'
    }

    if (method === 'importScript') {
        importScripts(data.params.sourceUrl)
        self.createInstance(
            data.params.args[0],
            createWeexBundleEntry(data.params.sourceUrl),
            lastConfig,
            lastData
        )
    } else if (method === 'destroyInstance') {
        // close worker
        self.destroyInstance(data.params.args[0])
        delete instanceMaps[data.params.args[0]]
    } else if (
        (method === '__WEEX_CALL_JAVASCRIPT__' || method === 'callJS') &&
        data.params.args[1] &&
        data.params.args[1][0] &&
        data.params.args[1][0].method === 'componentHook'
    ) {
        var payload = self[method].apply(null, data.params.args)
        __postData__({
            method: 'syncReturn',
            params: {
                ret: payload,
                id: data.params.syncId,
            },
        })
    } else if (
        (method === '__WEEX_CALL_JAVASCRIPT__' || method === 'callJS') &&
        data.params.args[1] &&
        data.params.args[1][0] &&
        data.params.args[1][0].method === 'callback'
    ) {
        var payload = self[method].apply(null, data.params.args)
    } else if (self[method]) {
        self[method].apply(null, data.params.args)
    } else {
        self.console.warn(
            'call [' + method + '] error: jsframework has no such api',
        )
    }
})

__eventEmitter__.on('WxDebug.setLogLevel', function(message) {
    __rewriteLog__(message.params.logLevel)
})

__eventEmitter__.on('Console.messageAdded', function(message) {
    self.console.error('[Native Error]', message.params.message.text)
})

__eventEmitter__.on('WxDebug.importScript', function(message) {
    if (message.params.sourceUrl) {
        importScripts(message.params.sourceUrl)
    } else {
        new Function('', message.params.source)()
    }
})

var injectedGlobals = [
    // ES
    'Promise',
    // W3C
    'window',
    'weex',
    'service',
    'Rax',
    'services',
    'global',
    'screen',
    'document',
    'navigator',
    'location',
    'fetch',
    'Headers',
    'Response',
    'Request',
    'URL',
    'URLSearchParams',
    'setTimeout',
    'clearTimeout',
    'setInterval',
    'clearInterval',
    'requestAnimationFrame',
    'cancelAnimationFrame',
    'alert',
    // ModuleJS
    'define',
    'require',
    // Weex
    'bootstrap',
    'register',
    'render',
    '__d',
    '__r',
    '__DEV__',
    '__weex_define__',
    '__weex_require__',
    '__weex_viewmodel__',
    '__weex_document__',
    '__weex_bootstrap__',
    '__weex_options__',
    '__weex_data__',
    '__weex_downgrade__',
    '__weex_require_module__',
    'Vue',
]
var createWeexBundleEntry = function(sourceUrl) {
    var code = ''
    self.$$frameworkFlag || (self.$$frameworkFlag = {});
    if (self.$$frameworkFlag[sourceUrl] || self.$$frameworkFlag['@']) {
        code +=
            `// { "framework": "${self.$$frameworkFlag[sourceUrl] ||
        self.$$frameworkFlag['@']}" }\n`
    }
    code += '__weex_bundle_entry__('
    injectedGlobals.forEach(function(g, i) {
        code += 'typeof ' + g + '==="undefined"?undefined:' + g
        if (i < injectedGlobals.length - 1) {
            code += ','
        }
    })
    // Avoiding the structure of comments in the last line causes `}` to be annotated
    code += '\n);'
    return code
}
__eventEmitter__.on('WxDebug.initSandboxWorker', function(message) {

    __channelId__ = message.channelId

    instanceMaps[message.params.args[0]] = true

    lastConfig = message.params.args[1]
    lastData = message.params.args[2]
    __rewriteLog__(lastConfig.env.logLevel)
})
