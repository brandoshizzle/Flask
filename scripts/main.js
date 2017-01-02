/*jshint esversion: 6 */
const fs = require("fs");
const jsPath = "./scripts/";
const view = require(jsPath + 'view');
const events = require(jsPath + 'events');
const sounds = require(jsPath + 'sounds');
const storage = require(jsPath + 'storage');
const util = require(jsPath + 'util');
//const colors = require(jsPath + 'colors');

var wavesurfer;
var keys;
var currentInstances = {};
var keyInfo = {};
var transitionsInfo = {};
var sI;
var debug = 1;

/**
 * Set up program
 **/
$(document).ready(function() {

	view.buildKeyboard();
	view.buildTransitionsList();
	view.buildWaveform();
	keyInfo = storage.getInfoObj("keyInfo");
	events.setKeyEvents();
	util.startTime();
	//colors.setColors();

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
