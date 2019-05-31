const dialog = require('electron').remote.dialog;
const app = require('electron').remote.app;
const shell = require('electron').shell;
const jetpack = require('fs-jetpack');

const clock = require('./scripts/clock.js');
const colors = require('./scripts/colors');
const events = require('./scripts/events');
const pages = require('./scripts/pages');
const playlist = require('./scripts/playlist');
const settings = require('./scripts/settings');
const sounds = require('./scripts/sounds');
const storage = require('./scripts/storage');
const tutorial = require('./scripts/tutorial');
const update = require('./scripts/update');
const util = require('./scripts/util');
const view = require('./scripts/view');
const waveforms = require('./scripts/waveforms');
const pjson = require('../package.json');

var wavesurfer;
var dragSelect;
var keys;
var waveformedInfo;
var keyInfo = {};
var pagesInfo = {};
var playlistInfo = {};
var settingsInfo = {};
var volSlider;
var playlistPlayingSoundInfo;
var sI;
var currentPage = 1;
var totalNumSounds;
var pagesNumSounds = 0;
var reloadSound = false;

/* Set up program */
$(document).ready(function() {
    buildViews();
    loadPlugins();
    loadWaveformHandles();
    const lastLoadedShow = localStorage.getItem('lastOpenShow');
    if (lastLoadedShow) {
        loadShow(lastLoadedShow);
    } else {
        storage.newShow();
    }
    events.setKeyEvents();
    clock.startClock();

    // Set production settings for updating and errors
    if (process.env.DEV === false) {
        update.checkForUpdate();
        window.onerror = function(msg, url, line, col, error) {
            var extra = !col ? '' : '\ncolumn: ' + col;
            extra += !error ? '' : '\nerror: ' + error;

            // You can view the information in an alert to see things working like this:
            dialog.showErrorBox(
                'You broke FLASK :(',
                'Please send this to the developer:\n' + msg + '\nurl: ' + url + '\nline: ' + line
            );
            //alert("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);

            var suppressErrorAlert = true;
            // If you return true, then error alerts (like in older versions of
            // Internet Explorer) will be suppressed.
            return suppressErrorAlert;
        };
    }

    // open links externally by default
    $(document).on('click', 'a[href^="http"]', function(event) {
        event.preventDefault();
        shell.openExternal(this.href);
    });
});

function buildViews() {
    view.buildKeyboard(); // Create all the key buttons
    waveforms.buildWaveform(); // Initialize the waveform
    $('.version').text(pjson.version); // Add the version number to the "version" spans
    $('title').text(`Flask v${pjson.version}`); // Add the version number to the title
    $('.global-settings-table').hide();
}

function loadPlugins() {
    // Initialize Materialize Dropdown
    M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {
        constrainWidth: false, // Does not change width of dropdown to that of the activator
        coverTrigger: false, // Displays dropdown below the button
        alignment: 'right', // Displays dropdown with edge aligned to the left of button
        stopPropagation: false // Stops event propagation
    });
    // Initialize sidebar menu
    M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
    // Initialize tabs
    M.Tabs.init(document.querySelectorAll('.tabs'), {});
    // Set up tab scrolling
    $('.tabs').mousewheel((e, delta) => {
        this.scrollLeft -= delta * 40;
        e.preventDefault();
    });
    // Initialize all modals
    $('.modal').modal({
        opacity: 0.7
    });
    $('#settings-modal').modal({
        onCloseStart: () => {
            settings.saveSettings();
        }
    });
    $('#page-settings-modal').modal({
        onCloseStart: () => {
            settings.savePageSettings();
        }
    });
    $('#sound-settings-modal').modal({
        onCloseStart: () => {
            //$('#sound-settings-save').click();
        }
    });
    // Initialize select
    $('select').formSelect();
    $('select[name="colorpicker"]')
        .simplecolorpicker()
        .on('change', () => {
            colors.setPickedColor();
        });

    // Initialize edit-in-place text
    $('.editable').editable(
        (value, settings) => {
            if (value === '') {
                return 'Hit enter after typing!';
            }
            return value;
        },
        {
            type: 'text',
            tooltip: 'Click to edit'
        }
    );

    // Set switches to blur after clicking them
    $('.switch').click(e => {
        $(e.target).blur();
    });

    // Initialize drag selection of keys
    dragSelect = new DragSelect({
        selectables: document.querySelectorAll('.btn-key'),
        area: document.getElementById('keyboard-container')
    });
    // Initialize volume slider
    volSlider = document.getElementById('sound-settings-volume');
    noUiSlider.create(volSlider, {
        start: [100],
        connect: [true, false],
        step: 1,
        behaviour: 'drag',
        orientation: 'horizontal',
        range: {
            min: 0,
            max: 125
        },
        format: {
            to: value => {
                return `${Math.round(value)}%`;
            },
            from: value => {
                return value.replace('%', '');
            }
        }
    });
}

