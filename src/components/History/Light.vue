<!-- 
  组件说明： 本组件为历史记录中植物灯历史组件。
-->
<template>
    <div>
        <div class="btn-mode-toggle" v-if="!isPlant && !isMobile">
            <el-button :type="mode == 'table' ? 'primary' : 'default'" size="small" @click="mode='table'">{{$t('message.表格')}}</el-button>
            <el-button :type="mode == 'chart' ? 'primary' : 'default'" size="small" @click="mode='chart'">{{$t('message.图表')}}</el-button>
        </div>
        <div v-show="mode=='table'">
            <el-table ref="multipleTable" :data="lightTable" border stripe size="small" tooltip-effect="dark" style="margin-top: 20px;" :empty-text="$t('message.暂无数据')" v-if="!isPlant"> 
                <el-table-column prop="time" :label="$t('message.时间')" width="143" align="center"> </el-table-column>
                <el-table-column :label="$t('message.第一组植物灯')" align="center"> 
                    <el-table-column :label="$t('message.一层左侧')" prop="LT1_L1">
                         <template slot-scope="scope">
                            <div v-if="scope.row.LT1_L1 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT1_L1 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.一层右侧')" prop="LT1_R1">
                         <template slot-scope="scope">
                            <div v-if="scope.row.LT1_R1 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT1_R1 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.二层左侧')" prop="LT1_L2">
                         <template slot-scope="scope">
                            <div v-if="scope.row.LT1_L2 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT1_L2 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.二层右侧')" prop="LT1_R2">
                         <template slot-scope="scope">
                            <div v-if="scope.row.LT1_R2 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT1_R2 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.三层左侧')" prop="LT1_L3">
                         <template slot-scope="scope">
                            <div v-if="scope.row.LT1_L3 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT1_L3 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.三层右侧')" prop="LT1_R3">
                         <template slot-scope="scope">
                            <div v-if="scope.row.LT1_R3 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT1_R3 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.四层左侧')" prop="LT1_L4">
                         <template slot-scope="scope">
                            <div v-if="scope.row.LT1_L4 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT1_L4 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.四层右侧')" prop="LT1_R4">
                         <template slot-scope="scope">
                            <div v-if="scope.row.LT1_R4 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT1_R4 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column :label="$t('message.第二组植物灯')" align="center"> 
                    <el-table-column :label="$t('message.一层左侧')" prop="LT2_L1">
                        <template slot-scope="scope">
                            <div v-if="scope.row.LT2_L1 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT2_L1 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.一层右侧')" prop="LT2_R1">
                        <template slot-scope="scope">
                            <div v-if="scope.row.LT2_R1 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT2_R1 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.二层左侧')" prop="LT2_L2">
                        <template slot-scope="scope">
                            <div v-if="scope.row.LT2_L2 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT2_L2 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.二层右侧')" prop="LT2_R2">
                        <template slot-scope="scope">
                            <div v-if="scope.row.LT2_R2 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT2_R2 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.三层左侧')" prop="LT2_L3">
                        <template slot-scope="scope">
                            <div v-if="scope.row.LT2_L3 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT2_L3 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.三层右侧')" prop="LT2_R3">
                        <template slot-scope="scope">
                            <div v-if="scope.row.LT2_R3 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT2_R3 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.四层左侧')" prop="LT2_L4">
                        <template slot-scope="scope">
                            <div v-if="scope.row.LT2_L4 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT2_L4 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.四层右侧')" prop="LT2_R4">
                        <template slot-scope="scope">
                            <div v-if="scope.row.LT2_R4 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT2_R4 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column :label="$t('message.第三组植物灯')" align="center"> 
                    <el-table-column :label="$t('message.一层左侧')" prop="LT3_L1">
                        <template slot-scope="scope">
                            <div v-if="scope.row.LT3_L1 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT3_L1 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.一层右侧')" prop="LT3_R1">
                        <template slot-scope="scope">
                            <div v-if="scope.row.LT3_R1 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT3_R1 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.二层左侧')" prop="LT3_L2">
                        <template slot-scope="scope">
                            <div v-if="scope.row.LT3_L2 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT3_L2 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.二层右侧')" prop="LT3_R2">
                        <template slot-scope="scope">
                            <div v-if="scope.row.LT3_R2 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT3_R2 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.三层左侧')" prop="LT3_L3">
                        <template slot-scope="scope">
                            <div v-if="scope.row.LT3_L3 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT3_L3 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.三层右侧')" prop="LT3_R3">
                        <template slot-scope="scope">
                            <div v-if="scope.row.LT3_R3 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT3_R3 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.四层左侧')" prop="LT3_L4">
                        <template slot-scope="scope">
                            <div v-if="scope.row.LT3_L4 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT3_L4 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.四层右侧')" prop="LT3_R4">
                        <template slot-scope="scope">
                            <div v-if="scope.row.LT3_R4 =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row.LT3_R4 == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>


            <el-table ref="multipleTable" :data="lightTable1" border stripe size="small"tooltip-effect="dark" style="margin-top: 20px;" :empty-text="$t('message.暂无数据')" v-if="isPlant"> 
                <el-table-column prop="time" :label="$t('message.时间')" width="143" align="center"> </el-table-column>
                <el-table-column v-for="item in 10" :key="item" :label="'第' + item + '组植物灯'" align="center"> 
                    <el-table-column label="一层" :prop="'LT_'+ item +'_1'">
                         <template slot-scope="scope">
                            <div v-if="scope.row['LT_'+item+'_1'] =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row['LT_'+item+'_1'] == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="二层" :prop="'LT_'+ item +'_2'">
                         <template slot-scope="scope">
                            <div v-if="scope.row['LT_'+item+'_2'] =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row['LT__'+item+'_2'] == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="三层" :prop="'LT_'+ item +'_3'">
                         <template slot-scope="scope">
                            <div v-if="scope.row['LT_'+item+'_3'] =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row['LT_'+item+'3'] == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="四层" :prop="'LT_'+ item +'_4'">
                         <template slot-scope="scope">
                            <div v-if="scope.row['LT_'+item+'_4'] =='1'" class="text-success"> {{$t('message.开')}} </div>
                            <div v-if="scope.row['LT_'+item+'_4'] == '0'" class="text-fail"> {{$t('message.关')}} </div>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>

            <Pagination light="total_light > 0" :page-index="page_light" :total="total_light" :page-size="rows" @change="pageChange_light"> </Pagination>
        </div>
        <div v-show="mode=='chart'" style="padding-top: 30px;">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :label="$t('message.第一组植物灯')" name="light1">
                    <a-row type="flex">
                         <a-col justify="space-between" :span="12"><div id="L1G1L" class="line-chart" style="width: 100%;"></div></a-col>
                         <a-col justify="space-between" :span="12"><div id="L1G1R" class="line-chart" style="width: 100%;"></div></a-col>
                    </a-row>
                    <a-row type="flex">
                         <a-col justify="space-between" :span="12"><div id="L1G2L" class="line-chart" style="width: 100%;"></div></a-col>
                         <a-col justify="space-between" :span="12"><div id="L1G2R" class="line-chart" style="width: 100%;"></div></a-col>
                    </a-row>
                    <a-row type="flex">
                         <a-col justify="space-between" :span="12"><div id="L1G3L" class="line-chart" style="width: 100%;"></div></a-col>
                         <a-col justify="space-between" :span="12"><div id="L1G3R" class="line-chart" style="width: 100%;"></div></a-col>
                    </a-row>
                    <a-row type="flex">
                         <a-col justify="space-between" :span="12"><div id="L1G4L" class="line-chart" style="width: 100%;"></div></a-col>
                         <a-col justify="space-between" :span="12"><div id="L1G4R" class="line-chart" style="width: 100%;"></div></a-col>
                    </a-row>
                </el-tab-pane>
                <el-tab-pane :label="$t('message.第二组植物灯')" name="light2">
                    <a-row type="flex">
                         <a-col justify="space-between" :span="12"><div id="L2G1L" class="line-chart" style="width: 100%;"></div></a-col>
                         <a-col justify="space-between" :span="12"><div id="L2G1R" class="line-chart" style="width: 100%;"></div></a-col>
                    </a-row>
                    <a-row type="flex">
                         <a-col justify="space-between" :span="12"><div id="L2G2L" class="line-chart" style="width: 100%;"></div></a-col>
                         <a-col justify="space-between" :span="12"><div id="L2G2R" class="line-chart" style="width: 100%;"></div></a-col>
                    </a-row>
                    <a-row type="flex">
                         <a-col justify="space-between" :span="12"><div id="L2G3L" class="line-chart" style="width: 100%;"></div></a-col>
                         <a-col justify="space-between" :span="12"><div id="L2G3R" class="line-chart" style="width: 100%;"></div></a-col>
                    </a-row>
                    <a-row type="flex">
                         <a-col justify="space-between" :span="12"><div id="L2G4L" class="line-chart" style="width: 100%;"></div></a-col>
                         <a-col justify="space-between" :span="12"><div id="L2G4R" class="line-chart" style="width: 100%;"></div></a-col>
                    </a-row>
                </el-tab-pane>
                <el-tab-pane :label="$t('message.第三组植物灯')" name="light3">
                    <a-row type="flex">
                         <a-col justify="space-between" :span="12"><div id="L3G1L" class="line-chart" style="width: 100%;"></div></a-col>
                         <a-col justify="space-between" :span="12"><div id="L3G1R" class="line-chart" style="width: 100%;"></div></a-col>
                    </a-row>
                    <a-row type="flex">
                         <a-col justify="space-between" :span="12"><div id="L3G2L" class="line-chart" style="width: 100%;"></div></a-col>
                         <a-col justify="space-between" :span="12"><div id="L3G2R" class="line-chart" style="width: 100%;"></div></a-col>
                    </a-row>
                    <a-row type="flex">
                         <a-col justify="space-between" :span="12"><div id="L3G3L" class="line-chart" style="width: 100%;"></div></a-col>
                         <a-col justify="space-between" :span="12"><div id="L3G3R" class="line-chart" style="width: 100%;"></div></a-col>
                    </a-row>
                    <a-row type="flex">
                         <a-col justify="space-between" :span="12"><div id="L3G4L" class="line-chart" style="width: 100%;"></div></a-col>
                         <a-col justify="space-between" :span="12"><div id="L3G4R" class="line-chart" style="width: 100%;"></div></a-col>
                    </a-row>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<style scoped>
    .text-success {color: #67C23A;}
    .text-fail {color: #F56C6C}
</style>
<script>
    import axios from 'axios'
    import {formatTime} from "../../assets/tools/tool"
    import {switchTimeToShow,switchTimeToSubmit,minuteToTime} from "../../assets/tools/tool.js"
    import Pagination from "../common/Pagination"
    import * as echarts from 'echarts';
    export default {
        props: ["start_time","end_time","rows"],
        watch: {
            start_time() {
                this.getLightList(1);
            },
            end_time() {
                this.getLightList(1);
            },
            mode() {
                this.resetLightChart();
            }
        },
        data() {
            return {
                mode: "table",
                activeName: 'light1',
                lightTable: [],
                lightTable1: [],
                page_light: 1,
                rows_light : 1000,
                total_light : 0,
                fullData: [],
                arrParamData: [{
                    param: "LT1_L1",
                    name:  this.$t('message.一层左侧开关')
                },{
                    param: "LT1_R1",
                    name:  this.$t('message.一层右侧开关')
                },{
                    param: "LT1_L2",
                    name:  this.$t('message.二层左侧开关')
                },{
                    param: "LT1_R2",
                    name:  this.$t('message.二层右侧开关')
                },{
                    param: "LT1_L3",
                    name:  this.$t('message.三层左侧开关')
                },{
                    param: "LT1_R3",
                    name:  this.$t('message.三层右侧开关')
                },{
                    param: "LT1_L4",
                    name:  this.$t('message.四层左侧开关')
                },{
                    param: "LT1_R4",
                    name:  this.$t('message.四层右侧开关')
                },

                {
                    param: "LT2_L1",
                    name:  this.$t('message.一层左侧开关')
                },{
                    param: "LT2_R1",
                    name:  this.$t('message.一层右侧开关')
                },{
                    param: "LT2_L2",
                    name:  this.$t('message.二层左侧开关')
                },{
                    param: "LT2_R2",
                    name:  this.$t('message.二层右侧开关')
                },{
                    param: "LT2_L3",
                    name:  this.$t('message.三层左侧开关')
                },{
                    param: "LT2_R3",
                    name:  this.$t('message.三层右侧开关')
                },{
                    param: "LT2_L4",
                    name:  this.$t('message.四层左侧开关')
                },{
                    param: "LT2_R4",
                    name:  this.$t('message.四层右侧开关')
                },

                {
                    param: "LT3_L1",
                    name:  this.$t('message.一层左侧开关')
                },{
                    param: "LT3_R1",
                    name:  this.$t('message.一层右侧开关')
                },{
                    param: "LT3_L2",
                    name:  this.$t('message.二层左侧开关')
                },{
                    param: "LT3_R2",
                    name:  this.$t('message.二层右侧开关')
                },{
                    param: "LT3_L3",
                    name:  this.$t('message.三层左侧开关')
                },{
                    param: "LT3_R3",
                    name:  this.$t('message.三层右侧开关')
                },{
                    param: "LT3_L4",
                    name:  this.$t('message.四层左侧开关')
                },{
                    param: "LT3_R4",
                    name:  this.$t('message.四层右侧开关')
                }]
            }
        },
        computed: {
            isMobile() {
                return this.$store.state.isMobile;
            },
            apiurl() {
                return this.$store.state.apiurl;
            },
            isPlant() {
                return this.$store.state.isPlant;
            }
        },
        components: {
            Pagination
        },
        methods: {
            handleClick(tab, event) {
                this.resetLightChart();
            },
            // 获取操作历史
            getLightList(page) {
                axios({
                    method: "post",
                    url: `${this.apiurl}/la/history/light/get`,
                    data: {
                        data: {
                            start_time: this.start_time,
                            end_time: this.end_time,
                            page_index: page - 1,
                            page_size: this.rows
                        }
                    }
                }).then(data => {
                    if(data.data.code == 200) {
                        if(this.isPlant) {
                            let farr = [];
                            let d1 = data.data.data;
                            d1.forEach(item => {
                                let tc_time = formatTime(item.time);
                                let dig_content = item.dig_content;
                                let f_res = {};
                                f_res.time = tc_time;
                                for(let itm in dig_content) {
                                    let res_one = {};
                                    let oneAllData = dig_content[itm];
                                    let dev_id = oneAllData["dev_id"];
                                    let oItem = oneAllData["item"]
                                    for(let oi in oItem) {
                                        let s = oItem[oi].param_code
                                        let arr = s.split("_");
                                        let s1 = arr[0] + "_" + dev_id + "_" + arr[1]
                                        f_res[s1] = oItem[oi].value
                                    }
                                }
                                farr.push(f_res)
                            })
                           this.lightTable1 = farr
                        } else {
                            let tb = [];
                            this.total_light = data.data.data_total;
                            data.data.data.forEach(item => {
                                let result = {
                                    time: formatTime(item["time"])
                                }
                                item.dig_content["1"].item.forEach(itm1=> {
                                    let arr = itm1.param_code.split("_");
                                    arr[0] = arr[0] + 1;
                                    let computedParamCode = arr.join("_")
                                    result[[computedParamCode]] = itm1["value"]
                                });
                                item.dig_content["2"].item.forEach(itm1=> {
                                    let arr = itm1.param_code.split("_");
                                    arr[0] = arr[0] + 2;
                                    let computedParamCode = arr.join("_")
                                    result[[computedParamCode]] = itm1["value"]
                                });
                                item.dig_content["3"].item.forEach(itm1=> {
                                    let arr = itm1.param_code.split("_");
                                    arr[0] = arr[0] + 3;
                                    let computedParamCode = arr.join("_")
                                    result[[computedParamCode]] = itm1["value"]
                                });
                                tb.push(result);
                            });
                            this.lightTable = tb;
                            this.resetLightChart();
                        }
                    }
                })
            },
            getLightList1(page) {
                axios({
                    method: "post",
                    url: `${this.apiurl}/la/history/light/get`,
                    data: {
                        data: {
                            start_time: this.start_time,
                            end_time: this.end_time,
                            page_index: page - 1,
                            page_size: this.rows_light
                        }
                    }
                }).then(data => {
                    if(data.data.code == 200) {
                        let tb = [];
                        this.total_light = data.data.data_total;
                        data.data.data.forEach(item => {
                            let result = {
                                time: formatTime(item["time"])
                            }
                            item.dig_content["1"].item.forEach(itm1=> {
                                let arr = itm1.param_code.split("_");
                                arr[0] = arr[0] + 1;
                                let computedParamCode = arr.join("_")
                                result[[computedParamCode]] = itm1["value"]
                            });
                            item.dig_content["2"].item.forEach(itm1=> {
                                let arr = itm1.param_code.split("_");
                                arr[0] = arr[0] + 2;
                                let computedParamCode = arr.join("_")
                                result[[computedParamCode]] = itm1["value"]
                            });
                            item.dig_content["3"].item.forEach(itm1=> {
                                let arr = itm1.param_code.split("_");
                                arr[0] = arr[0] + 3;
                                let computedParamCode = arr.join("_")
                                result[[computedParamCode]] = itm1["value"]
                            });
                            tb.push(result);
                        });
                        this.fullData = tb;
                        this.resetLightChart();
                    }
                })
            },
            resetLightChart(tb) {
                if(!this.isPlant) {
                    if(!tb) {
                        tb = this.fullData;
                    }
                    this.createTb(tb,["LT1_L1"],"L1G1L",["#c23531"]);
                    this.createTb(tb,["LT1_R1"],"L1G1R",["#c23531"]);
                    this.createTb(tb,["LT1_L2"],"L1G2L",["#c23531"]);
                    this.createTb(tb,["LT1_R2"],"L1G2R",["#c23531"]);
                    this.createTb(tb,["LT1_L3"],"L1G3L",["#c23531"]);
                    this.createTb(tb,["LT1_R3"],"L1G3R",["#c23531"]);
                    this.createTb(tb,["LT1_L4"],"L1G4L",["#c23531"]);
                    this.createTb(tb,["LT1_R4"],"L1G4R",["#c23531"]);

                    this.createTb(tb,["LT2_L1"],"L2G1L",["#c23531"]);
                    this.createTb(tb,["LT2_R1"],"L2G1R",["#c23531"]);
                    this.createTb(tb,["LT2_L2"],"L2G2L",["#c23531"]);
                    this.createTb(tb,["LT2_R2"],"L2G2R",["#c23531"]);
                    this.createTb(tb,["LT2_L3"],"L2G3L",["#c23531"]);
                    this.createTb(tb,["LT2_R3"],"L2G3R",["#c23531"]);
                    this.createTb(tb,["LT2_L4"],"L2G4L",["#c23531"]);
                    this.createTb(tb,["LT2_R4"],"L2G4R",["#c23531"]);

                    this.createTb(tb,["LT3_L1"],"L3G1L",["#c23531"]);
                    this.createTb(tb,["LT3_R1"],"L3G1R",["#c23531"]);
                    this.createTb(tb,["LT3_L2"],"L3G2L",["#c23531"]);
                    this.createTb(tb,["LT3_R2"],"L3G2R",["#c23531"]);
                    this.createTb(tb,["LT3_L3"],"L3G3L",["#c23531"]);
                    this.createTb(tb,["LT3_R3"],"L3G3R",["#c23531"]);
                    this.createTb(tb,["LT3_L4"],"L3G4L",["#c23531"]);
                    this.createTb(tb,["LT3_R4"],"L3G4R",["#c23531"]);
                }    
            },
            pageChange_light(page) {
                this.page_light = page;
                this.getLightList(page);
            },
            createTb(tb,arr,chartId,color) {
                var chartDom = document.getElementById(chartId);
                var myChart = echarts.init(chartDom);
                var option;
                let xAxisData = tb.map(item => item.time);
                let computedJson = arr.map(item => {
                    let name =  this.arrParamData.filter(i=>i["param"] == item)[0].name;
                    return {
                        name,
                        step: 'end',
                        type: 'line',
                        data: tb.map(item1 => item1[item])
                    }
                });
                let legendData = arr.map(item => {
                    return this.arrParamData.filter(i=>i["param"] == item)[0].name;
                });
                option = {
                    tooltip: {
                      trigger: 'axis'
                    },
                    legend: {
                      data: legendData
                    },
                    grid: {
                      left: '3%',
                      right: '4%',
                      bottom: '3%',
                      containLabel: true
                    },
                    xAxis: {
                      type: 'category',
                      boundaryGap: false,
                      data: xAxisData
                    },
                    yAxis: {
                       axisLabel : {
                            formatter: function(){
                                  return "";
                            }
                        }
                    },
                    dataZoom:[{
                　　     type:"inside"         //详细配置可见echarts官网
                 　　}],
                    series: computedJson
                };
                if(color) {
                    option.color = color;
                }
                option && myChart.setOption(option);
                setTimeout(()=> {
                   myChart.resize();
                });
            },
        },
        mounted() {
            this.getLightList(1);
            this.getLightList1(1);
        }
     }
</script>
