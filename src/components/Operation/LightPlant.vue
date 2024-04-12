<template>
    <div class="mobile-space-top1">
        <a-card v-loading="fullscreenLoading" :class="{isloading: fullscreenLoading}">
            <!-- 主体区域 start -->
            <el-table :data="tableData" size="small" border>
                <!-- 左侧编号 start -->
                <el-table-column>
                    <template slot-scope="scope">
                        {{$t("message.第")}}{{scope.row.title}}{{$t("message.组植物灯")}}
                    </template>
                </el-table-column>
                <!-- 左侧编号 end -->
                <!-- 模式切换 start -->
                <el-table-column>
                    <template slot-scope="scope">
                     <span v-if="planManuInfo[scope.row.index - 1]">{{$t("message.手动模式")}}：<el-switch v-model="planManuInfo[scope.row.index - 1][0].value == 0 ? false : true" @change="changeLightGroupMode(scope.row.index-1)"></el-switch></span>
                    </template>
                </el-table-column>
                <!-- 模式切换 end -->
                <!-- 白光亮度 start -->
                 <el-table-column>
                    <template slot-scope="scope">
                        <span>白光亮度：{{scope.row["light1"]}} <a v-if="scope.row.manu && scope.row.valid1" href="javascript:;" class="el-icon-edit lightEdit" @click="showEditLightLayer(scope.row.index - 1,scope.row.light1,'light1')"></a></span>
                    </template>
                </el-table-column>
                <!-- 白光亮度 end -->
                <!-- 红光亮度 start -->
                <el-table-column>
                    <template slot-scope="scope">
                        <span>红光亮度：{{scope.row["light4"] }} <a v-if="scope.row.manu && scope.row.valid4" href="javascript:;" class="el-icon-edit lightEdit" @click="showEditLightLayer(scope.row.index - 1,scope.row.light4,'light4')"></a></span>
                    </template>
                </el-table-column>
                <!-- 红光亮度 end -->
                <!-- 参数设置 start -->
                <el-table-column>
                    <template slot-scope="scope">
                     <el-button type="primary" size="small" v-if="planManuInfo[scope.row.index - 1]" :disabled="(runInfo.dig.AUTO === 1) || (planManuInfo[scope.row.index - 1][0].value == 0)" style="margin-left: 8px;" @click="showDialogTemp(scope.row.index)">{{$t("message.参数设置")}}</el-button>
                 </template>
                 </el-table-column>
                <!-- 参数设置 end -->
            </el-table>
            <!-- 主体区域 end -->
            <!-- 没有灯 start -->
            <el-empty v-if="!plantDigInfo.length"></el-empty>
            <!-- 没有灯 end -->
        </a-card>
        <!-- 种植植物灯开关 end -->

        <!-- 亮度调节层 start -->
        <el-dialog title="亮度设置" :visible.sync="dialogVisibleLight" size="small" width="180px">
            <el-input-number v-model="currentShowLight" :min="0" :max="100" :label="$t('message.亮度')" size="small"></el-input-number>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisibleLight = false">取 消</el-button>
                <el-button size="small" type="primary" @click="submitEditLightTemp">确定</el-button>
            </span>
        </el-dialog>
        <!-- 亮度调节层 end -->

        <!-- 参数设置层 start -->
        <el-dialog title="参数设置" :visible.sync="dialogVisible" size="small" width="680px">
            <el-table ref="multipleTable" :data="tableDataLight" border stripe size="small" height="300px">
                <el-table-column prop="param_id" :label="$t('message.序号')" width="50"></el-table-column>
                <el-table-column prop="param_code" :label="$t('message.代码')" width="150"></el-table-column>
                <el-table-column prop="name" :label="$t('message.参数项')" width="250"></el-table-column>
                <el-table-column prop="ref_value" :label="$t('message.参数值')" width="150">
                    <template slot-scope="scope">
                        <div>
                            <el-input v-if="(scope.row.param_code == 'DAY_OFFSET') || (scope.row.param_code == 'ADJ_TIME') || (scope.row.param_code == 'LIGHT1') || (scope.row.param_code == 'LIGHT4')" :placeholder="$t('message.请输入内容')" size="small" v-model="scope.row.ref_value"></el-input>
                            <el-time-select v-model="scope.row.ref_value" :picker-options="{step: '00:15', start: '00:00', end: '23:45'}" placeholder="选择时间" v-if="(scope.row.param_code == 'SUNRIZE') || (scope.row.param_code == 'SUNSET')"></el-time-select>
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
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="writeLightInfo">写参数</el-button>
            </span>
        </el-dialog>
         <!-- 参数设置层 end -->
    </div>
