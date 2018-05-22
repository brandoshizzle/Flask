/*	SOUNDS.JS
 *	These functions deal with anything related to the audio engine
 */
/*jshint esversion: 6 */

var firstPlaylistSound;
var loadedCount = 0;
var stopping = 0;

/**
 *	@desc:	Checks whether the sound path is valid and registers it with Hower
 *					Sounds that fail the path check get the soundNotLoaded class
 *	@param:	soundInfo: Object containing info related to the sound object
 */
function registerSound(soundInfo) {
    // Check if path to sound file exists
    if (fs.existsSync(soundInfo.path)) {
        // Register sound with Howler
        soundInfo.howl = new Howl({
            src: [soundInfo.path],
            loop: soundInfo.loop,
            html5: true,
            onend: function() {
                stop(soundInfo);
            },
            onload: function() {
                if (soundInfo.endTime === null) {
                    soundInfo.endTime = soundInfo.howl.duration();
                }

                loadedCount++;
                var loadedPercent = loadedCount / totalNumSounds * 100 + "%";
                $("#loadedCount").width(loadedPercent);
                if (loadedCount === totalNumSounds) {
                    $("#loadedContainer").css("display", "none");
                }
            },
            onplay: function() {
                var fadeTime = getFadeTime(soundInfo, "in");
                if (fadeTime >= 0) {
                    soundInfo.fadeIn();
                }
                soundInfo.paused = false;
                soundInfo.endCheck = setInterval(function() {
                    if (soundInfo.atEnding()) {
                        clearInterval(soundInfo.endCheck);
                        soundInfo.fadeOut();
                    }
                }, 50);
            },
            onpause: function() {
                soundInfo.paused = true;
                clearInterval(soundInfo.endCheck);
            },
            onstop: function() {
                soundInfo.paused = false;
                clearInterval(soundInfo.fadeInterval);
                clearInterval(soundInfo.endCheck);
                soundInfo.howl.seek(soundInfo.startTime);
                wavesurfer.seekTo(
                    soundInfo.startTime / soundInfo.howl.duration()
                );
            }
            /*
			onfade: function(){
				if(stopping){
					stop(soundInfo);
					stopping = false;
				}
			}*/
        });
    } else {
        // Let the user know with a toast
        Materialize.toast(soundInfo.name + " was not found.", 3000);
        $("#" + soundInfo.id).addClass("soundNotLoaded");
    }
}

/**
 *	@desc:	Plays a sound, creating a sound instance for it if necessary
 *	@param:	soundInfo: Object containing all sound information
 */
function playSound(soundInfo) {
    if (soundInfo.endTime == "0.00" || soundInfo.endTime == null) {
        soundInfo.endTime = sounds.getDuration(soundInfo);
    }
    if (settingsInfo.general.stopSounds === true) {
        //soundInfo.soundInstance.paused = false;
    }

    if (soundInfo.howl.playing()) {
        soundInfo.fadeOut();
        // Song is not playing, so play it.
    } else {
        play();
    }

    function play() {
        var key;
        if (soundInfo.infoObj === "playlist") {
            if (playlistPlayingSoundInfo !== undefined) {
                //console.log("playlist info is defined, fading out sound");
                playlistPlayingSoundInfo.fadeOut();
                return;
            }
            playlistPlayingSoundInfo = soundInfo;
        }
        // Sound is not paused, play it
        if (!soundInfo.paused) {
            soundInfo.howl.seek(soundInfo.startTime);
        }
        var fadeTime = getFadeTime(soundInfo, "in");
        soundInfo.howl.volume(fadeTime > 0 ? 0 : 1);

        // Fade out currently playing sounds if user has selected that option
        if (
            (settingsInfo.pages.soloSound === "pages" ||
                settingsInfo.pages.soloSound === "all") &&
            soundInfo.infoObj !== "playlist"
        ) {
            for (key in keyInfo) {
                if (keyInfo[key].howl.playing()) {
                    keyInfo[key].fadeOut();
                }
            }
        }
        if (settingsInfo.pages.soloSound === "all") {
            for (key in keyInfo) {
                if (keyInfo[key].howl.playing()) {
                    keyInfo[key].fadeOut();
                }
            }
            for (var item in playlistInfo) {
                if (playlistInfo[item].howl.playing()) {
                    playlistInfo[item].fadeOut();
                }
            }
        }
        soundInfo.howl.play();
        waveforms.track(soundInfo);
        $("#" + soundInfo.id).removeClass("played");
        $("#" + soundInfo.id).addClass("playing-sound");
    }
}

