<!-- 
    组件说明： 本组件为标定校正。
    进入方式： 标定校正
    用户权限： 操作员可以使用。未登录用户或其他用户自动跳转至首页。
 -->
<template>
    <div class="ym-main">
        <a-card class="card-pd">
            <el-tabs tab-position="top">
                <el-tab-pane :label="$t('message.称重传感器校正')"><Weight></Weight></el-tab-pane>
                <el-tab-pane :label="$t('message.EC传感器校正')"><EC></EC></el-tab-pane>
                <el-tab-pane :label="$t('message.PH传感器校正')"><PH></PH></el-tab-pane>
            </el-tabs>
        </a-card>
    </div>
</template>
<script>
    import Weight from "./Calibration/Weight"
    import EC from "./Calibration/EC"
    import PH from "./Calibration/PH"
    import {autoJump} from "../assets/tools/tool"
    import aCard from "./common/Acard"
    export default {
        components: {
            Weight,
            EC,
            PH,
            aCard
        },
        mounted() {
            autoJump(1);
        }
    }
</script>