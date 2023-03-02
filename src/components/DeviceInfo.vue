<!-- 
  组件说明：本组件为设备信息组件。
  进入方式：导航-> 设备信息
  用户权限：操作员可以使用。未登录用户或其他用户自动跳转至首页。
-->
<template>
	<div class="ym-main">
		<a-card class="card-pd">
			<!-- 标题 start -->
			<PageHeader title="设备状态" goBack=false></PageHeader>
			<!-- 标题 end -->
			<el-tabs v-model="activeName" class="mobile-el-tabs">
				<!-- 模拟量 start -->
			    <el-tab-pane :label="$t('message.模拟量列表')" name="list1">
			    	<el-table ref="multipleTable" :data="tableDataAna" border stripe size="small" tooltip-effect="dark">
						<el-table-column prop="param_id" :label="$t('message.序号')" width="50"></el-table-column>
						<el-table-column prop="param_code" :label="$t('message.代码')" :width="mobileTdWidth1"></el-table-column>
						<!-- <el-table-column :width="normalMobileWidth" prop="name" :label="$t('message.参数项')" style="width: 100px;"></el-table-column> -->
						<el-table-column prop="value" :label="$t('message.当前值')"></el-table-column>
					</el-table>
			    </el-tab-pane>
			    <!-- 模拟量 end -->
			    <!-- 开关量 start -->
			    <el-tab-pane :label="$t('message.开关量列表')" name="list2">
			    	<el-table ref="multipleTable" :data="tableDataDig" border stripe size="small" tooltip-effect="dark">
						<el-table-column prop="param_id" :label="$t('message.序号')" width="50"></el-table-column>
						<el-table-column prop="param_code" :label="$t('message.代码')"></el-table-column>
						<!-- <el-table-column prop="name" :label="$t('message.参数项')" style="width: 100px;"></el-table-column> -->
						<el-table-column prop="value" :label="$t('message.当前值')">
							<template slot-scope="scope">
					    		<div :style="{color: (scope.row.value == $t('message.关') ? 'red' : 'green')}">{{scope.row.value}} </div>
					    	</template>
						</el-table-column>
					</el-table>
			    </el-tab-pane>
			    <!-- 开关量 end -->
			    <!-- 告警 start -->
			    <el-tab-pane :label="$t('message.告警列表')" name="list3">
			    	<el-table ref="multipleTable" :data="tableDataAlarm" border stripe size="small" tooltip-effect="dark">
						<el-table-column prop="param_id" :label="$t('message.序号')" width="50"></el-table-column>
						<el-table-column prop="param_code" :label="$t('message.代码')"></el-table-column>
						<!-- <el-table-column prop="name" :label="$t('message.参数项')" style="width: 100px;"></el-table-column> -->
						<el-table-column prop="value" :label="$t('message.当前值')">
							<template slot-scope="scope">
					    		<div :style="{color: (scope.row.value == $t('message.异常') ? 'red' : 'green')}">{{scope.row.value}} </div>
					    	</template>
						</el-table-column>
					</el-table>
			    </el-tab-pane>
			    <!-- 告警 end -->
			    <!-- 传感器通信状态 start -->
			    <el-tab-pane :label="$t('message.传感器通信状态列表')" name="list4">
			    	<el-table ref="multipleTable" :data="tableDataComm" border stripe size="small" tooltip-effect="dark">
						<el-table-column prop="param_id" :label="$t('message.序号')" width="50"></el-table-column>
						<el-table-column prop="param_code" :label="$t('message.代码')"></el-table-column>
						<!-- <el-table-column prop="name" :label="$t('message.参数项')" style="width: 100px;"></el-table-column> -->
						<el-table-column prop="value" :label="$t('message.当前值')">
							<template slot-scope="scope">
					    		<div :style="{color: (scope.row.value == $t('message.异常') ? 'red' : 'green')}">{{scope.row.value}} </div>
					    	</template>
						</el-table-column>
					</el-table>
			    </el-tab-pane>
			    <!-- 传感器通信状态 end -->
			    <!-- 版本信息 start -->
			    <el-tab-pane :label="$t('message.版本信息')" name="list5">
			    	<el-table ref="multipleTable" :data="tableDataVersion" border stripe size="small" tooltip-effect="dark">
			    		<el-table-column prop="dev_id" :label="$t('message.序号')" width="50"></el-table-column>
						<el-table-column prop="hardwareVersion" :label="$t('message.硬件版本')"></el-table-column>
						<el-table-column prop="softwareVersion" :label="$t('message.软件版本')"></el-table-column>
			    	</el-table>
			    </el-tab-pane>
			    <!-- 版本信息 end -->
			    <!-- 灯控装置版本 start -->
			    <el-tab-pane :label="$t('message.灯控装置版本信息')" name="list6">
			    	<el-table ref="multipleTable" :data="tableDataSeedlingLight" border stripe size="small" tooltip-effect="dark">
						<el-table-column prop="dev_id" :label="$t('message.序号')" width="50"></el-table-column>
						<el-table-column prop="hardwareVersion" :label="$t('message.硬件版本')"></el-table-column>
						<el-table-column prop="softwareVersion" :label="$t('message.软件版本')"></el-table-column>
					</el-table>
			    </el-tab-pane>
			    <!-- 灯控装置版本 end -->
			  </el-tabs>
		</a-card>
	</div>
