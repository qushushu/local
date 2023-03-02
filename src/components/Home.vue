<!-- 
  组件说明： 本组件为首页组件。
  用户权限： 默认情况下本组件针对所有人（包含未登录用户）均可见。但系统管理员登录系统后会自动跳转至用户管理页。
  其他说明：子组件的地址在同级目录Home文件夹下。
-->
<template>
  <div>
    <!-- PC端主体内容 start -->
    <div class="ym-main">
      <div class="inner">
        <!-- 当前编号 start -->
        <CurrentIp v-if="!isMobile"></CurrentIp>
        <!-- <CurrentIp></CurrentIp> -->
        <!-- 当前编号 end -->
        <!-- 移动端当前种植 start -->
        <div class="mobile-warp-inner hide-pc">
          <CurrentPlan style="border-radius: 10px;"></CurrentPlan>
        </div>
        <!-- 移动端当前种植 end -->
        <div class="mobile-warp-inner">
          <Nutrient></Nutrient>
        </div>
        <!-- PC端当前种植 start -->
        <CurrentPlan class="hide-mobile"></CurrentPlan>
        <!-- PC端当前种植 end -->
        <div class="mobile-warp-inner">
          <Mode></Mode>
          <Sprinkling></Sprinkling>
        </div>
      </div>
    </div>
    <!-- PC端主体内容 end -->
    <!-- 时钟 start -->
    <Clock></Clock>
    <!-- 时钟 end -->
  </div>
</template>
<style scoped>
  .space-left {padding-left: 8px;}
  .space-right {padding-right: 8px;}
  .showMoreInfo {float: right;color: #515a6e;font-size: 12px;}
  .morebtnbox {overflow: hidden;margin-bottom: 10px;}
</style>
<script>
  import Nutrient from "./Home/Nutrient"
  import CurrentPlan from "./Home/CurrentPlan"
  import Sprinkling from "./Home/Sprinkling"
  import Clock from "./Home/Clock"
  import Mode from "./Home/Mode"
  import CurrentIp from "./Home/CurrentIp"
  import {autoJump} from "../assets/tools/tool"
  export default {
    name: 'Home',
    components: {
      Nutrient,
      CurrentPlan,
      Sprinkling,
      Clock,
      Mode,
      CurrentIp
    },
    computed: {
      userPower() {
        return this.$store.state.userPower;
      },
      isMobile() {
          return this.$store.state.isMobile;
      },
    },
    watch: {
      userPower() {
        autoJump(0,1);
      }
    },
    methods: {
      // 获取仪表盘主体信息
      info() {
        this.$store.dispatch("updateRunInfo");
      },
    },
    mounted() {
      this.info();
      autoJump(0,1);
    }
  }
</script>