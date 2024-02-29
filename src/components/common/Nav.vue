<!-- 
  组件说明： 本组件为头部导航组件。
-->
<template>
    <el-menu :default-active="$route.path" @select="handleSelect" mode="vertical" router>
      <!-- <el-menu-item index="/Dashboard" v-if="userPower != 2 && !isWeb">{{$t("message.仪表盘")}}</el-menu-item> -->
      <!-- <el-menu-item index="/Operation" v-if="userPower == 4 && !isWeb">{{$t("message.手动操作")}}</el-menu-item> -->
      <!-- <el-menu-item index="/DeviceModel" v-if="userPower == 4 && !isWeb">{{$t("message.设备模板")}}</el-menu-item> -->
      <!-- <el-menu-item index="/Device" v-if="userPower == 4 && !isWeb">{{$t("message.设备参数")}}</el-menu-item> -->
      <!-- <el-menu-item index="/DeviceInfo" v-if="userPower == 4 && !isWeb">{{$t("message.设备信息")}}</el-menu-item> -->
      <!-- <el-menu-item index="/PlanSetting" v-if="userPower == 4 && !isWeb">{{$t("message.方案管理")}}</el-menu-item> -->
      <!-- <el-menu-item index="/History" v-if="userPower == 4 && !isWeb">{{$t("message.历史记录")}}</el-menu-item> -->
      <!-- <el-menu-item index="/Calibration" v-if="userPower == 4 && !isWeb">{{$t("message.传感器校正")}}</el-menu-item> -->

      <el-menu-item index="/Customer" v-if="userPower == 1">{{$t("message.客户管理")}}</el-menu-item>
      <el-menu-item index="/Factory" v-if="userPower == 1">{{$t("message.工厂管理")}}</el-menu-item>
      <el-menu-item index="/DeviceModel" v-if="userPower == 1">{{$t("message.模板管理")}}</el-menu-item>
      <el-menu-item index="/Language" v-if="userPower == 1">{{$t("message.多语言配置")}}</el-menu-item>
      <!-- <el-menu-item index="/User" v-if="userPower == 2">{{$t("message.用户管理")}}</el-menu-item>
      <el-menu-item index="/CreateLanguage" v-if="userPower == 2">{{$t("message.多语言配置")}}</el-menu-item>
      <el-menu-item index="/Sensor" v-if="userPower == 2">{{$t("message.传感器配置")}}</el-menu-item>
      <el-menu-item index="/DeviceGroup" v-if="userPower == 2">{{$t("message.机器管理")}}</el-menu-item> -->
    </el-menu>
</template>
<style scoped>
  .el-menu-item.is-active {color: #69C25C !important}
</style>
<script>
  import {opinion} from "../../assets/tools/tool.js"
  import projectJson from "../../config/project/config"
  let {isWeb} = projectJson;
	export default {
    data() {
      return {
        hideNav: true
      }
    },
    mounted() {
      this.mobileHideNav();
      // 更新用户权限
      this.$store.dispatch("updateUserPower");
      document.onclick = () =>{
        this.mobileHideNav();
      }
    },
    computed: {
      // 用户权限
      userPower() {
        console.log(this.$store.state.userInfo);
        if(this.$store.state.userInfo) {
          return Number(this.$store.state.userInfo.user.role);
        }
        else {
          return 0
        }
      },
      isWeb() {
        return isWeb;
      }
    },
    methods: {
      mobileHideNav() {
        if(opinion() === "mobile") {
          document.querySelector(".el-menu").classList.add("hide-mobile")
        }
      },
      handleSelect() {
        this.mobileHideNav();
      }
    }
  }
</script>