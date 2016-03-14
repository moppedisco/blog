




/*
     FILE ARCHIVED ON 22:15:50 aug 22, 2010 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 11:24:35 mar 13, 2016.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
var $jQuery = jQuery.noConflict();
$jQuery(document).ready(function() {

	$jQuery("#commentform").validate();

	$jQuery("#slider").easySlider();
	$jQuery.scrollTo.defaults.axis = 'y'; 
	$jQuery.scrollTo( 0 );
	$jQuery('#webbknapp').click(function(){
		$jQuery().stop().scrollTo( '#webb', 1700, { easing:'easeOutExpo' } );
		return false;
	});
	$jQuery('#fotoknapp').click(function(){
		$jQuery().stop().scrollTo( '#foto', 1700, { easing:'easeOutExpo' } );
		return false;	
	});
	$jQuery('#kontaktknapp').click(function(){
		$jQuery().stop().scrollTo( '#kontakt', 1700, { easing:'easeOutExpo' } );
		return false;		
	});	
	$jQuery('#startknapp').click(function(){
		$jQuery().stop().scrollTo( '#start', 1700, { easing:'easeOutExpo' } );
		return false;		
	});	
	
	$jQuery('.gallery').addClass('gallery_demo'); // adds new class name to maintain degradability
	
	$jQuery('ul.gallery').galleria({
		history   : false, // activates the history object for bookmarking, back-button etc.
		clickNext : true, // helper for making the image clickable
		insert    : '#main_image', // the containing selector for our main image
		onImage   : function(image,caption,thumb) { // let's add some image effects for demonstration purposes
			
			// fade in the image and caption
			if(! ($jQuery.browser.mozilla && navigator.appVersion.indexOf("Win")!=-1) ) { // FF/Win fades large images terribly slow
				image.css('display','none').fadeIn(1000);
			}
			caption.css('display','none').fadeIn(1000);
			
			// fetch the thumbnail container
			var _li = thumb.parents('li');
			
			// fade out inactive thumbnail
			_li.siblings().children('img.selected').fadeTo(500,0.3);
			
			// fade in active thumbnail
			thumb.fadeTo('fast',1).addClass('selected');
			
			// add a title for the clickable image
			image.attr('title','Nästa');
		},
		onThumb : function(thumb) { // thumbnail effects goes here
			
			// fetch the thumbnail container
			var _li = thumb.parents('li');
			
			// if thumbnail is active, fade all the way.
			var _fadeTo = _li.is('.active') ? '1' : '0.3';
			
			// fade in the thumbnail when finnished loading
			thumb.css({display:'none',opacity:_fadeTo}).fadeIn(1500);
			
			// hover effects
			thumb.hover(
				function() { thumb.fadeTo('fast',1); },
				function() { _li.not('.active').children('img').fadeTo('fast',0.3); } // don't fade out if the parent is active
			)
		}
	});
});
var mp;

function initialize() {
    mp = new mousepaint( {
        mode: "paint",               // "paint" or "erase"
        bg_image_url: "logo.jpg",    // if mode = "erase", bg image
        bg_image_opacity: "0.5",     // opacity of BG_IMAGE_URL
        square_width: 50,
        square_height: 50,
        square_color: "random",     // set to an RGB value or "random"
        toggle: false,  // default setting for toggle mode
        hud_enable: false,     // enable the heads up display options panel
        hud_text: "options"
        } );
}

window.onload = initialize;
