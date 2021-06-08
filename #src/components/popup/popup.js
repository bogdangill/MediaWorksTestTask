const popupTriggers = document.querySelectorAll(".has-popup");
const body = document.querySelector("body");
const lockPaddings = document.querySelectorAll(".lock-padding"); //все фиксированные объекты

let unlock = true;
const timeout = 200;

function bodyLock() {
  const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

  //задаю отступ для всех фиксированных объектов
  for (let i = 0; i < lockPaddings.length; i++) {
    lockPaddings[i].style.paddingRight = lockPaddingValue;
  }

  body.style.overflow = 'hidden';
  body.style.paddingRight = lockPaddingValue;

  unlock = false;
  setTimeout(() => {
    unlock = true;
  }, timeout);
}

//убираю отступ при закрытии попапа
function bodyUnlock() {
  setTimeout(() => {
    for (let i = 0; i < lockPaddings.length; i++) {
      lockPaddings[i].style.paddingRight = '0px';
    }

    body.style.paddingRight = '0px';
    body.style.overflow = 'auto';
  }, timeout);

  unlock = false;
  setTimeout(function() {
    unlock = true;
  }, timeout);
}

for (let i = 0; i < popupTriggers.length; i++) {
  popupTriggers[i].addEventListener("click", (evt) => {
    evt.preventDefault();
    let popupName = popupTriggers[i].dataset.popup;
    let currentPopup = document.querySelector('.popup--'+popupName);
    if (currentPopup !== null && unlock) {
      popupOpen(currentPopup);
    }
  });
}

function popupOpen(somePopup) {
  bodyLock();
  somePopup.classList.remove('popup--hidden');
  somePopup.classList.add('popup--visible');
  
  somePopup.addEventListener('click', function(e) {
    if(!e.target.closest('.popup__content')) {
      popupClose(e.target.closest('.popup'));
    }
  })
  
  let closeBtn = somePopup.querySelector('.popup__close');
  closeBtn.addEventListener('click', () => {
    popupClose(somePopup);
  })
}

function popupClose(activePopup) {
  if (unlock) {
    activePopup.classList.remove('popup--visible');
    activePopup.classList.add('popup--hidden');
    bodyUnlock();
  }
}

//закрытие попапа нажатием esc
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const activePopup = document.querySelector('.popup--visible');
    popupClose(activePopup);
  }
})

//полифил для браузеров, не поддерживающих Element.closest(), но позволяющих использовать element.matches() (или префиксный эквивалент)
if (!Element.prototype.closest) {
  (function (ELEMENT) {
    ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
    ELEMENT.closest = ELEMENT.closest || function closest(selector) {
      if (!this) return null;
      if (this.matches(selector)) return this;
      if (!this.parentElement) {
        return null
      } else return this.parentElement.closest(selector)
    };
  }(Element.prototype));
} 