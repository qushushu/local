<!-- 
  组件说明：本组件为系统管理员登录后展示的管理用户组件。
  进入方式：系统管理员登录后自动跳转至该页面。
  用户权限：只有系统管理员方可查看，其他用户（或登录用户）进入此页后将自动跳转至首页。
-->
<template>
    <section class="main_box">
        <nav class="nav">
            <a href="javascript:;" :class="{current: item.room_id == curId}" v-for="item in roomList" @click="changeId(item)">{{item.room_name}}</a>
        </nav>
        <section class="section">
            <Room :rid="curId"></Room>
        </section>
    </section>
</template>
<script>
    import Room from "./Room"
    export default {
        data() {
            return {
               curId: 0
            }
        },
        components: {
            Room
        },
        computed: {
            roomList() {
                return (this.$store.state.userInfo.factory && this.$store.state.userInfo.factory.rooms) ? this.$store.state.userInfo.factory.rooms : [];
            }
        },
        watch: {
            roomList(d) {
                if(d.length) {
                    this.curId = d[0].room_id
                }
            }
        },
        methods: {
            changeId(item) {
                this.curId = item.room_id;
            }
        }
    }
</script>