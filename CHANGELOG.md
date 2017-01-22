# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
- Search function for playlist
- Functioning/saving settings menu
    * Playlist: Songs to the bottom after playing
    * Playlist: Songs delete after playing

### Fixed
- Error: can't play songs if they're all filtered out

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
