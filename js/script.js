"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

//components
var popupTriggers = document.querySelectorAll(".has-popup");
var body = document.querySelector("body");
var lockPaddings = document.querySelectorAll(".lock-padding"); //все фиксированные объекты

var unlock = true;
var timeout = 200;

function bodyLock() {
  var lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px'; //задаю отступ для всех фиксированных объектов

  var _iterator = _createForOfIteratorHelper(lockPaddings),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var lockPadding = _step.value;
      lockPadding.style.paddingRight = lockPaddingValue;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  body.style.overflow = 'hidden';
  body.style.paddingRight = lockPaddingValue;
  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
} //убираю отступ при закрытии попапа


function bodyUnlock() {
  setTimeout(function () {
    var _iterator2 = _createForOfIteratorHelper(lockPaddings),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var lockPadding = _step2.value;
        lockPadding.style.paddingRight = '0px';
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    body.style.paddingRight = '0px';
    body.style.overflow = 'auto';
  }, timeout);
  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}

var _iterator3 = _createForOfIteratorHelper(popupTriggers),
    _step3;

try {
  var _loop = function _loop() {
    var popupTrigger = _step3.value;
    popupTrigger.addEventListener("click", function (evt) {
      evt.preventDefault();
      var popupName = popupTrigger.dataset.popup;
      var currentPopup = document.querySelector('.popup--' + popupName);

      if (currentPopup !== null && unlock) {
        popupOpen(currentPopup);
      }
    });
  };

  for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
    _loop();
  }
} catch (err) {
  _iterator3.e(err);
} finally {
  _iterator3.f();
}

function popupOpen(somePopup) {
  bodyLock();
  somePopup.classList.remove('popup--hidden');
  somePopup.classList.add('popup--visible');
  somePopup.addEventListener('click', function (e) {
    if (!e.target.closest('.popup__content')) {
      popupClose(e.target.closest('.popup'));
    }
  });
  var closeBtn = somePopup.querySelector('.popup__close');
  closeBtn.addEventListener('click', function () {
    popupClose(somePopup);
  });
}

function popupClose(activePopup) {
  if (unlock) {
    activePopup.classList.remove('popup--visible');
    activePopup.classList.add('popup--hidden');
    bodyUnlock();
  }
} //закрытие попапа нажатием esc


document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    var activePopup = document.querySelector('.popup--visible');
    popupClose(activePopup);
  }
}); //полифил для браузеров, не поддерживающих Element.closest(), но позволяющих использовать element.matches() (или префиксный эквивалент)

if (!Element.prototype.closest) {
  (function (ELEMENT) {
    ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;

    ELEMENT.closest = ELEMENT.closest || function closest(selector) {
      if (!this) return null;
      if (this.matches(selector)) return this;

      if (!this.parentElement) {
        return null;
      } else return this.parentElement.closest(selector);
    };
  })(Element.prototype);
}

var btnMenu = document.querySelector('.btn-menu');
var menu = document.querySelector('.header__menu');
btnMenu.addEventListener('click', function () {
  btnMenu.classList.toggle('btn-menu--close');
  menu.classList.toggle('header__menu--active');
});