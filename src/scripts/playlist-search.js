// Playlist search function
var searchString;

$('.search').on('keyup paste', function(e){
	if(keyboardMap[e.which] === 'SPACE'){
		var firstPlaylistSound = getFirstPlaylistItem();
		sounds.playSound(playlistInfo[firstPlaylistSound]);
		searchString = $('.search').val();
		$('.search').val(searchString.substring(0,searchString.length-1)).blur();

		return false;
	}
	searchString = '//*[contains(name, \"'+ $('.search').val() + '\")]';
	var search = JSON.search(playlistInfo, searchString);
	console.log(search);
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
}

module.exports = {
	getFirstPlaylistItem: getFirstPlaylistItem
};
