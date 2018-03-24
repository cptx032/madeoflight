var PARTICLE_LIGHT = 1;
var MAX_PARTICLES = 10;
/*
attrs: {
	x: <float>
	y: <float>
	z: <float>
	velx: <float>
	type: <int>
}
*/
var ParticleEmitter = function( attrs )
{
	/*
	fixme:
		1. when the particle is destroyed your
		material must be disposed
	*/
	// position
	this.x = attrs.x;
	this.y = attrs.y;
	this.z = attrs.z;
	this.type = attrs.type;

	// velocity (always greater than 0)
	this.velx = attrs.velx|0;

	// 'particles' has 'MAX_PARTICLES' THREE.Mesh objects
	this.particles = [];
	var i = MAX_PARTICLES;
	var cube;
	while ( i-- )
	{
		cube = get_cube( attrs.color );
		this.restart_position( cube );
		cube.material.opacity = i / MAX_PARTICLES;
		this.particles.push( cube );
	}
};
ParticleEmitter.prototype.restart_position = function( cube )
{
	// the random factor in opengl units
	var min = 0.3;
	var max = min * 4;
	cube.position.x = this.x + lerp(min, max, Math.random());
	cube.position.y = this.y + lerp(min, max, Math.random());
	cube.position.z = this.z + lerp(min, max, Math.random());
};
ParticleEmitter.prototype.add_to_scene = function( scene )
{
	var i = this.particles.length;
	while ( i-- )
	{
		scene.add( this.particles[i] );
	}
};
ParticleEmitter.prototype.is_colliding = function()
{
	var sizex = BIRD_X_SIZE / 2.0;
	var sizey = BIRD_Y_SIZE / 2.0;
	// the size of particle is '1'
	if (!(((MAIN_BIRD.get_x() + sizex) >= (this.x - 0.5)) && ((MAIN_BIRD.get_x() - sizex) <= (this.x + 0.5))))
	{
		return false;
	}
	if (!(((MAIN_BIRD.get_y() + sizey) >= (this.y - 0.5)) && ((MAIN_BIRD.get_y() - sizey) <= (this.y + 0.5))))
	{
		return false;
	}
	return ((MAIN_BIRD.get_z() + sizex) >= (this.z - 0.5)) && ((MAIN_BIRD.get_z() - sizex) <= (this.z + 0.5));
};
ParticleEmitter.prototype.update = function( delta )
{
	var i = MAX_PARTICLES;
	this.x += this.velx * delta;
	if ( this.x <= -1 ) // '-1' is the size of cube
	{
		this.x = CUBE_ROW_SIZE;
	}
	while (i--)
	{
		var particle = this.particles[i];
		this.restart_position( particle );
		particle.position.x += (MAX_PARTICLES - i) * 0.3;

		particle.material.opacity -= delta * 0.5;
		if ( particle.material.opacity <= 0.0 )
		{
			// restart
			particle.material.opacity = 0.8;
			// this.restart_position( particle );
		}
	}
	if (this.is_colliding())
	{
		this.process_colission();
	}
};
ParticleEmitter.prototype.process_colission = function()
{
	//
};