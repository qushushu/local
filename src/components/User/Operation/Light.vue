<template>
    <div class="mobile-space-top1">
        <a-card v-loading="fullscreenLoading" :class="{isloading: fullscreenLoading}">
            <div v-if="plantDigInfo.length" v-for="k in 10" :key="k">
                <div v-if="plantDigInfo[k - 1]" class="space-btm1">
                    <!-- 头部标题区 start -->
                    <h5 class="light-tit">{{$t("message.第")}} {{k}} {{$t("message.组植物灯")}}</h5>
                    <!-- 头部标题区 end -->
                    <el-row type="flex" class="space-btm" justify="space-between">
                        <div>
                            <span class="btn-space" v-if="planManuInfo[k - 1]">{{$t("message.手动模式")}}：<el-switch v-model="planManuInfo[k - 1].value == 0 ? false : true" @change="changeLightGroupMode(k-1)"></el-switch>
                            </span>
                            <span class="btn-space">开关1：<el-switch :disabled="planManuInfo[k - 1].value == 0" v-model="plantDigInfo[k - 1][0].value == 0 ? false : true" @change="changeLightDig($event,k-1,1)"></el-switch></span>
                            <span>开关2：<el-switch :disabled="planManuInfo[k - 1].value == 0" v-model="plantDigInfo[k - 1][1].value == 0 ? false : true" @change="changeLightDig($event,k-1,2)"></el-switch></span>
                        </div>
                        <el-button type="primary" size="small" v-if="planManuInfo[k - 1].value == 1" @click="showDialogTemp(k)">{{$t("message.参数设置")}}</el-button>
                    </el-row>
                    <!-- 主体区域 start -->
                    <el-table ref="multipleTable" :data="tableData[k - 1]" size="small" border>
                        <el-table-column prop="title" label="序号"></el-table-column>
                        <el-table-column prop="white" label="白光亮度">
                            <template slot-scope="scope">
                                <span>{{scope.row.white}}</span>
                                <i class="el-icon-edit btn-icon" @click="showEditLightLayer(k-1,scope.row.white,'white',scope.row.index)" v-if="planManuInfo[k - 1].value == 1"></i>
                            </template>
                        </el-table-column>
                        <el-table-column prop="red" label="红光亮度">
                            <template slot-scope="scope">
                                <span>{{scope.row.red}}</span>
                                <i class="el-icon-edit btn-icon" @click="showEditLightLayer(k-1,scope.row.red,'red',scope.row.index)" v-if="planManuInfo[k - 1].value == 1"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 主体区域 end -->
                </div>
            </div>
            <el-empty v-if="!plantDigInfo.length"></el-empty>
        </a-card>
        <!-- 种植植物灯开关 end -->
        <!-- 亮度设置层 start -->
        <el-dialog :title="$t('message.亮度')" :visible.sync="dialogVisibleLight" size="small" width="200px">
            <div>
                <el-input-number v-model="currentShowLight" :min="0" :max="100" :label="$t('message.亮度')" size="small"></el-input-number>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisibleLight = false">{{$t("message.取消")}}</el-button>
                <el-button size="small" type="primary" @click="submitEditLightTemp">{{$t("message.确定")}}</el-button>
            </span>
        </el-dialog>
        <!-- 亮度设置层 end -->
        <!-- 参数设置层 start -->
        <el-dialog :title="$t('message.参数设置')" :visible.sync="dialogVisible" size="small" width="680px">
            <el-table ref="multipleTable" :data="tableDataLight" border stripe size="small" height="300px">
                <el-table-column prop="param_id" :label="$t('message.序号')" width="50"></el-table-column>
                <el-table-column prop="param_code" :label="$t('message.代码')" width="150"></el-table-column>
                <el-table-column prop="name" :label="$t('message.参数项')" width="250"></el-table-column>
                <el-table-column prop="ref_value" :label="$t('message.参数值')" width="150">
                    <template slot-scope="scope">
                        <div>
                            <el-input v-if="(paramIptList.includes(scope.row.param_code))" :placeholder="$t('message.请输入内容')" size="small" v-model="scope.row.ref_value"></el-input>
                            <el-time-select
                              v-model="scope.row.ref_value"
                              :picker-options="{
                               	start: '00:00',
    							end: '23:59',
                                step: '00:15'
                              }"
                              placeholder="选择时间"
                              v-if="(scope.row.param_code == 'SUNRIZE') || (scope.row.param_code == 'SUNSET')"
                              >
                            </el-time-select>
                            <el-switch v-model="statusLT_1" v-if="(scope.row.param_code == 'LT_1')"></el-switch>
                            <el-switch v-model="statusLT_2" v-if="(scope.row.param_code == 'LT_2')"></el-switch>
                            <el-switch v-model="statusLT_3" v-if="(scope.row.param_code == 'LT_3')"></el-switch>
                            <el-switch v-model="statusLT_4" v-if="(scope.row.param_code == 'LT_4')"></el-switch>
                            <el-switch v-model="statusMANU" v-if="(scope.row.param_code == 'MANU')"></el-switch>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">{{$t("message.取消")}}</el-button>
                <el-button size="small" type="primary" @click="writeLightInfo">{{$t("message.写参数")}}</el-button>
                <el-button size="small" type="primary" @click="writeLightInfoAllTemp">{{$t("message.批量下载")}}</el-button>
            </span>
        </el-dialog>
        <!-- 参数设置层 end -->
    </div>
