"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const UQRCode = () => "../../uni_modules/Sansnn-uQRCode/components/uqrcode/uqrcode.js";
const _sfc_main = {
  "name": "super-video",
  components: {
    store: store_index.store,
    UQRCode
  },
  data() {
    return {
      options: {
        //margin: 20,
        style: "liquid",
        //背景图片
        backgroundColor: "rgba(255,255,255,0)",
        //背景色
        backgroundImageSrc: "",
        //背景图片地址
        backgroundImageWidth: void 0,
        backgroundImageHeight: void 0,
        backgroundImageX: void 0,
        backgroundImageY: void 0,
        backgroundImageAlpha: 1,
        // 背景图片透明度，默认不透明
        backgroundImageBorderRadius: 0,
        // 背景图片圆角，默认不是圆角
        backgroundPadding: 0,
        // 背景码点内边距，系数：0.0-1.0
        //前景图片
        foregroundColor: "#000000",
        //前景色
        foregroundImageSrc: "",
        // 前景图片地址
        foregroundImageWidth: void 0,
        foregroundImageHeight: void 0,
        foregroundImageX: void 0,
        foregroundImageY: void 0,
        foregroundImagePadding: 0,
        // 前景图边距填充
        foregroundImageBackgroundColor: "#FFFFFF",
        //前景图背景颜色
        foregroundImageBorderRadius: 0,
        // 前景图边界圆角
        foregroundImageShadowOffsetX: 0,
        // 前景图阴影水平偏移值
        foregroundImageShadowOffsetY: 0,
        // 前景图阴影垂直偏移值
        foregroundImageShadowBlur: 0,
        // 前景图阴影模糊度
        foregroundImageShadowColor: "#808080",
        // 前景图阴影颜色
        foregroundPadding: 0
        // 前景码点内边距，0.0-1.0
      }
    };
  },
  mounted() {
    common_vendor.index.login({
      provider: "weixin",
      success: function(res) {
        common_vendor.index.request({
          url: "https://api.weixin.qq.com/sns/jscode2session",
          data: {
            appid: "wx7f6acef704336caf",
            secret: "cd7e7d9821d96ad0e5436316e2e32cac",
            js_code: res.code
          },
          header: {},
          success: (res2) => {
            console.log("success:", res2.data);
            console.log(this.$store);
            store_index.store.commit("setOpenid", res2.data.openid);
          },
          fail: (res2) => {
            console.log(res2);
          }
        });
      }
    });
  },
  methods: {
    onPageAddWM() {
      console.log("onPageAddWM");
      common_vendor.index.navigateTo({
        url: "/pages/addwm/addwm",
        fail(res) {
          console.log("error:", res);
        }
      });
    },
    onPageDelWM() {
      console.log("onPageDelWM");
      common_vendor.index.navigateTo({
        url: "/pages/delwm/delwm",
        fail(res) {
          console.log("error:", res);
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _component_UQRCode = common_vendor.resolveComponent("UQRCode");
  (_easycom_u_button2 + _component_UQRCode)();
}
const _easycom_u_button = () => "../../uni_modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  _easycom_u_button();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.onPageAddWM),
    b: common_vendor.p({
      type: "primary"
    }),
    c: common_vendor.o($options.onPageDelWM),
    d: common_vendor.p({
      type: "primary"
    }),
    e: common_vendor.p({
      canvasId: "qrcode",
      start: true,
      value: "https://www.baidu.com",
      options: $data.options
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/xiangyu/work/super-video/yutou-video/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
