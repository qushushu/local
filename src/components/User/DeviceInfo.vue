<!-- 
  组件说明：本组件为设备信息组件。
  进入方式：操作员登录后点击导航栏"设备信息"进入
  用户权限：操作员可以使用。
-->
<template>
	<div class="ym-main">
		<!-- 顶部编号 start -->
        <slot name="currentNum"></slot>
        <!-- 顶部编号 end -->
		<a-card class="card-pd">
			<!-- 标题 start -->
			<PageHeader :title="$t('message.全部参数')"></PageHeader>
			<!-- 标题 end -->
			<el-tabs v-model="activeName" class="mobile-el-tabs">
				<!-- 模拟量 start -->
			    <el-tab-pane :label="$t('message.模拟量列表')" name="tabInit">
			    	<el-table :data="tableDataAna" border size="small">
	                    <el-table-column prop="id" :label="$t('message.序号')" width="100"></el-table-column>
						<el-table-column prop="name" :label="$t('message.名称')"></el-table-column>
	                    <el-table-column prop="code" :label="$t('message.代码')" width="150"></el-table-column>
	                    <el-table-column prop="value" :label="$t('message.当前值')"></el-table-column>
						<el-table-column prop="unit" :label="$t('message.单位')"></el-table-column>
					</el-table>
			    </el-tab-pane>
			    <!-- 模拟量 end -->
			    <!-- 开关量 start -->
			    <el-tab-pane :label="$t('message.开关量列表')">
			    	<el-table :data="tableDataDig" border size="small">
						<el-table-column prop="id" :label="$t('message.序号')" width="100"></el-table-column>
						<el-table-column prop="name" :label="$t('message.名称')"></el-table-column>
						<el-table-column prop="code" :label="$t('message.代码')" width="150"></el-table-column>
						<el-table-column prop="value" :label="$t('message.当前值')">
							<template slot-scope="scope">
					    		<div :style="{color: (scope.row.value == 0 ? 'red' : 'green')}">{{scope.row.value == 0 ? scope.row.b0 : (scope.row.value == 1 ? scope.row.b1 : '--')}} </div>
					    	</template>
						</el-table-column>
					</el-table>
			    </el-tab-pane>
			    <!-- 开关量 end -->
			    <!-- 告警 start -->
			    <el-tab-pane :label="$t('message.告警列表')">
			    	<el-table :data="tableDataAlarm" border size="small">
						<el-table-column prop="id" :label="$t('message.序号')" width="100"></el-table-column>
						<el-table-column prop="name" :label="$t('message.名称')"></el-table-column>
						<el-table-column prop="code" :label="$t('message.代码')" width="150"></el-table-column>
						<el-table-column prop="value" :label="$t('message.当前值')">
							<template slot-scope="scope">
					    		<div :style="{color: (scope.row.value == 0 ? 'green' : 'red')}">{{scope.row.value == 0 ? '√' : (scope.row.value == 1 ? '×' : '--')}} </div>
					    	</template>
						</el-table-column>
					</el-table>
			    </el-tab-pane>
			    <!-- 告警 end -->
			    <!-- 传感器通信状态 start -->
			    <el-tab-pane :label="$t('message.传感器通信状态列表')">
			    	<el-table :data="tableDataComm" border size="small">
						<el-table-column prop="id" :label="$t('message.序号')" width="100"></el-table-column>
						<el-table-column prop="name" :label="$t('message.名称')"></el-table-column>
						<el-table-column prop="code" :label="$t('message.代码')" width="150"></el-table-column>
						<el-table-column prop="value" :label="$t('message.当前值')">
							<template slot-scope="scope">
					    		<div :style="{color: (scope.row.value == 1 ? 'green' : 'red')}">{{scope.row.value == 1 ? '√' : (scope.row.value == 0 ? '×' : '--')}} </div>
					    	</template>
						</el-table-column>
					</el-table>
			    </el-tab-pane>
			    <!-- 传感器通信状态 end -->
			    <!-- 版本信息 start -->
			    <el-tab-pane :label="$t('message.版本信息')">
			    	<el-table :data="tableDataVersion" border size="small">
						<el-table-column prop="hardwareVersion" :label="$t('message.硬件版本')"></el-table-column>
						<el-table-column prop="softwareVersion" :label="$t('message.软件版本')"></el-table-column>
			    	</el-table>
			    </el-tab-pane>
			    <!-- 版本信息 end -->
			    <!-- 灯控装置版本 start -->
			    <el-tab-pane :label="$t('message.灯控装置版本信息')">
			    	<el-table :data="tableDataSeedlingLight" border size="small">
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
	import {runInfoMixin} from "./mixins/runinfo"
	import {autoUpdateMixin} from "./mixins/autoUpdate"
	export default {
		data() {
			return {
		        activeName: 'tabInit'
	      	}
		},
		mixins: [runInfoMixin,autoUpdateMixin]
	}
</script>