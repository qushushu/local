<template>
    <el-row :gutter="10">
        <!-- 育苗左侧水阀 start -->
        <el-col :span="12">
            <a-card>
                <card-header><span>{{$t("message.左侧水阀")}}</span><ToOp></ToOp></card-header>
                <table class="normal-table table-bd-noly-btm mobile-normal-table">
                    <tr><td class="flex-between"><span>{{$t("message.4层")}}</span><el-switch v-model="VL4" disabled></el-switch></td></tr>
                    <tr><td class="flex-between"><span>{{$t("message.3层")}}</span><el-switch v-model="VL3" disabled></el-switch></td></tr>
                    <tr><td class="flex-between"><span>{{$t("message.2层")}}</span><el-switch v-model="VL2" disabled></el-switch></td></tr>
                    <tr><td class="flex-between"><span>{{$t("message.1层")}}</span><el-switch v-model="VL1" disabled></el-switch></td></tr>
                </table>
            </a-card>
        </el-col>
        <!-- 育苗左侧水阀 end -->
        <!-- 育苗右侧水阀 start -->
        <el-col :span="12">
            <a-card>
                <card-header><span>{{$t("message.右侧水阀")}}</span><ToOp></ToOp></card-header>
                <table class="normal-table table-bd-noly-btm mobile-normal-table">
                    <tr><td class="flex-between"><span>{{$t("message.4层")}}</span><el-switch v-model="VR4" disabled></el-switch></td></tr>
                    <tr><td class="flex-between"><span>{{$t("message.3层")}}</span><el-switch v-model="VR3" disabled></el-switch></td></tr>
                    <tr><td class="flex-between"><span>{{$t("message.2层")}}</span><el-switch v-model="VR2" disabled></el-switch></td></tr>
                    <tr><td class="flex-between"><span>{{$t("message.1层")}}</span><el-switch v-model="VR1" disabled></el-switch></td></tr>
                </table>
            </a-card>
        </el-col>
        <!-- 育苗右侧水阀 end -->
    </el-row>
</template>
<script>
    import ToOp from "./ToOp"
    import {runInfoMixin} from "../mixins/runinfo"
    export default {
        mixins: [runInfoMixin],
        components: {
            ToOp
        },
        computed: {
            VL1() {return this.getRunInfo("dig","VL1").refValue},
            VL2() {return this.getRunInfo("dig","VL2").refValue},
            VL3() {return this.getRunInfo("dig","VL3").refValue},
            VL4() {return this.getRunInfo("dig","VL4").refValue},
            VR1() {return this.getRunInfo("dig","VR1").refValue},
            VR2() {return this.getRunInfo("dig","VR2").refValue},
            VR3() {return this.getRunInfo("dig","VR3").refValue},
            VR4() {return this.getRunInfo("dig","VR4").refValue}
        }
    }
</script>