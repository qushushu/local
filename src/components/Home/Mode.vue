<!-- 
  组件说明： 本组件为仪表盘页面左侧显示方案自动/手动组件。
-->
<template>
    <a-card size="small" class="space-btm" id="smart-home-modebox"> {{$t("message.模式")}}：{{runInfo.dig.AUTO ? $t("message.自动"): $t("message.手动")}} </a-card>
</template>
<script>
    import aCard from "../common/Acard"
    export default {
        computed: {
            runInfo() {
                return this.$store.state.runInfo;
            }
        },
        components: {
            aCard
        }
    }
</script>