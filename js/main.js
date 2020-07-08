'use strict';

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var USER_NAMES = ['Аделина', 'Елена', 'Дмитрий', 'Екатерина', 'Александр', 'Юлия', 'Владислав'];
var POSTS_COUNT = 25;
var MAX_SCALE_VALUE = 100;
var MIN_SCALE_VALUE = 25;
var SCALE_STEP = 25;
var MAX_HASHTAG_LENGTH = 20;
var MAX_HASHTAG_COUNTS = 5;

var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');
var picturesContainer = document.querySelector('.pictures');
var posts = [];
var bigPicture = document.querySelector('.big-picture');
var commentTemplate = document.querySelector('#comment')
  .content
  .querySelector('.social__comment');
var commentsContainer = document.querySelector('.social__comments');
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
var hashtagRegExp = /^(#[a-zA-Zа-яА-Я0-9]+ +){0,4}(#[a-zA-Zа-яА-Я0-9]+)?$/;
var inputHashtags = document.querySelector('.text__hashtags');
var body = document.querySelector('body');
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
var selectedEffect = 'none';
var bigPictureCancel = document.querySelector('.big-picture__cancel');
var textDescription = document.querySelector('.text__description');

// Функция подбора случайного числа
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Функция для создания комментария
var createComment = function () {
  return {
    avatar: 'img/avatar-' + getRandomNumber(1, 6) + '.svg',
    message: COMMENTS[getRandomNumber(0, COMMENTS.length - 1)],
    name: USER_NAMES[getRandomNumber(0, USER_NAMES.length - 1)]
  };
};

// Функция для создание нескольких комментариев
var createComments = function () {
  var commentsArray = [];
  for (var i = 0; i <= getRandomNumber(1, 5); i++) {
    commentsArray.push(createComment());
  }
  return commentsArray;
};

// Функция для создания поста
var createPost = function (index) {
  return {
    url: 'photos/' + (index + 1) + '.jpg',
    description: 'И пусть весь мир подождет',
    likes: getRandomNumber(15, 200),
    comments: createComments(),
  };
};

// Функция для создания  25 постов
var createPosts = function () {
  posts = [];
  for (var i = 0; i < POSTS_COUNT; i++) {
    posts.push(createPost(i));
  }
};

// Создание DOM элементов
var createPostElement = function (post) {
  var clonedPost = pictureTemplate.cloneNode(true);
  clonedPost.querySelector('.picture__img').src = post.url;
  clonedPost.querySelector('.picture__likes').textContent = post.likes;
  clonedPost.querySelector('.picture__comments').textContent = post.comments.length;
  clonedPost.addEventListener('click', function () {
    showBigPicture(post);
  });
  return clonedPost;
};

// Отрисовка DOM элемента на странице
var createPostElements = function () {
  var fragment = document.createDocumentFragment();
  for (var j = 0; j < POSTS_COUNT; j++) {
    fragment.appendChild(createPostElement(posts[j]));
  }
  picturesContainer.appendChild(fragment);
};

// 3 раздел 2 часть -----------------------------
// Заполнение bigPicture информацией из первого элемента массива
var showBigPicture = function (post) {
  setupBigPicture(post);
  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onEscapePress);
};

// Функция удаляет комментарии по умолчанию из разметки
var clearComments = function () {
  while (commentsContainer.firstChild) {
    commentsContainer.removeChild(commentsContainer.firstChild);
  }
};

var createCommentElement = function (comment) {
  var commentElement = commentTemplate.cloneNode(true);
  commentElement.querySelector('img').src = comment.avatar;
  commentElement.querySelector('img').alt = comment.name;
  commentElement.querySelector('.social__text').textContent = comment.message;
  return commentElement;
};

// Функция для вставки сгенерированных комментариев в DOM
var createCommentElements = function (comments) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < comments.length; i++) {
    fragment.appendChild(createCommentElement(comments[i]));
  }
  clearComments(); // Подчищаем комменты с разметки
  commentsContainer.appendChild(fragment); // Вставляем сгенерированные на страницу
};

