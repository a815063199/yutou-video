"use strict";
const common_vendor = require("../../common/vendor.js");
const upList = () => "../../uni_modules/uview-plus/components/u-list/u-list.js";
const upListItem = () => "../../uni_modules/uview-plus/components/u-list-item/u-list-item.js";
const upCell = () => "../../uni_modules/uview-plus/components/u-cell/u-cell.js";
const upTag = () => "../../uni_modules/uview-plus/components/u-tag/u-tag.js";
const upIcon = () => "../../uni_modules/uview-plus/components/u-icon/u-icon.js";
const upSwitch = () => "../../uni_modules/uview-plus/components/u-switch/u-switch.js";
const upButton = () => "../../uni_modules/uview-plus/components/u-button/u-button.js";
const upLineProgress = () => "../../uni_modules/uview-plus/components/u-line-progress/u-line-progress.js";
const _sfc_main = {
  components: {
    upList,
    upListItem,
    upCell,
    upTag,
    upIcon,
    upSwitch,
    upButton,
    upLineProgress
  },
  data() {
    return {
      taskList: []
    };
  },
  mounted() {
    this.onGetTaskList();
  },
  methods: {
    onDownload(item) {
      console.log("download:", item);
      item.showDownloadProgress = true;
      if (item.downloadTask) {
        console.log("取消下载任务");
        item.downloadTask.abort();
        item.downloadTask.offProgressUpdate();
      }
      var downloadTask = common_vendor.index.downloadFile({
        url: "https://www.yutou.work/router/download/" + item.download_url,
        header: {},
        success: (res) => {
          if (res.statusCode === 200) {
            console.log("下载成功:", res);
            common_vendor.index.getFileSystemManager().saveFile({
              tempFilePath: res.tempFilePath,
              success: (res2) => {
                var savedFilePath = res2.savedFilePath;
                console.log("保存成功:", savedFilePath);
                common_vendor.index.saveVideoToPhotosAlbum({
                  filePath: savedFilePath,
                  success: function() {
                    console.log("保存视频成功");
                  },
                  fail: (res3) => {
                    console.log("保存视频失败:", res3);
                  }
                });
              },
              fail: (res2) => {
                console.error("保存临时文件失败:", res2);
              }
            });
          } else {
            console.error("下载失败:", res);
          }
        },
        fail: (res) => {
          console.error("下载异常:", res);
        },
        complete: () => {
          item.showDownloadProgress = false;
        }
      });
      downloadTask.onProgressUpdate((res) => {
        console.log("下载进度" + res.progress);
        item.downloadProgress = `${res.progress}%`;
        if (res.progress > 50)
          ;
      });
      item.downloadTask = downloadTask;
    },
    onGetTaskList() {
      common_vendor.index.request({
        method: "GET",
        url: "https://www.yutou.work/router/task/list",
        data: {
          "identity_id": this.$store.state.openid
        },
        header: {},
        success: (res) => {
          console.log("res:", res);
          if (res.data.status) {
            for (let task of res.data.task_list) {
              console.log("task:", task);
              task.downloadProgress = 0;
              task.showDownloadProgress = false;
              this.taskList.push(task);
            }
          }
        },
        fail: (res) => {
          console.log("fail:", res);
        },
        complete: (res) => {
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_text2 = common_vendor.resolveComponent("u-text");
  const _component_up_cell = common_vendor.resolveComponent("up-cell");
  const _component_up_list_item = common_vendor.resolveComponent("up-list-item");
  const _component_up_list = common_vendor.resolveComponent("up-list");
  (_easycom_u_tag2 + _easycom_u_button2 + _easycom_u_text2 + _component_up_cell + _component_up_list_item + _component_up_list)();
}
const _easycom_u_tag = () => "../../uni_modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_button = () => "../../uni_modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_text = () => "../../uni_modules/uview-plus/components/u-text/u-text.js";
if (!Math) {
  (_easycom_u_tag + _easycom_u_button + _easycom_u_text)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.taskList, (item, index, i0) => {
      return common_vendor.e({
        a: "71be1e7f-3-" + i0 + "," + ("71be1e7f-2-" + i0),
        b: common_vendor.p({
          text: `${index + 1}`,
          plain: true,
          plainFill: true
        }),
        c: item.task_status == 0
      }, item.task_status == 0 ? {
        d: "71be1e7f-4-" + i0 + "," + ("71be1e7f-2-" + i0),
        e: common_vendor.p({
          type: "primary",
          loading: true,
          loadingText: "合成中"
        })
      } : item.task_status == 1 ? {
        g: common_vendor.o(($event) => $options.onDownload(item), index),
        h: "71be1e7f-5-" + i0 + "," + ("71be1e7f-2-" + i0),
        i: common_vendor.p({
          type: "success",
          icon: "download",
          text: "可下载",
          loading: false
        })
      } : {
        j: "71be1e7f-6-" + i0 + "," + ("71be1e7f-2-" + i0),
        k: common_vendor.p({
          type: "error",
          icon: "error",
          text: "失败"
        })
      }, {
        f: item.task_status == 1,
        l: "71be1e7f-7-" + i0 + "," + ("71be1e7f-2-" + i0),
        m: common_vendor.p({
          show: item.showDownloadProgress,
          type: "primary",
          bold: true,
          text: item.downloadProgress,
          margin: "10px"
        }),
        n: "71be1e7f-2-" + i0 + "," + ("71be1e7f-1-" + i0),
        o: common_vendor.p({
          title: `${item.id}`,
          value: "状态"
        }),
        p: index,
        q: "71be1e7f-1-" + i0 + ",71be1e7f-0"
      });
    }),
    b: common_vendor.o(() => {
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/xiangyu/work/super-video/yutou-video/pages/tasklist/tasklist.vue"]]);
wx.createPage(MiniProgramPage);
