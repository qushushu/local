<template>
    <!-- 液位 start -->
    <a-card>
        <card-header>{{$t("message.液位")}}</card-header>
        <div class="shuixiang">
            <div id="kedu" v-if="this.maxNum && this.minNum">
                <div class="kd" 
                    v-for="(item,key) in (maxNum - minNum + 1)" 
                    :class="{
                        warnLine: key == 0 ,
                        warnLine1: maxNum - key == minNum,
                        targetLine: maxNum - key == tarNum,
                        adjLine: maxNum - key == adjNum,
                    }"
                    :id="(maxNum - key) == curNum ? 'currentLine' : ''"
                    :style="{top: (key * (oneSpace)) + 'px'}" 
                    :adjnum="$t('message.调节启动值：') + (maxNum - key) + 'cm'" 
                    :tarnum="$t('message.目标值：') + (maxNum - key) + 'cm'" 
                    :curnum="$t('message.当前液位：') + (maxNum - key) + 'cm'"
                    :upnum="$t('message.上告警值：') + (maxNum) + 'cm'"
                    :downnum="$t('message.下告警值：') + (minNum) + 'cm'"
                    :snum = "maxNum - item + 1"
                ></div>
            </div>
            <div class="waters">
                <div class="watersInner" id="watersInnerBox">
                    <div class="wave1"></div>
                    <div class="wave"></div>
                    <div class="wave3"></div>
                </div>
                <div id="chunWater"></div>
            </div>
            <div class="currentHeight" id="currentHeight" :curnum="$t('message.当前液位：') + (liqLv)"></div>
        </div>
    </a-card>
    <!-- 液位 end -->
</template>
<script>
    import ToOp from "./ToOp"
    import {runInfoMixin} from "../mixins/runinfo"
    export default {
        mixins: [runInfoMixin],
        data() {
            return {
                renderWaterBox: false,
                showMax: 0,
                maxNum: 0,
                minNum: 0,
                tarNum: 0,
                adjNum: 0,
                space: 0,
                oneSpace: 0,
                curNum: 0
            }
        },
        watch: {
            liqLv() {
                this.renderWaterBox = true;
                this.resetData();
            }
        },
        computed: {
            liqLv() {
                let {value,unit} = this.getRunInfo("ana","LIQ_LV");
                return value + unit;
            },
            lbBwUpAlm() {return this.runInfo.param.LV_UP_ALM ? (this.runInfo.param.LV_UP_ALM + 'cm') : this.$t('message.未知')},
            lbBwAlm() {return this.runInfo.param.LV_ALM ? (this.runInfo.param.LV_ALM + 'cm') : this.$t('message.未知')},
            lvTv() {return this.runInfo.param.LV_TV ? (this.runInfo.param.LV_TV + 'cm') : this.$t('message.未知')},
            lvAdj() {return this.runInfo.param.LV_ADJ ? (this.runInfo.param.LV_ADJ + 'cm') : this.$t('message.未知')},
        },
        components: {
            ToOp
        },
        methods: {
            resetData() {
                this.maxNum = parseInt(this.lbBwUpAlm);  // 上告警值
                this.minNum = parseInt(this.lbBwAlm);  // 下告警值
                this.tarNum = parseInt(this.lvTv);
                this.adjNum = parseInt(this.lvAdj);
                this.curNum = parseInt(this.liqLv);
                let allge = this.maxNum - this.minNum;
                this.oneSpace = parseInt(136 / allge);
            }
        },
        mounted() {
            setTimeout(()=> {
                this.resetData();
            },300)
        }
    }
</script>