<template>
  <div id="container">
	  <div style="margin: 2px;">
		  <u-button type="primary" @click="onPageAddWM">视频加水印</u-button>
	  </div>
	  <div style="margin: 2px;">
		  <u-button type="primary" @click="onPageDelWM">视频去水印</u-button>
	  </div>
	  
	  <canvas id="qrcode" canvas-id="qrcode" style="width: 200px;height: 200px;"></canvas>
	  
	  <UQRCode
		canvasId="qrcode"
		:start="true"
		value="https://www.baidu.com"
		:options="options"></UQRCode>
  </div>

</template>

<script>

import store from '@/store'
import UQRCode from '../../uni_modules/Sansnn-uQRCode/components/uqrcode/uqrcode'


export default {
    'name': 'super-video',
    components: {
		store,
		UQRCode
    },
    data() {
        return {
			options: {
				//margin: 20,
				style: 'liquid',
				//背景图片
				backgroundColor: 'rgba(255,255,255,0)', //背景色
				backgroundImageSrc: "",		//背景图片地址
				backgroundImageWidth: undefined,
				backgroundImageHeight: undefined,
				backgroundImageX: undefined,
				backgroundImageY: undefined,
				backgroundImageAlpha: 1, // 背景图片透明度，默认不透明
				backgroundImageBorderRadius: 0, // 背景图片圆角，默认不是圆角
				backgroundPadding: 0.0, // 背景码点内边距，系数：0.0-1.0

				//前景图片
				foregroundColor: "#000000", //前景色
				foregroundImageSrc: "",		// 前景图片地址
				foregroundImageWidth: undefined,
				foregroundImageHeight: undefined,
				foregroundImageX: undefined,
				foregroundImageY: undefined,
				foregroundImagePadding: 0, // 前景图边距填充
				foregroundImageBackgroundColor: '#FFFFFF', //前景图背景颜色
				foregroundImageBorderRadius: 0, // 前景图边界圆角
				foregroundImageShadowOffsetX: 0, // 前景图阴影水平偏移值
				foregroundImageShadowOffsetY: 0, // 前景图阴影垂直偏移值
				foregroundImageShadowBlur: 0, // 前景图阴影模糊度
				foregroundImageShadowColor: '#808080', // 前景图阴影颜色
				foregroundPadding: 0.0, // 前景码点内边距，0.0-1.0
			}
        }
    },
    mounted () {
		uni.login({
			provider: 'weixin',
			success: function (res) {
				//console.log(res);
				uni.request({
				    url: 'https://api.weixin.qq.com/sns/jscode2session',
				    data: {
				        appid: 'wx7f6acef704336caf',
						secret: 'cd7e7d9821d96ad0e5436316e2e32cac',
						js_code: res.code
				    },
				    header: {
				    },
				    success: (res) => {
				        console.log('success:', res.data);
						console.log(this.$store)
						store.commit('setOpenid', res.data.openid)
				    },
					fail: (res) => {
						console.log(res)
					}
				});
			}
		})
    },
    methods: {
	  onPageAddWM() {
		  console.log('onPageAddWM')
		  uni.navigateTo({
		  	url:'/pages/addwm/addwm',
			fail(res) {
				console.log('error:', res)
			}
		  })
	  },
	  onPageDelWM() {
		  console.log('onPageDelWM')
		  uni.navigateTo({
		      url: '/pages/delwm/delwm',
			  fail(res) {
			  	console.log('error:', res)
			  }
		  });
	  }
    }
}

</script>

<style lang="scss">
    #container {
		background-color: #B2BEB5;
        height: 480;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
    }
</style>
