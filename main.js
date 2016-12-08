var wavesurfer;
const holder = document.getElementById('holder');

function init(){



}

function playSound(box){
  mySound.play();
  wavesurfer.playPause();
}

/*******************************
**** Drag and Drop new audio ***
*******************************/
holder.ondragover = () => {
  return false;
}
holder.ondragleave = holder.ondragend = () => {
  return false;
}
holder.ondrop = (e) => {
  e.preventDefault();
  for (let f of e.dataTransfer.files) {
    holder.textContent = f.name;
    wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'blue',
      progressColor: 'purple'
    });
    wavesurfer.load(f.path);
  }
  return false;
}
