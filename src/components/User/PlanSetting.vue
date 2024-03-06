<!-- 
  组件说明：本组件为方案管理组件。
  进入方式：操作员登录后点击导航栏"方案管理"按钮进入
  用户权限：操作员可以使用。
-->
<template>
	<div class="ym-main">
		    <!-- 本地版编号 start -->
        <slot name="dev_no" v-if="!isWeb"></slot>
        <slot name="current_pos" v-if="isWeb"></slot>
        <!-- 本地版编号 end -->
		<a-card class="card-pd">
			<!-- 头部标题 start -->
			<PageHeader :title="$t('message.方案管理')" goBack=true></PageHeader>
			<!-- 头部标题 end -->
			<!-- 搜索新增 start -->
			<SearchBox :placeholder="$t('message.请输入育苗名称')" :data="plant" @search="getList" />
            <el-button type="solid" size="small"  @click="handleCreate">{{$t('message.新增')}}</el-button>
			<!-- 搜索新增 end -->
			<!-- 表格 start -->
			<el-table ref="multipleTable" :data="tableData" border stripe size="small" tooltip-effect="dark" v-if="!isMobile">
			    <el-table-column prop="scheme_name" :label="$t('message.方案名称')" width="135"></el-table-column>
			    <el-table-column prop="plant" :label="$t('message.育苗名称')" :width="colTdw3 "></el-table-column>
			    <el-table-column prop="grow_cycle" :label="$t('message.周期')" width="50"></el-table-column>
			    <el-table-column prop="create_time" :label="$t('message.创建时间')" :width="colTdw1"></el-table-column>
			    <el-table-column prop="remark" :label="$t('message.评价')"></el-table-column>
			    <el-table-column prop="btns" :label="$t('message.操作')">
			      	<template slot-scope="scope">
			      		<div class="space-btm">
					        <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)" :class="{'mobile-planSetting-btn1': true}">{{$t('message.编辑')}}</el-button>
					        <el-button class="mobile-planSetting-btn2" size="mini" type="warning" @click="handleCopy(scope.$index, scope.row)" v-loading.fullscreen.lock="fullscreenLoading">{{$t('message.复制')}}</el-button>
					        <!-- 禁用删除 start -->
					        <el-button class="mobile-planSetting-btn3" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" v-loading.fullscreen.lock="fullscreenLoading" disabled v-if="scope.row.id == currentPlantId || scope.row.record_count != 0">{{$t('message.删除')}}</el-button>
					        <!-- 禁用删除 end -->
					        <!-- 启用删除 start -->
					        <el-button class="mobile-planSetting-btn3" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" v-loading.fullscreen.lock="fullscreenLoading" v-else>{{$t('message.删除')}}</el-button>
					        <!-- 启用删除 end -->
					        <el-button class="mobile-planSetting-btn4" size="mini" @click="handleToPlanStageShow(scope.$index, scope.row)">{{$t('message.查看阶段')}}</el-button>
			      		</div>
			      		<div>
					        <el-button class="mobile-planSetting-btn5" size="mini" @click="handToCulRecords(scope.$index, scope.row)">{{$t('message.培植记录')}}</el-button>
					        <el-button size="mini" :disabled="scope.row.id != currentPlantId" @click="overPlant(scope.row.id)">结束方案</el-button>
					        <el-button size="mini" @click="startPlant(scope.row.id)">开启方案</el-button>
					        <!-- <el-button size="mini" :disabled="Boolean(currentPlantId)" @click="startPlant(scope.row.id)">开启方案</el-button> -->
			      		</div>
				    </template>
			    </el-table-column>
			</el-table>

			<!-- <el-table ref="multipleTable" :data="tableData" border stripe size="small" tooltip-effect="dark" v-if="isMobile">
			    <el-table-column prop="scheme_col_info" :label="$t('message.方案 / 名称')"></el-table-column>
			    <el-table-column prop="btns" :label="$t('message.操作')" width="280">
			      	<template slot-scope="scope">
			      		 <el-button size="mini" class="mobile-space-btn1" type="primary" @click="handleDetail(scope.$index, scope.row)" :class="{'mobile-planSetting-btn1': true}">{{$t('message.详情')}}</el-button>
				        <el-button size="mini" class="mobile-space-btn1" type="primary" @click="handleEdit(scope.$index, scope.row)" :class="{'mobile-planSetting-btn1': true}">{{$t('message.编辑')}}</el-button>
				        <el-button class="mobile-planSetting-btn2 mobile-space-btn1" size="mini" type="warning" @click="handleCopy(scope.$index, scope.row)" v-loading.fullscreen.lock="fullscreenLoading">{{$t('message.复制')}}</el-button> 
				        <el-button class="mobile-planSetting-btn3 mobile-space-btn1" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" v-loading.fullscreen.lock="fullscreenLoading" disabled v-if="scope.row.id == currentPlantId">{{$t('message.删除')}}</el-button>
				        <el-button class="mobile-planSetting-btn3 mobile-space-btn1" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" v-loading.fullscreen.lock="fullscreenLoading" v-if="scope.row.id != currentPlantId">{{$t('message.删除')}}</el-button>
				    </template>
			    </el-table-column>
			    <el-table-column prop="btns" :label="$t('message.查看')" width="190">
			    	<template slot-scope="scope">
				        <el-button class="mobile-planSetting-btn4" size="mini" @click="handleToPlanStageShow(scope.$index, scope.row)">{{$t('message.查看阶段')}}</el-button>
				        <el-button class="mobile-planSetting-btn5" size="mini" @click="handToCulRecords(scope.$index, scope.row)">{{$t('message.培植记录')}}</el-button>
				    </template>
			    </el-table-column>
			</el-table> -->
			<!-- 表格 start -->
			<!-- 查看方案弹窗 start -->
			<el-dialog :title="$t('message.查看方案')" :visible.sync="dialogVisibleSee" width="400px">
				<el-form ref="r" :model="r" label-width="80px" size="mini" modal="true">
					<el-form-item :label="$t('message.方案详情')" prop="scheme_name"><el-input readonly v-model="r.scheme_name"></el-input></el-form-item>
					<el-form-item :label="$t('message.种植作物')" prop="plant"><el-input readonly v-model="r.plant"></el-input></el-form-item>
					<el-form-item :label="$t('message.生长周期（天）')" prop="grow_cycle"><el-input v-model="r.grow_cycle" readonly></el-input></el-form-item>
					<el-form-item :label="$t('message.创建时间')" prop="grow_cycle"><el-input v-model="r.create_time" readonly></el-input></el-form-item>
					<el-form-item :label="$t('message.评价')" prop="remark"><el-input readonly v-model="r.remark" type="textarea"></el-input></el-form-item>
					<el-form-item> 
						<el-button type="primary"  @click="closeDetailLayer">{{$t('message.关闭')}}</el-button>
						</el-form-item>
				</el-form>
			</el-dialog>
			<!-- 查看方案弹窗 end -->
			<!-- 编辑方案弹窗 start -->
			<el-dialog :title="$t('message.编辑方案')" :visible.sync="dialogVisible" width="400px">
				<el-form ref="r" :model="r" label-width="80px" size="mini" modal="true" :rules="rules">
					<el-form-item :label="$t('message.计划名称')" prop="scheme_name"><el-input v-model="r.scheme_name"></el-input></el-form-item>
					<el-form-item :label="$t('message.种植作物')" prop="plant"><el-input v-model="r.plant"></el-input></el-form-item>
					<el-form-item :label="$t('message.生长周期（天）')" prop="grow_cycle"><el-input v-model="r.grow_cycle"></el-input></el-form-item>
					<el-form-item :label="$t('message.评价')" prop="remark"><el-input v-model="r.remark" type="textarea"></el-input></el-form-item>
					<el-form-item> 
						<el-button @click="resetForm('r')">{{$t('message.取消')}}</el-button>
			    		<el-button type="primary" @click="submitForm('r')" v-loading.fullscreen.lock="fullscreenLoading">{{$t('message.确定')}}</el-button>
						</el-form-item>
				</el-form>
			</el-dialog>
			<!-- 编辑方案弹窗 end -->
		</a-card>
	</div>
