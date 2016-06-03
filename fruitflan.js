var isAutoplayEnabled
var scenes = {
	NewsRoom: {
		video: 'video/Real_time_decision_1080p_24fps_H264_DIN.mov'
	},
	BookStore: {
		video: 'video/Connection_1080p_24fps_H264_DIN.mov'
	},
	StockMarket: {
		video: 'video/Insight_1080p_24fps_H264_DIN.mov'
	},
	TravelAgency: {
		video: 'video/Data_1080p_24fps_H264_DIN.mov'
	},
	FlowerShop: {
		video: 'video/Visualization_1080p_24fps_H264_DIN.mov'
	}
}
var animated = Array.prototype.slice.call( document.getElementsByTagName( 'animate' ) );
var i = 0;
var wait = 4;
var frame = wait;

var animator;
var WIDTH, HEIGHT;
var COVER, CONTAIN, ox, oy, mx, my;
var c1, c2, c3, c4, c5;
var t;

var cityDimensions = {
	w: 5120/2,
	h: 2000/2
}

var enteriorDimensions = {
	w: 1018,
	h: 720
}

var sceneNode;
var baseNode = document.getElementById('FruitflanAnimation');
var cityNode = document.getElementById('city');
var hero = document.getElementById('cityHero');
var videoNode;

var inCity = false;

var sceneLoader = new XMLHttpRequest();
sceneLoader.addEventListener('load', sceneLoaded);
sceneLoader.responseType='document';
var targetScene = '';

mx = my = ox = oy = 0;

Modernizr.on('videoautoplay', function(result) {
  if (result) {
    // supported
    isAutoplayEnabled = true;
  } else {
    // not-supported
    isAutoplayEnabled = false;
  }
});

function resize() {
	if ( inCity ) {
		setupCity();
	} else {
		setupScene();
	}
}

function init() {
	for (var i in animated) {
		var paths = animated[i].getAttribute('values');
		paths = paths.replace(/\s/g, '').split(';');
		paths.push( animated[i].parentNode.getAttribute('d') );
		animated[i].parentNode.ds = paths;
		animated[i].parentNode.dsi = 0;
		animated[i] = animated[i].parentNode;
	}

	c1 = document.getElementById('cloud1');
	c2 = document.getElementById('cloud2');
	c3 = document.getElementById('cloud3');
	c4 = document.getElementById('cloud4');
	c5 = document.getElementById('cloud5');

	setAnimator( cityLoopRender );

	window.onresize = resize;
	resize();
	update();

	cityAnchors = document.getElementsByClassName('anchor-city');

	for (var i = cityAnchors.length - 1; i >= 0; i--) {
		cityAnchors[i].onmouseenter = function( e ) {
			document.getElementById( e.target.id.substr( 5 ) ).className = 'neon lit';
		}
		cityAnchors[i].onmouseleave = function( e ) {
			document.getElementById( e.target.id.substr( 5 ) ).className = 'neon';
		}
		cityAnchors[i].onclick = function( e ) {
			flyTo( e.target.id.substr( 5 ) );
		}
	}

	sceneNode = document.createElement('div');
	sceneNode.id = 'scene';
	baseNode.appendChild(sceneNode);

	setupCity();


	imagesLoaded( 'body', function() {
		// console.log('all div background images loaded');
		TweenMax.to(baseNode, 1, {opacity: 1});
	});
}

function flyTo( target ) {
	switch ( target ) {
		case 'building-real-time-decision':
			targetScene = 'NewsRoom';
			break;
		case 'building-data':
			targetScene = 'TravelAgency';
			break;
		case 'building-visualization':
			targetScene = 'FlowerShop';
			break;
		case 'building-insight':
			targetScene = 'StockMarket';
			break;
		case 'building-connection':
			targetScene = 'BookStore';
			break;
	}

	setAnimator( cityLoopRenderFly );
	cityHero.className = "fly";

	var aim = document.getElementById( target );

	TweenMax.to( hero, 1, { left: aim.offsetLeft + aim.offsetWidth / 20, top: aim.offsetTop + aim.offsetHeight / 20, scale: .02 } );
	fadeOut();
}

function heroFlyIn() {
	document.getElementById('scene').className = document.getElementById('scene').className + ' hearted';

	var element = document.querySelector('#hero');
	var hero = new Motio(element, {
		fps: 24,
		frames: 58
	});
	hero.toEnd( function() {
		hero.destroy();
		heroFloating();
	} );
}

function heroFloating() {
	var element = document.querySelector('#hero');
	element.className = 'looping';
}

