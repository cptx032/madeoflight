var __DICT = {
	'pt' : {
		'level_01_title' : 'A fenda Phrixus'
	},
	'en' : {
		'level_01_title' : 'Phrixus Gap'
	}
};
/////////////////////////////////////////////////
function get_language()
{
	if ( localStorage.language == null )
	{
		set_language( 'en' );
	}
	return localStorage.language;
}
function set_language( language )
{
	localStorage.language = language;
}
/////////////////////////////////////////////////
function _( key )
{
	return __DICT[get_language()][key];
}