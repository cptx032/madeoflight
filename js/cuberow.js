var VERTICAL = 'v';
var HORIZONTAL = 'h';
var CubeRow = function( x, y, z, size_x, size_y, size_z, cube_row_type )
{
	/*
	if type is 'HORIZONTAL' the offset is applied in x axis
	else if applied in y axis
	*/
	this.cube_row_type = cube_row_type;
	this.first = new THREE.Mesh( CUBE_ROW_GEOMETRY, CUBE_MATERIAL );
	this.first.position.x = x;
	this.first.position.y = y;
	this.first.position.z = z;
	this.first.scale.x = size_x;
	this.first.scale.y = size_y;
	this.first.scale.z = size_z;

	this.second = new THREE.Mesh( CUBE_ROW_GEOMETRY, CUBE_MATERIAL );
	this.second.position.z = z;
	this.second.scale.x = size_x;
	this.second.scale.y = size_y;
	this.second.scale.z = size_z;

	if ( this.cube_row_type == HORIZONTAL )
	{
		this.second.position.y = this.first.position.y;
		this.second.position.x = this.first.position.x + CUBE_ROW_SIZE;
	}
	else if ( this.cube_row_type == VERTICAL )
	{
		this.first.position.y = 0;
		this.second.position.y = -CUBE_ROW_SIZE;
		this.second.position.x = this.first.position.x;

		this.first.rotation.z = Math.PI / 2.0;
		this.second.rotation.z = Math.PI / 2.0;
	}
	else
	{
		console.log( 'ERRO AO PROCESSAR TIPO DE CUBEROW' );
	}

	var nx, ny;
	if ( this.cube_row_type == HORIZONTAL )
	{
		nx = this.first.scale.z * 2.0;
		ny = this.first.scale.y * 2.0;
	}
	else
	{
		ny = this.first.scale.z * 2.0;
		nx = this.first.scale.y * 2.0;
	}
	this.x_bound = nx;
	this.y_bound = ny;

	this.debug = new THREE.Mesh(
		new THREE.PlaneBufferGeometry( nx, ny, 1 ),
		new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe:true }));
	if ( this.cube_row_type == VERTICAL )
	{
		this.debug.rotation.x = Math.PI / 2;
	}
	else {
		this.debug.rotation.y = Math.PI / 2;
	}
};
/*
bird is a vector object (THREE.Vector3D)
*/
CubeRow.prototype.is_colliding = function()
{
	// the idea behind this IFs is not evaluate a group of boolean
	// statements if just one is not true;
	this.update_debug_object();
	var sizex = BIRD_X_SIZE / 2.0;
	var sizey = BIRD_Y_SIZE / 2.0;
	if ( (MAIN_BIRD.get_z()-sizex) < (this.first.position.z+(this.x_bound/2)) )
	{
		if ( (MAIN_BIRD.get_z() + sizex) > (this.first.position.z-(this.x_bound/2)) )
		{
			if ( this.cube_row_type == VERTICAL )
			{
				if ( (MAIN_BIRD.get_x() + sizey) > (this.first.position.x-this.y_bound) )
				{
					if ( (MAIN_BIRD.get_x() - sizey) < (this.first.position.x+this.y_bound) )
					{
						return true;
					}
				}
			}
			else
			{
				if ( (MAIN_BIRD.get_y() + sizey) > (this.first.position.y-(this.y_bound/2)) )
				{
					if ( (MAIN_BIRD.get_y() - sizey) < (this.first.position.y+(this.y_bound/2)) )
					{
						return true;
					}
				}
			}
		}
	}
	return false;
};
CubeRow.prototype.update_debug_object = function()
{
	if ( this.cube_row_type == VERTICAL )
	{
		this.debug.position.x = this.first.position.x;
		this.debug.position.z = this.first.position.z;
		this.debug.position.y = 0;
	}
	else {
		this.debug.position.x = 4;
		this.debug.position.y = this.first.position.y;
		this.debug.position.z = this.first.position.z;
	}
};
CubeRow.prototype.add_to_scene = function( scene )
{
	scene.add( this.first );
	scene.add( this.second );
	// scene.add( this.debug );
};
CubeRow.prototype.increase_y = function( value )
{
	if ( this.cube_row_type == VERTICAL )
	{
		// fixme: fix to not increase 'second'
		// but do like HORIZONTAL CubeRow
		this.first.position.y += value;
		this.second.position.y += value;

		if ( this.first.position.y >= CUBE_ROW_SIZE )
		{
			this.first.position.y = -CUBE_ROW_SIZE;
		}
		if ( this.second.position.y >= CUBE_ROW_SIZE )
		{
			this.second.position.y = -CUBE_ROW_SIZE;
		}
	}
};
CubeRow.prototype.increase_x = function( value )
{
	this.first.position.x += value;

	if ( this.first.position.x < this.second.position.x )
	{
		this.second.position.x = this.first.position.x + CUBE_ROW_SIZE;
	}
	else
	{
		this.second.position.x = this.first.position.x - CUBE_ROW_SIZE;
	}

	if ( this.cube_row_type == HORIZONTAL )
	{
		if ( this.first.position.x <= -CUBE_ROW_SIZE )
		{
			this.first.position.x = CUBE_ROW_SIZE;
		}
		if ( this.second.position.x <= -CUBE_ROW_SIZE )
		{
			this.second.position.x = CUBE_ROW_SIZE;
		}
	}
	else if ( this.cube_row_type == VERTICAL )
	{
		if ( (this.first.position.x + this.first.scale.y) < 0 )
		{
			this.first.position.x = VERTICAL_LIMIT;
			this.second.position.x = VERTICAL_LIMIT;

			// putting it in front the main bird
			this.first.position.z = MAIN_BIRD.left_wing.position.z;
			this.second.position.z = MAIN_BIRD.left_wing.position.z;
		}
	}
};