'use strict';

(function () {
  var effectLevelPin = document.querySelector('.effect-level__pin');
  var effectLevelValue = document.querySelector('.effect-level__value');
  var effectLevelLine = document.querySelector('.effect-level__line');
  var effectLevelDepth = document.querySelector('.effect-level__depth');
  var imgUploadPreview = document.querySelector('.img-upload__preview img');

  var effectsList = document.querySelector('.effects__list');
  var effectLevel = document.querySelector('.effect-level');
  var selectedEffect = null;

  // Снимает все эффекты с imgUploadPreview
  var removePictureEffects = function () {
    var effects = ['chrome', 'sepia', 'marvin', 'phobos', 'heat'];
    for (var i = 0; i < effects.length; i++) {
      var effectClass = 'effects__preview--' + effects[i];
      imgUploadPreview.classList.remove(effectClass);
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

  applyEffect();
})();
