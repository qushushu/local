<template>
    <a-card class="space-btm1 card-pd mobile-no-bg">
        <!-- 当前环境信息展示 start -->
        <el-row justify="space-between" :gutter="12" type="flex" class="huanhang">
            <el-col class="op-card_mobile1 space-btm1" :span="6" :xs="7">
                <div class="mobile-wrap-card">
                    <p class="text-dt">{{$t("message.当前温度")}}</p>
                    <p class="text-dd">{{currentTemp}} <span class="dw">(℃)</span></p>
                </div>
            </el-col>

            <el-col class="op-card_mobile1 space-btm1" :span="6" :xs="7">
                <div class="mobile-wrap-card">
                    <p class="text-dt">{{$t("message.当前湿度")}}</p>
                    <p class="text-dd">{{currentHum}} <span class="dw">(%)</span></p>
                </div>
            </el-col>

            <el-col class="op-card_mobile1 space-btm1" :span="6" :xs="7">
                <div class="mobile-wrap-card">
                    <p class="text-dt">{{$t("message.当前CO2浓度")}}</p>
                    <p class="text-dd">{{currentCO2}} <span class="dw">(ppm)</span></p>
                </div>
            </el-col>

             <el-col class="op-card_mobile1 space-btm1" :span="6" :xs="7">
                <div class="mobile-wrap-card">
                    <p class="text-dt">{{$t("message.二氧化碳电磁阀")}}</p>
                    <p class="text-dd">
                        <el-switch v-model="runInfo.dig.CO2V == 1" style="margin-top: 12px;" class="mobile-co2-btn" @change="onChangeCO2V" :disabled="runInfo.dig.AUTO === 1" />
                    </p>
                </div>
            </el-col>

            <el-col class="op-card_mobile1 space-btm1" :span="6" :xs="7" v-if="show_stage_content">
                <div class="mobile-wrap-card">
                    <p class="text-dt">{{$t("message.日目标温度")}}</p>
                    <p class="text-dd">{{temp_day}} <span class="dw">(℃)</span></p>
                </div>
            </el-col>

             <el-col class="op-card_mobile1 space-btm1" :span="6" :xs="7" v-if="show_stage_content">
                <div class="mobile-wrap-card">
                    <p class="text-dt">{{$t("message.夜目标温度")}}</p>
                    <p class="text-dd">{{temp_night}} <span class="dw">(℃)</span></p>
                </div>
            </el-col>

            <el-col class="op-card_mobile1 space-btm1" :span="6" :xs="7" v-if="show_stage_content">
                <div class="mobile-wrap-card">
                    <p class="text-dt">{{$t("message.日目标湿度")}}</p>
                    <p class="text-dd">{{humidity_day}} <span class="dw">(%)</span></p>
                </div>
            </el-col>

            <el-col class="op-card_mobile1 space-btm1" :span="6" :xs="7" v-if="show_stage_content">
                <div class="mobile-wrap-card">
                    <p class="text-dt">{{$t("message.夜目标湿度")}}</p>
                    <p class="text-dd">{{humidity_night}} <span class="dw">(%)</span></p>
                </div>
            </el-col>

            <el-col class="op-card_mobile1 space-btm1" :span="6" :xs="7" v-if="show_stage_content">
                <div class="mobile-wrap-card">
                    <p class="text-dt">{{$t("message.日出时间")}}</p>
                    <p class="text-dd">{{SUNRIZE}}</p>
                </div>
            </el-col>

            <el-col class="op-card_mobile1 space-btm1" :span="6" :xs="7" v-if="show_stage_content">
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
<style scoped>
.space-right {margin-right: 4px;}
.f-n {font-size: 14px;}
</style>
<script>
    import axios from 'axios'
    import aCard from "../common/Acard"
    import {formatTime,minuteToTime} from "../../assets/tools/tool.js"
    import {switchTimeToShow,switchTimeToSubmit} from "../../assets/tools/tool.js"
    export default {
        data() {
            return {
                showIptWd: false,
                showIptSd: false,
                show_temp_tv: 0,
                show_hum_tv: 0,
                TEMP_TV: "",
                HUM_TV: "",
                itemList: []   // 设备各项参数列表
            };
        },
        computed: {
            apiurl() {
                return this.$store.state.apiurl;
            },
            isPlant() {
                return this.$store.state.isPlant;
            },
            operateNo() {
                return this.$store.state.user.operateNo;
            },
            op_id() {
                return this.$store.state.user.userId;
            },
            // 运行信息
            runInfo() {
                return this.$store.state.runInfo;
            },
            // 当前温度
            currentTemp() {
                return this.runInfo.ana.TEMP ? this.runInfo.ana.TEMP.toFixed(2) : '--';
            },
            // 当前湿度
            currentHum() {
                return this.runInfo.ana.HUM ? this.runInfo.ana.HUM.toFixed(2) : '--';
            },
            // 当前CO2浓度
            currentCO2() {
                return this.runInfo.ana.CO2 ? this.runInfo.ana.CO2.toFixed(2) : '--';
            },
            planInfo() {
                return this.$store.state.currentPlanInfo;
            },
            temp_day () {
                return this.planInfo.curStage.stage_content.length ? (this.planInfo.curStage.stage_content[0].TEMP_DAY || '--') :  "--";
            },
            temp_night () {
                return this.planInfo.curStage.stage_content.length ? (this.planInfo.curStage.stage_content[0].TEMP_NIGHT || '--') :  "--";
            },
            humidity_day() {
                return this.planInfo.curStage.stage_content.length ? (this.planInfo.curStage.stage_content[0].HUM_DAY || '--') :  "--";
            },
            humidity_night() {
                return this.planInfo.curStage.stage_content.length ? (this.planInfo.curStage.stage_content[0].HUM_NIGHT || '--') :  "--";
            },
            SUNRIZE() {
                return  this.planInfo.curStage.stage_content.length ? (this.minuteToTime(this.planInfo.curStage.stage_content[0].SUNRIZE) || '--') :  "--";
            },
            SUNSET() {
                return this.planInfo.curStage.stage_content.length ? (this.minuteToTime(this.planInfo.curStage.stage_content[0].SUNSET) || '--') :  "--";
            },
            show_stage_content() {
                return this.planInfo.curStage && this.planInfo.curStage.stage_content && this.planInfo.curStage.stage_content.length;
            }
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
            // 获取当前设备值
            read() {
                axios({
                    url: `${this.apiurl}/la/device/param/read`,
                    method: "post",
                    data: {
                        data: {
                            operateNo: this.operateNo,
                            op_id: this.op_id,
                            op_type: this.isPlant ? "OP_PLANT_CALL_SET" : "OP_SEEDLING_CALL_SET",     
                            dev_id: 1
                        }
                    }
                }).then(data => {
                    if(data.data.code == 200) {
                        let itemList = data.data.data.item;
                        for(let i = 0;i < itemList.length;i++) {
                            itemList[i] = switchTimeToShow(itemList[i],"param_code","value");
                        }
                        this.itemList = itemList;
                        this.TEMP_TV = this.getValueFromParam("TEMP_TV")
                        this.HUM_TV = this.getValueFromParam("HUM_TV")
                    }
                })
            },
            // 工具函数
            getValueFromParam(param_code) {
                let arr = this.itemList.filter(item => item["param_code"] == param_code);
                return arr.length ? arr[0].value : "";
            },
            setValueFromParam(param_code,newData) {
                let arr = this.itemList.filter(item => item["param_code"] == param_code);
                arr[0].value = newData;
            },
            onChangeCO2V(checked) {
                this.$confirm('确认修改二氧化碳电磁阀状态?', '提示', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
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
        components: {
            aCard
        },
        mounted() {
            this.read();
            this.getCurrPlan();
        }
    }
</script>