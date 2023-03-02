<!-- 
	组件说明： 本组件为查看培植记录组件。
	进入方式： 方案管理 -> 培植记录。
	用户权限： 操作员可以使用。未登录用户或其他用户自动跳转至首页。
 -->
<template>
	<div class="ym-main">
		<a-card class="card-pd">
			<!-- 头部标题 start -->
			<PageHeader :title="$t('message.培植记录')" goBack="true"></PageHeader>
			<!-- 头部标题 end -->
			<!-- 导出excel start -->
			<el-button type="primary" v-if="!isMobile" size="small" @click="downloadExl" class="space-btm1">{{$t('message.导出excel')}}</el-button>
			<!-- 导出excel end -->
			<!-- 表格 start -->
			<el-table ref="multipleTable" :data="recordList" border stripe size="small" tooltip-effect="dark">
			    <el-table-column prop="plant" :label="$t('message.育苗名称')"></el-table-column>
			    <el-table-column prop="scheme_name" :label="$t('message.方案名称')"></el-table-column>
			    <el-table-column prop="grow_cycle" :label="$t('message.生产周期(天)')" width="100"></el-table-column>
			    <el-table-column prop="start_time" :label="$t('message.开始时间')"></el-table-column>
			    <el-table-column prop="finish_time" :label="$t('message.结束时间')"></el-table-column>
			    <el-table-column prop="record_time" :label="$t('message.记录时间')"></el-table-column>
			    <el-table-column prop="status" :label="$t('message.状态')"></el-table-column>
			    <el-table-column prop="remark" :label="$t('message.评价')"></el-table-column>
			</el-table>
			<!-- 表格 end -->
		</a-card>
	</div>
</template>
<script>
	import PageHeader from "./common/PageHeader"
	import download from "../assets/tools/downloadExcel"
	import {autoJump} from "../assets/tools/tool"
	import aCard from "./common/Acard"
	export default {
		components: {
	    	PageHeader,
	    	aCard
	    },
	    computed: {
	    	// 培植记录
            recordList() {
            	return this.$store.state.recordList;
            },
            isMobile() {
                return this.$store.state.isMobile;
            },
	    },
	    methods: {
	    	// 获取培植记录
	    	getRecordList() {
	    		this.$store.dispatch("getRecordList",{
					plant: this.$route.query.plant,
		            scheme_name: this.$route.query.scheme_name,
		            start_time: "",
		            end_time: ""
				});
	    	},
	    	// 导出excel
	    	downloadExl() {
	    		let result = this.recordList.map(item=> {
	    			return {
		    			"育苗名称": item.plant,
		    			"方案名称": item.scheme_name,
		    			"生产周期(天)": item.grow_cycle,
		    			"开始时间": item.start_time,
		    			"结束时间": item.finish_time,
		    			"记录时间": item.record_time,
		    			"评价": item.remark,
		    			"状态": item.status,
	    			}
	    		})
			    download(result, this.$route.query.scheme_name + '的培植记录列表.xlsx');
	    	}
	    },
		mounted() {
			this.getRecordList();
			autoJump(1);
		}
	}
</script>