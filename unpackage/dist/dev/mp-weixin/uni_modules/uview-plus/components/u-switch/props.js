"use strict";
const uni_modules_uviewPlus_libs_config_props = require("../../libs/config/props.js");
const props = {
  props: {
    // 是否为加载中状态
    loading: {
      type: Boolean,
      default: () => uni_modules_uviewPlus_libs_config_props.defProps.switch.loading
    },
    // 是否为禁用装填
    disabled: {
      type: Boolean,
      default: () => uni_modules_uviewPlus_libs_config_props.defProps.switch.disabled
    },
    // 开关尺寸，单位px
    size: {
      type: [String, Number],
      default: () => uni_modules_uviewPlus_libs_config_props.defProps.switch.size
    },
    // 打开时的背景颜色
    activeColor: {
      type: String,
      default: () => uni_modules_uviewPlus_libs_config_props.defProps.switch.activeColor
    },
    // 关闭时的背景颜色
    inactiveColor: {
      type: String,
      default: () => uni_modules_uviewPlus_libs_config_props.defProps.switch.inactiveColor
    },
    // 通过v-model双向绑定的值
    modelValue: {
      type: [Boolean, String, Number],
      default: () => uni_modules_uviewPlus_libs_config_props.defProps.switch.value
    },
    // switch打开时的值
    activeValue: {
      type: [String, Number, Boolean],
      default: () => uni_modules_uviewPlus_libs_config_props.defProps.switch.activeValue
    },
    // switch关闭时的值
    inactiveValue: {
      type: [String, Number, Boolean],
      default: () => uni_modules_uviewPlus_libs_config_props.defProps.switch.inactiveValue
    },
    // 是否开启异步变更，开启后需要手动控制输入值
    asyncChange: {
      type: Boolean,
      default: () => uni_modules_uviewPlus_libs_config_props.defProps.switch.asyncChange
    },
    // 圆点与外边框的距离
    space: {
      type: [String, Number],
      default: () => uni_modules_uviewPlus_libs_config_props.defProps.switch.space
    }
  }
};
exports.props = props;
