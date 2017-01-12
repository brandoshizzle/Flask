function startClock() {
	var today = new Date();
	var h = today.getHours();
	var m = today.getMinutes();
	var s = today.getSeconds();
	var ampm = 'AM';
	m = checkClock(m);
	s = checkClock(s);
	if (h > 11) {
		ampm = 'PM';
	}
	if (h > 12) {
		h -= 12;
	}
	$('#clock').text(h + ":" + m + ":" + s + " " + ampm);
	var t = setTimeout(startClock, 500);
}

function checkClock(i) {
	if (i < 10) {
		i = "0" + i;
	} // add zero in front of numbers < 10
	return i;
}

module.exports = {
	start: startClock
}
