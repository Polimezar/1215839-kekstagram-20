'use strict';

(function () {
  var MAX_HASHTAG_COUNT = 5;
  var HASHTAG_PATTERN = /^#[a-zA-ZА-Яа-я0-9]{1,19}$/;
  var hashtagsInput = document.querySelector('.text__hashtags');

  hashtagsInput.addEventListener('input', function () {
    var hashtags = hashtagsInput.value.trim().toLowerCase().split(/\s{1,}/g);
    var uniqueHashtags = [];
    if (hashtags.length > MAX_HASHTAG_COUNT) {
      hashtagsInput.setCustomValidity('Максимальное количество хештегов 5шт!');
      return;
    }
    for (var i = 0; i < hashtags.length; i += 1) {
      if (!hashtags[i].match(HASHTAG_PATTERN)) {
        hashtagsInput.setCustomValidity('Хештег должен начинаться с решетки (#)\n' +
          'Cтрока после решётки должна состоять только из букв и чисел и не может содержать пробелы.\n' +
          'Длина хештега не должна превышать 20 символов.'
        );
        return;
      }
      if (!uniqueHashtags.includes(hashtags[i])) {
        uniqueHashtags.push(hashtags[i]);
      } else {
        hashtagsInput.setCustomValidity('Хештеги не должны повторяться!');
        return;
      }
    }
    hashtagsInput.setCustomValidity('');
  });

  hashtagsInput.addEventListener('keydown', function (evt) {
    if (hashtagsInput === document.activeElement) {
      evt.stopPropagation();
    }
  });
})();
