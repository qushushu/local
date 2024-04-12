<!-- 
  组件说明： 本组件为仪表盘页面上面显示当前EC、PH值组件。
  其他说明： 这些值会自动变化，每秒中调用定时器更新数值。
-->
<template>
  <!-- PC端基本信息 start -->
  <a-card size="small" class="space-btm text-center" id="smartgrow-home-cardbox">
    <el-row justify="space-between" type="flex" class="home-flex-row" id="smartgrow-home-card">
      <el-col v-for="item,key in dataInfo" :key="key">
        <p class="text-dt">{{item.name}}</p>
        <p class="text-dd">{{item.value}} <span class="dw" v-if="item.dw">{{item.dw}}</span></p>
      </el-col>
    </el-row>
  </a-card>
  <!-- PC端基本信息 end -->
</template>
<script>
   import aCard from "../common/Acard"
    export default {
        computed: {
            runInfo() {
                return this.$store.state.runInfo;
            },
            isPlant() {
                return this.$store.state.isPlant;
            },
            dataInfo() {
              if(!this.isPlant) {
                return [{
                  name: this.$t('message.营养液EC'),
                  value: (this.runInfo.ana.EC ? this.runInfo.ana.EC.toFixed(2) : '--') ,
                  dw: "us/cm"
                },{
                  name: this.$t('message.营养液PH'),
                  value: this.runInfo.ana.PH ? this.runInfo.ana.PH.toFixed(2) : '--'
                },{
                  name: this.$t('message.左侧管道压力'),
                  value: (this.runInfo.ana.OUT_PRESS ? this.runInfo.ana.OUT_PRESS.toFixed(2) : '0'),
                  dw: "KPA"
                },{
                  name: this.$t('message.右侧管道压力'),
                  value: (this.runInfo.ana.OUT_PRESS2 ? this.runInfo.ana.OUT_PRESS2.toFixed(2) : '0'),
                  dw: "KPA"
                },{
                  name: this.$t('message.液温'),
                  value: (this.runInfo.ana.LIQ_TEMP ? this.runInfo.ana.LIQ_TEMP.toFixed(2) : '--'),
                  dw: "℃"
                },{
                  name: this.$t('message.温度'),
                  value: (this.runInfo.ana.TEMP ? this.runInfo.ana.TEMP.toFixed(2) :  '--'),
                  dw: "℃"
                },{
                  name: this.$t('message.湿度'),
                  value: (this.runInfo.ana.HUM ? this.runInfo.ana.HUM.toFixed(2) : '--'),
                  dw: "%"
                },{
                  name: "CO2",
                  value: (this.runInfo.ana.CO2 ? this.runInfo.ana.CO2.toFixed(2) : '--') ,
                  dw: "ppm"
                }]
              } else {
                return [{
                  name: this.$t('message.营养液EC'),
                  value: (this.runInfo.ana.EC ? this.runInfo.ana.EC.toFixed(2) : '--') ,
                  dw: "us/cm"
                },{
                  name: this.$t('message.营养液PH'),
                  value: this.runInfo.ana.PH ? this.runInfo.ana.PH.toFixed(2) : '--'
                },{
                  name: this.$t('message.管道压力'),
                  value: (this.runInfo.ana.OUT_PRESS ? this.runInfo.ana.OUT_PRESS.toFixed(2) : '0'),
                  dw: "KPA"
                },{
                  name: this.$t('message.液温'),
                  value: (this.runInfo.ana.LIQ_TEMP ? this.runInfo.ana.LIQ_TEMP.toFixed(2) : '--'),
                  dw: "℃"
                },{
                  name: this.$t('message.温度'),
                  value: (this.runInfo.ana.TEMP ? this.runInfo.ana.TEMP.toFixed(2) :  '--'),
                  dw: "℃"
                },{
                  name: this.$t('message.湿度'),
                  value: (this.runInfo.ana.HUM ? this.runInfo.ana.HUM.toFixed(2) : '--'),
                  dw: "%"
                },{
                  name: "CO2",
                  value: (this.runInfo.ana.CO2 ? this.runInfo.ana.CO2.toFixed(2) : '--') ,
                  dw: "ppm"
                }]
              }
            }
        },
        components: {
            aCard
        }
    }
</script>