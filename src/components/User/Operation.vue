<!-- 
  组件说明： 本组件为手动操作组件。
  进入方式： 操作员登录后点击导航栏"手动操作"进入。
  用户权限：操作员可以使用。未登录用户或其他用户自动跳转至首页。
  其他说明：子组件的地址在同级目录Operation文件夹下。
-->
<template>
	<div class="ym-main">
    <!-- 顶部编号 start -->
    <slot name="currentNum"></slot>
    <!-- 顶部编号 end -->
    <!-- 当前模式 start -->
    <Lbar>{{auto.refValue ? $t("message.当前模式为自动模式，如需开关，请调节至手动模式！") : $t("message.当前模式为手动模式，你可以手动打开或关闭各个开关！")}}</Lbar>
    <!-- 当前模式 end -->
		<a-card class="card-pd" id="smartgrow-operation-mobilebox">
      <!-- 头部标题 start -->
      <PageHeader :title="$t('message.手动操作')"></PageHeader>
      <!-- 头部标题 end -->
      <!-- tab切换 start -->
      <el-tabs tab-position="top">
        <el-tab-pane :label="$t('message.喷灌')"><Operation_1 /></el-tab-pane>
        <el-tab-pane :label="$t('message.配液')"><Operation_2 /></el-tab-pane>
        <el-tab-pane :label="$t('message.环境')"><Operation_3 /></el-tab-pane>
      </el-tabs>
      <!-- tab切换 end -->
		</a-card>
	</div>
</template>
<script>
  import {autoUpdateMixin} from "./mixins/autoUpdate"
  import {runInfoMixin} from "./mixins/runinfo"
	import Operation_1 from "./Operation/Operation_1"
	import Operation_2 from "./Operation/Operation_2"
	import Operation_3 from "./Operation/Operation_3"
  import Lbar from "./common/Lbar"
	export default {
    mixins: [autoUpdateMixin,runInfoMixin],
    components: {
    	Operation_1,
    	Operation_2,
    	Operation_3,
      Lbar
    },
    computed: {
      auto() {return this.getRunInfo("dig","AUTO")}
    }
	}
</script>