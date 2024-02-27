<template>
  <a-card type="sea">
    <card-header>{{currentInfo.room_name}}</card-header>
      <el-row justify="space-between" type="flex">
        <el-col :span="8" v-for="item,key in dataInfo" :key="key">
          <p class="text-dt">{{item.name}}</p>
          <p class="text-dd">{{item.value}}<span class="dw" v-if="item.unit !='--'"> {{item.unit}}</span></p>
        </el-col>
      </el-row>
  </a-card>
</template>
<style scoped>
  .text-dd {font-size: 26px;color:#FFF} 
  .text-dt {font-size: 14px;color:#FFF}
</style>
<script>
  import {runInfoMixin} from "../mixins/runinfo"
  export default {
    mixins: [runInfoMixin],
    computed: {
      currentInfo() {return this.$store.state.currentInfo.room},
      dataInfo() {return this.getRunInfo("ana",["TEMP","HUM","CO2"])}
    }
  }
</script>