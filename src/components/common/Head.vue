<!-- 
	组件说明：本组件为页面头部信息组件，包含PC端及移动端。
	测试帐号：姓名：liujunhui 电话：12345678 密码：1234567
-->
<template>
	<header id="group-header">
		<el-row type="flex" justify="space-between" align="middle" class="head-box">
			<el-col>
				<!-- title start -->
				<router-link to="/" class="logo"><h1>{{$t(logoTitle)}}</h1></router-link>
				<!-- title end -->
			</el-col>
			<el-col>
				<el-row type="flex" justify="end" align="middle">
					<i class="el-icon-more" id="mobile-control-more" @click="tgMobileNav" v-if="isMobile"></i>
					<i class="el-icon-s-platform menu-icon" v-if="!isMobile" @click="tgShowNumLayer"></i>
					<!-- 全部培植方案按钮 start -->
					<i class="el-icon-menu menu-icon" @click="tgShowLayer" v-if="userPower == '1'"></i>
					<!-- 全部培植方案按钮 end -->
					<!-- 用户登录 start -->
					<i class="el-icon-user user-icon" @click="userLoginDialogVisible=true" v-if="!userInfo.token"></i>
					<!-- 用户登录 end -->
					<!-- 用户退出 start -->
					<el-dropdown @command="handleCommand1" trigger="click" v-if="isMobile || userInfo.token">
						<span class="el-dropdown-link"><i class="el-icon-setting user-icon"></i></span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="setReqUrl" v-if="isMobile">{{$t("message.请求路径设置")}}</el-dropdown-item>
						    <el-dropdown-item command="logout" v-if="userInfo.token">{{$t("message.退出")}}</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<!-- 用户退出 end -->
					<!-- 切换语言 start -->
					<el-dropdown @command="handleCommand" trigger="click">
						<span class="el-dropdown-link">{{$t("message.选择语言")}}<i class="el-icon-arrow-down el-icon--right"></i></span>
						<el-dropdown-menu slot="dropdown">
						    <el-dropdown-item command="zh">中文</el-dropdown-item>
						    <el-dropdown-item command="en">English</el-dropdown-item>
						    <el-dropdown-item command="fr">French</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<!-- 切换语言 end -->
				</el-row>
			</el-col>
		</el-row>
		<!-- 计划列表弹窗 start -->
		<PlanList v-show="showLayerPlanList" @changeState="changeState" :showLayer="showLayer"></PlanList>
		<!-- 计划列表弹窗 end -->
		<!-- 用户登录 start -->
		<el-dialog :visible.sync="userLoginDialogVisible" :title="$t('message.登录')" :width="loginDialogWidth" center id="smartgrow-loginbox">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<!-- 输入用户名/电话 start -->
				<el-form-item :label="$t('message.用户名/电话')" prop="account"><el-input v-model="ruleForm.account" size="small"></el-input></el-form-item>
				<!-- 输入用户名/电话 end -->
				<!-- 输入密码 start -->
				<el-form-item :label="$t('message.密码')" prop="password"><el-input v-model="ruleForm.password" size="small" show-password></el-input></el-form-item>
				<!-- 输入密码 end -->
			</el-form>
			<!-- 登录按钮 start -->
			<div slot="footer">
		    	<el-button type="primary" @click="handleSubmit('ruleForm')" size="small">{{$t("message.登录")}}</el-button>
			</div>
			<!-- 登录按钮 end -->
		</el-dialog>
		<!-- 用户登录 end -->
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
</style>
<script>
	import PlanList from "./PlanList"
	import NumberList from "./NumberList"
	import Nav from "./Nav"
    import md5 from "md5"
	import axios from "axios"
	export default {
		data() {
			return {
				showLayerNumberList: false,
				showLayer: false,  // 是否显示计划列表弹窗
				userLoginDialogVisible: false,  // 是否显示用户登录层
				ruleForm: {
					account: "",
					password: ""
				},  // 设置登录验证规则
				rules: {
					account: [{ required: true, message: '请输入用户名或电话!', trigger: 'blur' }, ],
					password: [{ required: true, message: '请输入密码!', trigger: 'blur' }, ],
				}   // 设置登录验证规则
			}
		},
		computed: {
			// 是否为移动端
			isMobile() {
				return this.$store.state.isMobile;
			},
			logoTitle() {
				return this.isPlant ? "message.植物工厂智能种植系统" : "message.植物工厂智能育苗系统";
			},
			isPlant() {
				return this.$store.state.isPlant;
			},
			// 移动端请求地址
			mobileBaseUrl() {
				return this.$store.state.mobileBaseUrl;
			},
			// PC端请求地址
			apiurl() {
                return this.$store.state.apiurl;
            },
			// 用户权限数字
			userPower() {
				return localStorage.userPower || "0";
		    },
            // 用户信息
            userInfo() {
            	return this.$store.state.user;
            },
            // 配置方案显示层
			showLayerPlanList() {
				return this.$store.state.PlanListLayerState;
			},
            // 层大小
            loginDialogWidth() {
            	return this.isMobile ? "403px" : "50%";
            }
		},
		components: {
			PlanList,
			Nav,
			NumberList
		},
		watch: {
			showLayerPlanList(s) {
				this.showLayer = s;
			}
		},
		methods: {
			tgMobileNav(ev) {
				ev.stopPropagation();
				document.querySelector(".el-menu").classList.toggle("hide-mobile")
			},
			// 登录
			handleSubmit(formName) {
		      	this.$refs[formName].validate(valid => {
			        if (valid) {
			        	// 得到用户名、手机号、密码
			        	let data = {
							account: this.ruleForm.account,
							phone: this.ruleForm.account,
							password: md5(this.ruleForm.password)
						};
						// 用户名为手机号时，将用户名设置为空，否则将手机号清空
						/^1\d{10}$/.test(this.account) ? delete data.account : delete data.phone;
						// 登录
						axios({
						    method: 'post',
						    url: `${this.apiurl}/lb/login`,
						    data:{
							  data
							}
						}).then(data => {
							if(data.data.code == 200) {
								let [token,userId,operateNo] = [data.data.token,data.data.id, this.ruleForm.account];
								this.cblogin({token,userId,operateNo});
							} else {
								this.$message({
					              type: 'error',
					              message: this.$t("message.登录失败")
					            });
							}
						});
			        }
		      	});
		    },
		    // 登录回调
		    cblogin({token,userId,operateNo}) {
		    	// 设置本地存储
	            localStorage.token = token;
	            localStorage.userId = userId;
	            localStorage.operateNo = operateNo;
	            // 重置用户信息
	            this.submitUserInfo();
	            // 页面提示
	            this.$message({
	              type: 'success',
	              message: this.$t("message.登录成功")
	            });
	            this.userLoginDialogVisible = false;
				window.location.reload();
		    },
		    // vuex中提交用户信息
		    submitUserInfo() {
		    	this.$store.commit("resetUser",{
	            	token: localStorage.token,
	            	userId: localStorage.userId,
	            	operateNo: localStorage.operateNo
	            });
		    },
		    mobileUrlToShowIp(url) {
		    	let r = url.split(":");
		    	if(r.length > 1) {
		    		let r1 = url.split(":")[1];
		    		if(r1.length > 2) {
						let result = r1.substring(2);
				    	return result;
		    		} else {
		    			return "未知路径！"
		    		}
		    	} else {
		    		return "未知路径！";
		    	}
		    	let result = url.split(":")[1]
		    },
		    ipToUrl(ip) {
		    	return "http://" + ip + ":3601";
		    },
			// 点击齿轮按钮
			handleCommand1(command) {
				// 点击退出登录按钮
				if(command == "logout") {
					this.logout();
				}
				// 修改移动端ip
				if(command == "setReqUrl") {
					let res = this.mobileUrlToShowIp(this.mobileBaseUrl);
					this.$prompt('', '请求路径设置', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          inputPlaceholder: "请输入ip。如：192.168.1.103",
			          inputValue: res
			        }).then(({ value }) => {
			        	this.$store.commit("updateMobileBaseUrl",this.ipToUrl(value));
			        	this.$message({
				          message: this.$t("message.修改成功"),
				          type: 'success'
				        });
				        setTimeout(()=> {
				        	window.location.reload();
				        },1000);
			        })
				}
			},
			// 退出登录
			logout() {
				// 清除本地存储
				delete localStorage.operateNo;
				delete localStorage.token;
				delete localStorage.userId;
				delete localStorage.userPower;
				// 退出提示
				this.$message({
	              type: 'success',
	              message: this.$t("message.退出成功")
	            });
	            // 跳转至首页
				if(this.$route.name !== "Home") {
					this.$router.replace({path: "/"});
				} 
				// 刷新页面
				window.location.reload();
			},
			// 点击切换语言按钮
			handleCommand(command) {
			 	this.$i18n.locale = command;
		    },
			// 切换培植方案层显示状态
			tgShowLayer(ev) {
				ev.stopPropagation();
				if(this.showLayer) {
					this.$store.commit("changePlanListLayerState",false);
					// this.showLayer = false;
				} else {
					this.$store.commit("changePlanListLayerState",true);
					// this.showLayer = true;
				}
				// this.showLayerPlanList && this.$store.commit("changePlanListLayerState",false);
				
				// this.showLayer = !this.showLayer;
			},
			// 改变方案
			changeState(data) {
				data && this.$store.commit("changePlanListLayerState",true);
			},
			// 切换编号
			tgShowNumLayer() {
				this.showLayerNumberList = true;
			},
			hideNumberLayer() {
            	this.showLayerNumberList = false;
            },
            toHideNumerLayer() {
            	this.hideNumberLayer();
            }
		},
		mounted() {
			this.submitUserInfo();
			
		}
	}
</script>