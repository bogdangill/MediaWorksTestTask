"use strict";

//components
var popupTriggers = document.querySelectorAll(".has-popup");
var body = document.querySelector("body");
var lockPaddings = document.querySelectorAll(".lock-padding"); //все фиксированные объекты

var unlock = true;
var timeout = 200;

function bodyLock() {
  var lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px'; //задаю отступ для всех фиксированных объектов

  for (var i = 0; i < lockPaddings.length; i++) {
    lockPaddings[i].style.paddingRight = lockPaddingValue;
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
    for (var i = 0; i < lockPaddings.length; i++) {
      lockPaddings[i].style.paddingRight = '0px';
    }

    body.style.paddingRight = '0px';
    body.style.overflow = 'auto';
  }, timeout);
  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}

var _loop = function _loop(i) {
  popupTriggers[i].addEventListener("click", function (evt) {
    evt.preventDefault();
    var popupName = popupTriggers[i].dataset.popup;
    var currentPopup = document.querySelector('.popup--' + popupName);

    if (currentPopup !== null && unlock) {
      popupOpen(currentPopup);
    }
  });
};

for (var i = 0; i < popupTriggers.length; i++) {
  _loop(i);
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