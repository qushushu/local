<!-- 
  组件说明：本组件为系统管理员登录后展示的管理用户组件。
  进入方式：系统管理员登录后自动跳转至该页面。
  用户权限：只有系统管理员方可查看，其他用户（或登录用户）进入此页后将自动跳转至首页。
-->
<template>
    <div class="ym-main">
        <a-card class="card-pd">
            <!-- 标题 start -->
            <PageHeader :title="$t('message.用户管理')" goBack=false></PageHeader>
            <!-- 标题 end -->
            <!-- 创建用户 start -->
            <div class="space-btm1">
                <el-button type="primary" size="small" @click="showCreateUser">{{$t('message.创建用户')}}</el-button>
            </div>
            <!-- 创建用户 end -->
            <!-- 用户表格 start -->
            <el-table :data="tableData" border stripe size="small" tooltip-effect="dark"> 
                <el-table-column prop="account" :label="$t('message.用户名')"> </el-table-column>
                <el-table-column prop="role" :label="$t('message.身份')"> </el-table-column>
                <el-table-column prop="phone" :label="$t('message.电话')"> </el-table-column>
                <el-table-column prop="email" label="email"> </el-table-column>
                <el-table-column label="操作" width="270">
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="getOneUser(scope.row)">{{$t('message.修改')}}</el-button>
                    <el-button size="mini" type="danger" @click="delUser(scope.row)">{{$t('message.删除')}}</el-button>
                    <el-button size="mini" @click="resetUserPassword(scope.row)">{{$t('message.重置用户密码')}}</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <!-- 用户表格 end -->
            <!-- 创建用户层 start -->
            <el-dialog :title="$t('message.创建用户')" :width="autoDialogWidth" :visible.sync="dialogVisible">
                <el-form ref="r" :model="r" label-width="80px" size="mini" modal="true" :rules="rules">
                    <el-form-item :label="$t('message.用户名')" prop="account"><el-input v-model="r.account"></el-input></el-form-item>
                    <el-form-item :label="$t('message.密码')" prop="password"><el-input v-model="r.password" show-password></el-input></el-form-item>
                    <el-form-item :label="$t('message.电话')" prop="phone"><el-input v-model="r.phone"></el-input></el-form-item>
                    <el-form-item label="email" prop="email"><el-input v-model="r.email"></el-input></el-form-item>
                    <el-form-item :label="$t('message.身份')" prop="role">
                        <el-select v-model="r.role" size="small" :placeholder="$t('message.请选择')">
                            <el-option :disabled="item.disabled" v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </el-select>
                          <el-popover
                            placement="top-start"
                            title="身份说明"
                            width="200"
                            trigger="hover"
                            content="种植间管理员可以管理所在种植间；种植专家可以操作及查看设备运行状况；操作员只能查看设备运行状况">
                            <i class="el-icon-question"  slot="reference"></i>
                          </el-popover>
                    </el-form-item>
                    <el-form-item> 
                        <el-button @click="resetCreateUser('r')">{{$t('message.取消')}}</el-button>
                        <el-button type="primary" @click="submitCreateUser('r')">{{$t('message.确定')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 创建用户层 end -->
            <!-- 编辑用户层 start -->
            <el-dialog :title="$t('message.编辑用户')" :width="autoDialogWidth" :visible.sync="dialogVisible1">
                <el-form ref="editCurrent" :model="editCurrent" label-width="80px" size="mini" modal="true" :rules="rules1">
                    <el-form-item :label="$t('message.用户名')" prop="account"><el-input v-model="editCurrent.account"></el-input></el-form-item>
                    <el-form-item :label="$t('message.电话')" prop="phone"><el-input v-model="editCurrent.phone"></el-input></el-form-item>
                    <el-form-item label="email" prop="email"><el-input v-model="editCurrent.email"></el-input></el-form-item>
                    <el-form-item :label="$t('message.身份')">
                        <el-select :disabled="editCurrent.role == 2" v-model="editCurrent.role" size="small" :placeholder="$t('message.请选择')">
                            <el-option :disabled="item.disabled" v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                        </el-select>
                        <el-popover
                            placement="top-start"
                            title="身份说明"
                            width="200"
                            trigger="hover"
                            content="种植间管理员可以管理所在种植间；种植专家可以操作及查看设备运行状况；操作员只能查看设备运行状况">
                            <i class="el-icon-question"  slot="reference"></i>
                        </el-popover>
                    </el-form-item>
                    <el-form-item> 
                        <el-button @click="resetEditUser('editCurrent')">{{$t('message.取消')}}</el-button>
                        <el-button type="primary" @click="submitEditUser('editCurrent')">{{$t('message.确定')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 编辑用户层 end -->
        </a-card>
    </div>
</template>
<script>
    import md5 from "md5"
    import {getFactoryUserList,createManagerUser,resetManager,getUserInfo,modifyUser,deleteUser} from '../../../store/ajax'
    import {getPowerText,globalUserEnter} from '../../../assets/tools/tool.js'
    export default {
        data() {
            return {
                options: [{
                    value: "3",
                    label: getPowerText(3),
                },{
                    value: "4",
                    label: getPowerText(4),
                },{
                    value: "5",
                    label: getPowerText(5),
                }],
                tableData: [],
                dialogVisible: false,
                dialogVisible1: false,
                r: {
                    account: "",
                    password: "",
                    phone: "",
                    email: "",
                },
                rules: {
                    account: [{ required: true, message: this.$t('message.请输入用户名'), trigger: 'blur' }],
                    password: [{ required: true, message: this.$t('message.请输入密码'), trigger: 'blur'}],
                    role: [{ required: true, message: this.$t('message.请选择身份'), trigger: 'change'}]
                },
                rules1: {
                    account: [{ required: true, message: this.$t('message.请输入用户名'), trigger: 'blur' }],
                    role: [{ required: true, message: this.$t('message.请选择身份'), trigger: 'change'}]
                },
                editCurrent: {
                    id: 0,
                    account: "",
                    password:"",
                    role: "",
                    roleLabel: "",
                    phone: "",
                    email:""
                }
            }
        },
        components: {
        },
        computed: {
            // 是否为移动端
            isMobile() {
                return this.$store.state.isMobile;
            },
            // 层大小
            autoDialogWidth() {
                return this.isMobile ? "403px" : "50%";
            },
            factory_id() {
                if(this.$store.state.userInfo.factory.factory_id) {
                    return this.$store.state.userInfo.factory.factory_id;
                }
            }
        },
        watch: {
            factory_id() {
                this.getAllUser();
            }
        },
        methods: {
            // 获取所有用户
            async getAllUser() {
                if(this.factory_id) {
                    let res = await getFactoryUserList({factory_id: this.factory_id});
                    if(res && res.length) {
                        res = res.filter(item => {
                            return item.role != "2"
                        })
                        this.tableData = res.map(item => {
                            item.role = getPowerText(item.role);
                            return item;
                        });
                    }
                }
            },
            // 获取单一用户信息
            async getOneUser({id}) {
                this.dialogVisible1 = true;
                this.editCurrent = await getUserInfo(id);
                let {role} = this.editCurrent;
                this.editCurrent.roleLabel = getPowerText(role);
            },
            // 显示创建用户层
            showCreateUser() {
                this.r.account =  "";
                this.r.password= "";
                this.r.phone= "";
                this.r.email= "";
                this.dialogVisible = true;
            },
            // 用户名验证
            isUsername(str) {
                return str.length >= 1 && str.length < 16;
            },
            // 邮箱验证
            isMail(str) {
                let emailRe = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                return emailRe.test(str);
            },
            // 密码验证
            isPwd(str) {
                return str.length >= 6;
            },
            // 提交创建用户
            submitCreateUser(formName) {
                if(!this.isUsername(this.r.account)) {
                    this.$message({
                      type: 'error',
                      message: "用户名长度需在16位以内"
                    });
                    return; 
                }
                if(!this.isPwd(this.r.password)) {
                    this.$message({
                      type: 'error',
                      message: this.$t('message.修改失败，密码至少需要6位')
                    });
                    return; 
                }
                if(this.r.email && !this.isMail(this.r.email)) {
                    this.$message({
                      type: 'error',
                      message: this.$t('message.修改失败，email格式错误')
                    });
                    return; 
                }
                this.$refs[formName].validate(async valid => {
                    if(valid) {
                        let res = await createManagerUser({
                            account: this.r.account,
                            password: md5(this.r.password),
                            role: this.r.role,
                            phone: this.r.phone,
                            email: this.r.email,
                            factory_id: this.factory_id,
                        });
                        if(res.code == 200) {
                            this.$message({
                                type: 'success',
                                message: this.$t('message.创建成功')
                            });
                            this.resetCreateUser(formName);
                            this.getAllUser();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message
                            });
                        }
                    } else {
                        return false;
                    }
                })
            },
            // 重置创建用户
            resetCreateUser(formName) {
                this.$refs[formName].resetFields();
                this.dialogVisible = false;
                this.r.account = "";
                this.r.password = "";
                this.r.phone = "";
                this.r.email = "";
            },
            // 提交编辑用户
            async submitEditUser(formName) {
                if(!this.isUsername(this.editCurrent.account)) {
                    this.$message({
                      type: 'error',
                      message: "用户名长度需在16位以内"
                    });
                    return; 
                }
                if(this.editCurrent.email && !this.isMail(this.editCurrent.email)) {
                    this.$message({
                      type: 'error',
                      message: this.$t('message.修改失败，email格式错误')
                    });
                    return; 
                }
                let res = await modifyUser({
                    id: this.editCurrent.id,
                    account: this.editCurrent.account,
                    role: this.editCurrent.role,
                    phone: this.editCurrent.phone,
                    email: this.editCurrent.email,
                });
                if(res == "success") {
                    this.resetEditUser(formName);
                    this.getAllUser();
                } else {
                    this.$message({
                      type: 'error',
                      message: this.$t('message.更新失败，系统有同名用户')
                    });
                }
            },
            // 重置编辑用户
            resetEditUser(formName) {
                this.$refs[formName].resetFields();
                this.dialogVisible1 = false;
                this.editCurrent.account = "";
                this.editCurrent.password = "";
                this.editCurrent.role = 1;
                this.editCurrent.phone ="";
                this.editCurrent.email = "";
            },
            // 删除用户
            delUser({id}) {
                this.$confirm(this.$t('message.确认删除该用户？'), this.$t('message.确认信息'), {
                  distinguishCancelAndClose: true,
                  confirmButtonText: this.$t('message.确认'),
                  cancelButtonText: this.$t('message.取消')
                }).then(async _=> {
                    let res = await deleteUser(id);
                    if(res == "success") {
                        this.$message({
                          type: 'success',
                          message: this.$t('message.删除成功')
                        });
                        this.getAllUser();
                    } else {
                        this.$message({
                          type: 'error',
                          message: this.$t('message.删除失败')
                        });
                    }
                })
            },
            // 重置用户密码
            async resetUserPassword(row) {
                this.$confirm("确认重置密码（密码更变为'1234567'）?", this.$t('message.确认信息'), {
                  distinguishCancelAndClose: true,
                  confirmButtonText: this.$t('message.确认'),
                  cancelButtonText: this.$t('message.取消')
                }).then(async _=> {
                    let res = await resetManager(row.id,true);
                    if(res.code == 200) {
                        this.$message({
                          type: 'success',
                          message: this.$t('message.操作成功')
                        });
                    } else {
                        this.$message({
                          type: 'error',
                          message: this.$t('message.操作失败')
                        });
                    }
                })
            }
        },
        async mounted() {
            let res = await globalUserEnter();
            this.getAllUser();
        }
    }
</script>