<!-- 
  组件说明： 本组件为设置阶段组件。
  进入方式： 导航 -> 方案管理 -> 某一条目下查看阶段 -> 底部编辑按钮。
  用户权限： 操作员可以使用。未登录用户或其他用户自动跳转至首页。
-->
<template>
	<div class="ym-main">
		<a-card class="card-pd">
			<!-- 头部标题 start -->
			<PageHeader :title="$t('message.设置阶段')" goBack=true></PageHeader>
			<!-- 头部标题 end -->
			<el-row :gutter="4" v-if="stageList.length" class="space-btm">
                <!-- 左侧阶段设置 start -->
                <el-col :lg="10" :md="10" :sm="10" class="planstage-mobile-p1">
                    <div style="padding-right: 8px;">
                        <el-table :data="stageList" border size="small" id="planListTable" :row-class-name="tableRowClassName" :highlight-current-row="true">
                            <!-- 阶段名称 start -->
                            <el-table-column prop="stage_content[0].stage_name" :label="$t('message.阶段名称')">
                                <template slot-scope="scope">
                                    <el-input type="text" @focus="changeCurrentSort(scope)" :placeholder="$t('message.请输入内容')" v-model="scope.row.stage_content[0].stage_name" maxlength="10" show-word-limit style="width: 99%" size="small" /> 
                                </template>
                            </el-table-column>
                            <!-- 阶段名称 end -->
                            <!-- 阶段备注 start -->
                            <el-table-column prop="remark" :label="$t('message.阶段备注')">
                                <template slot-scope="scope">
                                    <el-input type="text" :placeholder="$t('message.请输入内容')" @focus="changeCurrentSort(scope)" v-model="scope.row.remark" maxlength="10" show-word-limit style="width: 99%" size="small"> </el-input>
                                </template>
                            </el-table-column>
                            <!-- 阶段备注 end -->
                            <!-- 操作 start -->
                            <el-table-column prop="edit" :label="$t('message.操作')" width="80">
                                <template slot-scope="scope">
                                    <el-button size="small" @click="handleDelete(scope)">{{$t('message.删除')}}</el-button>
                                </template>
                            </el-table-column>
                            <!-- 操作 end -->
                        </el-table>
                    </div>
                </el-col>
                <!-- 左侧阶段设置 end -->
                <!-- 右侧参数设置 start -->
                <el-col :lg="14" :md="14" :sm="14" class="planstage-mobile-p2">
                    <div style="padding-left: 8px;">
                        <el-table ref="multipleTable" :data="tableData" height="300" border stripe size="small" tooltip-effect="dark">
                            <el-table-column prop="cs" :label="$t('message.参数')" size="small"></el-table-column>
                            <el-table-column prop="csz" :label="$t('message.参数值')" size="small">
                                <template slot-scope="scope">
                                    <el-input :placeholder="$t('message.请输入内容')" size="small" v-model="scope.row.csz" @input="handleInputText(scope.row.csz,scope.row)"></el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
                <!-- 右侧参数设置 end -->
            </el-row>
			<!-- 空数据 start -->
			<el-empty v-if="!stageList.length" :description="$t('message.暂无数据')" class="space-btm" />
			<!-- 空数据 end -->
			<!-- 功能按钮 start -->
			<div>
				<!-- 新增 start -->
				<el-button type="primary" size="small" @click="handleCreate">{{$t('message.新增')}}</el-button>
				<!-- 新增 end -->
				<!-- 导入按钮 start -->
				<label v-if="!isMobile"><span class="nmbtn">{{$t('message.导入excel')}}</span><input type="file" @change="importExcel" style="display: none;"></label>
				<!-- 导入按钮 end -->
				<!-- 保存 start -->
				<el-button type="default" size="small" @click="save" v-loading.fullscreen.lock="fullscreenLoading">{{$t('message.保存')}}</el-button>
				<!-- 保存 end -->
			</div>
			<!-- 功能按钮 end -->
		</a-card>
	</div>
