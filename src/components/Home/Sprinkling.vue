<!-- 
  组件说明： 本组件为仪表盘页面右侧显示喷灌泵相关信息组件。
-->
<template>
    <div>
        <el-row :gutter="10" v-if="!isPlant">
            <el-col :span="12">
                <!-- 左喷灌泵 start -->
                <div class="home-cardbox">
                    <div class="home-cardtitle flex-between">
                        <span>{{$t("message.左喷灌泵")}}</span>
                        <el-switch v-model="runInfo.dig.SIP1 == 1" disabled></el-switch>
                    </div>
                    <div class="home-cardinner">
                        <div>{{$t("message.本次喷灌持续时长")}}（s）：{{runInfo.ana.SIP1T || "--"}} </div>
                        <div>{{$t("message.下次喷灌时间")}}：{{runInfo.ana.SIP1NT ? minuteToTime(runInfo.ana.SIP1NT)  : "--"}}</div>
                    </div>
                </div>
                <!-- 左喷灌泵 end -->
            </el-col>
            <el-col :span="12">
                <!-- 右喷灌泵 start -->
                <div class="home-cardbox">
                    <div class="home-cardtitle flex-between">
                        <span>{{$t("message.右喷灌泵")}}</span>
                        <el-switch v-model="runInfo.dig.SIP2 == 1" disabled></el-switch>
                     </div>
                    <div class="home-cardinner">
                        <div>{{$t("message.本次喷灌持续时长")}}（s）：{{runInfo.ana.SIP2T || "--"}}</div>
                        <div>{{$t("message.下次喷灌时间")}}：{{runInfo.ana.SIP2NT ? minuteToTime(runInfo.ana.SIP2NT)  : "--"}}</div>
                    </div>
                </div>
                <!-- 右喷灌泵 end -->
            </el-col>
        </el-row>
        <!-- 种植的喷灌泵、水阀 start -->
        <el-row :gutter="10" v-if="isPlant">
            <el-col :span="12" :xs="24">
                <div class="home-cardbox">
                    <div class="home-cardtitle flex-between">{{$t("message.喷灌泵")}}<span style="font-size: 12px;"><span>{{$t("message.本次持续时长(s)")}}:</span> {{SIP1T}} <span style="margin-left: 8px;">{{$t("message.下次喷灌时间")}}:</span> {{SIP1NT}} </span></div>
                </div>
            </el-col>
            <el-col :span="12" :xs="24">
                <div class="home-cardbox">
                    <div class="home-cardtitle flex-between">{{$t("message.水阀")}}<el-switch  disabled></el-switch></div>
                </div>
            </el-col>
        </el-row>
        <!-- 种植的喷灌泵、水阀 end -->
        <el-row :gutter="10">
            <el-col :span="12">
                <!-- 回水泵 start -->
                <div class="home-cardbox">
                    <div class="home-cardtitle flex-between">{{$t("message.回水泵")}}<el-switch v-model="runInfo.dig.BWP == 1"></el-switch></div>
                </div>
                <!-- 回水泵 end -->
            </el-col>
            <el-col :span="12">
                 <!-- 补水阀 start -->
                <div class="home-cardbox">
                    <div class="home-cardtitle flex-between">{{$t("message.补水阀")}}<el-switch v-model="runInfo.dig.WSV == 1" disabled></el-switch></div>
                </div>
                <!-- 补水阀 end -->
            </el-col>
        </el-row>
        <!-- 育苗水阀 start -->
        <el-row :gutter="10" v-if="!isPlant">
            <!-- 育苗左侧水阀 start -->
            <el-col :span="12">
                <div class="home-cardbox">
                    <div class="home-cardtitle">{{$t("message.左侧水阀")}}</div>
                    <table class="normal-table mobile-normal-table">
                        <tr>
                            <td class="flex-between">
                                <span>{{$t("message.4层")}}</span> 
                                <el-switch v-model="runInfo.dig.VL4 == '1'" disabled class="space-left1"></el-switch>
                            </td>
                        </tr>
                        <tr>
                            <td class="flex-between">
                                <span>{{$t("message.3层")}}</span>
                                <el-switch v-model="runInfo.dig.VL3 == '1'" disabled class="space-left1"></el-switch>
                            </td>
                        </tr>
                        <tr>
                            <td class="flex-between">
                                <span>{{$t("message.2层")}}</span> 
                                <el-switch v-model="runInfo.dig.VL2 == '1'" disabled class="space-left1"></el-switch>
                            </td>
                        </tr>
                        <tr>
                            <td class="flex-between">
                                <span>{{$t("message.1层")}}</span>
                                <el-switch v-model="runInfo.dig.VL1 == '1'" disabled class="space-left1"></el-switch>
                            </td>
                        </tr>
                    </table>
                </div>
            </el-col>
            <!-- 育苗左侧水阀 end -->
            <!-- 育苗右侧水阀 start -->
            <el-col :span="12">
                <div class="home-cardbox">
                    <div class="home-cardtitle">{{$t("message.右侧水阀")}}</div>
                    <table class="normal-table mobile-normal-table">
                        <tr>
                            <td class="flex-between">
                                <span>{{$t("message.4层")}}</span> 
                                <el-switch v-model="runInfo.dig.VR4 == '1'" disabled class="space-left1"></el-switch></span>
                            </td>
                        </tr>
                        <tr>
                            <td class="flex-between">
                                <span>{{$t("message.3层")}}</span> 
                                <el-switch v-model="runInfo.dig.VR3 == '1'" disabled class="space-left1"></el-switch>
                            </td>
                        </tr>
                        <tr>
                            <td class="flex-between">
                                <span>{{$t("message.2层")}}</span> 
                                <el-switch v-model="runInfo.dig.VR2 == '1'" disabled class="space-left1"></el-switch>
                            </td>
                        </tr>
                        <tr>
                            <td class="flex-between">
                                <span>{{$t("message.1层")}}</span> 
                                <el-switch v-model="runInfo.dig.VR1 == '1'" disabled class="space-left1"></el-switch>
                            </td>
                        </tr>
                    </table>
                </div>
            </el-col>
            <!-- 育苗右侧水阀 end -->
        </el-row>
        <!-- 育苗水阀 end -->
        <!-- <div class="flex"> -->
        <div>
            <!-- 液位 start -->
            <!-- <div class="home-cardbox home-autowidth-card"> -->
            <div class="home-cardbox">
                <div class="home-cardtitle">{{$t("message.液位")}}</div>
                <div class="home-cardinner">
                     <WaterBox 
                        :liqLv="liqLv"
                        :lbBwUpAlm="lbBwUpAlm"
                        :lbBwAlm="lbBwAlm"
                        :lvTv="lvTv"
                        :lvAdj="lvAdj"
                    ></WaterBox>
                </div>
            </div>
            <!-- 液位 end -->
            <!-- 回水液位 start -->
            <!-- <div class="home-cardbox home-autowidth-card">
                <div class="home-cardtitle">{{$t("message.回水液位")}}</div>
                <div class="home-cardinner">
                     <BWaterBox 
                         :liqLv="liqLv1"
                         :lbBwUpAlm="lbBwUpAlm1"
                         :lbBwAlm="lbBwAlm1"
                         :lvTv="lvTv1"
                         :lvAdj="lvAdj1"
                    ></BWaterBox>
                </div>
            </div> -->
            <!-- 回水液位 end -->
        </div>
    </div>
