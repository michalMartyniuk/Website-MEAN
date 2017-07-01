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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(3)
__webpack_require__(6)
__webpack_require__(8)
__webpack_require__(10)
__webpack_require__(12)
__webpack_require__(14)


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./home.sass", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./home.sass");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".flex-home-container {\n  width: 100%;\n  height: 100%; }\n\n.info-main {\n  display: flex;\n  flex-direction: column;\n  background-color: steelblue;\n  width: 80%;\n  height: 70%;\n  margin: 0% 10%;\n  padding: 20px;\n  top: -50px;\n  position: relative;\n  border-radius: 40px;\n  animation: info-main-anim 5s linear 0s infinite; }\n\n.my-tabs {\n  display: flex;\n  justify-content: center;\n  font-size: 25px;\n  margin: 0px;\n  padding: 0px;\n  list-style: none;\n  border-radius: 30px;\n  border-bottom-left-radius: 0px;\n  border-bottom-right-radius: 0px;\n  background-color: #003B46; }\n  .my-tabs li {\n    height: 100%;\n    display: flex; }\n  .my-tabs li:first-child {\n    border-top-left-radius: 30px; }\n  .my-tabs li:last-child {\n    border-top-right-radius: 30px; }\n  .my-tabs li a {\n    color: #8593AE;\n    text-decoration: none;\n    margin: auto; }\n  .my-tabs li:hover {\n    background-color: #505160; }\n  .my-tabs li:nth-child(1) {\n    flex: 1; }\n  .my-tabs li:nth-child(2) {\n    flex: 1; }\n  .my-tabs li:nth-child(3) {\n    flex: 1; }\n  .my-tabs li:nth-child(4) {\n    flex: 1; }\n\n.photo-content-space {\n  display: flex;\n  height: 100%;\n  background-color: lightsteelblue;\n  border-radius: 30px;\n  border-top-right-radius: 0px;\n  border-top-left-radius: 0px; }\n\n.photo-space {\n  height: 100%;\n  width: 25%; }\n  .photo-space img {\n    position: relative;\n    height: 100%;\n    width: 100%;\n    border-radius: 30px;\n    border-top-left-radius: 0px;\n    border-top-right-radius: 0px;\n    border-bottom-right-radius: 0px;\n    animation: photo-anim 5s linear 0s infinite; }\n\n.profile-photo {\n  width: 100%;\n  height: 100%; }\n\n.content-space {\n  display: flex;\n  width: 75%;\n  height: 100%;\n  background-color: lightsteelblue;\n  border-bottom-right-radius: 30px;\n  padding: 20px;\n  color: #063852; }\n  .content-space p {\n    font-size: 20px; }\n  .content-space .content-title {\n    color: #F0810F;\n    font-size: 25px; }\n", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./profile.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./profile.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".mainFlex {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  margin: 0px 20%;\n  color: black;\n  font-size: 25px;\n  border: 10px solid steelblue;\n  box-shadow: 0px 0px 20px steelblue;\n  border-radius: 20px;\n  width: 60%; }\n\n.flex-item-container {\n  display: flex;\n  justify-content: center;\n  align-content: flex-start;\n  /*align-items: center;*/\n  width: 100%;\n  height: 100%;\n  background-color: steelblue; }\n\n.flex-item-one {\n  text-align: right;\n  background-color: lightsteelblue;\n  margin: 10px 20px 10px 10px;\n  padding: 10px;\n  border-radius: 10px;\n  box-shadow: 0px 0px 2px black;\n  flex: 2; }\n\n.flex-item-two {\n  text-align: center;\n  background-color: lightsteelblue;\n  margin: 10px;\n  padding: 10px;\n  border-radius: 10px;\n  box-shadow: 0px 0px 2px black;\n  flex: 3; }\n\n/*.flexContainer {\n\tdisplay: flex;\n\tbackground-color: red;\n\twidth: 100%;\n\theight: 100%;\n}\n\n.profileRow {\n\tbackground-color: orange;\n\tdisplay: flex;\n\twidth: 400px;\n\theight: 100px;\n\tjustify-content: center;\n\n}\n\n.profileKey {\n\twidth: 200px;\n\theight: 100px;\n\tcolor: black;\n\tborder: 1px solid black;\n\tbackground-color: white;\n}\n\n.profileValue {\n\twidth:200px;\n\theight: 100px;\n\tcolor: black;\n\tbackground-color: white;\n\tborder: 1px solid black;\n}\n*/\n/*#resetBck, #resetHeadBck:hover {\n\tbackground-color: white;\n\tcolor: black;\n\tborder: 2px solid black;\n\tbox-shadow: 0px 0px 20px black;\n\ttext-shadow: 0px 0px 20px black;\n}\n*/\n", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./gallery.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./gallery.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".imgDiv {\n  position: relative;\n  width: 420px;\n  height: 255px;\n  display: inline-block;\n  text-align: center; }\n\n.gallImg {\n  position: relative;\n  display: block;\n  text-align: center;\n  box-shadow: 0px 0px 20px black;\n  background-color: black;\n  padding: 5px;\n  margin: 0px;\n  width: 350px;\n  height: 200px;\n  left: 35px;\n  top: 27.5px; }\n\n.imgOver {\n  animation: imgAnim 0.5s forwards;\n  cursor: pointer; }\n\n@keyframes imgAnim {\n  0% {\n    top: 27.5px;\n    left: 35px;\n    width: 350px;\n    height: 200px; }\n  100% {\n    top: 0px;\n    left: 10px;\n    width: 400px;\n    height: 250px;\n    box-shadow: 0px 0px 200px #E5A64E;\n    background-color: #E5A64E; } }\n\n/*MODAL CSS*/\n/* The Modal (background) */\n.modal {\n  display: none;\n  /* Hidden by default */\n  position: fixed;\n  /* Stay in place */\n  z-index: 1;\n  /* Sit on top */\n  width: 100%;\n  /* Full width */\n  height: 100%;\n  /* Full height */\n  overflow: auto;\n  /* Enable scroll if needed */\n  background-color: black;\n  /* Fallback color */\n  background-color: rgba(0, 0, 0, 0.9);\n  /* Black w/ opacity */ }\n\n/* Modal Content (Image) */\n.modal-content {\n  margin: 0px;\n  padding: 0px;\n  display: block;\n  width: 100%;\n  height: 100%; }\n\n/* Caption of Modal Image (Image Text) - Same Width as the Image */\n#caption {\n  display: block;\n  width: 100%;\n  text-align: center;\n  color: white;\n  text-shadow: 0px 0px 10px white; }\n\n/* Add Animation - Zoom in the Modal */\n.modal-content, #caption {\n  animation-name: zoom;\n  animation-duration: 0.6s; }\n\n@keyframes zoom {\n  from {\n    transform: scale(0); }\n  to {\n    transform: scale(1); } }\n\n@keyframes zoom {\n  from {\n    transform: scale(0); }\n  to {\n    transform: scale(1); } }\n\n.buttonCloseRow {\n  padding-top: 0px;\n  padding-bottom: 0px; }\n\n#myModal button {\n  opacity: 0.5;\n  border: none;\n  background-color: darkblue;\n  color: white;\n  letter-spacing: 0px;\n  font-size: 25px;\n  height: 70px;\n  margin-right: 0px; }\n\n#myModal button:hover {\n  opacity: 1;\n  transition: 0.3s; }\n\n/* The Close Button */\n.close {\n  border: none;\n  height: 70px;\n  background-color: red;\n  color: white;\n  font-size: 50px;\n  font-weight: bold;\n  transition: 0.3s; }\n\n.close:hover,\n.close:focus {\n  color: #bbb;\n  text-decoration: none;\n  cursor: pointer; }\n\n/* 100% Image Width on Smaller Screens */\n@media only screen and (max-width: 700px) {\n  .modal-content {\n    width: 100%; } }\n", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./register.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./register.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "form {\n  margin: 0px;\n  padding: 0px;\n  background-color: steelblue;\n  border-radius: 20px;\n  border: 10px solid steelblue;\n  box-shadow: 0px 0px 20px steelblue; }\n\n.form-group {\n  padding: 10px 20px;\n  border-radius: 10px;\n  background-color: lightsteelblue;\n  color: #063852;\n  box-shadow: 0px 0px 1px black; }\n\n.myLabel {\n  font-size: 25px;\n  font-weight: normal;\n  margin: 0px;\n  padding: 0px; }\n\n.myInput {\n  border: 1px solid black;\n  height: 40px;\n  border-radius: 5px;\n  color: #063852;\n  font-size: 25px; }\n\n.submitBtn {\n  background-color: darkorange;\n  border: 1px solid black;\n  color: #063852;\n  font-size: 25px; }\n\n/*#regUsername:focus {\n\theight: 50px;\n\tbox-shadow: 0px 0px 20px white;\n\n}\n*/\n", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./todo.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./todo.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".task-main-container {\n  display: flex;\n  flex-direction: column;\n  font-size: 22px;\n  color: #063852;\n  border-radius: 0px;\n  width: 60%;\n  margin: 0px auto; }\n\n/*ADD TASKS AREA*/\n.task-add-container {\n  display: flex;\n  flex-direction: column;\n  background-color: darkorange;\n  width: 100%;\n  margin-bottom: 50px;\n  padding: 0px;\n  border-radius: 10px; }\n\n.new-task-title {\n  display: flex;\n  margin: 10px auto 0px auto;\n  text-shadow: 0px 0px 1px black; }\n\n.input-and-btn {\n  display: flex;\n  width: 90%;\n  margin: 10px auto 15px auto; }\n\n.new-task-input {\n  flex: 10;\n  height: 50px;\n  box-shadow: 0px 0px 5px black; }\n\n.new-task-btn {\n  flex: 4;\n  height: 50px;\n  /*box-shadow: 0px 0px 5px black;*/ }\n\n/*TASK LIST AREA*/\n.tasks-wrapper {\n  display: flex;\n  flex-direction: column;\n  background-color: steelblue;\n  box-shadow: 0px 0px 20px steelblue;\n  border-radius: 10px; }\n\n.task-tasks-container {\n  display: flex;\n  width: 100%;\n  margin: auto;\n  margin-bottom: 10px;\n  background-color: lightsteelblue;\n  border-radius: 0px;\n  box-shadow: 0px 0px 2px black; }\n\n.tasks-head {\n  background-color: darkorange;\n  border-radius: 10px;\n  /*margin: 50px 25% 20px 25%;*/\n  margin: auto;\n  margin-bottom: 0px;\n  padding-top: 20px;\n  text-align: center;\n  width: 100%;\n  height: 70px;\n  font-size: 25px;\n  box-shadow: 0px 0px 2px darkorange;\n  text-shadow: 0px 0px 1px black; }\n\n.task-text {\n  flex: 10;\n  height: 50px;\n  margin: 0px 20px 10px 10px;\n  padding: 15px;\n  border-radius: 0px; }\n\n#editInput {\n  flex: 10;\n  width: 100%;\n  border: 1px solid black; }\n\n.task-btn {\n  flex: 3;\n  display: flex;\n  background-color: steelblue;\n  border-radius: 10px; }\n\n.task-btn button {\n  border-radius: 0px;\n  font-size: 15px;\n  border-radius: 0px; }\n\n/*DONE TASKS AREA*/\n.done-tasks-container {\n  display: flex;\n  flex-direction: column;\n  margin-top: 70px;\n  background-color: steelblue;\n  box-shadow: 0px 0px 20px steelblue;\n  border-radius: 10px; }\n\n.done-task {\n  width: 100%;\n  background-color: lightsteelblue;\n  border-radius: 0px;\n  height: 70px;\n  margin: auto;\n  margin-bottom: 10px;\n  padding: 20px;\n  box-shadow: 0px 0px 2px black; }\n\n.done-task-head {\n  background-color: darkorange;\n  border-radius: 10px;\n  /*margin: 50px 25% 20px 25%;*/\n  margin: auto;\n  margin-bottom: 0px;\n  padding-top: 20px;\n  text-align: center;\n  width: 100%;\n  height: 70px;\n  font-size: 25px;\n  box-shadow: 0px 0px 2px darkorange;\n  text-shadow: 0px 0px 1px black; }\n\n/*ERROR MSG*/\n#errorMsg {\n  text-align: center;\n  border-radius: 20px;\n  margin: 50px 0px; }\n", ""]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(15);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./layoutNav.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./layoutNav.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ":root {\n  --bck: #101F3C; }\n\nhtml {\n  height: 100%; }\n\nbody {\n  background-image: url(\"/img/emailBirds.jpg\");\n  background-size: 100vw 100vh;\n  background-attachment: fixed;\n  height: 100%;\n  color: #67BACA;\n  font-size: 25px;\n  letter-spacing: 2px;\n  font-family: 'Audiowide', cursive; }\n\n#headlineWrapper {\n  width: 100%;\n  height: 70px;\n  padding: 0px;\n  background-color: #0F1F38;\n  box-shadow: 0px 10px 40px var(--headBck);\n  position: fixed;\n  z-index: 1; }\n\n.contentWrapper {\n  position: relative;\n  top: 140px; }\n\n.jumboTitle {\n  display: none;\n  position: relative;\n  padding-top: 10px;\n  background-color: #0F1F38;\n  /*background-color: #143062;*/\n  font-size: 40px;\n  height: 70px; }\n\n.jumboMenu {\n  /*background-color: #143062;*/\n  display: none;\n  position: relative;\n  padding: 0px;\n  background-color: #0F1F38;\n  height: 70px; }\n\n.jumboTitleShow {\n  display: block;\n  animation: jumboTitleShow 2s forwards; }\n\n.jumboMenuShow {\n  display: block;\n  animation: jumboShow 2s forwards; }\n\n.jumboDivWrapper {\n  display: inline-block;\n  margin: 0px 0px;\n  padding: 0px;\n  width: 200px; }\n\n.jumboDiv {\n  position: relative;\n  display: inline-block;\n  margin: 20px 0px;\n  border-radius: 15px;\n  width: 150px;\n  height: 50px;\n  font-size: 30px;\n  background-color: #0F1F38; }\n\n.jumboDiv a {\n  position: relative;\n  color: #67BACA;\n  text-decoration: none; }\n\n.jumboDiv a:hover {\n  animation: jumboA 0.5s forwards; }\n\n#contentWrapper {\n  position: absolute;\n  margin: 50px 0px 0px 0px;\n  padding: 0px;\n  width: 100%;\n  height: 100%; }\n\n/*Animation dynamic classes*/\n.divSwitch {\n  animation: targetAnim 0.5s forwards; }\n\n.divSwitch2 {\n  animation: otherAnim 0.5s forwards; }\n\n@keyframes targetAnim {\n  0% { }\n  100% {\n    width: 200px;\n    font-size: 35px; } }\n\n@keyframes otherAnim {\n  0% { }\n  100% {\n    opacity: 0.5;\n    bottom: 5px; } }\n\n@keyframes jumboA {\n  0% { }\n  100% {\n    text-shadow: 0px 0px 20px #0F1F38;\n    letter-spacing: 5px; } }\n\n@keyframes jumboShow {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@keyframes jumboTitleShow {\n  0% {\n    opacity: 0;\n    letter-spacing: 0px; }\n  100% {\n    opacity: 1;\n    letter-spacing: 20px; } }\n\n@keyframes jumbotronAnim {\n  0% { }\n  100% {\n    height: 150px; } }\n", ""]);

// exports


/***/ })
/******/ ]);