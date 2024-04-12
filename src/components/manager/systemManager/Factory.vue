<template>
    <div class="ym-main">
        <a-card class="card-pd">
            <!-- 标题 start -->
            <PageHeader :title="$t('message.工厂管理')" goBack=false></PageHeader>
            <!-- 标题 end -->
            <!-- 搜索 start -->
            <div class="space-btm1">
                <SearchBox :placeholder="$t('message.请输入工厂名称')" @search="toSearch" />
                <el-button type="primary" size="small" @click="handleEditFac">{{$t('message.新增工厂')}}</el-button>
            </div>
            <!-- 搜索 end -->
            <!-- 工厂列表 start -->
            <el-table :data="tableData" border stripe size="small">
              <el-table-column prop="factory_name" :label="$t('message.工厂名称')"></el-table-column>
              <el-table-column prop="factory_num" :label="$t('message.工厂编号')"></el-table-column>
              <el-table-column prop="factory_desc" :label="$t('message.描述')"></el-table-column>
              <el-table-column prop="enterprise_name" :label="$t('message.客户名称')"></el-table-column>
              <el-table-column prop="admin" :label="$t('message.管理员账号')"></el-table-column>
              <el-table-column fixed="right" :label="$t('message.操作')" width="150">
                  <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="handleEditFac(scope.row)">{{$t('message.编辑')}}</el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope.row)">{{$t('message.删除')}}</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <!-- 工厂列表 end -->
            <!-- 创建/编辑弹层  start -->
            <el-dialog :title="layerTitle" :close-on-click-modal="false" :show-close="false" :visible.sync="dialogVisibleSee" width="400px">
                <el-form ref="r" :model="r" label-width="100px" size="mini" modal="true" :rules="rules">
                    <el-form-item :label="$t('message.工厂名称')" prop="factory_name"><el-input v-model="r.factory_name"></el-input></el-form-item>
                    <el-form-item :label="$t('message.工厂编号')" prop="factory_num"><el-input v-model="r.factory_num"></el-input></el-form-item>
                    <el-form-item :label="$t('message.绑定客户')" prop="enterprise_id">
                        <el-select v-model="r.enterprise_id">
                            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option> 
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('message.备注')" prop="factory_desc"><el-input  v-model="r.factory_desc"></el-input></el-form-item>
                    <el-form-item> 
                        <el-button @click="resetForm('r')">{{$t('message.取消')}}</el-button>
                        <el-button type="primary" @click="submitForm('r')">{{$t('message.确定')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 创建/编辑弹层  end -->
        </a-card>
    </div>
</template>
<script>
    import {getDataFactoryList,getDataEnterList,getOneFactoryInfo,getUserRoleList,createFactory,updateFactory,deleteFactory} from '../../../store/ajax'
    export default {
        data() {
            return {
                searchText: "",
                tableData: [],
                dialogVisibleSee: false,
                options: [],
                options1: [],
                t: "",
                layerTitle: "",
                r: {
                    factory_id: "",
                    factory_num: "",
                    factory_name: "",
                    factory_desc: "",
                    enterprise_id: "",
                },
                rules: {
                    factory_name: [{ required: true, message: this.$t('message.请输入工厂名称'), trigger: 'blur' }],
                    factory_num: [{ required: true, message: this.$t('message.请输入工厂编号'), trigger: 'blur' }],
                    enterprise_id: [{ required: true, message: this.$t('message.请选择企业'), trigger: 'change'}],
                }
            }
        },
        methods: {
             // 获取工厂列表
            async getFactorList() {
                let arr = await getDataFactoryList(this.searchText);
                if(arr.length) {
                    arr = arr.map(item => {
                        return {
                            factory_id: item.id,
                            factory_name: item.factory_name,
                            enterprise_name: item.enterprise_name,
                            factory_desc: item.factory_desc,
                            admin: item.admin,
                            factory_num: item.factory_num
                        }
                    })
                    this.tableData = arr;
                } else {
                    this.tableData = [];
                }
            },
            // 搜索工厂
            toSearch(data) {
                this.searchText = data;
                this.getFactorList();
            },
            // 点击新建工厂/编辑
            handleEditFac(row) {
                if(row.factory_id) {
                    this.layerTitle = this.$t('message.编辑工厂');
                } else {
                    this.layerTitle = this.$t('message.新增工厂');
                }
                this.getEnterList(row ? row.factory_id : 0);
                row.factory_id && this.getOneData(row.factory_id);
                this.dialogVisibleSee = true;
            },
            // 获取某个工厂信息
            async getOneData(factory_id) {
                let res = await getOneFactoryInfo(factory_id);
                if(res && res.length) {
                    let {enterprise_id,factory_name,factory_desc,factory_num} = res[0];
                    this.r.factory_id = factory_id;
                    this.r.factory_name = factory_name;
                    this.r.factory_num = factory_num;
                    this.r.enterprise_id = enterprise_id;
                    this.r.factory_desc = factory_desc;
                }
            },
            // 获取企业列表
            async getEnterList(id) {
                let arr 
                if(id) {
                    arr = await getDataEnterList("",1,id);
                } else {
                    arr = await getDataEnterList("",1);
                }
                arr.length && (this.options = arr.map(item => ({id: item.id, name: item.enterprise_name})));
            },
            // 获取企业管理员列表
            async getAdminList() {
                let res = await getUserRoleList({
                    factory_id: 0,
                    room_id: 0,
                    role: 2
                });
                res.length && (this.options1 = res.map(item => ({id: item.id, account: item.account})));
            },
            // 确定修改
            submitForm(formName) {
                this.$refs[formName].validate( async valid => {
                    if(valid) {
                        let res = this.r.factory_id ? await updateFactory({
                            factory_id: this.r.factory_id,
                            factory_name: this.r.factory_name,
                            factory_num: this.r.factory_num,
                            enterprise_id: this.r.enterprise_id,
                            factory_desc: this.r.factory_desc,
                        }) : await createFactory({
                            factory_name: this.r.factory_name,
                            factory_num: this.r.factory_num,
                            enterprise_id: this.r.enterprise_id,
                            factory_desc: this.r.factory_desc,
                        });
                        let {code,message} = res;
                        if(code !== 200) {
                            this.$message({
                              type: 'error',
                              message
                            });
                        } else {
                            this.resetForm();
                            this.getFactorList();
                        }
                    }
                })
            },
            // 重置修改
            resetForm(formName) {
                formName && this.$refs[formName].resetFields();
                this.dialogVisibleSee = false;
                this.r.factory_id = 0;
                this.r.factory_name = "";
                this.r.enterprise_id = "";
                this.r.factory_num = "";
                this.r.factory_desc = "",
                this.r.admin_id = "";
            },
            // 点击删除按钮
            handleDelete(row) {
                this.$confirm(this.$t("message.确认删除当前工厂？"), this.$t("message.确认信息"), {
                  distinguishCancelAndClose: true,
                  confirmButtonText: this.$t("message.确认"),
                  cancelButtonText: this.$t("message.取消")
                }).then(async () => {
                    let {code,message} = await deleteFactory(row.factory_id)
                    if(code == 200) {
                        this.$message({
                          type: 'success',
                          message: this.$t("message.删除成功")
                        });
                        this.getFactorList();
                    } else {
                        this.$message({
                          type: 'error',
                          message
                        });
                    }
                })
            }
        },
        mounted() {
            this.getFactorList();
        }
    }
</script>