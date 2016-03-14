




/*
     FILE ARCHIVED ON 22:15:59 aug 22, 2010 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 11:24:35 mar 13, 2016.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
 * @(#) mousepaint.js   (c)2008 jon r. luini falcon@chime.com
 *
 * version 0.1
 * simple interface to 'drawing' on the background, implemented
 * by dynamically creating specific sized DIV blocks and setting
 * background colors on them.
 *
 * your non-commercial use of this is likely granted, though i
 * request courtesy of an email to falcon@chime.com :}
 *
 * to enable on a web page, do the following:
 *
 * 1) include mousepaint.js in your page:
 *    <script type="text/javascript" src="mousepaint.js"></script>
 *
 * 2) add the mousepaint call (w/ any options) into your onLoad:
 *    <script type="text/javascript" language="javascript">
 *    function initialize() {
 *        var mp = new mousepaint( { square_width: 50, square_height: 5 } );
 *    }
 *    window.onload = initialize();
 *    </script>
 *
 * 3) make sure all content on your page that you want above the
 *    the drawing canvas has a position of relative or absolute and
 *    a z-index css value that's >= 2 but less than 100 if you are
 *    have hud_enable = true and want that to show up above your
 *    page content
 */

var mousepaint = function(opts) {
    this.setOptions(opts);
    this.mousePaintOnLoad();
    this.mousePaintInit();
};

