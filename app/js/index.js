$('.hero__slider').slick({
  slidesToShow: 5,
  slidesToScroll: 1,
  arrows: false,
  autoplay: true,
  autoplaySpeed: 2000,
});

$('.comments__slider').slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: false,
  infinite: true,
  prevArrow: "#prev",
  nextArrow: "#next",
});