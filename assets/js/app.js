/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 624:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "oI": function() { return /* binding */ isHiddenElement; },
/* harmony export */   "M3": function() { return /* binding */ itemsRemoveClass; },
/* harmony export */   "I$": function() { return /* binding */ animateOverTime; },
/* harmony export */   "GX": function() { return /* binding */ slideUpDownAnim; }
/* harmony export */ });
/* unused harmony export isRetina */
/**
 * Проверяет и возвращает true если у устройства retina-дисплей
 *
 * @returns {boolean} true - retina-дислей
 */
function isRetina() {
  var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),            (min--moz-device-pixel-ratio: 1.5),            (-o-min-device-pixel-ratio: 3/2),            (min-resolution: 1.5dppx)";

  if (window.devicePixelRatio > 1) {
    return true;
  } else if (window.matchMedia && window.matchMedia(mediaQuery).matches) {
    return true;
  }

  return false;
}
/**
 * Используя метрики ширины/высоты проверяет видим ли элемент
 *
 * @param {HTMLElement} elem - элемент, который проверяется
 * @returns {boolean} true - элемент скрыт
 */


function isHiddenElement(elem) {
  return !elem.offsetWidth && !elem.offsetHeight;
}
/**
 * Убирает CSS-класс у группы DOM-элементов
 * @param {Object} options - объект параметров функции
 * @param {HTMLCollection} options.items - Список DOM-элементов
 * @param {string} options.className - Имя класса
 */


function itemsRemoveClass(_ref) {
  var items = _ref.items,
      className = _ref.className;
  items.forEach(function (item) {
    return item.classList.remove(className);
  });
}
/**
 * Создает функцию, после вызова которой запускается периодический вызов переданной параметром функции cb.
 * Функция вызывается на протажении заданного периода времени - dur.
 * При завершении вызывается функция - fin.
 *
 * @param {Object} animOption - объект со свойствами и функцией анимации
 * @param {number} animOption.dur - продолжительность анимации в мс
 * @param {Function} animOption.cb - функция анимации, получит значение прошедщего времени с начала запуска функции
 * @param {Function} [animOption.fin] - функция, которая будет вызвана при завершении анимации (необязательно)
 * @returns {Function} - функция, которая будет вызывать cb-функцию и передавать ей значение прошедшего времени
 */


function animateOverTime(_ref2) {
  var dur = _ref2.dur,
      cb = _ref2.cb,
      fin = _ref2.fin;
  var timeStart;
  /**
   * На основе requestAnimationFrame вызывает полученную из внешней функии функцию cb.
   * Пример использования:
   * const ani = animateOverTime({dur: 400,
        cb: (completion) => {
          targetBlock.style.height = `${blockHeight * completion}px`;
        }
      });
       requestAnimationFrame(ani); // запуск анимации
   *
   * @param {number} time - время с начала запуска функции, которое возвращается requestAnimationFrame
   */

  function _animateOverTime(time) {
    if (!timeStart) {
      timeStart = time;
    }

    var timeElapsed = time - timeStart;
    var completion = Math.min(timeElapsed / dur, 1); // cap completion at 1 (100%)

    cb(completion);

    if (timeElapsed < dur) {
      requestAnimationFrame(_animateOverTime);
    } else if (typeof fin === 'function') {
      fin();
    }
  }

  return _animateOverTime;
}
/**
 * Функция анимированного изменения высоты или ширины элемента от нуля до максимума значения
 * Параметр (width или height) по которому происходит анимация читает из css-свойства trasition-property элемента,
 * к которому применяется анимация
 * @param {object} option - опции
 * @param {HTMLElement} option.element - элемент, для которого выполняется анимация
 * @param {boolean} option.isDown - true - элемент нужно распахнуть на всю ширину или высоту
 * @param {string} option.activeClass - css-клас, который добавляется, когда элемент распахнут
 * @param {string} [option.animProp] - height или width - направление анимации
 * По умолчанию 'height'
 * @param {number} [option.animDur] - время анимациии в мс
 * По умолчанию 300мс
 * @param {string} [option.dispValue] - значение свойста display, когда элемент отображается
 * По умолчанию 'block'
 * @param {function} [option.fin] - дополнительная функция, которая выполнится при завершении анимации
 */


