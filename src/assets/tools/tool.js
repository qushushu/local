import config from "../../config/index"
import router from "../../router"
import store from "../../store"
import {getBigUserInfo} from "../../store/ajax"
const isWeb = store.state.isWeb;
/* 将带T的日期时间转换为标准时间 */
function formatTime(time) {
	if(time) {
		return time.substring(0, 19).replace('T', ' ');
	} else {
		return "";
	}
}

/* 处理历史记录的时间 */
function formatJtime(time) {
    if(time) {
        let arr = time.split(" ");
        if(arr.length > 2) {
            let hours = arr[1].split(":");
            return arr[0] + " " + hours[0] + ':00:00';
        } 
    } else {
        return time;
    }
}

/* 处理历史记录的时间 */
function formatTimeLocal(time) {
    let pos = new Date().getTimezoneOffset();
    let posHour = pos / 60;
    if(time) {
        let result = time.substring(0, 19).replace('T', ' ');
        if(result.split(" ").length > 1) {
            let tm = result.split(" ")[1];
            let hour = tm.split(":")[0];
            let localHour = 0 - posHour + parseInt(hour);
            let localTime = new Date(result);
            localTime.setHours(localTime.getHours() + localHour);
            return `UTC+${Math.abs(posHour)}  ${localTime.getFullYear()}-${localTime.getMonth() + 1}-${localTime.getDate()} ${localTime.getHours()}:${localTime.getMinutes()}:${localTime.getSeconds()}`
        } else {
            return time.substring(0, 19).replace('T', ' ');
        }
    } else {
        return "";
    }
}

/* 处理历史记录的时间 */
function formatTimeOnlyDate(time) {
    let res = formatTime(time)
    if(res) {
        return res.split(" ")[0];
    }
}

// 分钟 -> 小时:分
function minuteToTime(minute) {
    let hour = String(parseInt(minute / 60)).padStart(2,0);
    let minute1 = String(minute % 60).padStart(2,0);
    return `${hour}:${minute1}`;
}

// 小时:分 -> 分钟
function timeToMinute(time) {
    time = String(time)
    if(time && time.includes(":")) {
        let [hour,min] = time.split(":");
        return hour * 60 + parseInt(min);
    }
}

function switchTimeToShow(obj,params="param_code",valueType="ref_value") {
    let arrTime = ["SUNRIZE","SUNSET"];
    if(arrTime.includes(obj[params])) {
        obj[valueType] = minuteToTime(obj[valueType]);
    }
    return obj;
}

function switchTimeToSubmit(obj,params="param_code",valueType="ref_value") {
    let arrTime = ["SUNRIZE","SUNSET"];
    if(arrTime.includes(obj[params])) {
        obj[valueType] = timeToMinute(obj[valueType]);
    }
    return obj;
}

// 用户权限号
/* 获取权限号（通过localStorage） */
function getUserPower() {
    if(!localStorage.userInfo || localStorage.userInfo == "{}") {
        return 0;
    } else {
        if(localStorage.userInfo && String(localStorage.userInfo) !== 'undefined') {
            return Number(JSON.parse(localStorage.userInfo).role) || 0;
        } else {
            logout();
            return;
        }
    }
}
// 权限编号获取身份名称
function getPowerText(powerId) {
    let result = config.power.filter(item => item.role == powerId);
    if(store.state.i18n == "zh") {
        return result.length == 1 ? result[0].identity : "未登录用户";
    } else {
        return result.length == 1 ? result[0].identityEn : "Not Login";
    }
}

/* 手机端、PC端获取 */
function opinion() {
    if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        return "mobile";
    } else {
        return "pc";
    }
}

function logout(callback) {
    store.commit("updateUserInfo",{});
    store.commit("updateUFactoryInfo",{});
    store.commit("updateCurrentRoomInfo",{});
    store.commit("updateCurrentDevInfo",{});
    store.commit("updateCurrentPlanInfo",{});
    if(callback) {
        callback();
        setTimeout(()=> {
            if(!/Login/.test(location.href)) {
                router.replace({path: '/Login'});
            }
        },2000);
    } else {
        if(!/Login/.test(location.href)) {
            router.replace({path: '/Login'});
        }
    }
}

function setRunInfoOne(str,runInfo) {
    let result = {};
    runInfo && runInfo[str].item.map(item => {
        item && (result[item["param_code"]] = item.value);
    });
    return result;
}

/* 用户进入每个页面之前都要执行的函数 */
async function globalUserEnter() {
    /* 从localStorage中获取用户信息 */
    let {userInfo,factoryInfo,currentRoom="{}",currentDev="{}",currentPlan="{}"} = localStorage;
    currentRoom = JSON.parse(currentRoom);
    currentDev = JSON.parse(currentDev);
    currentPlan = JSON.parse(currentPlan);
    // 用户信息不存在直接退出系统
    if(!userInfo || userInfo == '{}') {
        logout();
        return;
    }
    let uInfo = JSON.parse(userInfo);

    // 用户id不存在退出程序
    if(!uInfo.id) {
        logout();
        return;
    }

    if(!isWeb) {
        store.commit("updateUserInfo",uInfo);
    }
    
    if(isWeb) {
        // 获取线上user和factory信息
        let res = await getBigUserInfo(uInfo.id);
        if(res.code == 200) {
            store.commit("updateUserInfo",res.data.userInfo);
        } else {
            logout();
            return;
        }

        /* 系统管理员不执行 */
        if(res.data.userInfo.role === 1) {
            return;
        }

        // 将信息提交到store上
        store.commit("updateUFactoryInfo",res.data.factoryInfo);
        if(res.data.userInfo.role > 2) {
            /* 系统管理员不设置工厂信息 */
            if (!currentRoom.room_id && res.data.factoryInfo && res.data.factoryInfo.rooms.length) {
                currentRoom = res.data.factoryInfo.rooms[0];
            }
            
            if(!currentDev.instance_number && currentRoom.devs && currentRoom.devs.length) {
                currentDev = currentRoom.devs[0];
            }

            let rId = Number(currentRoom.room_id);
            let updateCr = res.data.factoryInfo.rooms.filter(item => {
                return item.room_id == rId
            })
            currentRoom = updateCr.length > 0 ? updateCr[0]:res.data.factoryInfo.rooms[0];
            store.commit("updateCurrentRoomInfo",currentRoom);
            store.commit("updateCurrentDevInfo",currentDev);
            store.commit("updateCurrentPlanInfo",currentPlan);
        }
    }
}

export {formatTime,ajax,minuteToTime,timeToMinute,switchTimeToShow,switchTimeToSubmit,getUserPower,opinion,formatTimeOnlyDate,formatTimeLocal,formatJtime,getPowerText,globalUserEnter,logout,setRunInfoOne};