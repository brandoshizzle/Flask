var wavesurfer;
var keys = $('.btn-key');

function init(){
  // Create wavesurfer instance
  wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'blue',
    progressColor: 'purple',
  });

  wavesurfer.empty();

}
/**
* Click on button, play/pause audio
**/
$(document).on('click', keys, function(){
  wavesurfer.playPause();
});

/**
* Drag and Drop Audio onto keys
**/
$(document).on('dragover', keys, function() {
  return false;
});
$(document).on('dragleave', keys,function(){
  return false;
});
$(document).on('drop', keys, function(e){
  e.originalEvent.preventDefault();
  for (let f of e.originalEvent.dataTransfer.files) {
    document.getElementById('Q').textContent = f.name;
    wavesurfer.load(f.path);
  };
  return false;
});