mousepaint.prototype = {
    // DEFAULT VALUES YOU MAY CHANGE AS YOU WISH AS CALLING PARAMETERS
    options: {
	mode: "paint",		// "paint" or "erase"
	bg_image_url: undefined,	// if mode = "erase", bg image
	bg_image_opacity: "0.8",	// BG_IMAGE_URL opacity (if mode erase)
	square_width: 25,
	square_height: 25,
	square_color: "random",	// set to an RGB value or "random"
	toggle: false,		// default setting for toggle mode
	hud_enable: true,	// enable the heads up display options panel
	hud_text: "options"	// default text in the box to enable hud
    },

    // DON'T CHANGE THESE
    MP_CANVAS_ID: "mp_squares",
    MP_BG_IMAGE_ID: "mp_bg_image",
    MP_HUD_ID: "mp_squares_hud",
    MP_ADMIN_ID: "mp_squares_admin",

    mp_enabled: true,
    MP_DEBUG_ID: undefined, //"debug";	// id of debug window

    mp_pageWidth: undefined,
    mp_pageHeight: undefined,
    IE: document.all?true:false,

    mp_hudHideTimeout:  undefined,

    setOptions: function (opts) {
	for (property in opts)
	    this.options[property] = opts[property];
    },

    mousePaintOnLoad: function () {
	var self = this;

	// add in our handler to onresize
	var current_resize_handler = window.onresize;
	window.onresize = function () {
	    if ( current_resize_handler ) current_resize_handler();
	    self.mousePaintOnResize(self);
	}

	this.mousePaintOnResize();

	if (!this.IE) document.captureEvents(Event.MOUSEMOVE)

	document.onmousemove = function (evt) {
	    self.handleMouseMove (evt, self);
	};
    },

    mousePaintInit: function () {
	var parent_obj = document.getElementById(this.MP_CANVAS_ID);

	// create this.MP_CANVAS_ID if it doesn't already exist
	if ( ! parent_obj )
	{
	    var bg_obj;

	    if ( this.options.mode == "erase" && this.options.bg_image_url != "" )
	    {
		bg_obj = document.createElement ("img");
		bg_obj.id = this.MP_BG_IMAGE_ID;
		bg_obj.style.position = "absolute";
		bg_obj.style.top = "0px";
		bg_obj.style.left = "0px";
		bg_obj.style.border = "1px solid";
		bg_obj.style.width = "100%";
		bg_obj.style.height = "100%";
		bg_obj.style.zIndex = "0";
		bg_obj.src = this.options.bg_image_url;
		if ( this.options.bg_image_opacity < 1 )
		{
		    bg_obj.style.filter = "alpha(opacity=" + (this.options.bg_image_opacity * 100) + ")";
		    bg_obj.style.opacity = this.options.bg_image_opacity;
		    bg_obj.style.MozOpacity = this.options.bg_image_opacity;
		}

		document.body.appendChild(bg_obj);
	    }

	    parent_obj = document.createElement ("div");
	    parent_obj.id = this.MP_CANVAS_ID;
	    parent_obj.style.position = "absolute";
	    parent_obj.style.top = "0px";
	    parent_obj.style.left = "0px";
	    parent_obj.style.zIndex = 1;
	    parent_obj.style.height = "100%";
	    parent_obj.style.width = "100%";
	    parent_obj.style.cursor = "crosshair";

	    if ( this.mp_enabled )
		parent_obj.style.display = "block";
	    else
		parent_obj.style.display = "none";

	    document.body.appendChild(parent_obj);

	    if ( this.options.mode == "erase" && bg_obj )
	    {
		this.mousePaintFill();
	    }

	}

	if ( this.options.hud_enable == true )
	{
	    var self = this;
	    var hud_obj = document.createElement ("div");
	    hud_obj.id = this.MP_HUD_ID;
	    hud_obj.style.display = "none";
	    hud_obj.style.position = "absolute";
	    hud_obj.style.border = "1px dashed";
	    hud_obj.style.padding = "10px";
	    hud_obj.style.font = "10px arial,helvetica,sans-serif";
	    hud_obj.style.top = "0px";
	    hud_obj.style.left = "0px";
	    hud_obj.style.zIndex = 101;
	    hud_obj.style.backgroundColor = "#ffffff";

	    var form = document.createElement("form");
	    form.onmouseover = function () { self.hudDisplay(); }
	    form.onsubmit = function () { return false; }
	    form.style.border = form.style.padding = 0;

	    var self = this;
	    var input_width = document.createElement("input");
	    input_width.type = "text";
	    input_width.size = "5";
	    input_width.name = "square_width";
	    input_width.value = this.options.square_width;
	    input_width.onchange = function() { self.mouseReset(this.form.square_width.value, this.form.square_height.value); }
	    form.appendChild (input_width);

	    var x = document.createTextNode("x");
	    form.appendChild(x);

	    var input_height = document.createElement("input");
	    input_height.type = "text";
	    input_height.size = "5";
	    input_height.name = "square_height";
	    input_height.value = this.options.square_height;
	    input_height.onchange = function() { self.mouseReset(this.form.square_width.value, this.form.square_height.value); }
	    form.appendChild (input_height);

	    var br = document.createElement("br");
	    form.appendChild(br);

	    var button = document.createElement("input");
	    button.type = "button";
	    button.value = "Clear Drawing";
	    button.onclick = function() { self.mouseReset(); self.hudDisplay(false); }
	    form.appendChild (button);

	    hud_obj.appendChild (form);

	    //hud_obj.innerHTML = "<form onmouseover='self.hudDisplay(true)' onSubmit='return false;' style='margin:0; padding:0'>Size: <input type='text' size='5' name='square_width' value='" + this.options.square_width + "' onChange='mouseReset(this.form.square_width.value,this.form.square_height.value)'/> x <input type='text' size='5' name='square_height' value='" + this.options.square_height + "' onChange='mouseReset(this.form.square_width.value,this.form.square_height.value)'/><br/><input type='button' onclick='mouseReset();self.hudDisplay(false);' value='Clear Drawing'></form>";

	    hud_obj.onmouseout = function () { self.hudDisplay(false); }
	    hud_obj.onmouseover = function () { self.hudDisplay(true); }
	    //parent_obj.appendChild(hud_obj);
	    document.body.appendChild(hud_obj);

	    var admin_obj = document.createElement ("div");
	    admin_obj.id = this.MP_ADMIN_ID;
	    admin_obj.style.display = "block";
	    admin_obj.style.position = "absolute";
	    admin_obj.style.top = "0px";
	    admin_obj.style.left = "0px";
	    admin_obj.style.font = "10px arial,helvetica,sans-serif";
	    admin_obj.style.color = "#ffffff";
	    admin_obj.style.padding = "3px";
	    admin_obj.innerHTML = this.options.hud_text;
	    admin_obj.style.zIndex = 100;
	    admin_obj.style.backgroundColor = "#ff0000";
	    admin_obj.onmouseover = function () { self.hudDisplay(true); }
	    //parent_obj.appendChild(admin_obj);
	    document.body.appendChild(admin_obj);
	}
    },

    getWindowDimensions: function () {
	var parent_obj = document.getElementById(this.MP_CANVAS_ID);

	if (self.innerWidth)
	{
	    frameWidth = self.innerWidth;
	    frameHeight = self.innerHeight;
	}
	else if (document.documentElement && document.documentElement.clientWidth)
	{
	    frameWidth = document.documentElement.clientWidth;
	    frameHeight = document.documentElement.clientHeight;
	}
	else if (document.body)
	{
	    frameWidth = document.body.clientWidth;
	    frameHeight = document.body.clientHeight;
	}
	else
	    return false;

	// if there's valid info, update the globals so they can be used elsewhere
	this.mp_pageWidth = frameWidth;
	this.mp_pageHeight = frameHeight;


	return true;
    },

    mousePaintOnResize: function (self) {
	if ( ! self ) self = this;

	if ( ! self.getWindowDimensions() )
	    return false;

	// reset everything since otherwise you can resize down
	// and be stuck with scrollbars from painting you did outside of
	// what is now visible
	self.mouseReset();
    },

    mousePaintFill: function () {
	var parent_obj = document.getElementById(this.MP_CANVAS_ID);
	var xSquares, ySquares;

	if ( ! parent_obj ) return;

	xSquares = parseInt(this.mp_pageWidth / this.options.square_width);
	ySquares = parseInt(this.mp_pageHeight / this.options.square_height);

	for (var y = 0; y < ySquares; y++ )
	{
	    for (var x = 0; x < xSquares; x++ )
	    {
		// see if we already created a square here
		var id = "square_" + x + "_" + y;
		var square = document.getElementById (id);

		if ( ! square )
		{
		    square = document.createElement ("span");
		    square.id = id;
		    square.style.width = this.options.square_width + "px";
		    square.style.height = this.options.square_height + "px";
		    square.style.position = "absolute";
		    square.style.left = (x * this.options.square_width)  + "px";
		    square.style.top = (y * this.options.square_height)  + "px";
		    if ( this.options.square_color == "random" )
			square.style.backgroundColor = this.randomRGB();
		    else
			square.style.backgroundColor = this.options.square_color;
		    parent_obj.appendChild (square);
		}
	    }
	}
    },

    hudDisplayNow: function (self, mode) {
	var hud_obj = document.getElementById (self.MP_HUD_ID);
	hud_obj.style.display = mode;
	if ( self.mp_hudHideTimeout != undefined )
	    clearTimeout(self.mp_hudHideTimeout);
	self.mp_hudHideTimeout = undefined;
    },

    hudDisplay: function (mode) {
	var hud_obj = document.getElementById (this.MP_HUD_ID);
	var new_mode;

	if ( this.mp_hudHideTimeout != undefined )
	    clearTimeout(this.mp_hudHideTimeout);
	this.mp_hudHideTimeout = undefined;

	if ( ! hud_obj ) return;

	new_mode = (mode) ? "block" : "none";
	if ( new_mode == "none" )
	{
	    //var cmd = "hudDisplayNow('" + new_mode + "')";
	    var self = this;
	    this.mp_hudHideTimeout = setTimeout (function() {
		self.hudDisplayNow(self, new_mode)
		}, 500);
	}
	else
	    hud_obj.style.display = new_mode;
    },

    mouseViewToggle: function (view_override, clear_squares) {
	var parent_obj = document.getElementById (this.MP_CANVAS_ID);

	if (!parent_obj) return;

	this.mp_enabled = ! this.mp_enabled;

	if ( typeof(view_override) != "undefined" )
	    this.mp_enabled = view_override;

	if ( clear_squares )
	    this.mouseReset();

	if (this.mp_enabled)
	    parent_obj.style.display = "block";
	else
	    parent_obj.style.display = "none";

    },

    mouseReset: function (w,h) {
	var parent_obj = document.getElementById(this.MP_CANVAS_ID);

	w = parseInt(w);
	h = parseInt(h);

	if ( ! w ) w = this.options.square_width;
	if ( ! h ) h = this.options.square_height;

	if ( w < 1 ) w = 1;
	if ( h < 1 ) h = 1;
	this.options.square_width = w;
	this.options.square_height = h;

	if ( parent_obj ) {
	    while (parent_obj.hasChildNodes() == true)
	    {
		/*
		// HUD_ID is always the first one so we can abort if we hit it
		if ( parent_obj.childNodes[0].id == this.MP_HUD_ID 
		    || parent_obj.childNodes[0].id == this.MP_ADMIN_ID )
		{
		    break;
		}
		*/

		parent_obj.removeChild(parent_obj.childNodes[0]);
	    }
	}
	this.mousePaintInit();
    },

    handleMouseMove: function (evt, self) {
	var x, y;
	var parent_obj = document.getElementById(self.MP_CANVAS_ID);

	if ( ! parent_obj ) return;

	if (self.IE) { // grab the x-y pos.s if browser is IE
	    x = event.clientX + document.body.scrollLeft
	    y = event.clientY + document.body.scrollTop
	} else {  // grab the x-y pos.s if browser is NS
	    x = evt.pageX
	    y = evt.pageY
	}  

	if (x < 0) x = 0;
	if (y < 0) y = 0;  

	// figure out what square we are in
	xsquare = parseInt(x / self.options.square_width);
	ysquare = parseInt(y / self.options.square_height);

	if ( self.MP_DEBUG_ID )
	{
	    var debug_obj = document.getElementById('debug');
	    if ( debug_obj )
		debug_obj.innerHTML = "pos=" + x + "," + y
		    + " square=" + xsquare + "," + ysquare;
	}

	// see if we already created a square here
	var id = "square_" + xsquare + "_" + ysquare;
	var square = document.getElementById (id);

	if ( square )
	{
	    // if in erase mode make sure it gets set transparent
	    if ( self.options.mode == "erase" )
	    {
		square.style.backgroundColor = "transparent";
	    }
	    // if in toggle mode and already exists, toggle it
	    else if ( self.options.toggle == true )
	    {
		if ( square.style.backgroundColor != "transparent" )
		    square.style.backgroundColor = "transparent";
		else
		{
		    if ( self.options.square_color == "random" )
			square.style.backgroundColor = self.randomRGB();
		    else
			square.style.backgroundColor = self.options.square_color;
		}
	    }
	}
	else // create it
	{
	    square = document.createElement ("span");
	    square.id = id;
	    square.style.width = self.options.square_width + "px";
	    square.style.height = self.options.square_height + "px";
	    square.style.position = "absolute";
	    square.style.left = (xsquare * self.options.square_width)  + "px";
	    square.style.top = (ysquare * self.options.square_height)  + "px";
	    if ( self.options.square_color == "random" )
		square.style.backgroundColor = self.randomRGB();
	    else
		square.style.backgroundColor = self.options.square_color;
	    parent_obj.appendChild (square);
	}

	return true;
    },

    randomRGB: function () {

	function RGBtoHex (R,G,B) { return toHex(R)+toHex(G)+toHex(B) };

	function toHex (N) {
	    if (N==null) return "00";
	    N=parseInt(N); if (N==0 || isNaN(N)) return "00";
	    N=Math.max(0,N); N=Math.min(N,255); N=Math.round(N);
	    return "0123456789ABCDEF".charAt((N-N%16)/16)
	      + "0123456789ABCDEF".charAt(N%16);
	};

	return "#" + RGBtoHex(Math.floor(Math.random() * 256),
	    Math.floor(Math.random() * 256),
	    Math.floor(Math.random() * 256));
    },

};



/*
 * these routines are cribbed from prototype.lite.js
 * for more info on prototype see /web/20100822221559/http://www.prototypejs.org/
 */
function $() {
        if (arguments.length == 1) return get$(arguments[0]);
        var elements = [];
        $c(arguments).each(function(el){
                elements.push(get$(el));
        });
        return elements;
        function get$(el){
                if (typeof el == 'string') el = document.getElementById(el);
                return el;
        }
}
