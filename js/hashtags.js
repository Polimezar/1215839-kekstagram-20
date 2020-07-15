'use strict';

(function () {
  var MAX_HASHTAG_LENGTH = 20;
  var MAX_HASHTAG_COUNTS = 5;
  var hashtagsInput = document.querySelector('.text__hashtags');

  hashtagsInput.addEventListener('input', function () {
    var hashtags = hashtagsInput.value.trim().toLowerCase().split(/\s{1,}/g);
    var arrayOfHashtagsCopy = hashtags.slice();
    if (hashtags.length > MAX_HASHTAG_COUNTS) {
      hashtagsInput.setCustomValidity('Максимальное количество хештегов 5шт!');
      return;
    }
    for (var i = 0; i < hashtags.length; i += 1) {
      var arrayOfHashtagsSplice = arrayOfHashtagsCopy.splice(0, 1);
      if (hashtags[i].length > MAX_HASHTAG_LENGTH) {
        hashtagsInput.setCustomValidity('Максимальная длина одного хэш-тега 20 символов, включая решётку');
        break;
      }
      if (!hashtags[i].match('^#[A-Za-z0-9]+$')) {
        hashtagsInput.setCustomValidity('Cтрока после решётки должна состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т. п.), символы пунктуации (тире, дефис, запятая и т. п.), эмодзи и т.д.');
        break;
      }
      if (arrayOfHashtagsCopy.includes(arrayOfHashtagsSplice[0])) {
        hashtagsInput.setCustomValidity('Хештеги не должны повторяться!');
        break;
      }
      hashtagsInput.setCustomValidity('');
    }
  });
})();
