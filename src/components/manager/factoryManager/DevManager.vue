<template>
    <div class="ym-main">
        <a-card class="card-pd">
            <!-- 标题 start -->
            <PageHeader :title="factoryInfo.factory_name + '设备列表'"></PageHeader>
            <!-- 标题 end -->
            <div class="space-btm1">
                <SearchBox :placeholder="$t('message.请输入设备编号')" @search="toSearch" />
            </div>
            <!-- 设备列表 start -->
            <el-table :data="tableData" border stripe size="small">
                <el-table-column prop="instance_number" :label="$t('message.设备编号')"></el-table-column>
                <el-table-column prop="description" :label="$t('message.设备备注')"></el-table-column>
                <el-table-column prop="room_name" :label="$t('message.种植间名称')"></el-table-column>
            </el-table>
            <!-- 设备列表 end -->
        </a-card>
    </div>
</template>
<script>
    import {get_device_param_list} from '../../../store/ajax'
    import {globalUserEnter} from '../../../assets/tools/tool.js'
    export default {
        data() {
            return {
                tableData: [],
                searchText: "",
            }
        },
        computed: {
            factoryInfo() {return this.$store.state.userInfo.factory},
            factory_id() {
                if(this.factoryInfo && this.factoryInfo.factory_id) {
                    return this.factoryInfo.factory_id;
                }
            }
        },
        methods: {
            // 搜索种植间
            toSearch(data) {
                this.searchText = data;
                this.getDev(data);
            },
            async getDev(d="") {
                this.searchText = d;
                let res = await get_device_param_list({
                    instance_number: this.searchText,
                    factory_id: this.factory_id,
                    searchText: this.searchText
                });
                this.tableData = res;
            },
        },
        async mounted() {
           await globalUserEnter();
           this.getDev();
        }
    }
</script>