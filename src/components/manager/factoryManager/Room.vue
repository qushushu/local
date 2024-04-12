<!-- 
  组件说明：本组件为系统管理员登录后展示的管理用户组件。
  进入方式：系统管理员登录后自动跳转至该页面。
  用户权限：只有系统管理员方可查看，其他用户（或登录用户）进入此页后将自动跳转至首页。
-->
<template>
    <div class="ym-main">
        <a-card class="card-pd">
            <!-- 标题 start -->
            <PageHeader :title="room_name" :goBack="showBack && (userPower == 2)"></PageHeader>
            <!-- 标题 end -->
            <el-tabs tab-position="top">
                <el-tab-pane :label="$t('message.设备管理')"><RoomDevice :roomId="room_id" /></el-tab-pane>
                <el-tab-pane :label="$t('message.成员管理')"><RoomMember :roomId="room_id" /></el-tab-pane>
            </el-tabs>
        </a-card>
    </div>
</template>
<script>
    import RoomMember from "./Room/RoomMember"
    import RoomDevice from "./Room/RoomDevice"
    import {getRoomList} from '../../../store/ajax'
    import {globalUserEnter} from '../../../assets/tools/tool.js'
    import {envMixin} from "@/components/mixins/envMix"
    export default {
        data() {
            return {
                searchText: "",
                room_name: "",
                room_id: 0,
                showBack:false,
                dataUser: [],
                value: []
            }
        },
        mixins: [envMixin],
        props: ["rid"],
        computed: {
            factory_id() {
                if(this.$store.state.userInfo.factory.factory_id) {
                    return this.$store.state.userInfo.factory.factory_id;
                }
            },
            // 用户权限
            userPower() {return this.$store.state.userInfo.user.role}
        },
        watch: {
            rid(id) {
                this.room_id = id;
            },
            room_id(id) {
                this.getRoomList();
            }
        },
        components: {
            RoomMember,
            RoomDevice,
        },
        methods: {
            goBack() {this.$router.back()},
            async getRoomList() {
                let res = await getRoomList({id: this.room_id});
                if(res.length) {this.room_name = res[0].room_name}
            }
        },
        async mounted() {
            let res = await globalUserEnter();
            if(this.$route.query && this.$route.query.rid) {
                this.room_id = this.$route.query.rid;
            } else {
                this.room_id = this.rid;
            }
            if(this.$route.query && this.$route.query.back && this.userPower == 2) {
                this.showBack = true;
            } 
            this.getRoomList();
        }
    }
</script>