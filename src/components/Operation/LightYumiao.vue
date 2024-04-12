<template>
    <div class="mobile-space-top1">
        <!-- 育苗植物灯开关 start -->
        <a-card v-loading="fullscreenLoading" :class="{isloading: fullscreenLoading}">
            <div v-if="seedling_light_dig.length">
                <div v-if="seedling_light_dig.length && seedling_light_dig[0].length">
                    <div>
                        <h5 class="light-tit light-tit_spe">第1组植物灯<el-button type="primary" size="mini" class="btn-float" @click="showDialogTemp(1)">{{$t("message.参数设置")}}</el-button></h5>
                    </div>
                    <el-table :data="tableData" size="small" border>
                        <el-table-column prop="title"></el-table-column>
                        <el-table-column label="左侧">
                            <template slot-scope="scope">植物灯开关：
                                <el-switch @change="changeLight(0)" :disabled="runInfo.dig.AUTO === 1" v-model="show_seedling_light_dig[0][scope.row.index - 1]"> </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="右侧">
                            <template slot-scope="scope">植物灯开关：
                                <el-switch @change="changeLight(0)" :disabled="runInfo.dig.AUTO === 1" v-model="show_seedling_light_dig[0][scope.row.index + 3]"> </el-switch>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div v-if="seedling_light_dig.length && seedling_light_dig[1].length">
                    <h5 class="light-tit">第2组植物灯<el-button type="primary" size="mini" class="btn-float" @click="showDialogTemp(2)">{{$t("message.参数设置")}}</el-button></h5>
                    <el-table :data="tableData" size="small" border>
                        <el-table-column prop="title"></el-table-column>
                        <el-table-column label="左侧">
                            <template slot-scope="scope">植物灯开关：
                                <el-switch @change="changeLight(1)" :disabled="runInfo.dig.AUTO === 1" v-model="show_seedling_light_dig[1][scope.row.index - 1]"> </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="右侧">
                            <template slot-scope="scope">植物灯开关：
                                <el-switch @change="changeLight(1)" :disabled="runInfo.dig.AUTO === 1"  v-model="show_seedling_light_dig[1][scope.row.index + 3]"> </el-switch>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div v-if="seedling_light_dig.length && seedling_light_dig[2].length">
                    <h5 class="light-tit">第3组植物灯<el-button type="primary" size="mini" class="btn-float" @click="showDialogTemp(3)">{{$t("message.参数设置")}}</el-button></h5>
                    <el-table :data="tableData" size="small" border>
                        <el-table-column prop="title"></el-table-column>
                        <el-table-column label="左侧">
                            <template slot-scope="scope">植物灯开关：
                                <el-switch @change="changeLight(2)" :disabled="runInfo.dig.AUTO === 1" v-model="show_seedling_light_dig[2][scope.row.index - 1]"> </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="右侧">
                            <template slot-scope="scope">植物灯开关：
                                <el-switch @change="changeLight(2)" :disabled="runInfo.dig.AUTO === 1" v-model="show_seedling_light_dig[2][scope.row.index + 3]"> </el-switch>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <el-empty v-if="seedling_light_dig.length && !seedling_light_dig[0].length  && !seedling_light_dig[1].length  && !seedling_light_dig[2].length"></el-empty>
        </a-card>
        <!-- 育苗植物灯开关 end -->
        <!-- 参数设置层 start -->
        <el-dialog title="参数设置" :visible.sync="dialogVisible" size="small" width="680px">
            <el-table ref="multipleTable" :data="tableDataLight" border stripe size="small" height="300px">
                <el-table-column prop="param_id" :label="$t('message.序号')" width="50"></el-table-column>
                <el-table-column prop="param_code" :label="$t('message.代码')" width="150"></el-table-column>
                <el-table-column prop="name" :label="$t('message.参数项')" width="250"></el-table-column>
                <el-table-column prop="ref_value" :label="$t('message.参数值')" width="150">
                    <template slot-scope="scope">
                        <div>
                            <el-input v-if="scope.row.param_code == 'DAY_OFFSET'" :placeholder="$t('message.请输入内容')" size="small" v-model="scope.row.ref_value"></el-input>
                            <el-time-select v-model="scope.row.ref_value" :picker-options="{step: '00:15', start: '00:00', end: '23:45'}" placeholder="选择时间" v-if="(scope.row.param_code == 'SUNRIZE') || (scope.row.param_code == 'SUNSET')"></el-time-select>
                            <el-switch v-model="stateLT_L1" v-if="(scope.row.param_code == 'LT_L1')"></el-switch>
                            <el-switch v-model="stateLT_R1" v-if="(scope.row.param_code == 'LT_R1')"></el-switch>
                            <el-switch v-model="stateLT_L2" v-if="(scope.row.param_code == 'LT_L2')"></el-switch>
                            <el-switch v-model="stateLT_R2" v-if="(scope.row.param_code == 'LT_R2')"></el-switch>
                            <el-switch v-model="stateLT_L3" v-if="(scope.row.param_code == 'LT_L3')"></el-switch>
                            <el-switch v-model="stateLT_R3" v-if="(scope.row.param_code == 'LT_R3')"></el-switch>
                            <el-switch v-model="stateLT_L4" v-if="(scope.row.param_code == 'LT_L4')"></el-switch>
                            <el-switch v-model="stateLT_R4" v-if="(scope.row.param_code == 'LT_R4')"></el-switch>
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
    .light-tit {text-align: center;font-size: 14px;}
    .light-tit_spe {margin-top: 0;}
    .isloading {padding-bottom: 100px;}
    .btn-float {float: right;margin-top: -2px;}
