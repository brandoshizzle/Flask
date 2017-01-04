/*jshint esversion: 6 */
const fs = require("fs");
const jsPath = "./scripts/";
const view = require(jsPath + 'view');
const events = require(jsPath + 'events');
const sounds = require(jsPath + 'sounds');
const storage = require(jsPath + 'storage');
const util = require(jsPath + 'util');
const colors = require(jsPath + 'colors');

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
	view.buildWaveform();
	keyInfo = storage.getInfoObj("keyInfo", keyInfo);
	playlistInfo = storage.getInfoObj("playlistInfo", playlistInfo);
	blog(keyInfo);
	blog(playlistInfo);
	events.setKeyEvents();
	util.startTime();
	colors.initializeKeyColors();

	$('.modal').modal();
	$('select').material_select();
	$(".menu-icon").sideNav();
	$('.editable').editable(function(value, settings) {
		if (value === "") {
			return "Hit enter after typing!";
		} else {
			blog(value);
			return value;
		}
	}, {
		type: 'text'
	});

	createjs.Sound.on("fileload", sounds.fileLoaded);

});

function blog(message) {
	if (debug === 1) {
		console.log(message);
	}
}
