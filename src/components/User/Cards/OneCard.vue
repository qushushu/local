<template>
  <a-card class="one-card" @handleClick="enterOneDev">
    <!-- 设备描述 start -->
    <div class="card-head">{{this.dev.description || this.dev.instance_number}}</div>
    <!-- 设备描述 end -->
    <!-- 设备信息 start -->
    <div class="card-inner">
      <div v-for="item,key in dataInfoShow" :key="key">
        <p class="text-dt one-card-text-dt">{{item.name}}</p>
        <p class="text-dd one-card-text-dd"><span v-if="!item.select">{{item.value}}<span class="dw" v-if="item.value != '--' && item.dw"> {{item.dw}}</span></span><el-switch  v-else v-model="item.value == '1'" disabled></el-switch></p>
      </div>
    </div>
    <!-- 设备信息 end -->
  </a-card>
</template>
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
        this.$store.commit("updateCurrentDevInfo",this.dev);
        this.$router.push({path: "/Dashboard"});
      },
      minuteToTime,
      async info() {
        let res = await run_info({device: this.dev.instance_number});
        let {EC,PH,LIQ_TEMP,SIP1NT,SIP1T,SIP2T,SIP2NT}  = setRunInfoOne("ana",res);
        let {SIP1,SIP2} = setRunInfoOne("dig",res);
        this.dataInfo.EC = EC;
        this.dataInfo.PH = PH;
        this.dataInfo.LIQ_TEMP = LIQ_TEMP;
        this.dataInfo.SIP1NT = SIP1NT;
        this.dataInfo.SIP1T = SIP1T;
        this.dataInfo.SIP2T = SIP2T;
        this.dataInfo.SIP2NT = SIP2NT;
        this.dataInfo.SIP1 = SIP1;
        this.dataInfo.SIP2 = SIP2;
      }
    },
    mounted() {
      this.info();
    }
  }
</script>