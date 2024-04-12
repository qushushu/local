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
		<slot name="side"></slot>
		<!-- 分割线 start -->
		<el-divider class="head-line" />
		<!-- 分割线 end -->
	</div>
</template>
<style scoped>
	.title {font-size: 16px;color: #303133;font-weight: bold;}
	.head-line {margin: 12px 0;}
</style>
<script>
	export default {
		props: ["title","goBack"],
		computed: {
			showBack() {return this.goBack !== "false" && this.goBack !== false}
		},
		methods: {
			toBack() {
				this.$router.back();
			}
		}
	}
</script>