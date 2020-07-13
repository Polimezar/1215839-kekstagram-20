'use strict';

(function () {
  var MAX_HASHTAG_LENGTH = 20;
  var MAX_HASHTAG_COUNTS = 5;

  var hashtagRegExp = /^(#[a-zA-Zа-яА-Я0-9]+ +){0,4}(#[a-zA-Zа-яА-Я0-9]+)?$/;
  var inputHashtags = document.querySelector('.text__hashtags');

  // Валидация хэштегов
  inputHashtags.addEventListener('input', function () {
    var textBlock = inputHashtags.value;
    var lotTextBlock = textBlock.split(/ +/g);
    var newlotTextBlock = lotTextBlock.filter(function (elem, pos) {
      return lotTextBlock.indexOf(elem) === pos;
    });
    var filterMassTextFill = (newlotTextBlock.length !== lotTextBlock.length);
    if (filterMassTextFill) {
      inputHashtags.setCustomValidity('Хештеги не должны повторяться!');
    } else if (newlotTextBlock.length > MAX_HASHTAG_COUNTS) {
      inputHashtags.setCustomValidity('Максимальное количество хештегов 5шт!');
    } else if (hashtagRegExp.test(inputHashtags.value)) {
      inputHashtags.setCustomValidity('');
    } else {
      inputHashtags.setCustomValidity('Неправильно набран хеш-тег! Пример: #beaty');
    }
    for (var i = 0; i < newlotTextBlock.length; i++) {
      if (newlotTextBlock[i].length > MAX_HASHTAG_LENGTH) {
        inputHashtags.setCustomValidity('Максимальное количество знаков, не должно превышать 20 включая знак #');
        break;
      }
    }
    if (!inputHashtags.validity.valid) {
      inputHashtags.style.outline = '2px solid red';
    } else {
      inputHashtags.style.outline = 'none';
    }
  });
})();