</template>
<style scoped>
    .light-tit {text-align: center;font-size: 14px;line-height: 30px;}
    .isloading {padding-bottom: 100px;}
    .btn-space {margin-right: 18px;}
    .btn-icon {cursor: pointer;}
</style>
<script>
    import {switchTimeToShow,switchTimeToSubmit,minuteToTime} from "../../../assets/tools/tool.js"
    import {read_device_param,adjust,write_device_param,control} from "../../../store/ajax"
    import {runInfoMixin} from "../mixins/runinfo"
    export default {
        mixins: [runInfoMixin],
        data() {
            return {
                fullscreenLoading: false,  // 是否显示loading条
                light_dig: [],
                originData: [],
                dialogVisible: false,
                currentLightNum: 0,   // 正在编辑哪组灯
                tableDataLight: [],   // 显示在表格中的条目
                cacheDataLight: [],   // 缓存条目
                statusLT_1: false,
                statusLT_2: false,
                statusLT_3: false,
                statusLT_4: false,
                statusMANU: false,
                dialogVisibleLight: false,
                currentLightIndex: 0,
                currentShowLight: 0,
                light_color_num: 0,
                paramIptList: ["DAY_OFFSET","ADJ_TIME","LIGHT_MAX","LIGHT1","LIGHT2","LIGHT3","LIGHT4","LIGHT5","LIGHT6","LIGHT7","LIGHT8"]
            };
        },
        computed: {
            operateNo() {
                return this.$store.state.userInfo.user.account
            },
            op_id() {
                return String(this.$store.state.userInfo.user.id);
            },
            lightInfo1() {
                return Object.values(this.runInfo.light_ana).map(item => {
                    if(item["item"]) {
                        return item["item"].map(it => it.value)
                    } else {
                        return [];
                    }
                })
            },
            tableData() {
                let arr = [];
                arr.length = 10;
                for(let i=0;i<10;i++) {
                    arr[i] = [{
                        index: 1,
                        title: this.$t('message.灯1'),
                        red: this.lightInfo1[i].length ? this.lightInfo1[i][4] : '--',
                        white: this.lightInfo1[i].length ? this.lightInfo1[i][0] : '--'
                    },{
                        index: 2,
                        title: this.$t('message.灯2'),
                        red: this.lightInfo1[i].length ? this.lightInfo1[i][5] : '--',
                        white: this.lightInfo1[i].length ? this.lightInfo1[i][1] : '--'
                    },{
                        index: 3,
                        title: this.$t('message.灯3'),
                        red: this.lightInfo1[i].length ? this.lightInfo1[i][6] : '--',
                        white: this.lightInfo1[i].length ? this.lightInfo1[i][2] : '--'
                    },{
                        index: 4,
                        title: this.$t('message.灯4'),
                        red: this.lightInfo1[i].length ? this.lightInfo1[i][7] : '--',
                        white: this.lightInfo1[i].length ? this.lightInfo1[i][3] : '--'
                    }]
                }
                return arr;
            },
            // 种植开关信息
            plantDigInfo() {return this.$store.state.plant_dig},
            // 种植Manu信息
            planManuInfo() {
                let json = this.runInfo.light_param;
                return json.map(item => {
                    if(item["item"]) {
                        let t2 = item["item"].filter(itm => itm["param_code"] == "MANU");
                        t2.length ? t2[0] : undefined
                        if(t2.length) {
                            return t2[0]
                        } else {
                            return undefined
                        }
                    } else {
                        return undefined
                    }
                })
            },
            plantLightArr() {
                let result = [];
                for (item in this.runInfo.light_ana) {
                    if(this.runInfo.light_ana[item]["item"]) {
                        result.push(this.runInfo.light_ana[item]["item"][0].value);
                    } else {
                         result.push(0);
                    }
                }
                return result;
            },
            planInfo() {return this.$store.state.currentPlanInfo},
            SUNRIZE() {return  this.planInfo.curStage.stage_content.length ? (this.minuteToTime(this.planInfo.curStage.stage_content[0].SUNRIZE) || null) : null},
            SUNSET() {return this.planInfo.curStage.stage_content.length ? (this.minuteToTime(this.planInfo.curStage.stage_content[0].SUNSET) || null) : null},
        },
        methods: {
            changeLightDig(data,b,c) {
                this.$confirm("确认修改开关？", this.$t('message.提示'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('message.确定'),
                    cancelButtonText: this.$t('message.取消'),
                }).then(async ()=> {
                    let json = {
                        op_id: this.op_id,
                        operateNo: this.operateNo,
                        op_type : "OP_LT_CTRL",
                        dev_id: b + 1,
                        data_id: c,
                        data_code: `light${c}`,
                        value: data ? 1 : 0,
                    }
                    let res = await adjust(json);
                    if(res) {
                        this.$message({
                            type: 'success',
                            message: this.$t('message.修改成功')
                        });
                    } else {
                        this.$message({
                            type: 'success',
                            message: this.$t('message.修改失败')
                        });
                    }
                    // this.resetEditLayer();
                })
            },
            // 修改亮度弹层
            showEditLightLayer(number,data,color,index) {
                this.currentLightIndex = number;
                this.currentShowLight = data;
                this.dialogVisibleLight = true;
                let light_color_num
                switch(color) {
                    case 'white':
                        light_color_num = 0 + index
                        break
                    case 'red':
                        light_color_num = 4 + index
                        break
                }
                this.light_color_num = light_color_num;
            },
            // 确认修改亮度
            submitEditLightTemp() {
                this.$confirm(this.$t('message.确认修改亮度？'), this.$t('message.提示'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('message.确定'),
                    cancelButtonText: this.$t('message.取消'),
                }).then(async ()=> {
                	let json = {
                		op_id: this.op_id,
                        operateNo: this.operateNo,
                        op_type : "OP_LT_ADJUST",
                        dev_id: this.currentLightIndex + 1,
                        data_id: this.light_color_num,
                        data_code: `LIGHT${this.light_color_num}`,
                        value: this.currentShowLight,
                	}
                	let res = await adjust(json);
                	if(res) {
                		this.$message({
                            type: 'success',
                            message: this.$t('message.修改成功')
                        });
                	} else {
                		this.$message({
                            type: 'error',
                            message: this.$t('message.修改失败')
                        });
                	}
                	this.resetEditLayer();
                })
            },
            // 修改亮度后回调
            resetEditLayer() {
                this.currentLightIndex = 0;
                this.currentShowLight = 0;
                this.dialogVisibleLight = false;
                this.light_color_num = 0
            },
            // 改变种植第N组灯的自动/手动状态
            async changeLightGroupMode(n) {
                this.$confirm(this.$t('message.是否修改模式？'), this.$t('message.提示'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('message.确定'),
                    cancelButtonText: this.$t('message.取消'),
                }).then(async () => {
                    this.fullscreenLoading = true;
                    let lightInfo = await this.readPlant(n+1);
                    if(lightInfo) {
                        let MANU = this.getValueFromParam(lightInfo["item"],"MANU");
                        this.setValueFromParam(lightInfo["item"],"MANU",MANU == 0 ? 1 : 0);
                        lightInfo.dev_id = Number(lightInfo.dev_id);
                        let res = await write_device_param({
                        	operateNo: this.operateNo,
                            op_id: this.op_id,
                            op_type: "OP_LT_SET_SET",
                            ...lightInfo
                        });
                        this.fullscreenLoading = false;
                        if(res) {
                        	this.$message({
                                type: 'success',
                                message: this.$t('message.修改成功')
                            });
                            setTimeout(async ()=> {
                                let res  = await this.readPlant(n + 1);
                                if(this.planManuInfo[n]) {
                                    this.planManuInfo[n][0].value = res.item[10].value;
                                }
                            },10);
                        }
                    }
                })
            },
             // 获取第N组灯信息
            async readPlant(n) {
                let res = await read_device_param({
                	is_light: true,
                    operateNo: this.operateNo,
                    op_id: this.op_id,
                    op_type: "OP_LT_CALL_SET",     
                    dev_id: n
                });
                if(res) {
                    return res;
                } else {
                    this.$message({
                        type: 'error',
                        message: this.$t('message.操作频繁，请重试')
                    });
                    this.fullscreenLoading = false;
                }
            },
            // 点击参数设置弹层
            async showDialogTemp(n) {
                this.fullscreenLoading = true;
                this.currentLightNum = n;
                let data = await read_device_param({
                	is_light: true,
            		operateNo: this.operateNo,
                    op_id: this.op_id,
                    op_type: "OP_LT_CALL_SET",     
                    dev_id: n
            	});
            	this.fullscreenLoading = false;
            	if(!data) {
            		 this.$message({
                        type: 'error',
                        message: this.$t('message.操作频繁，请重试')
                    });
            	} else {
            		let param_item  = data.item;
	                this.cacheDataLight = JSON.parse(JSON.stringify(param_item));
	                this.tableDataLight = param_item.map(item => {
	                    item.ref_value = item.value;
	                    item = switchTimeToShow(item);
	                    switch (item.param_code) {
	                        case "DAY_OFFSET":
	                            item.name = this.$t('message.距离种植开始的天数'); 
	                        break;
	                        case "LIGHT":
	                            item.name = this.$t('message.亮度'); 
	                        break;
	                        case "LIGHT_MAX":
	                            item.name = this.$t('message.最大亮度'); 
	                        break;
	                        case "ADJ_TIME":
	                            item.name = this.$t('message.调节时间(分钟)'); 
	                        break;
	                        case "SUNRIZE":
	                            item.name = this.$t('message.日出时间');
	                        break;
	                        case "SUNSET":
	                            item.name = this.$t('message.日落时间');
	                        break;
	                        case "LT_1":
	                            item.name = "开关1";
	                            if(item.value === 1) {
	                               this.statusLT_1 = true;
	                            }
	                        break;
	                        case "LT_2":
	                            item.name = "开关2";
	                            if(item.value === 1) {
	                                this.statusLT_2 = true;
	                            }
	                        break;
	                        case "LIGHT1":
                                item.name = "灯1白光亮度";
                            break;
                             case "LIGHT2":
                                item.name = "灯2白光亮度";
                            break;
                            case "LIGHT3":
                                item.name = "灯3白光亮度";
                            break;
                             case "LIGHT4":
                                item.name = "灯4白光亮度";
                            break;
                            case "LIGHT5":
                                item.name = "灯1红光亮度";
                            break;
                             case "LIGHT6":
                                item.name = "灯2红光亮度";
                            break;
                            case "LIGHT7":
                                item.name = "灯3红光亮度";
                            break;
                             case "LIGHT8":
                                item.name = "灯4红光亮度";
                            break;
	                        case "MANU":
	                            item.name = this.$t('message.手动操作');
	                            // if(item.value === 1) {
	                            //     this.statusMANU = true;
	                            // }
                                // 手动默认设置成自动
                                this.statusMANU = false;
	                        break;
	                    }
	                    return item;
	                })
	                this.dialogVisible = true;
            	}
            },
            // 参数设置写参数
            async writeLightInfo() {
                // let lightmaxdata = parseInt(this.getRefValueFromParam(this.tableDataLight,"LIGHT_MAX"));
                // let lightdata = parseInt(this.getRefValueFromParam(this.tableDataLight,"LIGHT"));
                let valTrue =  this.statusLT_1 || this.statusLT_2 || this.statusLT_3 || this.statusLT_4  ;
                // if((lightdata > lightmaxdata) && (!valTrue)) {
                //     this.$message({
                //         type: 'error',
                //         message: this.$t('message.修改失败，亮度不能超过最大亮度')
                //     });
                //     return;
                // }

                let param1 = JSON.parse(JSON.stringify(this.tableDataLight)).map(item => {
                    item = switchTimeToSubmit(item);
                    item.value = item.ref_value;
                    return item;
                });
                let dataSUNRIZE,dataSUNSET
                param1.map(item => {
                    if(item.param_code == "SUNRIZE") {
                        dataSUNRIZE = parseInt(item.value);
                    }
                    if(item.param_code == "SUNSET") {
                        dataSUNSET = parseInt(item.value);
                    }
                });
                if(dataSUNRIZE > dataSUNSET) {
                   this.$message({
                        type: 'error',
                        message: "日出时间应早于日落时间"
                    });
                    return;
                }
                let param = this.tableDataLight.map(item => {
                    item = switchTimeToSubmit(item);
                    item.value = item.ref_value;
                    delete item.ref_value;
                    delete item.name;
                    return item;
                });
                param.map(item => {
                     this.cacheDataLight.forEach(item1 => {
                        if(item.param_code == item1.param_code) {
                            item1.value = parseInt(item.value);
                        }
                    })
                });
                
                this.setValueFromParam(this.cacheDataLight,"LT_1",this.statusLT_1 ? 1 : 0);
                this.setValueFromParam(this.cacheDataLight,"LT_2",this.statusLT_2 ? 1 : 0);
                this.setValueFromParam(this.cacheDataLight,"MANU",this.statusMANU ? 1 : 0);
                
                let res = await write_device_param({
                	item:[...this.cacheDataLight],
                    operateNo: this.operateNo,
                    op_id: this.op_id,
                    op_type : "OP_LT_SET_SET",
                    dev_id: this.currentLightNum,
                    item_num: 15,
                });
                this.fullscreenLoading = false;
                if(res) {
                	this.$message({
                        type: 'success',
                        message: this.$t('message.修改成功')
                    });
                    this.resetLightInfo();
                }
            },
            writeLightInfoOne(n,json) {
             	return new Promise(async (resolve)=> {
	                let res = await write_device_param(json);
	                setTimeout(()=> {
	                	resolve();
	                },500);
             	});
            },
            async writeLightInfoAllTemp() {
            	this.$confirm(this.$t('message.确认批量下载?'), this.$t('message.提示'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('message.确定'),
                    cancelButtonText: this.$t('message.取消'),
                }).then( async _ => {
	            	let lightmaxdata = parseInt(this.getRefValueFromParam(this.tableDataLight,"LIGHT_MAX"));
	                let lightdata = parseInt(this.getRefValueFromParam(this.tableDataLight,"LIGHT"));
	                let valTrue =  this.statusLT_1 || this.statusLT_2 || this.statusLT_3 || this.statusLT_4  ;
	                if((lightdata > lightmaxdata) && (!valTrue)) {
	                    this.$message({
	                        type: 'error',
	                        message: this.$t('message.修改失败，亮度不能超过最大亮度')
	                    });
	                    return;
	                }
	                let param = this.tableDataLight.map(item => {
	                    item = switchTimeToSubmit(item);
	                    item.value = item.ref_value;
	                    delete item.ref_value;
	                    delete item.name;
	                    return item;
	                });
	                param.map(item => {
	                     this.cacheDataLight.forEach(item1 => {
	                        if(item.param_code == item1.param_code) {
	                            item1.value = parseInt(item.value);
	                        }
	                    })
	                });
	               
	                this.setValueFromParam(this.cacheDataLight,"LT_1",this.statusLT_1 ? 1 : 0);
	                this.setValueFromParam(this.cacheDataLight,"LT_2",this.statusLT_2 ? 1 : 0);
	                this.setValueFromParam(this.cacheDataLight,"LT_3",this.statusLT_3 ? 1 : 0);
	                this.setValueFromParam(this.cacheDataLight,"LT_4",this.statusLT_4 ? 1 : 0);
	                this.setValueFromParam(this.cacheDataLight,"MANU",this.statusMANU ? 1 : 0);
	                
	                let res = await write_device_param({
	                	item:[...this.cacheDataLight],
	                    operateNo: this.operateNo,
	                    op_id: this.op_id,
	                    op_type : "OP_LT_SET_SET",
	                    dev_id: 65535,
	                    item_num: 11,
	                });
	                this.fullscreenLoading = false;
	                if(res) {
	                	this.$message({
	                        type: 'success',
	                        message: this.$t('message.修改成功')
	                    });
	                    this.resetLightInfo();
	                }
                })

            },
            // 写参数后，调用，重置
            resetLightInfo() {
                this.currentLightNum = 0;
                this.dialogVisible = false;
                this.cacheDataLight = [];
            },
            // 红光开关修改
            changeLightPlant(num,b) {
                /*
                    num: 第几组
                    b：第几个灯
                */
                this.$confirm(this.$t('message.是否修改照明灯开关？'), this.$t('message.提示'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('message.确定'),
                    cancelButtonText: this.$t('message.取消'),
                }).then(async _=> {
                    this.fullscreenLoading = true;
                    let res = await control({
                    	operateNo: this.operateNo,
                        op_id: this.op_id,
                        op_type : "OP_LT_CTRL",
                        dev_id: num + 1,
                        data_id: b + 1,
                        data_code: `light${num + 1}`,
                        value: this.plantDigInfo[num][b].value == 0 ? 1 : 0
                    });
                    this.fullscreenLoading = false;
                    if(res) {
                    	 this.$message({
                            type: 'success',
                            message: this.$t('message.修改成功')
                        });
                    }
                });
            },
            // 工具函数
            getValueFromParam(arrList,param_code) {
                let arr = arrList.filter(item => item["param_code"] == param_code);
                return arr.length ? arr[0].value : "";
            },
            getRefValueFromParam(arrList,param_code) {
                let arr = arrList.filter(item => item["param_code"] == param_code);
                return arr.length ? arr[0].ref_value : "";
            },
            setValueFromParam(arrList,param_code,newData) {
                let arr = arrList.filter(item => item["param_code"] == param_code);
                arr[0].value = newData;
            },
            minuteToTime,
        }
    }
</script>