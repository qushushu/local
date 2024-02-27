<template>
    <a-card class="space-btm1 card-pd mobile-no-bg">
        <!-- 当前环境信息展示 start -->
        <el-row justify="space-between" :gutter="12" type="flex" class="huanhang">
            <el-col class="space-btm1" :span="6" :xs="7">
                <div class="mobile-wrap-card">
                    <p class="text-dt">{{$t("message.当前温度")}}</p>
                    <p class="text-dd">{{currentTemp.value}} <span class="dw">({{currentTemp.unit}})</span></p>
                </div>
            </el-col>

            <el-col class="space-btm1" :span="6" :xs="7">
                <div class="mobile-wrap-card">
                    <p class="text-dt">{{$t("message.当前湿度")}}</p>
                    <p class="text-dd">{{currentHum.value}} <span class="dw">({{currentHum.unit}})</span></p>
                </div>
            </el-col>

            <el-col class="space-btm1" :span="6" :xs="7">
                <div class="mobile-wrap-card">
                    <p class="text-dt">{{$t("message.当前CO2浓度")}}</p>
                    <p class="text-dd">{{currentCO2.value}} <span class="dw">({{currentCO2.unit}})</span></p>
                </div>
            </el-col>

             <el-col class="space-btm1" :span="6" :xs="7">
                <div class="mobile-wrap-card">
                    <p class="text-dt">{{$t("message.二氧化碳电磁阀")}}</p>
                    <p class="text-dd">
                        <el-switch v-model="runInfo.dig.CO2V == 1" style="margin-top: 12px;" class="mobile-co2-btn" @change="onChangeCO2V" :disabled="runInfo.dig.AUTO === 1" />
                    </p>
                </div>
            </el-col>

            <el-col class="space-btm1" :span="6" :xs="7" v-if="show_stage_content">
                <div class="mobile-wrap-card">
                    <p class="text-dt">{{$t("message.日目标温度")}}</p>
                    <p class="text-dd">{{temp_day}} <span class="dw">(℃)</span></p>
                </div>
            </el-col>

             <el-col class="space-btm1" :span="6" :xs="7" v-if="show_stage_content">
                <div class="mobile-wrap-card">
                    <p class="text-dt">{{$t("message.夜目标温度")}}</p>
                    <p class="text-dd">{{temp_night}} <span class="dw">(℃)</span></p>
                </div>
            </el-col>

            <el-col class="space-btm1" :span="6" :xs="7" v-if="show_stage_content">
                <div class="mobile-wrap-card">
                    <p class="text-dt">{{$t("message.日目标湿度")}}</p>
                    <p class="text-dd">{{humidity_day}} <span class="dw">(%)</span></p>
                </div>
            </el-col>

            <el-col class="space-btm1" :span="6" :xs="7" v-if="show_stage_content">
                <div class="mobile-wrap-card">
                    <p class="text-dt">{{$t("message.夜目标湿度")}}</p>
                    <p class="text-dd">{{humidity_night}} <span class="dw">(%)</span></p>
                </div>
            </el-col>

            <el-col class="space-btm1" :span="6" :xs="7" v-if="show_stage_content">
                <div class="mobile-wrap-card">
                    <p class="text-dt">{{$t("message.日出时间")}}</p>
                    <p class="text-dd">{{SUNRIZE}}</p>
                </div>
            </el-col>

            <el-col class="space-btm1" :span="6" :xs="7" v-if="show_stage_content">
                <div class="mobile-wrap-card">
                    <p class="text-dt">{{$t("message.日落时间")}}</p>
                    <p class="text-dd">{{SUNSET}}</p>
                </div>
            </el-col>
            <el-col :span="6" :xs="7"></el-col>
            <el-col :span="6" :xs="7"></el-col>
        </el-row>
        <!-- 当前环境信息展示 end -->
    </a-card>
</template>
<script>
    import {minuteToTime} from "../../../assets/tools/tool.js"
    import {runInfoMixin} from "../mixins/runinfo"
    export default {
        mixins: [runInfoMixin],
        computed: {
            // 运行信息
            runInfo() {return this.$store.state.runInfo},
            // 当前温度
            currentTemp() {return this.getRunInfo("ana","TEMP")},
            // 当前湿度
            currentHum() {return this.getRunInfo("ana","HUM")}, 
            // 当前CO2浓度
            currentCO2() {return this.getRunInfo("ana","CO2")},
            CO2V() {return this.getRunInfo("dig",["CO2V"][0].value)},
            planInfo() {return this.$store.state.currentInfo.plant},
            temp_day () {return this.planInfo.curStage.stage_content.length ? (this.planInfo.curStage.stage_content[0].TEMP_DAY || '--') :  "--"},
            temp_night () {return this.planInfo.curStage.stage_content.length ? (this.planInfo.curStage.stage_content[0].TEMP_NIGHT || '--') :  "--"},
            humidity_day() {return this.planInfo.curStage.stage_content.length ? (this.planInfo.curStage.stage_content[0].HUM_DAY || '--') :  "--"},
            humidity_night() {return this.planInfo.curStage.stage_content.length ? (this.planInfo.curStage.stage_content[0].HUM_NIGHT || '--') :  "--"},
            SUNRIZE() {return  this.planInfo.curStage.stage_content.length ? (this.minuteToTime(this.planInfo.curStage.stage_content[0].SUNRIZE) || '--') :  "--"},
            SUNSET() {return this.planInfo.curStage.stage_content.length ? (this.minuteToTime(this.planInfo.curStage.stage_content[0].SUNSET) || '--') :  "--"},
            show_stage_content() {return this.planInfo.curStage && this.planInfo.curStage.stage_content && this.planInfo.curStage.stage_content.length}
        },
        watch: {
            planInfo(data) {
                // 获取当前阶段
                let arr_stage_item = data.plant.stage_item;
                if(arr_stage_item.length) {
                      let disDay = (new Date() - new Date(data.start_time) ) / (24 * 3600 * 1000) - 1;
                      data.curStage = arr_stage_item[arr_stage_item.length - 1];
                      let tmp = arr_stage_item.find((item,index)=> (item.stage_content.day_offset >= disDay));
                      tmp && (data.curStage = tmp);
                } else {
                    data.curStage = {
                        stage_content: []
                    }
                }
            }
        },
        methods: {
            onChangeCO2V(checked) {
                this.$confirm(`${this.$t('message.确认修改二氧化碳电磁阀状态')}?`, this.$t('message.提示'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('message.确定'),
                    cancelButtonText: this.$t('message.取消'),
                }).then(()=> {
                    let value = checked ? 1 : 0;
                    this.$store.dispatch("control",{
                        data: {
                            data_id: 7,
                            data_code: "C_CO2_V",
                            value
                        }
                    });
                })
            },
            // 获取当前种植计划及当前阶段信息
            getCurrPlan() {
                this.$store.dispatch("getCurrentPlan");
            },
            minuteToTime
        },
        mounted() {
            this.getCurrPlan();
        }
    }
</script>