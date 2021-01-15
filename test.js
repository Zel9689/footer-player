const html = document.querySelector('html');
const media = document.querySelector('audio');
const controls = document.querySelector('.controls');

const title = document.querySelector('.media-title');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const listAuthor = document.querySelector('.list-author');
const listMedia = document.querySelector('.list-media');

// 做物件
var displaytime = new displayTime;
var playbtn = new playButton;
var progressbar = new progressBar;
var playbackrate = new playbackRate;
var volumebtn = new volumeButton;
var volumebar = new volumeBar;

// 預設icons
playbtn.element.querySelector('i').classList.add('fas', 'fa-play');
playbackrate.element.querySelector('i').classList.add('fas', 'fa-tachometer-alt');
volumebtn.element.querySelector('i').classList.add('fas', 'fa-volume-down');
prev.querySelector('i').classList.add('fas', 'fa-step-backward');
next.querySelector('i').classList.add('fas', 'fa-step-forward');
// Events
playbtn.element.addEventListener('click', () => playbtn.toggle());
progressbar.wrapper.addEventListener('mousedown', (e) => {
    if (progressbar.isSeeking === false) {
        progressbar.clientLeft = e.clientX - e.offsetX;
        console.log(e.offsetX)
        progressbar.isSeeking = true;
    }
    progressbar.seek(e);
});
html.addEventListener('mouseup', () => {
    if (progressbar.isSeeking === true) {
        progressbar.isSeeking = false;
    }
});
html.addEventListener('mousemove', (e) => progressbar.seek(e));

volumebtn.element.addEventListener('mouseover', () => volumebar.background.style='display: block;');
volumebar.background.addEventListener('mousedown', (e) => {
    if (volumebar.isChanging === false) {
        volumebar.clientLeft = e.clientX - e.offsetX;
        volumebar.clientTop = e.clientY - e.offsetY;
        console.log(volumebar.background.offsetTop + volumebar.background.offsetHeight)
        console.log(volumebar.background.offsetTop)
        console.log(volumebar.clientTop)
        volumebar.isChanging = true;
    }
    volumebar.change(e);
});
html.addEventListener('mouseup', () => {
    if (volumebar.isChanging === true) {
        volumebar.isChanging = false;
    }
});
html.addEventListener('mousemove', (e) => volumebar.change(e));

volumebtn.element.addEventListener('click', () => volumebtn.toggle());
media.addEventListener('canplay', () => displaytime.updateDuration());
media.addEventListener('timeupdate', () => {
    progressbar.barUpdate();
    displaytime.updateCurrent();
});
media.addEventListener('ended', () => playbtn.stop());


// 物件
function displayTime() {
    this.currentTime = document.querySelector('.current-time');
    this.totalTime = document.querySelector('.total-time');
    this.format = (time) => {
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        const minString = (min < 10) ? '0' + min.toString() : min.toString();
        const secString = (sec < 10) ? '0' + sec.toString() : sec.toString();
        return [minString, secString];
    }
    this.updateCurrent = () => {
        let X = this.format(media.currentTime);
        this.currentTime.innerHTML = X[0] + ':' + X[1];
    }
    this.updateDuration = () => {
        let X = this.format(media.duration);
        this.totalTime.innerHTML = X[0] + ':' + X[1];
    }
}

function playButton() {
    this.element = document.querySelector('.play');
    this.toggle = () => {
        if (media.paused) {
            this.element.querySelector('i').classList.add('fa-pause');
            this.element.querySelector('i').classList.remove('fa-play');
            media.play();
        } else {
            this.element.querySelector('i').classList.add('fa-play');
            this.element.querySelector('i').classList.remove('fa-pause');
            media.pause();
        }
    }
    this.stop = () => {
        this.element.querySelector('i').classList.add('fa-play');
        this.element.querySelector('i').classList.remove('fa-pause');
        media.pause();
        // media.currentTime = 0;
    }
}

function progressBar() {
    this.clientLeft = 0;
    this.wrapper = document.querySelector('.timer-wrapper');
    this.bar = document.querySelector('.progress-bar');
    this.circle = document.querySelector('.progress-circle');
    this.isSeeking = false;
    this.seek = (e) => {
        if (this.isSeeking === true) {
            // todo:改成用input實現
            let progress = (e.clientX - this.clientLeft)  / progressbar.wrapper.offsetWidth;
            (progress > 1)? progress = 1: '';
            (progress < 0)? progress = 0: '';
            media.currentTime = progress * media.duration;
            this.barUpdate();
        }
    }
    this.barUpdate = () => {
        this.bar.style.width = (media.currentTime / media.duration * 100).toString() + '%';
    }
}

function playbackRate() {
    this.element = document.querySelector('.rate');
    this.rate = [1.0, 1.5, 2.0];
    this.nextRate = () => {
        for (let i = 0; i < 3; i++) {
            if (media.playbackRate === this.rate[i]) {
                console.log('rate is right');
                media.playbackRate = this.rate[(i + 1) % 3];
                break;
            }
        }
    }
}

function volumeButton() {
    this.element = document.querySelector('.volume');
    this.toggle = () => {
        if (media.volume === 0) {
            this.element.querySelector('i').classList.add('fa-volume-down');
            this.element.querySelector('i').classList.remove('fa-volume-mute');
            media.volume = volumebar.percent;
        } else {
            this.element.querySelector('i').classList.add('fa-volume-mute');
            this.element.querySelector('i').classList.remove('fa-volume-down');
            media.volume = 0;
        }
    }
    this.iconUpdate = () => {
        if (media.volume === 0) {
            this.element.querySelector('i').classList.add('fa-volume-mute');
            this.element.querySelector('i').classList.remove('fa-volume-down');
        } else {
            this.element.querySelector('i').classList.add('fa-volume-down');
            this.element.querySelector('i').classList.remove('fa-volume-mute');
        }
    }
}

function volumeBar() {
    this.clientLeft = 0;
    this.clientTop = 0;
    this.background = document.querySelector('.percent-bar-background');
    this.bar = document.querySelector('.percent-bar');
    this.percent = 1.0;
    this.isChanging = false;
    this.barUpdate = () => {
        this.bar.style.height = (this.percent * 100).toString() + '%';
    }
    this.change = (e) => {
        if (this.isChanging === true) {
            // 改成橫的音量條
            // this.percent = (e.clientX - this.clientLeft)  / this.background.offsetWidth;
            // 改成直的音量條
            this.percent = 1 - (e.clientY - this.clientTop)  / this.background.offsetHeight;
            (this.percent > 1)? this.percent = 1: '';
            (this.percent < 0)? this.percent = 0: '';
            media.volume = this.percent;
            this.barUpdate();
        }
    }
}

var t = 0;
function test(){
    console.log('test' + t);
    t++;
}
html.addEventListener('mouseup', () => test());
