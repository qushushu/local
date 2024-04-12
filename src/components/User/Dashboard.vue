<!-- 
  组件说明：本组件为首页组件。
  用户权限：默认情况下本组件针对所有人(含未登录用户)可见。但系统管理员登录系统后会自动跳转至用户管理页。
  其他说明：子组件的地址在同级目录Home文件夹下。
-->
<template>
  <!-- PC端主体内容 start -->
  <div class="ym-main">
    <!-- 顶部编号 start -->
    <slot name="currentNum"></slot>
    <!-- 顶部编号 end -->
    <!-- 当前环境参数 start -->
    <Nutrient />
    <!-- 当前环境参数 end -->
    
    <div v-if="!isMobile">
      <!-- 当前模式 start -->
      <Mode />
      <!-- 当前模式 end -->
      <!-- 喷灌泵 start -->
      <component :is="comIrr" />
      <!-- 喷灌泵 end -->
      <!-- 当前种植方案 start -->
      <CurrentPlan />
      <!-- 当前种植方案 end -->
      <!-- 补水阀 start -->
      <Moisturizing />
      <!-- 补水阀 end -->
      <!-- 育苗水阀 start -->
      <Valve v-if="!isPlant" class="space-btm" />
      <!-- 育苗水阀 end -->
      <!-- 液位 start -->
      <Level />
      <!-- 液位 end -->
      <!-- 植物灯 start -->
      <Light />
      <!-- 植物灯 end -->
    </div>
    <el-carousel v-else arrow="always" :height="'700px'" :autoplay="false">
      <el-carousel-item>
        <!-- 当前模式 start -->
        <Mode />
        <!-- 当前模式 end -->
        <!-- 喷灌泵 start -->
        <component :is="comIrr" />
        <!-- 喷灌泵 end -->
        <!-- 当前种植方案 start -->
        <CurrentPlan />
      </el-carousel-item>
      <el-carousel-item>
        <!-- 补水阀 start -->
        <Moisturizing />
        <!-- 补水阀 end -->
        <!-- 育苗水阀 start -->
        <Valve v-if="!isPlant" class="space-btm" />
        <!-- 育苗水阀 end -->
        <!-- 液位 start -->
        <Level />
        <!-- 液位 end -->
      </el-carousel-item>
      <el-carousel-item>
        <!-- 植物灯 start -->
        <Light />
        <!-- 植物灯 end -->
      </el-carousel-item>
    </el-carousel>

    <!-- 时钟 start -->
    <Clock />
    <!-- 时钟 end -->
  </div>
  <!-- PC端主体内容 end -->
</template>
<script>
  import {autoUpdateMixin} from "./mixins/autoUpdate"
  import Nutrient from "./Dashboard/Nutrient"
  import CurrentPlan from "./Dashboard/CurrentPlan"
  import IrrigationYm from "./Dashboard/IrrigationYm"
  import IrrigationZz from "./Dashboard/IrrigationZz"
  import Clock from "./Dashboard/Clock"
  import Mode from "./Dashboard/Mode"
  import Moisturizing from "./Dashboard/Moisturizing"
  import Valve from "./Dashboard/Valve"
  import Light from "./Dashboard/Light"
  import Level from "./Dashboard/Level"
  import {envMixin} from "@/components/mixins/envMix"
  export default {
    name: 'Dashboard',
    mixins: [autoUpdateMixin,envMixin],
    components: {
      Nutrient,
      CurrentPlan,
      IrrigationYm,
      IrrigationZz,
      Clock,
      Mode,
      Moisturizing,
      Valve,
      Level,
      Light
    },
    computed: {
      comIrr() {return this.isPlant ? "IrrigationZz": "IrrigationYm"}
    }
  }
</script>