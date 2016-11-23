(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("logootsplit", [], factory);
	else if(typeof exports === 'object')
		exports["logootsplit"] = factory();
	else
		root["logootsplit"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Const = __webpack_require__(1);
	
	var _Const2 = _interopRequireDefault(_Const);
	
	var _RemoteCommand = __webpack_require__(2);
	
	var _RemoteCommand2 = _interopRequireDefault(_RemoteCommand);
	
	var _Base = __webpack_require__(3);
	
	var _Base2 = _interopRequireDefault(_Base);
	
	var _CharId = __webpack_require__(4);
	
	var _CharId2 = _interopRequireDefault(_CharId);
	
	var _Char = __webpack_require__(5);
	
	var _Char2 = _interopRequireDefault(_Char);
	
	var _Document = __webpack_require__(6);
	
	var _Document2 = _interopRequireDefault(_Document);
	
	var _Algorithm = __webpack_require__(7);
	
	var _Algorithm2 = _interopRequireDefault(_Algorithm);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	window.Base = _Base2.default;
	window.RemoteCommand = _RemoteCommand2.default;
	window.CharId = _CharId2.default;
	window.Char = _Char2.default;
	window.Document = _Document2.default;
	window.Algorithm = _Algorithm2.default;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	window.MIN_BASE_EL = 0;
	//const MAX_BASE_EL = Math.pow(2, 53) - 1
	window.MAX_BASE_EL = 1000;
	window.MIN_OFFSET = MIN_BASE_EL + 1;
	window.MAX_OFFSET = MAX_BASE_EL;
	window.FIRST_ASSIGNED_OFFSET = Math.floor(MAX_OFFSET / 2);
	
	// Char ID is represented by array of numbers, each of them in range [MIN_BASE_EL;MAX_BASE_EL]
	// Last element of char ID is called offset, others are called base
	// MIN_BASE_EL cannot be used as offset
	// When new base is generated, first char assigned to this base get offset FIRST_ASSIGNED_OFFSET, this value decide how much chars we can append and prepend to first char

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var RemoteCommand = function () {
	    function RemoteCommand() {
	        _classCallCheck(this, RemoteCommand);
	    }
	
	    _createClass(RemoteCommand, [{
	        key: "makeAddCommand",
	        value: function makeAddCommand(str, id, sessionId) {
	            this.type = "add";
	            this.str = str;
	            this.id = id;
	            this.sessionId = sessionId;
	        }
	    }, {
	        key: "makeDelCommand",
	        value: function makeDelCommand(ids, sessionId) {
	            this.type = "del";
	            this.ids = ids;
	            this.sessionId = sessionId;
	        }
	    }]);
	
	    return RemoteCommand;
	}();
	
	exports.default = RemoteCommand;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Base = function () {
	    function Base(main, sessionId, clock) {
	        _classCallCheck(this, Base);
	
	        this.main = main;
	        this.sessionId = sessionId;
	        this.clock = clock;
	        this.minUsedOffset = MAX_OFFSET + 1;
	        this.maxUsedOffset = MIN_OFFSET - 1;
	    }
	
	    _createClass(Base, [{
	        key: "isEqual",
	        value: function isEqual(otherBase) {
	            if (this.sessionId !== otherBase.sessionId || this.clock !== otherBase.clock || this.main.length !== otherBase.main.length) return false;
	            for (var i = 0; i < this.main.length; ++i) {
	                if (this.main[i] != otherBase.main[i]) return false;
	            }return true;
	        }
	    }, {
	        key: "isPrefix",
	        value: function isPrefix(charId) {
	            var thisId = this.fullBase;
	            var otherId = charId.fullId;
	            if (thisId.length > otherId.length) return false;
	            for (var i = 0; i < thisId.length; ++i) {
	                if (thisId[i] != otherId[i]) return false;
	            }return true;
	        }
	    }, {
	        key: "fullBase",
	        get: function get() {
	            return this.main.concat([this.sessionId], [this.clock]);
	        }
	    }, {
	        key: "copy",
	        get: function get() {
	            return new Base(this.main.slice(), this.sessionId, this.clock);
	        }
	    }]);
	
	    return Base;
	}();
	
	exports.default = Base;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var CharId = function () {
	    function CharId(base, offset) {
	        _classCallCheck(this, CharId);
	
	        this.base = base;
	        this.offset = offset;
	        if (this.offset > base.maxUsedOffset) base.maxUsedOffset = this.offset;
	        if (this.offset < base.minUsedOffset) base.minUsedOffset = offset;
	    }
	
	    _createClass(CharId, [{
	        key: "isEqual",
	        value: function isEqual(otherChar) {
	            return this.base.isEqual(otherChar.base) && this.offset === otherChar.offset;
	        }
	    }, {
	        key: "isBigger",
	        value: function isBigger(otherCharId) {
	            var thisId = this.fullId,
	                otherId = otherCharId.fullId;
	            for (var i = 0; i < Math.min(thisId.length, otherId.length); ++i) {
	                if (thisId[i] !== otherId[i]) return thisId[i] > otherId[i];
	            }return thisId.length > otherId.length;
	        }
	    }, {
	        key: "fullId",
	        get: function get() {
	            return this.base.fullBase.concat(this.offset);
	        }
	    }, {
	        key: "copy",
	        get: function get() {
	            return new CharId(this.base.copy, this.offset);
	        }
	    }]);
	
	    return CharId;
	}();
	
	exports.default = CharId;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Char = function () {
	    function Char(value, id) {
	        _classCallCheck(this, Char);
	
	        this.value = value;
	        this.id = id;
	    }
	
	    _createClass(Char, [{
	        key: "isEqual",
	        value: function isEqual(otherChar) {
	            return this.value === otherChar.value && this.id.isEqual(otherChar.id);
	        }
	    }]);
	
	    return Char;
	}();
	
	exports.default = Char;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Base = __webpack_require__(3);
	
	var _Base2 = _interopRequireDefault(_Base);
	
	var _CharId = __webpack_require__(4);
	
	var _CharId2 = _interopRequireDefault(_CharId);
	
	var _Char = __webpack_require__(5);
	
	var _Char2 = _interopRequireDefault(_Char);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// At the beginning document contains two chars: DOC_BEG and DOC_END, they're not actual
	// text chars and are only used to represent start and end of the document
	
	var DOC_BEG = new _Char2.default(null, new _CharId2.default(new _Base2.default([MIN_BASE_EL - 1], MIN_BASE_EL - 1, MIN_BASE_EL - 1), MIN_OFFSET - 1));
	var DOC_END = new _Char2.default(null, new _CharId2.default(new _Base2.default([MAX_BASE_EL + 1], MAX_BASE_EL + 1, MAX_BASE_EL + 1), MAX_OFFSET + 1));
	
	var Document = function () {
	    function Document() {
	        _classCallCheck(this, Document);
	
	        this.chars = [DOC_BEG, DOC_END];
	        this.bases = [];
	    }
	
	    _createClass(Document, [{
	        key: 'insertStrAppended',
	        value: function insertStrAppended(str, pos) {
	            logFunc("insertStrAppended", [str, pos]);
	            var charWeAppendTo = this.chars[pos - 1];
	            var base = charWeAppendTo.id.base;
	            var firstOffset = charWeAppendTo.id.offset + 1;
	            this.insertStringWithExistingBase(str, pos, base, firstOffset);
	        }
	    }, {
	        key: 'insertStrPrepended',
	        value: function insertStrPrepended(str, pos) {
	            logFunc("insertStrPrepended", [str, pos]);
	            var charWePrependTo = this.chars[pos];
	            var base = charWePrependTo.id.base;
	            var firstOffset = charWePrependTo.id.offset - str.length;
	            this.insertStringWithExistingBase(str, pos, base, firstOffset);
	        }
	    }, {
	        key: 'insertStringWithExistingBase',
	        value: function insertStringWithExistingBase(str, pos, base) {
	            var firstOffset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : FIRST_ASSIGNED_OFFSET;
	            //optimize
	            logFunc("insertStrWithExistingBase", [str, pos, base, firstOffset]);
	            this.insertStrAtPos(str, pos, base, firstOffset);
	            this.sortDocumentPart(1, this.chars.length - 1);
	        }
	    }, {
	        key: 'insertStringWithNewBase',
	        value: function insertStringWithNewBase(str, pos, base) {
	            logFunc("insertStrWithNewBase", [str, pos, base]);
	            this.addBase(base);
	            this.insertStringWithExistingBase(str, pos, base);
	        }
	    }, {
	        key: 'insertStrAtPos',
	        value: function insertStrAtPos(str, pos, base, firstCharOffset) {
	            logFunc("insertStrAtPos", [str, pos, base, firstCharOffset]);
	            var offset = firstCharOffset;
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;
	
	            try {
	                for (var _iterator = str[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var char = _step.value;
	
	                    var newId = new _CharId2.default(base, offset);
	                    var newChar = new _Char2.default(char, newId);
	                    this.insertCharAtPos(newChar, pos);
	                    ++pos;
	                    ++offset;
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator.return) {
	                        _iterator.return();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }
	        }
	    }, {
	        key: 'addChars',
	        value: function addChars(chars) {
	            logFunc("addChars", [chars]);
	            if (chars.length == 0) return;
	            var pos = this.getPosOfFirstCharWithBiggerId(chars[0].id);
	            var _iteratorNormalCompletion2 = true;
	            var _didIteratorError2 = false;
	            var _iteratorError2 = undefined;
	
	            try {
	                for (var _iterator2 = chars[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                    var char = _step2.value;
	
	                    this.insertCharAtPos(char, pos);
	                    ++pos;
	                }
	            } catch (err) {
	                _didIteratorError2 = true;
	                _iteratorError2 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                        _iterator2.return();
	                    }
	                } finally {
	                    if (_didIteratorError2) {
	                        throw _iteratorError2;
	                    }
	                }
	            }
	
	            this.sortDocumentPart(1, this.chars.length - 1);
	        }
	    }, {
	        key: 'sortDocumentPart',
	        value: function sortDocumentPart(sortBeg, sortEnd) {
	            for (var pos = sortBeg + 1; pos <= sortEnd; ++pos) {
	                var temp = this.chars[pos];
	                var prevPos = pos - 1;
	                for (; prevPos >= 1 && this.chars[prevPos].id.isBigger(temp.id); --prevPos) {
	                    this.chars[prevPos + 1] = this.chars[prevPos];
	                }this.chars[prevPos + 1] = temp;
	            }
	        }
	    }, {
	        key: 'addBase',
	        value: function addBase(base) {
	            logFunc("addBase", [base]);
	            this.bases.push(base);
	        }
	    }, {
	        key: 'delChars',
	        value: function delChars(fromPos, toPos) {
	            for (var pos = toPos; pos >= fromPos; --pos) {
	                this.delChar(pos);
	            }
	        }
	    }, {
	        key: 'delChar',
	        value: function delChar(pos) {
	            this.chars.splice(pos, 1);
	        }
	    }, {
	        key: 'getPosOfCharWithId',
	        value: function getPosOfCharWithId(id) {
	            for (var pos = 0; pos < this.chars.length; ++pos) {
	                if (this.chars[pos].id.isEqual(id)) return pos;
	            }return null;
	        }
	    }, {
	        key: 'getPosOfFirstCharWithBiggerId',
	        value: function getPosOfFirstCharWithBiggerId(charId) {
	            for (var pos = 1; pos < this.chars.length; ++pos) {
	                if (this.chars[pos].id.isBigger(charId)) return pos;
	            }return null;
	        }
	    }, {
	        key: 'getCharAtPos',
	        value: function getCharAtPos(pos) {
	            return this.chars[pos];
	        }
	    }, {
	        key: 'getIdOfCharAtPos',
	        value: function getIdOfCharAtPos(pos) {
	            return this.chars[pos].id;
	        }
	    }, {
	        key: 'getCharIds',
	        value: function getCharIds(fromPos, toPos) {
	            var ids = [];
	            for (var i = fromPos; i <= toPos; ++i) {
	                ids.push(this.chars[i].id);
	            }return ids;
	        }
	    }, {
	        key: 'getSameBase',
	        value: function getSameBase(base) {
	            var _iteratorNormalCompletion3 = true;
	            var _didIteratorError3 = false;
	            var _iteratorError3 = undefined;
	
	            try {
	                for (var _iterator3 = this.bases[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                    var b = _step3.value;
	
	                    if (base.isEqual(b)) return b;
	                }
	            } catch (err) {
	                _didIteratorError3 = true;
	                _iteratorError3 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
	                        _iterator3.return();
	                    }
	                } finally {
	                    if (_didIteratorError3) {
	                        throw _iteratorError3;
	                    }
	                }
	            }
	
	            return null;
	        }
	    }, {
	        key: 'insertCharAtPos',
	        value: function insertCharAtPos(char, pos) {
	            logFunc("insertCharAtPos", [char, pos]);
	            this.chars.splice(pos, 0, char);
	        }
	    }, {
	        key: 'isEmpty',
	        value: function isEmpty() {
	            return this.chars.length == 2;
	        }
	    }, {
	        key: 'text',
	        get: function get() {
	            var text = "";
	            for (var i = 0; i < this.chars.length; ++i) {
	                text += this.chars[i].value;
	            }return text;
	        }
	    }, {
	        key: 'textTest',
	        get: function get() {
	            var text = "";
	            for (var i = 0; i < this.chars.length; ++i) {
	                text += i == 0 || i == this.chars.length - 1 ? "" : this.chars[i].value;
	                if (i + 1 < this.chars.length && !this.chars[i].id.base.isEqual(this.chars[i + 1].id.base)) text += "|";
	            }
	            return text;
	        }
	    }]);
	
	    return Document;
	}();
	
	exports.default = Document;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Base = __webpack_require__(3);
	
	var _Base2 = _interopRequireDefault(_Base);
	
	var _CharId = __webpack_require__(4);
	
	var _CharId2 = _interopRequireDefault(_CharId);
	
	var _Char = __webpack_require__(5);
	
	var _Char2 = _interopRequireDefault(_Char);
	
	var _Document = __webpack_require__(6);
	
	var _Document2 = _interopRequireDefault(_Document);
	
	var _RemoteCommand = __webpack_require__(2);
	
	var _RemoteCommand2 = _interopRequireDefault(_RemoteCommand);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Algorithm = function () {
	    function Algorithm(doc, sessionId) {
	        _classCallCheck(this, Algorithm);
	
	        this.doc = doc;
	        this.sessionId = sessionId;
	        this.clock = 0;
	        this.idsOfCharsToDeleteLater = [];
	    }
	
	    _createClass(Algorithm, [{
	        key: 'insert',
	        value: function insert(str, pos) {
	            this.insertIntoDocument(str, pos);
	            return this.createRemoteAddCommand(str, pos);
	        }
	    }, {
	        key: 'add',
	        value: function add(str, strId) {
	
	            var chars = this.createCharsFromStr(str, strId);
	            logFunc("add", [str, strId], [this.idsOfCharsToDeleteLater, chars]);
	
	            for (var i = chars.length - 1; i >= 0; --i) {
	                for (var j = this.idsOfCharsToDeleteLater.length - 1; j >= 0; --j) {
	                    if (chars[i].id.isEqual(this.idsOfCharsToDeleteLater[j])) {
	                        chars.splice(i, 1);
	                        this.idsOfCharsToDeleteLater.splice(j, 1);
	                        break;
	                    }
	                }
	            }
	            this.doc.addChars(chars);
	        }
	    }, {
	        key: 'remove',
	        value: function remove(fromPos, toPos) {
	            logFunc("remove", [fromPos, toPos]);
	            var delIds = this.doc.getCharIds(fromPos, toPos);
	            var delIdsCopy = delIds.map(function (id) {
	                return id.copy;
	            });
	            this.doc.delChars(fromPos, toPos);
	            return this.createRemoteDelCommand(delIds);
	        }
	    }, {
	        key: 'del',
	        value: function del(ids) {
	            //optimize eg. if consecutive ids then obtain range (pos, pos+length-1)
	            logFunc("del", [ids]);
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;
	
	            try {
	                for (var _iterator = ids[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var id = _step.value;
	
	                    var pos = this.doc.getPosOfCharWithId(id);
	                    if (pos != null) this.doc.delChar(pos);else this.idsOfCharsToDeleteLater.push(id);
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator.return) {
	                        _iterator.return();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }
	        }
	    }, {
	        key: 'createRemoteDelCommand',
	        value: function createRemoteDelCommand(delIds) {
	            var remoteDelCommand = new _RemoteCommand2.default();
	            remoteDelCommand.makeDelCommand(delIds, this.session);
	            return remoteDelCommand;
	        }
	    }, {
	        key: 'createCharsFromStr',
	        value: function createCharsFromStr(str, strId) {
	            var base = this.doc.getSameBase(strId.base);
	            if (base == null) base = strId.base;
	
	            var chars = [];
	            var offset = strId.offset;
	            var _iteratorNormalCompletion2 = true;
	            var _didIteratorError2 = false;
	            var _iteratorError2 = undefined;
	
	            try {
	                for (var _iterator2 = str[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                    var char = _step2.value;
	
	                    chars.push(new _Char2.default(char, new _CharId2.default(base, offset)));
	                    ++offset;
	                }
	            } catch (err) {
	                _didIteratorError2 = true;
	                _iteratorError2 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                        _iterator2.return();
	                    }
	                } finally {
	                    if (_didIteratorError2) {
	                        throw _iteratorError2;
	                    }
	                }
	            }
	
	            return chars;
	        }
	    }, {
	        key: 'insertIntoDocument',
	        value: function insertIntoDocument(str, pos) {
	            if (this.canInsertAppended(str, pos)) this.doc.insertStrAppended(str, pos);else if (this.canInsertPrepended(str, pos)) this.doc.insertStrPrepended(str, pos);else this.doc.insertStringWithNewBase(str, pos, this.generateBaseAtPos(pos));
	        }
	    }, {
	        key: 'canInsertAppended',
	        value: function canInsertAppended(str, pos) {
	            var charWeAppendTo = this.doc.getCharAtPos(pos - 1);
	            return this.isSameSession(charWeAppendTo) && this.isHighestOffsetInBase(charWeAppendTo) && this.isSpaceInBaseAfter(charWeAppendTo, str.length) && this.isNotGoingToOverlapAfterApp(str, pos);
	        }
	    }, {
	        key: 'isNotGoingToOverlapAfterApp',
	        value: function isNotGoingToOverlapAfterApp(str, pos) {
	            var prevCharId = this.doc.getIdOfCharAtPos(pos - 1);
	            var nextCharId = this.doc.getIdOfCharAtPos(pos);
	            var lastIdOfAppStr = prevCharId.copy;
	            lastIdOfAppStr.offset += str.length;
	            return !lastIdOfAppStr.isBigger(nextCharId);
	        }
	    }, {
	        key: 'canInsertPrepended',
	        value: function canInsertPrepended(str, pos) {
	            var charWePrependTo = this.doc.getCharAtPos(pos);
	            return this.isSameSession(charWePrependTo) && this.isLowestOffsetInBase(charWePrependTo) && this.isSpaceInBaseBefore(charWePrependTo, str.length) && this.isNotGoingToOverlapAfterPrep(str, pos);
	        }
	    }, {
	        key: 'isNotGoingToOverlapAfterPrep',
	        value: function isNotGoingToOverlapAfterPrep(str, pos) {
	            var prevCharId = this.doc.getIdOfCharAtPos(pos - 1);
	            var nextCharId = this.doc.getIdOfCharAtPos(pos);
	            var firstIdOfPrepStr = nextCharId.copy;
	            firstIdOfPrepStr.offset -= str.length;
	            return !prevCharId.isBigger(firstIdOfPrepStr);
	        }
	    }, {
	        key: 'isSameSession',
	        value: function isSameSession(char) {
	            return char.id.base.sessionId == this.sessionId;
	        }
	    }, {
	        key: 'isHighestOffsetInBase',
	        value: function isHighestOffsetInBase(char) {
	            return char.id.offset == char.id.base.maxUsedOffset;
	        }
	    }, {
	        key: 'isLowestOffsetInBase',
	        value: function isLowestOffsetInBase(char) {
	            return char.id.offset == char.id.base.minUsedOffset;
	        }
	    }, {
	        key: 'isSpaceInBaseAfter',
	        value: function isSpaceInBaseAfter(char, spaceLength) {
	            return char.id.offset + spaceLength < MAX_BASE_EL;
	        }
	    }, {
	        key: 'isSpaceInBaseBefore',
	        value: function isSpaceInBaseBefore(char, spaceLength) {
	            return char.id.offset - spaceLength > MIN_BASE_EL;
	        }
	    }, {
	        key: 'createRemoteAddCommand',
	        value: function createRemoteAddCommand(str, pos) {
	            var addId = this.doc.getCharAtPos(pos).id.copy;
	            var remoteAddCommand = new _RemoteCommand2.default();
	            remoteAddCommand.makeAddCommand(str, addId, this.sessionId);
	            return remoteAddCommand;
	        }
	    }, {
	        key: 'generateBaseAtPos',
	        value: function generateBaseAtPos(pos) {
	            var idLow = this.doc.getIdOfCharAtPos(pos - 1).fullId;
	            var idHigh = this.doc.getIdOfCharAtPos(pos).fullId;
	            var low = idLow[0];
	            var high = idHigh[0];
	            var base = new _Base2.default([], this.sessionId, ++this.clock);
	
	            for (var i = 1; high - low < 2; ++i) {
	                base.main.push(low);
	                low = i < idLow.length ? idLow[i] : MIN_BASE_EL;
	                high = i < idHigh.length ? idHigh[i] : MAX_BASE_EL;
	            }
	            base.main.push(this.getRandomElementBetween(low + 1, high - 1));
	            return base;
	        }
	    }, {
	        key: 'numberOfInsertableCharaters',
	        value: function numberOfInsertableCharaters(idInsert, idNext, strLength) {
	            if (idInsert.base.isPrefix(idNext)) return 0;else return strLength;
	        }
	    }, {
	        key: 'getRandomElementBetween',
	        value: function getRandomElementBetween(low, high) {
	            return Math.floor(Math.random() * (high - low + 1)) + low;
	        }
	    }]);
	
	    return Algorithm;
	}();
	
	exports.default = Algorithm;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=logootsplit.js.map