<!-- 
  组件说明： 本组件为设备模板组件。
  进入方式： 操作员登录后点击导航栏"设备模板"进入。
  用户权限： 操作员可以使用。
-->
<template>
	<div class="ym-main">
		<a-card class="card-pd">
			<!-- 标题 start -->
			<PageHeader :title="$t('message.模板管理')" goBack="false"></PageHeader>
			<!-- 标题 end -->
			<!-- 搜索与新增 start -->
            <SearchBox :placeholder="$t('message.请输入设备型号')" @search="getList" />
            <el-button type="primary" size="small"  @click="handleEdit">{{$t('message.新增模板')}}</el-button>
			<!-- 搜索与新增 end -->
			<!-- 表格 start -->
			<el-table :data="tableData" border size="small">
			    <el-table-column prop="model_code" :label="$t('message.型号编号')" width="140"></el-table-column>
			    <el-table-column prop="model" :label="$t('message.设备型号')" width="140"></el-table-column>
			    <el-table-column prop="version" :label="$t('message.版本')" :width="verWidth"></el-table-column>
			    <el-table-column prop="description" :label="$t('message.描述')"></el-table-column>
			    <el-table-column :label="$t('message.操作')" :width="opWidth">
			      	<template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">{{$t('message.编辑')}}</el-button>
                        <el-button size="mini" @click="handleToParameterConfig(scope.$index, scope.row)">{{$t('message.参数')}}</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t('message.删除')}}</el-button>
				    </template>
			    </el-table-column>
			</el-table>
			<!-- 表格 end -->
			<!-- 弹出窗口 start -->
			<el-dialog :title="dTitle" :visible.sync="dialogVisible" width="400px">
			  <el-form ref="r" :model="r" label-width="80px" size="mini" :rules="rules">
			  	<el-form-item :label="$t('message.型号编号')" prop="model_code"><el-input v-model="r.model_code"></el-input></el-form-item>
			  	<el-form-item :label="$t('message.设备型号')" prop="model"><el-input v-model="r.model"></el-input></el-form-item>
			  	<el-form-item :label="$t('message.版本')" prop="version"><el-input v-model="r.version"></el-input></el-form-item>
			  	<el-form-item :label="$t('message.描述')" prop="description"><el-input v-model="r.description"></el-input></el-form-item>
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
    import {get_dev_model_list,delete_dev_model,add_dev_model,modify_dev_model} from "../../../store/ajax.js"
    import {envMixin} from "@/components/mixins/envMix"
	export default {
		data() {
			return {
				model: "",  // 搜索关键词
    		    tableData: [],   // 表格内容
    		    dialogVisible: false,   // 是否显示弹出层
                dTitle: "",
		        r: {
					model_code: "",
					model: "",
					version: "",
					description: "",
				},   // 弹出层内容文本
                rules: {
                	model_code: [{ required: true, message: this.$t("message.请输入型号编号"), trigger: 'blur' }],
        	        model: [{ required: true, message: this.$t("message.请输入设备型号"), trigger: 'blur' }],
                },  // 验证规则
        	    fullscreenLoading: false,  // 是否显示整屏加载
	        }
		},
        mixins: [envMixin],
        computed: {
            opWidth() {return this.i18n == "zh" ? 218 : 258},
            verWidth() {return this.i18n == "zh" ? 60 : 70}
        },
	    methods: {
        	// 获取设备模板列表
        	async getList(d = "") {
                this.model = d;
                let res = await get_dev_model_list(d);
                this.tableData = res;
        	},
        	// 显示新增/编辑弹层
        	handleEdit(index,row) {
        		this.dialogVisible = true;
                // 新增
                let json = {...this.r};
                // 编辑
                row && (json = {
                    id: row.id,
                    model_code: row.model_code,
                    model: row.model,
                    version: row.version,
                    description: row.description
                });
                if(row) {
                    this.dTitle = this.$t("message.编辑模板");
                } else {
                    this.dTitle = this.$t("message.新增模板");
                }
        		this.r = json;
        	},
        	// 提交
        	submitForm(formName) {
    	        this.$refs[formName].validate(async (valid) => {
    	          	if (valid) {
						this.fullscreenLoading = true;
                        let json = {
                            id: this.r.id || "",
                            model_code:this.r.model_code,
                            model: this.r.model,
                            version: this.r.version,
                            description: this.r.description
                        }
                        let res,message;
                        if(this.r.id) {
                            res = await modify_dev_model(json);
                            message = this.$t('message.修改成功')
                        } else {
                            res = await add_dev_model(json);
                            message = this.$t('message.添加成功')
                        }
                        this.fullscreenLoading = false;
                        this.$message({
                            type: 'success',
                            message
                        });
                        this.resetForm(formName);
                        this.getList();
    	          	} else {
    	           		return false;
    	          	}
    	        });
    	   	},
    	   	// 重置
    	    resetForm(formName) {
                this.$refs[formName].resetFields();
                this.dialogVisible = false;
                this.r = {
                    id: "",
                    model_code: "",
                    model: "",
                    version: "",
                    description: "",
                };
    	    },
        	// 删除
        	async handleDelete(index,row) {
        		let {id} = row;
      		    this.$confirm(this.$t('message.确认删除该设备模板？'), this.$t("message.确认信息"), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t("message.确认"),
                    cancelButtonText: this.$t("message.取消")
                }).then(async () => {
                    let res = await delete_dev_model(id);
                    if(res) {
                        this.$message({
                           type: 'success',
                           message: this.$t("message.删除成功")
                        });
                        this.getList();
                    }
  	            });
	        },
        	// 跳转到参数页面
        	handleToParameterConfig(index,row) {
        		this.$router.push(`/ParameterConfig?model_code=${row.model_code}`);
        	}
		},
		mounted() {
			this.getList();
		}
	}
</script>