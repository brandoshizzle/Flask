$(document).ready(function(){
	$('ul.tabs').on('click', 'a', function(e) {
		var pageId = e.target.id;
		var pageNum = pageId.substring(pageId.length - 1);
		$.fn.pagepiling.moveTo(pageNum);
	});
	$('body').keydown(function(e){
		if(e.which > 111 && e.which < 120){
			var pageNum;
			switch(e.which){
				case 112:
					pageNum = 1;
					break;
				case 113:
					pageNum = 2;
					break;
				case 114:
					pageNum = 3;
					break;
				case 115:
					pageNum = 4;
					break;
				case 116:
					pageNum = 5;
					break;
				case 117:
					pageNum = 6;
					break;
				case 118:
					pageNum = 7;
					break;
				case 119:
					pageNum = 8;
					break;
			}
			$.fn.pagepiling.moveTo(pageNum);
			$('#page' + pageNum).click();
		}
	});
});
