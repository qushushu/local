<!-- 
  组件说明： 本组件为设置参数字典组件。
  进入方式： 导航 -> 设备模板 -> 某一条目下参数按钮
  用户权限： 操作员可以使用。未登录用户或其他用户自动跳转至首页。
-->
<template>
	<div class="ym-main">
		<a-card class="card-pd">
			<!-- 头部标题 start -->
			<PageHeader :title="$t('message.设置参数字典')" goBack=true></PageHeader>
			<!-- 头部标题 end -->
			<el-row type="flex" justify="space-between" class="space-btm1" v-if="!isMobile">
				<!-- 导入按钮 start -->
				<el-col>
					<label>
						<span class="nmbtn">{{$t('message.导入excel')}}</span>
						<input type="file" @change="importExcel" class="com-hide">
					</label>
				</el-col>
				<!-- 导入按钮 end -->
				<!-- 导出按钮 start -->
				<el-col class="text-right"><el-button size="small" @click="downloadExl" v-if="tableData.length">{{$t('message.导出excel')}}</el-button></el-col>
				<!-- 导出按钮 end -->
			</el-row>
			<!-- 表格 start -->
			<el-table ref="multipleTable" :data="tableData" border size="small" :height="tbHeight">
			    <el-table-column prop="sort_index" :label="$t('message.序号')" width="50"></el-table-column>
			    <el-table-column prop="param_code" :label="$t('message.代码')"></el-table-column>
			    <el-table-column prop="name" :label="$t('message.参数项')"></el-table-column>
			    <el-table-column prop="unit" :label="$t('message.单位')"></el-table-column>
			    <el-table-column prop="show_ref_value" :label="$t('message.默认值')"></el-table-column>
			    <el-table-column prop="remark" :label="$t('message.备注')"></el-table-column>
			    <el-table-column prop="btns" :label="$t('message.操作')" width="150">
			      	<template slot-scope="scope">
				        <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">{{$t('message.编辑')}}</el-button> 
				        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t('message.删除')}}</el-button>
				    </template>
			    </el-table-column>
			</el-table>
			<!-- 表格 end -->
			<!-- 弹出窗口 start -->
			<el-dialog :title="$t('message.参数字典')" :visible.sync="dialogVisible" width="400px">
			    <el-form ref="r" :model="r" label-width="80px" size="mini" modal="true" :rules="rules">
				  	<el-form-item :label="$t('message.参数项')" prop="name"><el-input v-model="r.name"></el-input></el-form-item>
				  	<el-form-item :label="$t('message.单位')" prop="unit"><el-input v-model="r.unit"></el-input></el-form-item>
				  	<el-form-item :label="$t('message.默认值')" prop="show_ref_value"><el-input v-model="r.show_ref_value"></el-input></el-form-item>
				  	<el-form-item :label="$t('message.备注')" prop="remark"><el-input v-model="r.remark"></el-input></el-form-item>
				  	<el-form-item> 
						<el-button @click="resetForm('r')">{{$t('message.取消')}}</el-button>
			    		<el-button type="primary" @click="submitForm('r')" v-loading.fullscreen.lock="fullscreenLoading">{{$t('message.确定')}}</el-button>
					</el-form-item>
			    </el-form>
			</el-dialog>
			<!-- 弹出窗口 end -->
		</a-card>
	</div>
