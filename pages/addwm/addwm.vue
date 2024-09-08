<template>
  <div id="container">
	  <u-toast ref="uToast"></u-toast>
      <view style="display: flex;align-items: center;justify-content: center;">
        <video :src="videoUrl" autoplay id="myVideo" style="display: block;width: 640px;height: 480px;"
			object-fit="cover"
			:controls="false"
			:show-center-play-btn="false"
			@play="onPlayVideo"
			@loadedmetadata="onLoadedData"
			@timeupdate="timeUpdate"
		>
		<!-- #ifdef MP-WEIXIN -->
		<cover-view style="display: flex; justify-content: center;"
				@touchstart="onCanvasMouseDown"
				@touchend="onCanvasMouseup"
				@touchmove="onCanvasMouseMove">
				<canvas canvas-id="myCanvas" id="myCanvas" style="display: block;width: 640px;height: 480px;">
				</canvas>
		</cover-view>
		<!-- #endif -->
		
		<!-- #ifdef H5 -->
		<cover-view style="display: flex; justify-content: center;">
			<canvas canvas-id="myCanvas" id="myCanvas" style="display: block;width: 640px;height: 480px;"
					@mousedown="onCanvasMouseDown"
					@mouseup="onCanvasMouseup"
					@mousemove="onCanvasMouseMove">
			</canvas>
		</cover-view>
		<!-- #endif -->
        </video>
      </view>
	  
      <!-- 控件-->
      <div style="display: flex; justify-content: center;">
        <div class="controlBar">
            <div class="progressBar" @mousedown="isDraging = true" @mouseup="isDraging = false">
                <u-slider
                    v-model="currentTimeVal"
                    :max="totalTimeVal"
                    :format-tooltip="timeFormat"
                    @change="progressUpdate"
                >
                </u-slider>
            </div>
            <div class="controlBtnBox" style="display: flex;">
                <div class="left">
                    <u-icon
                        :name="isPaused ? 'play-circle' : 'pause'"
						class=" icon-size"
                        @click="togglePlay()"
                    >
                    </u-icon>
                    <span>{{currentTime}}/{{totalTime}}</span>
                </div>
                <div class="right">
                    <u-icon name="arrow-left-double" class=" icon-size" @click="back(currentTimeVal)"></u-icon>
                    <u-icon name="arrow-right-double" class=" icon-size" @click="forward(currentTimeVal)"></u-icon>
                    <u-icon style="display: none;" name="bell"  class=" icon-size" @click="toShowVolumeBar"></u-icon>
					<div >
						<u-slider
							v-show="isShowVolumeBar"
						    v-model="volume"
						    max="100"
							:showValue="true"
							activeColor="#f07c82"
							style="width: 200px;position: absolute;left:10px;top:-50px"
							@change="changeVolume"></u-slider>
					</div>
                </div>
                <div class="rateBox">
                    <span @click="toShowOptions">{{ratedisplay}}</span>
                    <div class="rateOptions" v-show="isShowRateOptions">
                        <span
                            v-for="r,index in rateOptions"
                            :key="index"
                            @click="setPlayRate(r)"
                        >
                            {{r}}x
                        </span>
                    </div>
                </div>
            </div>
        </div>
      </div>
	  
	  <div id="uploadVideoBtn">
		  <u-button style="width: 50%;" type="primary" @click="takeVideo">上传视频</u-button>
	  </div>
	  <div id="currImage">
		<u-tag text="当前水印" type="warning"></u-tag>
		<u--image
		  style="width: 100px;"
		  :src="imageUrl"
		  fit="contain"></u--image>
	  </div>
	  <div id="uploadImageBtn">
	  		  <u-button style="width: 50%;" type="primary" @click="takePhoto">上传水印图片</u-button>
	  </div>
	  <div id="tips">
		<u-tag text="使用方法" type="warning"></u-tag>上传视频和水印图片之后，点击播放视频，在视频上手动圈选出水印的位置
	  </div>
	  <div id="confirmBtn">
	  		  <u-button 
				style="width: 30%;"
				type="success"
				icon=""
				@click="onVideoCompose">视频合成</u-button>
			  <u-button
				style="width: 20%;"
				type="success"
				icon="list"
				shape="circle"
				plain="true"
				@click="onTaskList">任务列表</u-button>
	  </div>
	  <view>
	      <uOverlay :show="overlayShow" @close="overlayShow = false">
	        <!-- 这里是覆盖层的内容 -->
	        <view class="overlay">
	          <uLoadingIcon mode="circle" text="文件上传中" :show="true"></uLoadingIcon>
	        </view>
	      </uOverlay>
	  </view>
  </div>

</template>

