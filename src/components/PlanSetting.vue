<!-- 
  组件说明：本组件为方案管理组件。
  进入方式：导航 -> 方案管理
  用户权限：操作员可以使用。未登录用户或其他用户自动跳转至首页。
-->
<template>
	<div class="ym-main">
		<a-card class="card-pd">
			<!-- 头部标题 start -->
			<PageHeader :title="$t('message.方案管理')" goBack=false></PageHeader>
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
			    <el-table-column prop="btns" :label="$t('message.操作')" :width="colTdw2">
			      	<template slot-scope="scope">
				        <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)" :class="{'mobile-planSetting-btn1': true}">{{$t('message.编辑')}}</el-button>
				        <el-button class="mobile-planSetting-btn2" size="mini" type="warning" @click="handleCopy(scope.$index, scope.row)" v-loading.fullscreen.lock="fullscreenLoading">{{$t('message.复制')}}</el-button> 
				        <el-button class="mobile-planSetting-btn3" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" v-loading.fullscreen.lock="fullscreenLoading" disabled v-if="scope.row.id == currentPlantId">{{$t('message.删除')}}</el-button>
				        <el-button class="mobile-planSetting-btn3" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" v-loading.fullscreen.lock="fullscreenLoading" v-if="scope.row.id != currentPlantId">{{$t('message.删除')}}</el-button>
				        <el-button class="mobile-planSetting-btn4" size="mini" @click="handleToPlanStageShow(scope.$index, scope.row)">{{$t('message.查看阶段')}}</el-button>
				        <el-button class="mobile-planSetting-btn5" size="mini" @click="handToCulRecords(scope.$index, scope.row)">{{$t('message.培植记录')}}</el-button>
				    </template>
			    </el-table-column>
			</el-table>
			<el-table ref="multipleTable" :data="tableData" border stripe size="small" tooltip-effect="dark" v-if="isMobile">
			    <el-table-column prop="scheme_col_info" label="方案 / 育苗"></el-table-column>
			    <el-table-column prop="btns" :label="$t('message.操作')" width="160px">
			      	<template slot-scope="scope">
			      		 <el-button size="mini" class="mobile-space-btn1" type="primary" @click="handleDetail(scope.$index, scope.row)" :class="{'mobile-planSetting-btn1': true}">详情</el-button>
				        <el-button size="mini" class="mobile-space-btn1" type="primary" @click="handleEdit(scope.$index, scope.row)" :class="{'mobile-planSetting-btn1': true}">{{$t('message.编辑')}}</el-button>
				        <el-button class="mobile-planSetting-btn2 mobile-space-btn1" size="mini" type="warning" @click="handleCopy(scope.$index, scope.row)" v-loading.fullscreen.lock="fullscreenLoading">{{$t('message.复制')}}</el-button> 
				        <el-button class="mobile-planSetting-btn3 mobile-space-btn1" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" v-loading.fullscreen.lock="fullscreenLoading" disabled v-if="scope.row.id == currentPlantId">{{$t('message.删除')}}</el-button>
				        <el-button class="mobile-planSetting-btn3 mobile-space-btn1" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" v-loading.fullscreen.lock="fullscreenLoading" v-if="scope.row.id != currentPlantId">{{$t('message.删除')}}</el-button>
				    </template>
			    </el-table-column>
			    <el-table-column prop="btns" label="查看" width="110px">
			    	<template slot-scope="scope">
				        <el-button class="mobile-planSetting-btn4" size="mini" @click="handleToPlanStageShow(scope.$index, scope.row)">{{$t('message.查看阶段')}}</el-button>
				        <el-button class="mobile-planSetting-btn5" size="mini" @click="handToCulRecords(scope.$index, scope.row)">{{$t('message.培植记录')}}</el-button>
				    </template>
			    </el-table-column>
			</el-table>
			<!-- 表格 start -->
			<!-- 查看方案弹窗 start -->
			<el-dialog :title="$t('message.查看方案')" :visible.sync="dialogVisibleSee" width="400px">
				<el-form ref="r" :model="r" label-width="80px" size="mini" modal="true">
					<el-form-item label="方案详情" prop="scheme_name"><el-input readonly v-model="r.scheme_name"></el-input></el-form-item>
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
					<!-- <el-form-item :label="$t('message.育苗图片')" prop="plant_image">
						<label>
							<input type="file" @change="upload($event)" style="position: fixed;left: -9999999px;">
							<img :src="r.plant_image || defaultImg" alt="" style="width: 80px;height: 80px;cursor: pointer;">
						</label>
					</el-form-item> -->
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
	import PageHeader from "./common/PageHeader"
	import axios from 'axios'
	import aCard from "./common/Acard"
	import SearchBox from "./common/SearchBox"
	import {formatTime,autoJump} from "../assets/tools/tool"
	export default {
		data() {
			return {
				defaultImg: "/static/upload_img.jpg",
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
		components: {
	    	PageHeader,
	    	aCard,
	    	SearchBox
	    },
	    computed: {
	    	apiurl() {
                return this.$store.state.apiurl;
            },
            currentPlantId() {
                return this.$store.state.currentPlanInfo.id;
            },
            isMobile() {
                return this.$store.state.isMobile;
            },
            colTdw2() {
            	return this.isMobile ? 178 : 405
            },
            colTdw1() {
            	return this.isMobile ? 100 : 150
            },
            colTdw3() {
            	return this.isMobile ? 70 : 120
            }
	    },
		methods: {
			// 获取列表
			getList(d="") {
				this.plant = d;
				this.$store.dispatch("getCurrentPlan");
				axios({
					url: `${this.apiurl}/la/plant/head/get_list`,
					method: "post",
					data: {
						data: {
	            			plant: this.plant
						}
					}
				}).then(res => {
					let {code,data} = res.data;
					if(code == 200) {
						data.map(item => {
							item.scheme_col_info = item.scheme_name + ' / ' + '\n' +item.plant;
							item.create_time = formatTime(item.create_time);
							return item;
						});
						this.tableData = data;
					}
				});
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
			// 上传图片
			// upload(el) {
			// 	let file = el.target.files[0];
			// 	let param = new FormData();  // 创建form对象
			//     param.append('file', file);  // 通过append向form对象添加数据
			// 	axios.post(`${this.apiurl}/la/img`, param, {
			//       headers: {'Content-Type': 'multipart/form-data'}
			//     }).then(data => {
			// 		if(data.data.code == 200) {
			// 			this.r.plant_image = data.data.data;
			// 		}
			// 	})
			// },
			// 提交
			submitForm(formName) {
		        this.$refs[formName].validate((valid) => {
		          	if (valid) {
		          		let {scheme_name,plant,grow_cycle,remark,plant_image} = this.r;
	          			let data = {
	          				scheme_name,
	      					plant,
	      					grow_cycle,
	      					remark,
	      					plant_image
	          			}
	          			this.r.id ? (data.id = this.r.id) : (data.create_time = "");
	          			this.fullscreenLoading = true;
	          			axios({
		          			method: "post",
		          			url:this.r.id ? `${this.apiurl}/la/plant/head/modify` : `${this.apiurl}/la/plant/head/add`,
		          			data: {
		          				data
		          			}
		          		}).then(data => {
		          			this.fullscreenLoading = false;
		          			if(data.data.code == 200) {
		          				let message = this.r.id ? this.$t('message.修改成功') : this.$t('message.添加成功');
		          				this.$refs[formName].resetFields();
		          				this.dialogVisible = false;
		          				this.$message({
					              type: 'success',
					              message
					            });
					            this.getList();
		          			}
		          		})
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
		        }).then(() => {
		        	this.fullscreenLoading = true;
		          	axios({
		          		method: "post",
		          		url: `${this.apiurl}/la/plant/head/del`,
		          		data: {
		          			data: {
		          				id: row.id
		          			}
		          		}
		          	}).then(data => {
		          		this.fullscreenLoading = false;
						if(data.data.code == 200) {
							this.$message({
				              type: 'success',
				              message: this.$t('message.删除成功')
				            });
				            this.getList();
						}
		          	})
		        })
			},
			// 拷贝
			handleCopy(index,row) {
				let {scheme_name,plant,plant_image,grow_cycle,create_time,remark} = row;
				this.fullscreenLoading = true;
				axios({
	          		method: "post",
	          		url: `${this.apiurl}/la/plant/head/copy`,
	          		data: {
	          			data: {
	          				old_id: row.id,
	          				scheme_name: scheme_name + "_copy",
	          				plant,
	          				plant_image,
	          				grow_cycle,
	          				create_time,
	          				remark
	          			}
	          		}
	          	}).then(data => {
	          		this.fullscreenLoading = false;
					if(data.data.code == 200) {
						this.$message({
			              type: 'success',
			              message: this.$t('message.复制成功')
			            });
			            this.getList();
					}
	          	})
			},
			// 跳转到设置阶段页面
			handleToPlanStageShow(index,row) {
				this.$router.push(`/PlanStageShow?id=${row.id}&scheme_name=${row.scheme_name}`);
			},
			// 跳转到配置记录页面
			handToCulRecords(index,row) {
		      	this.$router.push(`/CulRecords?plant=${row.plant}&scheme_name=${row.scheme_name}`);
		    }
		},
		mounted() {
			this.getList();
			autoJump(1);
		}
	}
</script>