'use strict';

(function () {
  var MAX_SCALE_VALUE = 100;
  var MIN_SCALE_VALUE = 25;
  var SCALE_STEP = 25;

  var uploadCancel = document.querySelector('#upload-cancel');
  var uploadFile = document.querySelector('#upload-file');
  var imgUploadPreview = document.querySelector('.img-upload__preview');
  var decreaseScaleButton = document.querySelector('.scale__control--smaller');
  var increaseScaleButton = document.querySelector('.scale__control--bigger');
  var scaleControlValue = document.querySelector('.scale__control--value');
  var effectsList = document.querySelector('.effects__list');
  var effectLevel = document.querySelector('.effect-level');
  var effectLevelPin = document.querySelector('.effect-level__pin');
  var effectLevelValue = document.querySelector('.effect-level__value');
  var slider = document.querySelector('.img-upload__effect-level');
  var effectLevelLine = document.querySelector('.effect-level__line');
  var effectLevelDepth = document.querySelector('.effect-level__depth');
  var body = document.querySelector('body');
  var imgUploadOverlay = document.querySelector('.img-upload__overlay');
  var selectedEffect = 'none';
  var bigPictureCancel = document.querySelector('.big-picture__cancel');
  var textDescription = document.querySelector('.text__description');
  var inputHashtags = document.querySelector('.text__hashtags');

  // Открывает форму редактирования картинки
  var openEditor = function () {
    body.classList.add('modal-open');
    imgUploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onEditorCloseEsc);
    resetScale();
  };

  // Закрывает форму редактирования картинки
  var closeEditor = function () {
    body.classList.remove('modal-open');
    imgUploadOverlay.classList.add('hidden');
    imgUploadPreview.className = '';
    imgUploadPreview.style.transform = '';
    document.removeEventListener('keydown', onEditorCloseEsc);
    window.utils.hideElement(slider);
  };

  // Закрытие формы через клавишу ESC
  var onEditorCloseEsc = function (evt) {
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
    scaleControlValue.value = ('value', '100%');
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

  // Конвертирует проценты в css свойство выбранного эффекта
  var convertPercents = function (percentValue, effectName) {
    var effectValue = 0;
    if (effectName === 'chrome') {
      effectValue = percentValue / 100;
      return 'grayscale(' + effectValue + ')';
    } else if (effectName === 'sepia') {
      effectValue = percentValue / 100;
      return 'sepia(' + effectValue + ')';
    } else if (effectName === 'marvin') {
      effectValue = percentValue + '%';
      return 'invert(' + effectValue + ')';
    } else if (effectName === 'phobos') {
      effectValue = percentValue * 3 / 100;
      effectValue += 'px';
      return 'blur(' + effectValue + ')';
    } else if (effectName === 'heat') {
      effectValue = percentValue * 2 / 100 + 1;
      return 'brightness(' + effectValue + ')';
    }
    return 'none';
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

  // Открытие формы редактирования изображения
  uploadFile.addEventListener('change', function () {
    openEditor();
  });

  // Закрытие формы редактирования изображения
  uploadCancel.addEventListener('click', function () {
    closeEditor();
    resetScale();
    imgUploadPreview.style.filter = null;
  });

  // Обработчик уменьшения фото
  decreaseScaleButton.addEventListener('click', function () {
    decreaseScale();
  });

  inputHashtags.addEventListener('focus', function () {
    document.removeEventListener('keydown', onEditorCloseEsc);
  });

  // Обработчик увеличения фото
  increaseScaleButton.addEventListener('click', function () {
    increaseScale();
  });

  effectLevelPin.addEventListener('mouseup', function () {
    var effectLevelProportion = (effectLevelPin.offsetLeft + (effectLevelPin.offsetWidth / 2));
    var saturation = Math.floor(effectLevelProportion / effectLevelPin.offsetParent.offsetWidth * 100);
    effectLevelValue.value = saturation;
    imgUploadPreview.style.filter = convertPercents(saturation, selectedEffect);
  });

  textDescription.addEventListener('input', function () {
    document.removeEventListener('keydown', onEditorCloseEsc);
  });

  bigPictureCancel.addEventListener('click', function () {
    window.preview.closeBigPicture();
  });

  bigPictureCancel.addEventListener('keydown', function () {
    window.preview.onEscapePress();
  });

  effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    // запоминаем координаты точки, с которой начали перемещать мышь
    var startX = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      // обновляем смещение относительно первоначальной точки
      var shift = startX - moveEvt.clientX;
      var effectLevelLineLeft = effectLevelLine.getBoundingClientRect().left;
      var effectLevelPinLeft = (startX - shift - effectLevelLineLeft) / effectLevel.offsetWidth * 100;
      effectLevelPinLeft = Math.round(effectLevelPinLeft);
      if (effectLevelPinLeft < 0 || effectLevelPinLeft > 100) {
        return;
      }
      effectLevelPin.style.left = effectLevelPinLeft + '%';
      effectLevelDepth.style.width = effectLevelPinLeft + '%';

      convertPercents();
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

  resetScale();
  applyEffect();
})();
