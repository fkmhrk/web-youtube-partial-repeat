var a;
class App {
    constructor() {
        this.onPlayerReady = this.onPlayerReady.bind(this);
        this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
        this.check = this.check.bind(this);
        this.checkID = 0;
        this.ractive = new Ractive({
            el: '#container',
            template: '#template',
            data: {
                videoID: 'JWb__K_Ae1M',
                startTimeSec: 7770,
                endTimeSec: 7843,
                currentTimeSec: 0,
            },
        });
        this.ractive.on({
            submit: () => {
                this.start();
            }
        });
    }
    start() {
        const videoID = this.ractive.get('videoID');
        const startTime = this.ractive.get('startTimeSec');
        const endTime = this.ractive.get('endTimeSec');
        if (videoID.length == 0)
            return;
        if (startTime >= endTime)
            return;
        this.startTime = startTime;
        this.endTime = endTime;
        this.done = false;
        if (this.player == null) {
            this.player = new YT.Player('player', {
                height: '360',
                width: '640',
                videoId: videoID,
                events: {
                    'onReady': this.onPlayerReady,
                    'onStateChange': this.onPlayerStateChange,
                }
            });
        }
        else {
            this.player.cueVideoById({
                videoId: videoID,
                startSeconds: this.startTime,
            });
        }
    }
    onPlayerReady(event) {
        event.target.seekTo(this.startTime, true);
        event.target.playVideo();
    }
    onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !this.done) {
            this.checkID = setInterval(this.check, 1000);
            this.done = true;
        }
        else if (event.data == YT.PlayerState.CUED) {
            this.player.playVideo();
        }
        // console.log(event);
    }
    check() {
        const currentTime = this.player.getCurrentTime();
        this.ractive.set('currentTimeSec', currentTime);
        if (currentTime > this.endTime) {
            this.player.seekTo(this.startTime, true);
        }
    }
}
function onYouTubeIframeAPIReady() {
    a = new App();
}
