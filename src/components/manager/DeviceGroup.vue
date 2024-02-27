<!-- 
  组件说明：本组件为设备组管理。
  进入方式：管理员登录后点击导航栏"设备组管理"进入
  用户权限：管理员可以使用。
-->
<template>
	<div class="ym-main">
		<a-card class="card-pd">
			<!-- 标题 start -->
			<PageHeader :title="$t('message.机器管理')" goBack=false></PageHeader>
			<!-- 标题 end -->
			<!-- 新增 start -->
            <el-button type="solid" size="small"  @click="handleEdit" style="margin-bottom: 10px;">{{$t('message.新增')}}</el-button>
			<!-- 新增 end -->
			<!-- 表格 start -->
			<el-table ref="multipleTable" :data="tableData" border stripe size="small" tooltip-effect="dark">
			    <el-table-column prop="sort_id" width="58" :label="$t('message.序号')"></el-table-column>
			    <el-table-column prop="dev_number" width="90px" :label="$t('message.机器编号')"></el-table-column>
			    <el-table-column prop="description" :label="$t('message.备注')"></el-table-column>
			    <el-table-column prop="btns" :label="$t('message.操作')" :width="opWidth">
			      	<template slot-scope="scope">
				        <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">{{$t('message.编辑')}}</el-button>
			            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t('message.删除')}}</el-button>
				    </template>
			    </el-table-column>
			</el-table>
			<!-- 表格 end -->
			<el-dialog :title="$t('message.编辑参数')" :visible.sync="dialogVisible" width="400px">
				<el-form ref="r" :model="r" label-width="80px" size="mini" modal="true" :rules="rules">
					<el-form-item :label="$t('message.机器编号')" prop="dev_number"><el-input v-model="r.dev_number"></el-input></el-form-item>
					<el-form-item :label="$t('message.备注')" prop="description"><el-input v-model="r.description"></el-input></el-form-item>
					<el-form-item> 
						<el-button @click="resetForm('r')">{{$t('message.取消')}}</el-button>
			    		<el-button type="primary" @click="submitForm('r')">{{$t('message.确定')}}</el-button>
						</el-form-item>
				</el-form>
			</el-dialog>
			<!-- 弹窗 end -->
		</a-card>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				search_model_code: "",    // 设备型号
				r: {
					sort_id: 0,   // 设备id(数字的)
					dev_number: "",  // 设备名称(字符串的)
					description: "",   // 设备描述
				},
		        tableData: [],   // 数据列表
		        t: "",   // select选择模板选项
		        dialogVisible: false,   // 是否显示弹窗
		        options: [{
		        	value: '',
		        	label: ''
		        }],   // 模板
		        modelList: [],
		        rules: {
			        dev_number: [{ required: true, message: '请输入机器编号', trigger: 'blur' }],
		        }
	      	}
		},
		computed: {
			i18n() {
                return this.$store.state.i18n
            },
            opWidth() {
            	return this.i18n == "zh" ? 148 : 158;
            }
		},
		components: {
	    },
	    methods: {
	    	// 获取机器列表
	    	getDevParamList() {
	    		this.tableData = JSON.parse(localStorage.devGroup);
	    		let arr = this.tableData.map(item => {
	    			return item.dev_number;
	    		});
	    		this.$store.commit("updateMobileDevGroup",this.tableData);
	    		this.updataTableData();
	    	},
	    	// 展示新建/编辑层
	    	async handleEdit(index,row) {
	    		// 显示弹窗
	    		this.dialogVisible = true;
	    		if(row) {
	    			// 编辑
	    			this.r.dev_number = row.dev_number; 
		    		this.r.description = row.description;
		    		this.r.sort_id = row.sort_id
	    		} else {
	    			// 新增
	    			this.r = {
	    				sort_id: 0,
						dev_number: "",  // 设备名称(字符串的)
						description: "",
					}
	    		}
	    	},
	    	// 重置修改
		    resetForm(formName) {
		        this.$refs[formName].resetFields();
		        this.dialogVisible = false;
		        this.r.dev_number = "";
	    		this.r.description = "";
		    },
	    	// 提交修改
	    	submitForm(formName) {
		        this.$refs[formName].validate(async valid => {
		          	if (valid) {
		          		if(isNaN(this.r.dev_number)) {
			        		this.$message({
	                            type: 'error',
	                            message: this.$t("message.编号必须为数字")
	                        });
			        		return
			        	} else {
			        		if(this.r.sort_id) {
			        			let idx = this.tableData.findIndex(item => item.sort_id === this.r.sort_id);
			        			let json = {
			        				sort_id: this.r.sort_id,
			        				dev_number: this.r.dev_number,
			        				description: this.r.description
			        			}
		        				this.tableData.splice(idx,1,json);
		        				this.$message({
		                            type: 'success',
		                            message: this.$t("message.修改成功")
		                        });
			        		} else {
			        			this.$message({
		                            type: 'success',
		                            message: this.$t("message.添加成功")
		                        });
		                        this.tableData.push({
		                        	dev_number: this.r.dev_number,
		                        	description: this.r.description
		                        });
			        		}
			          		this.setStore();
			          		this.resetForm(formName);
						    this.getDevParamList();
			        	}
		          	} else {
		            	return false;
		         	}
		        });
		    },
	    	// 点击删除按钮
	    	async handleDelete(index,row) {
	    		this.$confirm(this.$t("message.确认删除该设备参数？"), this.$t("message.确认信息"), {
		          distinguishCancelAndClose: true,
		          confirmButtonText: this.$t("message.确认"),
		          cancelButtonText: this.$t("message.取消")
		        }).then(async _ => {
		        	let idx = this.tableData.findIndex(item => item.sort_id === row.sort_id);
		        	this.tableData.splice(idx,1);
		        	this.setStore();
		        	this.getDevParamList();
					this.$message({
				      type: 'success',
				      message: this.$t("message.删除成功")
				    });
		        })
	    	},
	    	setStore() {
	    		let arr = this.tableData.map(item => {
	    			return item;
	    		});
	    		localStorage.devGroup = JSON.stringify(arr)
	    	},
	    	updataTableData() {
	    		this.tableData = this.tableData.map((item,key) => {
	    			item.sort_id = key + 1;
	    			return item;
	    		})
	    		this.setStore() 
	    	}
		},
		mounted() {
			this.getDevParamList();
		}
	}
</script>