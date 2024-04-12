<!-- 
  组件说明： 本组件为设置设备参数值组件。
  进入方式： 操作员登录后点击导航栏"设备参数"。列表任一条目下"参数"按钮进入。
  用户权限： 操作员可以使用。
-->
<template>
	<div class="ym-main">
		<a-card class="card-pd">
			<!-- 头部标题 start -->
			<PageHeader :title="$t('message.设置参数值')"></PageHeader>
			<!-- 头部标题 end -->
			<!-- 表格 start -->
			<el-row :gutter="10" type="flex" style="margin-top: 20px;">
				<el-col :span="14">
                    <h5 class="adjustTitle">{{$t('message.参数值调整')}}</h5>
                    <el-table class="space-btm" ref="multipleTable" :data="tableData" border stripe size="small" :height="heightW3" style="margin-top: 20px;">
                        <el-table-column prop="sort_index" :label="$t('message.序号')" width="50"></el-table-column>
                        <el-table-column prop="name" :label="$t('message.参数项')" width="160"></el-table-column>
                        <el-table-column prop="param_code" :label="$t('message.代码')" width="150"></el-table-column>
                        <el-table-column prop="ref_value" :label="$t('message.参数值')">
                            <template slot-scope="scope">
                                <el-input :placeholder="$t('message.请输入内容')" size="small" v-model="scope.row.ref_value" :disabled="disabledCodeList.includes(scope.row.param_code)" v-if="scope.row"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="unit" :label="$t('message.单位')" width="200"></el-table-column>
                    </el-table>
                </el-col>
                <el-col>
                    <div :span="10">
                        <h5 class="adjustTitle">{{$t('message.开关量调整')}}</h5>
                        <el-table class="space-btm" ref="multipleTable" :data="tableData1" border stripe size="small" :height="heightW3">
                            <el-table-column prop="id" :label="$t('message.序号')" width="45"></el-table-column>
                            <el-table-column prop="name" :label="$t('message.参数项')" width="185"></el-table-column>
                            <el-table-column prop="code" :label="$t('message.代码')" width="100"></el-table-column>
                            <el-table-column prop="ref_value" :label="$t('message.参数值')" width="70">
                                <template slot-scope="scope">
                                    <el-switch v-model="control1[scope.row.id - 1]" class="mobile-co2-btn" @change="changeControl1($event,scope.row,control1)" />
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
			</el-row>
			
			<!-- 表格 end -->
			<!-- 功能按钮 start -->
			<div>
				<el-button type="primary" size="small" @click="save">{{$t('message.保存')}}</el-button>
				<el-button type="default" size="small" @click="write" v-loading.fullscreen.lock="fullscreenLoading">{{$t('message.写设备参数')}}</el-button>
				<el-button type="warning" size="small" @click="read">{{$t('message.读设备参数')}}</el-button>
				<label>
					<span class="nmbtn">{{$t('message.导入excel')}}</span>
					<input type="file"  @change="importExcel">
				</label>
				<el-button size="small" @click="downloadExl" v-if="tableData.length && !isMobile">{{$t('message.导出excel')}}</el-button>
			</div>
			<!-- 功能按钮 end -->
		</a-card>
	</div>
