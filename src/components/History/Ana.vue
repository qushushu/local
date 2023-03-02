<!-- 
  组件说明： 本组件为历史记录中模拟量历史组件。
-->
<template>
    <div>
        <div class="btn-mode-toggle" v-if="!isPlant && !isMobile">
            <el-button :type="mode == 'table' ? 'primary' : 'default'" size="small" @click="mode='table'">{{$t('message.表格')}}</el-button>
            <el-button :type="mode == 'chart' ? 'primary' : 'default'" size="small" @click="mode='chart'">{{$t('message.图表')}}</el-button>
        </div>
        <div v-show="mode=='table'">
            <el-table ref="multipleTable" :data="anaTable" border stripe size="small" tooltip-effect="dark" :empty-text="$t('message.暂无数据')">
                <el-table-column prop="time" :label="$t('message.时间')" width="143"> </el-table-column>
                <el-table-column :prop="item.param" :label="item.name" v-for="(item,key) in arrParamData" :key="key"> </el-table-column>
            </el-table>
            <Pagination v-if="total_ana > 0" :page-index="page_ana" :total="total_ana" :page-size="rows" @change="pageChange_ana"> </Pagination>
        </div>

        <div v-show="mode=='chart'" style="padding-top: 30px;">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="EC" name="EC-chart">
                    <div id="EC-chart" class="normal-chart" style="width: 100%;height: 300px;"></div>
                </el-tab-pane>
                <el-tab-pane label="PH" name="PH-chart">
                    <div id="PH-chart"  class="normal-chart"></div>
                </el-tab-pane>
                <el-tab-pane :label="$t('message.液位')" name="LIQ_LV-chart">
                    <div id="LIQ_LV-chart"  class="normal-chart"></div>
                </el-tab-pane>
                <el-tab-pane :label="$t('message.液温')" name="LIQ_TEMP-chart">
                    <div id="LIQ_TEMP-chart"  class="normal-chart"></div>
                </el-tab-pane>
                <el-tab-pane :label="$t('message.质量')" name="W-chart">
                    <div id="W-chart"  class="normal-chart"></div>
                </el-tab-pane>
                <el-tab-pane :label="$t('message.转速')" name="ZS-chart">
                    <div id="ZS-chart"  class="normal-chart"></div>
                </el-tab-pane>
                <el-tab-pane :label="$t('message.出水管压力')" name="OUT_PRESS-chart">
                     <div id="OUT_PRESS-chart"  class="normal-chart"></div>
                </el-tab-pane>
                <el-tab-pane :label="$t('message.二氧化碳浓度')" name="CO2-chart">
                    <div id="CO2-chart"  class="normal-chart"></div>
                </el-tab-pane>
                <el-tab-pane :label="$t('message.环境温度')" name="TEMP-chart">
                    <div id="TEMP-chart"  class="normal-chart"></div>
                </el-tab-pane>
                <el-tab-pane :label="$t('message.湿度')" name="HUM-chart">
                    <div id="HUM-chart"  class="normal-chart"></div>
                </el-tab-pane>
                <el-tab-pane :label="$t('message.喷灌持续时间')" name="SIPT-chart">
                    <div id="SIPT-chart"  class="normal-chart"></div>
                </el-tab-pane>
                <el-tab-pane :label="$t('message.下次喷灌时间')" name="SIPNT-chart">
                    <div id="SIPNT-chart"  class="normal-chart"></div>
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
    import Pagination from "../common/Pagination"
    import * as echarts from 'echarts';
    export default {
        props: ["start_time","end_time","rows"],
         watch: {
            start_time() {
                this.getAnaList(1);
            },
            end_time() {
                this.getAnaList(1);
            },
            mode() {
                this.resetAnaChart();
            }
        },
        data() {
            return {
                mode: "table",
                activeName: 'EC-chart',
                anaTable: [],
                page_ana: 1,
                rows_ana : 1000,
                fullData: [],
                total_ana : 0,
                arrNoPlantData: [{
                    param: "EC",
                    name: "EC"
                },{
                    param: "PH",
                    name: "PH"
                },{
                    param: "LIQ_LV",
                    name: this.$t('message.液位') + '(cm)'
                },{
                    param: "LIQ_B_LV",
                    name: this.$t('message.回水液位') + '(cm)'
                },{
                    param: "LIQ_TEMP",
                    name: this.$t('message.液温') + '(℃)'
                },{
                    param: "W1",
                    name: this.$t('message.A液质量') + '(kg)'
                },{
                    param: "W2",
                    name: this.$t('message.B液质量') + '(kg)'
                },{
                    param: "W3",
                    name: this.$t('message.C液质量') + '(kg)'
                },{
                    param: "W4",
                    name: this.$t('message.酸质量') + '(kg)'
                },{
                    param: "W5",
                    name: this.$t('message.碱质量') + '(kg)'
                },{
                    param: "WS1",
                    name: this.$t('message.A液起始质量') + '(kg)'
                },{
                    param: "WS2",
                    name: this.$t('message.B液起始质量') + '(kg)'
                },{
                    param: "WS3",
                    name: this.$t('message.C液起始质量') + '(kg)'
                },{
                    param: "WS4",
                    name: this.$t('message.酸起始质量') + '(kg)'
                },{
                    param: "WS5",
                    name: this.$t('message.碱起始质量') + '(kg)'
                },{
                    param: "ZS1",
                    name: this.$t('message.A液蠕动泵转速') + "(m)"
                },{
                    param: "ZS2",
                    name: this.$t('message.B液蠕动泵转速') + "(m)"
                },{
                    param: "ZS3",
                    name: this.$t('message.C液蠕动泵转速') + "(m)"
                },{
                    param: "ZS4",
                    name: this.$t('message.酸液蠕动泵转速') + "(m)"
                },{
                    param: "ZS5",
                    name: this.$t('message.碱液蠕动泵转速') + "(m)"
                },{
                    param: "OUT_PRESS",
                    name: this.$t('message.出水管压力')
                },{
                    param: "CO2",
                    name: this.$t('message.二氧化碳浓度')
                },{
                    param: "TEMP",
                    name: this.$t('message.环境温度') + '(℃)'
                },{
                    param: "HUM",
                    name: this.$t('message.湿度') + '(％)'
                },{
                    param: "SIP1T",
                    name: this.$t('message.泵1喷灌持续时间') + "(s)"
                },{
                    param: "SIP1NT",
                    name: this.$t('message.泵1下次喷灌时间') + "(m)"
                },{
                    param: "SIP2T",
                    name: this.$t('message.泵2喷灌持续时间') + "(s)"
                },{
                    param: "SIP2NT",
                    name: this.$t('message.泵2下次喷灌时间') + "(m)"
                }],
                arrPlantData:  [{
                    param: "EC",
                    name: "EC"
                },{
                    param: "PH",
                    name: "PH"
                },{
                    param: "LIQ_LV",
                    name: this.$t('message.液位') + '(cm)'
                },{
                    param: "LIQ_B_LV",
                    name: this.$t('message.回水液位') + '(cm)'
                },{
                    param: "LIQ_TEMP",
                    name: this.$t('message.液温') + '(℃)'
                },{
                    param: "W1",
                    name: this.$t('message.A液质量') + '(kg)'
                },{
                    param: "W2",
                    name: this.$t('message.B液质量') + '(kg)'
                },{
                    param: "W3",
                    name: this.$t('message.C液质量') + '(kg)'
                },{
                    param: "W4",
                    name: this.$t('message.酸质量') + '(kg)'
                },{
                    param: "W5",
                    name: this.$t('message.碱质量') + '(kg)'
                },{
                    param: "WS1",
                    name: this.$t('message.A液起始质量') + '(kg)'
                },{
                    param: "WS2",
                    name: this.$t('message.B液起始质量') + '(kg)'
                },{
                    param: "WS3",
                    name: this.$t('message.C液起始质量') + '(kg)'
                },{
                    param: "WS4",
                    name: this.$t('message.酸起始质量') + '(kg)'
                },{
                    param: "WS5",
                    name: this.$t('message.碱起始质量') + '(kg)'
                },{
                    param: "ZS1",
                    name: this.$t('message.A液蠕动泵转速') + "(m)"
                },{
                    param: "ZS2",
                    name: this.$t('message.B液蠕动泵转速') + "(m)"
                },{
                    param: "ZS3",
                    name: this.$t('message.C液蠕动泵转速') + "(m)"
                },{
                    param: "ZS4",
                    name: this.$t('message.酸液蠕动泵转速') + "(m)"
                },{
                    param: "ZS5",
                    name: this.$t('message.碱液蠕动泵转速') + "(m)"
                },{
                    param: "OUT_PRESS",
                    name: this.$t('message.出水管压力')
                },{
                    param: "CO2",
                    name: this.$t('message.二氧化碳浓度')
                },{
                    param: "TEMP",
                    name: this.$t('message.环境温度') + '(℃)'
                },{
                    param: "HUM",
                    name: this.$t('message.湿度') + '(％)'
                },{
                    param: "SIP1T",
                    name: this.$t('message.泵1喷灌持续时间') + "(s)"
                },{
                    param: "SIP1NT",
                    name: this.$t('message.泵1下次喷灌时间') + "(m)"
                },{
                    param: "EC1",
                    name: "EC1"
                },{
                    param: "EC2",
                    name: "EC2"
                },{
                    param: "PH1",
                    name: "PH1"
                },{
                    param: "PH2",
                    name: "PH2"
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
            arrParamData() {
                return this.isPlant ? this.arrPlantData : this.arrNoPlantData;
            }
        },
        components: {
            Pagination
        },
        methods: {
            handleClick(tab, event) {
                this.resetAnaChart();
            },
            // 获取参数历史
            getAnaList(page) {
                axios({
                    method: "post",
                    url: `${this.apiurl}/la/history/ana/get`,
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
                        this.total_ana = data.data.data_total;
                        data.data.data.forEach(item => {
                            let result = {
                                time: formatTime(item["time"])
                            }
                            item.ana_content.item.forEach(itm1 => {
                                result[[itm1.param_code]] = itm1["value"];
                            })
                            tb.push(result);
                        });
                        this.anaTable = tb;

                        this.resetAnaChart();
                    }
                })
            },
            getAnaList1(page) {
                axios({
                    method: "post",
                    url: `${this.apiurl}/la/history/ana/get`,
                    data: {
                        data: {
                            start_time: this.start_time,
                            end_time: this.end_time,
                            page_index: page - 1,
                            page_size: this.rows_ana
                        }
                    }
                }).then(data => {
                    if(data.data.code == 200) {
                        let tb = [];
                        // this.total_ana = data.data.data_total;
                        data.data.data.forEach(item => {
                            let result = {
                                time: formatTime(item["time"])
                            }
                            item.ana_content.item.forEach(itm1 => {
                                result[[itm1.param_code]] = itm1["value"];
                            })
                            tb.push(result);
                        });
                        this.fullData = tb;
                        this.resetAnaChart();
                    }
                })
            },
            pageChange_ana(page) {
                this.page_ana = page;
                this.getAnaList(page);
            },
            createTb(tb,arr,chartId,text="") {
                var chartDom = document.getElementById(chartId);
                var myChart = echarts.init(chartDom);
                var option;
                let xAxisData = tb.map(item => item.time);
                let computedJson = arr.map(item => {
                    let name =  this.arrParamData.filter(i=>i["param"] == item)[0].name;
                    return {
                        name,
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
                        type: 'value'
                    },
                    dataZoom:[{
                　　     type:"inside"         //详细配置可见echarts官网
                 　　}],
                    series: computedJson
                };
                option && myChart.setOption(option);
                setTimeout(()=> {
                   myChart.resize();
                });
            },
            resetAnaChart(tb) {
                if(!this.isPlant) {
                    if(!tb) {
                        tb = this.fullData;
                    }
                    this.createTb(tb,["EC"],"EC-chart");
                    this.createTb(tb,["PH"],"PH-chart");
                    this.createTb(tb,["LIQ_LV",'LIQ_B_LV'],"LIQ_LV-chart");
                    this.createTb(tb,["LIQ_TEMP"],"LIQ_TEMP-chart");
                    this.createTb(tb,[ "W1", "W2", "W3", "W4", "W5", "WS1", "WS2", "WS3", "WS4", "WS5"],"W-chart");
                    this.createTb(tb,["ZS1", "ZS2", "ZS3", "ZS4", "ZS5"],"ZS-chart");
                    this.createTb(tb,["OUT_PRESS"],"OUT_PRESS-chart");
                    this.createTb(tb,["CO2"],"CO2-chart");
                    this.createTb(tb,["TEMP"],"TEMP-chart");
                    this.createTb(tb,["HUM"],"HUM-chart");
                    this.createTb(tb,["SIP1T","SIP2T"],"SIPT-chart");
                    this.createTb(tb,["SIP1NT",  "SIP2NT"],"SIPNT-chart");
                }
            }
        },
        mounted() {
            this.getAnaList(1);
            this.getAnaList1(1);
        }
    }
</script>