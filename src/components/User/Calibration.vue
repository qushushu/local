<!-- 
    组件说明： 本组件为标定校正。
    进入方式： 登录用户点击导航栏中"传感器校正"进入该页。
    用户权限： 操作员可以使用。
 -->
<template>
    <div class="ym-main">
        <!-- 顶部编号 start -->
        <slot name="currentNum"></slot>
        <!-- 顶部编号 end -->
        <!-- 模式 start -->
        <Lbar>{{auto.refValue ? $t("message.当前模式为自动模式，如需校正，请调节至手动模式！") : $t("message.当前模式为手动模式，您可以校正传感器！")}}</Lbar>
        <!-- 模式 end -->
        <a-card class="card-pd">
            <!-- 头部标题 start -->
            <PageHeader :title="$t('message.校正')"></PageHeader>
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
<script>
    import {autoUpdateMixin} from "./mixins/autoUpdate"
    import {runInfoMixin} from "./mixins/runinfo"
    import Weight from "./Calibration/Weight"
    import EC from "./Calibration/EC"
    import PH from "./Calibration/PH"
    import Lbar from "./common/Lbar"
    export default {
        mixins: [autoUpdateMixin,runInfoMixin],
        components: {
            Weight,
            EC,
            PH,
            Lbar
        },
        computed: {
           auto() {return this.getRunInfo("dig","AUTO")}
        }
    }
</script>