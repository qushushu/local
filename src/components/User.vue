<!-- 
  组件说明：本组件为系统管理员登录后展示的管理用户组件。
  进入方式：系统管理员登录后自动跳转至该页面。
  用户权限：只有系统管理员方可查看，其他用户（或登录用户）进入此页后将自动跳转至首页。
-->
<template>
    <div class="ym-main">
        <a-card class="card-pd">
            <!-- 标题 start -->
            <PageHeader title="用户管理" goBack=false></PageHeader>
            <!-- 标题 end -->
            <!-- 创建用户 start -->
            <div class="space-btm1">
                <el-button type="primary" size="small" @click="showCreateUser">创建用户</el-button>
            </div>
            <!-- 创建用户 end -->
            <!-- 用户表格 start -->
            <el-table :data="tableData" border stripe size="small" tooltip-effect="dark"> 
                <el-table-column prop="id" label="id" width="40"> </el-table-column>
                <el-table-column prop="account" label="用户名"> </el-table-column>
                <el-table-column prop="role" label="身份" width="74"> </el-table-column>
                <el-table-column prop="phone" label="电话"> </el-table-column>
                <el-table-column prop="email" label="email"> </el-table-column>
                <el-table-column label="操作" width="150">
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="getOneUser(scope.row)">修改</el-button>
                    <el-button size="mini" type="danger" v-if="scope.row.role == '普通用户'" @click="delUser(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <!-- 用户表格 end -->
            <!-- 创建用户层 start -->
            <el-dialog title="创建用户" :width="autoDialogWidth" :visible.sync="dialogVisible">
                <el-form ref="r" :model="r" label-width="80px" size="mini" modal="true" :rules="rules">
                    <el-form-item label="用户名" prop="account"><el-input v-model="r.account"></el-input></el-form-item>
                    <el-form-item label="密码" prop="password"><el-input v-model="r.password" show-password></el-input></el-form-item>
                    <el-form-item label="电话" prop="phone"><el-input v-model="r.phone"></el-input></el-form-item>
                     <el-form-item label="email" prop="email"><el-input v-model="r.email"></el-input></el-form-item>
                    <el-form-item> 
                        <el-button @click="resetCreateUser('r')">取 消</el-button>
                        <el-button type="primary" @click="submitCreateUser('r')">确 定</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 创建用户层 end -->
            <!-- 编辑用户层 start -->
            <el-dialog title="编辑用户" :width="autoDialogWidth" :visible.sync="dialogVisible1">
                <el-form ref="editCurrent" :model="editCurrent" label-width="80px" size="mini" modal="true" :rules="rules">
                    <el-form-item label="用户名" prop="account"><el-input v-model="editCurrent.account"></el-input></el-form-item>
                    <el-form-item label="密码" prop="password"><el-input v-model="editCurrent.password" show-password></el-input></el-form-item>
                    <el-form-item label="电话" prop="phone"><el-input v-model="editCurrent.phone"></el-input></el-form-item>
                     <el-form-item label="email" prop="email"><el-input v-model="editCurrent.email"></el-input></el-form-item>
                    <el-form-item> 
                        <el-button @click="resetEditUser('editCurrent')">取 消</el-button>
                        <el-button type="primary" @click="submitEditUser('editCurrent')">确 定</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 编辑用户层 end -->
        </a-card>
    </div>