var setupBigPicture = function (post) {
  bigPicture.querySelector('.big-picture__img img').src = post.url;
  bigPicture.querySelector('.likes-count').textContent = post.likes;
  bigPicture.querySelector('.comments-count').textContent = post.comments.length;
  bigPicture.querySelector('.social__caption').textContent = post.description;
  createCommentElements(post.comments);
};

// Прячем блоки счётчика комментариев и загрузки новых комментариев
var hideCommentCounter = function () {
  document.querySelector('.social__comment-count').classList.add('hidden');
};

var hideCommentLoader = function () {
  document.querySelector('.comments-loader').classList.add('hidden');
};

// 4 раздел ----------------------------
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
  hideElement(slider);
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

// Добавляет элементу element класс visually-hidden
var hideElement = function (element) {
  element.classList.add('visually-hidden');
};

// Удаляет у элемента element класс visually-hidden
var showElement = function (element) {
  element.classList.remove('visually-hidden');
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
  hideElement(effectLevel);
  effectsList.addEventListener('click', function (evt) {
    if (evt.target.matches('input[type="radio"]')) {
      removePictureEffects();
      imgUploadPreview.style.filter = null;
      selectedEffect = evt.target.value;
      effectLevelValue.value = 100;
      if (selectedEffect !== 'none') {
        showElement(effectLevel);
        imgUploadPreview.classList.add('effects__preview--' + selectedEffect);
      } else {
        hideElement(effectLevel);
      }
    }
  });
};

// Закрытие фото по esc
var onEscapePress = function (evt) {
  if (evt.key === 'Escape') {
    closeBigPicture();
  }
};

// Закрытие большого фото
var closeBigPicture = function () {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onEscapePress);
};

// Открытие формы редактирования изображения
uploadFile.addEventListener('change', function () {
  openEditor();
});

// Закрытие формы редактирования изображения
uploadCancel.addEventListener('click', function () {
  closeEditor();
  resetScale();
});

// Обработчик уменьшения фото
decreaseScaleButton.addEventListener('click', function () {
  decreaseScale();
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

// Валидация хэштегов
inputHashtags.addEventListener('input', function () {
  var textBlock = inputHashtags.value;
  var lotTextBlock = textBlock.split(/ +/g);
  var newlotTextBlock = lotTextBlock.filter(function (elem, pos) {
    return lotTextBlock.indexOf(elem) === pos;
  });
  var filterMassTextFill = (newlotTextBlock.length !== lotTextBlock.length);
  if (filterMassTextFill) {
    inputHashtags.setCustomValidity('Хештеги не должны повторяться!');
  } else if (newlotTextBlock.length > MAX_HASHTAG_COUNTS) {
    inputHashtags.setCustomValidity('Максимальное количество хештегов 5шт!');
  } else if (hashtagRegExp.test(inputHashtags.value)) {
    inputHashtags.setCustomValidity('');
  } else {
    inputHashtags.setCustomValidity('Неправильно набран хеш-тег! Пример: #beaty');
  }
  for (var i = 0; i < newlotTextBlock.length; i++) {
    if (newlotTextBlock[i].length > MAX_HASHTAG_LENGTH) {
      inputHashtags.setCustomValidity('Максимальное количество знаков, не должно превышать 20 включая знак #');
      break;
    }
  }
  if (!inputHashtags.validity.valid) {
    inputHashtags.style.outline = '2px solid red';
  } else {
    inputHashtags.style.outline = 'none';
  }
});

inputHashtags.addEventListener('focus', function () {
  document.removeEventListener('keydown', onEditorCloseEsc);
});

textDescription.addEventListener('input', function () {
  document.removeEventListener('keydown', onEditorCloseEsc);
});

bigPictureCancel.addEventListener('click', function () {
  closeBigPicture();
});

bigPictureCancel.addEventListener('keydown', function () {
  onEscapePress();
});

createPosts();
createPostElements();
hideCommentCounter();
hideCommentLoader();
resetScale();
applyEffect();
