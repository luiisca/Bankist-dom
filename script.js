'use strict';

const header = document.querySelector('.header');
const div = document.createElement('div');
const butnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const operations = document.querySelector('.operations');
const tabContainer = document.querySelector('.operations__tab-container');
const operationsTab = document.querySelectorAll('.operations__tab');
const operationsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('nav');
const navHeight = getComputedStyle(nav).height;
const navBtns = document.querySelector('.nav__links');
const navLinks = document.querySelectorAll('.nav__link');
const logo = document.querySelector('.nav__logo');
const section = document.querySelectorAll('.section');
const featureImgs = document.querySelectorAll('.features__img');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

butnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

navBtns.addEventListener('click', function (e) {
  e.preventDefault();
  const id = document.querySelector(e.target.getAttribute('href'));
  if (e.target.classList.contains('nav__link'))
    id.scrollIntoView({ behavior: 'smooth' });
});

//tabbed component
operations.addEventListener('click', e => {
  if (e.target.classList.contains('operations__tab')) {
    const clicked = e.target.closest('.operations__tab');
    operationsTab.forEach(el => el.classList.remove('operations__tab--active'));
    clicked.classList.add('operations__tab--active');

    const currentDoc = document.querySelector(
      `.operations__content--${clicked.dataset.tab}`
    );
    operationsContent.forEach(c =>
      c.classList.remove('operations__content--active')
    );
    currentDoc.classList.add('operations__content--active');
  } else
    operationsTab.forEach(el => el.classList.remove('operations__tab--active'));
});

//blurnav
const blurNav = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav__links').querySelectorAll('.nav__link');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', blurNav.bind(0.5));
nav.addEventListener('mouseout', blurNav.bind(1));

//sticky nav
const obsCallback = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const obsObject = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}`,
};
const observer = new IntersectionObserver(obsCallback, obsObject);
observer.observe(header);

//smooth transition sections
const revealSection = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  revealObs.unobserve(entry.target);
};

const revealObs = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

section.forEach(sect => {
  revealObs.observe(sect);
  sect.classList.add('section--hidden');
});

//lazy loading images
const showImgs = function (entries) {
  const [entry] = entries;
  console.log(entry);
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );
  lazyImgsObs.unobserve(entry.target);
};
const lazyImgsObs = new IntersectionObserver(showImgs, {
  root: null,
  threshold: 0,
  rootMargin: '800px',
});
featureImgs.forEach(el => {
  lazyImgsObs.observe(el);
});

//slider
const slider = function () {
  const slider = document.querySelector('.slider');
  const slideCards = document.querySelectorAll('.slide');
  const slideRightBtn = document.querySelector('.slider__btn--right');
  const slideLeftBtn = document.querySelector('.slider__btn--left');
  const dotsContainer = document.querySelector('.dots');
  const dots = document.querySelectorAll('.dots__dot');
  let curSlide = 0;
  const maxSlide = slideCards.length;

  //functions
  const goToSlide = function (slider) {
    slideCards.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - slider)}%)`;
    });
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    changeDots(curSlide);
  };

  const previousSlide = function () {
    if (curSlide !== 0) {
      curSlide--;
    } else {
      curSlide = maxSlide - 1;
    }
    changeDots(curSlide);
  };

  const createDots = function () {
    slideCards.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const changeDots = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide = "${slide}"]`)
      .classList.add('dots__dot--active');

    goToSlide(slide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    changeDots(0);
  };
  init();

  //Event listeners
  slideRightBtn.addEventListener('click', nextSlide);
  slideLeftBtn.addEventListener('click', previousSlide);
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && previousSlide();
  });

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      changeDots(slide);
    }
  });
};
slider();
