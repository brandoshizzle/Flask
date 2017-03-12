// Playlist functions
/* jshint esversion: 6 */
var searchString;

//const soundInfoManager = require("./soundInfoManager");

$('.search').on('keyup paste', function(e){
	/*if(keyboardMap[e.which] === 'SPACE'){
		var firstPlaylistSound = getFirstPlaylistItem();
		sounds.playSound(playlistInfo[firstPlaylistSound]);
		searchString = $('.search').val();
		$('.search').val(searchString.substring(0,searchString.length-1)).blur();

		return false;
	}*/
	if(keyboardMap[e.which] === 'ENTER'){
			$('.search').blur();
			return false;
	}
	if($('.search').val().length < 1){
		$('.playlistSound').show();
		return;
	}
	searchString = '//*[contains(name, \"'+ $('.search').val() + '\")]';
	var search = JSON.search(playlistInfo, searchString);
	$('.playlistSound').each(function(){
		$(this).hide();
		$(this).css('background-color', 'var(--bgL)');
	});
	if(search.length > 0){
		for(i = 0; i < search.length; i++){
			$('#' + search[i].id).show();
			if(i === 0){
				$('#' + search[i].id).css('background-color', 'var(--aM)');
			}
		}
	}
});

function getFirstPlaylistItem(){
	var playlist = $('.playlistSound');
	for(var i = 0; i < playlist.length; i++){
		var style = window.getComputedStyle(playlist[i]);
		if(style.display !== 'none'){
			return playlist[i].id;
		}
	}
	return 'no sounds!'; // Returns this if no results
}

function registerPlaylistItems(){
	Object.keys(playlistInfo).map(function(id, index) {
		// Ensure all parameters are up to date
		storage.checkAgainstDefault(playlistInfo[id], 'soundInfo');
		view.createPlaylistItem(playlistInfo[id]);
		$("#" + playlistInfo[id].id).find('.audioName').text(playlistInfo[id].name);
		sounds.register(playlistInfo[id]);
	});
}

function empty(){
	storage.emptyObj('playlistInfo', playlistInfo);
	$('#playlist-songs').empty();
}


module.exports = {
	getFirstPlaylistItem: getFirstPlaylistItem,
	registerPlaylistItems: registerPlaylistItems,
	empty: empty
};