</template>
<style scoped>
	.nmbtn {padding: 9px 15px; font-size: 12px; display: inline-block; line-height: 1;cursor: pointer; background: #409EFF; border: 1px solid #409EFF; color: #FFF; transition: .1s; user-select: none; border-radius: 4px;}
    .nmbtn:hover {color: #fff; border-color: #66b1ff; background-color: #66b1ff; }
</style>
<script>
	import PageHeader from "./common/PageHeader"
	import axios from 'axios'
	import aCard from "./common/Acard"
	import * as XLSX from "XLSX"
	import download from "../assets/tools/downloadExcel"
	import {minuteToTime,timeToMinute,autoJump} from "../assets/tools/tool.js"
	export default {
		data() {
			return {
				current_model_code: "",  // 型号编号
				current_model_id: 0,  // 型号id
				init_r: {
					sort_index: 0,
					id: 0,
					param_code: "",
					name: "",
					unit: "",
					ref_value: "",
					show_ref_value: "",
					remark: ""
				},
				r: {...this.init_r},
		        tableData: [],  // 数据列表
		        dialogVisible: false,
		        fullscreenLoading: false,  // 是否显示整屏加载
		        rules: {name: [{ required: true, message: '请选择参数项', trigger: 'blur'}]} // 编辑字典验证规则
	      	}
		},
		computed: {
			apiurl() {
                return this.$store.state.apiurl;
            },
            isMobile() {
                return this.$store.state.isMobile;
            },
            tbHeight() {
            	return this.isMobile ? "" : 450
            }
		},
		components: {
	    	PageHeader,
	    	aCard,
	    },
	    methods: {
	    	// 获取数据
	    	getList() {
	    		this.fullscreenLoading = true;
	    		axios({
	    			method:"post",
	    			url: `${this.apiurl}/la/dev_model/get`,
	    			data: {
	    				data: {
	    					model_code: this.current_model_code
	    				}
	    			}
	    		}).then(data => {
	    			this.fullscreenLoading = false;
	    			if(data.data.code == 200) {
	    				this.current_model_id =  data.data.data.id;
	    				this.tableData = data.data.data.param_item;
	    				// 时刻相关处理。变成时间格式
	    				let arrTemp = ["SUNRIZE","SUNSET"];
	    				this.tableData = this.tableData.map(item => {
	    					if(arrTemp.includes(item.param_code)) {
	    						if(isNaN(item.ref_value)) {
	    							item.show_ref_value = item.ref_value;
	    						} else {
	    							item.show_ref_value = minuteToTime(item.ref_value)
	    						}
	    					} else {
	    						item.show_ref_value = item.ref_value;
	    					}
    						return item;
	    				});
	    			}
	    		})
	    	},
	    	// 导入excel
			importExcel(e) {
				let file = e.target.files[0];
				// 判断类型
				if(!/sheet/.test(file.type)) {
					this.$message({
		              type: 'error',
		              message: this.$t('message.文件类型不正确')
		            });
		            return;
				}
				this.$confirm(this.$t('message.确认导入该文件（导入文件后原有的参数字典都会被清空）？'), this.$t('message.确认信息'), {
		          distinguishCancelAndClose: true,
		          confirmButtonText: this.$t('message.确认'),
		          cancelButtonText: this.$t('message.取消')
		        }).then(()=> {
		        	new Promise((resolve,reject)=> {
		        		// 清除原来所有内容
						let param_item = this.tableData.map(item=> {
				    		return {
				    			id: item.id,
				    			param_code: item.param_code
				    		}
				    	});
				    	axios({
			          		method: "post",
			          		url: `${this.apiurl}/la/dev_model/param/delete`,
			          		data: {
			          			data: {
			          				model_code: this.current_model_code,
			          				param_item
			          			}
			          		}
			          	}).then(data => {
			          		if(data.data.code == 200) {
			          			resolve();
			          		}
			          	})
					}).then(()=> {
						// 读取excel
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
								// 添加内容
								let dev_model_id = _this.current_model_id;
								let param_item = data.map(item=> {
									return {
										name: item["描述"],
										param_code: item["代码"],
										ref_value: item["参考值"],
										remark: item["描述"],
										sort_index: item["序号"],
										unit: item["单位"] || '--',
									}
								});
								axios({
					          		method: "post",
					          		url: `${_this.apiurl}/la/dev_model/param/add`,
					          		data: {
					          			data: {
				          					dev_model_id,
				          					param_item
					          			}
					          		}
					          	}).then(data => {
					          		_this.$message({
						              type: 'success',
						              message: this.$t('message.导入成功')
						            });
						            _this.getList();
						            e.target.value="";
					          	})
							}
							catch (err ) {

							}
						}
			        }).catch(()=> {
			        	e.target.value = "";
			        })
				});
			},
			// 导出excel
		    downloadExl() {
		    	let result = this.tableData.map(item => {
		    		return {
		    			"序号": item.sort_index,
		    			"代码": item.param_code,
		    			"参数项": item.name,
		    			"单位": item.unit,
		    			"参考值": item.ref_value,
		    			"描述":item.remark
		    		}
		    	});
		    	download(result, `${this.$route.query.model_code}设备参数字典表.xlsx`);
		    },
	    	// 编辑
		    handleEdit(index,row) {
		    	this.dialogVisible = true;
		    	this.r = {...this.init_r};  // 不设置会导致输入框不能编辑
		    	this.r.param_code = row.param_code;
		    	this.r.name = row.name;
		    	this.r.unit = row.unit;
		    	this.r.ref_value = row.ref_value;
		    	this.r.show_ref_value = row.show_ref_value;
		    	this.r.remark = row.remark;
		    	this.r.id = row.id;
		    	this.r.sort_index = row.sort_index;
		    },
		    // 重置
		    resetForm(formName) {
		        this.$refs[formName].resetFields();
		        this.dialogVisible = false;
		    },
			// 提交
		    submitForm(formName) {
		        this.$refs[formName].validate((valid) => {
		          if (valid) {
		          	let dev_model_id = this.current_model_id;
		          	let arrTime = ["SUNRIZE","SUNSET"];
		          	if(arrTime.includes(this.r.param_code)) {
		          		this.r.ref_value = timeToMinute(this.r.show_ref_value);
		          	}
		          	let param_item = [{
  						param_code: this.r.param_code,
  						name: this.r.name,
  						unit:this.r.unit,
  						ref_value: arrTime.includes(this.r.param_code) ? this.r.ref_value : this.r.show_ref_value,
  						sort_index: this.r.sort_index,
  						remark: this.r.remark
  					}];
	          		param_item[0].id = this.r.id;
	          		param_item[0].dev_model_id = dev_model_id;
	          		axios({
		          		method: "post",
		          		url: `${this.apiurl}/la/dev_model/param/modify`,
		          		data: {
		          			data: {
	          					dev_model_id,
	          					param_item
		          			}
		          		}
		          	}).then(data => {
		          		if(data.data.code == 200) {
				    		let message = this.$t('message.修改成功');
		          			this.$refs[formName].resetFields();
		      				this.$message({
				              type: 'success',
				              message
				            });
				            this.r = {...this.init_r};
				            this.resetForm(formName);
		      				this.getList();
		          		}
		          	})
		          } else {
		          	return false;
		          }
		        });
		    },
		    // 删除
			handleDelete(index,row) {
				this.$confirm(this.$t('message.确认删除该字典？'), this.$t('message.确认信息'), {
		          distinguishCancelAndClose: true,
		          confirmButtonText: this.$t('message.确认'),
		          cancelButtonText: this.$t('message.取消')
		        }).then(() => {
		          	axios({
		          		method: "post",
		          		url: `${this.apiurl}/la/dev_model/param/delete`,
		          		data: {
		          			data: {
		          				model_code: this.current_model_code,
		          				param_item:[{
		          					id: row.id,
		          					param_code: row.param_code
		          				}]
		          			}
		          		}
		          	}).then(data => {
		          		if(data.data.code == 200) {
		          			this.$message({
				              type: 'success',
				              message: this.$t('message.删除成功')
				            });
		          		}
		          		this.getList();
		          	})
		        })
			}
		},
		mounted() {
			this.current_model_code = this.$route.query.model_code;
			this.getList();
			autoJump(1);
		}
	}
</script>