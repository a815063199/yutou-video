"use strict";
const uni_modules_uviewPlus_components_uLineProgress_props = require("./props.js");
const uni_modules_uviewPlus_libs_mixin_mpMixin = require("../../libs/mixin/mpMixin.js");
const uni_modules_uviewPlus_libs_mixin_mixin = require("../../libs/mixin/mixin.js");
const uni_modules_uviewPlus_libs_function_index = require("../../libs/function/index.js");
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "u-line-progress",
  mixins: [uni_modules_uviewPlus_libs_mixin_mpMixin.mpMixin, uni_modules_uviewPlus_libs_mixin_mixin.mixin, uni_modules_uviewPlus_components_uLineProgress_props.props],
  data() {
    return {
      lineWidth: 0
    };
  },
  watch: {
    percentage(n) {
      this.resizeProgressWidth();
    }
  },
  computed: {
    progressStyle() {
      let style = {};
      style.width = this.lineWidth;
      style.backgroundColor = this.activeColor;
      style.height = uni_modules_uviewPlus_libs_function_index.addUnit(this.height);
      return style;
    },
    innserPercentage() {
      return uni_modules_uviewPlus_libs_function_index.range(0, 100, this.percentage);
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    addStyle: uni_modules_uviewPlus_libs_function_index.addStyle,
    addUnit: uni_modules_uviewPlus_libs_function_index.addUnit,
    init() {
      uni_modules_uviewPlus_libs_function_index.sleep(20).then(() => {
        this.resizeProgressWidth();
      });
    },
    getProgressWidth() {
      return this.$uGetRect(".u-line-progress__background");
    },
    resizeProgressWidth() {
      this.getProgressWidth().then((size) => {
        const {
          width
        } = size;
        this.lineWidth = width * this.innserPercentage / 100 + "px";
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.s({
      backgroundColor: _ctx.inactiveColor,
      height: $options.addUnit(_ctx.height)
    }),
    b: _ctx.showText && _ctx.percentage >= 10
  }, _ctx.showText && _ctx.percentage >= 10 ? {
    c: common_vendor.t($options.innserPercentage + "%")
  } : {}, {
    d: common_vendor.s($options.progressStyle),
    e: common_vendor.s($options.addStyle(_ctx.customStyle))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-eeee7090"], ["__file", "/Users/xiangyu/work/super-video/yutou-video/uni_modules/uview-plus/components/u-line-progress/u-line-progress.vue"]]);
wx.createComponent(Component);
