<template>
    <a-card>
        <div v-if="plantDigInfo.length" v-for="k in 10" :key="k">
            <div v-if="plantDigInfo[k - 1]" class="space-btm1">
                <!-- 头部标题区 start -->
                <h5 class="light-tit">{{$t("message.第")}} {{k}} {{$t("message.组植物灯")}} <ToOp /></h5>
                <!-- 头部标题区 end -->
                <el-row type="flex" class="space-btm" justify="space-between">
                    <div>
                        <span class="btn-space">{{$t("message.开关1")}}：<el-switch disabled v-model="plantDigInfo[k - 1][0].value == 0 ? false : true"></el-switch></span>
                        <span class="btn-space">{{$t("message.开关2")}}：<el-switch disabled v-model="plantDigInfo[k - 1][1].value == 0 ? false : true"></el-switch></span>
                        <span class="btn-space">{{$t("message.开关3")}}：<el-switch disabled v-model="plantDigInfo[k - 1][2].value == 0 ? false : true"></el-switch></span>
                        
                    </div>
                    <div>
                        <span class="btn-space">{{$t("message.温度")}}：{{lightInfo1[k-1][11]}}</span>
                        <span class="btn-space">{{$t("message.湿度")}}：{{lightInfo1[k-1][12]}}</span>
                        <span>CO2：{{lightInfo1[k-1][13]}}</span>
                    </div>
                </el-row>
                <!-- 主体区域 start -->
                <el-table ref="multipleTable" :data="tableData[k - 1]" size="small" border>
                    <el-table-column prop="title" :label="$t('message.序号')"></el-table-column>
                    <el-table-column prop="white" :label="$t('message.白光亮度')">
                        <template slot-scope="scope">
                            <span>{{scope.row.white}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="red" :label="$t('message.红光亮度')">
                        <template slot-scope="scope">
                            <span>{{scope.row.red}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 主体区域 end -->
            </div>
        </div>
        <el-empty v-if="!plantDigInfo.length"></el-empty>
    </a-card>
        <!-- 种植植物灯开关 end -->
</template>
<script>
    import {runInfoMixin} from "../mixins/runinfo"
    import ToOp from "./ToOp"
    export default {
        mixins: [runInfoMixin],
        computed: {
            lightInfo1() {
                return Object.values(this.runInfo.light_ana).map(item => {
                    if(item["item"]) {
                        return item["item"].map(it => it.value)
                    } else {
                        return [];
                    }
                })
            },
            tableData() {
                let arr = [];
                arr.length = 10;
                for(let i=0;i<10;i++) {
                    arr[i] = [{
                        index: 1,
                        title: this.$t('message.灯1'),
                        red: this.lightInfo1[i].length ? this.lightInfo1[i][4] : '--',
                        white: this.lightInfo1[i].length ? this.lightInfo1[i][0] : '--'
                    },{
                        index: 2,
                        title: this.$t('message.灯2'),
                        red: this.lightInfo1[i].length ? this.lightInfo1[i][5] : '--',
                        white: this.lightInfo1[i].length ? this.lightInfo1[i][1] : '--'
                    },{
                        index: 3,
                        title: this.$t('message.灯3'),
                        red: this.lightInfo1[i].length ? this.lightInfo1[i][6] : '--',
                        white: this.lightInfo1[i].length ? this.lightInfo1[i][2] : '--'
                    },{
                        index: 4,
                        title: this.$t('message.灯4'),
                        red: this.lightInfo1[i].length ? this.lightInfo1[i][7] : '--',
                        white: this.lightInfo1[i].length ? this.lightInfo1[i][3] : '--'
                    }]
                }
                return arr;
            },
            // 种植开关信息
            plantDigInfo() {return this.$store.state.plant_dig}
        },
        components: {
            ToOp
        },
    }
</script>