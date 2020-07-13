'use strict';

// Функция с константами
(function () {

  // Функция подбора случайного числа
  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Добавляет элементу element класс visually-hidden
  var hideElement = function (element) {
    element.classList.add('visually-hidden');
  };

  // Удаляет у элемента element класс visually-hidden
  var showElement = function (element) {
    element.classList.remove('visually-hidden');
  };

  window.utils = {
    getRandomNumber: getRandomNumber,
    hideElement: hideElement,
    showElement: showElement
  };
})();
