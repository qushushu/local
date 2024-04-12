<!-- 
  组件说明： 本组件为查看阶段页面。
  进入方式： 导航 -> 方案管理 -> 某一条目下查看阶段。
  用户权限： 操作员可以使用。未登录用户或其他用户自动跳转至首页。
-->
<template>
	<div class="ym-main">
		<a-card class="card-pd">
			<!-- 头部标题 start -->
			<PageHeader :title="$t('message.查看阶段')" goBack=true></PageHeader>
			<!-- 头部标题 end -->
			<!-- 导出excel start -->
			<el-button type="primary" v-if="!isMobile" size="small" @click="downloadExl" :disabled="!!!tableData.length" class="space-btm1">{{$t('message.导出excel')}}</el-button>
			<!-- 导出excel end -->
			<!-- 数据表格 start -->
			<el-table ref="multipleTable" :data="tableData" height="300" border stripe size="small" empty-text tooltip-effect="dark" class="space-btm">
				<el-table-column size="small" v-for="item,key in colList" :key="key" :prop="item.prop" :label="item.label"></el-table-column>
			</el-table>
			<!-- 数据表格 end -->
			<!-- 编辑按钮 start -->
			<el-button type="primary" size="small" @click="handleEdit">{{$t('message.编辑')}}</el-button>
			<!-- 编辑按钮 end -->
		</a-card>
	</div>
</template>
<script>
	import PageHeader from "./common/PageHeader"
	import axios from 'axios'
	import aCard from "./common/Acard"
	import download from "../assets/tools/downloadExcel"
	import {minuteToTime,timeToMinute,autoJump} from "../assets/tools/tool.js"
	export default {
		data() {
			return {
				id: 0,
				scheme_name: "",
		        tableData: [],
	      	}
		},
		components: {
	    	PageHeader,
	    	aCard
	    },
	    computed: {
	    	apiurl() {
                return this.$store.state.apiurl;
            },
            colList() {
            	return [{
		        	prop: "stage_name",
		        	label: this.$t('message.阶段名称'),
		        },{
	        		prop: "DAY_OFFSET",
		        	label: this.$t('message.天数'),
		        },{
	        		prop: "EC_TV",
		          	label: this.$t('message.EC'),
		        },{
		        	prop: "PH_TV",
		          	label: this.$t('message.PH'),
		        },{
		        	prop: "SUNRIZE",
		          	label: this.$t('message.日出时间'),
		        },{
		        	prop: "SUNSET",
		          	label: this.$t('message.日落时间'),
		        },{
		        	prop: "TEMP_DAY",
			        label: this.$t('message.日间温度'),
		        },{
		        	prop: "TEMP_NIGHT",
		          	label: this.$t('message.夜间温度'),
		        },{
		        	prop: "HUM_DAY",
		          	label: this.$t('message.日间湿度'),
		        },{
		        	prop: "HUM_NIGHT",
		          	label: this.$t('message.夜间湿度'),
		        },{
		        	prop: "CO2",
		          	label: this.$t('message.CO2浓度'),
		        },{
		        	prop: "LIQ_TEMP",
		          	label: this.$t('message.营养液温度'),
		        }];
			},
			isMobile() {
                return this.$store.state.isMobile;
            },
	    },
	    methods: {
	    	// 获取数据
	    	getList() {
	    		axios({
	    			method: "post",
	    			url: `${this.apiurl}/la/plant/get`,
	    			data: {
	    				data: {
	    					id: this.id
	    				}
	    			}
	    		}).then(data => {
	    			if(data.data.code == 200) {
	    				data.data.data.stage_item.forEach(item => {
		    				const itm = {...item.stage_content[0]};
		    				itm.SUNRIZE = minuteToTime(itm.SUNRIZE);
		    				itm.SUNSET = minuteToTime(itm.SUNSET);
		    				this.tableData.push(itm);
	    				});
	    			}
	    		})
	    	},
	    	// 点击编辑按钮跳转页面
	    	handleEdit() {
	    		this.$router.push("/PlanStage?id=" + this.id);
	    	},
	    	// 下载eccel
	    	downloadExl() {
                let baseJson = {
                    "阶段名称" : "阶段名称",
                    "天数" : "DAY_OFFSET",
                    "EC" : "EC_TV",
                    "PH" : "PH_TV",
                    "日出时间" :"SUNRIZE",
                    "日落时间" : "SUNSET",
                    '日间温度' : "TEMP_DAY",
                    '夜间温度' : "TEMP_NIGHT",
                    '日间湿度' : "HUM_DAY",
                    '夜间湿度' : "HUM_NIGHT",
                    'CO2浓度' : "CO2",
                    '营养液温度' : "LIQ_TEMP"
                };
			    let result = this.tableData.map(item => {
			    	const nodataText="--";
			    	let {stage_name,DAY_OFFSET,EC_TV,PH_TV,SUNRIZE,SUNSET,TEMP_DAY,TEMP_NIGHT,HUM_DAY,HUM_NIGHT,CO2,LIQ_TEMP} = item;
			    	return {
			    		"阶段名称" : stage_name || nodataText,
			    		"天数" : DAY_OFFSET || nodataText,
			    		"EC" : EC_TV || nodataText,
			    		"PH" : PH_TV || nodataText,
			    		"日出时间" : SUNRIZE || nodataText,
			    		"日落时间" : SUNSET || nodataText,
			    		'日间温度' : TEMP_DAY || nodataText,
			    		'夜间温度' : TEMP_NIGHT || nodataText,
			    		'日间湿度' : HUM_DAY || nodataText,
			    		'夜间湿度' : HUM_NIGHT || nodataText,
			    		'CO2浓度' : CO2 || nodataText,
			    		'营养液温度' : LIQ_TEMP || nodataText
			    	}
			    });
                result.unshift(baseJson);
			    download(result, this.scheme_name +'方案阶段列表.xlsx');
	    	},
		},
		mounted() {
	    	this.id = this.$route.query.id;
	    	this.scheme_name = this.$route.query.scheme_name;
	    	this.getList();
	    	autoJump(1);
		},
	}
</script>