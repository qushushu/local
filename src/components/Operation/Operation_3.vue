<!-- 
  组件说明： 本组件为手动操作面板环境设置组件。
-->
<template>
	<div>
		<DevInfo />
		<LightYumiao v-if="!isPlant" />
		<!-- <LightYumiao1 /> -->
		<LightZhongzhi v-if="isPlant" />
		<!-- <LightPlant v-if="isPlant" /> -->
		<!-- <LightPlant /> -->
	</div>
</template>
<script>
	import DevInfo from './DevInfo'
	import LightYumiao from './LightYumiao'
	import LightYumiao1 from './LightYumiao1'
	import LightZhongzhi from './LightZhongzhi'
	export default {
		components: {
			DevInfo,
			LightYumiao,
			LightYumiao1,
			LightZhongzhi
		},
		computed: {
			isPlant() {
                return this.$store.state.isPlant;
            }
		}
	}
</script>