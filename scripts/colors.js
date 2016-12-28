var primary = "blue";
var pMain = 5;
var pDark = 9;
var pLight = 4;
var secondary = "yellow";
var background = "blue-gey darken-4";

var pc = 'var(--oc-' + primary + '-' + pMain + ')';
var pcL = 'var(--oc-' + primary + '-' + pLight + ')';
var pcD = 'var(--oc-' + primary + '-' + pDark + ')';

function setColors() {
	// 1. Body color
	$("body").addClass(background);
	// 2. Button colors
	$(".btn-key").css('background-color', pc);
	$(".btn-key").hover(
		function() {
			$(this).css('background-color', pcL);
		},
		function() {
			$(this).css('background-color', pc);
		}
	);
	$(".btn-key").css('box-shadow', '0px 4px 0px 0px ' + pcD)
		// 3. Tab colors
	$(".tabs .tab a").addClass(primary + "-text").removeClass(secondary);
	$(".tabs .tab a:hover, .tabs .tab a.active").addClass(secondary);
	$(".tabs .indicator").css("background-color", primary);

}

$(".tabs").click(function() {
	// 3. Tab colors
	$(".tabs .tab a").addClass(primary + "-text").removeClass(secondary);
	$(".tabs .tab a:hover, .tabs .tab a.active").addClass(secondary);
	$(".tabs .indicator").css("background-color", primary);
});
/*

	.tabs.tab.disabled a, .tabs.tab.disabled a: hover {
		color: rgba(102, 147, 153, 0.7);
	}
	.tabs.indicator {
		background - color: #009BAD;


}

*/



module.exports = {
	setColors: setColors
};
