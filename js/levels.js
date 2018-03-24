/*
// levels structure:
var LEVEL01 = {
	name: '<string key in dictionary>',
	grid: [a list of list, each list has the arguments of constructor of CubeRow object],
	bounds: [x, y],
	particles: [a list of args of ParticleEmitter constructor]
};
*/
var LEVEL_01 = {
	// the entry in dict
	name: 'level_01_title',
	grid: [
		[0, 0, 10, 1, 100, 2, HORIZONTAL], // down
		[0, 0, -10, 1, 100, 2, HORIZONTAL], // up
		[0, 5, 2, 1, 1, 1, HORIZONTAL],
		[0, 3, -4, 1, 1, 1, HORIZONTAL],
		[0, 8, -1, 1, 1, 2, HORIZONTAL],
		[0, -5, -1, 1, 1, 1, HORIZONTAL]
	],
	bounds: [8, 30],
	particles: [
		{x:20, y:0, z:0, velx:-5, type:PARTICLE_LIGHT, color: 0xE4F1FE}
	]
};
var LEVELS = [
	LEVEL_01
];

function set_level( level_index )
{
	localStorage.level = level_index;
}
function get_level()
{
	if ( localStorage.level == null )
	{
		set_level( 0 );
	}
	return localStorage.level;
}

function load_level( index )
{
	// fixme:
	//	1. clear CUBE_ROWS
	//	2. reset bird position
	//	3. remove the cubes from renderer
	//	4. load 'items'

	// loading the 'grid'
	var points_i = LEVELS[ index ].grid.length;
	var row;
	var p;
	while ( points_i-- )
	{
		p = LEVELS[ index ].grid[points_i];
		row = new CubeRow( p[0], p[1], p[2], p[3], p[4], p[5], p[6] );
		CUBE_ROWS.push(row);
		row.add_to_scene(scene);
	}
	// setting the bounds of level
	BOUNDS_X = LEVELS[ index ].bounds[0];
	BOUNDS_Y = LEVELS[ index ].bounds[1];
	// loading the particles
	points_i = LEVELS[ index ].particles.length;
	var particle_emitter;
	while ( points_i-- )
	{
		particle_emitter = new ParticleEmitter( LEVELS[ index ].particles[ points_i ] );
		particle_emitter.add_to_scene( scene );
		PARTICLES.push( particle_emitter );
	}
}