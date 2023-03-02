<!-- 
  组件说明： 本组件为历史记录中开关量历史组件。
-->
<template>
    <div>
        <div class="btn-mode-toggle" v-if="!isPlant && !isMobile">
            <el-button :type="mode == 'table' ? 'primary' : 'default'" size="small" @click="mode='table'">{{$t('message.表格')}}</el-button>
            <el-button :type="mode == 'chart' ? 'primary' : 'default'" size="small" @click="mode='chart'">{{$t('message.图表')}}</el-button>
        </div>
        <div v-show="mode=='table'">
            <el-table ref="multipleTable" :data="digTable" border stripe size="small" tooltip-effect="dark" style="margin-top: 20px;" :empty-text="$t('message.暂无数据')">
                <el-table-column prop="time" :label="$t('message.时间')" width="143"> </el-table-column>
                <el-table-column prop="AUTO" :label="$t('message.工作模式')"> 
                    <template slot-scope="scope">
                        <div v-if="scope.row.AUTO =='1'"> {{$t('message.自动')}} </div>
                        <div v-if="scope.row.AUTO == '0'"> {{$t('message.手动')}} </div>
                    </template>
                </el-table-column>
                <el-table-column :prop="item.prop" :label="item.label" v-for="item,key in arrTableData" :key="key"> 
                    <template slot-scope="scope">
                        <div v-if="scope.row[item.prop] === 1" class="text-success"> {{item[item.prop]}} {{item.state1}} </div>
                        <div v-if="scope.row[item.prop] === 0" class="text-fail">{{item[item.prop]}} {{item.state2}} </div>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination v-if="total_dig > 0" :page-index="page_dig" :total="total_dig" :page-size="rows" @change="pageChange_dig"> </Pagination>
        </div>
        <div v-show="mode=='chart'" style="padding-top: 30px;">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                 <el-tab-pane :label="$t('message.喷灌泵')" name="SIP-chart">
                      <div id="SIP-chart1" class="line-chart"></div>
                      <div id="SIP-chart2" class="line-chart"></div>
                 </el-tab-pane>
                 <el-tab-pane :label="$t('message.回水泵')" name="BWP-chart">
                     <div id="BWP-chart1" class="line-chart"></div>
                     <div id="BWP-chart2" class="line-chart"></div>
                 </el-tab-pane>
                 <el-tab-pane :label="$t('message.搅拌泵')" name="MIX-chart">
                     <div id="MIX-chart" class="normal-line_chart"></div>
                 </el-tab-pane>
                 <el-tab-pane :label="$t('message.补水阀')" name="WSV-chart">
                     <div id="WSV-chart" class="normal-line_chart"></div>
                 </el-tab-pane>
                 <el-tab-pane :label="$t('message.二氧化碳阀')" name="CO2V-chart">
                     <div id="CO2V-chart" class="normal-line_chart"></div>
                 </el-tab-pane>
                 <el-tab-pane :label="$t('message.蠕动泵状态')" name="PP-chart">
                     <div id="PP-chart1" class="line-chart"></div>
                     <div id="PP-chart2" class="line-chart"></div>
                     <div id="PP-chart3" class="line-chart"></div>
                     <div id="PP-chart4" class="line-chart"></div>
                     <div id="PP-chart5" class="line-chart"></div>
                 </el-tab-pane>
                 <el-tab-pane :label="$t('message.蠕动泵方向')" name="PP_ZF-chart">
                     <div id="PP_ZF1-chart" class="line-chart"></div>
                     <div id="PP_ZF2-chart" class="line-chart"></div>
                     <div id="PP_ZF3-chart" class="line-chart"></div>
                     <div id="PP_ZF4-chart" class="line-chart"></div>
                     <div id="PP_ZF5-chart" class="line-chart"></div>
                 </el-tab-pane>
                 <el-tab-pane :label="$t('message.运行灯')" name="IND-chart">
                     <div id="IND-chart1" class="line-chart"></div>
                     <div id="IND-chart2" class="line-chart"></div>
                     <div id="IND-chart3" class="line-chart"></div>
                     <div id="IND-chart4" class="line-chart"></div>
                 </el-tab-pane>
                 <el-tab-pane :label="$t('message.阀左')" name="VL-chart">
                     <div id="VL-chart1" class="line-chart"></div>
                     <div id="VL-chart2" class="line-chart"></div>
                     <div id="VL-chart3" class="line-chart"></div>
                     <div id="VL-chart4" class="line-chart"></div>
                 </el-tab-pane>
                 <el-tab-pane :label="$t('message.阀右')" name="VR-chart">
                     <div id="VR-chart1" class="line-chart"></div>
                     <div id="VR-chart2" class="line-chart"></div>
                     <div id="VR-chart3" class="line-chart"></div>
                     <div id="VR-chart4" class="line-chart"></div>
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
    import Pagination from "../common/Pagination"
    import {formatTime} from "../../assets/tools/tool"
    import * as echarts from 'echarts';
    export default {
        props: ["start_time","end_time","rows"],
        watch: {
            start_time() {
                this.getDiginfoList(1);
            },
            end_time() {
                this.getDiginfoList(1);
            },
            mode() {
                this.resetDigChart();
            }
        },
        data() {
            return {
                mode: "table",
                activeName: 'SIP-chart',
                fullData: [],
                digTable: [],
                page_dig: 1,
                rows_dig : 1000,
                total_dig: 0,
                arrNoPlantData:[{
                    prop: "SIP1",
                    label: this.$t('message.喷灌泵1'),
                    state1: this.$t('message.运行'),
                    state2: this.$t('message.停止')
                },{
                    prop: "SIP2",
                    label: this.$t('message.喷灌泵2'),
                    state1: this.$t('message.运行'),
                    state2: this.$t('message.停止')
                },{
                    prop: "BWP1",
                    label: this.$t('message.回水泵1'),
                    state1: this.$t('message.运行'),
                    state2: this.$t('message.停止')
                },{
                    prop: "BWP2",
                    label: this.$t('message.回水泵2'),
                    state1: this.$t('message.运行'),
                    state2: this.$t('message.停止')
                },{
                    prop: "MIX_P",
                    label: this.$t('message.搅拌泵'),
                    state1: this.$t('message.运行'),
                    state2: this.$t('message.停止')
                },{
                    prop: "WSV",
                    label: this.$t('message.补水阀'),
                    state1: this.$t('message.开'),
                    state2: this.$t('message.关')
                },{
                    prop: "CO2V",
                    label: this.$t('message.二氧化碳阀'),
                    state1: this.$t('message.开'),
                    state2: this.$t('message.关')
                },{
                    prop: "PP1",
                    label: this.$t('message.蠕动泵1状态'),
                    state1: this.$t('message.运行'),
                    state2: this.$t('message.停止')
                },{
                    prop: "PP2",
                    label: this.$t('message.蠕动泵2状态'),
                    state1: this.$t('message.运行'),
                    state2: this.$t('message.停止')
                },{
                    prop: "PP3",
                    label: this.$t('message.蠕动泵3状态'),
                    state1: this.$t('message.运行'),
                    state2: this.$t('message.停止')
                },{
                    prop: "PP4",
                    label: this.$t('message.蠕动泵4状态'),
                    state1: this.$t('message.运行'),
                    state2: this.$t('message.停止')
                },{
                    prop: "PP5",
                    label: this.$t('message.蠕动泵5状态'),
                    state1: this.$t('message.运行'),
                    state2: this.$t('message.停止')
                },{
                    prop: "PP1_ZF",
                    label: this.$t('message.蠕动泵1方向'),
                    state1: this.$t('message.正转'),
                    state2: this.$t('message.反转')
                },{
                    prop: "PP2_ZF",
                    label: this.$t('message.蠕动泵2方向'),
                    state1: this.$t('message.正转'),
                    state2: this.$t('message.反转')
                },{
                    prop: "PP3_ZF",
                    label: this.$t('message.蠕动泵3方向'),
                    state1: this.$t('message.正转'),
                    state2: this.$t('message.反转')
                },{
                    prop: "PP4_ZF",
                    label: this.$t('message.蠕动泵4方向'),
                    state1: this.$t('message.正转'),
                    state2: this.$t('message.反转')
                },{
                    prop: "PP5_ZF",
                    label: this.$t('message.蠕动泵5方向'),
                    state1: this.$t('message.正转'),
                    state2: this.$t('message.反转')
                },{
                    prop: "IND_RUN",
                    label: this.$t('message.运行灯'),
                    state1: this.$t('message.开'),
                    state2: this.$t('message.关')
                },{
                    prop: "IND_EC",
                    label: this.$t('message.EC告警灯'),
                    state1: this.$t('message.开'),
                    state2: this.$t('message.关')
                },{
                    prop: "IND_PH",
                    label: this.$t('message.PH告警灯'),
                    state1: this.$t('message.开'),
                    state2: this.$t('message.关')
                },{
                    prop: "IND_LV",
                    label: this.$t('message.液位灯'),
                    state1: this.$t('message.开'),
                    state2: this.$t('message.关')
                },{
                    prop: "VL1",
                    label: this.$t('message.阀左1'),
                    state1: this.$t('message.开'),
                    state2: this.$t('message.关')
                },{
                    prop: "VL2",
                    label: this.$t('message.阀左2'),
                    state1: this.$t('message.开'),
                    state2: this.$t('message.关')
                },{
                    prop: "VL3",
                    label: this.$t('message.阀左3'),
                    state1: this.$t('message.开'),
                    state2: this.$t('message.关')
                },{
                    prop: "VL4",
                    label: this.$t('message.阀左4'),
                    state1: this.$t('message.开'),
                    state2: this.$t('message.关')
                },{
                    prop: "VR1",
                    label: this.$t('message.阀右1'),
                    state1: this.$t('message.开'),
                    state2: this.$t('message.关')
                },{
                    prop: "VR2",
                    label: this.$t('message.阀右2'),
                    state1: this.$t('message.开'),
                    state2: this.$t('message.关')
                },{
                    prop: "VR3",
                    label: this.$t('message.阀右3'),
                    state1: this.$t('message.开'),
                    state2: this.$t('message.关')
                },{
                    prop: "VR4",
                    label: this.$t('message.阀右4'),
                    state1: this.$t('message.开'),
                    state2: this.$t('message.关')
                }],
                arrPlantData: [{
                    prop: "SIP",
                    label: this.$t('message.喷灌泵'),
                    state1: this.$t('message.运行'),
                    state2: this.$t('message.停止')
                },{
                    prop: "BWP",
                    label: this.$t('message.回水泵'),
                    state1: this.$t('message.运行'),
                    state2: this.$t('message.停止')
                },{
                    prop: "MIX_P",
                    label: this.$t('message.搅拌泵'),
                    state1: this.$t('message.运行'),
                    state2: this.$t('message.停止')
                },{
                    prop: "WSV",
                    label: this.$t('message.补水阀'),
                    state1: this.$t('message.开'),
                    state2: this.$t('message.关')
                },{
                    prop: "CO2V",
                    label: this.$t('message.二氧化碳阀'),
                    state1: this.$t('message.开'),
                    state2: this.$t('message.关')
                },{
                    prop: "PP1",
                    label: this.$t('message.蠕动泵1状态'),
                    state1: this.$t('message.运行'),
                    state2: this.$t('message.停止')
                },{
                    prop: "PP2",
                    label: this.$t('message.蠕动泵2状态'),
                    state1: this.$t('message.运行'),
                    state2: this.$t('message.停止')
                },{
                    prop: "PP3",
                    label: this.$t('message.蠕动泵3状态'),
                    state1: this.$t('message.运行'),
                    state2: this.$t('message.停止')
                },{
                    prop: "PP4",
                    label: this.$t('message.蠕动泵4状态'),
                    state1: this.$t('message.运行'),
                    state2: this.$t('message.停止')
                },{
                    prop: "PP5",
                    label: this.$t('message.蠕动泵5状态'),
                    state1: this.$t('message.运行'),
                    state2: this.$t('message.停止')
                },{
                    prop: "PP1_ZF",
                    label: this.$t('message.蠕动泵1方向'),
                    state1: this.$t('message.正转'),
                    state2: this.$t('message.反转')
                },{
                    prop: "PP2_ZF",
                    label: this.$t('message.蠕动泵2方向'),
                    state1: this.$t('message.正转'),
                    state2: this.$t('message.反转')
                },{
                    prop: "PP3_ZF",
                    label: this.$t('message.蠕动泵3方向'),
                    state1: this.$t('message.正转'),
                    state2: this.$t('message.反转')
                },{
                    prop: "PP4_ZF",
                    label: this.$t('message.蠕动泵4方向'),
                    state1: this.$t('message.正转'),
                    state2: this.$t('message.反转')
                },{
                    prop: "PP5_ZF",
                    label: this.$t('message.蠕动泵5方向'),
                    state1: this.$t('message.正转'),
                    state2: this.$t('message.反转')
                },{
                    prop: "IND_RUN",
                    label: this.$t('message.运行灯'),
                    state1: this.$t('message.开'),
                    state2: this.$t('message.关')
                },{
                    prop: "IND_EC",
                    label: this.$t('message.EC告警灯'),
                    state1: this.$t('message.开'),
                    state2: this.$t('message.关')
                },{
                    prop: "IND_PH",
                    label: this.$t('message.PH告警灯'),
                    state1: this.$t('message.开'),
                    state2: this.$t('message.关')
                },{
                    prop: "IND_LV",
                    label: this.$t('message.液位灯'),
                    state1: this.$t('message.开'),
                    state2: this.$t('message.关')
                }],
                arrParamData: [{
                    param: "SIP1",
                    name: this.$t('message.喷灌泵1')
                },{
                    param: "SIP2",
                    name: this.$t('message.喷灌泵2')
                },{
                    param: "BWP1",
                    name: this.$t('message.回水泵1')
                },{
                    param: "BWP2",
                    name: this.$t('message.回水泵2')
                },{
                    param: "MIX_P",
                    name: this.$t('message.搅拌泵')
                },{
                    param: "WSV",
                    name: this.$t('message.补水阀')
                },{
                    param: "CO2V",
                    name: this.$t('message.二氧化碳阀')
                },{
                    param: "PP1",
                    name: this.$t('message.蠕动泵1状态')
                },{
                    param: "PP2",
                    name: this.$t('message.蠕动泵2状态')
                },{
                    param: "PP3",
                    name: this.$t('message.蠕动泵3状态')
                },{
                    param: "PP4",
                    name: this.$t('message.蠕动泵4状态')
                },{
                    param: "PP5",
                    name: this.$t('message.蠕动泵5状态')
                },{
                    param: "PP1_ZF",
                    name: this.$t('message.蠕动泵1方向')
                },{
                    param: "PP2_ZF",
                    name: this.$t('message.蠕动泵2方向')
                },{
                    param: "PP3_ZF",
                    name: this.$t('message.蠕动泵3方向')
                },{
                    param: "PP4_ZF",
                    name: this.$t('message.蠕动泵4方向')
                },{
                    param: "PP5_ZF",
                    name: this.$t('message.蠕动泵5方向')
                },{
                    param: "IND_RUN",
                    name: this.$t('message.运行灯')
                },{
                    param: "IND_EC",
                    name: this.$t('message.EC告警灯')
                },{
                    param: "IND_PH",
                    name: this.$t('message.PH告警灯')
                },{
                    param: "IND_LV",
                    name: this.$t('message.液位灯')
                },{
                    param: "VL1",
                    name: this.$t('message.阀左1')
                },{
                    param: "VL2",
                    name: this.$t('message.阀左2')
                },{
                    param: "VL3",
                    name: this.$t('message.阀左3')
                },{
                    param: "VL4",
                    name: this.$t('message.阀左4')
                },{
                    param: "VR1",
                    name: this.$t('message.阀右1')
                },{
                    param: "VR2",
                    name: this.$t('message.阀右2')
                },{
                    param: "VR3",
                    name: this.$t('message.阀右3')
                },{
                    param: "VR4",
                    name: this.$t('message.阀右4')
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
            },
            arrTableData() {
                return this.isPlant ? this.arrPlantData : this.arrNoPlantData;
            }
        },
        components: {
            Pagination
        },
        methods: {
            handleClick(tab, event) {
                this.resetDigChart();
            },
            // 获取开关历史
            getDiginfoList(page) {
                axios({
                    method: "post",
                    url: `${this.apiurl}/la/history/dig/get`,
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
                        let tb = [];
                        this.total_dig = data.data.data_total;
                        data.data.data.forEach(item => {
                            let result = {
                                time: formatTime(item["time"])
                            }
                            item.dig_content.item.forEach(itm1 => {
                                result[[itm1.param_code]] = itm1["value"]
                            })
                            tb.push(result);
                        });
                        this.digTable = tb;
                        this.resetDigChart();
                    }
                })
            },
            getDiginfoList1(page) {
                axios({
                    method: "post",
                    url: `${this.apiurl}/la/history/dig/get`,
                    data: {
                        data: {
                            start_time: this.start_time,
                            end_time: this.end_time,
                            page_index: page - 1,
                            page_size: this.rows_dig
                        }
                    }
                }).then(data => {
                    if(data.data.code == 200) {
                        let tb = [];
                        // this.total_dig = data.data.data_total;
                        data.data.data.forEach(item => {
                            let result = {
                                time: formatTime(item["time"])
                            }
                            item.dig_content.item.forEach(itm1 => {
                                result[[itm1.param_code]] = itm1["value"]
                            })
                            tb.push(result);
                        });
                        this.fullData = tb;
                        this.resetDigChart();
                    }
                })
            },
            resetDigChart(tb) {
                if(!this.isPlant) {
                    if(!tb) {
                        tb = this.fullData;
                    }
                    this.createTb(tb,["SIP1"],"SIP-chart1",["#c23531"]);
                    this.createTb(tb,["SIP2"],"SIP-chart2",["#2f4554"]);
                    this.createTb(tb,["BWP1"],"BWP-chart1",["#c23531"]);
                    this.createTb(tb,["BWP2"],"BWP-chart2",["#2f4554"]);
                    this.createTb(tb,["MIX_P"],"MIX-chart");
                    this.createTb(tb,["WSV"],"WSV-chart");
                    this.createTb(tb,["CO2V"],"CO2V-chart");
                    this.createTb(tb,["PP1"],"PP-chart1",["#c23531"]);
                    this.createTb(tb,["PP2"],"PP-chart2",["#2f4554"]);
                    this.createTb(tb,["PP3"],"PP-chart3",["#61a0a8"]);
                    this.createTb(tb,["PP4"],"PP-chart4",["#d48265"]);
                    this.createTb(tb,["PP5"],"PP-chart5",["#91c7ae"]);
                    this.createTb(tb,["PP1_ZF"],"PP_ZF1-chart",["#c23531"]);
                    this.createTb(tb,["PP2_ZF"],"PP_ZF2-chart",["#2f4554"]);
                    this.createTb(tb,["PP3_ZF"],"PP_ZF3-chart",["#61a0a8"]);
                    this.createTb(tb,["PP4_ZF"],"PP_ZF4-chart",["#d48265"]);
                    this.createTb(tb,["PP5_ZF"],"PP_ZF5-chart",["#91c7ae"]);
                    this.createTb(tb,["IND_RUN"],"IND-chart1",["#c23531"]);
                    this.createTb(tb,["IND_EC"],"IND-chart2",["#2f4554"]);
                    this.createTb(tb,["IND_PH"],"IND-chart3",["#61a0a8"]);
                    this.createTb(tb,["IND_LV"],"IND-chart4",["#d48265"]);
                    this.createTb(tb,["VL1"],"VL-chart1",["#c23531"]);
                    this.createTb(tb,["VL2"],"VL-chart2",["#2f4554"]);
                    this.createTb(tb,["VL3"],"VL-chart3",["#61a0a8"]);
                    this.createTb(tb,["VL4"],"VL-chart4",["#d48265"]);
                    this.createTb(tb,["VR1"],"VR-chart1",["#c23531"]);
                    this.createTb(tb,["VR2"],"VR-chart2",["#2f4554"]);
                    this.createTb(tb,["VR3"],"VR-chart3",["#61a0a8"]);
                    this.createTb(tb,["VR4"],"VR-chart4",["#d48265"]);
                }
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
            pageChange_dig(page) {
                this.getDiginfoList(page);
            },
        },
        mounted() {
            this.getDiginfoList(1);
            this.getDiginfoList1(1);
        }
    }
</script>