var wavesurfer;
var keys = $('.btn-key');

function init() {
    // Create wavesurfer instance
    wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'blue',
        progressColor: 'purple',
    });

    wavesurfer.empty();

}
/**
 * Click on button to play/pause audio
 **/
keys.on('click', function() {
    wavesurfer.playPause();
});

/**
 * Drag and Drop Audio onto keys
 **/
keys.on('dragover', function() {
    return false;
});
keys.on('dragleave', function() {
    return false;
});
keys.on('drop', function(e) {
    e.originalEvent.preventDefault();
    for (let f of e.originalEvent.dataTransfer.files) {
        document.getElementById(e.target.id).textContent = f.name;
        wavesurfer.load(f.path);
    };
    return false;
});

/**
 * Prevent dragging files onto page
 **/
$(document).on('drop', function(e) {
    e.preventDefault();
    return false;
});
$(document).on('dragover', function(e) {
    e.preventDefault();
    return false;
});