function slideUpDownAnim(_ref3) {
  var element = _ref3.element,
      isDown = _ref3.isDown,
      activeClass = _ref3.activeClass,
      _ref3$animProp = _ref3.animProp,
      animProp = _ref3$animProp === void 0 ? 'height' : _ref3$animProp,
      _ref3$animDur = _ref3.animDur,
      animDur = _ref3$animDur === void 0 ? 300 : _ref3$animDur,
      _ref3$dispValue = _ref3.dispValue,
      dispValue = _ref3$dispValue === void 0 ? 'block' : _ref3$dispValue,
      _fin = _ref3.fin;

  // может анимироваться width или height, другие свойства через css
  if (/(width|height)/i.test(animProp)) {
    // может быть Widht или Height, применяется для вычисления высоты или ширины блока
    var offsetDirection = animProp[0].toUpperCase() + animProp.slice(1); // отключаем сокрытие блока, чтобы корректно измерить величину ширины или высоты

    element.style.display = dispValue;
    element.style[animProp] = 'auto';
    var blockSize = element["offset".concat(offsetDirection)];
    element.style[animProp] = '';
    var animFunct = null;

    if (isDown) {
      // начальная высота или ширина
      element.style[animProp] = '0px';
      element.classList.add(activeClass);

      animFunct = function animFunct(completion) {
        element.style[animProp] = "".concat(blockSize * completion, "px");
      };
    } else {
      // перед сокрытием устанавливаем начальную ширину или высоту блока отличное от 'auto'
      // чтобы анимация сработала
      element.style[animProp] = blockSize + 'px';
      element.classList.remove(activeClass); // вызывается через setTimeout для того, чтобы сработало анимированное изменение свойства

      animFunct = function animFunct(completion) {
        element.style[animProp] = "".concat(blockSize * (1 - completion), "px");
      };
    }

    var ani = animateOverTime({
      dur: animDur,
      cb: animFunct,
      fin: function fin() {
        element.style[animProp] = '';
        element.style.display = '';

        if (_fin) {
          _fin();
        }
      }
    });
    requestAnimationFrame(ani); // запуск анимации
  }
}



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	!function() {
/******/ 		var getProto = Object.getPrototypeOf ? function(obj) { return Object.getPrototypeOf(obj); } : function(obj) { return obj.__proto__; };
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach(function(key) { def[key] = function() { return value[key]; }; });
/******/ 			}
/******/ 			def['default'] = function() { return value; };
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	!function() {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = function(chunkId) {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce(function(promises, key) {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return "assets/js/" + {"62":"AOS.min","198":"fadeInOutSlider.min","545":"splidejs-intersection.min","904":"splidejs.min","998":"shufflejs.min"}[chunkId] + ".js";
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.miniCssF = function(chunkId) {
/******/ 			// return url for filenames not based on template
/******/ 			if (chunkId === 143) return "assets/css/style.css";
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	!function() {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "akad:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = function(url, done, key, chunkId) {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = function(prev, event) {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach(function(fn) { return fn(event); });
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		__webpack_require__.p = "./";
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			143: 0,
/******/ 			181: 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = function(chunkId, promises) {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise(function(resolve, reject) { installedChunkData = installedChunks[chunkId] = [resolve, reject]; });
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = function(event) {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkakad"] = self["webpackChunkakad"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";

// EXTERNAL MODULE: ./src/js/utils.js
var utils = __webpack_require__(624);
;// CONCATENATED MODULE: ./src/js/accordion.js
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/* eslint-disable max-lines */

var DATA_ATTR = {
  // селектор кнопоки управления открытием/закрытием контента аккордеона
  сtrlBtn: 'data-accordion-ctrl',
  // селектор, который добавляется к ctrBtn и в которым содержится id блока, которым управляет кнопка
  contentTarget: 'data-accordion-target'
};
var CSS_CLASSES = {
  // клас добавляется к контейнеру, когда активируется обработка открытия/закрытия контента аккордеона
  init: 'accordion-init',
  // добавляется к ctrlBtn, когда контент акордеона открыт
  ctrlBtnActive: 'expanded',
  // добавляется к контенту, когда он показан
  contentActive: 'show'
};
/**
 * Аккордеон - блоки контента, которые показываются или сворачиваются, при взаимодействии с кнопкой управления
 * соотвествующим блоком
 * @param {object} option - параметры
 * @param {string} option.containerSelector - селектор общего контейнера аккордеона
 * @param {string} [option.activatingMedia] - медиавыражение, по которому активируется аккордеон
 * @param {boolean} [option.singleOpen = false] - флаг, указывающий что одновременно в аккордеоне
 * может быть открыто только однин контентный блок.
 * @param {boolean} [option.outContainerClose = true] - флаг, указывающий что контентынй блоки должны закрываться
 * когда происходит клик или фокусировка вне кнопки управления или контентного блока
 * @param {boolean} [option.openOnHover = false] - отключает обработку открытия контента аккордеона кликом мыши,
 * если контент открывается по псевдоклассу :hover в CSS-стилях. По-умолчанию - false, клик мыши открывает контент.
 * @param {boolean} [option.animateToggle = true] - включает анимацию height или width при открытии контента
 * При включении анимации нужно проверить, чтобы параметр height или width в CSS не имел фиксированного значения
 * @param {boolean} [option.correctPosition = true] - проверку и корректировку позиционирования
 * открытого контентного блока, если его границы могут выходить за пределы видимости экрана
 */

function accordion(_ref) {
  var mainContainer = _ref.mainContainer,
      activatingMedia = _ref.activatingMedia,
      _ref$singleOpen = _ref.singleOpen,
      singleOpen = _ref$singleOpen === void 0 ? false : _ref$singleOpen,
      _ref$outContainerClos = _ref.outContainerClose,
      outContainerClose = _ref$outContainerClos === void 0 ? true : _ref$outContainerClos,
      _ref$openOnHover = _ref.openOnHover,
      openOnHover = _ref$openOnHover === void 0 ? false : _ref$openOnHover,
      _ref$animateToggle = _ref.animateToggle,
      animateToggle = _ref$animateToggle === void 0 ? true : _ref$animateToggle,
      _ref$correctPosition = _ref.correctPosition,
      correctPosition = _ref$correctPosition === void 0 ? true : _ref$correctPosition,
      _ref$convertToButton = _ref.convertToButton,
      convertToButton = _ref$convertToButton === void 0 ? true : _ref$convertToButton;
  // хранит ссылку на открытый блок контента при активации открытия при ховере
  var activeContent = null; // содержит значение величины свойства display,
  // которое устанавливается/убирается при открытии/закрытии контентного блока

  var dispValue = 'block'; // массив кнопок управления контентными блоками аккордеона
  // используется для часто выполняемых операций поиска активных кнопок

  var ctrlBtns = Array.from(mainContainer.querySelectorAll("[".concat(DATA_ATTR.сtrlBtn, "]")));

  if (ctrlBtns.length > 0) {
    var content = getContentBlock(ctrlBtns[0]);
    document.addEventListener('DOMContentLoaded', function () {
      // вычисляем значение свойства display
      // которое должно присваиваться контентному блоку, когда он отображается
      // выполняется при DOMContentLoaded, для уверенности что уже загружены таблицы стилей
      content.classList.add(CSS_CLASSES.contentActive);
      dispValue = getComputedStyle(content).display;
      content.classList.remove(CSS_CLASSES.contentActive);
    }, {
      once: true
    }); // если медиавыражение не передается
    // аккордеон всегда активен на любом разрешении экрана

    if (!activatingMedia) {
      initAccordion(); // медиавыражение может быть только в виде min|max,число
    } else if (/(min|max),\d{3,4}/i.test(activatingMedia)) {
      var _activatingMedia$spli = activatingMedia.split(','),
          _activatingMedia$spli2 = _slicedToArray(_activatingMedia$spli, 2),
          key = _activatingMedia$spli2[0],
          prop = _activatingMedia$spli2[1];

      var mql = window.matchMedia("(".concat(key, "-width: ").concat(prop, "px)")); // если медиавыражение выполняется при первоначальном запуске
      // инициализируем аккордеон

      if (mql.matches) {
        initAccordion();
      } // наблюдаем за именением разрешения экрана
      // и активируем аккордеон только на разрешениях экрана при выполнении медиавыражения


      mql.addEventListener('change', function (evt) {
        if (evt.matches) {
          initAccordion();
        } else {
          // на экранах выходящих за пределы медиазапроса, деактивируем аккордеон
          deactivateAccordion();
        }
      });
    }
  }
  /**
   * Инициализация аккордеона
   */


  function initAccordion() {
    // добавляем aria-атрибуты для кнопок управления
    // если они отсутствуют в разметке
    ctrlBtns.forEach(function (ctrlBtn) {
      var ariaAttr = {
        'aria-haspopup': true,
        'aria-expanded': false,
        'aria-controls': ctrlBtn.getAttribute(DATA_ATTR.contentTarget)
      };
      Object.keys(ariaAttr).forEach(function (key) {
        if (!ctrlBtn.hasAttribute(key)) {
          ctrlBtn.setAttribute(key, ariaAttr[key]);
        }
      });
    }); // если установлен флаг преобразования элементов управления в кнопки

    if (convertToButton) {
      ctrlBtns.forEach(function (ctrlBtn) {
        // создаем элемент button(type="button")
        var btnElem = document.createElement('button');
        btnElem.setAttribute('type', 'button'); // копируем все атрибуты из исходного элемента
        // которые допустимы как атрибуты для кнопок

        var allowAttributes = ctrlBtn.getAttributeNames().filter(function (attr) {
          return !/^(href|hreflang|referrerpolicy|rel|target)$/.test(attr);
        });
        allowAttributes.forEach(function (attr) {
          return btnElem.setAttribute(attr, ctrlBtn.getAttribute(attr));
        }); // копируем внутренее содержимое

        btnElem.innerHTML = ctrlBtn.innerHTML; // заменяем текущий элемент управления на кнопку

        ctrlBtn.replaceWith(btnElem);
      }); // также восстанавливаем глобальный массив ссылок на кнопки управления

      ctrlBtns = Array.from(mainContainer.querySelectorAll("[".concat(DATA_ATTR.сtrlBtn, "]")));
    } // добавляем служебный класс, что аккордеон инициализирован


    mainContainer.classList.add(CSS_CLASSES.init); // добавляем обработчик клика по кнопке открытия/закрытия контенного блока аккордеона

    mainContainer.addEventListener('click', onCrtlBtnClick); // дополнительные обработчики на устройствах поддерживающих наведение
    // добавление обрабочиков открытия контентного блока при ховере

    if (openOnHover && window.matchMedia('(any-hover: hover)').matches) {
      mainContainer.addEventListener('mouseover', onMouseOverCtrlBtn);
      mainContainer.addEventListener('mouseout', onMouseOutCtrlBtn);
    } // только для аккордеонов у которых одновременно открытым может быть только один контентый блок


    if (outContainerClose) {
      // обработка закрытия аккордеона при клике вне его содержимого
      document.addEventListener('click', onDocumentClick);
    } // добавление обработчика при фокусировке с клавиатуры вне кнопки управления контентным блоком или контентом


    if (outContainerClose || singleOpen) {
      document.addEventListener('focusin', onDocumentFocus);
    }
  }
  /**
   * Деактивация аккордеона
   */


  function deactivateAccordion() {
    // добавляем служебный класс, что аккордеон инициализирован
    mainContainer.classList.remove(CSS_CLASSES.init); // добавляем обработчик клика по кнопке открытия/закрытия контенного блока аккордеона

    mainContainer.removeEventListener('click', onCrtlBtnClick);
    mainContainer.removeEventListener('mouseover', onMouseOverCtrlBtn);
    mainContainer.removeEventListener('mouseout', onMouseOutCtrlBtn);
    document.removeEventListener('focusin', onDocumentFocus); // обработка закрытия аккордеона при клике вне его содержимого

    document.removeEventListener('click', onDocumentClick);
  }
  /**
   * Обработчик клика на кнопку открытия/закрытия контентного блока
   * @param {Object} evt - объкт события
   */


  function onCrtlBtnClick(evt) {
    // только если клик по кнопке открытия/закрытия контентного блока
    // если меню открывается при наведении (hover) и клик мышью (evt.pageX !== 0), не обрабатываем
    if (evt.target.closest("[".concat(DATA_ATTR.сtrlBtn, "]")) && !(openOnHover && window.matchMedia('(any-hover: hover)').matches && evt.pageX)) {
      evt.preventDefault();
      var ctrlBtn = evt.target.closest("[".concat(DATA_ATTR.сtrlBtn, "]")); // если аккордеон должен одновременно отображать только один открытый блок
      // то закрываем все ненужные активные блоки

      if (singleOpen) {
        // находим все "активные" кнопки, для которых открыто подменю
        var activeCtrlBtns = getActiveCtrlBtns(); // закрываются только блоки, которые не управляются текущей кнопкой открытия/закрытия

        activeCtrlBtns.forEach(function (activeCtrlBtn) {
          if (activeCtrlBtn !== ctrlBtn) {
            hideContent(activeCtrlBtn);
          }
        });
      } // открытие/заркытие связанного с кнопкой блока


      if (ctrlBtn.classList.contains(CSS_CLASSES.ctrlBtnActive)) {
        hideContent(ctrlBtn);
      } else {
        showContent(ctrlBtn);
      }
    }
  }
  /**
   * Обработчик клика вне меню и кнопок управления (бурген и кнопки управления подменю)
   *
   * @param {Object} evt - объкт события
   */


  function onDocumentClick(evt) {
    // клик вне контейнера меню со ссылками
    if (!mainContainer.contains(evt.target)) {
      // все открытые контентные блоки скрываем
      var activeCtrlBtns = getActiveCtrlBtns();
      activeCtrlBtns.forEach(function (activeCtrlBtn) {
        return hideContent(activeCtrlBtn);
      });
    }
  }
  /**
   * Обработчик фокусировки вне аккордеона или вне активных кнопок или открытых контентных блоков
   * @param {Object} evt - объкт события
   */


  function onDocumentFocus(evt) {
    // фокусировка на одном из элементов контейнера
    if (singleOpen && mainContainer.contains(evt.target)) {
      // находим все кнопки с открытыми контентыми блоками
      var activeCtrlBtns = getActiveCtrlBtns(); // получаем только активные кнопки вне фокуса

      activeCtrlBtns = activeCtrlBtns.filter(function (activeCtrlBtn) {
        return !activeCtrlBtn.contains(evt.target) && !getContentBlock(activeCtrlBtn).contains(evt.target);
      }); // скрываем все открытые контентные блоке вне фокуса, при фокусировке в контейнере

      activeCtrlBtns.forEach(function (activeCtrlBtn) {
        return hideContent(activeCtrlBtn);
      });
    }

    if (outContainerClose && !mainContainer.contains(evt.target)) {
      // находим все кнопки с открытыми контентыми блоками
      var _activeCtrlBtns = getActiveCtrlBtns(); // скрываем все открытие контентные блоки, при фокусировке вне контейнера


      _activeCtrlBtns.forEach(function (activeCtrlBtn) {
        return hideContent(activeCtrlBtn);
      });
    }
  }
  /**
   * Обработчик наведения на кнопку управления открытием контентного блока
   * @param {Object} evt - объкт события
   */


  function onMouseOverCtrlBtn(evt) {
    // если контент еще не был открыт и наведение на кнопку управления открытием блока контента
    if (!activeContent && evt.target.closest("[".concat(DATA_ATTR.сtrlBtn, "]"))) {
      var ctrlBtn = evt.target.closest("[".concat(DATA_ATTR.сtrlBtn, "]"));

      var _content = getContentBlock(ctrlBtn);

      if (_content) {
        // добавляем класс активности для кнопки управления контентом
        ctrlBtn.classList.add(CSS_CLASSES.ctrlBtnActive);
        ctrlBtn.setAttribute('aria-expanded', 'true'); // сохраним ссылку на открытый ховером контентный блок

        activeContent = _content;
        showContent(ctrlBtn);
      }
    }
  }
  /**
   * Обработчик ухода с кнопки управления открытием контента или с открытого блока контента
   * @param {Object} evt - объкт события
   */


  function onMouseOutCtrlBtn(evt) {
    var _evt$relatedTarget;

    // если есть открытый контентный блок, и мы переходим не на этот блока или кнопку управления блоком
    if (activeContent && !(activeContent.contains(evt.relatedTarget) || (_evt$relatedTarget = evt.relatedTarget) !== null && _evt$relatedTarget !== void 0 && _evt$relatedTarget.closest("[".concat(DATA_ATTR.сtrlBtn, "]")))) {
      // находим все "активные" кнопки, для которых открыт контентный блок
      var activeCtrlBtns = getActiveCtrlBtns(); // убираем класс "активности" у всех кнопок открытого контентного блока

      activeCtrlBtns.forEach(function (activeCtrlBtn) {
        activeCtrlBtn.classList.remove(CSS_CLASSES.ctrlBtnActive);
        activeCtrlBtn.setAttribute('aria-expanded', 'false');
        hideContent(activeCtrlBtn);
      });
      activeContent = null;
    }
  }
  /**
   * Показывает связанный с кнопкой управления контентный блока
   * @param {HTMLElement} ctrlBtn - кнопка управления контентным блоком
   */


  function showContent(ctrlBtn) {
    var content = getContentBlock(ctrlBtn);

    if (content) {
      ctrlBtn.classList.add(CSS_CLASSES.ctrlBtnActive);
      ctrlBtn.setAttribute('aria-expanded', 'true');

      if (animateToggle) {
        animationToggle({
          element: content,
          isDown: true
        });
      } else {
        content.classList.add(CSS_CLASSES.contentActive);
      } // выполняем дополнительное позиционирование открытого контентного блока, если оно выходит за границы экрана
      // код расположен после анимации открытия, для правильного позиционирования предваретильно скрытого контента


      if (correctPosition) {
        content.style.left = '';
        var overScreen = document.documentElement.clientWidth - content.getBoundingClientRect().right;

        if (overScreen < 0) {
          content.style.left = overScreen + 'px';
        }
      }
    }
  }
  /**
   * Скрывает связанный с кнопкой управления контентный блок
   * @param {HTMLElement} ctrlBtn - кнопка управления соответствующим контентный блоком
   */


  function hideContent(ctrlBtn) {
    var content = getContentBlock(ctrlBtn);

    if (content) {
      ctrlBtn.classList.remove(CSS_CLASSES.ctrlBtnActive);
      ctrlBtn.setAttribute('aria-expanded', 'false');

      if (animateToggle) {
        animationToggle({
          element: content,
          isDown: false
        });
      } else {
        content.classList.remove(CSS_CLASSES.contentActive);
      }
    }
  }
  /**
   * На основе ID в дата-атрибуте кнопки управления
   * возвращает блок, которым эта кнопка управляет
   * @param {HTMLElement} ctrlBtn - кнопка управления
   * @returns {HTMLElemenent} элемент, которым управляет кнопка
   */


  function getContentBlock(ctrlBtn) {
    var targetID = ctrlBtn === null || ctrlBtn === void 0 ? void 0 : ctrlBtn.getAttribute(DATA_ATTR.contentTarget);

    if (targetID) {
      return mainContainer.querySelector("#".concat(targetID));
    }

    return null;
  }
  /**
   * Возвращает массив активных кнопок управления контентыми блоками
   * @returns {HTMLElement[]} массив активных кнопок управления
   */


  function getActiveCtrlBtns() {
    return ctrlBtns.filter(function (сrtBtn) {
      return сrtBtn.classList.contains(CSS_CLASSES.ctrlBtnActive);
    });
  }
  /**
   * Анимация открытия/закрытия контентного блока
   * @param {object} option - параметры
   * @param {HTMLElement} element - элемент, к которому применяется анимация
   * @param {boolean} isDown - true - slideDown, false - slideUp
   */


  function animationToggle(_ref2) {
    var element = _ref2.element,
        isDown = _ref2.isDown;
    (0,utils/* slideUpDownAnim */.GX)({
      element: element,
      isDown: isDown,
      activeClass: CSS_CLASSES.contentActive,
      animProp: 'height',
      animDur: 300,
      dispValue: dispValue
    });
  }
}

/* harmony default export */ var js_accordion = (accordion);
/*
Пример разметки

#header-menu // общий контейнер
  //- кнопка управления
  //- data-accordion-ctrl - селектор кнопки управления
  //- data-accordion-target - ID контентного блока, которым управляет кнопка
  a(href="#", role="menuitem", aria-haspopup="true", aria-expanded="false", aria-controls=`submenu-1`,
    data-accordion-ctrl, data-accordion-target=`submenu-1`) Кнопка управления
  //- контентый блок связан с кнопкой управления по ID
  ul.main-menu__sublist(id=`submenu-1`, role="menu", aria-label=`${link.text}`)
      li(role="none")
        a(href=`${link.href}.html`, role="menuitem")= `${link.text}-1`
      li(role="none")
        a(href=`${link.href}.html`, role="menuitem")= `${link.text}-2`
      li(role="none")
        a(href=`${link.href}.html`, role="menuitem")= `${link.text}-3`
*/
;// CONCATENATED MODULE: ./src/js/burger-menu.js
/* eslint-disable max-lines */

var burger_menu_DATA_ATTR = {
  // селектор кнопкок управления меню (бургеров)
  burgerBtn: 'data-burger',
  // атрибут, который содержит ID блока контейнера ссылок меню, которым управляет бургер
  burgerTarget: 'data-burger-target',
  // отдельный атрибут, который содержит непосредственно ссылки меню
  // используется, для обработки закрытия меню при клике вне области со ссылками меню
  // и как общий контейнер для добавления обработчиков подменю
  linkContainer: 'data-burger-navmenu'
};
var burger_menu_CSS_CLASSES = {
  // CSS-класс, который добавляется кнопке бургера при открытии меню на мобильном устройстве
  burgerActive: 'open',
  // добавляется к контейнеру меню, при его открытии на мобильном устройстве
  menuActive: 'expanded'
};
/**
 * Управление меню на сайте
 * В т.ч. открытие/закрытие меню на мобильных устройствах
 * Открытие/закрытие подменю
 * @param {object} option - параметры
 * @param {HTMLElement} option.mainContainer - общий контейнер меню, содержащий кнопку бергер, меню ссылок, подменю
 * @param {number} [option.hideMenuMedia] - разрешения экрана, устанавливающее границу ниже которой меню скрывается.
 * Если не установлено, меню всегда показано.
 * @param {string} [option.bodyClass] - класс, который добавляется к тегу BODY, когда открывается мобильное меню.
 * Например, используетс для предотвращения прокрутки страницы, когда открыто мобильное меню.
 * Если пусто, класс добавлен не будет
 */

function burgerMenu(_ref) {
  var mainContainer = _ref.mainContainer,
      hideMenuMedia = _ref.hideMenuMedia,
      bodyClass = _ref.bodyClass;
  // непосредственно контейнер со ссылками меню
  // const linkContainer = mainContainer.querySelector(`[${DATA_ATTR.linkContainer}]`);
  var ctrlBtn = mainContainer.querySelector("[".concat(burger_menu_DATA_ATTR.burgerBtn, "]"));
  var menuID = ctrlBtn === null || ctrlBtn === void 0 ? void 0 : ctrlBtn.getAttribute(burger_menu_DATA_ATTR.burgerTarget);
  var menu = mainContainer.querySelector("#".concat(menuID));

  if (menu) {
    // обработка клика по кнопке открытия/закрытия меню
    ctrlBtn.addEventListener('click', onCtrlBtnClick); // если нужно скрывать меню выше определенного разрешения

    if (hideMenuMedia) {
      var mql = window.matchMedia("(max-width: ".concat(hideMenuMedia, "px)"));

      if (!mql.matches) {
        hideMenu();
      } // наблюдаем за именением разрешения экрана


      mql.addEventListener('change', function (evt) {
        if (!evt.matches) {
          // на экранах больше заданного размера, скрываем мобильное меню
          hideMenu();
        }
      });
    }
  } // обработка закрытия меню при клике вне области меню


  document.addEventListener('click', onDocumentClick);
  /**
   * Обработчик клика на кнопку открытия/закрытия мобильного меню
   *
   * @param {Object} evt - объкт события
   */

  function onCtrlBtnClick(evt) {
    evt.preventDefault();

    if (ctrlBtn.classList.contains(burger_menu_CSS_CLASSES.burgerActive)) {
      hideMenu();
    } else {
      showMenu();
    }
  }
  /**
   * Обработчик клика вне меню и кнопок управления (бурген и кнопки управления подменю)
   *
   * @param {Object} evt - объкт события
   */


  function onDocumentClick(evt) {
    // клик вне контейнера меню со ссылками
    // и вне кнопки-бургера открытия меню
    // т.к. кнопка переключения отображения меню может быть скрыта на некоторых разрешениях экрана
    // меню скрываем только если такой функционал нужен, т.е. есть видна кнопка управления сокрытием меню
    if (!evt.target.closest("[".concat(burger_menu_DATA_ATTR.linkContainer, "]")) && !evt.target.closest("[".concat(burger_menu_DATA_ATTR.burgerBtn, "]")) && ctrlBtn !== null && ctrlBtn !== void 0 && ctrlBtn.classList.contains(burger_menu_CSS_CLASSES.burgerActive) && !(0,utils/* isHiddenElement */.oI)(ctrlBtn)) {
      hideMenu();
    }
  }
  /**
   * Функция сокрытия меню
   */


  function hideMenu() {
    ctrlBtn.classList.remove(burger_menu_CSS_CLASSES.burgerActive);
    ctrlBtn.setAttribute('aria-expanded', 'false');
    menu.classList.remove(burger_menu_CSS_CLASSES.menuActive);

    if (bodyClass) {
      // убираем специальный класс с элемента BODY
      document.body.classList.remove(bodyClass);
    }
  }
  /**
   * Функция показа меню
   */


  function showMenu() {
    ctrlBtn.classList.add(burger_menu_CSS_CLASSES.burgerActive);
    ctrlBtn.setAttribute('aria-expanded', 'true');
    menu.classList.add(burger_menu_CSS_CLASSES.menuActive);

    if (bodyClass) {
      // добавляем специальный класс с элемента BODY
      document.body.classList.add(bodyClass);
    }
  }
}

/* harmony default export */ var burger_menu = (burgerMenu);
;// CONCATENATED MODULE: ./src/js/watch-elem-intersection.js
var watch_elem_intersection_DATA_ATTR = {
  // элемент-источник, за которым ведется наблюдение находится ли он в пределах видимости экрана
  observer: 'data-observer',
  // атрибут, который добавляется элемент-источнику и содержит ссылку на ID элемента элемента-цели,
  // которому добавляется служебный класс, когда элемент-источник скрывается за пределы видимости экрана
  target: 'data-observer-target'
};
var watch_elem_intersection_CSS_CLASSES = {
  // служебный класс, который допавляется к элементу-цели, если элемент-истоник выходит за пределы экрана
  outOfScreen: 'scrolled'
};
/**
 * Используя IntersectionObserver добавляет/убирает класс CSS_CLASSES.outOfScreen элементу-цели,
 * когда элемент-источник выходит/входит в пределы видимости экрана
 */

function watchElemIntersection() {
  // находим все элементы-источники по data-атрибуту
  var observerElements = document.querySelectorAll("[".concat(watch_elem_intersection_DATA_ATTR.observer, "]"));
  observerElements.forEach(function (observElement) {
    // ID элемента-цели находится в отдельном data-атрибуте элемента-источника
    var targetID = observElement.getAttribute(watch_elem_intersection_DATA_ATTR.target);
    var targetElem = document.querySelector("#".concat(targetID));

    if (targetElem) {
      var observer = new IntersectionObserver(updateTargetElem(targetElem), {
        threshold: 0.01
      });
      observer.observe(observElement);
    }
  });

  function updateTargetElem(target) {
    return function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // если элемент-истоник в пределах экрана служебный класс у элемента-цели убираем
          target.classList.remove(watch_elem_intersection_CSS_CLASSES.outOfScreen);
        } else {
          // иначе служебный класс элементу-цели добавляем
          target.classList.add(watch_elem_intersection_CSS_CLASSES.outOfScreen);
        }
      });
    };
  }
}

/* harmony default export */ var watch_elem_intersection = (watchElemIntersection);
;// CONCATENATED MODULE: ./src/js/shuffle-filter.js
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// !!! npm install shufflejs
// import Shuffle from 'shufflejs';

/**
 * Создает виджет фильтруемых элементов c анимированной фильтрацией
 * @requires https://vestride.github.io/Shuffle/
 */

var ShuffleFilter = /*#__PURE__*/function () {
  /**
   * Устанавливает параметры фильтра
   * Если option.ctrBtnsSelector не задан, то кнопки управления фильтром будут выбраны через ctrlContainer.children
   *
   * @param {Object} option - объект с настройками
   * @param {HTMLElement} option.filterContainer - общий контейнер фильтруемых элементов
   * @param {string} option.filterItemSelector - CSS-селектор для выбора всех фильтруемых элементов
   * @param {HTMLElement} option.ctrlContainer - общий контейнер с кнопками управления фильтром
   * @param {string} [option.ctrBtnsSelector] - CSS-селектор для выбора всех кнопок управления (необязательно)
   * если не задано, то кнопками управления будут считаться дочерние элементы общего контейнера кнопок управления
   * @param {Object} [option.filterOptions] - дополнительные опции для ShuffleJS
   * https://vestride.github.io/Shuffle/#options
   * @param {Function} [option.func] - функция-каллбек, которая вызывается после фильтрации элементов
   * при клике на кнопку управления (получает список кнопок управления и текущую активную кнопку управления)
   */
  function ShuffleFilter(_ref) {
    var filterContainer = _ref.filterContainer,
        filterItemSelector = _ref.filterItemSelector,
        ctrlContainer = _ref.ctrlContainer,
        _ref$ctrBtnsSelector = _ref.ctrBtnsSelector,
        ctrBtnsSelector = _ref$ctrBtnsSelector === void 0 ? '' : _ref$ctrBtnsSelector,
        _ref$filterOptions = _ref.filterOptions,
        filterOptions = _ref$filterOptions === void 0 ? {} : _ref$filterOptions,
        _ref$func = _ref.func,
        func = _ref$func === void 0 ? null : _ref$func;

    _classCallCheck(this, ShuffleFilter);

    this.filterContainer = filterContainer;
    this.filterItemSelector = filterItemSelector;
    this.ctrlContainer = ctrlContainer;
    this.ctrBtnsSelector = ctrBtnsSelector;
    this.filterOptions = filterOptions;
    this.func = func;
    this.shuffleFiter = null;
  }
  /**
   * Добавляет обработчики кнопок фильтрации и задает параметры фильтрации для библиотеки Shuffle
   */


  _createClass(ShuffleFilter, [{
    key: "createFilter",
    value: function createFilter() {
      var _this = this;

      // если CSS-селектор кнопок управления не задан,
      // то в качестве кнопок управления берутся дочерние элементы конейнера кнопок
      if (this.ctrBtnsSelector === '') {
        this.ctrBtns = this.ctrlContainer.children;
        this.ctrBtnsArray = Array.from(this.ctrBtns);
      } else {
        this.ctrBtns = this.ctrlContainer.querySelectorAll(this.ctrBtnsSelector);
      } // обернуто в обработчик события DOMContentLoaded для корректного вычисления размеров filterItemElements,
      // когда точные размеры фильтруемых элементов зависят от их содержимого,
      // например, внутри картинки с без фиксации их размеров из CSS-стилей


      document.addEventListener('DOMContentLoaded', function () {
        // динамический импорт для code splitting
        __webpack_require__.e(/* import() | shufflejs.min */ 998).then(__webpack_require__.bind(__webpack_require__, 439)).then(function (_ref2) {
          var Shuffle = _ref2.default;
          // Shuffle.ShuffleItem.Css.INITIAL.overflow = 'hidden';
          // дополнительная анимация slideUp для фильтруемых элементов
          // по-умолчанияю Shuffle с настройкой 'useTransforms: false' применяет только анимацию opacity
          Shuffle.ShuffleItem.Css.VISIBLE.before.transform = 'translate3d(0, 0, 0)'; // Shuffle.ShuffleItem.Css.VISIBLE.after.transform = 'translate3d(0, 0, 0)';

          Shuffle.ShuffleItem.Css.HIDDEN.before.transform = 'translate3d(0, 0, 0)';
          Shuffle.ShuffleItem.Css.HIDDEN.after.transform = 'translate3d(0, 50px, 0)'; // базовые (дефолтные) настройки для фильтра

          var baseShuffleOptions = {
            itemSelector: _this.filterItemSelector,
            // для перемещения элементов не используем transform, т.к. они уже используется для дополнительной анимации
            // также отключает дефолтную анимацию 'transform: scale' у Shuffle
            useTransforms: false,
            // скорость анимации
            speed: 600,
            // начальное значение параметра для фильтрации элементов
            // 'all' - отображаются все элементы
            // передавая другое значение, изначально будут отображаться только элементы,
            // в атрибуте [data-groups] которых содержатся только эти строки
            group: 'all',
            // разделитель групп к которым принадлежит фильтруемый элемент
            // сами группы по-умолчанию задаются в атрибуте [data-groups]
            // например, data-groups="webdesign, graphic"
            // ! группы разделяются именно запятой с пробелом
            delimiter: ', '
          }; // к дефолтным настройкам фильтра добавляются переданные в конструкторе

          var shuffleOptions = _objectSpread(_objectSpread({}, baseShuffleOptions), _this.filterOptions);

          _this.shuffleFiter = new Shuffle(_this.filterContainer, shuffleOptions); // добавяем обработчик клика на кнопки фильтрации

          _this._onCtrlBtnClick = _this._onCtrlBtnClick.bind(_this);

          _this.ctrlContainer.addEventListener('click', _this._onCtrlBtnClick);
        });
      }, {
        once: true
      });
    }
    /**
     * Обработчик кликов по кнопкам управления фильтрацией
     *
     * @param {Object} evt - объект события
     */

  }, {
    key: "_onCtrlBtnClick",
    value: function _onCtrlBtnClick(evt) {
      var clickBtn = null; // если CSS-селектор кнопок управления не задан,
      // ищем источник клика среди всех дочерних элементов контейнера кнопок

      if (this.ctrBtnsSelector === '') {
        clickBtn = this.ctrBtnsArray.find(function (btn) {
          return btn.contains(evt.target);
        });
      } else {
        // иначе ищим источник клика по CSS-селектору
        clickBtn = evt.target.closest(this.ctrBtnsSelector);
      } // если клик не по кнопке управления
      // ничего не делаем


      if (!clickBtn) {
        return;
      }

      evt.preventDefault(); // если клик по уже активной кнопке управления
      // ничего не делаем

      if (clickBtn.classList.contains('active')) {
        return;
      } // добавляем класс 'active' для кнопки по которой был клик


      (0,utils/* itemsRemoveClass */.M3)({
        items: this.ctrBtns,
        className: 'active'
      });
      clickBtn.classList.add('active'); // получаем селектор фильтрации, который будем сравнивать с атрибутом в элементах фильтрации
      // по-умолчанию селектор фильтации содержится в атрибуте кнопки [data-group]

      var filterGroup = clickBtn.dataset.group;

      if (filterGroup === '' || filterGroup === '*' || filterGroup.toLowerCase() === 'all') {
        this.shuffleFiter.filter(this.shuffleFiter.ALL_ITEMS);
      } else {
        // фильтруем элементы по селектору фильтрации из кнопки управления
        // по-умолчанию данные о том к какой группе принадлежит конкретный элемент фильтрации
        // содержится в атрибуте [data-groups]
        this.shuffleFiter.filter(filterGroup);
      } // если нужна дополнительная логика
      // вызываем функцию-каллбек, переданную при создании фильтра
      // в качестве параметров передаем ей HTMLList кнопок управления
      // и HTMLElement - кнопку, по которой мы кликнули


      if (this.func) {
        this.func({
          ctrlBtns: this.ctrBtns,
          targetBtn: clickBtn
        });
      }
    }
  }]);

  return ShuffleFilter;
}();

/* harmony default export */ var shuffle_filter = (ShuffleFilter);
/*
Пример HTML верстки
id="ctrls-container" - общий контейнер кнопок управления для делегации события
js-ctrl-btn - CSS-класс обработки клика именно по кнопкам управления
data-group="webdesign" - атрибут кнопки фильтрации, сравнивается с атрибутом data-groups в фильтруемых элементах;
  для выбора всех элементов может быть пустым или содержать "*", или "all"
id="fiter-elements-container" - контейнер фильтруемых элементов, передается Shuffle
js-filter-element - селектор фильтруемых элементов, передается Shuffle
data-groups="webdesign, logo" - атрибут, который устанавливает к каким группам принадлежит фильтруемый элемент
  может содержать несколько слов разделенных запятой с пробелом, когда элемент принадлежит нескольким группам

    <ul id="ctrls-container">
      <li>
        <a href="#" class="js-ctrl-btn" data-group="all">all</a>
      </li>
      <li>
        <a href="#" class="js-ctrl-btn" data-group="webdesign">webdesign</a>
      </li>
    </ul>

    <div id="fiter-elements-container">
      <a class="js-filter-element" href="" data-groups="logo">
        <img src="" alt="" width="" height="">
      </a>
      <a class="js-filter-element" href="" data-groups="logo, webdesign">
        <img src="" alt="" width="" height="">
      </a>
    </div>
*/
;// CONCATENATED MODULE: ./src/js/anim-page-load.js

var anim_page_load_DATA_ATTR = {
  // селектор кнопкок управления меню (бургеров)
  linkSelector: 'data-load-anim'
};
/**
 * Создает анимацию начальной загрузки страницы
 * и перехода на другие страницы сайта при клике на ссылки соответствующие селектору LINK_SELECTOR
 * @param {Object} option - объект параметров
 * @param {number} [option.dur] - продолжительность анимации в мс
 * @param {number} [option.transfromOffset] - величина смещения страницы по вертикали при анимации, (px)
 * @param {number} [option.mobileResolution] - разрешение экрана, ниже которого отключаем анимацию, (px)
 */

function animationPageLoad() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$dur = _ref.dur,
      dur = _ref$dur === void 0 ? 600 : _ref$dur,
      _ref$transfromOffset = _ref.transfromOffset,
      transfromOffset = _ref$transfromOffset === void 0 ? 100 : _ref$transfromOffset,
      _ref$mobileResolution = _ref.mobileResolution,
      mobileResolution = _ref$mobileResolution === void 0 ? 576 : _ref$mobileResolution;

  document.addEventListener('DOMContentLoaded', function () {
    // на мобилках анимацию отключаем
    if (window.matchMedia("(min-width: ".concat(mobileResolution, "px)")).matches) {
      var body = document.body; // анимация при начальной загрузке страницы

      var loadAnim = (0,utils/* animateOverTime */.I$)({
        dur: dur,
        cb: _fadeInSlideUp(body),
        fin: function fin() {
          // по окончанию анимации убираем ранее установленные стили на BODY
          body.style.opacity = '';
          body.style.transform = '';
        }
      }); // запускаем анимацию

      requestAnimationFrame(loadAnim); // добавляем анимацию при клике на заданные селектором linkSelector ссылки

      document.addEventListener('click', function (evt) {
        var animationLink = evt.target.closest("a[".concat(anim_page_load_DATA_ATTR.linkSelector, "]"));

        if (animationLink) {
          evt.preventDefault(); // сохраняем значение атрибута href ссылки

          var newLocation = animationLink.href;
          var unloadAnim = (0,utils/* animateOverTime */.I$)({
            dur: dur,
            cb: _fadeOutSlideUp(body),
            fin: function fin() {
              // после выполнения анимации переходим на новую страницу
              window.location = newLocation;
            }
          }); // запускаем анимацию

          requestAnimationFrame(unloadAnim);
        }
      });
    }
  }, {
    once: true
  });
  /**
   * Анимация плавного исчезновения c поднятием вверх
   *
   * @param {HTMLElement} el - DOM-элемент, к которому применяется анимация
   */

  function _fadeOutSlideUp(el) {
    // el.style.opacity = 1; is assumed
    // el.style.transfrom = 'translate3d(0, 0, 0)';
    // create closure
    function _animation(completion) {
      el.style.opacity = 1 - completion; // поднятие в -100px, для BODY это за пределы окна браузера

      el.style.transform = "translate3d(0, ".concat(-transfromOffset * completion, "px, 0)");

      if (completion === 1) {
        el.style.transfrom = 'translate3d(0, 0, 0)';
      }
    }

    return _animation;
  }
  /**
   * Анимация плавного появления c поднятием вверх
   *
   * @param {HTMLElement} el - DOM-элемент, к которому применяется анимация
   */


  function _fadeInSlideUp(el) {
    // el.style.opacity = 0; is assumed
    // el.style.transfrom = 'translate3d(0, 100px, 0)';
    // create closure
    function _animation(completion) {
      el.style.opacity = completion; // this is easy since both 0 - 1 decimal

      el.style.transform = "translate3d(0, ".concat(transfromOffset * (1 - completion), "px, 0)");
    }

    return _animation;
  }
}

/* harmony default export */ var anim_page_load = (animationPageLoad);
;// CONCATENATED MODULE: ./src/js/contact-map-leaflet.js
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = contact_map_leaflet_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function contact_map_leaflet_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return contact_map_leaflet_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return contact_map_leaflet_arrayLikeToArray(o, minLen); }

function contact_map_leaflet_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/* global L */
// Интерактивная карта с использованием библиотеки Leaflet
// требует подключения стилей и скрипта в теге HEAD https://leafletjs.com/examples/quick-start/
var MAP_OPTIONS = {
  center: [55.704832, 37.570924],
  zoom: '17'
}; // коордитнаты маркеров
// если нужне один маркер, можно в массиве оставить один элемент

var MARKERS_COORD = [[55.704494569644545, 37.569801391031305], [55.70563833072354, 37.57299512227082]];
/**
 * Создает и добавляет карту на страницу
 *
 * @param {HTMLElement} container - элемент-контейнер, куда будет добавлена карта
 */

function createMap(container) {
  // содержимое внутри контейнера автоматически заменится при запуске скрипта
  // стили иконок, если нужны отдельные иконки нужно создавать отдельные переменные
  var customIcon = L.icon({
    // ссылка на кастомную картинку иконки
    iconUrl: './assets/img/map-pin.png',
    iconSize: [64, 64],
    // размер иконки (ширина, высота)
    iconAnchor: [32, 63],
    // относительная позиция (по ширине и высоте), по которой иконка будет размещена в координатах
    popupAnchor: [0, -60] // смещение относительно iconAnchor, по которому будет появляться окно подсказки

  }); // обернуто в DOMContentLoaded, чтобы не было проблем загрузкой карты в еще не инициализированный HTMLElement

  document.addEventListener('DOMContentLoaded', function () {
    // scrollWheelZoom: false - запрещаем изменение маштаба карты колесиком мыши
    var map = L.map(container, {
      scrollWheelZoom: false
    }).setView(MAP_OPTIONS.center, MAP_OPTIONS.zoom);
    /*
    // Если нужна карта visicom, раскоментировать и заменить инициализацию от openstreetmap
    L.tileLayer('https://tms{s}.visicom.ua/2.0.0/planet3/base/{z}/{x}/{y}.png', {
    attribution: 'Данные карт © 2019 ЧАО «<a href=\'https://api.visicom.ua/\'>Визиком</a>»',
    subdomains: '123',
    maxZoom: 19,
    tms: true
    }).addTo(map);
    */
    // openstreetmap

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map); // добавляем иконки на карту по заданным координатам
    // если нужны разные иконки на разных координатах, то цикл нужно заменить на отдельные строки

    var _iterator = _createForOfIteratorHelper(MARKERS_COORD),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var coords = _step.value;
        L.marker(coords, {
          icon: customIcon
        }).addTo(map);
      }
      /*
      // если нужен tooltip при клике на иконку
      .bindPopup('Popup text');
      */

    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }, {
    once: true
  });
}

