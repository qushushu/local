<template>
    <!-- 育苗 start -->
    <el-row :gutter="10">
        <el-col :span="12">
            <!-- 左喷灌泵 start -->
            <a-card>
                <card-header>
                    <span>{{$t("message.左喷灌泵")}}</span>
                    <div>
                        <ToOp />
                        <el-switch v-model="SIP1" disabled></el-switch>
                    </div>
                </card-header>
                <div class="home-cardinner">
                    <div>{{$t("message.本次喷灌持续时长")}}（s）：{{SIP1T.value}} </div>
                    <div>{{$t("message.下次喷灌时间")}}：{{SIP1NT}}</div>
                </div>
            </a-card>
            <!-- 左喷灌泵 end -->
        </el-col>
        <el-col :span="12">
            <!-- 右喷灌泵 start -->
            <a-card>
                <card-header>
                    <span>{{$t("message.右喷灌泵")}}</span>
                    <div>
                        <ToOp />
                        <el-switch v-model="SIP2" disabled></el-switch>
                    </div>
                </card-header>
                <div class="home-cardinner">
                    <div>{{$t("message.本次喷灌持续时长")}}（s）：{{SIP2T.value}}</div>
                    <div>{{$t("message.下次喷灌时间")}}：{{SIP2NT}}</div>
                </div>
            </a-card>
            <!-- 右喷灌泵 end -->
        </el-col>
    </el-row>
    <!-- 育苗 end -->
</template>
<script>
    import {minuteToTime} from "../../../assets/tools/tool"
    import {runInfoMixin} from "../mixins/runinfo"
    import ToOp from "./ToOp"
    export default {
        mixins: [runInfoMixin],
        methods: {
            minuteToTime,
        },
        components: {
            ToOp,
        },
        computed: {
            SIP1() {return this.getRunInfo("dig","SIP1").refValue},
            SIP2() {return this.getRunInfo("dig","SIP2").refValue},
            SIP1T() {return this.getRunInfo("ana","SIP1T")},
            SIP1NT() {return minuteToTime(this.getRunInfo("ana","SIP1NT").value)},
            SIP2T() {return this.getRunInfo("ana","SIP2T")},
            SIP2NT() {return minuteToTime(this.getRunInfo("ana","SIP2NT").value)}
        }
   }
</script>