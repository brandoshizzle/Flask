/* jshint esversion: 6 */
var settingsPageNum;

$(document).ready(function() {
    $('ul.tabs').on('click', 'a', function(e) {
        const classes = e.target.parentNode.classList;
        if (!classes.contains('disabled')) {
            switchPage(e);
        } else {
            M.toast({
                html:
					'<a href="https://www.brandoncathcart.com/flask" style="color:white">Buy Flask Pro to use all pages! <i class="material-icons">launch</i></a>'
            });
        }
    });
    $('ul.tabs').on('contextmenu', 'a', function(e) {
        var pageId = e.target.id;
        console.log(document.getElementById(pageId).parentElement);
        if (!pageId) {
            pageId = $(e.target)
                .closest('a')
                .prop('id');
        }
        if (document.getElementById(pageId).parentElement.classList.contains('disabled')) {
            M.toast({
                html:
					'<a href="https://www.brandoncathcart.com/flask" style="color:white">Buy Flask Pro to use all pages!  <i class="material-icons">launch</i></a>'
            });
        } else {
            settingsPageNum = pageId.substring(pageId.length - 1);
            ensurePageExists(settingsPageNum);
            settings.openPageSettings(settingsPageNum);
        }
    });

    $('#page-save-button').on('click', function(e) {
        settings.savePageSettings(settingsPageNum);
    });

    $('body').keydown(function(e) {
        if (e.which > 111 && e.which < 120) {
            e.preventDefault();
            var pageNum;
            switch (e.which) {
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

function registerKeyInfos() {
    Object.keys(pagesInfo).map(function(page, index) {
        var tempKeyInfo = pagesInfo[page].keyInfo;
        Object.keys(tempKeyInfo).map(function(id, index) {
            // Ensure all parameters are up to date
            storage.checkAgainstDefault(tempKeyInfo[id], 'soundInfo');
            if (tempKeyInfo[id].path === '' || id.charAt(4) != page.charAt(4)) {
                delete tempKeyInfo[id];
            } else {
                $('#' + tempKeyInfo[id].id)
                    .find('.audioName')
                    .text(tempKeyInfo[id].name);
                sounds.createNewHowl(tempKeyInfo[id]);
            }
        });
    });
}

function ensurePageExists(pageNum) {
    if (!pagesInfo.hasOwnProperty('page' + pageNum)) {
        pagesInfo['page' + pageNum] = {};
        storage.checkAgainstDefault(pagesInfo['page' + pageNum], 'pageInfo');
    }
}

function switchPage(e) {
    ensurePageExists(currentPage);
    const oldPageId = 'page' + currentPage;
    pagesInfo['page' + currentPage].keyInfo = keyInfo;
    $('#keyboard' + currentPage).hide();
    var pageId = e.target.id;
    if (!pageId) {
        pageId = $(e.target)
            .closest('a')
            .prop('id');
    }
    currentPage = pageId.substring(pageId.length - 1);
    ensurePageExists(currentPage);
    keyInfo = pagesInfo['page' + currentPage].keyInfo;
    $('#keyboard' + currentPage).show();
    var tabsInstance = M.Tabs.getInstance(document.getElementById('tabs'));
    document.querySelector(`#${oldPageId}`).classList.remove('active');
    document.querySelector(`#${pageId}`).classList.add('active');
    tabsInstance.select(pageId);
    tabsInstance.updateTabIndicator(pageId);
}

function loadNames() {
    for (var i = 1; i < 9; i++) {
        try {
            var name = pagesInfo['page' + i].name;
        } catch (e) {
            return;
        }
        if (name) {
            $('#page' + i + ' span').text(name);
        }
    }
}

function getFadeTime(pageInfo, direction) {
    if (direction === 'in') {
        if (pageInfo.fadeInTime === undefined) {
            return settingsInfo.pages.fadeInTime / 1000;
        } else {
            return pageInfo.fadeInTime / 1000;
        }
    } else if (direction === 'out') {
        if (pageInfo.fadeOutTime === undefined) {
            return settingsInfo.pages.fadeOutTime / 1000;
        } else {
            return pageInfo.fadeOutTime / 1000;
        }
    }
}

function disableExtraPages() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        if (tab.children[0].id !== 'page1') {
            tab.classList.add('disabled');
        }
    });
}

function enableExtraPages() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        if (tab.children[0].id !== 'page1') {
            tab.classList.remove('disabled');
        }
    });
}

module.exports = {
    registerKeyInfos: registerKeyInfos,
    disableExtraPages: disableExtraPages,
    enableExtraPages: enableExtraPages,
    ensurePageExists: ensurePageExists,
    switchPage: switchPage,
    loadNames: loadNames,
    getFadeTime: getFadeTime
};