</template>
<script>
    import PageHeader from "./common/PageHeader"
    import {autoJump} from "../assets/tools/tool"
    import axios from 'axios'
    import md5 from "md5"
    import aCard from "./common/Acard"
    export default {
        data() {
            return {
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
                    account: [{ required: true, message: '请输入用户名', trigger: 'change' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'change'}]
                },
                editCurrent: {
                    id: 0,
                    account: "",
                    password:"",
                    role: 1,
                    phone: "",
                    email:"",
                }
            }
        },
        components: {
            PageHeader,
            aCard
        },
        computed: {
            // 是否为移动端
            isMobile() {
                return this.$store.state.isMobile;
            },
            apiurl() {
                return this.$store.state.apiurl;
            },
            // 层大小
            autoDialogWidth() {
                return this.isMobile ? "303px" : "50%";
            }
        },
        methods: {
            // 获取所有用户
            getAllUser() {
                axios({
                    url: `${this.apiurl}/la/user/get_list`,
                    method: "post",
                    data: {
                        data: {}
                    }
                }).then(data => {
                    data.data.data = data.data.data.map(item => {
                        switch(item.role) {
                            case '1':
                                item.role = "普通用户"
                            break;
                            case '2':
                                item.role = "管理员"
                            break;
                        }
                        return item;
                    })
                    this.tableData = data.data.data;
                })
            },
            // 获取单一用户信息
            getOneUser({id}) {
                this.dialogVisible1 = true;
                let data = {
                    id
                }
                axios({
                    method: "post",
                    url: `${this.apiurl}/la/user/get`,
                    data: {
                        data
                    }
                }).then(data=> {
                    if(data.data.code === 200) {
                        this.editCurrent = data.data.data;
                    }
                });
            },
            // 显示创建用户层
            showCreateUser() {
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
                      message: '修改失败，用户名格式错误'
                    });
                    return; 
                }
                if(!this.isPwd(this.r.password)) {
                    this.$message({
                      type: 'error',
                      message: '修改失败，密码至少需要6位'
                    });
                    return; 
                }
                if(this.r.email && !this.isMail(this.r.email)) {
                    this.$message({
                      type: 'error',
                      message: '修改失败，email格式错误'
                    });
                    return; 
                }
                this.$refs[formName].validate(valid => {
                    if(valid) {
                        let data = {
                            account: this.r.account,
                            password: md5(this.r.password),
                            role: 1,
                            phone: this.r.phone,
                            email: this.r.email,
                        }
                        axios({
                            method: "post",
                            url: `${this.apiurl}/la/user/add`,
                            data: {
                                data
                            }
                        }).then(data=> {
                            if(data.data.code === 200) {
                                this.$message({
                                  type: 'success',
                                  message: '创建成功'
                                });
                                this.resetCreateUser(formName);
                                this.getAllUser();
                            }
                        })
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
            submitEditUser(formName) {
                if(!this.isUsername(this.editCurrent.account)) {
                    this.$message({
                      type: 'error',
                      message: '修改失败，用户名格式错误'
                    });
                    return; 
                }
                if(!this.isPwd(this.editCurrent.password)) {
                    this.$message({
                      type: 'error',
                      message: '修改失败，密码至少需要6位'
                    });
                    return; 
                }
                if(this.editCurrent.email && !this.isMail(this.editCurrent.email)) {
                    this.$message({
                      type: 'error',
                      message: '修改失败，email格式错误'
                    });
                    return; 
                }
                let data = {
                    id: this.editCurrent.id,
                    account: this.editCurrent.account,
                    password: md5(this.editCurrent.password),
                    role: 1,
                    phone: this.editCurrent.phone,
                    email: this.editCurrent.email,
                }
                let fixedJson = {
                     first_name: "11",
                     last_name: "21",
                     international_code: "86",
                     country_code: "cn"
                };
                data = {...data,...fixedJson};
                axios({
                    method: "post",
                    url: `${this.apiurl}/la/user/modify`,
                    data: {
                        data
                    }
                }).then(data=> {
                    if(data.data.code === 200) {
                        this.$message({
                          type: 'success',
                          message: '修改成功'
                        });
                        this.resetEditUser(formName);
                        this.getAllUser();
                    }
                })
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
                this.$confirm('确认删除该用户？', '确认信息', {
                  distinguishCancelAndClose: true,
                  confirmButtonText: '确认',
                  cancelButtonText: '取消'
                }).then(_=> {
                    axios({
                        method: "post",
                        url: `${this.apiurl}/la/user/delete`,
                        data: {
                            data: {
                                id
                            }
                        }
                    }).then(data => {
                        if(data.data.code === 200) {
                            this.$message({
                              type: 'success',
                              message: '删除成功'
                            });
                            this.getAllUser();
                        } else {
                            this.$message({
                              type: 'error',
                              message: '删除失败'
                            });
                        }
                    })
                })
            }
        },
        mounted() {
            this.getAllUser();
            autoJump(2);
        }
    }
</script>