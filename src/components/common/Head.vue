<!-- 
	组件说明：本组件为页面头部信息组件，包含PC端及移动端。
	测试帐号：姓名：liujunhui 电话：12345678 密码：1234567
-->
<template>
	<header>
		<el-row type="flex" justify="space-between" align="middle" class="head-box">
			<el-col :span="12">
				<router-link to="/" class="logo"><h1>{{logoTitle}}</h1></router-link>
			</el-col>
			<el-col :span="12">
				<el-row type="flex" justify="end" align="middle">
					<!-- 移动端更多 start -->
					<i class="el-icon-more" id="mobile-control-more" @click.stop="tgMobileNav" v-if="isMobile"></i>
					<!-- 移动端更多 end -->
					<!-- 用户名 start -->
					<span class="head-operateNo" v-if="userInfo && userInfo.account">{{roleTitle}}：{{userInfo.account}}</span>
					<!-- 用户名 end -->

					<!-- 机器编号 start -->
					<i class="el-icon-s-platform menu-icon" @click="tgShowNumLayer"></i>
					<!-- 机器编号 end -->

					<!-- 切换种植间 start -->
					<ToggleRoom class="toggleRoom" v-if="isWeb && (userInfo.role == 4 || userInfo.role == 5)" />
					<!-- 切换种植间 end -->
					<!-- 齿轮 start -->
					<Setting />
					<!-- 齿轮 end -->
					<!-- 切换语言 start -->
					<ToggleLanguage @lan="lan"/>
					<!-- 切换语言 end -->
				</el-row>
			</el-col>
		</el-row>
		<!--  -->
		<NumberList v-show="showLayerNumberList" @hideNumberLayer="hideNumberLayer"></NumberList>
		<div class="full-layer" @click="toHideNumerLayer" v-show="showLayerNumberList"></div>
	</header>
</template>
<style>
</style>
<style scoped>
	.logo {display: inline-block;border: none;text-decoration: none;}
	.el-dropdown-link {color: #FFF;}
	.user-icon, .menu-icon,.setting-icon {font-size: 28px; color: #FFF;cursor: pointer;margin-right: 18px;}
	#mobile-control-more {color: #FFF;float: left;}
	.full-layer {position: fixed;left: 0;top: 0;right: 0;bottom: 0;background: rgba(0,0,0,.1);z-index: 9;}

	.logo {display: inline-block;border: none;text-decoration: none;}
	#mobile-control-more {color: #FFF;float: left;}
	.head-operateNo,.toggleRoom,.toggle-lan {margin-right: 20px;color: #FFF;}
</style>
<script>
	import Setting from "./head/Setting"
	import ToggleRoom from "./head/ToggleRoom"
	import ToggleLanguage from "./head/ToggleLanguage"
	import {getPowerText,globalUserEnter} from "../../assets/tools/tool.js"
	import NumberList from "./NumberList"
	import projectJson from "../../config"
	let {isWeb} = projectJson;
	import Nav from "./Nav"
    import md5 from "md5"
	export default {
		data() {
			return {
				logoTitle: "",
				roleTitle: "",  // 用户身份
				showLayerNumberList: false,
			}
		},
		computed: {
			// 是否为移动端
			isMobile() {return this.$store.state.isMobile},
			isPlant() {return this.$store.state.isPlant},
			// 移动端请求地址
			apiurl() {return this.$store.state.apiurl},
            // 用户信息
            userInfo() {return this.$store.state.userInfo.user},
            // 工厂信息
            factoryInfo() {return this.$store.state.userInfo.factory},
            isWeb() {return isWeb}
		},
		components: {
			Nav,
			NumberList,
			Setting,
			ToggleRoom,
			ToggleLanguage,
		},
		watch: {
			
		},
		methods: {
			tgMobileNav() {
				document.querySelector(".el-menu").classList.toggle("hide-mobile")
			},
			// 设置页面logo文本
            setLogoTitle() {
            	switch (Number(this.userInfo.role)) {
            		case 1:  // 系统管理员
            			this.logoTitle = this.isPlant ? this.$t("message.植物工厂智能种植系统") : this.$t("message.植物工厂智能育苗系统");
            		break;
            		default:
            		this.logoTitle = this.isPlant ? this.$t("message.植物工厂智能种植系统") : this.$t("message.植物工厂智能育苗系统");
            			// this.logoTitle = this.factoryInfo.factory_name;
            		break;
            	}
            },
            // 更新用户身份
			updateUserRole() {
				this.roleTitle = getPowerText(this.userInfo.role);
			},
			// 切换语言
			lan(data) {
				this.setLogoTitle();
				this.updateUserRole();
			},
		    mobileUrlToShowIp(url) {
		    	url = url.replace(/\/plant/,"");
		    	url = url.replace(/\/seedling/,"");
		    	let r = url.split(":");
		    	if(r.length > 1) {
		    		let r1 = url.split(":")[1];
		    		if(r1.length > 2) {
						let result = r1.substring(2);
				    	return result;
		    		} else {
		    			return this.$t('message.未知路径');
		    		}
		    	} else {
		    		return this.$t('message.未知路径');
		    	}
		    	let result = url.split(":")[1]
		    },
		    ipToUrl(ip) {
		    	return "http://" + ip + ":3601";
		    },
			// 点击齿轮按钮
			// handleCommand1(command) {
			// 	// 修改移动端ip
			// 	if(command == "setReqUrl") {
			// 		let res = this.mobileUrlToShowIp(this.apiurl);
			// 		this.$prompt('', this.$t('message.请求路径设置'), {
			//           confirmButtonText: this.$t('message.确定'),
			//           cancelButtonText: this.$t('message.取消'),
			//           inputPlaceholder: `${this.$t('message.请输入ip。如')}：192.168.1.103`,
			//           inputValue: res
			//         }).then(({ value }) => {
			//         	this.$store.commit("updateMobileBaseUrl",this.ipToUrl(value));
			//         	this.$message({
			// 	          message: this.$t("message.修改成功"),
			// 	          type: 'success'
			// 	        });
			// 	        setTimeout(()=> {
			// 	        	window.location.reload();
			// 	        },1000);
			//         })
			// 	}
			// },
			// 切换编号
			tgShowNumLayer() {
				this.showLayerNumberList = true;
			},
			hideNumberLayer() {
            	this.showLayerNumberList = false;
            },
            toHideNumerLayer() {
            	this.hideNumberLayer();
            },
            getDevParamList() {
            	if(localStorage.devGroup) {
		    		let json = JSON.parse(localStorage.devGroup);
                	this.$store.commit("updateMobileDevGroup",json);
            	}
            }
		},
		async mounted() {
			await globalUserEnter();
			this.setLogoTitle();
			this.updateUserRole();
			this.getDevParamList();
		}
	}
</script>