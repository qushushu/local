<template>
    <a-card>
        <card-header> {{$t("message.液位")}} </card-header>
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
</template>
<style scoped>
@-webkit-keyframes water-wave {
    0% {
        transform: rotate(0deg)
    }
    100% {
        transform: rotate(360deg)
    }
}
.shuixiang {border: 2px solid rgba(200,203,202,.4);height: 170px;position: relative;width: 100px;border-top: 0;border-bottom: 0;box-sizing: border-box;margin-top: 20px;margin-bottom: 8px;}
.shuixiang:before {position: absolute;content: "";display: block;width: 102px;height: 20px;background: rgba(200,203,202,.4);border-radius: 50%;top: -10px;left: -3px;}
.max-line,.min-line {position: absolute;width: 100%;}
.max-line {top: 12px;}
.min-line {bottom: 30px;}
.max-line span,.min-line span {position: absolute;right: -100px;font-size: 12px;color: #F56C6C;}
.warnLine,.warnLine1 {background: red !important;height: 3px !important;width: 15px !important;}
.warnLine:after {content: attr(upnum);position: absolute;width: 130px;font-size: 12px;color: red !important;right: -141px;top: -14px;}
.warnLine1:after {content: attr(downnum);position: absolute;width: 130px;font-size: 12px;color: red !important;right: -141px;top: -14px;}
.targetLine {background: #67C23A !important;height: 3px !important;width: 15px !important;}
.targetLine:after {content: attr(tarnum);position: absolute;width: 130px;font-size: 12px;color: #67C23A !important;right: -141px;top: -14px;}
.adjLine {background: #E6A23C  !important;height: 3px !important;width: 15px !important;}
.adjLine:after {content: attr(adjnum);position: absolute;width: 130px;font-size: 12px;color: #E6A23C !important;right: -141px;top: -14px;}
.liqLine  {background: #513c20 !important;height: 3px !important;width: 15px !important;}
.liqLine:after {content: attr(liqBlv);position: absolute;width: 130px;font-size: 12px;color: #513c20 !important;right: -141px;top: -6px;}
.target-line,.adj-line {height: 2px;position: absolute;width: 100%;}
.target-line {bottom: 65%;}
.adj-line {bottom: 45%;}
.target-line span,.adj-line span,.liq-line span {position: absolute;font-size: 12px;}
.target-line span,.liq-line span {right: -97px;color: #67C23A;top: -6px;}
.adj-line span {right: -120px;color: #E6A23C;top: -6px;}

#kedu {position: absolute;left: 0;top: 18px;width: 100%;height: 136px;z-index: 4;}
.kd {width: 10px;background: #2d2f2f;height: 1px;position: absolute;right: 0;top: 20px;}
.currentHeight {background: rgba(51,207,255,.2);position: absolute;bottom: 0;height: 40px;width: 100%;}
.currentHeight:after {content: attr(curnum);position: relative;width: 100%;color: #0b1325;font-size: 12px;text-align: center;top: -18px;display: block;}
.waters {height: 65%; position: absolute;bottom: 0;left: 0; width: 100%; text-align: center; }
.watersInner {width: 97px; animation: water-wave linear infinite; overflow: hidden;height: 100px;position: absolute;bottom: 0;left: 0;transform-origin: left; }
.wave1{position: absolute; top: 40%; left: -25%; background: #33cfff; opacity: .7; width: 200%; height: 200%; border-radius: 40%; animation: inherit; animation-duration: 5s; }
.wave {background: #0eaffe;width: 200%;height: 200%;position: absolute;top: 40%;left: -40%;animation: inherit;animation-duration: 7s;border-radius: 35%;}
.wave3{position: absolute; top: 50%; left: -35%; background: #0f7ea4; opacity: .3; width: 200%; height: 200%; border-radius: 33%; animation: inherit; animation-duration: 11s; }
.waters-cur {text-align: center;font-size: 12px;color: #0b1325;}
#chunWater {position: absolute;bottom: 0;left: 0;width: 100%;height: 10px;background: #15AAE9;}
</style>
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
            // runInfo() {return this.$store.state.runInfo},
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