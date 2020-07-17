'use strict';

(function () {
  var DOWN_URL = 'https://javascript.pages.academy/kekstagram/data';
  var UP_URL = 'https://javascript.pages.academy/kekstagram';
  var StatusCode = {
    OK: 200
  };
  var TIMEOUT = 10000;

  var createXHR = function (url, method, onSuccess, onError, data) {
    data = data || null;
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;
    xhr.open(method, url);
    xhr.send(data);
  };

  window.load = {
    download: function (onSuccess, onError) {
      createXHR(DOWN_URL, 'GET', onSuccess, onError);
    },
    upload: function (data, onSuccess, onError) {
      createXHR(UP_URL, 'POST', onSuccess, onError, data);
    }
  };
})();
