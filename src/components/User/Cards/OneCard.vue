<template>
  <a-card class="one-card" @handleClick="enterOneDev">
    <div class="card-head" style="display: flex;justify-content: space-between;">
      <span> {{this.dev.description || this.dev.instance_number}} </span>
        <span>
            <span style="margin-right: 18px;font-weight: normal;cursor: pointer;">{{$t("message.设备详情")}}</span>
            <!-- <span @click.stop="enterCalibration" style="margin-right: 18px;font-weight: normal;cursor: pointer;">{{$t("message.传感器校正")}}</span> -->
            <span @click.stop="enterOperation" style="margin-right: 18px;font-weight: normal;cursor: pointer;">{{$t("message.手动操作")}}</span>
            <span @click.stop="enterParameter" style="font-weight: normal;cursor: pointer;">{{$t("message.全部参数")}}</span>
        </span>
    </div>
    <div class="card-inner">
      <div v-for="item,key in dataInfoShow" :key="key">
        <p class="text-dt">{{item.name}}</p>
        <p class="text-dd"> 
          <span v-if="!item.select">{{item.value}} <span class="dw" v-if="item.dw">{{item.dw}}</span></span>
          <el-switch  v-else v-model="item.value == '1'" disabled></el-switch>
        </p>
      </div>
    </div>
  </a-card>
</template>
<style scoped>
  .common-card.one-card {margin-bottom: 15px;border: none ;border-radius: 10px;font-family: "Roboto", sans-serif;color: #FFF;background: #5cb385;box-shadow: 2px 4px 6px rgba(55, 52, 73, 0.4), inset -2px -2px 4px white;}
  .card-head {padding: 6px 20px;border-bottom: 1px solid #e3e8e6;color: #FFF;font-weight: bold;}
  .card-inner {padding-left: 20px;padding-right: 20px;line-height: 40px;}
  .card-inner > div {display: inline-block;width: 33.33%;}
  .text-dt,.text-dd {color: #FFF;line-height: 40px;}
  .text-dt {font-weight: bold;margin-top: 20px;line-height: 18px;}
</style>
<script>
  import {run_info} from "../../../store/ajax"
  import {setRunInfoOne,minuteToTime} from "../../../assets/tools/tool"
  export default {
    props: ["dev"],
    data() {
      return {
        dataInfo: {
            EC: "--",
            PH: "",
            LIQ_TEMP: "",
            SIP1: 0,
            SIP1T: '',
            SIP1NT: "",
            SIP2: 0,
            SIP2T: "",
            SIP2NT: "",
        }
      }
    },
    computed: {
      dataInfoShow() {
        return[{
         name: "EC",
         value: (this.dataInfo.EC ? this.dataInfo.EC : '--'),
         dw: "us/cm"
        },{
          name: "PH",
          value: this.dataInfo.PH ? this.dataInfo.PH : '--'
        },{
           name: this.$t('message.液温'),
           value: this.dataInfo.LIQ_TEMP ? this.dataInfo.LIQ_TEMP.toFixed(2) : '--',
           dw: "℃"
        },{
          name: this.$t('message.左喷灌泵'),
          value: this.dataInfo.SIP1,
          select: true
        },{
          name: this.$t('message.本次持续'),
          value: this.dataInfo.SIP1T || "--",
          dw: "s"
        },{
          name: this.$t('message.下次喷灌时间'),
          value: this.dataInfo.SIP1NT ? minuteToTime(this.dataInfo.SIP1NT)  : "--"
        },{
          name: this.$t('message.右喷灌泵'),
          value: this.dataInfo.SIP2,
          select: true
        },{
          name: this.$t('message.本次持续'),
          value: this.dataInfo.SIP2T || "--",
          dw: "s"
        },{
          name: this.$t('message.下次喷灌时间'),
          value: this.dataInfo.SIP2NT ? minuteToTime(this.dataInfo.SIP2NT)  : "--"
        }]
      } 
    },
    methods: {
      enterOneDev() {
        console.log(123);
        this.$store.commit("updateCurrentDevInfo",this.dev);
        this.$router.push({path: "/Dashboard"});
      },
      enterParameter() {
        this.$store.commit("updateCurrentDevInfo",this.dev);
        this.$router.push({path: "/Parameter"});
      },
      enterOperation() {
        this.$store.commit("updateCurrentDevInfo",this.dev);
        this.$router.push({path: "/Operation"});
      },
      enterCalibration() {
        this.$store.commit("updateCurrentDevInfo",this.dev);
        this.$router.push({path: "/Calibration"});
      },
      minuteToTime,
      async info() {
        let res = await run_info({
            device: this.dev.instance_number
        });
        let ana = setRunInfoOne("ana",res);
        let dig = setRunInfoOne("dig",res);
        this.dataInfo.EC = ana.EC;
        this.dataInfo.PH = ana.PH;
        this.dataInfo.LIQ_TEMP = ana.LIQ_TEMP;
        this.dataInfo.SIP1NT = ana.SIP1NT;
        this.dataInfo.SIP1T = ana.SIP1T;
        this.dataInfo.SIP2T = ana.SIP2T;
        this.dataInfo.SIP2NT = ana.SIP2NT;
        this.dataInfo.SIP1 = dig.SIP1;
        this.dataInfo.SIP2 = dig.SIP2;
      }
    },
    mounted() {
      this.info();
    }
  }
</script>