function initTravelAgency() {
	mx = window.innerWidth / 2 - window.innerWidth / 5;
	my = window.innerHeight / 2 - window.innerHeight / 8;

	var element = document.querySelector('#man');
	var man = new Motio(element, {
		fps: 24,
		frames: 48
	});
	man.play();

	var element = document.querySelector('#woman');
	var woman = new Motio(element, {
	    fps: 24,
	    frames: 48
	});
	woman.play();

	TweenMax.to(baseNode, 3, {onComplete: heroFlyIn});
}
function initBookStore() {
	mx = window.innerWidth / 2 - window.innerWidth / 8;
	my = window.innerHeight / 2 - window.innerHeight / 8;

	TweenMax.to(baseNode, 3, {onComplete: heroFlyIn});
}
function initFlowerShop() {
	mx = window.innerWidth / 8 * 6.5;
	my = window.innerHeight / 2 - window.innerHeight / 8;

	TweenMax.to(baseNode, 3, {onComplete: heroFlyIn});
}
function initStockMarket() {
	// mx = window.innerWidth;
	// my = window.innerHeight / 2 - window.innerHeight / 8;

	TweenMax.to(baseNode, 3, {onComplete: heroFlyIn});
}
function initNewsRoom() {
	mx = window.innerWidth;
	my = 0;
	// my = window.innerHeight / 2 - window.innerHeight / 8;

	TweenMax.to(baseNode, 3, {onComplete: heroFlyIn});
}

function setupScene() {
	mx = window.innerWidth / 2;
	my = window.innerHeight / 2;

	switch ( targetScene ) {
		case 'TravelAgency':
			initTravelAgency();
			break;
		case 'BookStore':
			initBookStore();
			break;
		case 'FlowerShop':
			initFlowerShop();
			break;
		case 'StockMarket':
			initStockMarket();
			break;
		case 'NewsRoom':
			initNewsRoom();
			break;
	}

	WIDTH = window.innerWidth / enteriorDimensions.w;
	HEIGHT = window.innerHeight / enteriorDimensions.h;
	COVER = Math.max(WIDTH, HEIGHT);
	CONTAIN = Math.min(WIDTH, HEIGHT);

	w = enteriorDimensions.w * COVER;
	h = enteriorDimensions.h * COVER;

	ox = Math.round( window.innerWidth / 10 );
	cx = mx - ox;
	cw = window.innerWidth - ( ox * 2 );
	cx < 0 ? cx = 0 : cx > cw ? cx = cw : 0;
	ox = ( cx / cw ) * ( window.innerWidth - w );

	oy = Math.round( window.innerHeight / 10 );
	cy = my - oy;
	ch = window.innerHeight - ( oy * 2 );
	cy < 0 ? cy = 0 : cy > ch ? cy = ch : 0;
	oy = ( cy / ch ) * ( window.innerHeight - h );

	document.getElementById('scene').style.transform = 'matrix(' + COVER + ', 0, 0, ' + COVER + ', ' + Math.round(ox) + ', ' + Math.round(oy) + ')';
	document.getElementById('scene').style.webkitTransform = 'matrix(' + COVER + ', 0, 0, ' + COVER + ', ' + Math.round(ox) + ', ' + Math.round(oy) + ')';
}

function setupCity() {

	t = 0;

	c1.style.transform = 
	c2.style.transform = 
	c3.style.transform = 
	c4.style.transform = 
	c5.style.transform = '';

	c1.style.webkitTransform = 
	c2.style.webkitTransform = 
	c3.style.webkitTransform = 
	c4.style.webkitTransform = 
	c5.style.webkitTransform = '';

	mx = window.innerWidth / 2;
	my = window.innerHeight / 2;

	WIDTH = window.innerWidth / cityDimensions.w;
	HEIGHT = window.innerHeight / cityDimensions.h;
	COVER = Math.max(WIDTH, HEIGHT);
	CONTAIN = Math.min(WIDTH, HEIGHT);

	var aspect = Math.max( window.innerWidth / window.innerHeight * .8, 1 )

	COVER *= aspect;
	// COVER = .5;

	w = cityDimensions.w * COVER;
	h = cityDimensions.h * COVER;

	ox = Math.round( window.innerWidth / 10 );
	cx = mx - ox;
	cw = window.innerWidth - ( ox * 2 );
	cx < 0 ? cx = 0 : cx > cw ? cx = cw : 0;
	ox = ( cx / cw ) * ( window.innerWidth - w );

	oy = Math.round( window.innerHeight / 10 );
	cy = my - oy;
	ch = window.innerHeight - ( oy * 2 );
	cy < 0 ? cy = 0 : cy > ch ? cy = ch : 0;
	oy = ( cy / ch ) * ( window.innerHeight - h );

	cityNode.style.transform = 'matrix(' + COVER + ', 0, 0, ' + COVER + ', ' + Math.round(ox) + ', ' + Math.round(oy) + ')';
}

