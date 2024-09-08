"use strict";
const uni_modules_uviewPlus_components_uSlider_props = require("./props.js");
const uni_modules_uviewPlus_libs_mixin_mpMixin = require("../../libs/mixin/mpMixin.js");
const uni_modules_uviewPlus_libs_mixin_mixin = require("../../libs/mixin/mixin.js");
const uni_modules_uviewPlus_libs_function_index = require("../../libs/function/index.js");
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "up-slider",
  mixins: [uni_modules_uviewPlus_libs_mixin_mpMixin.mpMixin, uni_modules_uviewPlus_libs_mixin_mixin.mixin, uni_modules_uviewPlus_components_uSlider_props.props],
  emits: ["changing", "change", "update:modelValue"],
  methods: {
    addStyle: uni_modules_uviewPlus_libs_function_index.addStyle,
    getPx: uni_modules_uviewPlus_libs_function_index.getPx,
    // 拖动过程中触发
    changingHandler(e) {
      const {
        value
      } = e.detail;
      this.$emit("update:modelValue", value);
      this.$emit("changing", value);
    },
    // 滑动结束时触发
    changeHandler(e) {
      const {
        value
      } = e.detail;
      this.$emit("update:modelValue", value);
      this.$emit("change", value);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: _ctx.min,
    b: _ctx.max,
    c: _ctx.step,
    d: _ctx.modelValue,
    e: _ctx.activeColor,
    f: _ctx.inactiveColor,
    g: $options.getPx(_ctx.blockSize),
    h: _ctx.blockColor,
    i: _ctx.showValue,
    j: _ctx.disabled,
    k: common_vendor.o((...args) => $options.changingHandler && $options.changingHandler(...args)),
    l: common_vendor.o((...args) => $options.changeHandler && $options.changeHandler(...args)),
    m: common_vendor.s($options.addStyle(_ctx.customStyle))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7b84e269"], ["__file", "/Users/xiangyu/work/super-video/yutou-video/uni_modules/uview-plus/components/u-slider/u-slider.vue"]]);
wx.createComponent(Component);
