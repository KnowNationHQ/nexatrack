(function ($) {
    "use strict";

    // ponytail: phone number in one place
    var NXT_PHONE = '+1 (506) 501-4402';

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();

    $('.back-to-top').hide();
    
    
    // Initiate the wowjs
    new WOW().init();


    
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: false,
        smartSpeed: 1500,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });
    
})(jQuery);

// ── Active nav state ──
var path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
document.querySelectorAll('.navbar-nav .nav-item .nav-link').forEach(function(el) {
  var href = el.getAttribute('href').replace(/\.html$/, '') || '/';
  if (path === href) el.classList.add('active');
});

// ── Click-to-call on mobile ──
if (window.innerWidth < 768) {
  var phoneEl = document.querySelector('h4.m-0.pe-lg-5 i.fa-headphones');
  if (phoneEl && phoneEl.parentElement) {
    phoneEl.parentElement.outerHTML = '<a href="tel:+15065014402" style="color:inherit;text-decoration:none">' + phoneEl.parentElement.outerHTML + '</a>';
  }
}

