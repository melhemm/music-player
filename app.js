new Vue({
    el: "#app",
    data() {
        return {
            tracks: [{
                    name: "7 rings",
                    artist: "Ariana Grande",
                    img: "./images/bbbb.jpg",
                    source: "./songs/ariana_drwick.mp3"
                },
                {
                    name: "Theme Song",
                    artist: "Grand Theft Auto IV",
                    img: "./images/hqdefault.jpg",
                    source: "./songs/GTA IV - The Theme From Grand Theft Auto IV.mp3"
                },
                {
                    name: "Mirrors",
                    artist: "Justin Timberlake",
                    img: './images/Justin-Timberlake-Mirrors.jpg',
                    source: "./songs/mirrors.mp3"
                },
                {
                    name: "Take It",
                    artist: "Dom Dolla",
                    img: './images/dom-dolla.png',
                    source: "./songs/dom-dolla-take-it.mp3"
                },
                {
                    name: "Coolio",
                    artist: "Gangsta's Paradise",
                    img: './images/Gangsta.jpg',
                    source: "./songs/coolio.mp3"
                },
            ],
            audio: null,
            circleLeft: null,
            barWidth: null,
            currentTime: null,
            isTimerPlaying: false,
            currentTrack: null,
            currentTrackIndex: 0,
        };
    },
    methods: {
        play() {
            if (this.audio.paused) {
                this.audio.play();
                this.isTimerPlaying = true;
            } else {
                this.audio.pause();
                this.isTimerPlaying = false;
            }
        },
        prevTrack() {
            this.isShowCover = false;
            if (this.currentTrackIndex > 0) {
                this.currentTrackIndex--;
            } else {
                this.currentTrackIndex = this.tracks.length - 1;
            }
            this.currentTrack = this.tracks[this.currentTrackIndex];
            this.resetPlayer();
        },
        nextTrack() {
            this.isShowCover = false;
            if (this.currentTrackIndex < this.tracks.length - 1) {
                this.currentTrackIndex++;
            } else {
                this.currentTrackIndex = 0;
            }
            this.currentTrack = this.tracks[this.currentTrackIndex];
            this.resetPlayer();
        },
        generateTime() {
            let width = (100 / this.audio.duration) * this.audio.currentTime;
            this.barWidth = width + "%";
            this.circleLeft = width + "%";
            let durmin = Math.floor(this.audio.duration / 60);
            let dursec = Math.floor(this.audio.duration - durmin * 60);
            let curmin = Math.floor(this.audio.currentTime / 60);
            let cursec = Math.floor(this.audio.currentTime - curmin * 60);

            if (durmin < 10) {
                durmin = "0" + durmin;
            }
            if (dursec < 10) {
                dursec = "0" + dursec;
            }
            if (curmin < 10) {
                curmin = "0" + curmin;
            }
            if (cursec < 10) {
                cursec = "0" + cursec;
            }
            this.duration = durmin + ":" + dursec;
            this.currentTime = curmin + ":" + cursec;
        },
        updateBar(x) {
            let progress = this.$refs.progress;
            let maxduration = this.audio.duration;
            let position = x - progress.offsetLeft;
            let percentage = (100 * position) / progress.offsetWidth;
            if (percentage > 100) {
                percentage = 100;
            }
            if (percentage < 0) {
                percentage = 0;
            }
            this.barWidth = percentage + "%";
            this.circleLeft = percentage + "%";
            this.audio.currentTime = (maxduration * percentage) / 100;
            this.audio.play();
        },
        clickProgress(e) {
            this.isTimerPlaying = true;
            this.audio.pause();
            this.updateBar(e.pageX);
        },
        resetPlayer() {
            this.barWidth = 0;
            this.circleLeft = 0;
            this.audio.currentTime = 0;
            this.audio.src = this.currentTrack.source;
            setTimeout(() => {
            if (this.isTimerPlaying){this.audio.play();
                } else {
                    this.audio.pause();
                }
            }, 1000);
        },
    },
    created() {
        let song = this;
        this.currentTrack = this.tracks[0];
        this.audio = new Audio();
        this.audio.src = this.currentTrack.source;
        this.audio.ontimeupdate = function () {
            song.generateTime();
        };
        this.audio.onloadedmetadata = function () {
            song.generateTime();
        };
        this.audio.onended = function () {
            song.nextTrack();
            this.isTimerPlaying = true;
        };
    },
});