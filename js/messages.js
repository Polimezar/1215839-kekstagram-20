'use strict';

(function () {

  var INTERVAL = 5000;
  var form = document.querySelector('.img-upload__form');
  var main = document.querySelector('main');
  var successMessage = document.querySelector('#success').content.querySelector('.success').cloneNode(true);
  var successButton = successMessage.querySelector('.success__button');
  var errorMessage = document.querySelector('#error').content.querySelector('.error').cloneNode(true);
  var errorButton = errorMessage.querySelector('.error__button');
  var messageTemplate = document.querySelector('#messages').content.querySelector('div');
  var loadMessage = messageTemplate.cloneNode(true);
  var currentMessage;

  // клик по произвольной области экрана при сообщении об успешной загрузке
  var onDocumentClick = function () {
    closeMessage();
  };

  // клик по ESC при сообщении об успешной загрузке
  var onDocumentKeydown = function (evt) {
    if (evt.key === 'Escape') {
      closeMessage();
    }
  };

  var closeMessage = function () {
    document.removeEventListener('keydown', onDocumentKeydown);
    document.removeEventListener('click', onDocumentClick);
    currentMessage.remove();
    form.reset();
    window.photoeditor.closeEditor();
  };

  var renderLoadMessage = function () {
    currentMessage = successMessage;
    main.appendChild(loadMessage);

    setTimeout(function () {
      loadMessage.remove();
    }, INTERVAL);
  };

  var renderSuccessMessage = function () {
    currentMessage = errorMessage;
    main.appendChild(successMessage);

    document.addEventListener('keydown', onDocumentKeydown);
    document.addEventListener('click', onDocumentClick);
  };

  // отрисовка сообщения об ошибке
  var renderErrorMessage = function () {
    main.appendChild(errorMessage);

    document.addEventListener('keydown', onDocumentKeydown);
    document.addEventListener('click', onDocumentClick);
  };

  successButton.addEventListener('click', function () {
    closeMessage();
  });

  errorButton.addEventListener('click', function () {
    closeMessage();
  });

  window.messages = {
    renderLoadMessage: renderLoadMessage,
    renderSuccessMessage: renderSuccessMessage,
    renderErrorMessage: renderErrorMessage,
  };
})();
