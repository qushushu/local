<!-- 
  组件说明： 本组件为设置参数字典组件。
  进入方式： 操作员登录后点击导航栏"设备模板"后在任一条目下点击"参数"按钮进入。
  用户权限： 操作员可以使用。
-->
<template>
	<div class="ym-main">
		<a-card class="card-pd">
			<!-- 头部标题 start -->
			<PageHeader :title="$t('message.设置参数字典')"></PageHeader>
			<!-- 头部标题 end -->
			<div class="flex-between space-btm1">
				<!-- 导入按钮 start -->
				<label><span class="nmbtn">{{$t('message.导入excel')}}</span><input type="file" @change="importExcel"></label>
				<!-- 导入按钮 end -->
				<!-- 导出按钮 start -->
				<el-button size="small" @click="downloadExl" v-if="tableData.length && !isMobile">{{$t('message.导出excel')}}</el-button>
				<!-- 导出按钮 end -->
			</div>
			<!-- 表格 start -->
			<el-table :data="tableData" border size="small" :height="tbHeight">
			    <el-table-column prop="sort_index" :label="$t('message.序号')" width="50"></el-table-column>
			    <el-table-column prop="param_code" :label="$t('message.代码')" width="150"></el-table-column>
			    <el-table-column prop="name" :label="$t('message.参数项')" width="250"></el-table-column>
			    <el-table-column prop="unit" :label="$t('message.单位')" width="100"></el-table-column>
			    <el-table-column prop="show_ref_value" :label="$t('message.默认值')" width="150"></el-table-column>
			    <el-table-column prop="remark" :label="$t('message.备注')"></el-table-column>
			    <el-table-column prop="btns" :label="$t('message.操作')" :width="opWidth">
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
<script>
	import * as XLSX from "XLSX"
	import download from "../../../assets/tools/downloadExcel"
	import {get_dev_model,delete_dev_param,add_dev_param,modify_dev_param} from "../../../store/ajax.js"
	import {timeToMinute} from "../../../assets/tools/tool.js"
	import {envMixin} from "@/components/mixins/envMix"
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
		        rules: {name: [{ required: true, message: this.$t("message.请选择参数项"), trigger: 'blur'}]} // 编辑字典验证规则
	      	}
		},
		mixins: [envMixin],
		computed: {
            tbHeight() {return this.isMobile ? "" : 450},
            opWidth() {return this.i18n == "zh" ? 150 : 160}
		},
	    methods: {
	    	// 获取数据
	    	async getList() {
	    		this.fullscreenLoading = true;
	    		let res = await get_dev_model(this.current_model_code);
	    		this.fullscreenLoading = false;
	    		this.current_model_id =  res.id;
				this.tableData = res.param_item;
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
				// 删除
				this.$confirm(this.$t('message.确认导入该文件（导入文件后原有的参数字典都会被清空）？'), this.$t('message.确认信息'), {
		          distinguishCancelAndClose: true,
		          confirmButtonText: this.$t('message.确认'),
		          cancelButtonText: this.$t('message.取消')
		        }).then(()=> {
		        	new Promise(async (resolve,reject)=> {
		        		// 清除原来所有内容
						let param_item = this.tableData.map(item=> ({id: item.id, param_code: item.param_code}));
						let model_code = this.current_model_code;
						let res = await delete_dev_param({model_code,param_item});
						res && resolve();
					}).then(()=> {
						// 读取excel
						const fileReader = new FileReader();
						fileReader.readAsBinaryString(file);
						fileReader.onload = async (ev) => {
							try {
								const { result } = ev.target;
					            const workbook = XLSX.read(result, { type: 'binary' });
					            let data = [];
					            for (const sheet in workbook.Sheets) {
						            if (workbook.Sheets.hasOwnProperty(sheet)) {
						                data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
						            }
								}
								// 添加内容
								let dev_model_id = this.current_model_id;
								let param_item = data.map(item=> {
									return {
										name: item[this.$t('message.备注')],
										param_code: item[this.$t('message.代码')],
										ref_value: item["参考值"],
										remark: item[this.$t('message.备注')],
										sort_index: item[this.$t('message.序号')],
										unit: item[this.$t('message.单位')] || '--',
									}
								});
								let res = await add_dev_param({dev_model_id, param_item});
								if(res) {
									this.$message({
						              type: 'success',
						              message: this.$t('message.导入成功')
						            });
						            this.getList();
						            ev.target.value="";
								}
							}
							catch (err) {}
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
		    			[this.$t('message.序号')]: item.sort_index,
		    			[this.$t('message.代码')]: item.param_code,
		    			[this.$t('message.备注')]: item.name,
		    			[this.$t('message.单位')]: item.unit,
		    			[this.$t('message.参数值')]: item.ref_value,
		    			[this.$t('message.备注')]:item.remark
		    		}
		    	});
		    	download(result, `${this.$route.query.model_code} Parameter Dictionary Table.xlsx`);
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
		        this.$refs[formName].validate(async (valid) => {
		          if (valid) {
		          	let dev_model_id = this.current_model_id;
		          	let arrTime = ["SUNRIZE","SUNSET"];
		          	arrTime.includes(this.r.param_code) && (this.r.ref_value = timeToMinute(this.r.show_ref_value));
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
	          		let res = await modify_dev_param({dev_model_id, param_item });
	          		if(res) {
	          			this.$refs[formName].resetFields();
	      				this.$message({
			              type: 'success',
			              message: this.$t('message.修改成功')
			            });
			            this.r = {...this.init_r};
			            this.resetForm(formName);
	      				this.getList();
	          		} 
		          } else {
		          	return false;
		          }
		        });
		    },
		    // 删除单条参数字典
			handleDelete(index,row) {
				this.$confirm(this.$t('message.确认删除该字典？'), this.$t('message.确认信息'), {
		          distinguishCancelAndClose: true,
		          confirmButtonText: this.$t('message.确认'),
		          cancelButtonText: this.$t('message.取消')
		        }).then(async () => {
		        	let res = await delete_dev_param({
		        		model_code: this.current_model_code,
          				param_item:[{
          					id: row.id,
          					param_code: row.param_code
          				}]
		        	});
		        	if(res) {
		        		this.$message({
			              type: 'success',
			              message: this.$t('message.删除成功')
			            });
		        	}
		        	this.getList();
		        })
			}
		},
		mounted() {
			this.current_model_code = this.$route.query.model_code;
			this.getList();
		}
	}
</script>