</template>
<style scoped>
    .isloading {padding-bottom: 100px;}
    .lightEdit {margin-left: 6px;text-decoration: none;}
</style>
<script>
    import axios from 'axios';
    import aCard from "../common/Acard"
    import {switchTimeToShow,switchTimeToSubmit,minuteToTime} from "../../assets/tools/tool.js"
    export default {
        data() {
            return {
                fullscreenLoading: false,  // 是否显示loading条
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
                tableData: [],
                lnum: ""
            };
        },
        computed: {
            apiurl() {
                return this.$store.state.apiurlPlant;
            },
            isPlant() {
                return this.$store.state.isPlant;
            },
            operateNo() {
                return this.$store.state.user.operateNo;
            },
            // 用户id
            op_id() {
                return this.$store.state.user.userId;
            },
            runInfo() {
                return this.$store.state.runInfo;
            },
            // 种植开关信息(用来计数)
            plantDigInfo() {
                return this.$store.state.plant_dig;
            },
            // 获取自动/手动模式
            planManuInfo() {
                let result = [];
                let arr = [];
                let json = this.seedling_light_dig;
                for(item in json) {
                    arr.push(json[item]["item"]);
                }
                arr.forEach(item => {
                    let res = [];
                    if(item) {
                        item.forEach(itm => ["MANU"].includes(itm.param_code) && res.push(itm));
                        result.push(res);
                    } else {
                        result.push(undefined);
                    }
                });
                return result;
            },
            planInfo() {
                return this.$store.state.currentPlanInfo;
            },
            SUNRIZE() {
                let d = this.planInfo.curStage.stage_content.length ? (this.minuteToTime(this.planInfo.curStage.stage_content[0].SUNRIZE) || null) : null;
                return d;
            },
            SUNSET() {
                return this.planInfo.curStage.stage_content.length ? (this.minuteToTime(this.planInfo.curStage.stage_content[0].SUNSET) || null) : null;
            },
            seedling_light_dig() {
                return this.runInfo.seedling_light_dig;
            },
            plant_light_ana() {
                return this.runInfo.plant_light_ana;
            }
        },
        methods: {
            // 点击亮度调节按钮
            showEditLightLayer(number,data,lnum) {
                this.currentLightIndex = number;
                this.currentShowLight = data;
                this.dialogVisibleLight = true;
                this.lnum = lnum;
            },
            // 点击确认修改亮度按钮调用
            submitEditLightTemp() {
                this.$confirm(this.$t('message.确认修改亮度？'), this.$t('message.提示'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('message.确定'),
                    cancelButtonText: this.$t('message.取消'),
                }).then(()=> {
                    let data_id = 0;
                    if(this.lnum == "light1") {
                        data_id = 1;
                    } else if(this.lnum == "light4") {
                        data_id = 4;
                    } else {
                        this.$message({
                            type: 'error',
                            message: "操作失败，请重试！"
                        });
                        return;
                    }
                    axios({
                        method: 'post',
                        url: `${this.apiurl}/la/adjust`,
                        data: {
                            data: {
                                op_id: this.op_id,
                                operateNo: this.operateNo,
                                op_type : "OP_LT_P_ADJUST",
                                dev_id: this.currentLightIndex + 1,
                                data_id,
                                data_code: this.lnum,
                                value: this.currentShowLight,
                            }
                        }
                    }).then((data)=> {
                         if(data.data.code == 200) {
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
                })
            },
            // 修改亮度成功后回调
            resetEditLayer() {
                this.currentLightIndex = 0;
                this.currentShowLight = 0;
                this.dialogVisibleLight = false;
                this.lnum = "";
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
                    let MANU = this.getValueFromParam(lightInfo["item"],"MANU");
                    this.setValueFromParam(lightInfo["item"],"MANU",MANU == 0 ? 1 : 0);
                    lightInfo.dev_id = Number(lightInfo.dev_id);
                    axios({
                        url: `${this.apiurl}/la/device/param/write`,
                        method: "post",
                        data: {
                            data: {
                                operateNo: this.operateNo,
                                op_id: this.op_id,
                                op_type: "OP_LT_P_SET_SET",
                                ...lightInfo
                            }
                        }
                    }).then(data => {
                        this.fullscreenLoading = false;
                        if(data.data.code == 200) {
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
                    });
                })
            },
            // 获取第N组灯信息(开始的时候不会调用，只有改变灯自动/手动状态时才调用)
            async readPlant(n) {
                return new Promise((resolve,reject)=> {
                    axios({
                        url: `${this.apiurl}/la/device/param/read`,
                        method: "post",
                        data: {
                            data: {
                                operateNo: this.operateNo,
                                op_id: this.op_id,
                                op_type: "OP_LT_P_CALL_SET",     
                                dev_id: n
                            }
                        }
                    }).then(data => {
                        if(data.data.code == 200) {
                            resolve(data.data.data);
                        } else {
                            reject("请求失败！");
                            this.$message({
                                type: 'error',
                                message: this.$t('message.操作频繁，请重试')
                            });
                            this.fullscreenLoading = false;
                        }
                    })
                })
            },
            // 点击参数设置时调用
            async showDialogTemp(n) {
                this.fullscreenLoading = true;
                this.currentLightNum = n;
                let data = await this.readPlantTemp(n);
                this.fullscreenLoading = false;
                let param_item  = data.item;
                this.cacheDataLight = JSON.parse(JSON.stringify(param_item));
                this.tableDataLight = param_item.map(item => {
                    item.ref_value = item.value;
                    item = switchTimeToShow(item);
                    switch (item.param_code) {
                        case "DAY_OFFSET":
                            item.name = "距离种植开始的天数"; 
                        break;
                        case "ADJ_TIME":
                            item.name = "调节时间(分钟)"; 
                        break;
                        case "SUNRIZE":
                            item.name = "日出时间";
                        break;
                        case "SUNSET":
                            item.name = "日落时间";
                        break;
                        case "LT_1":
                            item.name = "红灯1开关";
                            if(item.value === 1) {
                               this.statusLT_1 = true;
                            }
                        break;
                        case "LT_2":
                            item.name = "红灯2开关";
                            if(item.value === 1) {
                                this.statusLT_2 = true;
                            }
                        break;
                        case "LT_3":
                            item.name = "红灯3开关";
                            if(item.value === 1) {
                                this.statusLT_3 = true;
                            }
                        break;
                        case "LT_4":
                            item.name = "红灯4开关";
                            if(item.value === 1) {
                                this.statusLT_4 = true;
                            }
                        break;
                        case "MANU":
                            item.name = "手动操作";
                            if(item.value === 1) {
                                this.statusMANU = true;
                            }
                        break;
                        case "LIGHT1":
                            item.name = "白光亮度";
                        break;
                        case "LIGHT4":
                            item.name = "红光亮度";
                        break;
                    }
                    return item;
                })
                this.dialogVisible = true;
            },
            // 获取第N组灯信息(点击参数设置时调用)
            async readPlantTemp(n) {
                return new Promise((resolve,reject)=> {
                    axios({
                        url: `${this.apiurl}/la/device/param/read`,
                        method: "post",
                        data: {
                            data: {
                                operateNo: this.operateNo,
                                op_id: this.op_id,
                                op_type: "OP_LT_P_CALL_SET",     
                                dev_id: Number(n)
                            }
                        }
                    }).then(data => {
                        if(data.data.code == 200) {
                            resolve(data.data.data);
                        } else {
                            reject("请求失败！");
                            this.$message({
                                type: 'error',
                                message: this.$t('message.操作频繁，请重试')
                            });
                            this.fullscreenLoading = false;
                        }
                    })
                })
            },
            // 确认修改参数设置时调用
            writeLightInfo() {
                let lightmaxdata = 100;
                let lightdata1 = parseInt(this.getRefValueFromParam(this.tableDataLight,"LIGHT1"));
                let lightdata4 = parseInt(this.getRefValueFromParam(this.tableDataLight,"LIGHT4"));
                let valTrue =  this.statusLT_1 || this.statusLT_2 || this.statusLT_3 || this.statusLT_4  ;
                if(((lightdata1 > lightmaxdata) || (lightdata4 > lightmaxdata)) && (!valTrue)) {
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
                
                axios({
                    method: 'post',
                    url: `${this.apiurl}/la/device/param/write`,
                    data: {
                        data: {
                            item:[...this.cacheDataLight],
                            operateNo: this.operateNo,
                            op_id: this.op_id,
                            op_type : "OP_LT_P_SET_SET",
                            dev_id: Number(this.currentLightNum),
                            item_num: 12,
                        }
                    }
                }).then(data => {
                    this.fullscreenLoading = false;
                    if(data.data.code == 200) {
                        this.$message({
                            type: 'success',
                            message: this.$t('message.修改成功')
                        });
                        this.resetLightInfo();
                    }
                });
            },
            // 修改参数成功后回调
            resetLightInfo() {
                this.currentLightNum = 0;
                this.dialogVisible = false;
                this.cacheDataLight = [];
            },
            // 修改单个灯红光开关时调用
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
                    axios({
                        method: 'post',
                        url: `${this.apiurl}/la/control`,
                        data: {
                            data: {
                                operateNo: this.operateNo,
                                op_id: this.op_id,
                                op_type : "OP_LT_P_CTRL",
                                dev_id: num + 1,
                                data_id: b + 1,
                                data_code: `light${num + 1}`,
                                value: this.plantDigInfo[num][b].value == 0 ? 1 : 0
                            }
                        }
                    }).then(data => {
                        this.fullscreenLoading = false;
                        if(data.data.code == 200) {
                            this.$message({
                                type: 'success',
                                message: this.$t('message.修改成功')
                            });
                        }
                    });
                });
            },
            // 工具函数
            minuteToTime,
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
        },
        components: {
            aCard
        },
        watch: {
            seedling_light_dig(data) {
                this.tableData = [];
                for(item in data) {
                    let lightItem = data[item];
                    if(lightItem["dev_id"]) {
                        let lightItem1 = this.runInfo.plant_light_ana[item]
                        let light1 = this.getValueFromParam(lightItem1["item"],"LIGHT1");
                        let light4 = this.getValueFromParam(lightItem1["item"],"LIGHT4");
                        light1 = typeof(light1) == "number" ? light1 : "--";
                        light4 = typeof(light4) == "number" ? light4 : "--";
                        let valid1 = true;
                        let valid4 = true;
                        if(light1 == '--' ) {
                            valid1 = false;
                        }
                        if(light4 == '--') {
                            valid4 = false;
                        }
                        let manu = this.getValueFromParam(lightItem["item"],"MANU");
                        this.tableData.push({
                            title: String(lightItem["dev_id"]),
                            index: lightItem["dev_id"],
                            light1,
                            light4,
                            manu,
                            valid1,
                            valid4
                        });
                    }
                }
            },
        },
    }
</script>