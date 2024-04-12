<!-- 组件说明： 本组件用于登录后修改自己的密码模块 -->
<template>
    <div>
        <el-dialog :title="$t('message.修改密码')" :modal="true" :visible.sync="showDialog" :width="loginDialogWidth" center :show-close="false">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-width="labelWidth" style="z-index: 2007;">
            <el-form-item :label="$t('message.原密码')" prop="oldpassword">
                <el-input show-password v-model="ruleForm.oldpassword" size="small"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.输入密码')" prop="password">
                <el-input show-password v-model="ruleForm.password" size="small"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.确认密码')" prop="rpassword">
                <el-input show-password v-model="ruleForm.rpassword" size="small"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetPwdLayer('ruleForm')" size="small">{{$t('message.取消')}}</el-button>
            <el-button type="primary" @click="toUpdatePwd('ruleForm')" size="small">{{$t('message.确定')}}</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
    import md5 from "md5"
    import {password_modify} from "../../../store/ajax"
    import {envMixin} from "@/components/mixins/envMix"
    export default {
        data() {
            return {
                ruleForm: {
                    oldpassword: "",
                    password: "",
                    rpassword: ""
                },
                rules: {
                    oldpassword: [{ required: true, message: this.$t('message.原密码不能为空！'), trigger: 'blur'}],
                    password: [{ required: true, message: this.$t('message.请输入密码!'), trigger: 'blur'}],
                    rpassword: [{ required: true, message: this.$t('message.请确认密码!'), trigger: 'blur'}]
                }
            }
        },
        mixins: [envMixin],
        props: ["centerDialogVisible"],
        computed: {
            // 用户信息
            userId() {return this.$store.state.userInfo.user.id},
            // 层大小
            loginDialogWidth() {return this.isMobile ? "403px" : "50%"},
            // 是否显示层
            showDialog: {
                get() {return this.centerDialogVisible},
                set(){this.resetPwdLayer('ruleForm')}
            },
            labelWidth() {
               return this.i18n == 'zh' ? "100px" : "160px"
            }
        },
        methods: {
            resetFields(formName) {
                formName && this.$refs[formName].resetFields();
                this.ruleForm.oldpassword = "";
                this.ruleForm.password = "";
                this.ruleForm.rpassword = "";
            },
            toUpdatePwd(formName) {
                this.$refs[formName].validate(async valid => {
                    if (valid) {
                        if(this.ruleForm.password.length < 6 || this.ruleForm.length > 20) {
                            this.$message({
                                type: 'error',
                                message: this.$t('message.密码长度为6到20位')
                            });
                            return;
                        }
                        if(this.ruleForm.password !== this.ruleForm.rpassword) {
                            this.$message({
                                type: 'error',
                                message: this.$t('message.两次密码不一致')
                            });
                        } else {
                            let res = await password_modify({
                                oldpassword: md5(this.ruleForm.oldpassword),
                                userId: this.userId,
                                newPassword: md5(this.ruleForm.password)
                            });
                            if(res == "success") {
                                this.$message({
                                  type: 'success',
                                  message: this.$t('message.操作成功')
                                });
                                this.resetPwdLayer(formName);
                                setTimeout(()=> {this.$emit("toLogOut")},1000);
                            } else {
                                 this.$message({
                                  type: 'error',
                                  message: this.$t('message.原密码输入有误！')
                                });
                            }
                        }
                    }
                })
            },
            resetPwdLayer(formName) {
                this.$refs[formName].resetFields();
                this.$emit("closeCenterDialogVisible");
            }
        }
    }
</script>