function loadWaveformHandles() {
    /*
	 *  WAVEFORM REGION INITIALIZATION
	 *  Yes, it gets its own section.
	 */
    $('#resize-handle-left').hide();
    $('#resize-handle-right').hide();
    waveforms.recalculateRegionHandle();
    interact('#waveform-region')
        .styleCursor(false)
        .resizable({
            manualStart: true,
            edges: { left: true, right: true, bottom: false, top: false },
            restrict: {
                restriction: 'parent'
            }
        })
        .on('resizemove', function(event) {
            const target = event.target;

            let x = parseFloat(target.getAttribute('data-x')) || 0;

            let y = parseFloat(target.getAttribute('data-y')) || 0;

            // update the element's style
            target.style.width = `${event.rect.width}px`;
            target.style.height = `${event.rect.height}px`;

            // translate when resizing from top or left edges
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform = `translate(${x}px,${y}px)`;

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
            if (event.edges.right) {
                moveHandler(event, document.getElementById('resize-handle-right'));
            } else if (event.edges.left) {
                moveHandler(event, document.getElementById('resize-handle-left'));
            }
            waveforms.recalculateRegionHandle();
        });
    interact('#resize-handle-right')
        .on('down', function(event) {
            const interaction = event.interaction;

            const handle = event.currentTarget;

            interaction.start(
                {
                    name: 'resize',
                    edges: {
                        right: handle.dataset.right
                    }
                },
                interact('#waveform-region'), // target Interactable
                document.getElementById('waveform-region')
            ); // target Element
        })
        .on('up', function(event) {
            waveforms.getRegion();
        });
    interact('#resize-handle-left')
        .on('down', function(event) {
            const interaction = event.interaction;

            const handle = event.currentTarget;

            interaction.start(
                {
                    name: 'resize',
                    edges: {
                        left: handle.dataset.left
                    }
                },
                interact('#waveform-region'), // target Interactable
                document.getElementById('waveform-region')
            ); // target Element
        })
        .on('up', function(event) {
            waveforms.getRegion();
        });
    function moveHandler(event, handlerElement) {
        const target = handlerElement;

        // keep the dragged position in the data-x/data-y attributes

        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;

        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform = target.style.transform = `translate(${event.rect.right}px, ${
            event.rect.bottom
        }px)`;

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }
}

function loadShow(pathToFile) {
    $('#loadedContainer').show();
    showInfo = JSON.parse(jetpack.read(pathToFile));
    let showName = pathToFile.split('\\').pop();
    showName = showName.substr(0, showName.length - 6);
    $('title').text(`Flask v${pjson.version} - ${showName}`); // Add the version number to the title

    console.log(pathToFile);
    sounds.resetLoadingBar();
    // Load settings
    //settingsInfo = storage.getInfoObj('settings'); // Load the program settings
    settingsInfo = showInfo.settingsInfo;
    storage.checkAgainstDefault(settingsInfo, 'settings');
    // Load pages
    //pagesInfo = storage.getInfoObj('pagesInfo');
    pagesInfo = showInfo.pagesInfo;
    // Update all pages with any new properties
    Object.keys(pagesInfo).map(function(page, index) {
        storage.checkAgainstDefault(pagesInfo[page], 'pageInfo');
    });
    // If there is no pagesInfo object, try loading legacy keyInfo into first page
    pages.ensurePageExists(1);
    // register all sounds and put them on keys
    pages.registerKeyInfos();
    pages.loadNames();
    // Load all the key colors!
    colors.initializeKeyColors();

    // load page 1 into active keyboard, aka keyInfo
    keyInfo = pagesInfo.page1.keyInfo;
    $(`#keyboard${currentPage}`).show();

    // Load saved playlist
    //playlistInfo = storage.getInfoObj('playlistInfo');
    playlistInfo = showInfo.playlistInfo;
    // Set up the playlist (visual, no howler instances)
    playlist.build();
    // Create howler instances for all playlist items
    playlist.registerPlaylistItems();

    // Get total number of sounds for loading bar
    // From pages:
    Object.keys(pagesInfo).map(function(page, index) {
        pagesNumSounds += Object.keys(pagesInfo[page].keyInfo).length;
    });
    // From playlist:
    totalNumSounds = Object.keys(playlistInfo).length - 1 + pagesNumSounds;
    // Hide on new project
    if (totalNumSounds === 0) {
        $('#loadedContainer').hide();
    }

    waveforms.load('');

    var tabsInstance = M.Tabs.getInstance(document.getElementById('tabs'));
    tabsInstance.select('page1');
    tabsInstance.updateTabIndicator();
    localStorage.setItem('lastOpenShow', pathToFile);
}

function restart() {
    app.relaunch();
    app.quit();
}