</template>
<script>
	import PageHeader from "./common/PageHeader"
	import axios from 'axios'
	import aCard from "./common/Acard"
	import {autoJump} from "../assets/tools/tool"
	export default {
		data() {
			return {
		        tableDataAna: [],
		        tableDataDig: [],
		        tableDataAlarm: [],
		        tableDataComm: [],
		        tableDataSeedlingLight: [],
		        tableDataVersion: [],
		        activeName: 'list1'
	      	}
		},
		components: {
	    	PageHeader,
	    	aCard
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
            normalMobileWidth() {
            	return this.isMobile ? "100" : "auto";
            },
            mobileTdWidth1() {
            	return this.isMobile ? "150" : "auto";
            }
	    },
	    methods: {
	    	// 获取仪表盘主体信息
		    info() {
		        axios({
		            method: 'post',
		            url: `${this.apiurl}/la/run/info`,
		            data: {
		    			data: {
						    dev_id: "1"
						}
		    		}
		        }).then(data=> {
		          if(data.data.code == 200) {
		          	this.tableDataVersion = [];
		          	this.tableDataSeedlingLight = [];
		            this.tableDataAna = data.data.data.ana["item"];
		            this.tableDataDig = data.data.data.dig["item"];
		            this.tableDataDig = this.tableDataDig.map(item => {
		            	item.value = item.value ? this.$t('message.开') : this.$t('message.关');
		            	return item;
		            });
		            // 告警0：正常
		            this.tableDataAlarm = data.data.data.alarm["item"];
		            this.tableDataAlarm = this.tableDataAlarm.map(item => {
		            	item.value = item.value ? this.$t('message.异常') : this.$t('message.正常');
		            	return item;
		            });
		            // 通信 1：正常
		            this.tableDataComm = data.data.data.comm["item"];
		            this.tableDataComm = this.tableDataComm.map(item => {
		            	item.value = item.value ? this.$t('message.正常') : this.$t('message.异常');
		            	return item;
		            });
		            this.tableDataSeedlingLight = this.isPlant ? Object.values(data.data.data.plant_light["ver"]) : Object.values(data.data.data.seedling_light["ver"]);
		            this.tableDataVersion.push(data.data.data.version);
		          }
		        })
		    },
		},
		mounted() {
			setInterval(()=> {
				this.info();
			},1000);
			this.info();
			autoJump(1);
		}
	}
</script>