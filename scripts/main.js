const fs = require("fs");
const jsPath = "./scripts/";
const view = require(jsPath + 'view');
const events = require(jsPath + 'events');
const sounds = require(jsPath + 'sounds');
const util = require(jsPath + 'util');
//const colors = require(jsPath + 'colors');

var wavesurfer;
var keys;
var currentInstances = {};
var keyInfo = {};
var transitionsInfo = {};
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
	util.startTime();
	//colors.setColors();

	$('.modal').modal();
	$('select').material_select();
	$(".menu-icon").sideNav();
	$('.editable').editable(function(value, settings) {
		if (value == "") {
			return "Hit enter after typing!";
		} else {
			console.log(value);
			return value;
		}
	}, {
		type: 'text'
	});

	createjs.Sound.on("fileload", sounds.fileLoaded);

});
