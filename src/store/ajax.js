
// 所有像后端发送请求的方法均谢在这里
import axios from 'axios'
import {formatTime,minuteToTime,opinion} from "../assets/tools/tool"
import store from "../store"
import {localBaseUrl} from "../config"
import projectJson from "../config"
let {isWeb} = projectJson;
// 设置axios请求的token
axios.defaults.headers.common['token'] = '8eea162a4fbe0d4b4a92485d80a47bc4'
axios.defaults.headers.common['encrypt'] = 'false'
// 请求路径设置

function getFactory_num() {
	let factory_num = ""
	if(store.state.userInfo.factory.factory_num) {
		factory_num = store.state.userInfo.factory.factory_num
	}
	return factory_num;
}

function getDevice_num() {
	let device_num = ""
	if(store.state.currentInfo.dev.instance_number) {
		device_num = store.state.currentInfo.dev.instance_number
	}
	return device_num;
}


// 获取设备信息
export async function run_info({factory = getFactory_num(),device = getDevice_num()}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/run/info`,
		data:{
			data: {
				factory,
				device,
			}}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
	 		return data.data.data;
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

export async function get_time() {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/get_time`,
		data:{
			data: {}
		}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
		 return data.data.data;
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// control
export async function control(data) {
	let baseInfo = {}
	if(isWeb) {
		baseInfo = {
			factory: getFactory_num(),
			device: getDevice_num(),
			op_type: "OP_FARM_CTRL",
			operateNo: `${Math.random()}`,
			op_id: "1",
			dev_id: 1
		};
	}
	data = {
		...baseInfo,
		...data
	}
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/control`,
		data: {
			data
		}
	}).then(data => {
		if(data.data.code == 200) {
		 return "success";
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 获取设备模板列表
export async function get_dev_model_list(model="") {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/dev_model/get_list`,
		data:{
			data: {
				model
			}}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
		 return data.data.data;
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 删除设备模板
export async function delete_dev_model(id) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/dev_model/delete`,
		data:{
			data: {
				id
			}}
	}).then(data => {
		if(data.data.code == 200) {
		 return "success";
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 创建设备模板
export async function add_dev_model(json) {
	let {model_code,model,version,description} = json;
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/dev_model/add`,
		data:{
			data: {
				id: "",
		        model_code,
		        model,
		        version,
		        description
			}}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
		 return data.data.data;
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 编辑设备模板
export async function modify_dev_model(json) {
	let {id,model_code,model,version,description} = json;
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/dev_model/modify`,
		data:{
			data: {
				id,
		        model_code,
		        model,
		        version,
		        description
			}}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
		 return data.data.data;
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 获取设备参数列表
export async function get_device_param_list({model_code= "",factory_id= 0,room_id= 0,instance_number=""}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/device/param/get_list`,
		data:{
			data: {
				instance_number,
				factory_id,
				room_id,
				model: "",
	            model_code,
	            start_time: "",
	            end_time: ""
			}
		}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
			let res = data.data.data;
			res.forEach(item => {
				item.create_time = formatTime(item.create_time);
			})
		 	return res;
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 获取设备参数列表
export async function get_device_param_list_local(model_code= "") {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/device/param/get_list`,
		data:{
			data: {
				model: "",
	            model_code,
	            start_time: "",
	            end_time: ""
			}
		}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
			let res = data.data.data;
			res.forEach(item => {
				item.create_time = formatTime(item.create_time);
			})
		 	return res;
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 添加设备参数
export async function add_dev(json) {
	let {instance_number,description,dev_model_id,model,model_code,dev_inst_id,factory_id,room_id} = json;
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/device/param/add_dev`,
		data:{
			data: {
      			instance_number,
      			description,
	            dev_model_id,
	            model,
	            model_code,
	            factory_id,
	            room_id,
	            dev_inst_id
			}}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
		 return data.data.data;
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 编辑设备参数
export async function modify_dev(json) {
	let {id,instance_number,description,dev_model_id,model,model_code,dev_inst_id} = json;
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/device/param/modify_dev`,
		data:{
			data: {
				id,
      			instance_number,
      			description,
	            dev_model_id,
	            model,
	            model_code,
	            dev_inst_id
			}}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
		 return data.data.data;
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}


// 删除参数字典
export async function delete_dev_param(json) {
	let {model_code,param_item} = json;
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/dev_model/param/delete`,
		data:{
			data: {
				model_code,
				param_item
			}}
	}).then(data => {
		if(data.data.code == 200) {
		 return "success";
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 添加参数字典
export async function add_dev_param(json) {
	let {dev_model_id,param_item} = json;
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/dev_model/param/add`,
		data:{
			data: {
				dev_model_id,
				param_item
			}}
	}).then(data => {
		if(data.data.code == 200) {
		 return "success";
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 修改参数字典
export async function modify_dev_param(json) {
	let {dev_model_id,param_item} = json;
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/dev_model/param/modify`,
		data:{
			data: {
				dev_model_id,
				param_item
			}}
	}).then(data => {
		if(data.data.code == 200) {
		 return "success";
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 删除设备
export async function delete_dev(id) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/device/param/del_dev`,
		data:{
			data: {
				id
			}}
	}).then(data => {
		if(data.data.code == 200) {
		 return "success";
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 获取模板参数字典
export async function get_dev_model(model_code="") {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/dev_model/get`,
		data:{
			data: {
	            model_code
			}
		}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
			let res = data.data.data;
			// 处理日出时间和日落时间
			let arrTemp = ["SUNRIZE","SUNSET"];
			res.param_item.map(item => {
				if(arrTemp.includes(item.param_code)) {
					item.show_ref_value = isNaN(item.ref_value) ? item.ref_value:minuteToTime(item.ref_value)
				} else {
					item.show_ref_value = item.ref_value;
				}
				item.ref_value = item.show_ref_value;
				return item;
			})
		 	return res;
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 获取实例参数字典
export async function get_dev(id="") {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/device/param/get_dev`,
		data:{
			data: {
	            id
			}
		}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
			let res = data.data.data;
			// 处理日出时间和日落时间
			let arrTemp = ["SUNRIZE","SUNSET"];
			res.param_item.map(item => {
				if(arrTemp.includes(item.param_code)) {
					item.value = isNaN(item.value) ? item.value:minuteToTime(item.value)
				}
				return item;
			})
		 	return res;
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 保存设备参数参数字典
export async function save_device_param_item(json) {
	let {dev_inst_id,dev_model_id,param_item} = json;
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/device/param_item/save`,
		data:{
			data: {
	            dev_inst_id,
	            dev_model_id,
	            param_item
			}
		}
	}).then(data => {
		if(data.data.code == 200) {
		 return "success";
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 读设备参数
export async function read_device_param(json) {
	let {operateNo,op_id,op_type,dev_id,is_light=false} = json;
	let data = {};
	if(isWeb) {
		data = {
			op_id: "1",
            factory: getFactory_num(),
			device: getDevice_num(),
            operateNo: `${Math.random()}`,
            op_type,
            dev_id
		}
	} else {
		data = {
			operateNo,
            op_id,
            op_type,
            dev_id
		}
	}
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/device/param/read`,
		data:{
			data
		}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
		 return data.data.data;
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 写设备参数
export async function write_device_param(json) {
	let {operateNo,op_id,op_type,dev_id,instance_number,item_num,dev_inst_id,dev_model_id,item} = json;
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/device/param/write`,
		data:{
			data: {
	            operateNo: isWeb ? `${Math.random()}` : operateNo,
	            op_id: isWeb ? "1" :  op_id,
	            op_type,
	            dev_id,
	            instance_number,
	            item_num,
	            dev_inst_id,
	            dev_model_id,
	            item
			}
		}
	}).then(data => {
		if(data.data.code == 200) {
		 return "success";
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 获取所有方案列表
export async function get_plant_list(json) {
	let {plant,factory_num,dev_num} = json;
	let dd = {
		plant
	}
	if(isWeb) {
		dd.factory_num = factory_num
		dd.dev_num = dev_num
	}
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/plant/head/get_list`,
		data:{
			data: dd
		}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
			let res = data.data.data;
		 	return res;
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 获取当前方案
export async function get_implement_plant() {
	let da = {};
	if(isWeb) {
		da = {
            factory_num: getFactory_num(),
            dev_num: getDevice_num(),
		}
	}
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/plant/implement/get`,
        data:{
			data: da
		}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
			let res = data.data.data;
		 	return res;
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 删除方案
export async function del_plant(id) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/plant/head/del`,
		data:{
			data: {
				id
			}}
	}).then(data => {
		if(data.data.code == 200) {
		 return "success";
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 拷贝方案
export async function copy_plant({old_id,scheme_name,plant,plant_image,grow_cycle,create_time,remark,factory_num,dev_num}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/plant/head/copy`,
		data:{
			data: {
				old_id,
				scheme_name,
				plant,
				plant_image,
				grow_cycle,
				create_time,
				remark,
				factory_num,
				dev_num
			}}
	}).then(data => {
		if(data.data.code == 200) {
		 return "success";
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 新增方案
export async function add_plant({scheme_name,plant,grow_cycle,remark,plant_image,create_time,factory_num,dev_num}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/plant/head/add`,
		data:{
			data: {
				scheme_name,
				plant,
				grow_cycle,
				remark,
				plant_image,
				create_time,
				factory_num,
				dev_num
			}}
	}).then(data => {
		if(data.data.code == 200) {
		 return "success";
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 修改方案
export async function modify_plant({id,scheme_name,plant,grow_cycle,remark,plant_image,factory_num,dev_num}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/plant/head/modify`,
		data:{
			data: {
				id,
				scheme_name,
				plant,
				grow_cycle,
				remark,
				plant_image,
				factory_num,
				dev_num
			}}
	}).then(data => {
		if(data.data.code == 200) {
		 return "success";
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 切换当前方案
export async function plant_start({plant_id,remark}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/plant/implement/start`,
		data:{
			data: {
				plant_id,
				remark,
				factory_num: isWeb ?  getFactory_num() : undefined,
				dev_num: isWeb ? getDevice_num() : undefined
			}}
	}).then(data => {
		if(data.data.code == 200) {
		 return "success";
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 结束种植方案
export async function plant_finish(record_id) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/plant/implement/finish`,
		data:{
			data: {
				record_id,
				factory_num: isWeb ?  getFactory_num() : undefined,
				dev_num: isWeb ? getDevice_num() : undefined
			}}
	}).then(data => {
		if(data.data.code == 200) {
		 return "success";
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 获取方案所有阶段
export async function get_plant(id) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/plant/get`,
		data:{
			data: {
	            id
			}
		}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
			let res = data.data.data;
		 	return res;
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 保存阶段
export async function save_stage({plant_id,stage_item}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/plant/stage/save`,
		data:{
			data: {
				plant_id,
				stage_item
			}}
	}).then(data => {
		if(data.data.code == 200) {
		 return "success";
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 获取培植记录
export async function get_record_list({plant,scheme_name,start_time,end_time}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/plant/record/get_list`,
		data:{
			data: {
	            plant,
	            scheme_name,
	            start_time,
	            end_time
			}
		}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
			let res = data.data.data;
		 	return res;
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}


// 模拟量历史
export async function history_ana({start_time,end_time,page_index,page_size}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/history/ana/get`,
		data:{
			data: {
	            start_time,
	            end_time,
	            page_index,
	            page_size
			}
		}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
			return {
				data_total: data.data.data_total,
				data: data.data.data
			}
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 开关量历史
export async function history_dig({start_time,end_time,page_index,page_size}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/history/dig/get`,
		data:{
			data: {
	            start_time,
	            end_time,
	            page_index,
	            page_size
			}
		}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
			return {
				data_total: data.data.data_total,
				data: data.data.data
			}
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 告警历史
export async function history_alarm({start_time,end_time,page_index,page_size}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/history/alarm/get`,
		data:{
			data: {
	            start_time,
	            end_time,
	            page_index,
	            page_size
			}
		}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
			return {
				data_total: data.data.data_total,
				data: data.data.data
			}
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 通信历史
export async function history_comm({start_time,end_time,page_index,page_size}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/history/comm/get`,
		data:{
			data: {
	            start_time,
	            end_time,
	            page_index,
	            page_size
			}
		}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
			return {
				data_total: data.data.data_total,
				data: data.data.data
			}
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 植物灯历史
export async function history_light({start_time,end_time,page_index,page_size}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/history/light/get`,
		data:{
			data: {
	            start_time,
	            end_time,
	            page_index,
	            page_size
			}
		}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
			return {
				data_total: data.data.data_total,
				data: data.data.data
			}
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 参数历史
export async function history_param({start_time,end_time,page_index,page_size}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/history/param/get`,
		data:{
			data: {
	            start_time,
	            end_time,
	            page_index,
	            page_size
			}
		}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
			return {
				data_total: data.data.data_total,
				data: data.data.data
			}
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 用户列表
export async function get_user_list() {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/user/get_list`,
		data:{
			data: {}
		}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
			let res = data.data.data;
		 	return res;
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 获取单个用户信息
export async function get_user(id) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/user/get`,
		data:{
			data: {
				id
			}
		}
	}).then(data => {
		if(data && data.data && data.data.code == 200) {
			let res = data.data.data;
		 	return res;
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 添加用户
export async function add_user({account,password,role,phone,email}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/user/add`,
		data:{
			data: {
				account,
				password,
				role,
				phone,
				email
			}}
	}).then(data => {
		if(data.data.code == 200) {
		 return "success";
		} else {
			return "创建失败，已有同名用户";
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 编辑用户
export async function modify_user({id,account,password,role,phone,email,first_name,last_name,international_code,country_code}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/user/modify`,
		data:{
			data: {
				id,
				account,
				password,
				role,
				phone,
				email,
				first_name,
				last_name,
				international_code,
				country_code
			}}
	}).then(data => {
		if(data.data.code == 200) {
		 return "success";
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 删除用户
export async function delete_user(id) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/user/delete`,
		data:{
			data: {
				id
			}}
	}).then(data => {
		if(data.data.code == 200) {
		 return "success";
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 手动调节
export async function adjust(json) {
	let webData = {}
	if(isWeb) {
		webData = {
			factory: getFactory_num(),
			device: getDevice_num(),
			op_type: "OP_FARM_ADJUST",
			op_id: "1",
			dev_id: 1,
			operateNo: `${Math.random()}`,
		}
	}
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/adjust`,
		data:{
			data: {
				...json,
				...webData
			}}
	}).then(data => {
		if(data.data.code == 200) {
		 return "success";
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 登录
export async function login({account,phone,password}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/lb/login`,
		data:{
			data: {
				account,
				phone,
				password
			}}
	}).then(data => {
		if(data.data.code == 200) {
		 return data.data;
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}



//////////////////////////////
/* web 网络版新增接口 */
// 查看企业列表
export async function getDataEnterList(searchText,mode=0,fid) {
	let res = axios(`${localBaseUrl}/manager/query/enterpriseList?searchText=${searchText}&mode=${mode}&fid=${fid}`).then(data => {
		if(data.data.code == 200) {
			return data.data.data
		}
	});
	return res;
}

// 查看单一企业信息
export async function getOneEnterInfo(id) {
	let res = axios(`${localBaseUrl}/manager/query/enterpriseList?id=${id}`).then(data => {
		if(data.data.code == 200) {
			return data.data.data
		}
	});
	return res;
}

// 新增企业
export async function createEnterprise({enterprise_name,enterprise_desc,account,email,phone}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/create/enterprise`,
		data:{
			enterprise_name,
			enterprise_desc,
			account,
			email,
			phone
		}
	}).then(data => data.data).catch(err => {console.log(err)});
	return res;
}

// 编辑企业
export async function updateEnterprise({id,enterprise_name,enterprise_desc,account,email,phone}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/update/enterprise`,
		data:{
			id,
			enterprise_name,
			enterprise_desc,
			account,
			email,
			phone
		}
	}).then(data => data.data).catch(err => {console.log(err)});
	return res;
}

// 删除企业
export async function deleteEnterprise(id) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/del/enterpriseList`,
		data:{
			id
		}
	}).then(data => {
		if(data.data.code == 200) {
		 return data.data;
		}
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 查看工厂列表
export async function getDataFactoryList(searchText) {
	let res = axios(`${localBaseUrl}/manager/query/factoryList?searchText=${searchText}`).then(data => {
		if(data.data.code == 200) {
			return data.data.data
		}
	});
	return res;
}

// 查看单一工厂信息
export async function getOneFactoryInfo(id) {
	let res = axios(`${localBaseUrl}/manager/query/factoryList?id=${id}`).then(data => {
		if(data.data.code == 200) {
			return data.data.data
		}
	});
	return res;
}

// 获取某一用户身份信息
export async function getUserRoleList(data) {
	let res = axios({
		method: 'post',
        url: `${localBaseUrl}/manager/query/getUserRoleList`,
		data
	}).then(data => {
		if(data.data.code == 200) {
			return data.data.data
		}
	});
	return res;
}

// 获取某一工厂可用设备列表
export async function getRoomDevs(data) {
	let res = axios({
		method: 'post',
        url: `${localBaseUrl}/manager/query/getRoomDevs`,
		data
	}).then(data => {
		if(data.data.code == 200) {
			return data.data.data
		}
	});
	return res;
}

// 创建工厂
export async function createFactory({factory_name,enterprise_id,factory_desc,admin_id,factory_num}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/create/factory`,
		data:{
			factory_name,
			enterprise_id,
			factory_desc,
			admin_id,
			factory_num
		}
	}).then(data =>  data.data).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

// 编辑工厂
export async function updateFactory({factory_id,factory_name,enterprise_id,factory_desc,admin_id,factory_num}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/update/factory`,
		data:{
			factory_id,
			factory_name,
			enterprise_id,
			factory_desc,
			admin_id,
			factory_num
		}
	}).then(data => data.data).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

// 删除工厂
export async function deleteFactory(id) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/del/factoryList`,
		data:{
			id
		}
	}).then(data => {
		return data.data;
	}).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

// 获取种植间列表
export async function getRoomList({id,factory_id,searchText=""}) {
	let res
	if(id) {
		res = axios(`${localBaseUrl}/manager/query/roomList?id=${id}`).then(data => {
			if(data.data.code == 200) {
				return data.data.data
			}
		});
	} else {
		res = axios(`${localBaseUrl}/manager/query/roomList?searchText=${searchText}&factory_id=${factory_id}`).then(data => {
			if(data.data.code == 200) {
				return data.data.data
			}
		});
	}
	return res;
}

// 获取某个种植间信息
export async function getOneRommInfo(id) {
	let res = axios(`${localBaseUrl}/manager/query/getOneRommInfo?id=${id}`).then(data => {
			if(data.data.code == 200) {
				return data.data.data
			}
		});
	return res;
}

// 获取工厂的所有设备列表
export async function getDevList({id,factory_id,searchText="",empty=false}) {
	let res = axios(`${localBaseUrl}/manager/query/devList?searchText=${searchText}&factory_id=${factory_id}`).then(data => {
		if(data.data.code == 200) {
			return data.data.data
		}
	});
	return res;
}

// 编辑设备
export async function editDev({id,tag,no,room_id}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/update/dev`,
		data:{
			id,
			tag,
			no,
			room_id
		}
	}).then(data => data.data).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}


// 新增设备
export async function createDev({factory_id,no,tag,room_id}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/create/dev`,
		data:{
			factory_id,
			no,
			tag,
			room_id
		}
	}).then(data => {
		return data.data;
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 删除设备
export async function deleteDev(id) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/del/dev`,
		data:{id}
	}).then(data => {
		return data.data;
	}).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

// 新建种植间
export async function createRoom({room_name,manager_id,factory_id}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/create/room`,
		data:{
			room_name,
			manager_id,
			factory_id,
		}
	}).then(data => {
		return data.data;
	}).catch(err => {
		console.log(err);
	})
	return res;
}

// 编辑种植间
export async function updateRoom({room_name,manager_id,id}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/update/room`,
		data:{
			id,
			manager_id,
			room_name,
		}
	}).then(data => data.data).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

// 删除种植间
export async function deleteRoom(id) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/del/room`,
		data:{id}
	}).then(data => {
		return data.data;
	}).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

// 获取公司用户列表
export async function getFactoryUserList({factory_id}) {
	let res = axios({
		method: 'post',
		url: `${localBaseUrl}/manager/query/getUserRoleList`,
		data:{
			factory_id,
			details: true
		}
	}).then(data => {
		if(data.data.code == 200) {
			return data.data.data
		}
	}).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	});
	return res;
}

// 获取用户组列表
export async function getUserGroup({searchText,factory_id=0,id=0}) {
	let res = axios({
		method: 'post',
		url: `${localBaseUrl}/manager/query/groupList`,
		data:{
			searchText,
			factory_id,
			id
		}
	}).then(data => {
		if(data.data.code == 200) {
			return data.data.data;
		}
	}).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	});
	return res;
}


// 获取所有权限列表
export async function getPowerList() {
	let res = axios(`${localBaseUrl}/manager/query/getPowerList`).then(data => {
		if(data.data.code == 200) {
			return data.data.data;
		}
	});
	return res;
}

// 编辑组信息
export async function updateGroup({group_name,group_desc,id}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/update/group`,
		data:{
			id,
			group_name,
			group_desc,
		}
	}).then(data => data.data).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

// 创建组
export async function createGroup({group_name,group_desc,fid}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/create/group`,
		data:{
			group_name,
			group_desc,
			fid
		}
	}).then(data => data.data).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

// 修改组成员
export async function updateGroupUser({group_member_ids,id}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/update/groupList1`,
		data:{
			id,
			group_member_ids,
		}
	}).then(data => {
		if(data.data.code == 200) {
		 return data.data;
		}
	}).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

// 修改组权限
export async function updateGroupPower({group_power_ids,id}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/update/groupList2`,
		data:{
			group_power_ids,
			id,
		}
	}).then(data => {
		if(data.data.code == 200) {
		 return data.data;
		}
	}).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

// 删除组
export async function deleteGroup(id) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/del/group_list`,
		data:{
			id
		}
	}).then(data => {
		if(data.data.code == 200) {
		 return data.data;
		}
	}).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

// 获取种植单元列表
export async function getCellList({id,room_id,searchText}) {
	let query = id ? `id=${id}`: `room_id=${room_id}&searchText=${searchText}`;
	let res = axios(`${localBaseUrl}/manager/query/groupCellList?${query}`).then(data => {
		if(data.data.code == 200) {
			return data.data.data;
		}
	});
	return res;
}

// 新建种植单元
export async function createCell({room_id,group_cell_name,group_cell_desc}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/create/growcell`,
		data:{
			room_id,
			group_cell_name,
			group_cell_desc
		}
	}).then(data => data.data).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

// 编辑种植单元
export async function updateCell({id,group_cell_name,group_cell_desc}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/update/growcell`,
		data:{
			id,
			group_cell_name,
			group_cell_desc
		}
	}).then(data => data.data).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

// 更新种植间成员
export async function updateRoomMembers({member_ids,id}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/update/updateRoomMembers`,
		data:{
			id,
			member_ids,
		}
	}).then(data => {
		if(data.data.code == 200) {
		 return data.data;
		}
	}).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

// 删除种植单元
export async function deleteCell(id) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/del/growcell_list`,
		data:{
			id
		}
	}).then(data => {
		if(data.data.code == 200) {
		 return data.data;
		}
	}).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

// 重置管理员账号
export async function resetManager(id,mode=false) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/resetUser`,
		data:{
			id,
			mode
		}
	}).then(data => {
		if(data.data.code == 200) {
		 return data.data;
		}
	}).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

// 工厂管理员创建用户
export async function createManagerUser({account,password,role,phone,email,factory_id}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/create/user`,
		data:{
			account,
			password,
			role,
			phone,
			email,
			factory_id,
		}
	}).then(data => {
		return data.data;
	}).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

// 获取所有用户
export async function getEnterManagerUserlist() {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/query/getOnlyEnterpriseUser`,
		data:{
			data: {}
		}
	}).then(data => {
		if(data.data.code == 200) {
		 return data.data;
		}
	}).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

// 获取单一用户信息
export async function getUserInfo(id) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/user/get`,
		data:{
			data: {id}
		}
	}).then(data => {
		if(data.data.code == 200) {
		 return data.data.data;
		}
	}).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

// 编辑用户
export async function modifyUser({id,account,role,phone,email}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/user/modify`,
		data:{
			data: {
	            id,
	            account,
	            role,
	            phone,
	            email,
	            first_name: "11",
	            last_name: "21",
	            international_code: "86",
	            country_code: "cn"
			}
		}
	}).then(data => {
		if(data.data.code == 200) {
		 return "success";
		}
	}).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

// 删除用户
export async function deleteUser(id) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/la/user/delete`,
		data:{
			data: {id}
		}
	}).then(data => {
		if(data.data.code == 200) {
		 return "success";
		}
	}).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

// 修改密码
export async function password_modify({userId,newPassword,oldpassword}) {
	let res = await axios({
		method: 'post',
        url: `${localBaseUrl}/manager/password_modify`,
		data:{
			userId,
			oldpassword,
			newPassword
		}
	}).then(data => {
		if(data.data.code == 200 && !data.data.err) {
		 return "success";
		} else {
			return data.data.err;
		}
	}).catch(err => {
		return {
			code: 500,
			message: "操作失败，未知错误"
		}
	})
	return res;
}

export async function getBigUserInfo(userId) {
	let res = await axios(`${localBaseUrl}/manager/query/getBigUserInfo?id=${userId}`).then(data => {
		return data.data;
	});
	return res;
}