<!-- 
  组件说明：本组件为历史记录组件。
  进入方式：导航 -> 历史记录
  用户权限：操作员可以使用。未登录用户或其他用户自动跳转至首页。
  其他说明：子组件的地址在同级目录History文件夹下。
-->
<template>
	<div class="ym-main">
		<a-card class="card-pd">
			<!-- 头部标题 start -->
			<PageHeader :title="$t('message.历史记录')" goBack=false></PageHeader>
			<!-- 头部标题 end -->
			<div class="space-btm">
				<!-- 下拉选项 start -->
				<el-select v-model="current" size="small" style="width: 120px" class="mobile-space-btm1" @change="handleChange">
			      <el-option :label="$t('message.模拟量历史')" value="ana"> {{$t('message.模拟量历史')}} </el-option>
			      <el-option :label="$t('message.开关量历史')" value="dig"> {{$t('message.开关量历史')}} </el-option>
			      <el-option :label="$t('message.告警历史')" value="alarm"> {{$t('message.告警历史')}} </el-option>
			      <el-option :label="$t('message.植物灯历史')" value="light"> {{$t('message.植物灯历史')}} </el-option>
			      <el-option :label="$t('message.通信历史')" value="comm"> {{$t('message.通信历史')}} </el-option>
			      <el-option :label="$t('message.参数历史')" value="param"> {{$t('message.参数历史')}} </el-option>
			    </el-select>
				<!-- 下拉选项 end -->
				<!-- 日期选择 start -->
				<el-date-picker @change="onChange" type="daterange" range-separator="至" size="small" :start-placeholder="$t('message.开始日期')" v-model="value1" :end-placeholder="$t('message.结束日期')" id="smartgrow-time-picker"></el-date-picker>
				<!-- 日期选择 end -->
			</div>
			<!-- 模拟量历史 start -->
			<Ana v-if="current === 'ana'" :rows="rows" :start_time="start_time" :end_time="end_time"></Ana>
			<!-- 模拟量历史 end -->

			<!-- 开关量历史 start -->
			<Dig v-if="current === 'dig'" :rows="rows" :start_time="start_time" :end_time="end_time"></Dig>
			<!-- 开关量历史 end -->

			<!-- 警告历史 start -->
			<Alarm v-if="current === 'alarm'" :rows="rows" :start_time="start_time" :end_time="end_time"></Alarm>
			<!-- 警告历史 end -->

			<!-- 警告历史 start -->
			<Light v-if="current === 'light'" :rows="rows" :start_time="start_time" :end_time="end_time"></Light>
			<!-- 警告历史 end -->

			<!-- 通信历史 start -->
			<Comm v-if="current === 'comm'" :rows="rows" :start_time="start_time" :end_time="end_time"></Comm>
			<!-- 通信历史 end -->

			<!-- 参数历史 start -->
			<Param v-if="current === 'param'" :rows="rows" :start_time="start_time" :end_time="end_time"></Param>
			<!-- 参数历史 end -->
		</a-card>
	</div>
</template>
<script>
	import PageHeader from "./common/PageHeader"
	import Dig from "./History/Dig"
	import Alarm from "./History/Alarm"
	import Light from "./History/Light"
	import Comm from "./History/Comm"
	import Param from "./History/Param"
	import Ana from "./History/Ana"
	import {autoJump,formatTime} from "../assets/tools/tool"
	import aCard from "./common/Acard"
	export default {
		data() {
			return {
		        current: "ana",
				start_time: "",
				end_time: "",
				rows: 24,
	      	}
		},
		computed: {
			value1: {
				get() {
					return [this.start_time,this.end_time];
				},
				set([t1,t2]) {
					t1 = new Date(t1);
					t2 = new Date(t2);
					this.start_time = `${t1.getFullYear()}-${(t1.getMonth() +1).toString().padStart(2,0)}-${t1.getDate().toString().padStart(2,0)}`;
					this.end_time = `${t2.getFullYear()}-${(t2.getMonth() +1).toString().padStart(2,0)}-${t2.getDate().toString().padStart(2,0)}`;
				}
			}
		},
		components: {
	    	PageHeader,
	    	Dig,
	    	Alarm,
	    	Comm,
	    	Param,
	    	Ana,
	    	Light,
	    	aCard
	    },
		methods: {
			// 下拉框改变
			handleChange(cur) {
				this.current = cur;
			},
			// 修改开始、结束时间
			onChange([start_time,end_time]) {
		      this.start_time = start_time;
		      this.end_time = end_time;
		    },
		    getCurrentTime() {
		    	return {
		    		start_time : new Date((new Date() - 24 * 60 * 60 * 1000)).toISOString(),
		    		end_time: new Date().toISOString()
		    	}
		    }
		},
		mounted() {
			this.start_time = this.getCurrentTime().start_time;
			this.end_time = this.getCurrentTime().end_time;
			autoJump(1);
		}
	}
</script>