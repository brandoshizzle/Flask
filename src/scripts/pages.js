/* jshint esversion: 6 */
//const soundInfoManager = require("./soundInfoManager");

$(document).ready(function(){
	$('ul.tabs').on('click', 'a', function(e){
		switchPage(e);
	});
	$('ul.tabs').on('contextmenu', 'a', function(e){
		var pageId = e.target.id;
		if(!pageId){
			pageId = $(e.target).closest('a').prop('id');
		}
		pageNum = pageId.substring(pageId.length - 1);
		ensurePageExists(pageNum);
		settings.openPageSettings(pageNum);
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
	Object.keys(pagesInfo).map(function(page, index){
		var tempKeyInfo = pagesInfo[page].keyInfo;
		Object.keys(tempKeyInfo).map(function(id, index) {
			// Ensure all parameters are up to date
			storage.checkAgainstDefault(tempKeyInfo[id], 'soundInfo');
			if(tempKeyInfo[id].path === ''){
				delete tempKeyInfo[id];
			} else {
				$("#" + tempKeyInfo[id].id).find('.audioName').text(tempKeyInfo[id].name);
				sounds.register(tempKeyInfo[id]);
			}
		});
	});
}

function ensurePageExists(pageNum){
	if(!pagesInfo.hasOwnProperty('page' + pageNum)){
		pagesInfo['page' + pageNum] = {};
		storage.checkAgainstDefault(pagesInfo['page' + pageNum], 'pageInfo');
	}
}

function switchPage(e) {
	ensurePageExists(currentPage);
	pagesInfo['page' + currentPage].keyInfo = keyInfo;
	$('#keyboard' + currentPage).hide();
	var pageId = e.target.id;
	if(!pageId){
		pageId = $(e.target).closest('a').prop('id');
	}
	currentPage = pageId.substring(pageId.length - 1);
	ensurePageExists(currentPage);
	keyInfo = pagesInfo['page' + currentPage].keyInfo;
	$('#keyboard' + currentPage).show();
	//$.fn.pagepiling.moveTo(currentPage);
}

module.exports = {
	registerKeyInfos: registerKeyInfos,
	ensurePageExists: ensurePageExists,
	switchPage: switchPage
};
