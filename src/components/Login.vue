<template>
    <el-dialog :visible="true" :close-on-click-modal="false" :show-close="false" :title="$t('message.登录')" width="403px" center :modal-append-to-body="isModel">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-width="labelWidth">
        <!-- 输入用户名/电话 start -->
        <el-form-item :label="$t('message.用户名/电话')" prop="account"><el-input v-model="ruleForm.account" size="small"></el-input></el-form-item>
        <!-- 输入用户名/电话 end -->
        <!-- 输入密码 start -->
        <el-form-item :label="$t('message.密码')" prop="password"><el-input v-model="ruleForm.password" size="small" show-password></el-input></el-form-item>
        <!-- 输入密码 end -->
      </el-form>
      <!-- 登录按钮 start -->
      <div slot="footer"><el-button type="primary" @click="handleSubmit('ruleForm')" size="small">{{$t("message.登录")}}</el-button></div>
      <!-- 登录按钮 end -->
    </el-dialog>
</template>
<script>
  import md5 from "md5"
  import {login,getBigUserInfo} from "../store/ajax"
  import {envMixin} from "@/components/mixins/envMix"
  export default {
    data() {
      return {
        isModel: false,
        ruleForm: {
          account: "",
          password: ""
        },
        rules: {
          account: [{required: true, message: this.$t("message.请输入用户名或电话"), trigger: 'blur'}],
          password: [{required: true, message: this.$t("message.请输入密码"),trigger: 'blur'}]
        }
      }
    },
    mixins: [envMixin],
    computed: {
      // 用户身份
      userInfo() {return this.$store.state.userInfo},
      labelWidth() {return this.i18n == "zh" ? "100px" : "160px"}
    },
    methods: {
      // 登录
      handleSubmit(formName) {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            // 得到用户名、手机号、密码
            let data = {
              account: this.ruleForm.account,
              phone: this.ruleForm.account,
              password: md5(this.ruleForm.password)
            };
            // 用户名为手机号时，将用户名设置为空，否则将手机号清空
            /^1\d{10}$/.test(this.account) ? delete data.account : delete data.phone;
            // 登录
            let res = await login(data);
            if(res) {
              let [token,userId,operateNo,role] = [res.token,res.id, this.ruleForm.account,res.role];
              this.cblogin({token,userId,operateNo,role});
            } else {
              this.$message({
                type: 'error',
                message: this.$t("message.登录失败")
              });
            }
          }
        });
        },
        // 登录回调
        async cblogin({token,userId,operateNo,role}) {
          if(this.isWeb) {
            let res = await getBigUserInfo(userId);
            if(res.code == 200){
              this.$store.commit("updateUserInfo",res.data.userInfo);
              this.$store.commit("updateUFactoryInfo",role == "1" ? {} : res.data.factoryInfo);
              this.$message({
                type: 'success',
                message: this.$t("message.登录成功")
              });
              window.location.reload();
            } else {
              this.$message({
                type: 'error',
                message: res.data
              });
            }
          } else {
            let json = {
              id : userId,
              account: operateNo,
              role
            }
            if(Number(role) == 1) {
              this.$message({
                type: 'error',
                message: this.$t("message.登录失败")
              });
            } else {
              this.$store.commit("updateUserInfo",json);
              this.$message({
                type: 'success',
                message: this.$t("message.登录成功")
              });
              window.location.reload();
            }
          }
        }
    }
  }
</script>