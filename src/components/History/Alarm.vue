<!-- 
  组件说明： 本组件为历史记录中告警历史组件。
-->
<template>
    <div>
        <div class="btn-mode-toggle" v-if="!isPlant && !isMobile">
            <el-button :type="mode == 'table' ? 'primary' : 'default'" size="small" @click="mode='table'">{{$t('message.表格')}}</el-button>
            <el-button :type="mode == 'chart' ? 'primary' : 'default'" size="small" @click="mode='chart'">{{$t('message.图表')}}</el-button>
        </div>
        <div v-show="mode=='table'">
            <el-table ref="multipleTable" :data="alarmTable" border stripe size="small" tooltip-effect="dark" style="margin-top: 20px;" :empty-text="$t('message.暂无数据')">
                <el-table-column prop="time" :label="$t('message.时间')" width="143"> </el-table-column>

                <el-table-column :prop="item.prop" :label="item.label" v-for="item,key in arrTableData" :key="key"> 
                    <template slot-scope="scope">
                        <div v-if="scope.row[item.prop] =='1'" class="text-fail"> {{$t('message.异常')}} </div>
                        <div v-if="scope.row[item.prop] == '0'" class="text-success"> {{$t('message.正常')}} </div>
                    </template>
                </el-table-column>

               
            </el-table>
            <Pagination v-if="total_alarm > 0" :page-index="page_alarm" :total="total_alarm" :page-size="rows" @change="pageChange_alarm"> </Pagination>
        </div>
        <div v-show="mode=='chart'" style="padding-top: 30px;">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                 <el-tab-pane :label="$t('message.回水液位')" name="A_BW-chart">
                      <div id="A_BW-chart1" class="line-chart"></div>
                      <div id="A_BW-chart2" class="line-chart"></div>
                 </el-tab-pane>
                 <el-tab-pane label="CO2" name="A_CO2-chart">
                      <div id="A_CO2-chart1" class="line-chart"></div>
                      <div id="A_CO2-chart2" class="line-chart"></div>
                 </el-tab-pane>
                 <el-tab-pane label="EC" name="A_EC-chart">
                      <div id="A_EC-chart1" class="line-chart"></div>
                      <div id="A_EC-chart2" class="line-chart"></div>
                 </el-tab-pane>
                 <el-tab-pane :label="$t('message.湿度')" name="A_HUM-chart">
                      <div id="A_HUM-chart" class="normal-line_chart"></div>
                 </el-tab-pane>
                 <el-tab-pane :label="$t('message.温度')" name="A_TEMP-chart">
                      <div id="A_TEMP-chart" class="normal-line_chart"></div>
                 </el-tab-pane>
                 <el-tab-pane :label="$t('message.液温')" name="A_LIQ_T-chart">
                      <div id="A_LIQ_T-chart1" class="line-chart"></div>
                      <div id="A_LIQ_T-chart2" class="line-chart"></div>
                 </el-tab-pane>
                 <el-tab-pane :label="$t('message.液位')" name="A_LV-chart">
                      <div id="A_LV-chart1" class="line-chart"></div>
                      <div id="A_LV-chart2" class="line-chart"></div>
                 </el-tab-pane>
                 <el-tab-pane label="PH" name="A_PH-chart">
                      <div id="A_PH-chart1" class="line-chart"></div>
                      <div id="A_PH-chart2" class="line-chart"></div>
                 </el-tab-pane>
                 <el-tab-pane :label="$t('message.缺液')" name="A_QY-chart">
                      <div id="A_QY-chart1" class="line-chart"></div>
                      <div id="A_QY-chart2" class="line-chart"></div>
                      <div id="A_QY-chart3" class="line-chart"></div>
                      <div id="A_QY-chart4" class="line-chart"></div>
                      <div id="A_QY-chart5" class="line-chart"></div>
                 </el-tab-pane>
                 <el-tab-pane :label="$t('message.出水管压力')" name="A_WP-chart">
                      <div id="A_WP-chart1" class="line-chart"></div>
                      <div id="A_WP-chart2" class="line-chart"></div>
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
    import * as echarts from 'echarts';
    import Pagination from "../common/Pagination"
    export default {
        props: ["start_time","end_time","rows"],
         watch: {
            start_time() {
                this.getAlarmList(1);
            },
            end_time() {
                this.getAlarmList(1);
            },
            mode() {
                this.resetAlarmChart();
            }
        },
         data() {
            return {
                mode: "table",
                activeName: 'A_BW-chart',
                alarmTable: [],
                fullData: [],
                page_alarm: 1,
                rows_alarm : 1000,
                total_alarm : 0,
                arrTableData: [{
                    prop: "A_EC_UP",
                    label: this.$t('message.EC越上限'),
                },{
                    prop: "A_EC_LO",
                    label: this.$t('message.EC越下限'),
                },{
                    prop: "A_PH_UP",
                    label: this.$t('message.PH越上限'),
                },{
                    prop: "A_PH_LO",
                    label: this.$t('message.PH越下限'),
                },{
                    prop: "A_LV_UP",
                    label: this.$t('message.液位越上限'),
                },{
                    prop: "A_LV_LO",
                    label: this.$t('message.液位越下限'),
                },{
                    prop: "A_LIQ_T_UP",
                    label: this.$t('message.液温越上限'),
                },{
                    prop: "A_LIQ_T_LO",
                    label: this.$t('message.液温越下限'),
                },{
                    prop: "A_BW_LV_UP",
                    label: this.$t('message.回水液位越上限'),
                },{
                    prop: "A_BW_LV_LO",
                    label: this.$t('message.回水液位越下限'),
                },{
                    prop: "A_QY1",
                    label: this.$t('message.营养液A缺液'),
                },{
                    prop: "A_QY2",
                    label: this.$t('message.营养液B缺液'),
                },{
                    prop: "A_QY3",
                    label: this.$t('message.营养液C缺液'),
                },{
                    prop: "A_QY4",
                    label: this.$t('message.酸缺液'),
                },{
                    prop: "A_QY5",
                    label: this.$t('message.碱缺液'),
                },{
                    prop: "A_WP_UP",
                    label: this.$t('message.出水管压力越上限'),
                },{
                    prop: "A_WP_LO",
                    label: this.$t('message.出水管压力越下限'),
                },{
                    prop: "A_CO2_UP",
                    label: this.$t('message.二氧化碳越上限'),
                },{
                    prop: "A_CO2_LO",
                    label: this.$t('message.二氧化碳越下限'),
                },{
                    prop: "A_TEMP_OL",
                    label: this.$t('message.温度越限'),
                },{
                    prop: "A_HUM_OL",
                    label: this.$t('message.湿度越限'),
                }],
                arrParamData: [{
                    param: "A_BW_LV_LO",
                    name: this.$t('message.回水液位越下限')
                },{
                    param: "A_BW_LV_UP",
                    name: this.$t('message.回水液位越上限')
                },{
                    param: "A_CO2_LO",
                    name: this.$t('message.二氧化碳越下限')
                },{
                    param: "A_CO2_UP",
                    name: this.$t('message.二氧化碳越上限')
                },{
                    param: "A_EC_LO",
                    name: this.$t('message.EC越下限')
                },{
                    param: "A_EC_UP",
                    name: this.$t('message.EC越上限')
                },{
                    param: "A_HUM_OL",
                    name: this.$t('message.湿度越限')
                },{
                    param: "A_LIQ_T_LO",
                    name: this.$t('message.液温越下限')
                },{
                    param: "A_LIQ_T_UP",
                    name: this.$t('message.液温越上限')
                },{
                    param: "A_LV_LO",
                    name: this.$t('message.液位越下限')
                },{
                    param: "A_LV_UP",
                    name: this.$t('message.液位越上限')
                },{
                    param: "A_PH_LO",
                    name: this.$t('message.PH越下限')
                },{
                    param: "A_PH_UP",
                    name: this.$t('message.PH越上限')
                },{
                    param: "A_QY1",
                    name: this.$t('message.营养液A缺液')
                },{
                    param: "A_QY2",
                    name: this.$t('message.营养液B缺液')
                },{
                    param: "A_QY3",
                    name: this.$t('message.营养液C缺液')
                },{
                    param: "A_QY4",
                    name: this.$t('message.酸缺液')
                },{
                    param: "A_QY5",
                    name: this.$t('message.碱缺液')
                },{
                    param: "A_TEMP_OL",
                    name: this.$t('message.温度越限')
                },{
                    param: "A_WP_LO",
                    name: this.$t('message.出水管压力越下限')
                },{
                    param: "A_WP_UP",
                    name: this.$t('message.出水管压力越上限')
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
        },
        components: {
            Pagination
        },
        methods: {
            handleClick(tab, event) {
                this.resetAlarmChart();
            },
            // 获取警告历史
            getAlarmList(page) {
                axios({
                    method: "post",
                    url: `${this.apiurl}/la/history/alarm/get`,
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
                        this.total_alarm = data.data.data_total;
                        data.data.data.forEach(item => {
                            let result = {
                                time: formatTime(item["time"])
                            }
                            item.alarm_content.item.forEach(itm1 => {
                                    result[[itm1.param_code]] = itm1["value"]
                            })
                            tb.push(result);
                        });
                        this.alarmTable = tb;
                        this.resetAlarmChart();
                    }
                })
            },
            getAlarmList1(page) {
                axios({
                    method: "post",
                    url: `${this.apiurl}/la/history/alarm/get`,
                    data: {
                        data: {
                            start_time: this.start_time,
                            end_time: this.end_time,
                            page_index: page - 1,
                            page_size: this.rows_alarm
                        }
                    }
                }).then(data => {
                    if(data.data.code == 200) {
                        let tb = [];
                        data.data.data.forEach(item => {
                            let result = {
                                time: formatTime(item["time"])
                            }
                            item.alarm_content.item.forEach(itm1 => {
                                    result[[itm1.param_code]] = itm1["value"]
                            })
                            tb.push(result);
                        });
                        this.fullData = tb;
                        this.resetAlarmChart();
                    }
                })
            },
            resetAlarmChart(tb) {
                if(!this.isPlant) {
                    if(!tb) {
                        tb = this.fullData;
                    }
                    this.createTb(tb,["A_BW_LV_LO"],"A_BW-chart1",["#c23531"]);
                    this.createTb(tb,["A_BW_LV_UP"],"A_BW-chart2",["#2f4554"]);
                    this.createTb(tb,["A_CO2_LO"],"A_CO2-chart1",["#c23531"]);
                    this.createTb(tb,["A_CO2_UP"],"A_CO2-chart2",["#2f4554"]);
                    this.createTb(tb,["A_EC_LO"],"A_EC-chart1",["#c23531"]);
                    this.createTb(tb,["A_EC_UP"],"A_EC-chart2",["#2f4554"]);
                    this.createTb(tb,["A_HUM_OL"],"A_HUM-chart");
                    this.createTb(tb,["A_TEMP_OL"],"A_TEMP-chart");
                    this.createTb(tb,["A_LIQ_T_LO"],"A_LIQ_T-chart1",["#c23531"]);
                    this.createTb(tb,["A_LIQ_T_UP"],"A_LIQ_T-chart2",["#2f4554"]);
                    this.createTb(tb,["A_LV_LO"],"A_LV-chart1",["#c23531"]);
                    this.createTb(tb,["A_LV_UP"],"A_LV-chart2",["#2f4554"]);
                    this.createTb(tb,["A_PH_LO"],"A_PH-chart1",["#c23531"]);
                    this.createTb(tb,["A_PH_UP"],"A_PH-chart2",["#2f4554"]);
                    this.createTb(tb,["A_QY1"],"A_QY-chart1",["#c23531"]);
                    this.createTb(tb,["A_QY2"],"A_QY-chart2",["#2f4554"]);
                    this.createTb(tb,["A_QY3"],"A_QY-chart3",["#61a0a8"]);
                    this.createTb(tb,["A_QY4"],"A_QY-chart4",['#d48265']);
                    this.createTb(tb,["A_QY5"],"A_QY-chart5",['#91c7ae']);
                    this.createTb(tb,["A_WP_LO"],"A_WP-chart1",["#c23531"]);
                    this.createTb(tb,["A_WP_UP"],"A_WP-chart2",["#2f4554"]);
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
            pageChange_alarm(page) {
                this.page_alarm = page;
                this.getAlarmList(page);
            },
        },
        mounted() {
            this.getAlarmList(1);
            this.getAlarmList1(1);
        }
    }
</script>