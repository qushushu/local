<template>
    <a-card>
       <div v-if="lightInfo[0].length" class="space-btm_light">
            <card-header>
                {{$t("message.第1组植物灯")}} <ToOp />
            </card-header>
            <el-table :data="tableData" size="small" border>
                <el-table-column prop="title"></el-table-column>
                <el-table-column :label="$t('message.左侧')">
                    <template slot-scope="scope">{{$t("message.植物灯开关")}}：
                        <el-switch disabled="disabled" v-model="lightInfo[0][scope.row.index -1]"> </el-switch>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('message.右侧')">
                    <template slot-scope="scope">{{$t("message.植物灯开关")}}：
                        <el-switch disabled="disabled" v-model="lightInfo[0][scope.row.index + 3]"> </el-switch>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div v-if="lightInfo[1].length" class="space-btm_light">
            <card-header>
                {{$t("message.第2组植物灯")}} <ToOp />
            </card-header>
            <el-table :data="tableData" size="small" border>
                <el-table-column prop="title"></el-table-column>
                <el-table-column :label="$t('message.左侧')">
                    <template slot-scope="scope">{{$t("message.植物灯开关")}}：
                        <el-switch disabled="disabled" v-model="lightInfo[1][scope.row.index -1]"> </el-switch>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('message.右侧')">
                    <template slot-scope="scope">{{$t("message.植物灯开关")}}：
                        <el-switch disabled="disabled"  v-model="lightInfo[0][scope.row.index + 3]"> </el-switch>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div v-if="lightInfo[2].length" class="space-btm_light">
            <card-header>
                {{$t("message.第3组植物灯")}} <ToOp />
            </card-header>
            <el-table :data="tableData" size="small" border>
                <el-table-column prop="title"></el-table-column>
                <el-table-column :label="$t('message.左侧')">
                    <template slot-scope="scope">{{$t("message.植物灯开关")}}：
                        <el-switch disabled="disabled" v-model="lightInfo[2][scope.row.index -1]"> </el-switch>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('message.右侧')">
                    <template slot-scope="scope">{{$t("message.植物灯开关")}}：
                        <el-switch disabled="disabled" v-model="lightInfo[2][scope.row.index + 3]"> </el-switch>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </a-card>
</template>
<style scoped>
    .space-btm_light {margin-bottom: 30px;}
    >>>.card-header {border-bottom: 0;padding-bottom: 3px;}
</style>
<script>
     import ToOp from "./ToOp"
     export default {
        computed: {
            lightInfo() {
                let arr = [[],[],[]];
                let info = Object.values(this.$store.state.runInfo.light_dig);
                info.map((item,key) => {
                    if(item.item_num) {
                        arr[key] = item.item.map(i=> i.value == 1);
                    }
                })
                return arr;
            },
            tableData() {
                return [{title: this.$t('message.第四层'),index: 4}, {title: this.$t('message.第三层'),index: 3}, {title: this.$t('message.第二层'),index: 2},{title: this.$t('message.第一层'),index: 1}]
            }
        },
        components: {
            ToOp
        }
     }
</script>