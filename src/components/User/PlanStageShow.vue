<!-- 
  组件说明： 本组件为查看阶段页面。
  进入方式： 操作员登录后点击导航栏"方案管理"后在任一条目下点击"查看阶段"按钮进入。
  用户权限： 操作员可以使用。
-->
<template>
	<div class="ym-main">
	    <!-- 本地版编号 start -->
        <slot name="dev_no" v-if="!isWeb"></slot>
        <slot name="current_pos" v-if="isWeb"></slot>
        <!-- 本地版编号 end -->
		<a-card class="card-pd">
			<!-- 头部标题 start -->
			<PageHeader :title="$t('message.查看阶段')" goBack=true></PageHeader>
			<!-- 头部标题 end -->
			<!-- 导出excel start -->
			<el-button type="primary" size="small" @click="downloadExl" :disabled="!!!tableData.length" class="space-btm1" v-if="!isMobile">{{$t('message.导出excel')}}</el-button>
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
	import download from "../../assets/tools/downloadExcel"
	import {minuteToTime,timeToMinute} from "../../assets/tools/tool.js"
	import {get_plant} from "../../store/ajax.js"
	import projectJson from "../../config/project/config"
	let {isWeb} = projectJson;
	export default {
		data() {
			return {
				id: 0,
				scheme_name: "",
		        tableData: [],
	      	}
		},
	    computed: {
            colList() {
            	return [{
		        	prop: "stage_name",
		        	label: this.$t('message.阶段名称'),
		        },{
	        		prop: "DAY_OFFSET",
		        	label: this.$t('message.天数'),
		        },{
	        		prop: "EC_TV",
		          	label: 'EC',
		        },{
		        	prop: "PH_TV",
		          	label: "PH",
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
			isMobile() {return this.$store.state.isMobile},
            isWeb() {return isWeb}
	    },
	    methods: {
	    	// 获取数据
	    	async getList() {
	    		let res = await get_plant(this.id);
	    		if(res) {
	    			res.stage_item.forEach(item => {
	    				const itm = {...item.stage_content[0]};
	    				itm.SUNRIZE = minuteToTime(itm.SUNRIZE);
	    				itm.SUNSET = minuteToTime(itm.SUNSET);
	    				this.tableData.push(itm);
    				});
	    		}
	    	},
	    	// 点击编辑按钮跳转页面
	    	handleEdit() {
	    		this.$router.push({
	    			path: "/PlanStage",
	    			query: {
	    				id: this.id
	    			}
	    		});
	    	},
	    	// 下载eccel
	    	downloadExl() {
                let baseJson = {
                    [this.$t('message.阶段名称')] : "阶段名称",
                    [this.$t('message.天数')] : "DAY_OFFSET",
                    "EC" : "EC_TV",
                    "PH" : "PH_TV",
                    [this.$t('message.日出时间')] :"SUNRIZE",
                    [this.$t('message.日落时间')] : "SUNSET",
                    [this.$t('message.日间温度')] : "TEMP_DAY",
                    [this.$t('message.夜间温度')] : "TEMP_NIGHT",
                    [this.$t('message.日间湿度')] : "HUM_DAY",
                    [this.$t('message.夜间湿度')] : "HUM_NIGHT",
                    [this.$t('message.CO2浓度')] : "CO2",
                    [this.$t('message.营养液温度')] : "LIQ_TEMP"
                };
			    let result = this.tableData.map(item => {
			    	const nodataText="--";
			    	let {stage_name,DAY_OFFSET,EC_TV,PH_TV,SUNRIZE,SUNSET,TEMP_DAY,TEMP_NIGHT,HUM_DAY,HUM_NIGHT,CO2,LIQ_TEMP} = item;
			    	return {
			    		[this.$t('message.阶段名称')] : stage_name || nodataText,
			    		[this.$t('message.天数')] : DAY_OFFSET || nodataText,
			    		"EC" : EC_TV || nodataText,
			    		"PH" : PH_TV || nodataText,
			    		[this.$t('message.日出时间')] : SUNRIZE || nodataText,
			    		[this.$t('message.日落时间')] : SUNSET || nodataText,
			    		[this.$t('message.日间温度')] : TEMP_DAY || nodataText,
			    		[this.$t('message.夜间温度')] : TEMP_NIGHT || nodataText,
			    		[this.$t('message.日间湿度')] : HUM_DAY || nodataText,
			    		[this.$t('message.夜间湿度')] : HUM_NIGHT || nodataText,
			    		[this.$t('message.CO2浓度')] : CO2 || nodataText,
			    		[this.$t('message.营养液温度')] : LIQ_TEMP || nodataText
			    	}
			    });
                result.unshift(baseJson);
			    download(result, this.scheme_name +' Scheme Stage List.xlsx');
	    	},
		},
		mounted() {
	    	this.id = this.$route.query.id;
	    	this.scheme_name = this.$route.query.scheme_name;
	    	this.getList();
		},
	}
</script>