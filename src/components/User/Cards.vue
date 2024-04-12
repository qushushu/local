<!-- 
  组件说明：本组件为首页组件。
  用户权限：默认情况下本组件针对所有人(含未登录用户)可见。但系统管理员登录系统后会自动跳转至用户管理页。
  其他说明：子组件的地址在同级目录Cards文件夹下。
-->
<template>
  <div class="ym-main" :class="{'ym-main_mobile':isMobile}">
    <!-- 种植间信息 start -->
    <RoomInfoBox v-if="devList.length"></RoomInfoBox>
    <!-- 种植间信息 end -->
    <!-- 设备列表 start -->
    <div v-if="devList.length"><OneCard v-for="item,key in devList" :key="key" :dev="item"></OneCard></div>
    <!-- 设备列表 end -->
    <!-- 空设备 start -->
    <el-empty v-else :description="$t('message.此种植间尚未添加设备')"></el-empty>
    <!-- 空设备 end -->
  </div>
</template>
<script>
  import RoomInfoBox from "./common/RoomInfoBox"
  import OneCard from "./Cards/OneCard"
  import {autoUpdateMixin} from "./mixins/autoUpdate"
  import {envMixin} from "@/components/mixins/envMix"
  export default {
    name: 'Cards',
    mixins: [autoUpdateMixin,envMixin],
    computed: {
      currentRoomInfo() {return this.$store.state.currentInfo.room},
      devList() {return this.currentRoomInfo.devs || []}
    },
    components: {
      RoomInfoBox,
      OneCard
    }
  }
</script>