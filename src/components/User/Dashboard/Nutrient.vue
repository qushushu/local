<!-- 
  组件说明： 本组件为仪表盘页面上面显示当前EC、PH值组件。
  其他说明： 这些值会自动变化，每秒中调用定时器更新数值。
-->
<template>
  <a-card class="text-center">
    <card-header>{{$t("message.设备参数")}} <router-link class="btn-m" to="/DeviceInfo">{{$t("message.全部参数")}} <i class="el-icon-arrow-right"></i></router-link></card-header>
    <el-row justify="space-between" type="flex" v-if="!isMobile">
      <el-col v-for="item,key in dataInfo" :key="key">
        <p class="text-dt">{{item.name}}</p>
        <p class="text-dd">{{item.value}} <span class="dw" v-if="item.refUnit">{{item.unit}}</span></p>
      </el-col>
    </el-row>

    <div v-else>
      <el-row justify="space-between" type="flex" class="space-btm1">
        <el-col v-for="item,key in dataInfoMobile[0]" :key="key">
          <p class="text-dt">{{item.name}}</p>
          <p class="text-dd">{{item.value}} <span class="dw" v-if="item.refUnit">{{item.unit}}</span></p>
        </el-col>
      </el-row>

      <el-row justify="space-between" type="flex">
        <el-col v-for="item,key in dataInfoMobile[1]" :key="key">
          <p class="text-dt">{{item.name}}</p>
          <p class="text-dd">{{item.value}} <span class="dw" v-if="item.refUnit">{{item.unit}}</span></p>
        </el-col>
      </el-row>
    </div>
  </a-card>
</template>
<script>
  import {runInfoMixin} from "../mixins/runinfo"
  import {envMixin} from "@/components/mixins/envMix"
  export default {
    mixins: [runInfoMixin,envMixin],
    computed: {
      dataInfo() {
        return this.isPlant ? this.getRunInfo("ana",["EC","PH","OUT_PRESS","LIQ_TEMP","TEMP","HUM","CO2"]) : this.getRunInfo("ana",["EC","PH","OUT_PRESS","OUT_PRESS2","LIQ_TEMP","TEMP","HUM","CO2"]);
      },
      dataInfoMobile() {
        return this.isPlant ? [this.getRunInfo("ana",["EC","PH","OUT_PRESS","LIQ_TEMP"]),this.getRunInfo("ana",["TEMP","HUM","CO2"])] : [this.getRunInfo("ana",["EC","PH","OUT_PRESS","OUT_PRESS2"]),this.getRunInfo("ana",["LIQ_TEMP","TEMP","HUM","CO2"])];
      }
    }
  }
</script>