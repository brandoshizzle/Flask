/* jshint esversion: 6 */

const ghLatestRelease = require('gh-latest-release');
const compV = require('compare-versions');
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
				console.log(rVersion);
				console.log(cVersion);
				console.log(compV(rVersion, cVersion))
				if(compV(rVersion, cVersion) === 1){
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

function versionUpdates(){
	if(!settingsInfo.utility.firstOpen){
		return;
	}

	// If coming from a version without sound, all sounds will be at 125% instead of 100%. Fix that.
	var allHigh = true;
	for(var page in pagesInfo){
		for(var key in pagesInfo[page].keyInfo){
			if(pagesInfo[page].keyInfo[key].volume < 1){
				allHigh = false;
			}
		}
	}
	if(allHigh){
		for(var page in pagesInfo){
			for(var key in pagesInfo[page].keyInfo){
				pagesInfo[page].keyInfo[key].volume = 0.8;
			}
		}
	}
	
	/*
	var changelog = fs.readFileSync("./CHANGELOG.md", "utf8");
	var pVersion = settingsInfo.utility.pVersion;
	var cVersion = pjson.version;
	$('#update-cVersion').text(cVersion);
	$('#update-rVersion').text(pVersion);
	$('#update-changelog').html(marked(changelog));
	$('#update-changelog > h2').remove();
	$('#update-link').text('Update to v' + pVersion + "!");
	settingsInfo.utility.pVersion = cVersion;
	$('#update-modal').modal('open');
	*/
	settingsInfo.utility.firstOpen = false;
	settingsInfo.utility.pVersion = cVersion;
	storage.storeObj("settings", settingsInfo);
}

module.exports = {
	checkForUpdate: checkForUpdate,
	versionUpdates: versionUpdates
};
