/*jshint esversion: 6 */
const fs = require("fs");
const jsPath = "./scripts/";
const clock = require(jsPath + "clock");
const colors = require(jsPath + 'colors');
const events = require(jsPath + 'events');
const pages = require(jsPath + 'pages');
const playlist = require(jsPath + 'playlist');
const settings = require(jsPath + 'settings');
const sounds = require(jsPath + 'sounds');
const storage = require(jsPath + 'storage');
const update = require(jsPath + 'update');
const util = require(jsPath + 'util');
const view = require(jsPath + 'view');
const waveforms = require(jsPath + "waveforms");
var pjson = require('../package.json');

const dialog = require('electron').remote.dialog;
const app = require('electron').remote.app;
const Shepherd = require('tether-shepherd');
var shell = require('electron').shell;

var wavesurfer;
var keys;
var waveformedInfo;
var keyInfo = {};
var pagesInfo = {};
var playlistInfo = {};
var settingsInfo = {};
var sI;
var currentPage = 1;
var debug = 1;
var totalNumSounds;
var pagesNumSounds = 0;
var ctrl = false;

/**
 * Set up program
 **/
$(document).ready(function() {
	update.checkForUpdate();
	view.buildKeyboard();		// Create all the keys
	view.buildPlaylist();		// Set up the playlist (no sounds)
	waveforms.buildWaveform();		// Set up the waveform
	$('.version').text(pjson.version);	// Add the version number to the "version" spans
	$('title').text('REACTion v' + pjson.version);	// Add the version number to the title
	createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin]);	// Default to HTML audio, not WebAudio (sigh)

	pagesInfo = storage.getInfoObj("pagesInfo");	// Load all of the key sounds from storage
	// If there is no pagesInfo object, try loading legacy keyInfo into first page
	pages.ensurePageExists(1);
	// Update all pages with any new properties
	Object.keys(pagesInfo).map(function(page, index) {
		storage.checkAgainstDefault(pagesInfo[page], 'pageInfo');
	});
	pages.registerKeyInfos(); // register all sounds and put them on keys
	keyInfo = pagesInfo.page1.keyInfo;	// load page 1 into active keyboard, aka keyInfo

	playlistInfo = storage.getInfoObj("playlistInfo");	// Load all of the playlist sounds from storage
	playlist.registerPlaylistItems();
	settingsInfo = storage.getInfoObj('settings');	// Load the program settings
	storage.checkAgainstDefault(settingsInfo, 'settings');
	console.log(settingsInfo);
	Object.keys(pagesInfo).map(function(page, index){
		pagesNumSounds += Object.keys(pagesInfo[page].keyInfo).length;
		console.log(pagesNumSounds);
	});
	totalNumSounds = Object.keys(playlistInfo).length + pagesNumSounds;
	events.setKeyEvents();	// Set up all the key presses/clicks/interaction
	clock.start();	// Start the clock
	colors.initializeKeyColors();	// Load all the key colors!

	$('.modal').modal();
	$(".menu-icon").sideNav({
		closeOnClick: true
	});
	// Set editable text properties
	$('.editable').editable(function(value, settings) {
		if (value === "") {
			return "Hit enter after typing!";
		} else {
			return value;
		}
	}, {
		type: 'text'
	});

	$('.global-settings-table').hide();
	$('#keyboard' + currentPage).show();

	$('.selectable').selectable({
		stop: function(){
				var selected = $('#settings-categories > .ui-selected').text().toLowerCase();
				console.log(selected);
				$('.global-settings-table').hide();
				$('#'+selected+"-table").show();
		}
	});

	// Set ability to move waveform region handles
	interact('#waveform-region')
		.resizable({
			preserveAspectRatio: false,
			edges: {
				left: true,
				right: true,
				bottom: false,
				top: false
			},
			restrict: {
				restriction: 'parent'
			}
		})
		.on('resizemove', function(event) {
			var target = event.target,
				x = (parseFloat(target.getAttribute('data-x')) || 0);
			// update the element's style
			target.style.width = event.rect.width + 'px';
			x += event.deltaRect.left;
			target.style.webkitTransform = target.style.transform =
				'translate(' + x + 'px, 0px)';
			target.setAttribute('data-x', x);
			$(event.target).css('transition', '0s');
		})
		.on('resizeend', function(event) {
			waveforms.getRegion();
			$(event.target).css('transition', '0.5s');
		});

		var dragStartPage;
    $( ".draggable" ).draggable({
			helper: 'clone',
			zIndex: 10000,
			cursor: 'move',
			distance: 10,
			opacity: 1,
			containment: '#keyboard' + currentPage,
			start: function(event, ui){
				dragStartPage = currentPage;
				console.log($(ui.target));
			},
			stop: function(event, ui){
				console.log(event.target.id);
			}
		});

		$( ".droppable" ).droppable({
      drop: function( event, ui ) {
        var targetId = event.target.id;	// Dropzone
				var draggedId = ui.draggable[0].id;	// Dragged
				console.log(draggedId + ", " + targetId);
				// Assign soundInfo objects
				var draggedInfo = pagesInfo['page' + dragStartPage].keyInfo[draggedId];
				var targetInfo = keyInfo[targetId];
				// switch the info objects
				keyInfo[targetId] = draggedInfo;
				pagesInfo['page' + dragStartPage].keyInfo[draggedId] = targetInfo;
				// switch the id's back
				keyInfo[targetId].id = targetId;
				try {
					pagesInfo['page' + dragStartPage].keyInfo[draggedId].id = draggedId;
					sounds.register(pagesInfo['page' + dragStartPage].keyInfo[draggedId]);
				} catch(err){
					draggedInfo = {};
					storage.checkAgainstDefault(draggedInfo, 'soundInfo');
					draggedInfo.id = draggedId;
					view.updateKey(draggedInfo);
					delete pagesInfo['page' + dragStartPage].keyInfo[draggedId];
				}
				// re-register the sounds
				sounds.register(keyInfo[targetId]);
				view.updateKey(keyInfo[targetId]);
				if(currentPage === dragStartPage && keyInfo[draggedId] !== undefined){
					keyInfo = pagesInfo['page'+currentPage].keyInfo;	// updates properly
					view.updateKey(keyInfo[draggedId]);
				}
      }
    });

		//open links externally by default
    $(document).on('click', 'a[href^="http"]', function(event) {
        event.preventDefault();
        shell.openExternal(this.href);
    });

	// Trigger file loaded event after each preloading
	createjs.Sound.on("fileload", sounds.fileLoaded);

});

function restart(){
	app.relaunch();
	app.quit();
}

window.onerror = function(msg, url, line, col, error) {
	var extra = !col ? '' : '\ncolumn: ' + col;
	extra += !error ? '' : '\nerror: ' + error;

	// You can view the information in an alert to see things working like this:
	dialog.showErrorBox('You broke REACTion :(', 'Please send this to the developer:\n' + msg + "\nurl: " + url + "\nline: " + line);
	//alert("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);

	var suppressErrorAlert = true;
	// If you return true, then error alerts (like in older versions of
	// Internet Explorer) will be suppressed.
	return suppressErrorAlert;
};

function blog(message) {
	if (debug === 1) {
		console.log(message);
	}
}
