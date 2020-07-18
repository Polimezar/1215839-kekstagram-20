'use strict';

(function () {
  var GET_URL = 'https://javascript.pages.academy/kekstagram/data';
  var POST_URL = 'https://javascript.pages.academy/kekstagram';
  var TIMEOUT = 10000;
  var StatusCode = {
    OK: 200
  };

  var executeRequest = function (url, method, onSuccess, onError, data) {
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
    if (data) {
      xhr.send(data);
    } else {
      xhr.send();
    }
  };

  var download = function (onSuccess, onError) {
    executeRequest(GET_URL, 'GET', onSuccess, onError);
  };

  var upload = function (data, onSuccess, onError) {
    executeRequest(POST_URL, 'POST', onSuccess, onError, data);
  };

  window.backend = {
    download: download,
    upload: upload
  };
})();
