<!-- 
  组件说明： 本组件为手动操作面板环境设置组件。
-->
<template>
	<div>
		<DevInfo />
		<Light />
	</div>
</template>
<script>
	import DevInfo from './DevInfo'
	import Light from './Light'
	export default {
		components: {
			DevInfo,
			Light,
		}
	}
</script>