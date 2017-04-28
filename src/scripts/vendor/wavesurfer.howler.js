/**
*   Overwrites WaveSurfer native functions to allow for unloaded audio to seek properly
*/

WaveSurfer.seekTo = function (progress) {
    this.fireEvent('interaction', this.seekTo.bind(this, progress));

    var paused = this.backend.isPaused();
    // avoid draw wrong position while playing backward seeking
    if (!paused) {
        this.backend.pause();
    }
    // avoid small scrolls while paused seeking
    var oldScrollParent = this.params.scrollParent;
    this.params.scrollParent = false;
    console.log('Wavesurfer duration: ' + this.getDuration());
    this.backend.seekTo(progress * this.getDuration());
    this.drawer.progress(progress);

    if (!paused) {
        this.backend.play();
    }
    this.params.scrollParent = oldScrollParent;
    this.fireEvent('seek', progress);
};

WaveSurfer.WebAudio.getDuration = function () {
    if (!this.buffer) {
        if(waveformedInfo){
            return waveformedInfo.howl.duration();
        }
        return 0;
    }

    return this.buffer.duration;
}
