/* jshint esversion: 6 */

const ghLatestRelease = require('gh-latest-release');
var marked = require('marked');

$('#update-link').click(function(){
	$('#update-modal').modal('open');
});

function checkForUpdate(){

	ghLatestRelease('brandoshizzle/REACTion').then(
		function(release){
			if(!(release.prerelease === true && settingsInfo.general.prereleaseUpdates === false)){
				var rVersion = release.tag_name.substring(1);
				var cVersion = pjson.version;
				if(rVersion > cVersion){
					$('#update-cVersion').text(cVersion);
					$('#update-rVersion').text(rVersion);
					$('#update-date').text(release.published_at.substring(0, 10));
					$('#update-changelog').html(marked(release.body));
					$('#update-changelog > h2').remove();
					if(release.prerelease === true){
						$('#update-prerelease').text('PRE-RELEASE (MAY BE UNSTABLE)');
					} else {
						$('#update-prerelease').text('STABLE');
					}
					$('#download-btn').attr('href', release.html_url);
					$('#update-link').text('Update to v' + rVersion + "!");
				}
			}
		}
	);

}

module.exports = {
	checkForUpdate: checkForUpdate
};
