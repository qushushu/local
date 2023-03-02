<!-- 
  组件说明：本组件为设备参数组件。
  进入方式：导航->设备参数
  用户权限：操作员可以使用。未登录用户或其他用户自动跳转至首页。
-->
<template>
	<div class="ym-main">
		<a-card class="card-pd">
			<!-- 标题 start -->
			<PageHeader :title="$t('message.设备参数')" goBack=false></PageHeader>
			<!-- 标题 end -->
			<!-- 搜索栏、新增 start -->
			<SearchBox :placeholder="$t('message.请输入设备型号')" :data="search_model_code" @search="getDevParamList" />
            <el-button type="solid" size="small"  @click="handleEdit">{{$t('message.新增')}}</el-button>
			<!-- 搜索栏、新增 end -->
			<!-- 表格 start -->
			<el-table ref="multipleTable" :data="tableData" border stripe size="small" tooltip-effect="dark" v-if="!isMobile">
			    <el-table-column prop="instance_number" :label="$t('message.设备编号')"></el-table-column>
			    <el-table-column prop="model" :label="$t('message.设备型号')"></el-table-column>
			    <el-table-column prop="description" :label="$t('message.描述')"></el-table-column>
			    <el-table-column prop="create_time" :label="$t('message.创建时间')"></el-table-column>
			    <el-table-column prop="btns" :label="$t('message.操作')" width="220">
			      	<template slot-scope="scope">
				        <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">{{$t('message.编辑')}}</el-button>
				        <el-button size="mini" @click="handleToParameterAdjustment(scope.$index, scope.row)">{{$t('message.参数')}}</el-button>
			            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t('message.删除')}}</el-button>
				    </template>
			    </el-table-column>
			</el-table>

			<el-table ref="multipleTable" v-if="isMobile" :data="tableData" border stripe size="small" tooltip-effect="dark">
			    <el-table-column prop="instance_number" :label="$t('message.设备编号')"></el-table-column>
			    <el-table-column prop="model" :label="$t('message.设备型号')"></el-table-column>
			    <el-table-column prop="btns" :label="$t('message.操作')" width="160">
			      	<template slot-scope="scope">
				        <el-button size="mini" class="mobile-space-btn1 mobile-planSetting-btn1" type="primary" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
				        <el-button size="mini" class="mobile-space-btn1 mobile-planSetting-btn1" type="primary" @click="handleEdit(scope.$index, scope.row)">{{$t('message.编辑')}}</el-button>
				        <el-button size="mini" class="mobile-space-btn1 mobile-planSetting-btn1" @click="handleToParameterAdjustment(scope.$index, scope.row)">{{$t('message.参数')}}</el-button>
			            <el-button size="mini" class="mobile-space-btn1 mobile-planSetting-btn1" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t('message.删除')}}</el-button>
				    </template>
			    </el-table-column>
			</el-table>
			<!-- 表格 end -->
			<!-- 弹窗 start -->
			<el-dialog :title="$t('message.查看详情')" :visible.sync="dialogVisibleSee" width="400px">
				<el-form ref="r" :model="r" label-width="80px" size="mini" modal="true">
					<el-form-item :label="$t('message.模板')" prop="model_code"><el-input v-model="r.model_code" readonly>></el-input></el-form-item>
					<el-form-item :label="$t('message.设备编号')" prop="instance_number"><el-input v-model="r.instance_number" readonly>></el-input></el-form-item>
					<el-form-item :label="$t('message.创建时间')" prop="create_time"><el-input  v-model="r.create_time" readonly></el-input></el-form-item>
					<el-form-item :label="$t('message.描述')" prop="description"><el-input  v-model="r.description" readonly></el-input></el-form-item>
					<el-form-item :label="$t('message.设备地址')" prop="dev_inst_id"><el-input  v-model="r.dev_inst_id" readonly></el-input></el-form-item>
					<el-form-item> 
						<el-button type="primary" @click="closeDetailLayer">{{$t('message.关闭')}}</el-button>
						</el-form-item>
				</el-form>
			</el-dialog>

			<el-dialog :title="$t('message.编辑参数')" :visible.sync="dialogVisible" width="400px">
				<el-form ref="r" :model="r" label-width="80px" size="mini" modal="true" :rules="rules">
					<el-form-item :label="$t('message.模板')" prop="model_code">
					    <el-select v-model="t" :placeholder="$t('message.模板')">   
					    	<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option> 
					    </el-select>
					</el-form-item>
					<el-form-item :label="$t('message.设备编号')" prop="instance_number"><el-input v-model="r.instance_number"></el-input></el-form-item>
					<el-form-item :label="$t('message.描述')" prop="description"><el-input v-model="r.description"></el-input></el-form-item>
					<el-form-item :label="$t('message.设备地址')" prop="dev_inst_id"><el-input v-model="r.dev_inst_id"></el-input></el-form-item>
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
	import aCard from "./common/Acard"
	import PageHeader from "./common/PageHeader"
	import axios from 'axios'
	import SearchBox from "./common/SearchBox"
	import {formatTime,autoJump} from "../assets/tools/tool"
	export default {
		data() {
			return {
				search_model_code: "",    // 设备型号
				r: {
					id: 0,   // 设备id(数字的)
					instance_number: "",  // 设备名称(字符串的)
					dev_model_id: 0,   // 模板id(数字的)
					model: "",    // 模板设备型号(字符串的)
					model_code: "",    // 模板设备编号(字符串的)
					description: "",   // 设备描述
					dev_inst_id: ""  // 设备地址
				},
		        tableData: [],   // 数据列表
		        t: "",   // select选择模板选项
		        dialogVisible: false,   // 是否显示弹窗
		        dialogVisibleSee: false,   // 是否显示弹窗
		        options: [{
		        	value: '',
		        	label: ''
		        }],   // 模板
		        modelList: [],
		        rules: {
		        	t: [{ required: true, message: '请选择模板', trigger: 'blur' }],
			        instance_number: [{ required: true, message: '请输入设备编号', trigger: 'change' }],
			        dev_inst_id: [{ required: true, message: '请输入设备地址', trigger: 'change'}]
		        }
	      	}
		},
		components: {
	    	PageHeader,
	    	aCard,
	    	SearchBox
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
	    	// 获取设备列表
	    	getDevParamList(d="") {
	    		this.search_model_code = d;
	    		axios({
	    			url: `${this.apiurl}/la/device/param/get_list`,
	    			method: "post",
	    			data: {
	    				data: {
				            model: "",
				            model_code: this.search_model_code,
				            start_time: "",
				            end_time: ""
				        }
	    			}
	    		}).then(data => {
	    			if(data.data && data.data.code === 200) {
	    				data.data.data.forEach(item => {
	    					item.create_time = formatTime(item.create_time);
	    				})
	    				this.tableData = data.data.data;
	    			}
	    		})
	    	},
	    	// 展示新建/编辑层
	    	async handleEdit(index,row) {
	    		// 获取模板列表
	    		await this.getDevModelList();
	    		// 显示弹窗
	    		this.dialogVisible = true;
	    		if(row) {
	    			// 编辑
	    			this.t = row.dev_model_id;
		    		this.r.id = row.id;
	    			this.r.instance_number = row.instance_number; 
		    		this.r.dev_model_id = row.dev_model_id;
		    		this.r.model = row.model;
		    		this.r.model_code = row.model_code;
		    		this.r.description = row.description;
		    		this.r.create_time = row.create_time;
		    		this.r.dev_inst_id = row.dev_inst_id;
	    		} else {
	    			// 新增
	    			this.r = {
						id: 0,   // 设备id(数字的)
						instance_number: "",  // 设备名称(字符串的)
						dev_model_id: 0,   // 模板id(数字的)
						model: "",    // 模板设备型号(字符串的)
						model_code: "",    // 模板设备编号(字符串的)
						description: "",
					}
	    		}
	    	},
	    	async handleDetail(index,row) {
	    		// 获取模板列表
	    		await this.getDevModelList();
	    		// 显示弹窗
	    		this.dialogVisibleSee = true;
	    		if(row) {
	    			// 编辑
	    			this.t = row.dev_model_id;
		    		this.r.id = row.id;
	    			this.r.instance_number = row.instance_number; 
		    		this.r.dev_model_id = row.dev_model_id;
		    		this.r.model = row.model;
		    		this.r.model_code = row.model_code;
		    		this.r.description = row.description;
		    		this.r.create_time = row.create_time;
		    		this.r.dev_inst_id = row.dev_inst_id;
	    		}
	    	},
	    	closeDetailLayer() {
	    		this.dialogVisibleSee = false;
	    	},
	    	// 获取模板列表
	    	async getDevModelList() {
	    		return new Promise((resolve,reject) => {
	    			axios({
		    			url: `${this.apiurl}/la/dev_model/get_list`,
		    			method: "post",
		    			data: {
		    				data: {model:""}
		    			}
		    		}).then(data => {
		    			if(data.data && data.data.code === 200 && data.data.data.length) {
		    				this.modelList = data.data.data;
		    				this.options = data.data.data.map(item=> ({
		    					value: item.id,
		    					label: item.model_code
		    				}));
		    				resolve(this.options);
		    			};
		    		})
	    		});
	    	},
	    	// 重置修改
		    resetForm(formName) {
		        this.$refs[formName].resetFields();
		        this.dialogVisible = false;
	    		this.r.id = 0;
		        this.r.instance_number = "";
	    		this.r.model = "";
	    		this.r.dev_model_id = 0,
	    		this.r.model_code = "";
	    		this.r.description = "";
	    		this.t = "";
		    },
		    getModelInfo(id) {
		    	return this.modelList.filter(item=> item.id === id);
		    },
	    	// 提交修改
	    	submitForm(formName) {
		        this.$refs[formName].validate(valid => {
		          	if (valid) {
		          		let {id,model,model_code,dev_inst_id} = this.getModelInfo(this.t)[0];
		          		// 接口url判断
		          		let url = (this.r.id == 0) ? `${this.apiurl}/la/device/param/add_dev` : `${this.apiurl}/la/device/param/modify_dev`;
		          		let submitData = {
				            id: "",
		          			instance_number: this.r.instance_number,
		          			description: this.r.description,
				            dev_model_id: id,
				            model,
				            model_code,
				            dev_inst_id: this.r.dev_inst_id
		          		};
		          		// 修改时重置id
		          		(this.r.id !== 0) && (submitData.id = this.r.id);
		          		axios({
		          			method: "post",
		          			url,
		          			data: {
		          				data: submitData
		          			}
		          		}).then(data=> {
			          		if(data.data && data.data.code == 200) {
			          			this.resetForm(formName);
					          	this.getDevParamList();
			          		}
			          	});
		          	} else {
		            	return false;
		         	}
		        });
		    },
	    	// 点击删除按钮
	    	handleDelete(index,row) {
	    		this.$confirm(this.$t("message.确认删除该设备参数？"), this.$t("message.确认信息"), {
		          distinguishCancelAndClose: true,
		          confirmButtonText: this.$t("message.确认"),
		          cancelButtonText: this.$t("message.取消")
		        }).then(() => {
		          	axios({
		          		url: `${this.apiurl}/la/device/param/del_dev`,
		          		method: "post",
		          		data: {
		          			data: {
		          				id: row.id
		          			}
		          		}
		          	}).then(data => {
		          		if(data.data && data.data.code == 200) {
		          			this.$message({
				              type: 'success',
				              message: this.$t("message.删除成功")
				            });
		          			this.getDevParamList();
		          		}
		          	})
		        })
	    	},
	    	// 点击参数栏目
	    	async handleToParameterAdjustment(index,row) {
	    		let data = await this.getDevModelList();
	    		let dev_model_id = data.filter(item => (item.label === row.model_code));
	    		if(dev_model_id.length) {
	    			this.$router.push("/ParameterAdjustment?model_code=" + row.model_code + "&instance_number=" + row.instance_number + "&dev_inst_id=" + row.dev_inst_id + "&dev_model_id=" + dev_model_id[0].value);
	    		} else {
	    			this.$message({
		            	type: 'error',
		            	message: this.$t("message.数据错误，请联系管理员")
		            });
	    		}
	    	},
		},
		mounted() {
			this.getDevParamList();
			autoJump(1);
		}
	}
</script>