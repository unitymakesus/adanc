export default {
  init() {
    // JavaScript to be fired on the home page
  },
  finalize() {
    // JavaScript to be fired on the home page, after the init JS
    $('.hero img').before('<div class="blurred" style="background-image:url(' + $('.hero img').attr('src') + ')"></div>');
  },
};
