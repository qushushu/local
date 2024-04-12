<template>
    <el-dropdown @command="handleCommand" trigger="click">
        <!-- 当前种植间名称 start -->
        <span class="el-dropdown-link">{{currentRoomInfo.room_name}}<i class="el-icon-arrow-down el-icon--right"></i></span>
        <!-- 当前种植间名称 end -->
        <!-- 切换种植间下拉 start -->
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="item.room_id" :key="item.room_id" v-for="item in room_list">{{item.room_name}}</el-dropdown-item>
        </el-dropdown-menu>
        <!-- 切换种植间下拉 end -->
    </el-dropdown>
</template>
<script>
    export default {
        computed: {
            // 种植间列表
            room_list() {return this.$store.state.userInfo.factory.rooms || []},
            // 当前种植间
            currentRoomInfo() {return this.$store.state.currentInfo.room}
        },
        methods: {
            handleCommand(roomId) {
                // 更新当前种植间信息
                let currentRoom = this.room_list.filter(item => item.room_id == roomId);
                this.$store.commit("updateCurrentRoomInfo",currentRoom.length ? currentRoom[0] : this.room_list[0]);
                // 跳转到card页面
                this.$route.name !== "Cards" && this.$router.replace('/Cards');
            }
        }
    }
</script>