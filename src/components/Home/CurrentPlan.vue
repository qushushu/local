<!-- 
  组件说明： 本组件为仪表盘页面显示当前方案组件。
-->
<template>
    <a-card size="small" class="card-box_dark space-btm" v-if="planInfo.id">
        <div class="mycard-body">
            <!-- PC端详细信息 start -->
            <div class="normal-list">
              <el-descriptions class="form-text" size="middle" :column="2">
                <el-descriptions-item :label="$t('message.定做育苗')">{{plantName}} </el-descriptions-item>
                <el-descriptions-item :label="$t('message.EC目标值')">{{EC_TV}} </el-descriptions-item>
                <el-descriptions-item :label="$t('message.定植日期')">{{start_time}} </el-descriptions-item>
                <el-descriptions-item :label="$t('message.PH目标值')"> {{PH_TV}} </el-descriptions-item>
                <el-descriptions-item :label="$t('message.运行方案')">{{scheme_name}}</el-descriptions-item>
                <el-descriptions-item :label="$t('message.温度目标值')">{{temp_day}}（日） / {{temp_night}}（夜）</el-descriptions-item>
                <el-descriptions-item :label="$t('message.生产周期')">{{grow_cycle}} 天</el-descriptions-item>
                <el-descriptions-item :label="$t('message.湿度目标值')">{{humidity_day}}（日） / {{humidity_night}}（夜）</el-descriptions-item>
                <el-descriptions-item :label="$t('message.方案备注')">{{remark}} </el-descriptions-item>
                <el-descriptions-item :label="$t('message.日出/日落')">{{SUNRIZE}} / {{SUNSET}}</el-descriptions-item>
                <el-descriptions-item :label="$t('message.当前阶段')">{{stage_name}}</el-descriptions-item>
                <el-descriptions-item :label="$t('message.CO2目标值')">{{CO2}}</el-descriptions-item>
              </el-descriptions>
            </div>
            <!-- PC端详细信息 end -->
        </div>
    </a-card>
</template>
<style scoped>
    .card-box_dark {background: #78db6a;color: #FFF;}
    .mycard-body {align-items: center;display: flex;}
    .card-imgbox {width: 18%;top: -3px;}
    .card-img {width: 90%;height: auto;display: block;border-radius: 2px;margin-left: 5%;max-width: 150px;}
    .normal-list {box-sizing: border-box;padding-left: 20px;}
</style>
<script>
    import {formatTime,minuteToTime} from "../../assets/tools/tool.js"
    import aCard from "../common/Acard"
    export default {
        data() {
            return {
                defaultImg: "/static/error.png",
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
        computed: {
            apiurl() {
                return this.$store.state.apiurl;
            },
            planInfo() {
                return this.$store.state.currentPlanInfo;
            },
            plantName() {
                return this.planInfo.plant.plant ||  "--";
            },
            EC_TV() {
                return this.planInfo.curStage.stage_content.length ? (this.planInfo.curStage.stage_content[0].EC_TV || '--') :  "--";
            },
            start_time() {
                return formatTime(this.planInfo.start_time) || "--";
            },
            PH_TV() {
                return this.planInfo.curStage.stage_content.length ? (this.planInfo.curStage.stage_content[0].PH_TV || '--') :  "--";
            },
            scheme_name () {
                return this.planInfo.plant.scheme_name || "--";
            },
            temp_day () {
                return this.planInfo.curStage.stage_content.length ? (this.planInfo.curStage.stage_content[0].TEMP_DAY || '--') :  "--";
            },
            temp_night () {
                return this.planInfo.curStage.stage_content.length ? (this.planInfo.curStage.stage_content[0].TEMP_NIGHT || '--') :  "--";
            },
            grow_cycle() {
                return this.planInfo.plant.grow_cycle ||  "--";
            },
            humidity_day() {
                return this.planInfo.curStage.stage_content.length ? (this.planInfo.curStage.stage_content[0].HUM_DAY || '--') :  "--";
            },
            humidity_night() {
                return this.planInfo.curStage.stage_content.length ? (this.planInfo.curStage.stage_content[0].HUM_NIGHT || '--') :  "--";
            },
            remark() {
                return this.planInfo.plant.remark ||  "--";
            },
            CO2() {
                return this.planInfo.curStage.stage_content.length ? (this.planInfo.curStage.stage_content[0].CO2 || '--') :  "--";
            },
            SUNRIZE() {
                return  this.planInfo.curStage.stage_content.length ? (this.minuteToTime(this.planInfo.curStage.stage_content[0].SUNRIZE) || '--') :  "--";
            },
            SUNSET() {
                return this.planInfo.curStage.stage_content.length ? (this.minuteToTime(this.planInfo.curStage.stage_content[0].SUNSET) || '--') :  "--";
            },
            stage_name() {
                return this.planInfo.curStage.stage_content.length ? (this.planInfo.curStage.stage_content[0].stage_name || '--') :  "--";
            }
        },
        methods: {
            minuteToTime,
            // 获取当前种植计划及当前阶段信息
            getCurrPlan() {
                this.$store.dispatch("getCurrentPlan");
            },
            loadImgFail() {
                this.planInfo.plant.plant_image = this.defaultImg;
            },
            // 格式化时间
            formatTime
        },
        mounted() {
            this.getCurrPlan();
        },
        components: {
            aCard
        },
    }
</script>