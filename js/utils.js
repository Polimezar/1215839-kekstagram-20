'use strict';

// Функция с константами
(function () {

  // Добавляет элементу element класс visually-hidden
  var hideElement = function (element) {
    element.classList.add('visually-hidden');
  };

  // Удаляет у элемента element класс visually-hidden
  var showElement = function (element) {
    element.classList.remove('visually-hidden');
  };

  window.utils = {
    hideElement: hideElement,
    showElement: showElement
  };
})();
