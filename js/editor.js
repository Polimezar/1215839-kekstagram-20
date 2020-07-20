'use strict';

(function () {
  var MAX_SCALE_VALUE = 100;
  var MIN_SCALE_VALUE = 25;
  var SCALE_STEP = 25;

  var uploadCancel = document.querySelector('#upload-cancel');
  var uploadFile = document.querySelector('#upload-file');
  var imgUploadPreview = document.querySelector('.img-upload__preview img');
  var decreaseScaleButton = document.querySelector('.scale__control--smaller');
  var increaseScaleButton = document.querySelector('.scale__control--bigger');
  var scaleControlValue = document.querySelector('.scale__control--value');
  var effectsList = document.querySelector('.effects__list');
  var effectLevel = document.querySelector('.effect-level');
  var effectLevelPin = document.querySelector('.effect-level__pin');
  var effectLevelValue = document.querySelector('.effect-level__value');
  var effectLevelLine = document.querySelector('.effect-level__line');
  var effectLevelDepth = document.querySelector('.effect-level__depth');
  var body = document.querySelector('body');
  var imgUploadOverlay = document.querySelector('.img-upload__overlay');
  var selectedEffect = null;
  var textDescription = document.querySelector('.text__description');
  var form = document.querySelector('.img-upload__form');

  // Открывает форму редактирования картинки
  var openEditor = function () {
    body.classList.add('modal-open');
    imgUploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onEditorKeydown);
    resetScale();
  };

  // Закрывает форму редактирования картинки
  var closeEditor = function () {
    body.classList.remove('modal-open');
    imgUploadOverlay.classList.add('hidden');
    imgUploadPreview.className = '';
    imgUploadPreview.style.transform = '';
    document.removeEventListener('keydown', onEditorKeydown);
    window.utils.hideElement(effectLevel);
    imgUploadPreview.style.filter = null;
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
    imgUploadPreview.style.transform = 'scale(' + (value * 0.01) + ')';
  };

  // размер фотографии по умолчанию
  var resetScale = function () {
    scaleControlValue.value = '100%';
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

  // Снимает все эффекты с imgUploadPreview
  var removePictureEffects = function () {
    var effects = ['chrome', 'sepia', 'marvin', 'phobos', 'heat'];
    for (var i = 0; i < effects.length; i++) {
      var effectClass = 'effects__preview--' + effects[i];
      imgUploadPreview.classList.remove(effectClass);
    }
  };

  var setFilterValue = function (filterName, percent) {
    switch (filterName) {
      case 'none':
        imgUploadPreview.style.filter = '';
        break;
      case 'chrome':
        imgUploadPreview.style.filter = 'grayscale(' + percent / 100 + ')';
        break;
      case 'sepia':
        imgUploadPreview.style.filter = 'sepia(' + percent / 100 + ')';
        break;
      case 'marvin':
        imgUploadPreview.style.filter = 'invert(' + percent + '%)';
        break;
      case 'phobos':
        imgUploadPreview.style.filter = 'blur(' + (percent * 3 / 100) + 'px)';
        break;
      case 'heat':
        imgUploadPreview.style.filter = 'brightness(' + percent * 3 / 100 + ')';
        break;
    }
  };

  // Управление эфеектами
  var applyEffect = function () {
    window.utils.hideElement(effectLevel);
    effectsList.addEventListener('click', function (evt) {
      if (evt.target.matches('input[type="radio"]')) {
        removePictureEffects();
        imgUploadPreview.style.filter = null;
        selectedEffect = evt.target.value;
        effectLevelValue.value = 100;
        if (selectedEffect !== 'none') {
          window.utils.showElement(effectLevel);
          imgUploadPreview.classList.add('effects__preview--' + selectedEffect);
        } else {
          window.utils.hideElement(effectLevel);
        }
      }
    });
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

  var getLevelPin = function () {
    var positionX = effectLevelPin.offsetLeft;
    var lineWidth = effectLevelLine.offsetWidth;
    var percent = Math.round(100 * positionX / lineWidth);
    return percent;
  };

  var changeFilterValue = function () {
    var current = document.querySelector('.effects__radio:checked');
    var percent = getLevelPin();
    effectLevelValue.value = percent;
    setFilterValue(current.value, percent);
  };

  // Открытие формы редактирования изображения
  uploadFile.addEventListener('change', function () {
    openEditor();
  });

  // Закрытие формы редактирования изображения
  uploadCancel.addEventListener('click', function () {
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

  textDescription.addEventListener('keydown', function (evt) {
    evt.stopPropagation();
  });

  effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var lineWidth = effectLevelLine.offsetWidth;
    var startCoords = {
      x: evt.clientX
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startCoords.x - moveEvt.clientX
      };
      startCoords = {
        x: moveEvt.clientX
      };
      if (effectLevelPin.offsetLeft < 0) {
        effectLevelPin.style.left = 0 + 'px';
        effectLevelDepth.style.width = 0 + 'px';
      } else if (effectLevelPin.offsetLeft > lineWidth) {
        effectLevelPin.style.left = lineWidth + 'px';
        effectLevelDepth.style.width = lineWidth + 'px';
      } else {
        effectLevelPin.style.left = (effectLevelPin.offsetLeft - shift.x) + 'px';
        effectLevelDepth.style.width = (effectLevelPin.offsetLeft - shift.x) + 'px';
      }
      changeFilterValue();
    };

    // при отпускании мыши перестаем слушать события движения мыши и отпускания ее кнопки
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    // слушаем событие передвижения мыши
    document.addEventListener('mousemove', onMouseMove);
    // отпускания кнопки мыши
    document.addEventListener('mouseup', onMouseUp);
  });

  form.addEventListener('submit', onFormSubmit);

  resetScale();
  applyEffect();

  window.editor = {
    close: closeEditor
  };
})();
