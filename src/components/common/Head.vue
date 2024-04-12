<!-- 
	组件说明：本组件为页面头部信息组件，包含PC端及移动端。
	测试帐号：姓名：liujunhui 电话：12345678 密码：1234567
-->
<template>
	<header :class="{mostTop: $route.name == 'Login'}">
		<el-row type="flex" justify="space-between" align="middle" class="head-box">
			<!-- logo start -->
			<el-col :xs="12"><router-link to="/" class="logo"><h1>{{logoTitle}}</h1></router-link></el-col>
			<!-- logo end -->
			<el-col>
				<el-row type="flex" justify="end" align="middle">
					<!-- 用户名 start -->
					<span class="head-operateNo" v-if="userInfo && userInfo.account">{{roleTitle}}：{{userInfo.account}}</span>
					<!-- 用户名 end -->
					<!-- 机器编号 start -->
					<i class="el-icon-s-platform menu-icon" @click="devDialogVisible = true" v-if="userInfo.role == 4"></i>
					<!-- 机器编号 end -->
					<!-- 切换种植间 start -->
					<ToggleRoom class="toggleRoom" v-if="isWeb && (userInfo.role == 4 || userInfo.role == 5)" />
					<!-- 切换种植间 end -->
					<!-- 设置 start -->
					<Setting />
					<!-- 设置 end -->
					<!-- 切换语言 start -->
					<ToggleLanguage />
					<!-- 切换语言 end -->
					<!-- 机器列表 start -->
					<el-dialog :title="$t('message.机器管理')" :visible.sync="devDialogVisible" width="403"><ToggleDev @send="devDialogVisible = false"></ToggleDev></el-dialog>
					<!-- 机器列表 end -->
				</el-row>
			</el-col>
		</el-row>
	</header>
</template>
<script>
	import Setting from "./head/Setting"
	import ToggleRoom from "./head/ToggleRoom"
	import ToggleLanguage from "./head/ToggleLanguage"
	import ToggleDev from "./head/Devices"
	import {getPowerText,globalUserEnter} from "../../assets/tools/tool.js"
	import {envMixin} from "@/components/mixins/envMix"
	export default {
		data() {
			return {
				devDialogVisible: false
			}
		},
		mixins: [envMixin],
		computed: {
            // 页面logo
            logoTitle() {return this.isPlant ? this.$t("message.植物工厂智能种植系统") : this.$t("message.植物工厂智能育苗系统")},
            // 用户信息
            userInfo() {return this.$store.state.userInfo.user},
            // 用户身份
            roleTitle() {return getPowerText(this.userInfo.role)}
		},
		components: {
			Setting,
			ToggleRoom,
			ToggleLanguage,
			ToggleDev
		},
		async mounted() {
			await globalUserEnter();
		}
	}
</script>