</template>
<script>
	import * as XLSX from "XLSX"
	import {get_dev_model,get_dev,save_device_param_item,read_device_param,write_device_param} from "../../../store/ajax.js"
	import download from "../../../assets/tools/downloadExcel"
	import {switchTimeToShow,switchTimeToSubmit} from "../../../assets/tools/tool.js"
	import arrDisList from "../../../config/config/param/dig_list.js"
    import {envMixin} from "@/components/mixins/envMix"
	export default {
		data() {
			return {
				fullscreenLoading: false,
				param_item: {},
		        tableData: [],
		        tableData1: [],
                control1: [],
                disabledCodeList: ["MODEL","CONTROL1","CONTROL2"]
	      	}
		},
        mixins: [envMixin],
		computed: {
			userInfo() {return this.$store.state.userInfo},
            op_id() {return this.userInfo.user.id},
            heightW3() {return this.isMobile ? 805 : 647},
            originCtrol1() {
                let tb = this.tableData;
                let res = '0';
                if(tb.length && tb[1]) {
                    let rf = tb[1].ref_value;
                    Number(rf) && (res = String(Number(rf).toString(2)));
                }
                return res.padStart(15,"0").split("").reverse().map(item => item == '1');
            }
	    },
	    watch: {
            originCtrol1(d) {
                this.control1 = d;
            }
        },
	    methods: {
	    	changeControl1(a,b,c) {
            },
	    	// 用来获取左侧的参数列表
	    	async getList() {
	    		// 获取模板参数
	    		let res = await get_dev_model(this.$route.query.model_code);
	    		this.tableData = res.param_item;
	    		// 获取设备参数
	    		let res1 = await get_dev(this.$route.query.dev_inst_id);
	    		// 设备参数代替模板参数
	    		if(res1 && res1.param_item) {
		    		res1.param_item.forEach(item => {
			    		this.tableData.forEach(item1 => {
							if(item1["param_code"] === item["param_code"]) {
								item1["ref_value"] = item["value"];
							}
						});
		    		});
	    		}
	    	},
	    	digListToNumber() {
                let arr = this.control1.map(item => item ? '1' : 0).reverse();
                return parseInt(arr.join(""),2);
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
	    	// 保存
	    	baseSave() {
	    		return new Promise(async resolve => {
	    			let param_item = [];
	    			/*
						参数改变：
						1).时间转化
						2).PH保留两位，其他保留一位小数
	    			*/
		    		this.tableData.forEach(item => {
		    			if(item) {
			    			item = switchTimeToSubmit(item);
			    			let value = item.ref_value;
			    			let code = item.param_code;
			    			if(/PH/g.test(code)) {
			    				value = Number(Number(value).toFixed(2));
			    			} else if(/CONTROL1/g.test(code)) {
			    				value = this.digListToNumber();
			    			} else if(/CONTROL2/g.test(code)) {
			    				value = 0
			    			} else {
			    				value = Number(Number(value).toFixed(1))
			    			}
			    			let json = {
			    				dev_model_param_id: item.id,
			    				value
			    			}
			    			param_item.push(json);
		    			}
		    		});
		    		this.fullscreenLoading = true;
		    		let res = await save_device_param_item({
		    			dev_inst_id: this.$route.query.dev_inst_id,
    					dev_model_id: this.$route.query.dev_model_id,
    					param_item
		    		});
		    		this.fullscreenLoading = false;
		    		res && resolve();
	    		})
	    	},
	    	
	    	// 读设备参数
	    	async read() {
	    		let res = await read_device_param({
	    			op_id: this.userInfo.user.account,
			        op_type: "OP_FARM_CALL_SET",     
			        dev_id: parseInt(this.$route.query.dev_inst_id)
	    		});
	    		if(res) {
    				let itemList = res.item;
			        let result = this.tableData.map((item) => {
			        	if(item) {
				        	let tmp = itemList.filter(itm => {
				        		return itm["param_code"].toUpperCase() == item["param_code"].toUpperCase() || '';
				        	});
				        	if(tmp.length) {
				        		let json = {
			        				name: item["name"],
							        ref_value: tmp[0]["value"],
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
	    	},
	    	// 写设备参数
	    	write() {
	    		this.$confirm(this.$t('message.确认写入设备参数？'), this.$t('message.确认信息'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('message.确认'),
                    cancelButtonText: this.$t('message.取消')
                }).then(()=> {
                	let res = this.baseSave();
                	res.then(async _ => {
	                	let param_item = [];
			    		this.tableData.forEach(item => {
			    			if(item) {
				    			param_item.push({
				    				param_id: item.sort_index,
				    				param_code: item["param_code"],
				    				value: /PH/g.test(item.param_code) ? Number(Number(item.ref_value).toFixed(2)) : Number(Number(item.ref_value).toFixed(1))
				    			})
			    			}
			    		});
			    		this.fullscreenLoading = true;
			    		let res = await write_device_param({
				        	op_id: this.op_id,
					        op_type: "OP_FARM_SET_SET",
					        dev_id: 1,
					        instance_number: this.$route.query.instance_number,     
					        item_num: param_item.length,
				            dev_inst_id: parseInt(this.$route.query.dev_inst_id),
	    					dev_model_id: parseInt(this.$route.query.dev_model_id),
	    					item: param_item
			    		})
			    		if(res) {
			    			this.fullscreenLoading = false;
		    				if(res) {
			    				this.$message({
					              type: 'success',
					              message: this.$t('message.操作成功')
					            });
					            this.getList();
			    			}
			    		}
                	})
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
				let newTableData = [];
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
						let param_item = data.forEach(item=> {
							let json = {
								dev_model_id: Number(this.$route.query.dev_model_id),
								name: item[this.$t('message.备注')],
								param_code:item[this.$t('message.代码')],
								ref_value:item['参考值'],
								remark:item[this.$t('message.备注')],
								show_ref_value: item['参考值'],
								sort_index: item[this.$t('message.序号')],
								unit: item[this.$t('message.单位')] || '--',
							}
							newTableData.push(json);
						});
						newTableData.map(item => {
							let arr = this.tableData.filter(it1 => it1.param_code == item.param_code)
							if(arr.length) {
								item.id = arr[0].id
							}
							return item;
						})
						this.tableData = newTableData;
						this.$message({
			              type: 'success',
			              message: this.$t('message.导入成功')
			            });
			            ev.target.value="";
					} catch (err) {
						console.log(err);
					}
				}
	    	},
	    	// 导出excel
	    	downloadExl() {
	    		let result = this.tableData.map(item => {
		    		return {
		    			[this.$t('message.序号')]: item.sort_index,
		    			[this.$t('message.代码')]: item.param_code,
		    			[this.$t('message.备注')]: item.name,
		    			[this.$t('message.单位')]: item.unit,
		    			['参考值']: item.ref_value,
		    			[this.$t('message.备注')]:item.remark
		    		}
		    	});
		    	download(result, `Parameter Value Table.xlsx`);
	    	}
	    },
	    mounted() {
	    	this.getList();
	    	this.tableData1 = arrDisList;
	    }
	}
</script>