<!-- 
  组件说明：本组件为首页组件。
  用户权限：默认情况下本组件针对所有人(含未登录用户)可见。但系统管理员登录系统后会自动跳转至用户管理页。
  其他说明：子组件的地址在同级目录Cards文件夹下。
-->
<template>
    <div class="ym-main" :class="{'ym-main_mobile':isMobile}">
      <div class="inner">
        <RoomInfoBox v-if="devList.length"></RoomInfoBox>
        <div v-if="devList">
          <OneCard v-for="item,key in devList" :key="key" :dev="item"></OneCard>
        </div>
        <div v-if="!devList.length">
          <el-empty :description="$t('message.此种植间尚未添加设备')"></el-empty>
        </div>
      </div>
    </div>
</template>
<style scoped>
  .ym-main_mobile {padding: 18px 2% !important;}
</style>
<script>
  import RoomInfoBox from "./common/RoomInfoBox"
  import OneCard from "./Cards/OneCard"
  import {autoUpdateMixin} from "./mixins/autoUpdate"
  export default {
    name: 'Cards',
    mixins: [autoUpdateMixin],
    computed: {
      isMobile() {return this.$store.state.isMobile},
      currentRoomInfo() {return this.$store.state.currentInfo.room},
      devList() {return this.currentRoomInfo.devs || []},
    },
    components: {
      RoomInfoBox,
      OneCard
    }
  }
</script>