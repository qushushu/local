<template>
    <router-link v-if="userInfo.role == 4" to="/Operation" style="color: #808695 !important;margin-right: 5px;">
        <i class="el-icon-edit"></i>
    </router-link>
</template>
<script>
    export default {
        computed: {
            // 用户信息
            userInfo() {return this.$store.state.userInfo.user}
        }
    }
</script>