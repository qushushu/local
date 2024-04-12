<!-- 
  组件说明： 本组件二级页面头部组件。
-->
<template>
	<div>
		<!-- 返回按钮 start -->
		<span v-if="showBack" @click="toBack">
			<el-link :underline="false"> <i class="el-icon-back"></i> {{$t("message.返回")}}</el-link>
			<el-divider direction="vertical" />
		</span> 
		<!-- 返回按钮 end -->
		<!-- 标题 start -->
		<span class="title">{{title}}</span> 
		<!-- 标题 end -->
		<!-- 分割线 start -->
		<el-divider class="head-line" />
		<!-- 分割线 end -->
	</div>
</template>
<style scoped>
	.title {font-size: 16px;color: #303133;font-weight: bold;}
	.ant-divider-horizontal {margin: 12px 0;}
	.head-line {margin: 12px 0;}
</style>
<script>
	export default {
		data() {
			return {
				title: this.$attrs.title,  // 头部标题
				showBack: this.$attrs.goBack !== "false"   // 是否显示返回按钮
			}
		},
		methods: {
			// 点击返回按钮返回
			toBack() {
				this.$router.back();
			}
		}
	}
</script>