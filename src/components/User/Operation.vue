<!-- 
  组件说明： 本组件为手动操作组件。
  进入方式： 操作员登录后点击导航栏"手动操作"进入。
  用户权限：操作员可以使用。未登录用户或其他用户自动跳转至首页。
  其他说明：子组件的地址在同级目录Operation文件夹下。
-->
<template>
	<div class="ym-main">
		 <!-- 当前编号(华能手机端隐藏) start -->
        <!-- 本地版编号 start -->
        <slot name="dev_no" v-if="!isWeb"></slot>
        <slot name="current_pos" v-if="isWeb"></slot>
        <!-- 本地版编号 end -->
        <!-- 当前编号(华能手机端隐藏) end -->
		<div class="mode">{{runInfo.dig.AUTO ? $t("message.当前模式为自动模式，如需开关，请调节至手动模式！") : $t("message.当前模式为手动模式，你可以手动打开或关闭各个开关！")}}</div>
		<a-card class="card-pd" id="smartgrow-operation-mobilebox">
             <!-- 头部标题 start -->
            <PageHeader :title="$t('message.手动操作')" goBack=true></PageHeader>
            <!-- 头部标题 end -->
            <el-tabs tab-position="top">
			    <el-tab-pane :label="$t('message.喷灌')"><Operation_1></Operation_1></el-tab-pane>
			    <el-tab-pane :label="$t('message.配液')"><Operation_2></Operation_2></el-tab-pane>
			    <el-tab-pane :label="$t('message.环境')"><Operation_3></Operation_3></el-tab-pane>
			</el-tabs>
		</a-card>
	</div>
</template>
<style scoped>
	.mode {text-align: center;margin-bottom: 10px;background: rgba(148,221,230,.5);padding: 8px 16px;color: #7a7a7a;font-size: 12px;font-weight: bold;}
</style>
<script>
	import Operation_1 from "./Operation/Operation_1"
	import Operation_2 from "./Operation/Operation_2"
	import Operation_3 from "./Operation/Operation_3"
    import projectJson from "../../config/project/config.js"
	let timer;
    let {isWeb} = projectJson;
	export default {
	    components: {
	    	Operation_1,
	    	Operation_2,
	    	Operation_3,
	    },
	    computed: {
            runInfo() {return this.$store.state.runInfo},
            isWeb() {return isWeb}
        },
        mounted() {
            timer = setInterval(()=> {this.$store.dispatch("updateRunInfo")},1000);
        },
        destroyed () {
          clearInterval(timer);
        }
	}
</script>