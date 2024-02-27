<template>
    <div>
        <!-- 新增设备 start -->
        <div class="space-btm1">
            <SearchBox :placeholder="$t('message.请输入设备编号')" @search="getRoomDevices" />
            <el-button type="primary" size="small" @click="createDev">{{$t('message.新增设备')}}</el-button>
        </div>
        <!-- 新增设备 end -->
        <!-- 设备列表 start -->
        <el-table :data="tableData" border stripe size="small" tooltip-effect="dark">
            <el-table-column prop="instance_number" :label="$t('message.设备编号')"></el-table-column>
            <el-table-column prop="model" :label="$t('message.设备型号')"></el-table-column>
            <el-table-column prop="description" :label="$t('message.设备备注')"></el-table-column>
            <el-table-column fixed="right" :label="$t('message.操作')" width="260px">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="editDev(scope.$index, scope.row)">{{$t('message.编辑')}}</el-button>
                    <el-button type="danger" size="small" @click="devDev(scope.row)">{{$t('message.删除')}}</el-button>
                    <el-button size="small" @click="handleToParameterAdjustment(scope.$index, scope.row)">{{$t('message.参数')}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 设备列表 end -->
        <!-- 所有设备 start -->
        <p class="text-desc" v-if="userPower == 2">没有找到您新建的设备？ <router-link class="text-desc-link" to="/DevManager"> 点击这里 </router-link>查看全部设备</p>
        <!-- 所有设备 end -->
        <!-- 创建/编辑设备弹层 start -->
        <el-dialog :title="layerTitle" :visible.sync="dialogVisibleSee" width="400px">
            <el-form ref="r" :model="r" label-width="100px" size="mini" modal="true" :rules="rules">
                <el-form-item :label="$t('message.模板')" prop="model_code">
                    <el-select v-model="t" :placeholder="$t('message.模板')">   
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option> 
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('message.设备编号')"  prop="instance_number"><el-input v-model="r.instance_number"></el-input></el-form-item>
                <el-form-item :label="$t('message.描述')" prop="description"><el-input v-model="r.description"></el-input></el-form-item>
                <el-form-item :label="$t('message.设备地址')" prop="dev_inst_id"><el-input v-model="r.dev_inst_id"></el-input></el-form-item>
                <el-form-item> 
                    <el-button @click="resetForm('r')">{{$t('message.取消')}}</el-button>
                    <el-button type="primary" @click="submitForm('r')">{{$t('message.确定')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 创建/编辑设备弹层 end -->
    </div>
</template>
<style scoped>
    .text-desc {margin-top: 20px;color: ##606266;font-size: 12px;text-align: center;}
    .text-desc-link {color:#000;text-decoration: underline;}
</style>
<script>
    import {get_device_param_list,get_dev_model_list,add_dev,modify_dev,delete_dev} from '../../../../store/ajax'
    export default {
        data() {
            return {
                search_instance_numbers: "",    // 设备型号
                searchText: "",
                tableData: [],
                dialogVisibleSee: false,
                layerTitle: "",
                room_id: 0,
                modelList: [],
                r: {
                    id: 0,   // 设备id(数字的)
                    instance_number: "",  // 设备名称(字符串的)
                    dev_model_id: 0,   // 模板id(数字的)
                    model: "",    // 模板设备型号(字符串的)
                    model_code: "",    // 模板设备编号(字符串的)
                    description: "",   // 设备描述
                    dev_inst_id: "",  // 设备地址
                },
                t: "",
                options: [{
                    value: '',
                    label: ''
                }],
                rules: {
                    t: [{ required: true, message: this.$t('message.请选择模板'), trigger: 'blur' }],
                    instance_number: [{ required: true, message: this.$t('message.请输入设备编号'), trigger: 'change' }],
                    dev_inst_id: [{ required: true, message: this.$t('message.请输入设备地址'), trigger: 'change'}],
                }
            }
        },
        props: ["roomId"],
        computed: {
            factory_id() {
                if(this.$store.state.userInfo.factory.factory_id) {
                    return this.$store.state.userInfo.factory.factory_id;
                }
            },
            // 用户权限
            userPower() {return this.$store.state.userInfo.user.role},
        },
        watch: {
            roomId(d) {
                this.room_id = d;
                this.getRoomDevices();
            }
        },
        methods: {
            // 获取种植间的所有设备
            async getRoomDevices(d="") {
                this.search_instance_numbers = d;
                this.tableData = await get_device_param_list({
                    instance_number: this.search_instance_numbers,
                    factory_id: this.factory_id,
                    room_id: this.room_id,
                });
            },
            // 搜索种植间
            toSearch(data) {
                this.searchText = data;
                this.getRoomDevices();
            },
            // 创建设备
            async createDev() {
                this.layerTitle = this.$t('message.新增设备');
                await this.getDevModelList();
                this.dialogVisibleSee = true;
            },
            // 编辑设备
            async editDev(index,row) {
                this.layerTitle = this.$t('message.编辑设备');
                // 获取模板列表
                await this.getDevModelList();
                this.dialogVisibleSee = true;
                if(row) {
                    this.t = row.dev_model_id;
                    this.r.id = row.id;
                    this.r.instance_number = row.instance_number; 
                    this.r.dev_model_id = row.dev_model_id;
                    this.r.model = row.model;
                    this.r.model_code = row.model_code;
                    this.r.description = row.description;
                    this.r.create_time = row.create_time;
                    this.r.dev_inst_id = row.dev_inst_id;
                }
            },
            // 获取设备模板
            async getDevModelList() {
                this.modelList = await get_dev_model_list();
                this.options = this.modelList.map(item=> ({
                    value: item.id,
                    label: item.model_code
                }));
                return this.options;
            },
            // 提交创建/编辑
            async submitForm(formName) {
                this.$refs[formName].validate(async valid => {
                    if(valid) {
                        let {id,model,model_code,dev_inst_id} = this.getModelInfo(this.t)[0];
                        let json = {
                                instance_number: this.r.instance_number,
                                description: this.r.description,
                                dev_model_id: id,
                                model,
                                model_code,
                                dev_inst_id: this.r.dev_inst_id,
                                factory_id: this.factory_id,
                                room_id: this.room_id
                            }
                        let res,message
                        if(!this.r.id) {
                            res = await add_dev(json);
                            message = this.$t("message.添加成功");
                        } else {
                            json.id = this.r.id;
                            res = await modify_dev(json);
                            message = this.$t("message.修改成功");
                        }
                        this.$message({
                            type: 'success',
                            message
                        });
                        this.resetForm(formName);
                        this.getRoomDevices();
                    }
                })
            },
            getModelInfo(id) {
                return this.modelList.filter(item=> item.id === id);
            },
            // 重置弹窗
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.dialogVisibleSee = false;
                this.r.id = 0;
                this.r.instance_number = "";
                this.r.model = "";
                this.r.dev_model_id = 0;
                this.r.model_code = "";
                this.r.description = "";
                this.t = "";
                this.r.dev_inst_id = ""
            },
            // 删除设备
            async devDev(row) {
                 this.$confirm(this.$t("message.确认删除当前设备？"), this.$t("message.确认信息"), {
                  distinguishCancelAndClose: true,
                  confirmButtonText: this.$t("message.确认"),
                  cancelButtonText: this.$t("message.取消")
                }).then(async _=> {
                    let res = await delete_dev(row.id);
                    if(res) {
                        this.$message({
                          type: 'success',
                          message: this.$t("message.删除成功")
                        });
                        this.getRoomDevices();
                    }
                })
            },
            // 点击参数栏目
            async handleToParameterAdjustment(index,row) {
                let data = await this.getDevModelList();
                let dev_model_id = data.filter(item => (item.label === row.model_code));
                if(dev_model_id.length) {
                    let query = {
                        model_code: row.model_code,
                        instance_number: row.instance_number,
                        dev_inst_id: row.dev_inst_id,
                        dev_model_id: dev_model_id[0].value
                    }
                    this.$router.push({
                        path: "/ParameterAdjustment",
                        query
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: this.$t("message.数据错误，请联系管理员")
                    });
                }
            }
        },
        components: {
        },
        mounted() {
            this.getRoomDevices();
        }
    }
</script>