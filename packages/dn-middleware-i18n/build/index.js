/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var i18n = __webpack_require__(2);

i18n.init({
  language: 'en-US'
});

console.log(i18n('hello'));
console.log(i18n('hello', { name: 'i18n' }));
console.log(i18n('test1', null, 'test1-default1'));
console.log(i18n('test2'));
console.log(i18n('test1', 'test1-default2'));

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var locales = __webpack_require__(3);
var utils = __webpack_require__(4);

function i18n() {
  return i18n.get.apply(i18n, arguments);
}

i18n.locale = {};

i18n.get = function (key, params, defaultValue) {
  if (utils.isString(params)) {
    defaultValue = [params, params = defaultValue][0];
  }
  var text = this.locale[key] || defaultValue;
  text = utils.isNull(text) ? key : text;
  utils.each(params, function (name, value) {
    text = text.replace(new RegExp('\{' + name + '\}', 'gm'), value || '');
  });
  return text;
};

i18n.getLocale = function (name) {
  if (!name) return;
  return locales[name] || locales[name.split('-')[0]] || utils.each(locales, function (key) {
    if (key.split('-')[0] == name.split('-')[0]) {
      return locales[key];
    }
  });
};

i18n.init = function (opts) {
  opts = opts || {};
  var currentLang = opts.language || '';
  var defaultLang = opts.defaultLanguage || 'zh-CN';
  this.locale = this.getLocale(currentLang) || this.getLocale(defaultLang) || {};
};

i18n.init();

module.exports = i18n;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {"en-US":{"hello":"Hello {name}!!"},"zh-CN":{"hello":"你好，{name}!!"}}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

