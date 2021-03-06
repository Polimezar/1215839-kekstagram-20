'use strict';

// Функция с константами
(function () {
  var DEBOUNCE_INTERVAL = 500;

  // Добавляет элементу element класс visually-hidden
  var hideElement = function (element) {
    element.classList.add('visually-hidden');
  };

  // Удаляет у элемента element класс visually-hidden
  var showElement = function (element) {
    element.classList.remove('visually-hidden');
  };

  // Функция нахождения случайного целого числа
  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  // Функция создания массива уникальных чисел
  var getUniqueArray = function (min, max) {
    var myArray = [];

    for (var j = 0; myArray.length < max; j++) {
      var randomNumber = getRandomNumber(min, max);
      var found = false;
      for (var i = 0; i < myArray.length; i++) {
        if (myArray[i] === randomNumber) {
          found = true;
          break;
        }
      }
      if (!found) {
        myArray[myArray.length] = randomNumber;
      }
    }
    return myArray.slice(0, 10);
  };

  var debounce = function (cb) {
    var lastTimeout = null;
    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    };
  };

  // Функция очистки галереи
  var clearGallery = function (className, container) {
    var picturesToRemove = document.querySelectorAll(className);
    picturesToRemove.forEach(function (item) {
      container.removeChild(item);
    });
  };

  window.utils = {
    hideElement: hideElement,
    showElement: showElement,
    getUniqueArray: getUniqueArray,
    debounce: debounce,
    clearGallery: clearGallery
  };
})();