function enteriorLoopRender() {
}

function cloudsFly() {
	t += .1;
	c1.style.transform = 'translateX(-' + ( t * 3.15 ) + 'px)';
	c2.style.transform = 'translateX( ' + ( t * 3.30 ) + 'px)';
	c3.style.transform = 'translateX( ' + ( t * 2.15 ) + 'px)';
	c4.style.transform = 'translateX( ' + ( t * 1.95 ) + 'px)';
	c5.style.transform = 'translateX(-' + ( t * 1.80 ) + 'px)';

	c1.style.webkitTransform = 'translateX(-' + ( t * 3.15 ) + 'px)';
	c2.style.webkitTransform = 'translateX( ' + ( t * 3.30 ) + 'px)';
	c3.style.webkitTransform = 'translateX( ' + ( t * 2.15 ) + 'px)';
	c4.style.webkitTransform = 'translateX( ' + ( t * 1.95 ) + 'px)';
	c5.style.webkitTransform = 'translateX(-' + ( t * 1.80 ) + 'px)';
}

function cityLoopRender() {
	cloudsFly();
	if (frame-- < 0) {
		frame = wait;
		for (var i in animated) {
			animated[i].setAttribute('d', animated[i].ds[animated[i].dsi++]);
			if (animated[i].dsi >= animated[i].ds.length) {
				animated[i].dsi = 0;
			}
		}
	}
};

function fadeOut() {
	TweenMax.to( baseNode, .5, { delay: .5, opacity: 0, onComplete: fadeWait } );
}
function fadeWait() {
	TweenMax.to( hero, 0, { left: '950px', top: '470px', scale: 1 } );
	cityNode.style.display = 'none';

	sceneLoader.open('GET', 'html/' + targetScene + '.html#' + Math.random(), true);
	sceneLoader.send();

	setAnimator( enteriorLoopRender );
}
function fadeIn() {
	TweenMax.to( baseNode, .5, { opacity: 1 } );
}

function setAnimator(method) {
	inCity = method == cityLoopRender;
	ox = oy = 0;
	animator = method;
}

function sceneLoaded() {
	// console.log('sceneLoaded');

	var content = sceneLoader.response.getElementById('scene');
	sceneNode.parentNode.replaceChild(content, sceneNode);
	content.className = 'scene_' + targetScene;
	sceneNode = content;
	resize();

	document.getElementById('exit').onclick = flyBack;
	document.getElementById('click').onclick = startVideo;
	// document.getElementById('scene').onclick = function(e) {
	// 	if (e.target.id != 'exit') {
	// 		this.className = this.className + ' hearted';
	// 	}
	// };

	imagesLoaded( 'body', { background: 'div' }, function() {
		fadeIn();
	});
}

function flyBack() {
	console.log('flyBack');

	TweenMax.to( baseNode, .5, { opacity: 0, onComplete: reloadCity } );
}

function startVideo() {
	console.log('startVideo');

	videoNode = document.createElement('video');
	var sourceNode = document.createElement('source');

	videoNode.id = 'video';
	videoNode.className = 'video-js';

	sourceNode.src = scenes[targetScene]['video'];
	sourceNode.type = 'video/mp4';

	document.body.appendChild( videoNode );
	videoNode.appendChild( sourceNode );
	videojs(document.getElementById('video'), {}, function() {
		sceneNode.style.opacity = 0;
		this.play();
		this.on('ended', videoEnded);
	});
	videoNode.addEventListener('pause', videoPaused);
	videoNode.addEventListener('click', function() {
		videoNode.pause();
		videoEnded();
	})
}
function videoPaused() {
	if (!videoNode.webkitDisplayingFullscreen) {
		videoEnded();
	}
}
function videoEnded() {
	baseNode.style.opacity = 0;
	var vid = document.getElementById('video');
	TweenMax.to( vid, .5, { opacity: 0, onComplete: removeVideo } );
}

function removeVideo() {
	var vid = document.getElementById('video');
	vid.parentNode.removeChild(vid);
	reloadCity();
}

function reloadCity() {
	console.log('reloadCity');

	setAnimator( cityLoopRender );
	sceneNode.innerHTML = '';
	sceneNode.className = '';
	sceneNode.removeAttribute('style');
	cityNode.removeAttribute('style');
	cityHero.className = "stand";

	setupCity();

	TweenMax.to( baseNode, .5, { opacity: 1 } );
}

function update() {
	animator();
	window.requestAnimationFrame(update);
}

function cityLoopRenderFly() {
	cloudsFly();
	for (var i in animated) {
		animated[i].setAttribute('d', animated[i].ds[animated[i].dsi++]);
		if (animated[i].dsi >= animated[i].ds.length) {
			animated[i].dsi = 0;
		}
	}
}

init();
