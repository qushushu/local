<template>
  <a-card size="small">
    <card-header type="only">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/Cards' }">{{currentRoomInfo.room_name}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{currentDev.description || currentDev.instance_number}}</el-breadcrumb-item>
      </el-breadcrumb>
      <router-link style="font-size: 14px;color: #606266;" :to="{ path: '/Cards' }">{{$t("message.返回设备列表")}}</router-link>
    </card-header>
  </a-card>
</template>
<script>
  export default {
      computed: {
        currentDev() {return this.$store.state.currentInfo.dev},
        currentRoomInfo() {return this.$store.state.currentInfo.room}
      }
  }
</script>