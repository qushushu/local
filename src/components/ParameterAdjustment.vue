<!-- 
  组件说明： 本组件为设置设备参数值组件。
  进入方式： 导航 -> 设备参数 -> 某一条目下参数按钮
  用户权限： 操作员可以使用。未登录用户或其他用户自动跳转至首页。
-->
<template>
	<div class="ym-main">
		<a-card class="card-pd">
			<!-- 头部标题 start -->
			<PageHeader :title="$t('message.设置参数值')" goBack=true></PageHeader>
			<!-- 头部标题 end -->
			<!-- 表格 start -->
			<el-table ref="multipleTable" :data="tableData" border stripe size="small" :height="heightW3" tooltip-effect="dark" style="margin-top: 20px;">
			    <el-table-column prop="sort_index" :label="$t('message.序号')" width="50"></el-table-column>
			    <el-table-column prop="param_code" :label="$t('message.代码')" width="100"></el-table-column>
			    <el-table-column prop="name" :label="$t('message.参数项')" width="160"></el-table-column>
			    <el-table-column prop="unit" :label="$t('message.单位')" width="60"></el-table-column>
			    <el-table-column prop="remark" :label="$t('message.备注')" width="160"></el-table-column>
			    <el-table-column prop="ref_value" :label="$t('message.参数值')">
		    		<template slot-scope="scope">
		    			<el-input :placeholder="$t('message.请输入内容')" size="small" v-model="scope.row.ref_value"></el-input>
					</template>
			    </el-table-column>
			</el-table>
			<!-- 表格 end -->
			<!-- 功能按钮 start -->
			<div style="padding-top: 10px;">
				<el-button type="primary" size="small" @click="save">{{$t('message.保存')}}</el-button>
				<el-button type="default" size="small" @click="write" v-loading.fullscreen.lock="fullscreenLoading">{{$t('message.写设备参数')}}</el-button>
				<el-button type="warning" size="small" @click="read">{{$t('message.读设备参数')}}</el-button>
			</div>
			<!-- 功能按钮 end -->
		</a-card>
	</div>
</template>

