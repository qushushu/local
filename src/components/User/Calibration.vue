<!-- 
    组件说明： 本组件为标定校正。
    进入方式： 登录用户点击导航栏中"传感器校正"进入该页。
    用户权限： 操作员可以使用。
 -->
<template>
    <div class="ym-main">
         <!-- 本地版编号 start -->
        <slot name="dev_no" v-if="!isWeb"></slot>
        <slot name="current_pos" v-if="isWeb"></slot>
        <!-- 本地版编号 end -->
        <!-- 模式 start -->
        <div class="mode">{{runInfo.dig.AUTO ? $t("message.当前模式为自动模式，如需校正，请调节至手动模式！") : $t("message.当前模式为手动模式，您可以校正传感器！")}}</div>
        <!-- 模式 end -->
        <a-card class="card-pd" v-if="!runInfo.dig.AUTO">
            <!-- 头部标题 start -->
            <PageHeader :title="$t('message.校正')" goBack=false></PageHeader>
            <!-- 头部标题 end -->
            <!-- tab 切换 start -->
            <el-tabs tab-position="top">
                <el-tab-pane :label="$t('message.称重传感器校正')"><Weight></Weight></el-tab-pane>
                <el-tab-pane :label="$t('message.EC传感器校正')"><EC></EC></el-tab-pane>
                <el-tab-pane :label="$t('message.PH传感器校正')"><PH></PH></el-tab-pane>
            </el-tabs>
            <!-- tab 切换 end -->
        </a-card>
    </div>
</template>
<style scoped>
    .mode {text-align: center;margin-bottom: 10px;background: rgba(148,221,230,.5);padding: 8px 16px;color: #7a7a7a;font-size: 12px;font-weight: bold;}
</style>
<script>
    import projectJson from "../../config/project/config"
    import Weight from "./Calibration/Weight"
    import EC from "./Calibration/EC"
    import PH from "./Calibration/PH"
    let {isWeb} = projectJson;
    let timer;
    export default {
        components: {
            Weight,
            EC,
            PH,
        },
        computed: {
           runInfo() {return this.$store.state.runInfo},
           isWeb() {return isWeb}
        },
        methods: {
            updataRunInfo() {
                this.$store.dispatch("updateRunInfo");
            }
        },
        mounted() {
            this.updataRunInfo();
            timer = setInterval(this.updataRunInfo,1000);
        },
        destroyed () {
          clearInterval(timer);
        }
    }
</script>