</template>
<style scoped>
  .form-text-inner {display: flex;justify-content: space-between;width: 85%;}
  .card {margin-bottom: 10px;}
  .space-left1 {margin-left: 1px;}
  .home-cardbox {background: #FFF;padding: 0px 0 4px;margin-bottom: 10px;font-size: 12px;border-radius: 2px;color: #808695}
  .home-cardtitle {border-bottom: 1px solid #e8e8e8;padding: 8px 8px;font-size: 14px;}
  .home-cardtitle:only-child {padding-bottom: 3px;border-bottom: 0;}
  .home-cardinner {padding: 0 8px;line-height: 30px;}
  .flex-between {display: flex;justify-content: space-between;align-items: center;}
</style>
<script>
    import {minuteToTime} from "../../assets/tools/tool"
    import WaterBox from "./WaterBox"
    import BWaterBox from "./BWaterBox"
    export default {
        data() {
            return {
                tableData: [{title: "第四层"}, {title: "第三层"}, {title: "第二层"},{title: "第一层"}],
                tableData1: [{title: "回水泵状态"}],
                renderWaterBox: false,
                renderWaterBox1: false
            }
        },
        methods: {
            minuteToTime
        },
        watch: {
            liqLv() {
                this.renderWaterBox = true;
            },
            liqLv1() {
                this.renderWaterBox1 = true;
            }
        },
        computed: {
            isPlant() {
                return this.$store.state.isPlant;
            },
            runInfo() {
                return this.$store.state.runInfo;
            },
            liqLv() {
                return this.runInfo.ana.LIQ_LV ? (this.runInfo.ana.LIQ_LV.toFixed(1) + 'cm') : '未知'
            },
            lbBwUpAlm() {
                return this.runInfo.param.LV_UP_ALM ? (this.runInfo.param.LV_UP_ALM + 'cm') : '未知'
            },
            lbBwAlm() {
                return this.runInfo.param.LV_ALM ? (this.runInfo.param.LV_ALM + 'cm') : '未知'
            },
            lvTv() {
                return this.runInfo.param.LV_TV ? (this.runInfo.param.LV_TV + 'cm') : '未知'
            },
            lvAdj() {
                return this.runInfo.param.LV_ADJ ? (this.runInfo.param.LV_ADJ + 'cm') : '未知'
            },
            liqLv1() {
                return this.runInfo.ana.LIQ_B_LV ? (this.runInfo.ana.LIQ_B_LV + 'cm') : '未知'
            },
            lbBwUpAlm1() {
                return this.runInfo.param.LV_BW_UP_ALM ? (this.runInfo.param.LV_BW_UP_ALM + 'cm') : '未知'
            },
            lbBwAlm1() {
                return this.runInfo.param.LV_BW_ALM ? (this.runInfo.param.LV_BW_ALM + 'cm') : '未知'
            },
            lvTv1() {
                return this.runInfo.param.LV_BW_TV ? (this.runInfo.param.LV_BW_TV + 'cm') : '未知'
            },
            lvAdj1() {
                return this.runInfo.param.LV_BW_ADJ ? (this.runInfo.param.LV_BW_ADJ + 'cm') : '未知'
            },
            SIP1T() {
                return  this.runInfo.ana.SIP1T ? (this.runInfo.ana.SIP1T) : (this.runInfo.ana.SIP1T == 0 ? 0 :'--')
            },
            SIP1NT() {
                return  this.runInfo.ana.SIP1NT ? (minuteToTime(this.runInfo.ana.SIP1NT)) : ('--')
            }
        },
        components: {
            WaterBox,
            BWaterBox
        }
    }
</script>