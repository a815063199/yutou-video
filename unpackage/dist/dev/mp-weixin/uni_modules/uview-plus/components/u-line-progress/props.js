"use strict";
const uni_modules_uviewPlus_libs_config_props = require("../../libs/config/props.js");
const props = {
  props: {
    // 激活部分的颜色
    activeColor: {
      type: String,
      default: () => uni_modules_uviewPlus_libs_config_props.defProps.lineProgress.activeColor
    },
    inactiveColor: {
      type: String,
      default: () => uni_modules_uviewPlus_libs_config_props.defProps.lineProgress.color
    },
    // 进度百分比，数值
    percentage: {
      type: [String, Number],
      default: () => uni_modules_uviewPlus_libs_config_props.defProps.lineProgress.inactiveColor
    },
    // 是否在进度条内部显示百分比的值
    showText: {
      type: Boolean,
      default: () => uni_modules_uviewPlus_libs_config_props.defProps.lineProgress.showText
    },
    // 进度条的高度，单位px
    height: {
      type: [String, Number],
      default: () => uni_modules_uviewPlus_libs_config_props.defProps.lineProgress.height
    }
  }
};
exports.props = props;
