(function(window){
  function init(){
    if($('body').hasClass('page--Home')){
      setTimeout(function(){
        $('[data-typer-targets]').typer();
      }, 1200);
    }


    if(!Modernizr.touch){
      var url = $(".post-header__iframe").attr("data-src");
      $(".post-header__iframe").attr("src",url);
    }

    postHeader();

  }

  function postHeader(){
    /* Mockup responsiveness */
    var body = $("body"),
      wrap = document.getElementById('postHeader'),
      mockup = document.getElementById('inner'),
      mockupWidth = mockup.offsetWidth;

    scaleMockup();

    function scaleMockup() {
      var wrapWidth = wrap.offsetWidth,
        val = wrapWidth / mockupWidth;

      mockup.style.transform = 'scale3d(' + val + ', ' + val + ', 1)';
    }

    window.addEventListener( 'resize', resizeHandler );

    function resizeHandler() {
      function delayed() {
        resize();
        resizeTimeout = null;
      }
      if ( typeof resizeTimeout != 'undefined' ) {
        clearTimeout( resizeTimeout );
      }
      resizeTimeout = setTimeout( delayed, 50 );
    }

    function resize() {
      scaleMockup();
    }
  }

  window.Application = {
    init: init,
    postHeader: postHeader
  }

}(window))  // Self execute
