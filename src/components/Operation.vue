<!-- 
  组件说明： 本组件为手动操作组件。
  进入方式： 导航 -> 手动操作
  用户权限：操作员可以使用。未登录用户或其他用户自动跳转至首页。
  其他说明：子组件的地址在同级目录Operation文件夹下。
-->
<template>
	<div class="ym-main">
		<div class="mode">{{runInfo.dig.AUTO ? $t("message.当前模式为自动模式，如需开关，请调节至手动模式！") : $t("message.当前模式为手动模式，你可以手动打开或关闭各个开关！")}}</div>
		<a-card class="card-pd" id="smartgrow-operation-mobilebox">
            <el-tabs tab-position="top">
			    <el-tab-pane :label="$t('message.喷灌')"><Operation_1></Operation_1></el-tab-pane>
			    <el-tab-pane :label="$t('message.配液')"><Operation_2></Operation_2></el-tab-pane>
			    <el-tab-pane :label="$t('message.环境')"><Operation_3></Operation_3></el-tab-pane>
			</el-tabs>
		</a-card>
	</div>
</template>
<style scoped>
	.mode {text-align: center;margin-top: -10px;margin-bottom: 10px;background: rgb(148,221,230,.5);padding: 8px 16px;color: #7a7a7a;font-size: 12px;font-weight: bold;}
</style>
<script>
    import aCard from "./common/Acard"
	import Operation_1 from "./Operation/Operation_1"
	import Operation_2 from "./Operation/Operation_2"
	import Operation_3 from "./Operation/Operation_3"
	import {autoJump} from "../assets/tools/tool"
	export default {
	    components: {
            aCard,
	    	Operation_1,
	    	Operation_2,
	    	Operation_3
	    },
	    computed: {
            runInfo() {
                return this.$store.state.runInfo;
            }
        },
	    mounted() {
	    	autoJump(1);
	    }
	}
</script>