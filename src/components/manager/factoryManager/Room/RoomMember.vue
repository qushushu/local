<template>
    <el-form label-width="80px" size="mini" modal="true">
        <el-transfer :titles="[$t('message.本种植间成员'), $t('message.全部成员')]" v-model="value" :data="dataUser" class="space-btm1"></el-transfer>
        <el-form-item class="text-center"> 
            <el-button type="primary" @click="submitForm1('r')">{{$t('message.确定')}}</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
    import {getUserRoleList,getOneRommInfo,updateRoomMembers} from '../../../../store/ajax'
    export default {
        data() {
            return {
                dataUser: [],
                value: [],
            }
        },
        props: ["roomId"],
        computed: {
            factory_id() {
                if(this.$store.state.userInfo.factory.factory_id) {
                    return this.$store.state.userInfo.factory.factory_id;
                }
            }
        },
        watch: {
            roomId(id) {
                this.room_id = id;
                this.getOneData(this.roomId);
            }
        },
        methods: {
             // 获取所有用户
            async getAllUser() {
                let res = await getUserRoleList({
                    factory_id: this.factory_id,
                    workers: 1
                });
                if(res && res.length) {
                    res = res.map(item => ({
                        key: item.id,
                        label: item.account,
                        disabled: false
                    }));
                    this.dataUser = res;
                    this.value = res.map(item => item.key);
                }
            },
            // 提交成员设置
            async submitForm1(formName) {
                let res = await updateRoomMembers({
                    member_ids: this.getYuData(this.dataUser,this.value).join(","),
                    id: this.roomId
                });
                if(res.code == 200) {
                    this.$message({
                      type: 'success',
                      message: this.$t('message.设置成功')
                    });
                    this.getOneData(this.roomId)
                }
            },
            // 获取单个种植单元信息
            async getOneData(id) {
                let res = await getOneRommInfo(id);
                if(res && res.length) {
                    let {member_ids} = res[0];
                    await this.getAllUser();
                    this.value = this.getYuData(this.dataUser,member_ids.map(item=> item.id));
                }
            },
            // 成员分类
            getYuData(arr1,arr2) {
                let s_val = [];
                let tarr = arr1.map(i => i.key);
                tarr.forEach(item=> {
                    if(!arr2.includes(item)) {
                        s_val.push(item);
                    }
                });
                return s_val;
            }
        },
        async mounted() {
            await this.getOneData(this.roomId);
        }
    }
</script>