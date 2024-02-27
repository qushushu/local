<!-- 
  组件说明： 本组件为仪表盘页面左侧显示方案自动/手动组件。
-->
<template>
    <a-card>
    	<card-header type="only"> {{$t("message.模式")}}：{{auto.refValue ? $t("message.自动"): $t("message.手动")}}</card-header>
    </a-card>
</template>
<script>
	import {runInfoMixin} from "../mixins/runinfo"
    export default {
        mixins: [runInfoMixin],
        computed: {
            auto() {return this.getRunInfo("dig","AUTO")}
        }
    }
</script>