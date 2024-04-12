import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex);
import {opinion} from "../assets/tools/tool"
import {run_info,get_implement_plant,control,adjust} from "./ajax"
import projectJson from "../config"
let {isWeb} = projectJson;
let isMobile = opinion() == "mobile";
let i18n = localStorage.locale || "zh";
let store = new Vuex.Store({
	state: {
		runInfo: {
	        ana: {},
	        alarm: {},
	        comm: {},
	        dig: {},
	        param: {},
	        seedling_light_dig: {},
	        plant_light_ana:[],
	        version: {},
	        lightVersion: {},

	        /* 这些是之前本地版的，一会删除 */
	        light_dig: [],
	        light_ana:[],
	        light_param: []
	    },
	    userInfo: {
	    	user: {},
	    	factory: {}
	    },
	    currentInfo: {
	    	room: {},
	    	dev: {},
	    	plant: {},
	    	LocalDveNum: 0
	    },
	    isPlant: /plant/.test((new URL(location.href))["searchParams"].get("m")),
	    isMobile,
	    signNum: 0,
		signTip: "",
	    i18n,
	    plant_dig: [],
	    op_onOff: false,
	    isWeb,
	    mobileReqPort: Number(localStorage.mobileReqPort) || ''
	},
	mutations: {
		// updataMobileReqPort
		updateLocalDveNum(state,data) {
			localStorage.LocalDveNum = data;
			state.currentInfo.LocalDveNum = Number(data);
		},
		updateCurrentRoomInfo(state,data) {
			localStorage.currentRoom = JSON.stringify(data);
			state.currentInfo.room = data;
			if(data.devs && data.devs.length) {
				localStorage.currentDev = JSON.stringify(data.devs[0]);
				state.currentInfo.dev = data.devs[0];
			}
		},
		updateCurrentDevInfo(state,data) {
			localStorage.currentDev = JSON.stringify(data);
			state.currentInfo.dev = data;
		},
		updateCurrentPlanInfo(state,data) {
			localStorage.currentPlan = JSON.stringify(data);
			state.currentInfo.plant = data;
		},
		updateUserInfo(state,data) {
			localStorage.userInfo = JSON.stringify(data);
			state.userInfo.user = data;
		},
		updateUFactoryInfo(state,data) {
			localStorage.factoryInfo = JSON.stringify(data);
			state.userInfo.factory = data;
		},
		updateI18n(state,str) {
			state.i18n = str;
		},
		changeOpOnoff(state,boolean = true) {
			state.op_onOff = boolean;
		},
		// 更新运行状态信息
		updateRunInfo(state,runInfo) {
			if(runInfo) {
				let {alarm,ana,comm,dig,param,version} = runInfo;
				let light_info = runInfo.light;
				let jsonAna = {};
				let jsonAlarm = {};
				let jsonComm = {};
				let jsonDig = {};
				let jsonParam = {};
				if(alarm) {
					alarm.item.map(item => {
						if(item) {
							jsonAlarm[item["param_code"]] = item.value;
						}
					});
				}
				if(ana) {
					ana.item.map(item => {
						if(item) {
							jsonAna[item["param_code"]] = item.value;
						}
					});
				}
				if(comm) {
					comm.item.map(item => {
						if(item) {
							jsonComm[item["param_code"]] = item.value;
						}
					});
				}
				if(dig) {
					dig.item.map(item => {
						if(item) {
							jsonDig[item["param_code"]] = item.value;
						}
					});
				}
				if(param) {
					param.item.map(item => {
						if(item) {
							jsonParam[item["param_code"]] = item.value;
						}
					});
				}

				/* 育苗灯控 */
				let lightVersion = {};
				if(runInfo.light && runInfo.light.ver) {
					lightVersion = runInfo.light.ver
				}
				state.runInfo.alarm = jsonAlarm;
				state.runInfo.ana = jsonAna;
				state.runInfo.comm = jsonComm;
				state.runInfo.dig = jsonDig;
				state.runInfo.param = jsonParam;
				state.runInfo.lightVersion = lightVersion;
				state.runInfo.version = version;

				state.runInfo.light_ana = (light_info && light_info.ana) ? light_info.ana : [];
				state.runInfo.light_dig = (light_info && light_info.dig) ? light_info.dig : [];
				let json_light_param = (light_info && light_info.param) ? light_info.param : [];
				state.runInfo.light_param = Object.values(json_light_param);
				state.plant_dig = [];
				let result = [];
				if(light_info && light_info.dig) {
					for(let i in light_info.dig) {
						result.push(light_info.dig[i].item);
					}
				}
				state.plant_dig = result;
			}
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
		// 更新当前状态
		async updateRunInfo({state,commit}) {
			setTimeout(async ()=> {
				if(isWeb) {
					if(!state.currentInfo.dev.instance_number) {console.log("unknow dev")}
					commit("updateRunInfo",await run_info({}));
				} else {
					commit("updateRunInfo",await run_info("1"));
				}
			},300);
		},
		// 修改喷灌泵，回水泵、水阀状态、蠕动泵
		async control(d,data1) {
			let {data,notTip = false} = data1;
			data.user_id = d.state.userInfo.user.id;
			if(!isWeb) {
				data.operateNo = d.state.userInfo.user.account;
				data.dev_id = 1;
				data.op_type = "OP_FARM_CTRL";
				data.op_id = String(d.state.userInfo.user.id);
			}
			let res = await control(data);
			if(res) {
				d.dispatch("updateRunInfo");
				!notTip && d.commit("changeOpOnoff");
			};
		},
		// 修改转速、标定
		async adjust(d,data1) {
			let {data} = data1;
			if(!isWeb) {
				data.operateNo = d.state.userInfo.user.account;
				data.op_id = String(d.state.userInfo.user.id);
				data.op_type = "OP_FARM_ADJUST";
				data.dev_id = 1;
			}
			let res = await adjust(data);
			if(res) {
				d.dispatch("updateRunInfo");
				d.commit("changeOpOnoff");
			}
		},
		async adjust1(d,data1) {
			let {data} = data1;
			if(!isWeb) {
				data.operateNo = d.state.userInfo.user.account;
				data.op_id = String(d.state.userInfo.user.id);
				data.op_type = "OP_FARM_ADJUST";
				data.dev_id = 1;
			}
			let res = await adjust(data);
			res && d.commit("signNum",{
				tip: res,
				reset: false
			});
		},
		// 获取当前种植方案
		async getCurrentPlan({commit}) {
			setTimeout(async ()=> {
				let res = await get_implement_plant();
				commit("updateCurrentPlanInfo",res || {});
			},300);
		}
	}
});

export default store;