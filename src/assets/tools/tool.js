import axios from 'axios'
import router from "../../router"
function formatTime(time) {
	if(time) {
		return time.substring(0, 19).replace('T', ' ');
	} else {
		return "";
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
    let [hour,min] = time.split(":");
    return hour * 60 + parseInt(min);
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
    if(!localStorage.userPower) {
        return 0;
    } else {
        return Number(localStorage.userPower) || 0;
    }
}

// ajax
function ajax(obj) {
	let {url,data,callback} = obj;
	axios({
		method: 'post',
        url,
        data: {
        	data
        }
	}).then(data => {
		if(data.data.code == 200) {
    		callback(data.data);
    	}
	})
}

// 自动跳转到指定页面
/* 输入权限号，跳转到指定页面，多个权限号之间用逗号分隔 */
function autoJump() {
    let data = [{
        number: 0,       // 未登录用户
        redirect: "/",   // 跳转至首页
    },{
        number: 1,       // 操作员
        redirect: "/",   // 跳转至首页
    },{
        number: 2,        // 管理员
        redirect: "/User",// 跳转至首页
    }];
    if(!([...arguments].includes(getUserPower()))) {
        let url = data.filter(item => item.number == getUserPower());
        url.length && router.replace(url[0].redirect);
    }
}

/* 手机端、PC端获取 */
function opinion() {
    if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        return "mobile"
    }else {
        return "pc"
    }
}


export {formatTime,ajax,minuteToTime,timeToMinute,switchTimeToShow,switchTimeToSubmit,getUserPower,autoJump,opinion};