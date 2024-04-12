<!-- 
  组件说明： 本组件为头部导航组件。
-->
<template>
    <el-menu :default-active="$route.path" mode="vertical" router>
      <!-- 系统管理员 start -->
      <el-menu-item index="/Customer" v-if="userPower == 1">{{$t("message.客户管理")}}</el-menu-item>
      <el-menu-item index="/Factory" v-if="userPower == 1">{{$t("message.工厂管理")}}</el-menu-item>
      <el-menu-item index="/DeviceModel" v-if="userPower == 1">{{$t("message.模板管理")}}</el-menu-item>
      <el-menu-item index="/Language" v-if="userPower == 1">{{$t("message.多语言配置")}}</el-menu-item>
      <!-- 系统管理员 end -->

      <!-- 企业管理员 start -->
      <el-menu-item index="/FactoryUser" v-if="userPower == 2 && isWeb">{{$t("message.用户管理")}}</el-menu-item>
      <el-menu-item index="/User" v-if="userPower == 2 && !isWeb">{{$t("message.用户管理")}}</el-menu-item>
      <el-menu-item index="/RoomList" v-if="userPower == 2 && isWeb">{{$t("message.种植间管理")}}</el-menu-item>
      <el-menu-item index="/Sensor" v-if="userPower == 2 && !isWeb">{{$t("message.传感器配置")}}</el-menu-item>
      <el-menu-item index="/Device" v-if="userPower == 2 && !isWeb">{{$t("message.机器管理")}}</el-menu-item>
      <!-- 企业管理员 end -->

      <!-- 用户导航 start -->
      <!-- <el-menu-item index="/Dashboard" v-if="userPower != 2 && !isWeb">{{$t("message.仪表盘")}}</el-menu-item> -->
      <!-- <el-menu-item index="/Operation" v-if="userPower == 4 && !isWeb">{{$t("message.手动操作")}}</el-menu-item> -->
      <!-- <el-menu-item index="/DeviceModel" v-if="userPower == 4 && !isWeb">{{$t("message.设备模板")}}</el-menu-item> -->
      <!-- <el-menu-item index="/Device" v-if="userPower == 4 && !isWeb">{{$t("message.设备参数")}}</el-menu-item> -->
      <!-- <el-menu-item index="/DeviceInfo" v-if="userPower == 4 && !isWeb">{{$t("message.设备信息")}}</el-menu-item> -->
      <!-- <el-menu-item index="/PlanSetting" v-if="userPower == 4 && !isWeb">{{$t("message.方案管理")}}</el-menu-item> -->
      <!-- <el-menu-item index="/History" v-if="userPower == 4 && !isWeb">{{$t("message.历史记录")}}</el-menu-item> -->
      <!-- <el-menu-item index="/Calibration" v-if="userPower == 4 && !isWeb">{{$t("message.传感器校正")}}</el-menu-item> -->
      <!-- 用户导航 end -->
    </el-menu>
</template>
<script>
  import {envMixin} from "@/components/mixins/envMix"
	export default {
    mixins: [envMixin],
    computed: {
      // 用户信息
      userInfo() {return this.$store.state.userInfo.user},
      // 用户权限
      userPower() {return this.userInfo.role},
    }
  }
</script>