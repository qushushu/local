<template>
    <div class="ym-main">
        <a-card class="card-pd">
            <!-- 标题 start -->
            <PageHeader :title="$t('message.客户管理')" goBack=false></PageHeader>
            <!-- 标题 end -->
            <!-- 创建客户 start -->
            <div class="space-btm1">
                <SearchBox :placeholder="$t('message.请输入企业名称')"  @search="toSearch" />
                <el-button type="primary" size="small" @click="handleEditEnterprise">{{$t('message.新增客户')}}</el-button>
            </div>
            <!-- 创建客户 end -->
            <!-- 客户表 start -->
            <el-table :data="tableData" border stripe size="small">
              <el-table-column prop="enterprise_name" :label="$t('message.企业名称')"></el-table-column>
              <el-table-column prop="enterprise_desc" :label="$t('message.企业备注')"></el-table-column>
              <el-table-column prop="account" :label="$t('message.企业管理员')"></el-table-column>
              <el-table-column prop="phone" :label="$t('message.电话')" v-if="!isMobile"></el-table-column>
              <el-table-column prop="email" label="email" v-if="!isMobile"></el-table-column>
              <el-table-column fixed="right" :label="$t('message.操作')" width="278px">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleEditEnterprise(scope.row)">{{$t('message.编辑')}}</el-button>
                    <el-button type="danger" size="mini" @click="handleDelete(scope.row)">{{$t('message.删除')}}</el-button>
                    <el-button type="default" size="small" @click="handleResetMan(scope.row)">{{$t('message.重置管理员密码')}}</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <!-- 客户表 end -->
            <!-- 新增客户弹窗 start -->
            <el-dialog :title="dtitle"  :close-on-click-modal="false" :show-close="false" :visible.sync="dialogVisibleSee" width="400px">
                <el-form ref="r" :model="r" label-width="100px" size="mini" modal="true" :rules="rules">
                    <el-form-item :label="$t('message.企业名称')" prop="enterprise_name"><el-input v-model="r.enterprise_name"></el-input></el-form-item>
                    <el-form-item :label="$t('message.企业备注')" prop="enterprise_desc"><el-input v-model="r.enterprise_desc"></el-input></el-form-item>
                    <el-form-item :label="$t('message.企业管理员')" prop="account"><el-input v-model="r.account"></el-input></el-form-item>
                    <el-form-item :label="$t('message.电话')" prop="phone"><el-input v-model="r.phone"></el-input></el-form-item>
                    <el-form-item label="email" prop="email"><el-input v-model="r.email"></el-input></el-form-item>
                    <el-form-item> 
                        <el-button @click="resetForm('r')">{{$t('message.取消')}}</el-button>
                        <el-button type="primary" @click="submitForm('r')">{{$t('message.确定')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 新增客户弹窗 end -->
        </a-card>
    </div>
</template>
<style scoped>
</style>
<script>
    import {getDataEnterList,getOneEnterInfo,createEnterprise,updateEnterprise,deleteEnterprise,resetManager} from '../../../store/ajax'
    import {envMixin} from "@/components/mixins/envMix"
    export default {
        data() {
            return {
                searchText: "",
                tableData: [],
                dialogVisibleSee: false,
                dtitle: "",
                r: {
                    id: 0,
                    enterprise_name: "",
                    enterprise_desc: "",
                    account: "",
                    phone: "",
                    email: "",
                },
                rules: {
                    enterprise_name: [{ required: true, message: this.$t('message.请输入企业名称'), trigger: 'blur'}],
                    account: [{ required: true, message: this.$t('message.请输入用户名'), trigger: 'blur' }]
                }
            }
        },
        mixins: [envMixin],
        methods: {
            // 获取客户列表
            async getEnterpriseList() {
                let arr = await getDataEnterList(this.searchText);
                if(arr.length) {
                    arr = arr.map(item => ({id: item.id, enterprise_name: item.enterprise_name, enterprise_desc: item.enterprise_desc,account: item.account,phone: item.phone,email: item.email}));
                    this.tableData = arr;
                } else {
                    this.tableData = [];
                }
            },
            // 搜索客户
            toSearch(data) {
                this.searchText = data;
                this.getEnterpriseList();
            },
            // 新增、编辑客户层
            handleEditEnterprise(row) {
                const id = parseInt(row.id);
                if(id) {
                    this.dtitle = this.$t('message.编辑客户')
                    this.getOneData(id);
                } else {
                    this.dtitle = this.$t('message.新增客户')
                }
                this.dialogVisibleSee = true;
            },
            // 查看客户信息
            async getOneData(id) {
                let data = await getOneEnterInfo(id);
                if(data.length) {
                    let {id,enterprise_name,enterprise_desc,account,email,phone} = data[0];
                    this.r.id = id;
                    this.r.enterprise_name = enterprise_name;
                    this.r.enterprise_desc = enterprise_desc;
                    this.r.account = account;
                    this.r.email = email;
                    this.r.phone = phone;
                }
            },
            // 确认新增、编辑客户
            submitForm(formName) {
                this.$refs[formName].validate(async (valid) => {
                  if (valid) {
                    let {enterprise_name,enterprise_desc,id,account,email,phone} = this.r;
                    try {
                        let {code,message} = id ? await updateEnterprise({id, enterprise_name, enterprise_desc,account,email,phone}) : await createEnterprise({enterprise_name, enterprise_desc,account,email,phone});
                        if(code !== 200) {
                            this.$message({
                              type: 'error',
                              message
                            });
                        } else {
                            this.resetForm();
                            this.getEnterpriseList();
                        }
                    } catch(err) {
                        console.log(err);
                    }
                  } else {
                    return false;
                  }
                });
            },
            // 重置修改
            resetForm(formName) {
                formName && this.$refs[formName].resetFields();
                this.dialogVisibleSee = false;
                this.r.id = 0;
                this.r.enterprise_name = "";
                this.r.enterprise_desc = "";
                this.r.account = "";
                this.r.email = "";
                this.r.phone = "";
            },
            // 删除客户
            handleDelete(row) {
                this.$confirm(this.$t("message.确认删除当前客户？"), this.$t("message.确认信息"), {
                  distinguishCancelAndClose: true,
                  confirmButtonText: this.$t("message.确认"),
                  cancelButtonText: this.$t("message.取消")
                }).then(async () => {
                    let {code} = await deleteEnterprise(row.id);
                    let results = code == 200 ? {
                        type: 'success',
                        message: this.$t("message.删除成功")
                    } : {
                        type: 'error',
                        message: this.$t("message.操作失败")
                    }
                    this.$message(results);
                    this.getEnterpriseList();
                })
            },
            // 重置管理员账号
            handleResetMan(row) {
                this.$confirm("确认重置当前管理密码（密码变更为'1234567'）？", this.$t("message.确认信息"), {
                  distinguishCancelAndClose: true,
                  confirmButtonText: this.$t("message.确认"),
                  cancelButtonText: this.$t("message.取消")
                }).then(async () => {
                    let res = await resetManager(row.id);
                    if(res.code == 200) {
                        this.$message({
                          type: 'success',
                          message: this.$t("message.操作成功")
                        });
                    } else {
                        this.$message({
                          type: 'error',
                          message: this.$t("message.操作失败")
                        });
                    }
                })
            }
        },
        mounted() {
            this.getEnterpriseList();
        }
    }
</script>