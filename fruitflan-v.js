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
var clouds = new XMLHttpRequest();
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
	w: 5200/2,
	h: 3677/2
}

var sceneNode;
var baseNode = document.getElementById('FruitflanAnimation');
var cityNode = document.getElementById('city');
var hero = document.getElementById('cityHero');
var videoNode;

var anim1SourceNode;
var anim2SourceNode;
var anim3SourceNode;

var animation1Node;
var animation2Node;
var animation3Node;
var animationLoaded = 0;

var inCity = false;

var targetScene = '';

mx = my = ox = oy = 0;

function resize() {
	if ( inCity ) {
		initCity();
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

	initCity();

	TweenMax.to(baseNode, 1, {opacity: 1});
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

function initBookStore() {
	my = window.innerHeight / 2 - window.innerHeight / 8;
}

function setupScene() {
	mx = window.innerWidth / 2;
	my = window.innerHeight / 2;

	switch ( targetScene ) {
		case 'TravelAgency':
			break;
		case 'BookStore':
			initBookStore();
			break;
		case 'FlowerShop':
			break;
		case 'StockMarket':
			break;
		case 'NewsRoom':
			mx = window.innerWidth;
			my = window.innerHeight / 2 - window.innerHeight / 8;
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

function initCity() {

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
	my = window.innerHeight;

	WIDTH = window.innerWidth / cityDimensions.w;
	HEIGHT = window.innerHeight / cityDimensions.h;
	COVER = Math.max(WIDTH, HEIGHT);
	CONTAIN = Math.min(WIDTH, HEIGHT);

	// COVER *= 1.5;
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
	cityNode.style.webkitTransform = 'matrix(' + COVER + ', 0, 0, ' + COVER + ', ' + Math.round(ox) + ', ' + Math.round(oy) + ')';
}

function fadeOut() {
	TweenMax.to( baseNode, .5, { delay: .5, opacity: 0, onComplete: fadeWait } );
}
function fadeWait() {
	TweenMax.to( hero, 0, { left: '950px', top: '470px', scale: 1 } );
	cityNode.style.display = 'none';

	loadScene();

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

function loadScene() {
	var content = [
	'<video id="animation"></video>',
	'<div id="exit" class="exit"></div>',
	'<div class="laptop"></div>',
	'<div class="rays"></div>',
	'<div id="click" class="click"></div>'].join('\n');
	sceneNode.innerHTML = content
	sceneNode.className = 'scene_' + targetScene;
	setupScene();
	sceneInit();
}

function animation1CanplaythroughEvent() {
	animation1Node.play();
	fadeIn();
	animationLoaded++;
}
function animation1Ended() {
	if (animationLoaded == 3) {
		this.style.display = 'none';
		animation2Node.play();
	} else {
		this.play();
	}
}
function animation2CanplaythroughEvent() {
	animationLoaded++;
}
function animation2Ended() {
	sceneNode.className = sceneNode.className + ' hearted';
	this.style.display = 'none';
	animation3Node.play();
}
function animation3CanplaythroughEvent() {
	animationLoaded++;
}
function animation3Ended() {
	// animation3Node.play();
}

function sceneInit() {
	animationLoaded = 0;

	animation1Node = document.getElementById( 'animation' );
	animation2Node = document.createElement( 'video' );
	animation3Node = document.createElement( 'video' );

	animation1Node.className = 'animation';
	animation2Node.className = 'animation';
	animation3Node.className = 'animation';

	anim1SourceNode = document.createElement( 'source' );
	anim2SourceNode = document.createElement( 'source' );
	anim3SourceNode = document.createElement( 'source' );

	anim1SourceNode.src = 'video/' + targetScene + '/vid-1.mov';
	anim1SourceNode.type = 'video/mp4';
	anim2SourceNode.src = 'video/' + targetScene + '/vid-2.mov';
	anim2SourceNode.type = 'video/mp4';
	anim3SourceNode.src = 'video/' + targetScene + '/vid-3.mov';
	anim3SourceNode.type = 'video/mp4';

	animation1Node.appendChild( anim1SourceNode );
	animation2Node.appendChild( anim2SourceNode );
	animation3Node.appendChild( anim3SourceNode );

	sceneNode.insertBefore( animation3Node, animation1Node );
	sceneNode.insertBefore( animation2Node, animation1Node );

	// animation1Node.setAttribute( 'loop', 'true' );
	animation3Node.setAttribute( 'loop', 'true' );

	animation1Node.addEventListener( 'canplaythrough', animation1CanplaythroughEvent );
	animation2Node.addEventListener( 'canplaythrough', animation2CanplaythroughEvent );
	animation3Node.addEventListener( 'canplaythrough', animation3CanplaythroughEvent );

	animation1Node.addEventListener( 'ended', animation1Ended );
	animation2Node.addEventListener( 'ended', animation2Ended );
	animation3Node.addEventListener( 'ended', animation3Ended );

	document.getElementById('exit').onclick = flyBack;
	document.getElementById('click').onclick = startVideo;
}

function flyBack() {
	TweenMax.to( baseNode, .5, { opacity: 0, onComplete: reloadCity } );
}

function startVideo() {
	sceneNode.innerHTML = '';
	sceneNode.className = '';
	sceneNode.removeAttribute('style');
	cityNode.removeAttribute('style');

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
		this.on("ended", videoEnded);
	});
	videoNode.addEventListener('click', function() {
		videoNode.pause();
		videoEnded()
	})
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
	setAnimator( cityLoopRender );
	sceneNode.innerHTML = '';
	sceneNode.className = '';
	sceneNode.removeAttribute('style');
	cityNode.removeAttribute('style');
	cityHero.className = "stand";

	initCity();

	TweenMax.to( baseNode, .5, { opacity: 1 } );
}

function update() {
	animator();
	window.requestAnimationFrame(update);
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
