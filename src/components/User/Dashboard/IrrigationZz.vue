<template>
  <a-card>
    <card-header> 
      <span>{{$t("message.喷灌泵")}}：</span>
      <div><ToOp /><el-switch v-model="SIP" disabled /></div>
    </card-header>
    <div class="home-cardinner">
      <div>{{$t("message.本次持续时长(s)")}}: {{SIP1T.value}}</div> 
      <div>{{$t("message.下次喷灌时间")}}: {{SIP1NT}}</div>
    </div>
  </a-card>
</template>
<script>
  import {minuteToTime} from "../../../assets/tools/tool"
  import {runInfoMixin} from "../mixins/runinfo"
  import ToOp from "./ToOp"
  export default {
    mixins: [runInfoMixin],
    components: {
        ToOp
    },
    computed: {
      SIP() {return this.getRunInfo("dig","SIP").refValue},
      SIP1T() {return this.getRunInfo("ana","SIP1T")},
      SIP1NT() {return minuteToTime(this.getRunInfo("ana","SIP1NT").value)}
    }
  }
</script>