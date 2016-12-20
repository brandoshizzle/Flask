const fs = require("fs");
const jsPath = "./scripts/";
const view = require(jsPath + 'view');
const events = require(jsPath + 'events');
const sounds = require(jsPath + 'sounds');

var wavesurfer;
var keys;
var keyInfo = {};
var lastLoadedPath
var currentInstances = {};
var waveformTracking = false;
var sI;

/**
 * Set up program
 **/
$(document).ready(function() {

	//createInterface();
	view.buildKeyboard();
	view.buildTransitionsList();
	view.buildWaveform();
	sounds.loadSavedSounds();
	events.setKeyEvents();

	createjs.Sound.on("fileload", sounds.fileLoaded);

});