(function (ntils) {

  /**
   * 空函数
   */
  ntils.noop = function () { };

  /**
   * 验证一个对象是否为NULL
   * @method isNull
   * @param  {Object}  obj 要验证的对象
   * @return {Boolean}     结果
   * @static
   */
  ntils.isNull = function (obj) {
    return obj === null || typeof obj === "undefined";
  };

  /**
   * 除去字符串两端的空格
   * @method trim
   * @param  {String} str 源字符串
   * @return {String}     结果字符串
   * @static
   */
  ntils.trim = function (str) {
    if (this.isNull(str)) return str;
    if (str.trim) {
      return str.trim();
    } else {
      return str.replace(/(^[\\s]*)|([\\s]*$)/g, "");
    }
  };

  /**
   * 替换所有
   * @method replace
   * @param {String} str 源字符串
   * @param {String} str1 要替换的字符串
   * @param {String} str2 替换为的字符串
   * @static
   */
  ntils.replace = function (str, str1, str2) {
    if (this.isNull(str)) return str;
    return str.replace(new RegExp(str1, 'g'), str2);
  };

  /**
   * 从字符串开头匹配
   * @method startWith
   * @param {String} str1 源字符串
   * @param {String} str2 要匹配的字符串
   * @return {Boolean} 匹配结果
   * @static
   */
  ntils.startWith = function (str1, str2) {
    if (this.isNull(str1) || this.isNull(str2)) return false;
    return str1.indexOf(str2) === 0;
  };

  /**
   * 是否包含
   * @method contains
   * @param {String} str1 源字符串
   * @param {String} str2 检查包括字符串
   * @return {Boolean} 结果
   * @static
   */
  ntils.contains = function (str1, str2) {
    var self = this;
    if (this.isNull(str1) || this.isNull(str2)) return false;
    return str1.indexOf(str2) > -1;
  };

  /**
   * 从字符串结束匹配
   * @method endWidth
   * @param {String} str1 源字符串
   * @param {String} str2 匹配字符串
   * @return {Boolean} 匹配结果
   * @static
   */
  ntils.endWith = function (str1, str2) {
    if (this.isNull(str1) || this.isNull(str2)) return false;
    return str1.indexOf(str2) === (str1.length - str2.length);
  };

  /**
   * 是否包含属性
   * @method hasProperty
   * @param  {Object}  obj  对象
   * @param  {String}  name 属性名
   * @return {Boolean}      结果
   * @static
   */
  ntils.has = ntils.hasProperty = function (obj, name) {
    if (this.isNull(obj) || this.isNull(name)) return false;
    return (name in obj) || (obj.hasOwnProperty(name));
  };

  /**
   * 验证一个对象是否为Function
   * @method isFunction
   * @param  {Object}  obj 要验证的对象
   * @return {Boolean}     结果
   * @static
   */
  ntils.isFunction = function (obj) {
    if (this.isNull(obj)) return false;
    return typeof obj === "function";
  };

  /**
   * 验证一个对象是否为String
   * @method isString
   * @param  {Object}  obj 要验证的对象
   * @return {Boolean}     结果
   * @static
   */
  ntils.isString = function (obj) {
    if (this.isNull(obj)) return false;
    return typeof obj === 'string' || obj instanceof String;
  };

  /**
   * 验证一个对象是否为Number
   * @method isNumber
   * @param  {Object}  obj 要验证的对象
   * @return {Boolean}     结果
   * @static
   */
  ntils.isNumber = function (obj) {
    if (this.isNull(obj)) return false;
    return typeof obj === 'number' || obj instanceof Number;
  };

  /**
   * 验证一个对象是否为Boolean
   * @method isBoolean
   * @param  {Object}  obj 要验证的对象
   * @return {Boolean}     结果
   * @static
   */
  ntils.isBoolean = function (obj) {
    if (this.isNull(obj)) return false;
    return typeof obj === 'boolean' || obj instanceof Boolean;
  };

  /**
   * 验证一个对象是否为HTML Element
   * @method isElement
   * @param  {Object}  obj 要验证的对象
   * @return {Boolean}     结果
   * @static
   */
  ntils.isElement = function (obj) {
    if (this.isNull(obj)) return false;
    if (window.Element) {
      return obj instanceof Element;
    } else {
      return (obj.tagName && obj.nodeType && obj.nodeName && obj.attributes && obj.ownerDocument);
    }
  };

  /**
   * 验证一个对象是否为HTML Text Element
   * @method isText
   * @param  {Object}  obj 要验证的对象
   * @return {Boolean}     结果
   * @static
   */
  ntils.isText = function (obj) {
    if (this.isNull(obj)) return false;
    return obj instanceof Text;
  };

  /**
   * 验证一个对象是否为Object
   * @method isObject
   * @param  {Object}  obj 要验证的对象
   * @return {Boolean}     结果
   * @static
   */
  ntils.isObject = function (obj) {
    if (this.isNull(obj)) return false;
    return typeof obj === "object";
  };

  /**
   * 验证一个对象是否为Array或伪Array
   * @method isArray
   * @param  {Object}  obj 要验证的对象
   * @return {Boolean}     结果
   * @static
   */
  ntils.isArray = function (obj) {
    if (this.isNull(obj)) return false;
    var v1 = Object.prototype.toString.call(obj) === '[object Array]';
    var v2 = obj instanceof Array;
    var v3 = !this.isString(obj) && this.isNumber(obj.length) && this.isFunction(obj.splice);
    var v4 = !this.isString(obj) && this.isNumber(obj.length) && obj[0];
    return v1 || v2 || v3 || v4;
  };

  /**
   * 验证是不是一个日期对象
   * @method isDate
   * @param {Object} val   要检查的对象
   * @return {Boolean}           结果
   * @static
   */
  ntils.isDate = function (val) {
    if (this.isNull(val)) return false;
    return val instanceof Date;
  };

  /**
   * 验证是不是一个正则对象
   * @method isDate
   * @param {Object} val   要检查的对象
   * @return {Boolean}           结果
   * @static
   */
  ntils.isRegexp = function (val) {
    return val instanceof RegExp;
  };

  /**
   * 转换为数组
   * @method toArray
   * @param {Array|Object} array 伪数组
   * @return {Array} 转换结果数组
   * @static
   */
  ntils.toArray = function (array) {
    if (this.isNull(array)) return [];
    return Array.prototype.slice.call(array);
  };

  /**
   * 转为日期格式
   * @method toDate
   * @param {Number|String} val 日期字符串或整型数值
   * @return {Date} 日期对象
   * @static
   */
  ntils.toDate = function (val) {
    var self = this;
    if (self.isNumber(val))
      return new Date(val);
    else if (self.isString(val))
      return new Date(self.replace(self.replace(val, '-', '/'), 'T', ' '));
    else if (self.isDate(val))
      return val;
    else
      return null;
  };

  /**
   * 遍历一个对像或数组
   * @method each
   * @param  {Object or Array}   obj  要遍历的数组或对象
   * @param  {Function} fn            处理函数
   * @return {void}                   无返回值
   * @static
   */
  ntils.each = function (list, handler, scope) {
    if (this.isNull(list) || this.isNull(handler)) return;
    if (this.isArray(list)) {
      var listLength = list.length;
      for (var i = 0; i < listLength; i++) {
        var rs = handler.call(scope || list[i], i, list[i]);
        if (!this.isNull(rs)) return rs;
      }
    } else {
      for (var key in list) {
        var rs = handler.call(scope || list[key], key, list[key]);
        if (!this.isNull(rs)) return rs;
      }
    }
  };

  /**
   * 格式化日期
   * @method formatDate
   * @param {Date|String|Number} date 日期
   * @param {String} format 格式化字符串
   * @param {object} dict 反译字典
   * @return {String} 格式化结果
   * @static
   */
  ntils.formatDate = function (date, format, dict) {
    if (this.isNull(format) || this.isNull(date)) return date;
    date = this.toDate(date);
    dict = dict || {};
    var placeholder = {
      "M+": date.getMonth() + 1, //month
      "d+": date.getDate(), //day
      "h+": date.getHours(), //hour
      "m+": date.getMinutes(), //minute
      "s+": date.getSeconds(), //second
      "w+": date.getDay(), //week
      "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
      "S": date.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var key in placeholder) {
      if (new RegExp("(" + key + ")").test(format)) {
        var value = placeholder[key];
        value = dict[value] || value;
        format = format.replace(RegExp.$1, RegExp.$1.length == 1
          ? value : ("00" + value).substr(("" + value).length));
      }
    }
    return format;
  };

  /**
   * 拷贝对象
   * @method copy
   * @param {Object} src 源对象
   * @param {Object} dst 目标对象
   * @static
   */
  ntils.copy = function (src, dst, igonres) {
    dst = dst || (this.isArray(src) ? [] : {});
    this.each(src, function (key) {
      if (igonres && igonres.indexOf(key) > -1) return;
      delete dst[key];
      if (Object.getOwnPropertyDescriptor) {
        try {
          Object.defineProperty(dst, key, Object.getOwnPropertyDescriptor(src, key));
        } catch (ex) {
          dst[key] = src[key];
        }
      } else {
        dst[key] = src[key];
      }
    })
    return dst;
  };

  /**
   * 深度克隆对象
   * @method clone
   * @param {Object} src 源对象
   * @return {Object} 新对象
   * @static
   */
  ntils.clone = function (src, igonres) {
    if (this.isNull(src) ||
      this.isString(src) ||
      this.isNumber(src) ||
      this.isBoolean(src) ||
      this.isDate(src)) {
      return src;
    }
    var objClone = src;
    try {
      objClone = new src.constructor();
    } catch (ex) { }
    this.each(src, function (key, value) {
      if (objClone[key] != value && !this.contains(igonres, key)) {
        if (this.isObject(value)) {
          objClone[key] = this.clone(value, igonres);
        } else {
          objClone[key] = value;
        }
      }
    }, this);
    ['toString', 'valueOf'].forEach(function (key) {
      if (this.contains(igonres, key)) return;
      this.defineFreezeProp(objClone, key, src[key]);
    }, this);
    return objClone;
  };

  /**
   * 合并对象
   * @method mix
   * @return 合并后的对象
   * @param {Object} dst 目标对象
   * @param {Object} src 源对象
   * @param {Array} igonres 忽略的属性名,
   * @param {Number} mode 模式
   */
  ntils.mix = function (dst, src, igonres, mode, igonreNull) {
    //根据模式来判断，默认是Obj to Obj的  
    if (mode) {
      switch (mode) {
        case 1: // proto to proto  
          return ntils.mix(dst.prototype, src.prototype, igonres, 0);
        case 2: // object to object and proto to proto  
          ntils.mix(dst.prototype, src.prototype, igonres, 0);
          break; // pass through  
        case 3: // proto to static  
          return ntils.mix(dst, src.prototype, igonres, 0);
        case 4: // static to proto  
          return ntils.mix(dst.prototype, src, igonres, 0);
        default: // object to object is what happens below  
      }
    }
    //---
    src = src || {};
    dst = dst || (this.isArray(src) ? [] : {});
    this.keys(src).forEach(function (key) {
      if (this.contains(igonres, key)) return;
      if (igonreNull && this.isNull(src[key])) return;
      if (this.isObject(src[key]) &&
        (src[key].constructor == Object ||
          src[key].constructor == Array ||
          src[key].constructor == null)) {
        dst[key] = ntils.mix(dst[key], src[key], igonres, 0, igonreNull);
      } else {
        dst[key] = src[key];
      }
    }, this);
    return dst;
  };

  /**
   * 定义不可遍历的属性
   **/
  ntils.defineFreezeProp = function (obj, name, value) {
    try {
      Object.defineProperty(obj, name, {
        value: value,
        enumerable: false,
        configurable: true, //能不能重写定义
        writable: false //能不能用「赋值」运算更改
      });
    } catch (err) {
      obj[name] = value;
    }
  };

  /**
   * 获取所有 key 
   */
  ntils.keys = function (obj) {
    if (Object.keys) return Object.keys(obj);
    var keys = [];
    this.each(obj, function (key) {
      keys.push(key);
    });
    return keys;
  };

  /**
   * 创建一个对象
   */
  ntils.create = function (proto, props) {
    if (Object.create) return Object.create(proto, props);
    var Cotr = function () { };
    Cotr.prototype = proto;
    var obj = new Cotr();
    if (props) this.copy(props, obj);
    return obj;
  };

  /**
   * 设置 proto
   * 在不支持 setPrototypeOf 也不支持 __proto__ 的浏览器
   * 中，会采用 copy 方式
   */
  ntils.setPrototypeOf = function (obj, proto) {
    if (Object.setPrototypeOf) {
      return Object.setPrototypeOf(obj, proto || this.create(null));
    } else {
      if (!('__proto__' in Object)) this.copy(proto, obj);
      obj.__proto__ = proto;
    }
  };

  /**
   * 获取 proto
   */
  ntils.getPrototypeOf = function (obj) {
    if (obj.__proto__) return obj.__proto__;
    if (Object.getPrototypeOf) return Object.getPrototypeOf(obj);
    if (obj.constructor) return obj.constructor.prototype;
  };

  /**
   * 是否深度相等
   */
  ntils.deepEqual = function (a, b) {
    if (a === b) return true;
    if (!this.isObject(a) || !this.isObject(b)) return false;
    var aKeys = this.keys(a);
    var bKeys = this.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    var allKeys = aKeys.concat(bKeys);
    var checkedMap = this.create(null);
    var result = true;
    this.each(allKeys, function (i, key) {
      if (checkedMap[key]) return;
      if (!this.deepEqual(a[key], b[key])) result = false;
      checkedMap[key] = true;
    }, this);
    return result;
  };

  /**
   * 从一个数值循环到别一个数
   * @param {number} fromNum 开始数值
   * @param {Number} toNum 结束数值
   * @param {Number} step 步长值
   * @param {function} handler 执行函数
   * @returns {void} 无返回
   */
  ntils.fromTo = function (fromNum, toNum, step, handler) {
    if (!handler) handler = [step, step = handler][0];
    step = Math.abs(step || 1);
    if (fromNum < toNum) {
      for (var i = fromNum; i <= toNum; i += step) handler(i);
    } else {
      for (var i = fromNum; i >= toNum; i -= step) handler(i);
    }
  };

  /**
   * 生成一个Guid
   * @method newGuid
   * @return {String} GUID字符串
   * @static
   */
  ntils.newGuid = function () {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  };

  /**
   * 对象变换
   **/
  ntils.map = function (list, fn) {
    var buffer = this.isArray(list) ? [] : {};
    this.each(list, function (name, value) {
      buffer[name] = fn(name, value);
    });
    return buffer;
  };

  /**
   * 通过路径设置属性值
   */
  ntils.setByPath = function (obj, path, value) {
    if (this.isNull(obj) || this.isNull(path) || path === '') {
      return;
    }
    if (!this.isArray(path)) {
      path = path.replace(/\[/, '.').replace(/\]/, '.').split('.');
    }
    this.each(path, function (index, name) {
      if (this.isNull(name) || name.length < 1) return;
      if (index === path.length - 1) {
        obj[name] = value;
      } else {
        obj[name] = obj[name] || {};
        obj = obj[name];
      }
    }, this);
  };

  /**
   * 通过路径获取属性值
   */
  ntils.getByPath = function (obj, path) {
    if (this.isNull(obj) || this.isNull(path) || path === '') {
      return obj;
    }
    if (!this.isArray(path)) {
      path = path.replace(/\[/, '.').replace(/\]/, '.').split('.');
    }
    this.each(path, function (index, name) {
      if (this.isNull(name) || name.length < 1) return;
      if (!this.isNull(obj)) obj = obj[name];
    }, this);
    return obj;
  };

  /**
   * 数组去重
   **/
  ntils.unique = function (array) {
    if (this.isNull(array)) return array;
    var newArray = [];
    this.each(array, function (i, value) {
      if (newArray.indexOf(value) > -1) return;
      newArray.push(value);
    });
    return newArray;
  };

  /**
   * 解析 function 的参数列表
   **/
  ntils.getFunctionArgumentNames = function (fn) {
    if (!fn) return [];
    var src = fn.toString();
    var parts = src.split(')')[0].split('=>')[0].split('(');
    return (parts[1] || parts[0]).split(',').map(function (name) {
      return name.trim();
    }).filter(function (name) {
      return name != 'function';
    });
  };

  /**
   * 缩短字符串
   */
  ntils.short = function (str, maxLength) {
    if (!str) return str;
    maxLength = maxLength || 40;
    var strLength = str.length;
    var trimLength = maxLength / 2;
    return strLength > maxLength ? str.substr(0, trimLength) + '...' + str.substr(strLength - trimLength) : str;
  };

  /**
   * 首字母大写
   */
  ntils.firstUpper = function (str) {
    if (this.isNull(str)) return;
    return str.substring(0, 1).toUpperCase() + str.substring(1);
  };

  /**
   * 编码正则字符串
   */
  ntils.escapeRegExp = function (str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  /**
   * 解析字符串为 dom 
   * @param {string} str 字符串
   * @returns {HTMLNode} 解析后的 DOM 
   */
  ntils.parseDom = function (str) {
    this._PDD_ = this._PDD_ || document.createElement('div');
    this._PDD_.innerHTML = ntils.trim(str);
    var firstNode = this._PDD_.childNodes[0];
    //先 clone 一份再通过 innerHTML 清空
    //否则 IE9 下，清空时会导出返回的 DOM 没有子结点
    if (firstNode) firstNode = firstNode.cloneNode(true);
    this._PDD_.innerHTML = '';
    return firstNode;
  };

})(( false) ? (window.ntils = {}) : exports);

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map