function stop(soundInfo) {
    if (!settingsInfo.general.stopSounds && !soundInfo.atEnding()) {
        soundInfo.howl.pause();
    } else {
        soundInfo.howl.stop();
        soundInfo.howl.seek(soundInfo.startTime);
    }
    waveforms.track(soundInfo, true);
    $("#" + soundInfo.id).removeClass("playing-sound");
    if (settingsInfo.general.markPlayed) {
        $("#" + soundInfo.id).addClass("played");
    }
    // If the song is stopped in the playlist
    if (soundInfo.infoObj === "playlist") {
        console.log("Stopping playlist item");
        playlistPlayingSoundInfo = undefined;
        console.log("Playlist Info is undefined");
        if (settingsInfo.playlist.soundDeleteAfterPlay) {
            delete playlistInfo[soundInfo.id];
            $("#" + soundInfo.id).remove();
            storage.storeObj("playlistInfo", playlistInfo);
        } else if (settingsInfo.playlist.soundToBottomAfterPlay) {
            $("#" + soundInfo.id).appendTo("#playlist-songs");
            $("#" + soundInfo.id).css("background-color", "var(--bgL)");
            firstPlaylistSound = playlist.getFirstPlaylistItem();
            $("#" + firstPlaylistSound).css("background-color", "var(--aM)");
        }
        $("#" + firstPlaylistSound).click();
    }
}

/**
 *	@desc:	Finds the duration of the sound instance in the sound info object
 *	@param:	soundInfo: The soundInfo object
 */
function getDuration(soundInfo) {
    // Assumes a sound instance exists - should be true (fingers crossed)
    return (soundInfo.howl.duration() / 1000).toFixed(2);
}

function defaultSoundInfo() {
    return {
        id: "",
        infoObj: "",
        name: "",
        path: "",
        color: "default",
        loop: false,
        startTime: 0,
        endTime: null,
        volume: 0.8,
        playlistPosition: undefined,
        fadeIn: function() {
            if (this.atEnding()) {
                sounds.stop(this);
            }
            var duration = getFadeTime(this, "in");
            this.fadeInterval = setInterval(() => {
                var newVol = this.howl.volume() + this.volume * 50 / duration;
                if (newVol >= this.volume) {
                    newVol = this.volume;
                    this.howl.volume(newVol);
                    clearInterval(this.fadeInterval);
                    return;
                }
                this.howl.volume(newVol);
            }, 50);
        },
        fadeOut: function() {
            var duration = getFadeTime(this, "out");
            clearInterval(this.fadeInterval);
            if (duration === 0) {
                sounds.stop(this);
                return;
            }
            if (this.atEnding()) {
                duration = (this.endTime - this.howl.seek()) * 1000;
            }
            this.fadeInterval = setInterval(() => {
                var newVol = this.howl.volume() - this.volume * 50 / duration;
                if (newVol <= 0) {
                    newVol = 0;
                    this.howl.volume(newVol);
                    clearInterval(this.fadeInterval);
                    sounds.stop(this);
                    return;
                }
                this.howl.volume(newVol);
            }, 50);
        },
        fadeInterval: undefined,
        fadeInTime: undefined,
        fadeOutTime: undefined,
        atEnding: function() {
            var fadeT = getFadeTime(this, "out");
            return this.howl.seek() + fadeT / 1000 > this.endTime;
        }
    };
}

function getFadeTime(soundInfo, direction) {
    if (soundInfo.infoObj === "playlist") {
        if (direction === "in") {
            if (soundInfo.fadeInTime === undefined) {
                return settingsInfo.general.fadeInTime;
            } else {
                return soundInfo.fadeInTime;
            }
        } else if (direction === "out") {
            if (soundInfo.fadeOutTime === undefined) {
                return settingsInfo.general.fadeOutTime;
            } else {
                return soundInfo.fadeOutTime;
            }
        }
    } else {
        var currentPageInfo = pagesInfo["page" + currentPage];
        if (direction === "in") {
            if (soundInfo.fadeInTime !== undefined) {
                return soundInfo.fadeInTime;
            } else if (currentPageInfo.fadeInTime !== undefined) {
                return currentPageInfo.fadeInTime;
            } else {
                return settingsInfo.general.fadeInTime;
            }
        } else if (direction === "out") {
            if (soundInfo.fadeOutTime !== undefined) {
                return soundInfo.fadeOutTime;
            } else if (currentPageInfo.fadeOutTime !== undefined) {
                return currentPageInfo.fadeOutTime;
            } else {
                return settingsInfo.general.fadeOutTime;
            }
        }
    }
}

module.exports = {
    register: registerSound,
    playSound: playSound,
    getDuration: getDuration,
    stop: stop,
    defaultSoundInfo: defaultSoundInfo,
    getFadeTime: getFadeTime
};
