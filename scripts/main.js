const fs = require("fs");
const jsPath = "./scripts/";
const view = require(jsPath + 'view');
const events = require(jsPath + 'events');
const sounds = require(jsPath + 'sounds');
const util = require(jsPath + 'util');

var wavesurfer;
var keys;
var currentInstances = {};
var keyInfo = {};
var sI;

/**
 * Set up program
 **/
$(document).ready(function() {

	view.buildKeyboard();
	view.buildTransitionsList();
	view.buildWaveform();
	util.loadKeyInfo();
	events.setKeyEvents();

	$('.modal').modal();
	$('select').material_select();
	$('.editable').editable(function(value, settings) {
		return (value);
	}, {
		type: 'text'
	});

	createjs.Sound.on("fileload", sounds.fileLoaded);

});
