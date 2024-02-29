<!-- 
  组件说明： 本组件为查看阶段页面。
  进入方式： 操作员登录后点击导航栏"方案管理"后在任一条目下点击"查看阶段"按钮进入。
  用户权限： 操作员可以使用。
-->
<template>
    <div class="ym-main">
        <!-- 本地版编号 start -->
        <slot name="dev_no" v-if="!isWeb"></slot>
        <slot name="current_pos" v-if="isWeb"></slot>
        <!-- 本地版编号 end -->
        <a-card class="card-pd">
            <!-- 头部标题 start -->
            <PageHeader :title="$t('message.查看阶段')" goBack=true></PageHeader>
            <!-- 头部标题 end -->
            <!-- 导出excel start -->
            <el-button type="primary" size="small" @click="downloadExl" :disabled="!!!tableData.length" class="space-btm" v-if="!isMobile && !editMode">{{$t('message.导出excel')}}</el-button>
            <!-- 导出excel end -->
            <!-- 导出excel start -->
            <label v-if="!isMobile && editMode"><span class="nmbtn">{{$t('message.导入excel')}}</span><input type="file" @change="importExcel" class="hide"></label>
            <!-- 导出excel end -->
            <!-- 插入阶段 start -->
            <el-button v-if="editMode" type="primary" size="small" class="space-btm space-left" @click="addStage">{{$t('message.插入阶段')}}</el-button>
            <!-- 插入阶段 end -->
            <!-- 数据表格 start -->
            <el-table ref="multipleTable" :data="tableData" border size="small" empty-text class="space-btm">
                <el-table-column size="small" v-for="item,key in colList" :width="key==0 ? 340 : 'auto'" :key="key" :prop="item.prop" :label="item.label">
                    <template slot-scope="scope">
                        <span v-if="!editMode">{{scope.row[item.prop]}}</span>
                        <div v-else>
                            <el-input v-model="scope.row[item.prop]" :class="{miniIpt: item.prop === 'stage_name'}" :placeholder="$t('message.请输入内容')" size="small"></el-input>
                            <el-button size="small" v-if="item.prop === 'stage_name'" type="danger" class="space-left" @click="delStage(scope.row)">{{$t('message.删除')}}</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 数据表格 end -->
            <!-- 编辑按钮 start -->
            <el-button type="primary" size="small" @click="handleEdit" v-if="!editMode">{{$t('message.编辑')}}</el-button>
            <el-button type="info" size="small" @click="handleExitEdit" v-if="editMode">{{$t('message.退出')}}</el-button>
            <el-button type="success" size="small" @click="save" v-if="editMode">{{$t('message.保存')}}</el-button>
            <!-- 编辑按钮 end -->
        </a-card>
    </div>