</style>
<script>
    import axios from 'axios';
    import aCard from "../common/Acard"
    import {switchTimeToShow,switchTimeToSubmit,minuteToTime,timeToMinute} from "../../assets/tools/tool.js"
    export default {
        data() {
            return {
                fullscreenLoading: false,  // 是否显示loading条
                seedling_light_dig: [],
                originData: [],
                currentLightNum: 0,   // 正在编辑哪组灯
                tableDataLight: [],   // 显示在表格中的条目
                cacheDataLight: [],   // 缓存条目
                dialogVisible: false,
                stateLT_L1: false,
                stateLT_L2: false,
                stateLT_L3: false,
                stateLT_L4: false,
                stateLT_R1: false,
                stateLT_R2: false,
                stateLT_R3: false,
                stateLT_R4: false,
                renderComponent: true,
                
            };
        },
        computed: {
            apiurl() {
                return this.$store.state.apiurl;
            },
            operateNo() {
                return this.$store.state.user.operateNo;
            },
            op_id() {
                return this.$store.state.user.userId;
            },
            tableData() {
                return [{title: "第四层",index: 4}, {title: "第三层",index: 3}, {title: "第二层",index: 2},{title: "第一层",index: 1}]
            },
            runInfo() {
                return this.$store.state.runInfo;
            },
            show_seedling_light_dig() {
                return this.seedling_light_dig;
            },
            planInfo() {
                return this.$store.state.currentPlanInfo;
            },
            SUNRIZE() {
                return  this.planInfo.curStage.stage_content.length ? (this.minuteToTime(this.planInfo.curStage.stage_content[0].SUNRIZE) || null) : null;
            },
            SUNSET() {
                return this.planInfo.curStage.stage_content.length ? (this.minuteToTime(this.planInfo.curStage.stage_content[0].SUNSET) || null) : null;
            },
        },
        methods: {
            // 工具函数
            minuteToTime,
            setValueFromParam(arrList,param_code,newData) {
                let arr = arrList.filter(item => item["param_code"] == param_code);
                arr[0].value = newData;
            },
            // 获取育苗所有指示灯状态
            async getReadLight() {
                this.fullscreenLoading = true;
                let seedling_light_dig = [];
                seedling_light_dig.push(await this.getLight(1));
                seedling_light_dig.push(await this.getLight(2));
                seedling_light_dig.push(await this.getLight(3));
                this.seedling_light_dig = seedling_light_dig;
                this.fullscreenLoading = false;
            },
            // 育苗获取第num组指示灯状态
            getLight(n) {
                let _this = this;
                return new Promise(resolve => {
                    axios({
                        method: 'post',
                        url: `${this.apiurl}/la/device/param/read`,
                        data: {
                            data: { 
                                operateNo: this.operateNo,
                                op_id: this.op_id,
                                op_type: "OP_LT_SDL_CALL_SET",     
                                dev_id: n
                          }
                        }
                    }).then(data=> {
                        if(data.data.code == 200) {
                            if(data.data.data) {
                                this.originData.push(data.data.data);
                                let ord = data.data.data.item;
                                let arr = ord.map(item => item.value);
                                let base = arr.splice(0,3);
                                let rc = base[1];
                                let rl = base[2];
                                _this.valueRc = this.minuteToTime(rc);
                                _this.valueRl = this.minuteToTime(rl);
                                arr = arr.map(item => item == 1);
                                resolve(arr);
                            } else {
                                resolve([])
                            }
                        } else {
                            resolve([])
                        }
                    });
                });
            },
            beforeWrite(n) {
                let _this = this;
                return new Promise(resolve => {
                    axios({
                        method: 'post',
                        url: `${this.apiurl}/la/device/param/read`,
                        data: {
                            data: { 
                                operateNo: this.operateNo,
                                op_id: this.op_id,
                                op_type: "OP_LT_SDL_CALL_SET",     
                                dev_id: n
                          }
                        }
                    }).then(data=> {
                        if(data.data.code == 200) {
                            if(data.data.data) {
                                resolve(data.data.data);
                            } else {
                                resolve(undefined)
                            }
                        } else {
                            resolve(undefined)
                        }
                    });
                });
            },
            // 修改育苗第num组指示灯状态
            changeLight(num) {
                this.$confirm(this.$t('message.是否修改照明灯开关？'), this.$t('message.提示'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('message.确定'),
                    cancelButtonText: this.$t('message.取消'),
                }).then(async ()=> {
                    // 获取dev_id
                    let dev_id = num + 1;
                    let or = await this.beforeWrite(num + 1);
                    if(or) {
                        let {item,item_num,dev_id} = or;
                        // 获取4组植物灯状态
                        let LT_L1 = this.show_seedling_light_dig[num][0] ? 1 : 0;
                        let LT_L2 = this.show_seedling_light_dig[num][1] ? 1 : 0;
                        let LT_L3 = this.show_seedling_light_dig[num][2] ? 1 : 0;
                        let LT_L4 = this.show_seedling_light_dig[num][3] ? 1 : 0;
                        let LT_R1 = this.show_seedling_light_dig[num][4] ? 1 : 0;
                        let LT_R2 = this.show_seedling_light_dig[num][5] ? 1 : 0;
                        let LT_R3 = this.show_seedling_light_dig[num][6] ? 1 : 0;
                        let LT_R4 = this.show_seedling_light_dig[num][7] ? 1 : 0;
                        // 构建基础数据
                        this.setValueFromParam(item,"LT_L1",LT_L1);
                        this.setValueFromParam(item,"LT_L2",LT_L2);
                        this.setValueFromParam(item,"LT_L3",LT_L3);
                        this.setValueFromParam(item,"LT_L4",LT_L4);
                        this.setValueFromParam(item,"LT_R1",LT_R1);
                        this.setValueFromParam(item,"LT_R2",LT_R2);
                        this.setValueFromParam(item,"LT_R3",LT_R3);
                        this.setValueFromParam(item,"LT_R4",LT_R4);
                        if(this.SUNSET) {
                            this.setValueFromParam(item,"SUNSET",timeToMinute(this.SUNSET));
                        }
                        if(this.SUNRIZE) {
                            this.setValueFromParam(item,"SUNRIZE",timeToMinute(this.SUNRIZE));
                        }
                        
                        let data = {
                            operateNo: this.operateNo,
                            op_id: this.op_id,
                            op_type: "OP_LT_SDL_SET_SET",
                            dev_id: Number(dev_id),
                            item_num,
                            item
                        }
                        // 调用接口
                        axios({
                            method: 'post',
                            url: `${this.apiurl}/la/device/param/write`,
                            data: {
                                data 
                            }
                        }).then(data=> {
                            if(data.data.code == 200) {
                                this.$store.commit("changeOpOnoff",true);
                            }
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: "数据读取异常！"
                        });
                    }
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
                        case "LT_L1":
                            item.name = "一层左侧开关";
                            if(item.value === 1) {
                               this.stateLT_L1 = true;
                            }
                        break;
                        case "LT_R1":
                            item.name = "一层右侧开关";
                            if(item.value === 1) {
                               this.stateLT_R1 = true;
                            }
                        break;
                        case "LT_L2":
                            item.name = "二层左侧开关";
                            if(item.value === 1) {
                               this.stateLT_L2 = true;
                            }
                        break;
                        case "LT_L3":
                            item.name = "三层左侧开关";
                            if(item.value === 1) {
                               this.stateLT_L3 = true;
                            }
                        break;
                        case "LT_L4":
                            item.name = "四层左侧开关";
                            if(item.value === 1) {
                               this.stateLT_L4 = true;
                            }
                        break;
                        
                        case "LT_R2":
                            item.name = "二层右侧开关";
                            if(item.value === 1) {
                               this.stateLT_R2 = true;
                            }
                        break;
                        case "LT_R3":
                            item.name = "三层右侧开关";
                            if(item.value === 1) {
                               this.stateLT_R3 = true;
                            }
                        break;
                        case "LT_R4":
                            item.name = "四层右侧开关";
                            if(item.value === 1) {
                               this.stateLT_R4 = true;
                            }
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
                                op_type: "OP_LT_SDL_CALL_SET",     
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
                this.setValueFromParam(this.cacheDataLight,"LT_L1",this.stateLT_L1 ? 1 : 0);
                this.setValueFromParam(this.cacheDataLight,"LT_L2",this.stateLT_L2 ? 1 : 0);
                this.setValueFromParam(this.cacheDataLight,"LT_L3",this.stateLT_L3 ? 1 : 0);
                this.setValueFromParam(this.cacheDataLight,"LT_L4",this.stateLT_L4 ? 1 : 0);
                this.setValueFromParam(this.cacheDataLight,"LT_R1",this.stateLT_R1 ? 1 : 0);
                this.setValueFromParam(this.cacheDataLight,"LT_R2",this.stateLT_R2 ? 1 : 0);
                this.setValueFromParam(this.cacheDataLight,"LT_R3",this.stateLT_R3 ? 1 : 0);
                this.setValueFromParam(this.cacheDataLight,"LT_R4",this.stateLT_R4 ? 1 : 0);
                
                axios({
                    method: 'post',
                    url: `${this.apiurl}/la/device/param/write`,
                    data: {
                        data: {
                            item:[...this.cacheDataLight],
                            operateNo: this.operateNo,
                            op_id: this.op_id,
                            op_type : "OP_LT_SDL_SET_SET",
                            dev_id: Number(this.currentLightNum),
                            item_num: 11,
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
        },
        components: {
            aCard
        },
        mounted() {
            this.getReadLight();
        }
    }
</script>