function startHopscotch() {
    // Define the tour!
    var tour = {
        id: 'tutorial',
        bubbleWidth: 600,
        showPrevButton: true,
        steps: [
            {
                title: 'Hi! This is Flask.',
                content: 'Let\'s take a quick tour of the features together.',
                target: 'page1_F',
                placement: 'bottom',
                onShow: function() {
                    $('.hopscotch-bubble-arrow-container').css('visibility', 'hidden');
                }
            },
            {
                title: 'The Keyboard',
                content: `This is the keyboard.<br>
                 - <b>Drag files</b> onto the keys to assign sounds<br>
                 - <b>Press the key on your keyboard</b> to start and stop the sound<br>
                 - <b>Right-click</b> to open that sound's settings<br>
                 `,
                target: 'keyboard1',
                xOffset: 'center',
                placement: 'bottom'
            },
            {
                title: 'Pages',
                content: `Flask has 8 pages to store sounds on, each with its own keyboard.<br>
                - <b>Press F1-F8</b> to quickly jump to that page<br>
                - <b>Right-click</b> the tab to open the page's settings`,
                target: 'tabs',
                placement: 'bottom'
            },
            {
                title: 'The Playlist',
                content: `A list of songs all played by the space bar.<br>
                - <b>Drag files</b> into the playlist to add them, and drag them to reorder them<br>
                - <b>Press SPACE</b> to play the top song on the playlist.<br>
                - <b>Press SPACE again</b> to stop it.<br>
                - <b>Right-click</b> on the sounds to bring up their options<br>
                - Playlist behaviour is very configurable - check out the settings for all the ways it can be configured!`,
                target: 'playlistBox',
                yOffset: 'center',
                placement: 'left'
            },
            {
                title: 'The Waveform',
                content: `Flask loads the waveform of a selected song.<br>
                - <b>Click on a sound</b> to show it's waveform<br>
                - <b>Drag the edge</b> to choose start and end points for the sound!`,
                target: 'waveform-box',
                placement: 'top'
            },
            {
                title: 'You Rock. Don\'t Ever Change.',
                content: `Explore further to unlock the full potential of Flask.<br><br>
                        Thanks for using Flask!  Have a great show :)`,
                target: 'page1_F',
                placement: 'bottom',
                onShow: function() {
                    $('.hopscotch-bubble-arrow-container').css('visibility', 'hidden');
                }
            }
        ]
    };

    M.Sidenav.getInstance($('.sidenav')).close();
    $('#startup-modal').modal('close');
    // Start the tour!
    hopscotch.startTour(tour, 0);
}

module.exports = {
    startHopscotch: startHopscotch
};
