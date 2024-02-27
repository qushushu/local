<template>
    <el-dropdown @command="handleCommand" trigger="click">
        <span class="el-dropdown-link">{{currentRoomInfo.room_name}}<i class="el-icon-arrow-down el-icon--right"></i></span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="item.room_id" :key="item.room_id" v-for="item in room_list">{{item.room_name}}</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>
<script>
    export default {
        computed: {
            room_list() {return this.$store.state.userInfo.factory.rooms || []},
            currentRoomInfo() {return this.$store.state.currentInfo.room}
        },
        methods: {
            handleCommand(roomId) {
                let cr = this.room_list.filter(item => item.room_id == roomId);
                this.$store.commit("updateCurrentRoomInfo",cr.length ? cr[0] : this.room_list[0]);
                if(this.$route.name !== "Cards") {
                    this.$router.replace('/Cards');
                }
            }
        }
    }
</script>