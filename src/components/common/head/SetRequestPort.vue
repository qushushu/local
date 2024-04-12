<template>
	<el-dialog :visible="visible" :show-close="false" :title="$t('message.设置请求路径')" width="403px" center>
		<p class="space-btm1">{{$t("message.请输入机器编号")}}：</p><el-input v-model="num" :placeholder="$t('message.请输入机器编号')" size="small"></el-input>
		<div class="errTipText" v-show="showErr">{{$t("message.机器编号必须为数字！")}}</div>
	    <div slot="footer">
	        <el-button type="primary" size="small" @click="changeRequestPort">{{$t("message.确定")}}</el-button>
	        <el-button type="default" size="small" @click="closeLayer">{{$t("message.取消")}}</el-button>
	    </div>
	</el-dialog>
</template>
<script>
	export default {
		props: ["visible"],
		data() {
			return {
				num: 21,
				showErr: false
			}
		},
		computed: {
			mobileReqPort() {
				return this.$store.state.mobileReqPort
			}
		},
		mounted() {
			this.num = this.mobileReqPort;
		},
		methods: {
			closeLayer() {
				this.showErr = false;
				this.num = this.mobileReqPort;
				this.$emit("hideVisible",false)
			},
			changeRequestPort() {
				// 获取编号
				let num = this.num;
				// 验证编号
				if(!Number(num)) {
					this.showErr = true;
		            return;
				} else {
					this.showErr = false;
				}
				// 设置成localStorage
				localStorage.mobileReqPort = num;
				// 刷新页面
				location.reload();
			},
		}
	}
</script>