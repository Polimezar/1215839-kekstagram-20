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
var editImageForm = document.querySelector('.img-upload__overlay');
var body = document.querySelector('body');
var uploadCancel = document.querySelector('#upload-cancel');
var uploadFile = document.querySelector('#upload-file');
var imgUploadPreview = document.querySelector('.img-upload__preview');
var scaleControlSmaller = document.querySelector('.scale__control--smaller');
var scaleControlBigger = document.querySelector('.scale__control--bigger');
var scaleControlValue = document.querySelector('.scale__control--value');
var effectsList = document.querySelector('.effects__list');
var effectLevel = document.querySelector('.effect-level');
var effectLevelPin = document.querySelector('.effect-level__pin');
var effectLevelValue = document.querySelector('.effect-level__value');
var HASHTAG_ERROR_MESSAGE = 'Хештег может состоять из решётки, букв и цифр. Один хештег не может содержать более 20 символов. Можно использовать не более пяти хештегов для одной фотографии';
var hashtagRegExp = /^#[a-zA-ZА-Яа-я0-9]*$/;
var inputHashtags = document.querySelector('.text__hashtags');
var maxHashtagLength = 20;
var maxHashtagCounts = 5;

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
  clonedPost.querySelector('.picture__likes') .textContent = post.likes;
  clonedPost.querySelector('.picture__comments') .innerHTML = post.comments.length;
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
var showBigPicture = function () {
  bigPicture.classList.remove('hidden');
  document.querySelector('body').classList.add('modal-open');
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
  bigPicture.querySelector('.big-picture__img').src = post.url;
  bigPicture.querySelector('.likes-count').textContent = post.likes;
  bigPicture.querySelector('.comments-count') .textContent = post.comments.length;
  bigPicture.querySelector('.social__caption') .textContent = post.description;
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

// Добавляет или удаляет body класс modal-open
var toggleBodyClass = function (action) { // action = {add, remove}
  if (action === 'add') {
    if (!body.classList.contains('modal-open')) {
      body.classList.add('modal-open');
    }
  } else {
    body.classList.remove('modal-open');
  }
};

// Закрытие формы через клавишу ESC
var closeByKeyEsc = function (evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeEditImageForm();
  }
};

// Открывает форму редактирования картинки
var openEditImageForm = function () {
  editImageForm.classList.remove('hidden');
  toggleBodyClass('add');
  document.addEventListener('keydown', closeByKeyEsc);
};

// Закрывает форму редактирования картинки
var closeEditImageForm = function () {
  editImageForm.classList.add('hidden');
  toggleBodyClass('remove');
  document.addEventListener('keydown', closeByKeyEsc);
  uploadFile.value = '';
};

// Преобразует число в css свойство scale
var intToScale = function (intValue) {
  if (intValue > 100) {
    intValue = 100;
  }

  if (intValue < 0) {
    intValue = 0;
  }

  if (intValue !== 100) {
    return 'scale(0.' + intValue + ')';
  } else {
    return 'scale(1)';
  }
};

// Изменение масштаба картинки нажатием +/-
var changePictureScale = function () {
  scaleControlValue.value = '100%';
  scaleControlSmaller.addEventListener('click', function () {
    var integerValue = parseInt(scaleControlValue.value, 10);
    if (integerValue > 25) {
      integerValue -= 25;
      scaleControlValue.value = integerValue + '%';
      imgUploadPreview.style.transform = intToScale(integerValue);
    }
  });

  scaleControlBigger.addEventListener('click', function () {
    var integerValue = parseInt(scaleControlValue.value, 10);
    if (integerValue < 100) {
      integerValue += 25;
      scaleControlValue.value = integerValue + '%';
      imgUploadPreview.style.transform = intToScale(integerValue);
    }
  });
};

// Добавляет элементу element класс visually-hidden
var hideElement = function (element) {
  if (!element.classList.contains('visually-hidden')) {
    element.classList.add('visually-hidden');
  }
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
  }

  if (effectName === 'sepia') {
    effectValue = percentValue / 100;

    return 'sepia(' + effectValue + ')';
  }

  if (effectName === 'marvin') {
    if (percentValue > 0) {
      effectValue = percentValue + '%';
    } else {
      effectValue = percentValue;
    }

    return 'invert(' + effectValue + ')';
  }

  if (effectName === 'phobos') {
    effectValue = percentValue * 3 / 100;
    effectValue += 'px';

    return 'blur(' + effectValue + ')';
  }

  if (effectName === 'heat') {
    effectValue = percentValue * 2 / 100 + 1;

    return 'brightness(' + effectValue + ')';
  }

  return 'none';
};

// Управление эфеектами
var applyingAnEffect = function () {
  hideElement(effectLevel);
  var selectedEffect = 'none';
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
  effectLevelPin.addEventListener('mouseup', function (evt) {
    var lineWidth = 453;
    var pinX = evt.target.offsetLeft;
    var saturation = Math.round(pinX / lineWidth * 100);
    effectLevelValue.value = saturation;
    imgUploadPreview.style.filter = convertPercents(saturation, selectedEffect);
  });
};

// Валидация хэштегов
var validateHashtag = function () {
  inputHashtags.addEventListener('keyup', function () {
    var hashtags = inputHashtags.value.split(' ');
    var isHashtagCountsMore = hashtags.length > maxHashtagCounts;
    for (var i = 0; i < hashtags.length; i++) {
      var isHashtagValidity = hashtagRegExp.test(hashtags[i]);
      var isHashtagTooLong = hashtags[i].length > maxHashtagLength;
      if (!isHashtagValidity || isHashtagTooLong || isHashtagCountsMore) {
        inputHashtags.setCustomValidity(HASHTAG_ERROR_MESSAGE);
      } else {
        inputHashtags.setCustomValidity('');
      }
    }
  });
};

// Открытие / Закрытие формы редактирования изображения
uploadFile.addEventListener('change', function () {
  openEditImageForm();
});

uploadCancel.addEventListener('click', function () {
  closeEditImageForm();
});

createPosts();
createPostElements();
hideCommentCounter();
hideCommentLoader();
setupBigPicture(posts[0]);
// showBigPicture();
changePictureScale();
applyingAnEffect();
validateHashtag();
