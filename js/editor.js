'use strict';

(function () {
  var MAX_SCALE_VALUE = 100;
  var MIN_SCALE_VALUE = 25;
  var SCALE_STEP = 25;
  var DEFAULT_SCALE = 100;

  var closeButton = document.querySelector('#upload-cancel');
  var uploadFile = document.querySelector('#upload-file');
  var imagePreview = document.querySelector('.img-upload__preview img');
  var decreaseScaleButton = document.querySelector('.scale__control--smaller');
  var increaseScaleButton = document.querySelector('.scale__control--bigger');
  var scaleControlValue = document.querySelector('.scale__control--value');
  var effectLevelSlider = document.querySelector('.effect-level');
  var body = document.querySelector('body');
  var imagePreviewOverlay = document.querySelector('.img-upload__overlay');
  var commentInput = document.querySelector('.text__description');
  var form = document.querySelector('.img-upload__form');

  // Открывает форму редактирования картинки
  var openEditor = function () {
    body.classList.add('modal-open');
    imagePreviewOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onEditorKeydown);
    resetScale();
  };

  // Закрывает форму редактирования картинки
  var closeEditor = function () {
    body.classList.remove('modal-open');
    imagePreviewOverlay.classList.add('hidden');
    document.removeEventListener('keydown', onEditorKeydown);
    resetEditor();
    form.reset();
  };

  var resetEditor = function () {
    imagePreview.className = '';
    window.utils.hideElement(effectLevelSlider);
    imagePreview.style.filter = 'none';
    resetScale();
  };

  // Закрытие формы через клавишу ESC
  var onEditorKeydown = function (evt) {
    if (evt.key === 'Escape') {
      closeEditor();
    }
  };

  // Преобразует число в css свойство scale
  var scalePicture = function (value) {
    scaleControlValue.value = value + '%';
    imagePreview.style.transform = 'scale(' + (value * 0.01) + ')';
  };

  // размер фотографии по умолчанию
  var resetScale = function () {
    scaleControlValue.value = '100%';
    imagePreview.style.transform = '';
    scalePicture(DEFAULT_SCALE);
    window.utils.hideElement(effectLevelSlider);
  };

  // Изменение масштаба картинки нажатием -
  var decreaseScale = function () {
    var scaleValue = parseInt(scaleControlValue.value, 10);
    scaleValue -= SCALE_STEP;
    if (scaleValue < MIN_SCALE_VALUE) {
      scaleValue = MIN_SCALE_VALUE;
    }
    scalePicture(scaleValue);
  };

  // Изменение масштаба картинки нажатием +
  var increaseScale = function () {
    var scaleValue = parseInt(scaleControlValue.value, 10);
    scaleValue += SCALE_STEP;
    if (scaleValue > MAX_SCALE_VALUE) {
      scaleValue = MAX_SCALE_VALUE;
    }
    scalePicture(scaleValue);
  };

  // Функция отправки AJAX-запроса
  var onFormSubmit = function (evt) {
    evt.preventDefault();
    var onSuccess = function () {
      closeEditor();
      window.messages.showSuccessMessage();
    };

    var onError = function () {
      closeEditor();
      window.messages.showErrorMessage();
    };

    var formNew = new FormData(form);
    window.backend.upload(formNew, onSuccess, onError);
    window.messages.showLoadMessage();
  };

  // Открытие формы редактирования изображения
  uploadFile.addEventListener('change', function () {
    openEditor();
  });

  // Закрытие формы редактирования изображения
  closeButton.addEventListener('click', function () {
    closeEditor();
  });

  // Обработчик уменьшения фото
  decreaseScaleButton.addEventListener('click', function () {
    decreaseScale();
  });

  // Обработчик увеличения фото
  increaseScaleButton.addEventListener('click', function () {
    increaseScale();
  });

  commentInput.addEventListener('keydown', function (evt) {
    if (commentInput === document.activeElement) {
      evt.stopPropagation();
    }
  });

  form.addEventListener('submit', onFormSubmit);

  resetScale();

  window.editor = {
    close: closeEditor
  };
})();
