DEBUG_DIV = document.getElementById('debug');
LEVEL_NAME_DIV = document.getElementById('level-name');
///////////////////////////////////////////////////////////////////////
JOYSTICK = new JoyStick({
	radius:80, x: 100,
	y: window.innerHeight - 100,
	visible: false,
	inner_radius: 50
});
///////////////////////////////////////////////////////////////////////
document.body.addEventListener("keyup", function(evt)
{
	KMAP[evt.keyCode] = false;
	if ( KMAP[LEFT_KEY]||KMAP[RIGHT_KEY]||KMAP[UP_KEY]||KMAP[DOWN_KEY] )
	{
		evt.preventDefault();
	}
}, false);
document.body.addEventListener("keydown", function(evt)
{
	KMAP[evt.keyCode] = true;
	if ( KMAP[LEFT_KEY]||KMAP[RIGHT_KEY]||KMAP[UP_KEY]||KMAP[DOWN_KEY] )
	{
		evt.preventDefault();
	}
}, false);

MATERIAL_MESH_SIDED = new THREE.MeshBasicMaterial({color: BIRD_COLOR, side: THREE.DoubleSide});
CUBE_GEOMETRY = new THREE.BoxBufferGeometry( 1, 1, 1 );
CUBE_MATERIAL = new THREE.MeshBasicMaterial({ color: CUBE_COLOR, wireframe: false });
///////////////////////////////////////////////////////////////////////
scene = new THREE.Scene();
var aspect = GAME_WIDTH / GAME_HEIGHT;
var camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
var clock = new THREE.Clock();
clock.start();
// optimized:
// var renderer = new THREE.WebGLRenderer({ precision: "mediump", devicePixelRatio:1, antialias:false });
var renderer = new THREE.WebGLRenderer( { antialias : false } );
renderer.setSize( GAME_WIDTH, GAME_HEIGHT );
renderer.setClearColor( 0xdddddd ); // rain: dddddd
scene.fog = new THREE.Fog(renderer.getClearColor(), 0.0, 35);
//////////////////////////////////////////////
var loading_manager = new THREE.LoadingManager();
loading_manager.onProgress = function ( item, loaded, total )
{
	// if (loaded == total)
	// {
	// 	ASSETS_LOADED = true;
	// }
};
//////////////////////////////////////////////

var audioListener = new THREE.AudioListener();
camera.add( audioListener );
var background_music = new THREE.Audio( audioListener );
scene.add( background_music );

 // fixme: temporary
document.body.appendChild( renderer.domElement );

if ( is_touch_supported() )
{
	var action_button = new JoyStickButton({
		x: window.innerWidth - 70,
		y: window.innerHeight - 100,
		mouse_support:false,
		radius: 50,
		func: function() {
			KMAP[X_KEY] = true;
		}
	});
	action_button.bind('touchend', function(){
		KMAP[X_KEY] = false;
	});
	action_button.bind('mouseup', function(){
		KMAP[X_KEY] = false;
	});
}
////////////////////////////////////////
var json_loader = new THREE.JSONLoader( loading_manager );
	// loading default cube
	json_loader.load(
	// resource URL
	'cube.js',
	// Function when resource is loaded
	function ( geometry, materials )
	{
		CUBE_ROW_GEOMETRY = geometry;
		CUBE_ROW_GEOMETRY.computeBoundingBox();
		CUBE_ROW_SIZE = CUBE_ROW_GEOMETRY.boundingBox.max.x;
		load_level( get_level() );
		ASSETS_LOADED = true;
		show_level_name( _(LEVELS[ get_level() ].name) );
	}
);

////////////////////////////////////
MAIN_BIRD = new Bird();
MAIN_BIRD.set_y( 3 );
MAIN_BIRD.add_to_scene( scene );
var b1 = new Bird();
b1.set_scale(0.8);
b1.set_color(0.2,0.2,0.2);
b1.user_controllable = false;
b1.state = FLYING;
b1.set_y(4);
b1.add_to_scene( scene );
camera.rotation.y = -1.6;
camera.position.x = -1.0;

// independent movement
var delta;

var stats = new Stats();
stats.showPanel( 0 );
document.body.appendChild( stats.dom );
if ( is_touch_supported() )
{
	JOYSTICK.__create_fullscreen_div();
}
function update_camera()
{
	camera.position.y = MAIN_BIRD.get_y() + 0.3;
	camera.position.z = MAIN_BIRD.get_z();
}
var render = function ()
{
	requestAnimationFrame( render );
	stats.begin();
	delta = clock.getDelta();
	if ( !ASSETS_LOADED )
	{
		return;
	}
	renderer.render( scene, camera );
	////////////////////////////////////////////////
	var i = CUBE_ROWS.length;
	var col = false;
	while ( i-- )
	{
		CUBE_ROWS[ i ].increase_x( -5.0 * delta );
		CUBE_ROWS[ i ].increase_y( 10.0 * delta );
		if ( CUBE_ROWS[ i ].is_colliding() )
		{
			col = true;
		}
	}
	if (col)
	{
		CUBE_MATERIAL.color.r = 1.0;
	}
	else
	{
		CUBE_MATERIAL.color.r = 0.2039;
	}
	/////////////////////////////////////////////////
	i = PARTICLES.length;
	while ( i-- )
	{
		PARTICLES[ i ].update( delta );
	}
	/////////////////////////////////////////////////
	MAIN_BIRD.update( delta );
	b1.update( delta );
	update_camera();
	stats.end();
};

render();

resize_canvas(renderer.domElement);
renderer.domElement.style.display = 'table';
renderer.domElement.style.margin = 'auto';
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0';
renderer.domElement.style.bottom = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.right = '0';