/* harmony default export */ var contact_map_leaflet = (createMap);
;// CONCATENATED MODULE: ./src/js/app.js
// import Splide from '@splidejs/splide';





 // import AOS from 'aos';

var headerMenu = document.querySelector('#header-menu');

if (headerMenu) {
  // открытие/закрытие подменю в меню шапки
  js_accordion({
    mainContainer: headerMenu,
    singleOpen: true,
    outContainerClose: true,
    openOnHover: true,
    animateToggle: true,
    correctPosition: true
  }); // открытие/сокрытие меню на мобильных устройствах

  burger_menu({
    mainContainer: headerMenu,
    hideMenuMedia: 768,
    bodyClass: 'locked'
  });
} // добавляет фоновый цвет для position:fixed меню на десктопах, чтобы меню было видно на фоне страницы


watch_elem_intersection(); // анимационные переходы между страницами при клике на навигационные ссылки

anim_page_load(); // анимационное появление элементов при прокрутке с использованием библиотеки AOS
// https://github.com/michalsnik/aos/tree/v2

__webpack_require__.e(/* import() | AOS.min */ 62).then(__webpack_require__.t.bind(__webpack_require__, 711, 23)).then(function (_ref) {
  var AOS = _ref.default;
  AOS.init({
    duration: 1100,
    disable: window.innerWidth < 576,
    once: true
  });
});
/**
 * Анимация слайдера главного заголовка в блоке Hero
 */