<script>
import store from '@/store/index.js'
import uOverlay from '../../uni_modules/uview-plus/components/u-overlay/u-overlay'
import uLoadingIcon from '../../uni_modules/uview-plus/components/u-loading-icon/u-loading-icon'

export default {
    'name': 'super-video',
    components: {
		uOverlay,
		uLoadingIcon,
		store
    },
    //用计算属性来实现当速率为1时，显示“倍速”
    computed:{
        ratedisplay(){
            if(this.rate == 1){
                return '倍速'
            }else{
                return this.rate + 'x'
            }
        }
    },
    data() {
        return {
		  canvasContext: null,
		  canvasWidth: 640,
		  canvasHeight: 480,
		  videoUrl: '',
		  videoBlockX: 0, //video组件的坐标
		  videoBlockY: 0,
          imageUrl: '/static/wuqi.png',
          clickPos: {
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
          },
          currWaterMark: { //当前水印信息
            imageUrl: null,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
          },
		  
		  videoComposeParams: {
			  identity_id: '',
			  imageId: 0,
			  imageFileName: '',
			  videoId: 0,
			  videoFileName: '',
			  wmPosX: 0,
			  wmPosY: 0,
			  wmWidth: 0,
			  wmHeight: 0
		  },

          player:null,
		  videoDuration: 0,
          //当前播放速率
          rate:1.0,
          //播放速率
          rateOptions:[2.0,1.75,1.5,1.0,0.75,0.5],
          //显示速率选项和音量选项
          isShowRateOptions:false,
          isShowVolumeBar:false,
          //音量
          volume:30,
          //是否暂停
          isPaused:true,
          //当前播放时间点和视频总时长
          currentTime:'00:00:00',
          totalTime:'00:00:00',
          //进度条的当前值，必须为number类型
          currentTimeVal:0,
          //进度条最大值，必须为number类型
          totalTimeVal:0,
          //是否在拖到进度条
          isDraging:false,
		  
		  //遮罩
		  overlayShow: false,
		  overlayTip: '',
        }
    },
    mounted () {
		console.log('do mounted:', this.$store.state.openid)
		this.player = uni.createVideoContext('myVideo')
		this.canvasContext = uni.createCanvasContext('myCanvas')
		
		uni.createSelectorQuery().in(this).select('#myVideo').boundingClientRect(data => {
		  if (data) {
			// data包含元素的尺寸信息，如宽、高等
			console.log('video组件的左上角坐标：', data.left, data.top);
			this.videoBlockX = data.left;
			this.videoBlockY = data.top;
		  }
		}).exec();
    },
    methods: {
		takeVideo() {
			// #ifdef MP-WEIXIN
			uni.chooseVideo({
				sourceType: ['camera', 'album'],
				success: (res) => {
					console.log('H5 video res', res)
					this.videoUrl = res.tempFilePath;
					this.onUploadFile('video', this.videoUrl)
				}
			});
			// #endif
			
			// #ifdef H5
			uni.chooseVideo({
				sourceType: ['camera', 'album'],
				success: (res) => {
					console.log('H5 video res', res)
					this.videoUrl = res.tempFilePath;
					this.onUploadFile('video', this.videoUrl)
				}
			});
			// #endif
		},
		takePhoto() {
			// #ifdef MP-WEIXIN
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], //从相册选择
				success: (res) => {
					console.log('H5 res', res)
					const imageUrl = res.tempFilePaths[0]
					this.imageUrl = imageUrl
					
					this.onUploadFile('image', this.imageUrl)
				}
			});
			// #endif
			
			// #ifdef H5
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], //从相册选择
				success: (res) => {
					console.log('H5 res', res)
					const imageUrl = res.tempFilePaths[0]
					this.imageUrl = imageUrl
					
					this.onUploadFile('image', this.imageUrl)
				}
			});
			// #endif
		},
		onUploadFile(type, url) {
			uni.uploadFile({
				url: `https://www.yutou.work/router/upload?type=${type}`, //仅为示例，非真实的接口地址
				filePath: url,
				name: 'file',
				formData: {
					'type': type
				},
				success: (res) => {
					this.$refs.uToast.show({
						type: 'success',
						message: '上传成功'
					})
					console.log('上传成功:', res.data);
					const rsp = JSON.parse(res.data)
					if (type == 'video') {
						this.videoComposeParams.videoId = rsp.id
						this.videoComposeParams.videoFileName = rsp.filename
					} else if (type == 'image') {
						this.videoComposeParams.imageId = rsp.id
						this.videoComposeParams.imageFileName = rsp.filename
					}
				},
				fail: (failRes) => {
					console.log(failRes)
					this.$refs.uToast.show({
						type: 'error',
						message: '上传失败:'+failRes
					})
				},
				complete: res => {
					this.onHideOverlay()
				}
			});
			
			this.onShowOverlay('文件上传中')
		},
		onDownloadFile(file_url) {
			const downloadTask = uni.downloadFile({
				url: 'https://www.yutou.work/', //仅为示例，并非真实的资源
				success: (res) => {
					if (res.statusCode === 200) {
						console.log('下载成功');
					}
				}
			});
			
			//downloadTask.abort();
		},
		onVideoCompose () {
			this.videoComposeParams.identity_id = this.$store.state.openid
			console.log('onVideoCompose:', this.videoComposeParams)
			const requestTask = uni.request({
				method: 'POST',
			    url: 'https://www.yutou.work/router/video/addwm',
			    data: JSON.stringify(this.videoComposeParams),
			    header: {
					'Content-Type': 'application/json'
			    },
			    success: (res) => {
					console.log('res:', res);
					if (res.statusCode != 200) {
						this.$refs.uToast.show({
							type: 'error',
							message: '请求失败:' + res.errMsg
						})
					}
					
					if (res.data.status != true) {
						this.$refs.uToast.show({
							type: 'error',
							message: '视频合成失败:' + res.data.msg
						})
					} else {
						this.$refs.uToast.show({
							type: 'success',
							message: '视频合成任务创建成功，请往任务列表查看'
						})
					}
			    },
				fail: (res) => {
					this.$refs.uToast.show({
						type: 'error',
						message: '请求异常:' + res
					})
				},
				complete: res => {
					this.onHideOverlay()
				}
			});
			
			this.onShowOverlay('视频合成中')
			
			// 中断请求任务
			//requestTask.abort();
		},
	  onPlayVideo(e) {
		this.canvasContext.drawImage(this.imageUrl, 48, 48, 100, 100)
		this.canvasContext.draw()
	  },
	  onLoadedData(e) {
		  console.log('video loaded')
		  //this.getTotalTime();
		  //获取视频的总时长和进度条最大值
		  console.log(e.detail.duration)
		  this.totalTime = this.timeFormat(e.detail.duration)
		  this.totalTimeVal = Math.floor(e.detail.duration)
	  },
      //显示速率选项
      toShowOptions(){
        this.isShowRateOptions = !this.isShowRateOptions
      },
      toShowVolumeBar(){
          console.log('do toShowVolumeBar')
          this.isShowVolumeBar = !this.isShowVolumeBar
      },
      //视频时长格式化
      timeFormat(time){
          let hour = Math.floor(time / 3600),
              minute = Math.floor((time % 3600) / 60),
              second = Math.floor(time % 60);
          hour = hour < 10 ? "0" + hour : hour;
          minute = minute < 10 ? "0" + minute : minute;
          second = second < 10 ? "0" + second : second;
          return `${hour}:${minute}:${second}`;
      },
      //改变速率
      setPlayRate(rate){
          this.rate = rate;
          this.player.playbackRate(rate);
          this.isShowRateOptions = false;
      },
      //控制视频的播放与暂停
      togglePlay(){
          console.log('do togglePlay')
          this.isPaused = !this.isPaused
          if(!this.isPaused){
              this.player.play()
          }else{
              this.player.pause()
          }
      },
       //更新视频当前播放时间
      timeUpdate(e){
		  //console.log('timeUpdate')
          //如果当前正在拉到进度条，先停止更新当前播放时间，直接return结束这个函数
          //没有这一句会出现拉动进度条跳转失败的bug
          if(this.isDraging) return

          this.currentTime = this.timeFormat(e.detail.currentTime)
          this.currentTimeVal = e.detail.currentTime
          //当前时间更新到等于总时长时，要改变视频的播放状态按钮
          if(this.currentTime === this.totalTime){
              this.isPaused = true
          }
      },
      //进度条拉动时更新进度条值并从拉到的位置播放
      progressUpdate(val) {
		  //console.log('progressUpdate:', val)
		  this.player.seek(val)
          // 虽然mouseup已经可以改变isDraging的值，但下面这句不能少，不然视频播放结束再点击播放时，进度条不会回到最开始位置
          this.isDraging = false
      },
      //改变音量
      changeVolume(val){
		  console.log('volume:', val)
          this.volume = val
          //由于h5规定volum的值在0-1之间，所以这里要对获取到的val做一个处理(滑块的val是从0-100)
          this.player.volume = val / 100;
      },
      //快进
      forward(ct){
          this.progressUpdate(ct + 10)
      },
      //后退
      back(ct){
          this.progressUpdate(ct - 10)
      },
      onCanvasMouseDown(e) {
		  console.log('e', e.touches[0])
		  this.clickPos.startX = e.touches[0].pageX - this.videoBlockX
		  this.clickPos.startY = e.touches[0].pageY - this.videoBlockY
		  console.log('鼠标按下', this.clickPos.startX, this.clickPos.startY)
      },
      onCanvasMouseMove(e) {
        this.clickPos.endX = e.touches[0].pageX - this.videoBlockX
        this.clickPos.endY = e.touches[0].pageY - this.videoBlockY
        //鼠标移动开启绘画, 判断是否由点击开始的移动，非点击移动不画
        if (this.clickPos.startX != 0 && this.clickPos.startY != 0) {
		  //移动过程画矩形
		  // 清空之前的内容
		  this.canvasContext.beginPath()
		  this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
		  this.canvasContext.draw()
		  // 根据起始点和结束点计算矩形的左上角和右下角坐标
		  var left = Math.min(this.clickPos.startX, this.clickPos.endX);
		  var top = Math.min(this.clickPos.startY, this.clickPos.endY);
		  var right = Math.max(this.clickPos.startX, this.clickPos.endX);
		  var bottom = Math.max(this.clickPos.startY, this.clickPos.endY);
		  
		  //再画矩形
		  this.canvasContext.strokeStyle = "red";
		  this.canvasContext.lineWidth = 2;
		  //console.log('left:', left, 'top:', top, 'right:', right, 'bottom:', bottom)
		  this.canvasContext.rect(left, top, right - left, bottom - top);
		  this.canvasContext.stroke();
		  this.canvasContext.closePath();
		  this.canvasContext.draw()
		  
		  //根据矩形框位置记录水印位置
		  //console.log('记录水印位置:', this.imageUrl)
		  this.currWaterMark.imageUrl = this.imageUrl // 设置图片源地址
		  this.currWaterMark.x = left;
		  this.currWaterMark.y = top;
		  this.currWaterMark.width = right - left;
		  this.currWaterMark.height = bottom - top;
        }
      },
      onCanvasMouseup(event) {
        console.log('鼠标松开画图片')
		console.log('currWaterMark:', this.currWaterMark)
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
        		this.currWaterMark.height)
			this.canvasContext.draw()
			//设置请求参数
			this.videoComposeParams.wmPosX = this.currWaterMark.x
			this.videoComposeParams.wmPosY = this.currWaterMark.y
			this.videoComposeParams.wmWidth = this.currWaterMark.width
			this.videoComposeParams.wmHeight = this.currWaterMark.height
        }
      },
	  onShowOverlay(tip) {
		  this.overlayTip = tip
		  this.overlayShow = true
	  },
	  onHideOverlay() {
		  this.overlayShow = false
	  },
	  onTaskList() {
		  uni.navigateTo({
		  	url:"/pages/tasklist/tasklist"
		  })
	  },
    }
}

