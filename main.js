function init(){



}

function playSound(box){

  var mySound = new Howl({
    src: [box.innerHTML],
    preload: true,
    autoplay: false,
    loop: false
  });

  mySound.play();
}

/*******************************
**** Drag and Drop new audio ***
*******************************/
const holder = document.getElementById('holder');
holder.ondragover = () => {
  return false;
}
holder.ondragleave = holder.ondragend = () => {
  return false;
}
holder.ondrop = (e) => {
  e.preventDefault()
  for (let f of e.dataTransfer.files) {
    holder.textContent = f.path;
    console.log('File(s) you dragged here: ', f.path)
  }
  return false;
}
