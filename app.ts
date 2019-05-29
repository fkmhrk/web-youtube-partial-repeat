var a: App;
declare var YT: any;
declare class Ractive {
  constructor(params: any);
  on(params: any): void;
  get(key: string): any;
  set(values: any): void;
  set(key: string, value: any): void;
}

class App {
  private ractive: Ractive;
  private player: any;
  private done: boolean;
  private checkID: number;
  private startTime: number;
  private endTime: number;

  constructor() {
    this.onPlayerReady = this.onPlayerReady.bind(this);
    this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
    this.check = this.check.bind(this);
    this.checkID = 0;

    this.ractive = new Ractive({
      el: "#container",
      template: "#template",
      data: {
        videoID: "JWb__K_Ae1M",
        startTimeSec: 7770,
        endTimeSec: 7843,
        currentTimeSec: 0,
      },
    });
    this.ractive.on({
      submit: () => {
        this.start();
      },
    });
    this.readParamsFromQuery();
  }

  private readParamsFromQuery() {
    const a = document.createElement("a") as HTMLAnchorElement;
    a.href = window.location.href;
    let s = a.search;
    if (s.length == 0) return;
    s = s.substr(1);
    const paramsList = s.split("&").map((p: string) => p.split("=", 2));
    const params = paramsList.reduce((p: any, keyValue: string[]) => {
      const key = keyValue[0];
      if (key == "id") {
        p["videoID"] = keyValue[1];
      } else if (key == "s") {
        p["startTimeSec"] = parseInt(keyValue[1]);
      } else if (key == "e") {
        p["endTimeSec"] = parseInt(keyValue[1]);
      }
      return p;
    }, {});
    this.ractive.set(params);
  }

  private start() {
    const videoID = this.ractive.get("videoID");
    const startTime = this.ractive.get("startTimeSec");
    const endTime = this.ractive.get("endTimeSec");
    if (videoID.length == 0) return;
    if (startTime >= endTime) return;
    this.startTime = startTime;
    this.endTime = endTime;

    this.done = false;
    if (this.player == null) {
      this.player = new YT.Player("player", {
        height: "360",
        width: "640",
        videoId: videoID,
        events: {
          onReady: this.onPlayerReady,
          onStateChange: this.onPlayerStateChange,
        },
      });
    } else {
      this.player.cueVideoById({
        videoId: videoID,
        startSeconds: this.startTime,
      });
    }
  }

  private onPlayerReady(event: any) {
    event.target.seekTo(this.startTime, true);
    event.target.playVideo();
  }

  private onPlayerStateChange(event: any) {
    if (event.data == YT.PlayerState.PLAYING && !this.done) {
      this.checkID = setInterval(this.check, 1000);
      this.done = true;
    } else if (event.data == YT.PlayerState.CUED) {
      this.player.playVideo();
    }
    // console.log(event);
  }

  private check() {
    const currentTime = this.player.getCurrentTime();
    this.ractive.set("currentTimeSec", currentTime);
    if (currentTime > this.endTime) {
      this.player.seekTo(this.startTime, true);
    }
  }
}
function onYouTubeIframeAPIReady() {
  a = new App();
}