</script>

<style lang="scss">
	#container {
	    height: 1080px;
	}
	
	.overlay {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
	
	#uploadVideoBtn {
		display: flex;
		justify-content: center;
		margin: 10px;
	}
	#currImage {
		display: flex;
		justify-content: center;
		margin: 10px;
	}
	#uploadImageBtn {
		display: flex;
		justify-content: center;
		margin: 10px;
	}
	#tips {
		display: flex;
		justify-content: center;
		margin: 10px;
	}
	#confirmBtn {
		display: flex;
		justify-content: center;
		margin: 10px;
	}
	
    .controlBar{
        width: 640px;
        height: 70px;
        /*position:absolute;*/
        bottom: 20px;
        left: 5%;
        background-color:#817f7f5a;
        box-sizing: border-box;
        color: rgb(233, 231, 231);
    }
    .progressBar{
        box-sizing: border-box;
        position: relative;
        width: 100%;
        padding: 10px;
        height: 30%;
        /* background-color: aliceblue; */
    }
    .controlBtnBox{
        box-sizing: border-box;
        width: 100%;
        height:88%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
	
     .icon-size{
       font-size: 30px;
       cursor: pointer;
    }
    .left{
        padding-left:10px ;
        width: 50%;
        display: flex;
        align-items: center;
    }
    .left span{
        margin-left: 20px;
    }
    .right{
        width: 15%;
        display: flex;
        justify-content: space-around;
       position: relative;
    }
    .right u-tag{
        display: block;
    }
    .rateBox{
        width: 15%;
        cursor: pointer;
    }
    .rateOptions{
        width: 80px;
        height: 180px;
        background-color: #817f7f5a;
        position: absolute;
        top: 290px;
        right: 430px;
        display: flex;
        flex-wrap: wrap;
        align-content: center;
    }
    .rateOptions span{
        display: block;
        width: 100%;
        height: 30px;
        text-align: center;
        line-height: 30px;
    }
    .rateOptions span:hover{
       background-color: #cec9c95a;
       color: #409EFF;
    }
</style>
