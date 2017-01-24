/* jshint esversion: 6 */
//const soundInfoManager = require("./soundInfoManager");

$(document).ready(function(){
	$('ul.tabs').on('click', 'a', function(e) {
		ensurePageExists(currentPage);
		pagesInfo['page' + currentPage].keyInfo = keyInfo;
		var pageId = e.target.id;
		currentPage = pageId.substring(pageId.length - 1);
		ensurePageExists(currentPage);
		keyInfo = pagesInfo['page' + currentPage].keyInfo;
		console.log(keyInfo);
		$.fn.pagepiling.moveTo(currentPage);
	});

	$('body').keydown(function(e){
		if(e.which > 111 && e.which < 120){
			e.preventDefault();
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
			$('#page' + pageNum).click();
		}
	});
});

function registerKeyInfos(){
	console.log(pagesInfo);
	Object.keys(pagesInfo).map(function(id, index){
		var tempKeyInfo = pagesInfo[id].keyInfo;
		Object.keys(tempKeyInfo).map(function(id, index) {
			// Ensure all parameters are up to date
			storage.checkAgainstDefault(tempKeyInfo[id], 'soundInfo');
			$("#" + tempKeyInfo[id].id).find('.audioName').text(tempKeyInfo[id].name);
			sounds.register(tempKeyInfo[id]);
		});
	});
}

function ensurePageExists(pageNum){
	if(!pagesInfo.hasOwnProperty('page' + pageNum)){
		pagesInfo['page' + pageNum] = {};
		storage.checkAgainstDefault(pagesInfo['page' + pageNum], 'pageInfo');
	}
}

module.exports = {
	registerKeyInfos: registerKeyInfos,
	ensurePageExists: ensurePageExists
};
