function fetchBlogs() {
  fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@anjulashanaka')
      .then((res) => res.json())
      .then((data) => {
            // Fillter the array
            const res = data.items //This is an array with the content. No feed, no info about author etc..
            const posts = res.filter(item => item.categories.length > 0) // That's the main trick* !

            function toText(node) {
              let tag = document.createElement('div')
              tag.innerHTML = node
              node = tag.innerText
              return node
            }
            function shortenText(text,startingPoint ,maxLength) {
              return text.length > maxLength?
                  text.slice(startingPoint, maxLength):
                  text
            }

            let output = '';
            posts.forEach((item) => {
              output += `
           <div class="col-md-6 col-lg-4 pt-5">
        <div class="block-blog text-left">
          <a href="${item.link}" target="_blank"><img src="${item.thumbnail}" alt="img" style="width: 350px;height: 200px;
object-fit: cover;"></a>
          <div class="content-blog">
            <h4><a href="${item.link}" target="_blank">${item.title}</a></h4>
            <p>${shortenText(toText(item.content),0, 300)+ '...'}</p>
            <span>${shortenText(item.pubDate,0 ,10)}</span>
            <a class="pull-right readmore" href="${item.link}" target="_blank">read more</a>
          </div>
        </div>
      </div>`
            })
            document.querySelector('.blog__slider').innerHTML = output
          }
      )

}

function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

jQuery(document).ready(function( $ ) {

  fetchBlogs();
  const data = JSON.parse(httpGet('https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10' +
      '&playlistId=PLx4Ro8e0E8S_GmG75brlX1yGbILEiuY7m&key=AIzaSyBTfMNlg_WsL7cMiOIh7XQs0oZqLEkhl2c'));

  let videos = '';
  data.items.forEach((item) => {
    videos += `
            <div class="col-md-4 mb-5">
        <div class="card video-card shadow youtube-videos mb-4">
            <img src="${item.snippet.thumbnails.medium.url}"
                 alt="Rounded image"
                 class="rounded shadow img-full"/>
            <div class="card-body">
                <h6 class="">${item.snippet.title}</h6>
                <p class="text-muted">${item.snippet.description}</p>
            </div>
            <a class="btn btn-onelive position-absolute hover-element rounded-05-rem"
               style="right: 20px; bottom: 20px"
               target="_blank"
               href="https://youtube.com/watch?v=${item.snippet.resourceId.videoId}">
                <span class="original-content">
                    <i class="fa fa-play" aria-hidden="true"></i>
                </span>
                <span class="content-on-hover">
                    Watch Now &nbsp;<i class="fa fa-play fa-sm" aria-hidden="true"></i>
                </span>
            </a>
        </div>
    </div>`
  })
  document.querySelector('#youtube-videos').innerHTML = videos

  $(window).scroll(function () {
    var height = $(window).height();
    var scroll = $(window).scrollTop();
    if (scroll) {
      $(".header-hide").addClass("scroll-header");
    } else {
      $(".header-hide").removeClass("scroll-header");
    }

  });

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function(){
    $('html, body').animate({scrollTop : 0},1500, 'easeInOutExpo');
    return false;
  });

  // Initiate the wowjs animation library
  new WOW().init();

  // Initiate superfish on nav menu
  $('.nav-menu').superfish({
    animation: {
      opacity: 'show'
    },
    speed: 400
  });

  // Mobile Navigation
  if ($('#nav-menu-container').length) {
    var $mobile_nav = $('#nav-menu-container').clone().prop({
      id: 'mobile-nav'
    });
    $mobile_nav.find('> ul').attr({
      'class': '',
      'id': ''
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
    $('body').append('<div id="mobile-body-overly"></div>');
    $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

    $(document).on('click', '.menu-has-children i', function(e) {
      $(this).next().toggleClass('menu-item-active');
      $(this).nextAll('ul').eq(0).slideToggle();
      $(this).toggleClass("fa-chevron-up fa-chevron-down");
    });

    $(document).on('click', '#mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
      $('#mobile-body-overly').toggle();
    });

    $(document).click(function(e) {
      var container = $("#mobile-nav, #mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
      }
    });
  } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
    $("#mobile-nav, #mobile-nav-toggle").hide();
  }

  // Smooth scroll for the menu and links with .scrollto classes
  $('.nav-menu a, #mobile-nav a, .scrollto').on('click', function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if ($('#header').length) {
          top_space = $('#header').outerHeight();

          if( ! $('#header').hasClass('header-fixed') ) {
            top_space = top_space - 20;
          }
        }

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu').length) {
          $('.nav-menu .menu-active').removeClass('menu-active');
          $(this).closest('li').addClass('menu-active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Modal video
  new ModalVideo('.js-modal-btn', {channel: 'youtube'});

  // Init Owl Carousel
  $('.owl-carousel').owlCarousel({
    items: 4,
    autoplay: true,
    loop: true,
    margin: 30,
    dots: true,
    responsiveClass: true,
    responsive: {

      320: { items: 1},
      480: { items: 2},
      600: { items: 2},
      767: { items: 3},
      768: { items: 3},
      992: { items: 4}
    }
  });

// custom code

});