</template>
<style scoped>
    .nmbtn {padding: 9px 15px; font-size: 12px; display: inline-block; line-height: 1;  cursor: pointer; background: #e6a23c; border: 1px solid #e6a23c; color: #FFF;  transition: .1s; user-select: none; border-radius: 4px;}
    .nmbtn:hover { border-color: #ebb563; background-color: #ebb563; }
    .hide {display: none;}
    .miniIpt {width: 220px;}
    .space-left {margin-left: 8px}
</style>
<script>
    import * as XLSX from "XLSX"
    import download from "../../assets/tools/downloadExcel"
    import {minuteToTime,timeToMinute} from "../../assets/tools/tool.js"
    import {get_plant,save_stage} from "../../store/ajax.js"
    import projectJson from "../../config/project/config"
    let {isWeb} = projectJson;
    export default {
        data() {
            return {
                id: 0,
                scheme_name: "",
                tableData: [],
                originTableData: [],
                editMode: false
            }
        },
        computed: {
            colList() {
                return [{
                    prop: "stage_name",
                    label: this.$t('message.阶段名称'),
                },{
                    prop: "DAY_OFFSET",
                    label: this.$t('message.天数'),
                },{
                    prop: "EC_TV",
                    label: 'EC',
                },{
                    prop: "PH_TV",
                    label: "PH",
                },{
                    prop: "SUNRIZE",
                    label: this.$t('message.日出时间'),
                },{
                    prop: "SUNSET",
                    label: this.$t('message.日落时间'),
                },{
                    prop: "TEMP_DAY",
                    label: this.$t('message.日间温度'),
                },{
                    prop: "TEMP_NIGHT",
                    label: this.$t('message.夜间温度'),
                },{
                    prop: "HUM_DAY",
                    label: this.$t('message.日间湿度'),
                },{
                    prop: "HUM_NIGHT",
                    label: this.$t('message.夜间湿度'),
                },{
                    prop: "CO2",
                    label: this.$t('message.CO2浓度'),
                },{
                    prop: "LIQ_TEMP",
                    label: this.$t('message.营养液温度'),
                }];
            },
            isMobile() {return this.$store.state.isMobile},
            isWeb() {return isWeb}
        },
        methods: {
            // 获取数据
            async getList() {
                this.tableData = [];
                let res = await get_plant(this.id);
                if(res) {
                    res.stage_item.forEach(item => {
                        const itm = {id: item.id,...item.stage_content[0]};
                        itm.SUNRIZE = minuteToTime(itm.SUNRIZE);
                        itm.SUNSET = minuteToTime(itm.SUNSET);
                        this.tableData.push(itm);
                    });
                }
                this.originTableData = JSON.parse(JSON.stringify(this.tableData));
            },
            // 导出eccel
            downloadExl() {
                let baseJson = {
                    [this.$t('message.阶段名称')] : "阶段名称",
                    [this.$t('message.天数')] : "DAY_OFFSET",
                    "EC" : "EC_TV",
                    "PH" : "PH_TV",
                    [this.$t('message.日出时间')] :"SUNRIZE",
                    [this.$t('message.日落时间')] : "SUNSET",
                    [this.$t('message.日间温度')] : "TEMP_DAY",
                    [this.$t('message.夜间温度')] : "TEMP_NIGHT",
                    [this.$t('message.日间湿度')] : "HUM_DAY",
                    [this.$t('message.夜间湿度')] : "HUM_NIGHT",
                    [this.$t('message.CO2浓度')] : "CO2",
                    [this.$t('message.营养液温度')] : "LIQ_TEMP"
                };
                let result = this.tableData.map(item => {
                    const nodataText="--";
                    let {stage_name,DAY_OFFSET,EC_TV,PH_TV,SUNRIZE,SUNSET,TEMP_DAY,TEMP_NIGHT,HUM_DAY,HUM_NIGHT,CO2,LIQ_TEMP} = item;
                    return {
                        [this.$t('message.阶段名称')] : stage_name || nodataText,
                        [this.$t('message.天数')] : DAY_OFFSET || nodataText,
                        "EC" : EC_TV || nodataText,
                        "PH" : PH_TV || nodataText,
                        [this.$t('message.日出时间')] : SUNRIZE || nodataText,
                        [this.$t('message.日落时间')] : SUNSET || nodataText,
                        [this.$t('message.日间温度')] : TEMP_DAY || nodataText,
                        [this.$t('message.夜间温度')] : TEMP_NIGHT || nodataText,
                        [this.$t('message.日间湿度')] : HUM_DAY || nodataText,
                        [this.$t('message.夜间湿度')] : HUM_NIGHT || nodataText,
                        [this.$t('message.CO2浓度')] : CO2 || nodataText,
                        [this.$t('message.营养液温度')] : LIQ_TEMP || nodataText
                    }
                });
                result.unshift(baseJson);
                download(result, this.scheme_name +' Scheme Stage List.xlsx');
            },
            // 点击编辑按钮
            handleEdit() {
                this.editMode = true;
            },
            // 退出编辑
            handleExitEdit() {
                this.$confirm(this.$t('message.确认退出编辑？'), this.$t('message.确认信息'), {
                  distinguishCancelAndClose: true,
                  confirmButtonText: this.$t('message.确认'),
                  cancelButtonText: this.$t('message.取消')
                }).then(()=> {
                    this.editMode = false;
                    this.tableData = this.originTableData;
                });
            },
            // 添加阶段
            addStage() {
                this.tableData.push({
                    id: "",
                    DAY_OFFSET: "",
                    EC_TV: "",
                    PH_TV: "",
                    SUNRIZE: "",
                    SUNSET: "",
                    TEMP_DAY: "",
                    TEMP_NIGHT: "",
                    HUM_DAY: "",
                    HUM_NIGHT: "",
                    CO2: "",
                    LIQ_TEMP: "",
                });
            },
            // 删除阶段
            delStage(d) {
                this.tableData.splice(this.tableData.findIndex(item => item.id === d.id),1);
            },
            // 保存阶段
            save() {
                if(!this.tableData.every(item => item.stage_name)) {
                    this.$message.error(this.$t('message.保存失败，阶段名称不能为空值！'));
                    return;
                } 
                this.$confirm(this.$t('message.确认保存此次修改？'), this.$t('message.确认信息'), {
                  distinguishCancelAndClose: true,
                  confirmButtonText: this.$t('message.确认'),
                  cancelButtonText: this.$t('message.取消')
                }).then(async ()=> {
                    let stage_item = [];
                    let tempData = JSON.parse(JSON.stringify(this.tableData));
                    tempData.forEach((item,key) => {
                        item.SUNRIZE = String(timeToMinute(item.SUNRIZE));
                        item.SUNSET = String(timeToMinute(item.SUNSET));
                        stage_item.push({
                            sort_index: key + 1,
                            remark: `stage${key + 1}`,
                            plant_id: Number(this.id),
                            id: item.id,
                            stage_content: [item]
                        })
                    });
                    let json = {
                        plant_id: this.id,
                        stage_item
                    };
                    let res = await save_stage(json);
                    if(res) {
                        this.$message({
                          type: 'success',
                          message: this.$t('message.修改成功')
                        });
                        this.editMode = false;
                        this.getList();
                    }
                })
            },
            // 导入excel
            importExcel(e) {
                let _this = this;
                let file = e.target.files[0];
                if(!/sheet/.test(file.type)) {
                    this.$message({
                      type: 'error',
                      message: this.$t('message.文件类型不正确')
                    });
                    return;
                }
                this.$confirm(this.$t('message.确认导入该文件（导入文件后原有的阶段都会被清空）？'), this.$t('message.确认信息'), {
                  distinguishCancelAndClose: true,
                  confirmButtonText: this.$t('message.确认'),
                  cancelButtonText: this.$t('message.取消')
                }).then(()=> {
                    const fileReader = new FileReader();
                    fileReader.readAsBinaryString(file);
                    let _this = this;
                    fileReader.onload = async (event) => {
                        try {
                            const { result } = event.target;
                            const workbook = XLSX.read(result, { type: 'binary' });
                            let data = [];
                            for (const sheet in workbook.Sheets) {
                                if (workbook.Sheets.hasOwnProperty(sheet)) {
                                    data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                                }
                            }
                            let plant_id = String(_this.id);
                            data.shift();
                            let stage_item = data.map((item,key)=> {
                                let id = "";
                                let remark = "";
                                let sort_index = key + 1;
                                item["日出时间"] = String(timeToMinute(item["日出时间"]))
                                item["日落时间"] = String(timeToMinute(item["日落时间"]))
                                return {
                                    id,
                                    plant_id,
                                    remark,
                                    sort_index,
                                    stage_content: [{
                                        CO2: item["CO2浓度"],
                                        DAY_OFFSET: item["天数"],
                                        EC_TV: item["EC"],
                                        HUM_DAY: item["日间湿度"],
                                        HUM_NIGHT: item["夜间湿度"],
                                        LIQ_TEMP: item["营养液温度"],
                                        PH_TV: item["PH"],
                                        SUNRIZE: item["日出时间"],
                                        SUNSET: item["日落时间"],
                                        TEMP_DAY: item["日间温度"],
                                        TEMP_NIGHT: item["夜间温度"],
                                        stage_name: item["阶段名称"]
                                    }]
                                }
                            });
                            let res = await save_stage({
                                plant_id,
                                stage_item
                            });
                            if(res) {
                                this.$message({
                                  type: 'success',
                                  message: this.$t('message.导入成功')
                                });
                                this.editMode = false;
                                this.getList();
                                e.target.value="";
                            }
                        } catch(e) {
                            this.$message({
                              type: 'error',
                              message: _this.$t('message.导入失败')
                            });
                        }
                    }
                });
            }
        },
        mounted() {
            this.id = this.$route.query.id;
            this.scheme_name = this.$route.query.scheme_name;
            this.getList();
        },
    }
</script>