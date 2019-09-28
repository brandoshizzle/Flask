/* jshint esversion: 6 */

const ghLatestRelease = require('gh-latest-release');
const compV = require('compare-versions');
var marked = require('marked');

$('#update-link').click(function() {
    $('#update-modal').modal('open');
});

function checkForUpdate() {
    ghLatestRelease('brandoshizzle/REACTion').then(function(release) {
        if (!(release.prerelease === true && settingsInfo.general.prereleaseUpdates === false)) {
            var rVersion = release.tag_name.substring(1);
            var cVersion = pjson.version;
            if (compV(rVersion, cVersion) === 1) {
                // NEWER VERSION DETECTED, POPULATE UPDATE FORM
                $('#update-cVersion').text(cVersion);
                $('#update-rVersion').text(rVersion);
                $('#update-date').text(release.published_at.substring(0, 10));
                $('#update-changelog').html(marked(release.body));
                $('#update-changelog > h2').remove();
                if (release.prerelease === true) {
                    $('#update-prerelease').text('PRE-RELEASE (MAY BE UNSTABLE)');
                } else {
                    $('#update-prerelease').text('STABLE');
                }
                $('#download-btn').attr('href', release.html_url);
                $('#update-link').text('Update to v' + rVersion + '!');
            } else if (settingsInfo.hasOwnProperty('utility')) {
                if (compV(pjson.version, settingsInfo.utility.pVersion)) {
                    // Flask has been updated and is being run for the first time!
                    $('#update-title').text('Flask Updated!');
                    $('#update-cVersion').text(pjson.version);
                    $('#update-rVersion').text(pjson.version);
                    $('#update-date').text(release.published_at.substring(0, 10));
                    $('#update-changelog').html(marked(release.body));
                    $('#update-changelog > h2').remove();
                    $('#download-btn').hide();
                    $('#update-link').text('Updated to v' + pjson.version + '!');
                    $('#build-type').hide();
                    $('#download-btn').hide();
                    $('#update-modal-footer a').text('Okay');

                    $('#update-modal').modal('open');
                    versionUpdates();
                    settingsInfo.utility.pVersion = pjson.version;
                    //storage.storeObj("settings", settingsInfo);
                    storage.saveShow();
                }
            }
        }
    });
}

function versionUpdates() {
    // This function will only be run if it's the user's first time with a new version

    // If coming from a version without sound, all sounds will be at 125% instead of 100%. Fix that.
    var allHigh = true;
    for (var page in pagesInfo) {
        for (var key in pagesInfo[page].keyInfo) {
            console.log(pagesInfo[page].keyInfo[key].volume);
            if (pagesInfo[page].keyInfo[key].volume < 1) {
                allHigh = false;
            }
        }
    }
    if (allHigh) {
        for (var page in pagesInfo) {
            for (var key in pagesInfo[page].keyInfo) {
                pagesInfo[page].keyInfo[key].volume = 0.8;
            }
        }
        for (var sound in playlistInfo) {
            playlistInfo[sound].volume = 0.8;
        }
        keyInfo = pagesInfo['page1'].keyInfo;
        //storage.storeObj('pagesInfo', pagesInfo);
        //storage.storeObj('playlistInfo', playlistInfo);
        storage.saveShow();
    }
}

module.exports = {
    checkForUpdate: checkForUpdate,
    versionUpdates: versionUpdates
};
