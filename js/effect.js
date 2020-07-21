'use strict';

(function () {
  var DEFAULT_EFFECT = 'none';
  var DEFAULT_EFFECT_LEVEL = 100;

  var effectLevelPin = document.querySelector('.effect-level__pin');
  var effectLevelValue = document.querySelector('.effect-level__value');
  var effectLevelLine = document.querySelector('.effect-level__line');
  var effectLevelDepth = document.querySelector('.effect-level__depth');
  var imagePreview = document.querySelector('.img-upload__preview img');
  var effectsList = document.querySelector('.effects__list');
  var effectLevelSlider = document.querySelector('.effect-level');
  var selectedEffect = DEFAULT_EFFECT;

  // Снимает все эффекты с imagePreview
  var removePictureEffects = function () {
    if (selectedEffect !== DEFAULT_EFFECT) {
      imagePreview.classList.remove('effects__preview--' + selectedEffect);
    }
  };

  // Управление эфеектами
  effectsList.addEventListener('click', function (evt) {
    if (evt.target.matches('input[type="radio"]')) {
      removePictureEffects();
      imagePreview.style.filter = null;
      selectedEffect = evt.target.value;
      effectLevelValue.value = DEFAULT_EFFECT_LEVEL;
      effectLevelPin.style.left = 100 + '%';
      effectLevelDepth.style.width = 100 + '%';
      if (selectedEffect !== DEFAULT_EFFECT) {
        setFilterValue();
        window.utils.showElement(effectLevelSlider);
        imagePreview.classList.add('effects__preview--' + selectedEffect);
      } else {
        window.utils.hideElement(effectLevelSlider);
      }
    }
  });

  var setFilterValue = function (filterName, percent) {
    switch (filterName) {
      case DEFAULT_EFFECT:
        imagePreview.style.filter = '';
        break;
      case 'chrome':
        imagePreview.style.filter = 'grayscale(' + percent / 100 + ')';
        break;
      case 'sepia':
        imagePreview.style.filter = 'sepia(' + percent / 100 + ')';
        break;
      case 'marvin':
        imagePreview.style.filter = 'invert(' + percent + '%)';
        break;
      case 'phobos':
        imagePreview.style.filter = 'blur(' + (percent * 3 / 100) + 'px)';
        break;
      case 'heat':
        imagePreview.style.filter = 'brightness(' + (percent * 2 / 100 + 1) + ')';
        break;
    }
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
    effectLevelValue.value = DEFAULT_EFFECT_LEVEL;
    setFilterValue(current.value, percent);
  };

  effectLevelPin.addEventListener('mousedown', function (evt) {
    var lineWidth = effectLevelLine.offsetWidth;
    var startCoords = {
      x: evt.clientX
    };

    var onMouseMove = function (moveEvt) {
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
    var onMouseUp = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    // слушаем событие передвижения мыши
    document.addEventListener('mousemove', onMouseMove);
    // отпускания кнопки мыши
    document.addEventListener('mouseup', onMouseUp);
  });
})();
