<template>
  <div id="app">
    <!-- 头部 start -->
    <Head></Head>
    <!-- 头部 end -->
    <div id="mainBox" class="flex">
      <!-- 导航 start -->
      <Nav></Nav>
      <!-- 导航 end -->
      <!-- 内容 start -->
      <router-view class="flex_all">
         <!-- 当前编号 start -->
         <CurrentIp slot="dev_no"></CurrentIp>
         <CurrentPos slot="current_pos"></CurrentPos>
        <!-- 当前编号 end -->
      </router-view>
      <!-- 内容 end -->
    </div>
  </div>
</template>
<script>
  import Head from "./components/common/Head.vue"
  import Nav from "./components/common/Nav.vue"
  import CurrentIp from "./components/common/CurrentIp"
  import CurrentPos from "./components/User/common/CurrentPos"
  // 配置项
  let modeIsPlant = false; // 默认为育苗，如果该值设置为true，切换为种植。
  export default {
    name: 'App',
    components: {
      Head,
      Nav,
      CurrentIp,
      CurrentPos
    },
    // computed: {
    //   isMobile() {
    //       return this.$store.state.isMobile;
    //   },
    // },
    // mounted() {
    //   /* 种植模式浏览器增加m=plant标识 */
    //   if(this.isMobile) {
    //     location.search = modeIsPlant ? "?m=plant" : "";
    //   }
    // }
  }
</script>