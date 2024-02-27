<template>
    <div>
        <el-dropdown @command="handleCommand" trigger="click" class="btn-setting">
            <span class="el-dropdown-link"><i class="el-icon-setting user-icon"></i></span>
            <el-dropdown-menu slot="dropdown">
                <!-- 修改密码 start -->
                <el-dropdown-item command="cpwd" v-if="userInfo.id">{{$t("message.修改密码")}}</el-dropdown-item>
                <!-- 修改密码 end -->
                <!-- 退出 start -->
                <el-dropdown-item command="logout" v-if="userInfo.id">{{$t("message.退出")}}</el-dropdown-item>
                <!-- 退出 end -->
            </el-dropdown-menu>
        </el-dropdown>
        <!-- 修改密码弹层 start -->
        <toUpdatePwd :centerDialogVisible="centerDialogVisible" @closeCenterDialogVisible="closeCenterDialogVisible" @toLogOut="toLogOut" />
        <!-- 修改密码 end -->
    </div>
</template>
<style scoped>
    .btn-setting {font-size: 28px; color: #FFF;cursor: pointer;margin-right: 18px;}
</style>
<script>
    import {logout} from "../../../assets/tools/tool"
    import toUpdatePwd from "./updatePwd"
    export default {
        data() {
            return {
                centerDialogVisible: false  // 是否显示修改密码弹层
            }
        },
        computed: {
             userInfo() {return this.$store.state.userInfo.user},
        },
        components: {
            toUpdatePwd
        },
        methods: {
            // 点击齿轮按钮
            handleCommand(command) {
                // 修改密码
                if(command == "cpwd") {
                    this.centerDialogVisible = true;
                }
                // 点击退出登录按钮
                if(command == "logout") {
                    logout();
                }
            },
            // 修改密码层
            closeCenterDialogVisible() {
                this.centerDialogVisible = false;
            },
            // 修改密码成功后回调
            toLogOut() {
                logout(() => {
                    this.$message({
                      type: 'success',
                      message: "密码修改成功，请重新登录！"
                    });
                })
            }
        }
    }
</script>