</template>
<style scoped>
	.nmbtn {padding: 9px 15px; font-size: 12px; display: inline-block; line-height: 1;  cursor: pointer; background: #e6a23c; border: 1px solid #e6a23c; color: #FFF;  transition: .1s; user-select: none; border-radius: 4px;}
    .nmbtn:hover { border-color: #ebb563; background-color: #ebb563; }
</style>
<script>
	import PageHeader from "./common/PageHeader"
	import axios from 'axios'
	import aCard from "./common/Acard"
	import {autoJump} from "../assets/tools/tool"
	import * as XLSX from "XLSX"
	export default {
		data() {
			return {
				fullscreenLoading: false,   // loading
				id: 0,
				stageList: [],  // 左侧阶段列表详情
		        tableData: [   // 右侧参数详情
		        {
	        		ename: "DAY_OFFSET",
		        	cs: this.$t('message.天数'),
		        	csz: '',
		        },{
	        		ename: "EC_TV",
		          	cs: 'EC',
		          	csz: '',
		        },{
		        	ename: "PH_TV",
		          	cs: 'PH',
		          	csz: '',
		        },{
		        	ename: "SUNRIZE",
		          	cs: this.$t('message.日出时间'),
		          	csz: '',
		        },{
		        	ename: "SUNSET",
		          	cs: this.$t('message.日落时间'),
		          	csz: '',
		        },{
		        	ename: "TEMP_DAY",
			        cs: this.$t('message.日间温度'),
			        csz: '',
		        },{
		        	ename: "TEMP_NIGHT",
		          	cs: this.$t('message.夜间温度'),
		          	csz: '',
		        },{
		        	ename: "HUM_DAY",
		          	cs: this.$t('message.日间湿度'),
		          	csz: '',
		        },{
		        	ename: "HUM_NIGHT",
		          	cs: this.$t('message.夜间湿度'),
		          	csz: '',
		        },{
		        	ename: "CO2",
		          	cs: this.$t('message.CO2浓度'),
		          	csz: '',
		        },{
		        	ename: "LIQ_TEMP",
		          	cs: this.$t('message.营养液温度'),
		          	csz: '',
		        }],
		        curStageSort: 0,
		        currentIndex: 0,   // 用于标记高亮行
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
            isMobile() {
                return this.$store.state.isMobile;
            },
	    },
	    methods: {
	    	// 设置高亮行
	    	tableRowClassName({row, rowIndex}) {
	    		return (rowIndex === this.currentIndex) ? "warning-row" : "";
		    },
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
	    				this.stageList = data.data.data.stage_item;
	    				this.stageList.length && this.viewDetail(this.stageList[this.currentIndex]);
	    			}
	    		})
	    	},
	    	// 鼠标定位左侧输入框时查看右侧阶段参数
	    	changeCurrentSort(scope) {
	    		this.currentIndex = scope.$index;
	    		this.curStageSort = scope.row.sort_index;
	    		this.viewDetail(scope.row);
	    	},
	    	// 查看阶段内的参数
	    	viewDetail(item) {
	    		this.curStageSort = item.sort_index;
	    		let json = item.stage_content[0];
	    		this.tableData.forEach(item => {
	    			if(item.ename in json) {
	    				item.csz = json[item.ename];
	    			}
	    		})
	    	},
	    	// 新增阶段
	    	handleCreate() {
	    		// 获取最大的id
	    		let sort_max = this.stageList.length ? Math.max(...this.stageList.map(item => item.sort_index)): 0;
	    		this.stageList.push({
	    			id: "",
	    			plant_id: this.id,
	    			sort_index: sort_max + 1,
					remark: "",
					stage_content: [{
						DAY_OFFSET: "",
						EC_TV: "",
						PH_TV: "",
						SUNRIZE: "",
						SUNSET: "",
						TEMP_DAY: "",
						TEMP_NIGHT: "",
						HUM_DAY: "",
						HUM_NIGHT: "",
						CO2: "",
						LIQ_TEMP: "",
					}]
	    		});
	    	},
	    	// 修改参数值
	    	handleInputText(value,d2) {
	    		let tarJson = this.stageList.filter(item => item.sort_index == this.curStageSort);
	    		tarJson[0].stage_content[0][d2.ename] = value;
	    	},
	    	// 保存阶段
	    	save() {
	    		let plant_id = this.id;
	    		let stage_item = this.stageList;
	    		let stageNameList = stage_item.map(item=> item.stage_content[0].stage_name);
	    		if(stageNameList.includes("")) {
	    			this.$message.error(this.$t('message.保存失败，阶段名称不能为空值！'));
	    			return;
	    		}
	    		let tmpSet = new Set([...stageNameList])
	    		let len1 = stageNameList.length;
	    		let len2 = tmpSet.size;
	    		if(len1 !== len2) {
	    			this.$message.error(this.$t('message.保存失败，有重复阶段名称！'));
	    			return;
	    		}
	    		this.fullscreenLoading = true;
	    		axios({
	    			method: "post",
	    			url: `${this.apiurl}/la/plant/stage/save`,
	    			data: {
	    				data: {
	    					plant_id,
							stage_item
	    				}
	    			}
	    		}).then(data => {
	    			if(data.data.code == 200) {
	    				this.$message({
			              type: 'success',
			              message: this.$t('message.修改成功')
			            });
			            this.getList();
			            this.fullscreenLoading = false;
	    			}
	    		})
	    	},
	    	// 删除阶段
	    	handleDelete(scope) {
	    		this.stageList = this.stageList.filter(item => item !== scope.row);
	    		;
	    		if(this.stageList.length) {
		    		if(scope.$index >= this.stageList.length) {
		    			this.currentIndex = this.stageList.length - 1;
		    			this.viewDetail(this.stageList[this.currentIndex]);
		    		} else {
			    		if(this.currentIndex == scope.$index) {
			    			if(this.stageList.length == 1) {
			    				this.currentIndex = 0;
			    				this.viewDetail(this.stageList[0]);
			    			} else if(this.stageList.length > 0) {
			    				this.viewDetail(this.stageList[this.currentIndex]);
			    			}
			    		} 
		    		}
	    		}
	    	},
	    	// 导入excel
	    	importExcel(e) {
	    		let _this = this;
	    		let file = e.target.files[0];
				if(!/sheet/.test(file.type)) {
					this.$message({
		              type: 'error',
		              message: this.$t('message.文件类型不正确')
		            });
		            return;
				}
				this.$confirm(this.$t('message.确认导入该文件（导入文件后原有的阶段都会被清空）？'), this.$t('message.确认信息'), {
		          distinguishCancelAndClose: true,
		          confirmButtonText: this.$t('message.确认'),
		          cancelButtonText: this.$t('message.取消')
		        }).then(()=> {
		        	const fileReader = new FileReader();
					fileReader.readAsBinaryString(file);
					let _this = this;
					fileReader.onload = function(event) {
						try {
							const { result } = event.target;
				            const workbook = XLSX.read(result, { type: 'binary' });
				            let data = [];
				            for (const sheet in workbook.Sheets) {
					            if (workbook.Sheets.hasOwnProperty(sheet)) {
					                data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
					            }
							}
							let plant_id = String(_this.id);
							data.shift();
							let stage_item = data.map((item,key)=> {
								let id = "";
								let remark = "";
								let sort_index = key + 1;
								return {
									id,
									plant_id,
									remark,
									sort_index,
									stage_content: [{
										CO2: item["CO2浓度"],
										DAY_OFFSET: item["天数"],
										EC_TV: item["EC"],
										HUM_DAY: item["日间湿度"],
										HUM_NIGHT: item["夜间湿度"],
										LIQ_TEMP: item["营养液温度"],
										PH_TV: item["PH"],
										SUNRIZE: item["日出时间"],
										SUNSET: item["日落时间"],
										TEMP_DAY: item["日间温度"],
										TEMP_NIGHT: item["夜间温度"],
										stage_name: item["阶段名称"]
									}]
								}
							});
							let res = {
								data: {
									plant_id,
									stage_item
								}
							}
							axios({
				          		method: "post",
				          		url: `${_this.apiurl}/la/plant/stage/save`,
				          		data: res
				          	}).then(data => {
				          		_this.$message({
					              type: 'success',
					              message: this.$t('message.导入成功')
					            });
					            _this.getList();
					            e.target.value="";
				          	})
						} catch(e) {
							_this.$message({
				              type: 'error',
				              message: this.$t('message.导入失败')
				            });
						}
					}
				});
	    	},
		},
		mounted() {
	    	this.id = this.$route.query.id;
	    	this.getList();
	    	autoJump(1);
		}
	}
</script>