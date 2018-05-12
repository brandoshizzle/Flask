# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased
### Changed
- Misc fonts/logos related to new name
- JEditable updated to v2.02

## [0.5.0] - 2018-05-09
### Added
- Panic switch (Global stop) by pressing ESCAPE
- Solo sound options - choose to auto-stop playing sounds when a new sound starts

### Fixed
- Fixed issue with playlist not switching song after fade out
- General refactoring and cleaning of code

### Changed
- Name (Wowee!)
- Removed dragging of keys
- Enlarged the playlist box vertically
- Upgraded to Interact.js v1.3.3
- Upgraded Howler.js to v2.0.10
- Updated npm package dependencies

## [0.4.1] - 2017-05-25
### Added
- Playlist: Dropdown on playlist header to access action items
- Playlist: Can set initial order via playlist dropdown
- Playlist: Can reset to initial order via dropdown
- Playlist: Empty Playlist now has confirmation dialogue

### Fixed
- Fade times now work properly with 0 seconds
- Playlist settings no longer stored after dragging/drop sounds within playlist
- Reduced playlist animation time to improve performance

### Changed
- Settings menu: Visual redesign
- Settings menu: Saves when exiting (no need to save explicitly anymore)
- Updated Sortable.js to v1.5.1

## [0.4.0] - 2017-05-07
### Added
- Sound Settings: Set/remove 'Played' status
- General Settings: Mark sounds as played (or not)
- Pages: Page names and page fade in/out times by right/ctrl-clicking on tab
- Pages: Scroll on page tabs to get overflow pages
- Menu: Tutorial option that links to YouTube video

### Fixed
- Sound settings "cannot read proprty 'name' of undefined" error
- Deleting sound "cannot read property '0' of undefined" error
- Deleting sound removes playing and soundNotLoaded classes
- Waveform shows playhead at proper location after loading waveform

## [0.3.2] - 2017-04-22
### Fixed
- Playlist: Space key doesn't create error when no sounds in playlist
- Playlist: Sounds dragged out of top spot no longer stay yellow
- Playlist: Search doc error fixed

### Changed
- Opening sound options no longer loads the waveform
- Playlist: new sounds are added above already played sounds
- Playlist: When loading multiple sounds, waveform of first sound shows
- Keyboard: When loading multiple sounds, waveform of first sound shows

## [0.3.1] - 2017-04-08
### Added
- OS X build

### Changed
- Updated interact.js to v1.2.8 (solved darwin issues)
- Backspace also deletes keys (solved darwin issues)

### Fixed
- Removed error when clicking on key with no sound
- Loading bar is removed if 0 sounds
- Copy/paste on darwin
- Temp fix for random waveformedInfo seek error after ctrl/cmd+X
- Pasting a song removes 'played' status

## [0.3.0] - 2017-04-07
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
- Removed start/end from sound settings
- Can select unloaded keys
- Cannot launch sounds when holding CONTROL
- howls are not saved in json - fixed click-key-before-anything-else tracking weirdness (was because playState wasn't always null on launch)
- Switched to Howler.js for sound engine
- Removed looping, for now
- Added text-shadow to emphasize key text
- Updated Materialize to v0.98.1
- Updated jQuery to v3.2.1
- Updated Wavesurfer to v1.3.7
- Updated Electron to 1.6.4

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
- Waveforms are not loaded when stopping or pausing a sound

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
