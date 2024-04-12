<template>
    <div>
        <el-dropdown @command="handleCommand" trigger="click" class="btn-setting">
            <!-- 图标 start -->
            <span class="el-dropdown-link"><i class="el-icon-setting user-icon"></i></span>
            <!-- 图标 end -->
            <el-dropdown-menu slot="dropdown">
                <!-- 请求路径设置 start -->
                <el-dropdown-item command="setRequest" v-if="isMobile">{{$t("message.请求路径设置")}}</el-dropdown-item>
                <!-- 请求路径设置 end -->
                <!-- 修改密码 start -->
                <el-dropdown-item command="cpwd" v-if="userInfo.id">{{$t("message.修改密码")}}</el-dropdown-item>
                <!-- 修改密码 end -->
                <!-- 退出 start -->
                <el-dropdown-item command="logout" v-if="userInfo.id">{{$t("message.退出")}}</el-dropdown-item>
                <!-- 退出 end -->
            </el-dropdown-menu>
        </el-dropdown>
        <!-- 修改密码弹层 start -->
        <toUpdatePwd :centerDialogVisible="centerDialogVisible" @closeCenterDialogVisible="centerDialogVisible = false" @toLogOut="toLogOut" />
        <!-- 修改密码 end -->
        <!-- 设置请求路径 start -->
        <SetRequestPort :visible="requestDialogVisible" @hideVisible="requestDialogVisible=$event"></SetRequestPort>
        <!-- 设置请求路径 end -->
    </div>
</template>
<script>
    import {logout} from "../../../assets/tools/tool"
    import toUpdatePwd from "./updatePwd"
    import SetRequestPort from "./SetRequestPort"
    import {envMixin} from "@/components/mixins/envMix"
    export default {
        data() {
            return {
                centerDialogVisible: false,  // 是否显示修改密码弹层
                requestDialogVisible: false  // 设置请求路径层
            }
        },
        computed: {userInfo() {return this.$store.state.userInfo.user}},
        mixins: [envMixin],
        components: {
            toUpdatePwd,
            SetRequestPort
        },
        methods: {
            // 点击齿轮按钮
            handleCommand(command) {
                // 设置请求路径
                if(command == "setRequest") {
                    this.requestDialogVisible = true;
                }
                // 修改密码
                if(command == "cpwd") {this.centerDialogVisible = true;}
                // 点击退出登录按钮
                if(command == "logout") {logout()}
            },
            // 修改密码成功后回调
            toLogOut() {
                logout(() => {
                    this.$message({
                      type: 'success',
                      message: this.$t("message.密码修改成功，请重新登录")
                    });
                })
            }
        }
    }
</script>