<!-- 
  组件说明： 本组件为仪表盘页面显示当前方案组件。
-->
<template>
    <a-card type="mint">
        <!-- 当前方案标题 start -->
        <card-header>{{$t("message.当前方案")}} <router-link v-if="userInfo.role == 4" class="btn-m" to="/PlanSetting">{{$t("message.方案管理")}} <i class="el-icon-arrow-right"></i></router-link></card-header>
        <!-- 当前方案标题 end -->
        <!-- PC端详细信息 start -->
        <el-descriptions v-if="planInfo.id" class="form-text" size="middle" :column="column">
            <el-descriptions-item :label="$t('message.定做育苗')">{{plantName}}</el-descriptions-item>
            <el-descriptions-item :label="$t('message.EC目标值')">{{EC_TV}}</el-descriptions-item>
            <el-descriptions-item :label="$t('message.定植日期')">{{start_time}}</el-descriptions-item>
            <el-descriptions-item :label="$t('message.栽培时间')">{{plantingTime}}</el-descriptions-item>
            <el-descriptions-item :label="$t('message.PH目标值')"> {{PH_TV}}</el-descriptions-item>
            <el-descriptions-item :label="$t('message.运行方案')">{{scheme_name}}</el-descriptions-item>
            <el-descriptions-item :label="$t('message.温度目标值')">{{temp_day}}（{{$t("message.日")}}） / {{temp_night}}（{{$t("message.夜")}}）</el-descriptions-item>
            <el-descriptions-item :label="$t('message.生产周期')">{{grow_cycle}}{{$t("message.天")}}</el-descriptions-item>
            <el-descriptions-item :label="$t('message.湿度目标值')">{{humidity_day}}（{{$t("message.日")}}）/ {{humidity_night}}（{{$t("message.夜")}}）</el-descriptions-item>
            <el-descriptions-item :label="$t('message.方案备注')">{{remark}}</el-descriptions-item>
            <el-descriptions-item :label="$t('message.日出/日落')">{{SUNRIZE}} / {{SUNSET}}</el-descriptions-item>
            <el-descriptions-item :label="$t('message.当前阶段')">{{stage_name}}</el-descriptions-item>
            <el-descriptions-item :label="$t('message.CO2目标值')">{{CO2}}</el-descriptions-item>
        </el-descriptions>
        <!-- PC端详细信息 end -->
        <!-- 无数据 展示 start -->
        <div v-else class="no_data text-center"> {{userInfo.role == 4 ? this.$t('message.尚未配置种植方案，请点击右侧方案详情进行配置！') : this.$t('message.尚未配置种植方案！')}} </div>
        <!-- 无数据 展示 end -->
    </a-card>
</template>
<script>
    import {formatTime,minuteToTime} from "../../../assets/tools/tool.js"
    import {envMixin} from "@/components/mixins/envMix"
    export default {
        mixins: [envMixin],
        computed: {
            // 用户信息
            userInfo() {return this.$store.state.userInfo.user},
            plantingTime() {return this.datedifference(new Date(),this.start_time) + ' Day'},
            planInfo() {return this.$store.state.currentInfo.plant},
            plantName() {return this.planInfo.plant.plant ||  "--"},
            EC_TV() {return (this.planInfo.curStage && this.planInfo.curStage.stage_content.length) ? (this.planInfo.curStage.stage_content[0].EC_TV || '--') :  "--"},
            start_time() {return formatTime(this.planInfo.start_time) || "--"},
            PH_TV() {return (this.planInfo.curStage && this.planInfo.curStage.stage_content.length) ? (this.planInfo.curStage.stage_content[0].PH_TV || '--') :  "--"},
            scheme_name () {return this.planInfo.plant.scheme_name || "--"},
            temp_day () {return (this.planInfo.curStage && this.planInfo.curStage.stage_content.length) ? (this.planInfo.curStage.stage_content[0].TEMP_DAY || '--') :  "--"},
            temp_night () {return (this.planInfo.curStage && this.planInfo.curStage.stage_content.length) ? (this.planInfo.curStage.stage_content[0].TEMP_NIGHT || '--') :  "--"},
            grow_cycle() {return this.planInfo.plant.grow_cycle ||  "--"},
            humidity_day() {return (this.planInfo.curStage && this.planInfo.curStage.stage_content.length) ? (this.planInfo.curStage.stage_content[0].HUM_DAY || '--') :  "--"},
            humidity_night() {return (this.planInfo.curStage && this.planInfo.curStage.stage_content.length) ? (this.planInfo.curStage.stage_content[0].HUM_NIGHT || '--') :  "--"},
            remark() {return this.planInfo.plant.remark ||  "--"},
            CO2() {return (this.planInfo.curStage && this.planInfo.curStage.stage_content.length) ? (this.planInfo.curStage.stage_content[0].CO2 || '--') :  "--"},
            SUNRIZE() {return  (this.planInfo.curStage && this.planInfo.curStage.stage_content.length) ? (this.minuteToTime(this.planInfo.curStage.stage_content[0].SUNRIZE) || '--') :  "--"},
            SUNSET() {return (this.planInfo.curStage && this.planInfo.curStage.stage_content.length) ? (this.minuteToTime(this.planInfo.curStage.stage_content[0].SUNSET) || '--') :  "--"},
            stage_name() {return (this.planInfo.curStage && this.planInfo.curStage.stage_content.length) ? (this.planInfo.curStage.stage_content[0].stage_name || '--') :  "--"},
            factory_num() {
                if(this.$store.state.userInfo.factory) {
                    return this.$store.state.userInfo.factory.factory_num;
                } else {
                    return -1;
                }
            },
            currentDevInfo() {return this.$store.state.currentInfo.dev},
            column() {return this.isMobile ? 2 : 4}
        },
        watch: {
            // 切换设备后，重新获取当前方案
            currentDevInfo() {
                this.getCurrPlan();
            },
            // 方案变更后，重新获取当前阶段
            planInfo(data) {
                if(data.plant) {
                    let arr_stage_item = data.plant.stage_item;
                    if(arr_stage_item.length) {
                        // 获取方案执行的天数
                        let disDay = (new Date() - new Date(data.start_time)) / (24 * 3600 * 1000) - 1;
                        // 获取方案的最后一个阶段
                        data.curStage = arr_stage_item[arr_stage_item.length - 1];
                        let curStage = arr_stage_item.find(item => item.stage_content.day_offset >= disDay);
                        curStage && (data.curStage = curStage);
                    } else {
                        data.curStage = {
                            stage_content: []
                        }
                    }
                }
            }
        },
        methods: {
             datedifference(sDate1, sDate2) {
                return Math.floor(Math.abs(Date.parse(sDate1) - Date.parse(sDate2)) / (24 * 3600 * 1000));
            },
            minuteToTime,
            // 获取当前种植计划及当前阶段信息
            getCurrPlan() {
                this.$store.dispatch("getCurrentPlan");
            },
            // 格式化时间
            formatTime
        },
        mounted() {
            this.getCurrPlan();
        }
    }
</script>