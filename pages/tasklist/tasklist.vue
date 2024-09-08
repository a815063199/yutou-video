<template>
	<view>
		<up-list
			@scrolltolower=""
		>
			<up-list-item
				v-for="(item, index) in taskList"
				:key="index"
			>	
				<up-cell  :title="`${item.id}`" value="状态">
					<template #icon>
						<u-tag :text="`${index+1}`" plain plainFill></u-tag>
					</template>
					<template #right-icon>
						<u-button v-if="item.task_status==0" type="primary" loading loadingText="合成中"></u-button>
						<u-button v-else-if="item.task_status==1" type="success" icon="download" text="可下载"
							@click="onDownload(item)"
							:loading="false"
						>
						</u-button>
						<u-button v-else type="error" icon="error" text="失败"></u-button>
						<u-text :show="item.showDownloadProgress" type="primary" bold
								:text="item.downloadProgress" margin="10px" ></u-text>
					</template>
				</up-cell>
			</up-list-item>
		</up-list>
	</view>
</template>

<script>
	
import upList from '../../uni_modules/uview-plus/components/u-list/u-list'
import upListItem from '../../uni_modules/uview-plus/components/u-list-item/u-list-item'
import upCell from '../../uni_modules/uview-plus/components/u-cell/u-cell'
import upTag from '../../uni_modules/uview-plus/components/u-tag/u-tag'
import upIcon from '../../uni_modules/uview-plus/components/u-icon/u-icon'
import upSwitch from '../../uni_modules/uview-plus/components/u-switch/u-switch'
import upButton from '../../uni_modules/uview-plus/components/u-button/u-button'
import upLineProgress from '../../uni_modules/uview-plus/components/u-line-progress/u-line-progress'

export default {
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
			taskList: [
				
			],
		}
	},
	mounted() {
		this.onGetTaskList()
	},
	methods: {
		onDownload(item) {
			console.log('download:', item)
			item.showDownloadProgress = true
			//取消上次下载任务
			if (item.downloadTask) {
				console.log('取消下载任务')
				item.downloadTask.abort() //取消下载任务
				item.downloadTask.offProgressUpdate() //取消监听下载进度
			}
			
			var downloadTask = uni.downloadFile({
				url: 'https://www.yutou.work/router/download/' + item.download_url,
				header: {
				},
				success: (res) => {
					if (res.statusCode === 200) {
						console.log('下载成功:', res);
						//文件保存本地
						uni.getFileSystemManager().saveFile({
							tempFilePath: res.tempFilePath,
							success: (res) => {
								var savedFilePath = res.savedFilePath;
								console.log('保存成功:', savedFilePath)
								
								uni.saveVideoToPhotosAlbum({
									filePath: savedFilePath,
									success: function () {
										console.log('保存视频成功');
									},
									fail: (res) => {
										console.log('保存视频失败:', res)
									},
								});
							},
							fail: (res) => {
								console.error('保存临时文件失败:', res)
							}
						})
					} else {
						console.error('下载失败:', res);
					}
					
				},
				fail: (res) => {
					console.error('下载异常:', res);
				},
				complete: () => {
					item.showDownloadProgress = false
				}
			});
			
			downloadTask.onProgressUpdate((res) => {
				console.log('下载进度' + res.progress);
				//console.log('已经下载的数据长度' + res.totalBytesWritten);
				//console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
				item.downloadProgress = `${res.progress}%`
			
				// 满足测试条件，取消下载任务。
				if (res.progress > 50) {
					//downloadTask.abort();
					
				}
			})
			
			//给item添加task任务字段
			item.downloadTask = downloadTask
		},
		onGetTaskList() {
			uni.request({
				method: 'GET',
			    url: 'https://www.yutou.work/router/task/list',
			    data: {
					'identity_id': this.$store.state.openid
				},
			    header: {
			    },
			    success: (res) => {
					console.log('res:', res);
					if (res.data.status) {
						for (let task of res.data.task_list) {
							console.log('task:', task)
							//增加下载进度相关字段
							task.downloadProgress = 0
							task.showDownloadProgress = false
							this.taskList.push(task)
						}
					}
			    },
				fail: (res) => {
					console.log('fail:', res)
				},
				complete: res => {
				}
			});
		}
	}
}
</script>

<style>

</style>