<script>
	import PageHeader from "./common/PageHeader"
	import axios from 'axios'
	import aCard from "./common/Acard"
	import {switchTimeToShow,switchTimeToSubmit,autoJump} from "../assets/tools/tool.js"
	export default {
		data() {
			return {
				fullscreenLoading: false,
				param_item: {},
		        tableData: []  // 表格数据
	      	}
		},
		computed: {
	    	apiurl() {
                return this.$store.state.apiurl;
            },
            operateNo() {
            	return this.$store.state.user.operateNo;
            },
            op_id() {
            	return this.$store.state.user.userId;
            },
            isPlant() {
            	return this.$store.state.isPlant;
            },
            isMobile() {
                return this.$store.state.isMobile;
            },
            heightW3() {
            	return this.isMobile ? 885 : 647
            }
	    },
		components: {
	    	PageHeader,
	    	aCard
	    },
	    methods: {
	    	// 用来获取左侧的参数列表
	    	getList() {
	    		axios({
	    			url: `${this.apiurl}/la/dev_model/get`,
	    			method: "post",
	    			data: {
	    				data: {
				            model_code: this.$route.query.model_code
				        }
	    			}
	    		}).then(data => {
	    			if(data.data.code == 200) {
	    				this.tableData = data.data.data.param_item;
	    				this.get_dev();
	    			}
	    		})
	    	},
	    	// 获取实例的对应参数
	    	get_dev() {
	    		axios({
	    			url: `${this.apiurl}/la/device/param/get_dev`,
	    			method: "post",
	    			data: {
	    				data: {
				            id: this.$route.query.dev_inst_id
				        }
	    			}
	    		}).then(data => {
	    			if(data.data.code == 200) {
	    				this.param_item = data.data.data.param_item;
	    				let arrTime = ["SUNRIZE","SUNSET"];
	    				this.param_item.forEach(item => {
	    					this.tableData.forEach(item1 => {
	    						if(item1["param_code"] === item["param_code"]) {
	    							item1["ref_value"] = item["value"];
	    							item1 = switchTimeToShow(item1);
	    						}
	    					});
	    				});
	    			}
	    		})
	    	},
	    	// 保存
	    	baseSave() {
	    		return new Promise(resolve => {
	    			let param_item = [];
		    		this.tableData.forEach(item => {
		    			item = switchTimeToSubmit(item);
		    			let json = {
		    				dev_model_param_id: item.id,
		    				value: /PH/g.test(item.param_code) ? Number(Number(item.ref_value).toFixed(2)) : Number(Number(item.ref_value).toFixed(1)) 
		    			}
		    			param_item.push(json);
		    		});
		    		axios({
		    			url: `${this.apiurl}/la/device/param_item/save`,
		    			method: "post",
		    			data: {
		    				data: {
					            dev_inst_id: this.$route.query.dev_inst_id,
	        					dev_model_id: this.$route.query.dev_model_id,
	        					param_item
					        }
		    			}
		    		}).then(data => {
		    			if(data.data.code == 200) {
		    				resolve();
		    			}
		    		})
	    		})
	    	},
	    	// 保存
	    	save() {
	    		let res = this.baseSave();
	    		res.then(_=> {
	    			this.$message({
		              type: 'success',
		              message: this.$t('message.保存成功')
		            });
    				this.getList();
	    		})
	    	},
	    	// 读设备参数
	    	read() {
	    		axios({
	    			url: `${this.apiurl}/la/device/param/read`,
	    			method: "post",
	    			data: {
	    				data: {
	    					"operateNo": this.operateNo,
					        "op_id": this.op_id,
					        "op_type": this.isPlant ? "OP_PLANT_CALL_SET" : "OP_SEEDLING_CALL_SET",     
					        "dev_id": parseInt(this.$route.query.dev_inst_id)
				        }
	    			}
	    		}).then(data => {
	    			if(data.data.code == 200) {
	    				let itemList = data.data.data.item;
				        let result = this.tableData.map(item => {
				        	for(let i = 0;i < itemList.length;i++) {
				        		itemList[i] = switchTimeToShow(itemList[i]);
				        		if(itemList[i]["param_code"].toUpperCase() == item["param_code"].toUpperCase()) {
				        			let json = {
				        				name: item["name"],
								        ref_value: itemList[i]["value"],
								        param_code: item["param_code"].toUpperCase(),
								        sort_index: item["sort_index"],
								        unit: item["unit"],
								        remark: item["remark"],
								        id: item["id"],
	    								dev_model_id: item["dev_model_id"]
				        			}
				        			json = switchTimeToShow(json);
				        			return json;
				        		}
				        	}
			        	});
			        	this.tableData = result;
			        	this.$message({
			              type: 'success',
			              message: this.$t('message.读取成功')
			            });
	    			}
	    		})
	    	},
	    	// 写设备参数
	    	write() {
	    		this.$confirm(this.$t('message.确认写入设备参数？'), this.$t('message.确认信息'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('message.确认'),
                    cancelButtonText: this.$t('message.取消')
                }).then(()=> {
                	let res = this.baseSave();
                	res.then(_ => {
	                	let param_item = [];
			    		this.tableData.forEach(item => {
			    			param_item.push({
			    				param_id: item.sort_index,
			    				param_code: item["param_code"],
			    				value: /PH/g.test(item.param_code) ? Number(Number(item.ref_value).toFixed(2)) : Number(Number(item.ref_value).toFixed(1))
			    			})
			    		});
			    		this.fullscreenLoading = true;
			    		let data = {
			    			data: {
			    				operateNo: this.operateNo,
					        	op_id: this.op_id,
						        op_type: this.isPlant ? "OP_PLANT_SET_SET" : "OP_SEEDLING_SET_SET",
						        dev_id: 1,
						        instance_number: this.$route.query.instance_number,     
						        item_num: param_item.length,
					            dev_inst_id: parseInt(this.$route.query.dev_inst_id),
		    					dev_model_id: parseInt(this.$route.query.dev_model_id),
		    					item: param_item
					        }
			    		};
			    		axios({
			    			url: `${this.apiurl}/la/device/param/write`,
			    			method: "post",
			    			data
			    		}).then(data => {
			    			this.fullscreenLoading = false;
			    			if(data.data.code == 200) {
			    				this.$message({
					              type: 'success',
					              message: this.$t('message.操作成功')
					            });
					            this.getList();
			    			}
			    		})
                	})
                })
	    	},
	    },
	    mounted() {
	    	this.getList();
	    	autoJump(1);
	    },
	}
</script>