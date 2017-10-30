// LAZYLOAD PHOTOS
$(document).ready(() => {
    $('.lazy').Lazy();
});

$(document).on('click', '[data-toggle="lightbox"]', function (event) {
    event.preventDefault();
    $(this).ekkoLightbox();
});