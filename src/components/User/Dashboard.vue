<!-- 
  组件说明：本组件为首页组件。
  用户权限：默认情况下本组件针对所有人(含未登录用户)可见。但系统管理员登录系统后会自动跳转至用户管理页。
  其他说明：子组件的地址在同级目录Home文件夹下。
-->
<template>
  <div>
    <!-- PC端主体内容 start -->
    <div class="ym-main">
      <div class="inner">
        <!-- 这里网络版要加载roomBox -->
        <!-- <RoomInfoBox v-if="isWeb"></RoomInfoBox> -->
        <!-- 这里网络版要加载roomBox end -->
        <!-- 本地版编号 start -->
        <slot name="dev_no" v-if="!isWeb"></slot>
        <slot name="current_pos" v-if="isWeb"></slot>
        <!-- 本地版编号 end -->
        <!-- 当前环境参数 start -->
        <Nutrient></Nutrient>
        <!-- 当前环境参数 end -->
        <!-- 当前模式 start -->
        <Mode></Mode>
        <!-- 当前模式 end -->
        <!-- 喷灌泵 start -->
        <component :is="comIrr"></component>
        <!-- 喷灌泵 end -->
        <!-- 当前种植 start -->
        <CurrentPlan></CurrentPlan>
        <!-- 当前种植 end -->
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
    </div>
    <!-- PC端主体内容 end -->
    <!-- 时钟 start -->
    <Clock></Clock>
    <!-- 时钟 end -->
  </div>
</template>
<script>
  import {autoUpdateMixin} from "./mixins/autoUpdate"
  import projectJson from "../../config"
  import Nutrient from "./Dashboard/Nutrient"
  import CurrentPlan from "./Dashboard/CurrentPlan"
  import IrrigationYm from "./Dashboard/IrrigationYm"
  import IrrigationZz from "./Dashboard/IrrigationZz"
  import Clock from "./Dashboard/Clock"
  import Mode from "./Dashboard/Mode"
  import RoomInfoBox from "./common/RoomInfoBox"
  import Moisturizing from "./Dashboard/Moisturizing"
  import Valve from "./Dashboard/Valve"
  import Light from "./Dashboard/Light"
  import Level from "./Dashboard/Level"
  let {isPlant,isWeb} = projectJson;
  export default {
    name: 'Dashboard',
    mixins: [autoUpdateMixin],
    components: {
      Nutrient,
      CurrentPlan,
      IrrigationYm,
      IrrigationZz,
      Clock,
      Mode,
      RoomInfoBox,
      Moisturizing,
      Valve,
      Level,
      Light
    },
    computed: {
      isPlant() {return isPlant},
      isWeb() {return isWeb},
      comIrr() {return this.isPlant ? "IrrigationZz": "IrrigationYm"}
    }
  }
</script>