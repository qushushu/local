<template>
    <el-dropdown @command="handleCommand" trigger="click" class="toggle-lan">
        <span class="el-dropdown-link">{{$t("message.选择语言")}}<i class="el-icon-arrow-down el-icon--right"></i></span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="zh">中文</el-dropdown-item>
            <el-dropdown-item command="en">English</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>
<style scoped></style>
<script>
    export default {
        methods: {
            // 点击切换语言按钮
            handleCommand(command) {
                this.$i18n.locale = command;
                this.$store.commit("updateI18n",command);
                localStorage.locale = command;
                this.$emit("lan",command);
            }
        }
    }
</script>

