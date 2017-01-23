$(document).ready(function(){
	$('ul.tabs').on('click', 'a', function(e) {
		pageId = e.target.id;
		pageNum = pageId.substring(pageId.length - 1);
		$.fn.pagepiling.moveTo(pageNum);
	});
});
