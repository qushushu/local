import Vue from "vue"
import Vuex from "vuex"
import {ajax,formatTime,opinion} from "../assets/tools/tool"
Vue.use(Vuex);
let localBaseUrl = "/apis";
let localBaseUrl1 = "/ttt";
let realBaseUrl = window.ip.apiURL;
let isMobile = opinion() == "mobile";
if(isMobile) {
	realBaseUrl = window.localStorage.mobileBaseUrl ? window.localStorage.mobileBaseUrl : window.ip.apiURL;
}
let baseUrlNoSign = realBaseUrl;
if(/plant/.test((new URL(location.href))["searchParams"].get("m"))) {
	realBaseUrl += "/plant";
	document.title = "植物工厂智能种植系统";
} else {
	realBaseUrl += "/seedling";
	document.title = "植物工厂智能育苗系统";
}
import axios from 'axios'
let store = new Vuex.Store({
	state: {
		isPlant: /plant/.test((new URL(location.href))["searchParams"].get("m")),
		currentUrl: location.href,
		signNum: 0,
		signTip: "",
		localMode,
		runInfo: {
	        ana: {},
	        alarm: {},
	        comm: {},
	        dig: {},
	        param: {},
	        seedling_light_dig: {},
	        plant_light_ana:[]
	    },
	    arrNumberList,
	    plant_dig: [],
	    curDevInfo: {},
	    currentPlanInfo: {},   // 当前种植方案信息 
	    PlanListLayerState: false,
	    recordList: [],  // 培植记录
	    op_onOff: false,
	    mobileBaseUrl : opinion() == "mobile" ? (window.localStorage.mobileBaseUrl ||  window.ip.apiURL)  : window.ip.apiURL,
	    apiurl: localMode ? localBaseUrl : realBaseUrl,
	    apiurlPlant: localMode ? localBaseUrl1 : baseUrlNoSign + "/plant",
	    isMobile,
	    baseUrlNoSign,
	    user: {
	    	token: "",
	    	operateNo: "",
	    	userId: "",
	    },
	    userPower: 0
	},
	mutations: {
		// 更新用户权限
		updateUserPower(state,number) {
			state.userPower = parseInt(number);
		},
		// 更新用户信息
		resetUser(state,{token,operateNo,userId}) {
			state.user = {
				token,
				operateNo,
				userId
			}
		},
		changeOpOnoff(state,boolean = true) {
			state.op_onOff = boolean;
		},
		// 更新运行状态信息
		updateRunInfo(state,runInfo) {
			let {alarm,ana,comm,dig,param,version} = runInfo;
			// let seedling_light = state.isPlant ? runInfo.plant_light : runInfo.seedling_light;
			let jsonAna = {};
			let jsonAlarm = {};
			let jsonComm = {};
			let jsonDig = {};
			let jsonParam = {};
			if(alarm) {
				alarm.item.map(item => {
					jsonAlarm[item["param_code"]] = item.value;
				});
			}
			if(ana) {
				ana.item.map(item => {
					jsonAna[item["param_code"]] = item.value;
				});
			}
			if(comm) {
				comm.item.map(item => {
					jsonComm[item["param_code"]] = item.value;
				});
			}
			if(dig) {
				dig.item.map(item => {
					jsonDig[item["param_code"]] = item.value;
				});
			}
			if(param) {
				param.item.map(item => {
					jsonParam[item["param_code"]] = item.value;
				});
			}
			state.runInfo.alarm = jsonAlarm;
			state.runInfo.ana = jsonAna;
			state.runInfo.comm = jsonComm;
			state.runInfo.dig = jsonDig;
			state.runInfo.param = jsonParam;
			// if(seedling_light) {
			// 	state.runInfo.seedling_light_dig = state.isPlant ? seedling_light.param : seedling_light.dig;
			// } else {
			// 	state.runInfo.seedling_light_dig = [];
			// }
			// state.runInfo.plant_light_ana = state.isPlant ? seedling_light.ana : [];
			// state.runInfo.plant_light_param = state.isPlant ? seedling_light.param : seedling_light.dig;
			// state.plant_dig = [];
			// if(state.isPlant) {
				// let result = [];
				// for(let i in seedling_light.dig) {
				// 	result.push(seedling_light.dig[i].item);
				// }
				// state.plant_dig = result;
			// }
		},
		// 育苗调用种植灯时触发
		updateRunInfo1(state,runInfo) {
			let plant_light = runInfo.plant_light;
			state.runInfo.seedling_light_dig = plant_light ? plant_light.param : [];
			state.runInfo.plant_light_ana = plant_light.ana;
			state.plant_dig = [];
			let result = [];
			for(let i in plant_light.dig) {
				result.push(plant_light.dig[i].item);
			}
			state.plant_dig = result;
			
		},
		// updateCurDevInfo(state,curDevInfo) {
		// 	state.curDevInfo = curDevInfo;
		// },
		changePlanListLayerState(state,s) {
			state.PlanListLayerState = s;
		},
		// 更新培植记录
		updateRecordList(state,s) {
			state.recordList = s;
		},
		updateMobileBaseUrl(state,s) {
			state.mobileBaseUrl = s;
			window.localStorage.mobileBaseUrl = s;
		},
		// 更新当前种植方案信息
		updateCurrentPlanInfo(state,s) {
			state.currentPlanInfo = s;
		},
		// 更新当前url
		updatecurrentUrl(state,s) {
			state.currentUrl = s;
		},
		signNum(state,obj) {
			if(obj.reset) {
				state.signNum = 0;
			} else {
				state.signNum++;
			}
			state.signTip = obj.tip;
		}
	},
	actions: {
		// 获得当前用户级别
		updateUserPower({commit}) {
			let {token,userId} = this.state.user;
			if(!token || !userId) {
				delete localStorage.operateNo;
				delete localStorage.token;
				delete localStorage.userId;
				delete localStorage.userPower;
			} else {
				axios({
	                url: `${localMode ? localBaseUrl: realBaseUrl}/la/user/get`,
	                method: "post",
	                data: {
	                    data: {
	                        id: userId
	                    }
	                }
	            }).then(data=> {
	               localStorage.userPower = data.data.data.role;
	               commit("updateUserPower",data.data.data.role);
	            });
			}
		},
		// 更新当前状态
		/*
			包含ana,dig等
		*/
		updateRunInfo({commit}) {
			axios({
	            method: 'post',
	            url: `${localMode ? localBaseUrl : realBaseUrl}/la/run/info`,
	            data: {
	    			data: {
					    dev_id: "1"
					}
	    		}
	        }).then(data=> {
	          if(data.data.code == 200) {
	            commit("updateRunInfo",data.data.data);
	          }
	        })
		},
		updateRunInfo1({commit}) {
			axios({
	            method: 'post',
	            url: `${localMode ? localBaseUrl1 : (baseUrlNoSign + '/plant')}/la/run/info`,
	            data: {
	    			data: {
					    dev_id: "1"
					}
	    		}
	        }).then(data=> {
	          if(data.data.code == 200) {
	            commit("updateRunInfo1",data.data.data);
	          }
	        })
		},
		// 获取当前设备信息
		// updateCurDevInfo({commit}) {
		// 	axios({
	 //    		method: "post",
	 //    		url: `${localMode ? localBaseUrl : realBaseUrl}/la/device/param/get_dev`,
	 //    		data: {
	 //    			data: {
		// 			    id: "1"
		// 			}
	 //    		}
	 //    	}).then(data => {
	 //    		if(data.data.code == 200) {
	 //    			commit("updateCurDevInfo",data.data.data);
	 //    		}
	 //    	})
		// },
		// 修改喷灌泵，回水泵、水阀状态、蠕动泵
		control(d,data1) {
			let {url,data} = data1;
			data.operateNo = d.state.user.operateNo;
			data.op_id = d.state.user.userId;
			data.op_type = "OP_SEEDLING_CTRL";
			(d.state.isPlant) && (data.op_type = "OP_PLANT_CTRL");
			data.dev_id = 1;
			ajax({
				url: `${localMode ? localBaseUrl: realBaseUrl}/la/control`,
				data,
				callback(data) {
					if(data.code === 200) {
						d.dispatch("updateRunInfo");
						d.commit("changeOpOnoff");
					}
				}
			});
		},
		// 修改转速、标定
		adjust(d,data1) {
			let {url,data} = data1;
			data.operateNo = d.state.user.operateNo;
			data.op_id = d.state.user.userId;
			data.op_type = "OP_SEEDLING_ADJUST";
			(d.state.isPlant) && (data.op_type = "OP_PLANT_ADJUST");
			data.dev_id = 1;
			ajax({
				url: `${localMode ? localBaseUrl : realBaseUrl}/la/adjust`,
				data,
				callback(data) {
					if(data.code === 200) {
						d.dispatch("updateRunInfo");
						d.commit("changeOpOnoff");
					}
				}
			})
		},
		adjust1(d,data1) {
			let {url,data} = data1;
			data.operateNo = d.state.user.operateNo;
			data.op_id = d.state.user.userId;
			data.op_type = "OP_SEEDLING_ADJUST";
			(d.state.isPlant) && (data.op_type = "OP_PLANT_ADJUST");
			data.dev_id = 1;
			ajax({
				url: `${localMode ? localBaseUrl : realBaseUrl}/la/adjust`,
				data,
				callback(data) {
					if(data.code === 200) {
						d.commit("signNum",{
							tip: data,
							reset: false
						});
					}
				}
			})
		},
		// 获取培植记录
		getRecordList(d,data1) {
			let {plant,scheme_name,start_time,end_time} = data1;
			axios({
				method: "post",
				url: `${localMode ? localBaseUrl : realBaseUrl}/la/plant/record/get_list`,
				data: {
					data: {
						plant,
			            scheme_name,
			            start_time,
			            end_time
					}
				}
			}).then(data => {
				if(data.data.code == 200) {
					let arr = data.data.data.map(item => {
						item.status = item.status == "start" ? "开始" : item.status;
						item.start_time = formatTime(item.start_time);
						item.record_time = formatTime(item.record_time);
						item.finish_time = formatTime(item.finish_time);
						return item;
					});
					d.commit("updateRecordList",arr);
				}
			})
		},
		// 获取当前种植方案
		/*
			说明：系统两处用到，分别是首页的当前方案，和方案管理页当前方案不能被删除
		*/
		getCurrentPlan({commit}) {
			axios({
				method: "post",
				url: `${localMode ? localBaseUrl : realBaseUrl}/la/plant/implement/get`,
			}).then(data => {
				if(data.data.code == 200) {
					commit("updateCurrentPlanInfo",data.data.data);
				}
			})
		}
	}
});

export default store;