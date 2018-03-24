var PLANNING = 'p';
var FLYING = 'f';
var SPINNING = 's';

var WINGS_UP = 'u';
var WINGS_DOWN = 'd';
var Bird = function()
{
	// indicates if the bird is a robot or not,
	// that is, if it is keyboard/touch controllable
	this.user_controllable = true;
	this.geometry = new THREE.Geometry();
	this.geometry.vertices.push(
		new THREE.Vector3( -0.2,  0, 0 ),
		new THREE.Vector3( 0.2,  0, 0 ),
		new THREE.Vector3( 0, 0, 1 ));
	this.geometry.faces.push( new THREE.Face3( 1, 2, 0 ) );
	this.geometry.computeBoundingSphere();
	this.geometry.scale( OBJECT_SCALE, OBJECT_SCALE, OBJECT_SCALE );
	this.right_wing = new THREE.Mesh( this.geometry, new THREE.MeshBasicMaterial({color: BIRD_COLOR, side: THREE.DoubleSide}) );
	this.left_wing = new THREE.Mesh( this.geometry.clone(), new THREE.MeshBasicMaterial({color: BIRD_COLOR, side: THREE.DoubleSide}) );
	this.left_wing.geometry.scale(1,1,-1);

	this.debug = new THREE.Mesh(
		new THREE.PlaneBufferGeometry( 0.3, 0.2, 1 ),
		new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe:true }));
	this.debug.rotation.y = Math.PI / 2.0;
};
Bird.prototype.set_color = function( r, g, b )
{
	this.left_wing.material.color = new THREE.Color( r, g, b );
	this.right_wing.material.color = new THREE.Color( r, g, b );
};
Bird.prototype.update_debug_object = function()
{
	this.debug.position.x = this.left_wing.position.x;
	this.debug.position.y = this.left_wing.position.y;
	this.debug.position.z = this.left_wing.position.z;
};
Bird.prototype.body_x_angle = 0;
Bird.prototype.wings_angle = 0;
Bird.prototype.state = PLANNING;
Bird.prototype.fly_state = WINGS_UP;
Bird.prototype.add_to_scene = function ( scene )
{
	scene.add( this.left_wing );
	scene.add( this.right_wing );

	// scene.add( this.debug );
};
Bird.prototype.set_scale = function( value )
{
	this.left_wing.geometry.scale( value, value, value );
	this.right_wing.geometry.scale( value, value, value );
};
Bird.prototype.get_x = function()
{
	return this.left_wing.position.x;
};
Bird.prototype.get_y = function()
{
	return this.left_wing.position.y;
};
Bird.prototype.get_z = function()
{
	return this.left_wing.position.z;
};
Bird.prototype.set_x = function( value )
{
	this.left_wing.position.x = value;
	this.right_wing.position.x = value;
};
Bird.prototype.increase_y = function( value )
{
	this.left_wing.position.y += value;
	this.right_wing.position.y += value;

	if ( this.left_wing.position.y >= BOUNDS_Y )
	{
		this.left_wing.position.y = BOUNDS_Y;
		this.right_wing.position.y = BOUNDS_Y;
	}
	else if ( this.left_wing.position.y <= -BOUNDS_Y )
	{
		this.left_wing.position.y = -BOUNDS_Y;
		this.right_wing.position.y = -BOUNDS_Y;
	}
};
Bird.prototype.increase_z = function( value )
{
	this.left_wing.position.z += value;
	this.right_wing.position.z += value;

	if ( this.left_wing.position.z >= BOUNDS_X )
	{
		this.left_wing.position.z = BOUNDS_X;
		this.right_wing.position.z = BOUNDS_X;
	}
	else if ( this.left_wing.position.z <= -BOUNDS_X )
	{
		this.left_wing.position.z = -BOUNDS_X;
		this.right_wing.position.z = -BOUNDS_X;
	}
};
Bird.prototype.set_y = function( value )
{
	this.left_wing.position.y = value;
	this.right_wing.position.y = value;
};
Bird.prototype.set_z = function( value )
{
	this.left_wing.position.z = value;
	this.right_wing.position.z = value;
};
Bird.prototype.change_state = function()
{
	var old_state = this.state;
	var joystick_active = JOYSTICK.up||JOYSTICK.down||JOYSTICK.left ||JOYSTICK.right;
	var new_state = (KMAP[UP_KEY]||KMAP[DOWN_KEY]||KMAP[LEFT_KEY]||KMAP[RIGHT_KEY]||joystick_active) ? FLYING : PLANNING;
	if ( KMAP[X_KEY] )
	{
		new_state = SPINNING;
	}
	// resetting the wings angle if you are switching from
	// plane to fly
	if ( (old_state == PLANNING) && ( new_state == FLYING ) )
	{
		this.wings_angle = 0;
	}
	this.state = new_state;
};
Bird.prototype.update = function( delta )
{
	this.update_debug_object();

	this.left_wing.rotation.x = this.body_x_angle + this.wings_angle;
	this.right_wing.rotation.x = this.body_x_angle - this.wings_angle;
	if ( this.user_controllable )
	{
		this.change_state();
	}
	if ( this.state == PLANNING )
	{
		this.plane( delta );
	}
	else if ( this.state == FLYING )
	{
		this.fly( delta );
	}
	else if ( this.state == SPINNING )
	{
		this.spin( delta );
	}

	if ( this.body_x_angle >= Math.PI*2 )
	{
		this.body_x_angle = 0;
	}
};
/*
when x key is pressed. just sets the wings angle
and increases the body angle
*/
Bird.prototype.spin = function( delta )
{
	this.wings_angle = 0.2;
	this.body_x_angle += delta * 18;
	if ( KMAP[LEFT_KEY]||JOYSTICK.left )
	{
		this.increase_z( -1.5 * delta );
	}
	if ( KMAP[RIGHT_KEY]||JOYSTICK.right )
	{
		this.increase_z( 1.5 * delta );
	}
	if ( KMAP[DOWN_KEY]||JOYSTICK.down )
	{
		this.increase_y( -1.5 * delta );
	}
	if ( KMAP[UP_KEY]||JOYSTICK.up )
	{
		this.increase_y( 1.5 * delta );
	}
};
/*
smoothly makes the body rotates back to 0 radians.
this is used in flying/plane state
*/
Bird.prototype.fix_body_angle = function( delta )
{
	if ( this.body_x_angle != 0.0 )
	{
		// body_x_angle is negative only in left turn
		if ( this.body_x_angle < 0 )
		{
			this.body_x_angle += 4 * delta;
		}
		else
		{
			if ( this.body_x_angle >= Math.PI )
			{
				this.body_x_angle += 4 * delta;
			}
			else
			{
				this.body_x_angle -= 4 * delta;
			}
		}
	}
	if ( (this.body_x_angle > -0.1) && (this.body_x_angle < 0.1) )
	{
		this.body_x_angle = 0.0;
	}
};
/*
just randomize the wings angle
*/
Bird.prototype.plane = function( delta )
{
	this.wings_angle = lerp( 0.4, 0.5, Math.random() );
	this.fix_body_angle( delta );
};
Bird.prototype.fly = function( delta )
{
	var angle_increase;
	if ( this.fly_state == WINGS_UP )
	{
		angle_increase = 5;
		if ( this.wings_angle >= ANGLE_RANGE )
		{
			this.fly_state = WINGS_DOWN;
		}
	}
	else
	{
		angle_increase = -5;
		if ( this.wings_angle <= -ANGLE_RANGE )
		{
			this.fly_state = WINGS_UP;
		}
	}
	this.wings_angle += angle_increase * delta;

	if ( !this.user_controllable )
	{
		return;
	}

	if ( KMAP[LEFT_KEY]||JOYSTICK.left )
	{
		// angle limit
		if ( this.body_x_angle > -0.8 )
		{
			this.body_x_angle -= 0.25 * delta;
		}
		this.increase_z( 1.5 * -delta );
	}
	else if ( KMAP[RIGHT_KEY]||JOYSTICK.right )
	{
		if ( this.body_x_angle < 0.8 )
		{
			this.body_x_angle += 0.25 * delta;
		}
		this.increase_z( 1.5 * delta );
	}
	if ( KMAP[UP_KEY]||JOYSTICK.up )
	{
		this.increase_y( 1.5 * delta );
	}
	else if ( KMAP[DOWN_KEY]||JOYSTICK.down )
	{
		this.increase_y( -1.5 * delta );
	}

	// if the bird is not turning, fix the body angle
	if ( !(KMAP[LEFT_KEY]||JOYSTICK.left) && !(KMAP[RIGHT_KEY]||JOYSTICK.right) )
	{
		this.fix_body_angle( delta );
	}
};