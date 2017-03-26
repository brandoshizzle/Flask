# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.3.0]
### Added
- Pause/stop option in General Settings
- Global Fade in and Fade out times
- Pressing 'ENTER' in playlist search un-focuses it
- Double click on waveform to play sound from that spot
- COPY/CUT/PASTE shortcuts to move keys around keyboards/pages
- Import multiple sounds at a time
- Mac build scripts
- Icons/background for Mac builds
- Page names have associated hotkey in name
- Sound resets after changing waveform region

### Changed
- License in "About" to Apache 2.0
- Order of menu items
- Sounds now "pause" by default (not stop)
- Minor color/visual fixes
- Updated Electron to 1.6.3
- Removed start/end from sound settings
- Can select unloaded keys
- Cannot launch sounds when holding CONTROL
- howls are not saved in json - fixed click-key-before-anything-else tracking weirdness (was because playState wasn't always null on launch)
- Switched to Howler.js for sound engine
- Removed looping, for now

### Fixed
- Settings now saving properly
- Sounds are marked as played when they end
- Playlist selects first sound after last one stops
- Empty playlist creates empty object and saves it to the json
- Can have periods and square brackets in sound names
- Sounds that don't load are correctly styled
- Deleting a song no longer breaks waveform sound name
- Deleting a song removed played class on key
- Empty playlist search error fixed
- Playlist songs playing that aren't on top are now stopped instead of top one playing
- 3D key box-shadow changes color properly
- Settings now updates with new properties properly
- Can have multiple of same sound in playlist

## [0.2.0] - 2017-01-28
### Added
- Search function for playlist
- Functioning/saving settings menu
    * Playlist: Songs to the bottom after playing
    * Playlist: Songs delete after playing
- Dragging keys around on the same page (between pages to come!)
- Automatically checks for new version on startup

### Fixed
- Won't try to play songs if they're all filtered out
- No more error on cancelling browse in sound settings
- Waveforms now track all the time (no need to sneak up)
- Inputs won't trigger sounds AT ALL

### Changed
- Storing data is now JSON in appData/data/

## [0.1.1] - 2017-01-21
### Added
- Restart option to menu
- Global settings (not working yet though)
- Error dialog (so errors show to user, not just in devTools)
- infoObj property to sounds ('key' or 'playlist')
- Screenshot to ReadMe

### Fixed
- Color setting is hidden for playlist items
- App quits when window is closed
- Errors no longer thrown for trying to play/open settings on key with no sound
- Cleaned ' and , out of sound ids (was breaking playlist)

### Changed
- Sound names on keys are slightly smaller
- HTML gets app version from package.json
- ReadMe information update
- More thoroughly documented previous code

## [0.1.0] - 2017-01-11
- init