</template>
<script>
	import {formatTime} from "../../assets/tools/tool"
	import {get_plant_list,del_plant,copy_plant,add_plant,modify_plant,plant_start,plant_finish} from "../../store/ajax.js"
	import projectJson from "../../config"
	let {isWeb} = projectJson;
	export default {
		data() {
			return {
				plant: "",
				r: {
					id: 0,
					scheme_name: "",
					plant: "",
					grow_cycle: "",
					remark: "",
					plant_image: '',
					scheme_col_info: ""
				},
		        tableData: [],
		        dialogVisible: false,
		        dialogVisibleSee: false,
		        rules: {
		        	scheme_name: [{required: true, message: '请输入计划名称', trigger: 'blur'}],
			        plant: [{required: true, message: '请输入种植作物', trigger: 'blur'}]
		        },
		        fullscreenLoading: false,  // 是否显示整屏加载
	      	}
		},
	    computed: {
	    	isWeb() {return isWeb},
            currentPlantId() {return this.$store.state.currentInfo.plant.id},
            isMobile() {return this.$store.state.isMobile},
            colTdw2() {return this.isMobile ? 178 : 405},
            colTdw1() {return this.isMobile ? 100 : 150},
            colTdw3() {return this.isMobile ? 70 : 120},
            factory_num() {
            	if(this.$store.state.userInfo.factory) {
            		return this.$store.state.userInfo.factory.factory_num
            	} else {
            		return -1;
            	}
            },
            currentDevInfo() {return this.$store.state.currentInfo.dev},
	    },
	    watch: {
	    	factory_num() {
	    		this.getList()
	    	}
	    },
		methods: {
			async startPlant(plant_id,remark="") {
				let res = await plant_start({
                    plant_id,
                    remark
                });
                if(res) {
                    if(res == "success") {
                        this.$message({
                            type: 'success',
                            message: this.$t("message.方案开启成功")
                        });
                    }
                    setTimeout(()=> {
                    	this.getList();
                    },1000);
                };
			},
			// 结束培植
            async finish(record_id) {
                await plant_finish(record_id);
            },
			overPlant(id) {
				this.$confirm("是否结束此方案？", this.$t("message.提示"), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t("message.确定"),
                    cancelButtonText: this.$t("message.取消"),
                }).then(() => {
                    this.$prompt("请填写结束方案原因(如：方案到期)", "结束方案", {
                      confirmButtonText: this.$t("message.确定"),
                      cancelButtonText: this.$t("message.取消"),
                      inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
                      inputErrorMessage: this.$t("message.切换原因不能为空")
                    }).then(async () => {
                        await this.finish(id);
                        this.$message({
                            type: 'success',
                            message: "结束方案成功！"
                        });
                        this.getList();
                    }).catch((err) => {
                        this.$message({
                            type: 'info',
                            message: "取消结束方案"
                        });       
                    });
                });
			},
			// 获取列表
			async getList(d="") {
				this.plant = d;
				this.$store.dispatch("getCurrentPlan");
				let json = {
					plant: this.plant
				}
				if(this.isWeb) {
					json.factory_num = this.factory_num;
					json.dev_num = this.currentDevInfo.instance_number;
				}
				let res = await get_plant_list(json);
				res.map(item => {
					item.scheme_col_info = item.scheme_name + ' / ' + '\n' +item.plant;
					item.create_time = formatTime(item.create_time);
					return item;
				});
				this.tableData = res;
			},
			// 新增计划
			handleCreate() {
				this.dialogVisible = true;
				this.resetFormData();
			},
			// 点击编辑
			handleEdit(index,row) {
				this.dialogVisible = true;
				this.r = row;
			},
			handleDetail(index,row) {
				this.dialogVisibleSee = true;
				this.r = row;
			},
			closeDetailLayer() {
				this.dialogVisibleSee = false;
			},
			// 提交
			submitForm(formName) {
		        this.$refs[formName].validate(async (valid) => {
		          	if (valid) {
		          		let {scheme_name,plant,grow_cycle,remark,plant_image} = this.r;
	          			let data = {
	          				scheme_name,
	      					plant,
	      					grow_cycle,
	      					remark,
	      					plant_image
	          			}
	          			if(this.isWeb) {
	          				data.factory_num = this.factory_num;
	      					data.dev_num = this.currentDevInfo.instance_number;
	          			}
	          			this.r.id ? (data.id = this.r.id) : (data.create_time = "");
	          			this.fullscreenLoading = true;
	          			let res = this.r.id ? await modify_plant(data): await add_plant(data)
	          			if(res) {
	          				this.fullscreenLoading = false;
	          				let message = this.r.id ? this.$t('message.修改成功') : this.$t('message.添加成功');
	          				this.$refs[formName].resetFields();
	          				this.dialogVisible = false;
	          				this.$message({
				              type: 'success',
				              message
				            });
				            this.getList();
	          			}
		          	} else {
		            	return false;
		          	}
		        });
		    },
		    // 重置
		    resetForm(formName) {
		    	this.resetFormData();
		        this.dialogVisible = false;
		    },
		    // 数据重置
		    resetFormData() {
		    	this.r = {
					id: 0,
					scheme_name: "",
					plant: "",
					grow_cycle: "",
					remark: "",
					plant_image: ''
				}
		    },
		    // 删除
			handleDelete(index,row) {
				this.$confirm(this.$t('message.确认删除该管理方案？'), this.$t('message.确认信息'), {
		          distinguishCancelAndClose: true,
		          confirmButtonText: this.$t('message.确认'),
		          cancelButtonText: this.$t('message.取消')
		        }).then(async () => {
		        	this.fullscreenLoading = true;
		        	let res = await del_plant(row.id);
		        	if(res) {
		        		this.fullscreenLoading = false;
						this.$message({
			              type: 'success',
			              message: this.$t('message.删除成功')
			            });
			            this.getList();
		        	}
		        })
			},
			// 拷贝
			async handleCopy(index,row) {
				let {scheme_name,plant,plant_image,grow_cycle,create_time,remark} = row;
				this.fullscreenLoading = true;
				let data = {
					old_id: row.id,
      				scheme_name: scheme_name + "_copy",
      				plant,
      				plant_image,
      				grow_cycle,
      				create_time,
      				remark
				}
				if(this.isWeb) {
					data.factory_num = this.factory_num;
					data.dev_num = this.currentDevInfo.instance_number;
				}
				let res = await copy_plant(data);
				if(res) {
					this.fullscreenLoading = false;
					this.$message({
		              type: 'success',
		              message: this.$t('message.复制成功')
		            });
		            this.getList();
				}
			},
			// 跳转到查看阶段页面
			handleToPlanStageShow(index,row) {
				this.$router.push({
					path: "/Plan",
					query: {
						id: row.id,
						scheme_name: row.scheme_name
					}
				});
			},
			// 跳转到配置记录页面
			handToCulRecords(index,row) {
		      	this.$router.push({
		      		path: "/CulRecords",
		      		query: {
		      			plant: row.plant,
		      			scheme_name: row.scheme_name
		      		}
		      	});
		    }
		},
		mounted() {
			console.log(this.currentPlantId);
			this.getList();
		}
	}
</script>