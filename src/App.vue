<template>
  <div id="app">
    <!-- 头部 start -->
    <Head></Head>
    <!-- 头部 end -->
    <div class="flex">
      <!-- 导航 start -->
      <Nav class="hide-mobile"></Nav>
      <!-- 导航 end -->
      <!-- 内容 start -->
      <router-view class="flex_all">
         <!-- 当前编号 start -->
         <CurrentNum slot="currentNum"></CurrentNum>
        <!-- 当前编号 end -->
      </router-view>
      <!-- 内容 end -->
    </div>
  </div>
</template>
<script>
  import Head from "./components/common/Head.vue"
  import Nav from "./components/common/Nav.vue"
  import CurrentNum from "./components/User/common/CurrentNum"
  export default {
    name: 'App',
    components: {
      Head,
      Nav,
      CurrentNum
    }
  }
</script>