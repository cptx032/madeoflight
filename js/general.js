Array.prototype.choice = function()
{
	return this[Math.floor(Math.random()*this.length)];
};

function is_touch_supported()
{
	var msTouchEnabled = window.navigator.msMaxTouchPoints;
	var generalTouchEnabled = 'ontouchstart' in document.createElement('div');
 
	if (msTouchEnabled || generalTouchEnabled) {
		return true;
	}
	return false;
}

function lerp( a, b, x )
{
	return a + ( (b - a) * x );
}

function resize_canvas(canvas)
{
	var gameWidth = window.innerWidth;
	var gameHeight = window.innerHeight;
	var scaleToFitX = gameWidth / GAME_WIDTH;
	var scaleToFitY = gameHeight / GAME_HEIGHT;
	var currentScreenRatio = gameWidth / gameHeight;
	var optimalRatio = Math.min(scaleToFitX, scaleToFitY);
	canvas.style.width = GAME_WIDTH * optimalRatio + "px";
	canvas.style.height = GAME_HEIGHT * optimalRatio + "px";
}

function request_full_screen( element )
{
	if(element.requestFullscreen)
	{
		element.requestFullscreen();
	}
	else if(element.mozRequestFullScreen)
	{
		element.mozRequestFullScreen();
	}
	else if(element.webkitRequestFullscreen)
	{
		element.webkitRequestFullscreen();
	}
	else if(element.msRequestFullscreen)
	{
		element.msRequestFullscreen();
	}
}