"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const uOverlay = () => "../../uni_modules/uview-plus/components/u-overlay/u-overlay.js";
const uLoadingIcon = () => "../../uni_modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _sfc_main = {
  "name": "super-video",
  components: {
    uOverlay,
    uLoadingIcon,
    store: store_index.store
  },
  //用计算属性来实现当速率为1时，显示“倍速”
  computed: {
    ratedisplay() {
      if (this.rate == 1) {
        return "倍速";
      } else {
        return this.rate + "x";
      }
    }
  },
  data() {
    return {
      canvasContext: null,
      canvasWidth: 640,
      canvasHeight: 480,
      videoUrl: "",
      videoBlockX: 0,
      //video组件的坐标
      videoBlockY: 0,
      imageUrl: "/static/wuqi.png",
      clickPos: {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
      },
      currWaterMark: {
        //当前水印信息
        imageUrl: null,
        x: 0,
        y: 0,
        width: 0,
        height: 0
      },
      videoComposeParams: {
        identity_id: "",
        imageId: 0,
        imageFileName: "",
        videoId: 0,
        videoFileName: "",
        wmPosX: 0,
        wmPosY: 0,
        wmWidth: 0,
        wmHeight: 0
      },
      player: null,
      videoDuration: 0,
      //当前播放速率
      rate: 1,
      //播放速率
      rateOptions: [2, 1.75, 1.5, 1, 0.75, 0.5],
      //显示速率选项和音量选项
      isShowRateOptions: false,
      isShowVolumeBar: false,
      //音量
      volume: 30,
      //是否暂停
      isPaused: true,
      //当前播放时间点和视频总时长
      currentTime: "00:00:00",
      totalTime: "00:00:00",
      //进度条的当前值，必须为number类型
      currentTimeVal: 0,
      //进度条最大值，必须为number类型
      totalTimeVal: 0,
      //是否在拖到进度条
      isDraging: false,
      //遮罩
      overlayShow: false,
      overlayTip: ""
    };
  },
  mounted() {
    console.log("do mounted:", this.$store.state.openid);
    this.player = common_vendor.index.createVideoContext("myVideo");
    this.canvasContext = common_vendor.index.createCanvasContext("myCanvas");
    common_vendor.index.createSelectorQuery().in(this).select("#myVideo").boundingClientRect((data) => {
      if (data) {
        console.log("video组件的左上角坐标：", data.left, data.top);
        this.videoBlockX = data.left;
        this.videoBlockY = data.top;
      }
    }).exec();
  },
  methods: {
    takeVideo() {
      common_vendor.index.chooseVideo({
        sourceType: ["camera", "album"],
        success: (res) => {
          console.log("H5 video res", res);
          this.videoUrl = res.tempFilePath;
          this.onUploadFile("video", this.videoUrl);
        }
      });
    },
    takePhoto() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"],
        //从相册选择
        success: (res) => {
          console.log("H5 res", res);
          const imageUrl = res.tempFilePaths[0];
          this.imageUrl = imageUrl;
          this.onUploadFile("image", this.imageUrl);
        }
      });
    },
    onUploadFile(type, url) {
      common_vendor.index.uploadFile({
        url: `https://www.yutou.work/router/upload?type=${type}`,
        //仅为示例，非真实的接口地址
        filePath: url,
        name: "file",
        formData: {
          "type": type
        },
        success: (res) => {
          this.$refs.uToast.show({
            type: "success",
            message: "上传成功"
          });
          console.log("上传成功:", res.data);
          const rsp = JSON.parse(res.data);
          if (type == "video") {
            this.videoComposeParams.videoId = rsp.id;
            this.videoComposeParams.videoFileName = rsp.filename;
          } else if (type == "image") {
            this.videoComposeParams.imageId = rsp.id;
            this.videoComposeParams.imageFileName = rsp.filename;
          }
        },
        fail: (failRes) => {
          console.log(failRes);
          this.$refs.uToast.show({
            type: "error",
            message: "上传失败:" + failRes
          });
        },
        complete: (res) => {
          this.onHideOverlay();
        }
      });
      this.onShowOverlay("文件上传中");
    },
    onDownloadFile(file_url) {
      common_vendor.index.downloadFile({
        url: "https://www.yutou.work/",
        //仅为示例，并非真实的资源
        success: (res) => {
          if (res.statusCode === 200) {
            console.log("下载成功");
          }
        }
      });
    },
    onVideoCompose() {
      this.videoComposeParams.identity_id = this.$store.state.openid;
      console.log("onVideoCompose:", this.videoComposeParams);
      common_vendor.index.request({
        method: "POST",
        url: "https://www.yutou.work/router/video/addwm",
        data: JSON.stringify(this.videoComposeParams),
        header: {
          "Content-Type": "application/json"
        },
        success: (res) => {
          console.log("res:", res);
          if (res.statusCode != 200) {
            this.$refs.uToast.show({
              type: "error",
              message: "请求失败:" + res.errMsg
            });
          }
          if (res.data.status != true) {
            this.$refs.uToast.show({
              type: "error",
              message: "视频合成失败:" + res.data.msg
            });
          } else {
            this.$refs.uToast.show({
              type: "success",
              message: "视频合成任务创建成功，请往任务列表查看"
            });
          }
        },
        fail: (res) => {
          this.$refs.uToast.show({
            type: "error",
            message: "请求异常:" + res
          });
        },
        complete: (res) => {
          this.onHideOverlay();
        }
      });
      this.onShowOverlay("视频合成中");
    },
    onPlayVideo(e) {
      this.canvasContext.drawImage(this.imageUrl, 48, 48, 100, 100);
      this.canvasContext.draw();
    },
    onLoadedData(e) {
      console.log("video loaded");
      console.log(e.detail.duration);
      this.totalTime = this.timeFormat(e.detail.duration);
      this.totalTimeVal = Math.floor(e.detail.duration);
    },
    //显示速率选项
    toShowOptions() {
      this.isShowRateOptions = !this.isShowRateOptions;
    },
    toShowVolumeBar() {
      console.log("do toShowVolumeBar");
      this.isShowVolumeBar = !this.isShowVolumeBar;
    },
    //视频时长格式化
    timeFormat(time) {
      let hour = Math.floor(time / 3600), minute = Math.floor(time % 3600 / 60), second = Math.floor(time % 60);
      hour = hour < 10 ? "0" + hour : hour;
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      return `${hour}:${minute}:${second}`;
    },
    //改变速率
    setPlayRate(rate) {
      this.rate = rate;
      this.player.playbackRate(rate);
      this.isShowRateOptions = false;
    },
    //控制视频的播放与暂停
    togglePlay() {
      console.log("do togglePlay");
      this.isPaused = !this.isPaused;
      if (!this.isPaused) {
        this.player.play();
      } else {
        this.player.pause();
      }
    },
    //更新视频当前播放时间
    timeUpdate(e) {
      if (this.isDraging)
        return;
      this.currentTime = this.timeFormat(e.detail.currentTime);
      this.currentTimeVal = e.detail.currentTime;
      if (this.currentTime === this.totalTime) {
        this.isPaused = true;
      }
    },
    //进度条拉动时更新进度条值并从拉到的位置播放
    progressUpdate(val) {
      this.player.seek(val);
      this.isDraging = false;
    },
    //改变音量
    changeVolume(val) {
      console.log("volume:", val);
      this.volume = val;
      this.player.volume = val / 100;
    },
    //快进
    forward(ct) {
      this.progressUpdate(ct + 10);
    },
    //后退
    back(ct) {
      this.progressUpdate(ct - 10);
    },
    onCanvasMouseDown(e) {
      console.log("e", e.touches[0]);
      this.clickPos.startX = e.touches[0].pageX - this.videoBlockX;
      this.clickPos.startY = e.touches[0].pageY - this.videoBlockY;
      console.log("鼠标按下", this.clickPos.startX, this.clickPos.startY);
    },
    onCanvasMouseMove(e) {
      this.clickPos.endX = e.touches[0].pageX - this.videoBlockX;
      this.clickPos.endY = e.touches[0].pageY - this.videoBlockY;
      if (this.clickPos.startX != 0 && this.clickPos.startY != 0) {
        this.canvasContext.beginPath();
        this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.canvasContext.draw();
        var left = Math.min(this.clickPos.startX, this.clickPos.endX);
        var top = Math.min(this.clickPos.startY, this.clickPos.endY);
        var right = Math.max(this.clickPos.startX, this.clickPos.endX);
        var bottom = Math.max(this.clickPos.startY, this.clickPos.endY);
        this.canvasContext.strokeStyle = "red";
        this.canvasContext.lineWidth = 2;
        this.canvasContext.rect(left, top, right - left, bottom - top);
        this.canvasContext.stroke();
        this.canvasContext.closePath();
        this.canvasContext.draw();
        this.currWaterMark.imageUrl = this.imageUrl;
        this.currWaterMark.x = left;
        this.currWaterMark.y = top;
        this.currWaterMark.width = right - left;
        this.currWaterMark.height = bottom - top;
      }
    },
    onCanvasMouseup(event) {
      console.log("鼠标松开画图片");
      console.log("currWaterMark:", this.currWaterMark);
      this.clickPos.startX = 0;
      this.clickPos.startY = 0;
      this.clickPos.endX = 0;
      this.clickPos.endY = 0;
      if (this.currWaterMark.imageUrl != null) {
        this.canvasContext.drawImage(
          this.currWaterMark.imageUrl,
          this.currWaterMark.x,
          this.currWaterMark.y,
          this.currWaterMark.width,
          this.currWaterMark.height
        );
        this.canvasContext.draw();
        this.videoComposeParams.wmPosX = this.currWaterMark.x;
        this.videoComposeParams.wmPosY = this.currWaterMark.y;
        this.videoComposeParams.wmWidth = this.currWaterMark.width;
        this.videoComposeParams.wmHeight = this.currWaterMark.height;
      }
    },
    onShowOverlay(tip) {
      this.overlayTip = tip;
      this.overlayShow = true;
    },
    onHideOverlay() {
      this.overlayShow = false;
    },
    onTaskList() {
      common_vendor.index.navigateTo({
        url: "/pages/tasklist/tasklist"
      });
    }
  }
};
if (!Array) {
  const _easycom_u_toast2 = common_vendor.resolveComponent("u-toast");
  const _easycom_u_slider2 = common_vendor.resolveComponent("u-slider");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u__image2 = common_vendor.resolveComponent("u--image");
  const _component_uLoadingIcon = common_vendor.resolveComponent("uLoadingIcon");
  const _component_uOverlay = common_vendor.resolveComponent("uOverlay");
  (_easycom_u_toast2 + _easycom_u_slider2 + _easycom_u_icon2 + _easycom_u_button2 + _easycom_u_tag2 + _easycom_u__image2 + _component_uLoadingIcon + _component_uOverlay)();
}
const _easycom_u_toast = () => "../../uni_modules/uview-plus/components/u-toast/u-toast.js";
const _easycom_u_slider = () => "../../uni_modules/uview-plus/components/u-slider/u-slider.js";
const _easycom_u_icon = () => "../../uni_modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_button = () => "../../uni_modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_tag = () => "../../uni_modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u__image = () => "../../uni_modules/uview-plus/components/u--image/u--image.js";
if (!Math) {
  (_easycom_u_toast + _easycom_u_slider + _easycom_u_icon + _easycom_u_button + _easycom_u_tag + _easycom_u__image)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sr("uToast", "2ee9f64f-0"),
    b: common_vendor.o((...args) => $options.onCanvasMouseDown && $options.onCanvasMouseDown(...args)),
    c: common_vendor.o((...args) => $options.onCanvasMouseup && $options.onCanvasMouseup(...args)),
    d: common_vendor.o((...args) => $options.onCanvasMouseMove && $options.onCanvasMouseMove(...args)),
    e: $data.videoUrl,
    f: common_vendor.o((...args) => $options.onPlayVideo && $options.onPlayVideo(...args)),
    g: common_vendor.o((...args) => $options.onLoadedData && $options.onLoadedData(...args)),
    h: common_vendor.o((...args) => $options.timeUpdate && $options.timeUpdate(...args)),
    i: common_vendor.o($options.progressUpdate),
    j: common_vendor.o(($event) => $data.currentTimeVal = $event),
    k: common_vendor.p({
      max: $data.totalTimeVal,
      ["format-tooltip"]: $options.timeFormat,
      modelValue: $data.currentTimeVal
    }),
    l: common_vendor.o(($event) => $data.isDraging = true),
    m: common_vendor.o(($event) => $data.isDraging = false),
    n: common_vendor.o(($event) => $options.togglePlay()),
    o: common_vendor.p({
      name: $data.isPaused ? "play-circle" : "pause"
    }),
    p: common_vendor.t($data.currentTime),
    q: common_vendor.t($data.totalTime),
    r: common_vendor.o(($event) => $options.back($data.currentTimeVal)),
    s: common_vendor.p({
      name: "arrow-left-double"
    }),
    t: common_vendor.o(($event) => $options.forward($data.currentTimeVal)),
    v: common_vendor.p({
      name: "arrow-right-double"
    }),
    w: common_vendor.o($options.toShowVolumeBar),
    x: common_vendor.p({
      name: "bell"
    }),
    y: $data.isShowVolumeBar,
    z: common_vendor.o($options.changeVolume),
    A: common_vendor.o(($event) => $data.volume = $event),
    B: common_vendor.p({
      max: "100",
      showValue: true,
      activeColor: "#f07c82",
      modelValue: $data.volume
    }),
    C: common_vendor.t($options.ratedisplay),
    D: common_vendor.o((...args) => $options.toShowOptions && $options.toShowOptions(...args)),
    E: common_vendor.f($data.rateOptions, (r, index, i0) => {
      return {
        a: common_vendor.t(r),
        b: index,
        c: common_vendor.o(($event) => $options.setPlayRate(r), index)
      };
    }),
    F: $data.isShowRateOptions,
    G: common_vendor.o($options.takeVideo),
    H: common_vendor.p({
      type: "primary"
    }),
    I: common_vendor.p({
      text: "当前水印",
      type: "warning"
    }),
    J: common_vendor.p({
      src: $data.imageUrl,
      fit: "contain"
    }),
    K: common_vendor.o($options.takePhoto),
    L: common_vendor.p({
      type: "primary"
    }),
    M: common_vendor.p({
      text: "使用方法",
      type: "warning"
    }),
    N: common_vendor.o($options.onVideoCompose),
    O: common_vendor.p({
      type: "success",
      icon: ""
    }),
    P: common_vendor.o($options.onTaskList),
    Q: common_vendor.p({
      type: "success",
      icon: "list",
      shape: "circle",
      plain: "true"
    }),
    R: common_vendor.p({
      mode: "circle",
      text: "文件上传中",
      show: true
    }),
    S: common_vendor.o(($event) => $data.overlayShow = false),
    T: common_vendor.p({
      show: $data.overlayShow
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/xiangyu/work/super-video/yutou-video/pages/addwm/addwm.vue"]]);
wx.createPage(MiniProgramPage);
