// Playlist functions
/* jshint esversion: 6 */
var searchString;
var searchablePlaylistInfo;
var sortable;
var dontSet = true;

/**
 *	@desc:	Makes the playlist sortable - should probably make this also populate it
 *	@param:	soundInfo: The soundInfo object
 */
function buildPlaylist() {
    var el = document.getElementById('playlist-songs');
    sortable = Sortable.create(el, {
        animation: 50,
        onSort: function(evt) {
            updateColors(evt);
        },
        store: {
            /**
			 * Get the order of elements. Called once during initialization.
			 * @param   {Sortable}  sortable
			 * @returns {Array}
			 */
            get: function(sortable) {
                var order = settingsInfo.playlist.order;
                return order ? order.split('|') : [];
            },

            /**
			 * Save the order of elements. Called onEnd (when the item is dropped).
			 * @param {Sortable}  sortable
			 */
            set: function(sortable) {
                if (dontSet) {
                    return;
                }
                var order = sortable.toArray();
                settingsInfo.playlist.order = order.join('|');
                //storage.storeObj('settings', settingsInfo);
                M.toast({ html: 'Playlist order saved' });
                storage.saveShow();
            }
        }
    });
}

$(document).ready(function() {
    // Disable search function until it stops giving errors, then allow it
    $('#playlist-search').prop('disabled', true);
    searchablePlaylistInfo = util.cloneObj(playlistInfo);
    searchString = '//*[contains(name, "' + 'poop' + '")]';
    var testSearchInterval = setInterval(function() {
        try {
            var search = JSON.search(searchablePlaylistInfo, searchString);
        } catch (e) {
            return;
        }
        $('#playlist-search').prop('disabled', false);
        clearInterval(testSearchInterval);
    }, 200);
});

$('.search').on('keyup paste', function(e) {
    if (keyboardMap[e.which] === 'ENTER') {
        $('.search').blur();
        return false;
    }
    if ($('.search').val().length < 1) {
        $('.playlistSound').show();
        return;
    }
    if ($('.search').val().length > 1) {
        searchablePlaylistInfo = util.cloneObj(playlistInfo);
        Object.keys(searchablePlaylistInfo).map(function(prop, index) {
            delete searchablePlaylistInfo[prop].howl;
        });
    }
    searchString = '//*[contains(name, "' + $('.search').val() + '")]';
    var search = JSON.search(searchablePlaylistInfo, searchString);
    $('.playlistSound').each(function() {
        $(this).hide();
        $(this).css('background-color', 'var(--bgL)');
    });
    if (search.length > 0) {
        for (i = 0; i < search.length; i++) {
            $('#' + search[i].id).show();
            if (i === 0) {
                $('#' + search[i].id).css('background-color', 'var(--aM)');
            }
        }
    }
});

function updateColors(evt) {
    var first = true;
    var sounds = $('.playlistSound');
    // Go through each sound from first to where the dragged item was moved to
    for (i = 0; i < evt.newIndex + 2; i++) {
        if (sounds[i] === undefined) {
            return;
        }
        var style = window.getComputedStyle(sounds[i]);
        if (style.display !== 'none') {
            if (first) {
                $(sounds[i]).css('background-color', 'var(--aM)');
                first = false;
            } else {
                $(sounds[i]).css('background-color', 'var(--bgL)');
            }
        }
    }
}

function getFirstPlaylistItem() {
    var playlist = $('.playlistSound');
    for (var i = 0; i < playlist.length; i++) {
        var style = window.getComputedStyle(playlist[i]);
        if (style.display !== 'none') {
            return playlist[i].id;
        }
    }
    return 'no sounds!'; // Returns this if no results
}

function registerPlaylistItems() {
    Object.keys(playlistInfo).map(function(id, index) {
        if (id !== 'order') {
            // Ensure all parameters are up to date
            storage.checkAgainstDefault(playlistInfo[id], 'soundInfo');
            view.createPlaylistItem(playlistInfo[id]);
            $('#' + playlistInfo[id].id)
                .find('.audioName')
                .text(playlistInfo[id].name);
            sounds.createNewHowl(playlistInfo[id]);
        }
    });

    // Set Sortable list
    setOrder();
}

function empty() {
    $('#confirm-empty-modal').modal('open');
    $('#confirm-empty-modal-delete').click(function() {
        playlistInfo = {};
        $('#playlist-songs').empty();
        storage.saveShow();
    });
}

function moveSoundToBottom(id) {
    //$('#' + soundInfo.id).appendTo('#playlist-songs');
    $('#' + id).css('background-color', 'var(--bgL)');
    let order = sortable.toArray();
    order.push(order.shift());
    sortable.sort(order);
}

function saveOrder() {
    dontSet = false;
    sortable.save();
    dontSet = true;
    M.Dropdown.getInstance(document.getElementById('btn-playlist-actions')).close();
}

function setOrder() {
    sortable.sort(sortable.options.store.get(sortable));
    var first = true;
    var sounds = $('.playlistSound');
    // Reset colors properly
    for (i = 0; i < sounds.length; i++) {
        if (sounds[i] === undefined) {
            return;
        }
        var style = window.getComputedStyle(sounds[i]);
        if (style.display !== 'none') {
            if (first) {
                $(sounds[i]).css('background-color', 'var(--aM)');
                first = false;
            } else {
                $(sounds[i]).css('background-color', 'var(--bgL)');
            }
            $(sounds[i]).removeClass('played');
        }
    }
    M.Dropdown.getInstance(document.getElementById('btn-playlist-actions')).close();
    //$("#btn-playlist-actions").dropdown("close");
}

function shuffle() {
    var ul = document.querySelector('#playlist-songs');
    for (var i = ul.children.length; i >= 0; i--) {
        ul.appendChild(ul.children[(Math.random() * i) | 0]);
    }
    updateColors({ newIndex: ul.children.length - 1 });
}

function autoplayCheck() {
    if (!proLicense) {
        M.toast({
            html:
				'<a href="https://www.brandoncathcart.com/flask" style="color:white">Buy Flask Pro to autoplay your playlist! <i class="material-icons">launch</i></a>'
        });
    }
}

module.exports = {
    build: buildPlaylist,
    empty: empty,
    getFirstPlaylistItem: getFirstPlaylistItem,
    moveSoundToBottom: moveSoundToBottom,
    registerPlaylistItems: registerPlaylistItems,
    saveOrder: saveOrder,
    setOrder: setOrder,
    shuffle: shuffle
};