var heroSlideContainer = document.querySelector('#hero-slider');

if (heroSlideContainer) {
  var heroSlideItems = heroSlideContainer.children;

  if (heroSlideItems.length > 1) {
    // динамический импорт для code splitting
    __webpack_require__.e(/* import() | fadeInOutSlider.min */ 198).then(__webpack_require__.bind(__webpack_require__, 948)).then(function (_ref2) {
      var FadeInOutSlider = _ref2.default;
      var slider = new FadeInOutSlider({
        container: heroSlideContainer,
        interval: 4000,
        duration: 400
      });
      slider.startAnimation();
    });
  }
}
/**
 * Фильтр категорий в блоке Portfolio
 */


var portfolioExamplesContainer = document.querySelector('#portfolio-examples');

if (portfolioExamplesContainer) {
  var exampleItemSelector = '.js-portfolio-example';
  var categoryCtrlContainer = document.querySelector('#portfolio-category-ctrls');
  var categoryCtrlSelector = '.js-category-filter-btn';
  var shuffleFilter = new shuffle_filter({
    filterContainer: portfolioExamplesContainer,
    filterItemSelector: exampleItemSelector,
    ctrlContainer: categoryCtrlContainer,
    ctrBtnsSelector: categoryCtrlSelector
  });
  shuffleFilter.createFilter();
}
/**
 * Фильтр постов в боке Post-filter
 */


