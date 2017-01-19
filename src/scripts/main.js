/*jshint esversion: 6 */
const fs = require("fs");
const jsPath = "./scripts/";
const clock = require(jsPath + "clock");
const colors = require(jsPath + 'colors');
const events = require(jsPath + 'events');
const sounds = require(jsPath + 'sounds');
const storage = require(jsPath + 'storage');
const util = require(jsPath + 'util');
const waveforms = require(jsPath + "waveforms");
const view = require(jsPath + 'view');

const app = require('electron').remote.app;

var wavesurfer;
var keys;
var keyInfo = {};
var playlistInfo = {};
var sI;
var debug = 1;

/**
 * Set up program
 **/
$(document).ready(function() {

	view.buildKeyboard();
	view.buildPlaylist();
	waveforms.buildWaveform();
	createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin]);
	keyInfo = storage.getInfoObj("keyInfo", keyInfo);
	playlistInfo = storage.getInfoObj("playlistInfo", playlistInfo);
	blog(keyInfo);
	blog(playlistInfo);
	events.setKeyEvents();
	clock.start();
	colors.initializeKeyColors();
	$('.modal').modal();
	$('select').material_select();
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

	// Trigger file loaded event after each preloading
	createjs.Sound.on("fileload", sounds.fileLoaded);

});

function restart(){
	app.relaunch();
	app.quit();
}

function blog(message) {
	if (debug === 1) {
		console.log(message);
	}
}