var postFilterContainer = document.querySelector('#post-filter');

if (postFilterContainer) {
  var postItemSelector = '.js-post-filter-item';
  var postFilterCtrlContainer = document.querySelector('#post-filter-ctrl-container');
  var postFilterCtrlSelector = '.js-post-filter-ctrl';

  var _shuffleFilter = new shuffle_filter({
    filterContainer: postFilterContainer,
    filterItemSelector: postItemSelector,
    ctrlContainer: postFilterCtrlContainer,
    ctrBtnsSelector: postFilterCtrlSelector,
    filterOptions: {
      // изначально отображаются элементы в соотвествии с параметром фильтрации в первой управляющей кнопке
      group: document.querySelector('.js-post-filter-ctrl').dataset.group
    },
    // обновляем позицию нижнего подчеркивания в блоке кнопок управления
    // через вызов функции-каллбека в обработчике клика по кнопкам управления фильтром
    func: function func(_ref3) {
      var targetBtn = _ref3.targetBtn;
      postFilterCtrlContainer.style.setProperty('--underline-pos', targetBtn.offsetLeft + 'px');
      postFilterCtrlContainer.style.setProperty('--underline-width', targetBtn.offsetWidth + 'px');
    }
  });

  _shuffleFilter.createFilter();
}
/**
 * Карта на странице контактов
 */


var contactMapContainer = document.querySelector('#contact-map');

if (contactMapContainer) {
  contact_map_leaflet(contactMapContainer);
}
/**
 * Слайдер отзывов на странице About
 */


var testimonialsSlider = document.querySelector('#testimonials-slider');

if (testimonialsSlider) {
  document.addEventListener('DOMContentLoaded', function () {
    Promise.all([__webpack_require__.e(/* import() | splidejs.min */ 904).then(__webpack_require__.bind(__webpack_require__, 595)), __webpack_require__.e(/* import() | splidejs-intersection.min */ 545).then(__webpack_require__.bind(__webpack_require__, 419))]).then(function (modules) {
      var Splide = modules[0].Splide;
      var Intersection = modules[1].Intersection;
      new Splide(testimonialsSlider, {
        type: 'loop',
        slideFocus: false,
        arrows: false,
        autoplay: 'pause',
        intersection: {
          inView: {
            autoplay: true
          },
          outView: {
            autoplay: false
          }
        }
      }).mount({
        Intersection: Intersection
      });
    });
  });
}
;// CONCATENATED MODULE: ./src/index.js
// SCSS
// import './scss/main.scss';
// JS

}();
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
!function() {
// extracted by mini-css-extract-plugin
}();
/******/ })()
;