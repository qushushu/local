<!-- 
  组件说明： 本组件为手动操作面板喷灌设置组件。
-->
<template>
    <div>
        <a-card class="space-btm1 card-pd mobile-no-bg">
            <el-row :gutter="20" class="mobile-oncellbox">
                <!-- 实时液位 start -->
                <el-col :span="8" class="mobile-oncell">
                    <h5> {{$t("message.实时液位")}} (cm)</h5>
                    <p class="desc_txt">{{runInfo.ana.LIQ_LV ? (runInfo.ana.LIQ_LV.toFixed(2)) : "未知"}}</p> 
                </el-col>
              <!-- 实时液位 end -->
              <!-- 育苗的左喷灌泵 start -->
              <el-col :span="8" class="mobile-oncell" v-if="!isPlant">
                  <h5 class="hide-mobile"> {{$t("message.喷灌泵")}}</h5>
                  <h5 class="hide-pc"> {{$t("message.左侧喷灌泵")}}</h5>
                  <p><span class="hide-mobile">{{$t("message.左侧喷灌泵")}}：</span><el-switch v-model="runInfo.dig.SIP1 == 1" @change="onChangeSIP1" :disabled="runInfo.dig.AUTO === 1" /></p>
              </el-col>
              <!-- 育苗的左喷灌泵 end -->
              <!-- 育苗的右喷灌泵 start -->
              <el-col :span="8" class="mobile-oncell" v-if="!isPlant">
                  <h5 class="hide-mobile">&nbsp;</h5>
                  <h5 class="hide-pc">{{$t("message.右侧喷灌泵")}}</h5>  
                  <p><span class="hide-mobile">{{$t("message.右侧喷灌泵")}}：</span><el-switch v-model="runInfo.dig.SIP2 == 1" @change="onChangeSIP2" :disabled="runInfo.dig.AUTO === 1" /></p>
              </el-col>
              <!-- 育苗的右喷灌泵 end -->
              <!-- 种植喷灌泵 start -->
              <el-col :span="8" class="mobile-oncell" v-if="isPlant">
                  <h5>{{$t("message.喷灌泵")}}</h5>
                  <p><span class="hide-mobile">{{$t("message.喷灌泵")}}：</span><el-switch v-model="runInfo.dig.SIP == 1" @change="onChangeSIP3" :disabled="runInfo.dig.AUTO === 1" /></p>
              </el-col>
              <!-- 种植喷灌泵 end -->
            </el-row>
        </a-card>
        <a-card class="space-btm1 card-pd mobile-no-bg">
            <el-row :gutter="20" class="mobile-oncellbox">
                <!-- 育苗回水泵 start -->
                <el-col :span="8" v-if="!isPlant" class="mobile-oncell">
                    <h5>{{$t("message.回水泵")}}</h5>
                    <p><span class="hide-mobile">{{$t("message.回水泵1")}}：</span><el-switch v-model="runInfo.dig.BWP1 == 1" @change="onChangeBWP1" :disabled="runInfo.dig.AUTO === 1" /></p>
                </el-col>
                <!-- 育苗回水泵 end -->
                <!-- 种植回水泵 start -->
                <el-col :span="8" v-if="isPlant" class="mobile-oncell">
                    <h5>{{$t("message.回水泵")}}</h5>
                    <p><span class="hide-mobile">{{$t("message.回水泵")}}：</span><el-switch v-model="runInfo.dig.BWP == 1" @change="onChangeBWP1" :disabled="runInfo.dig.AUTO === 1" /></p>
                </el-col>
                <!-- 种植回水泵 end -->
                <!-- 补水阀 start -->
                <el-col :span="8" class="mobile-oncell">
                    <h5>{{$t("message.补水阀")}}</h5>
                    <p><span class="hide-mobile">{{$t("message.补水阀")}}：</span><el-switch v-model="runInfo.dig.WSV == 1" @change="onChangeWSV" :disabled="runInfo.dig.AUTO === 1" /></p>
                </el-col>
                <!-- 补水阀 end -->
                <!-- 搅拌泵 start -->
                 <el-col :span="8" class="mobile-oncell">
                    <h5>{{$t("message.搅拌泵")}}</h5>
                    <p><span class="hide-mobile">{{$t("message.搅拌泵")}}：</span><el-switch v-model="runInfo.dig.MIX_P == 1" @change="onChangeMIX_P" :disabled="runInfo.dig.AUTO === 1" /></p>
                </el-col>
                <!-- 搅拌泵 end -->
            </el-row>
        </a-card>
        <!-- 育苗水阀 start -->
        <a-card class="card-pd" v-if="!isPlant" >
            <h5 class="like-mobileone-title">{{$t("message.水阀")}}</h5>
            <table class="normal-table">
                <tr>
                    <td style="width: 62px;"></td>
                    <td>{{$t("message.左侧水阀")}}</td>
                    <td>{{$t("message.右侧水阀")}}</td>
                </tr>
                <tr>
                    <td>{{$t("message.第四层")}}</td>
                    <td>{{$t("message.状态")}}：<el-switch v-model="runInfo.dig.VL4 == '1'" @change="onChangeVL4" :disabled="runInfo.dig.AUTO === 1" /></td>
                    <td>{{$t("message.状态")}}：<el-switch v-model="runInfo.dig.VR4 == '1'" @change="onChangeVR4" :disabled="runInfo.dig.AUTO === 1" /></td>
                </tr>
                <tr>
                    <td>{{$t("message.第三层")}}</td>
                    <td>{{$t("message.状态")}}：<el-switch v-model="runInfo.dig.VL3 == '1'" @change="onChangeVL3" :disabled="runInfo.dig.AUTO === 1" /></td>
                    <td>{{$t("message.状态")}}：<el-switch v-model="runInfo.dig.VR3 == '1'" @change="onChangeVR3" :disabled="runInfo.dig.AUTO === 1" /></td>
                </tr>
                <tr>
                    <td>{{$t("message.第二层")}}</td>
                    <td>{{$t("message.状态")}}：<el-switch v-model="runInfo.dig.VL2 == '1'" @change="onChangeVL2" :disabled="runInfo.dig.AUTO === 1" /></td>
                    <td>{{$t("message.状态")}}：<el-switch v-model="runInfo.dig.VR2 == '1'" @change="onChangeVR2" :disabled="runInfo.dig.AUTO === 1" /></td>
                </tr>
                <tr>
                    <td>{{$t("message.第一层")}}</td>
                    <td>{{$t("message.状态")}}：<el-switch v-model="runInfo.dig.VL1 == '1'" @change="onChangeVL1" :disabled="runInfo.dig.AUTO === 1" /></td>
                    <td>{{$t("message.状态")}}：<el-switch v-model="runInfo.dig.VR1 == '1'" @change="onChangeVR1" :disabled="runInfo.dig.AUTO === 1" /></td>
                </tr>
            </table>
        </a-card>
        <!-- 育苗水阀 end -->
    </div>
</template>
<style scoped>
	/*td {vertical-align: middle;}*/
  	.desc_txt {font-size: 14px; color: #5e6d82; line-height: 1.5em;}
</style>
<script>
    import aCard from "../common/Acard"
	export default {
		methods: {
			// 修改左喷灌泵状态
			onChangeSIP1(checked) {
				this.$confirm('确认修改左喷灌泵状态?', '提示', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(()=> {
					let value = checked ? 1 : 0;
					this.$store.dispatch("control",{
						data: {
						    data_id: 1,
						    data_code: "C_SIP1",
						    value
						}
		    		});
                })
			},
			// 修改右喷灌泵状态
			onChangeSIP2(checked) {
				this.$confirm('确认修改右喷灌泵状态?', '提示', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(()=>{
					let value = checked ? 1 : 0;
					this.$store.dispatch("control",{
						data: {
						    data_id: 2,
						    data_code: "C_SIP2",
						    value
						}
		    		});
                })
			},
            onChangeSIP3(checked) {
                this.$confirm('确认修改喷灌泵状态?', '提示', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(()=>{
                    let value = checked ? 1 : 0;
                    this.$store.dispatch("control",{
                        data: {
                            data_id: 1,
                            data_code: "C_SIP1",
                            value
                        }
                    });
                })
            },
			// 修改回水泵状态
			onChangeBWP1(checked) {
				this.$confirm('确认修改回水泵状态?', '提示', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(()=> {
					let value = checked ? 1 : 0;
					this.$store.dispatch("control",{
						data: {
						    data_id: 3,
						    data_code: "C_BWP1",
						    value
						}
		    		});
                })
			},
            onChangeWSV(checked) {
                this.$confirm('确认修改补水阀状态?', '提示', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(()=> {
                    let value = checked ? 1 : 0;
                    this.$store.dispatch("control",{
                        data: {
                            data_id: 6,
                            data_code: "C_WSV",
                            value
                        }
                    });
                })
            },
            onChangeMIX_P(checked) {
                this.$confirm('确认修改搅拌泵状态?', '提示', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(()=> {
                    let value = checked ? 1 : 0;
                    this.$store.dispatch("control",{
                        data: {
                            data_id: 5,
                            data_code: "C_MP",
                            value
                        }
                    });
                })
            },
			// 修改左侧1层水阀
			onChangeVL1(checked) {
				this.$confirm('确认修改左侧一层水阀状态?', '提示', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(()=> {
					let value = checked ? 1 : 0;
					this.$store.dispatch("control",{
						data: {
						    data_id: 10,
						    data_code: "C_VL1",
						    value
						}
		    		});
                });
			},
			// 修改右侧1层水阀
			onChangeVR1(checked) {
				this.$confirm('确认修改右侧一层水阀状态?', '提示', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(()=> {
					let value = checked ? 1 : 0;
					this.$store.dispatch("control",{
						data: {
						    data_id: 14,
						    data_code: "C_VR1",
						    value
						}
		    		});
                });
			},
			// 修改左侧2层水阀
			onChangeVL2(checked) {
				this.$confirm('确认修改左侧二层水阀状态?', '提示', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(()=> {
					let value = checked ? 1 : 0;
					this.$store.dispatch("control",{
						data: {
						    data_id: 11,
						    data_code: "C_VL2",
						    value
						}
		    		});
                });
			},
			// 修改右侧2层水阀
			onChangeVR2(checked) {
				this.$confirm('确认修改右侧二层水阀状态?', '提示', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(()=> {
					let value = checked ? 1 : 0;
					this.$store.dispatch("control",{
						data: {
						    data_id: 15,
						    data_code: "C_VR2",
						    value
						}
		    		});
                });
			},
			// 修改左侧3层水阀
			onChangeVL3(checked) {
				this.$confirm('确认修改左侧三层水阀状态?', '提示', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(()=> {
					let value = checked ? 1 : 0;
					this.$store.dispatch("control",{
						data: {
						    data_id: 12,
						    data_code: "C_VL3",
						    value
						}
		    		});
                });
			},
			// 修改右侧3层水阀
			onChangeVR3(checked) {
				this.$confirm('确认修改右侧三层水阀状态?', '提示', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(()=> {
					let value = checked ? 1 : 0;
					this.$store.dispatch("control",{
						data: {
						    data_id: 16,
						    data_code: "C_VR3",
						    value
						}
		    		});
                });
			},
			// 修改左侧4层水阀
			onChangeVL4(checked) {
				this.$confirm('确认修改左侧四层水阀状态?', '提示', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(()=> {
					let value = checked ? 1 : 0;
					this.$store.dispatch("control",{
						data: {
						    data_id: 13,
						    data_code: "C_VL4",
						    value
						}
		    		});
                });
			},
			// 修改右侧4层水阀
			onChangeVR4(checked) {
				this.$confirm('确认修改右侧四层水阀状态?', '提示', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(()=> {
					let value = checked ? 1 : 0;
					this.$store.dispatch("control",{
						data: {
						    data_id: 17,
						    data_code: "C_VR4",
						    value
						}
		    		});
                });
			},
		},
		watch: {
			op_onOff(value) {
				if(value) {
					this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.$store.commit("changeOpOnoff",false);
				}
			}
		},
		computed: {
			runInfo() {
		        return this.$store.state.runInfo;
		    },
		    apiurl() {
                return this.$store.state.apiurl;
            },
            op_onOff() {
            	return this.$store.state.op_onOff;
            },
            isPlant() {
                return this.$store.state.isPlant;
            },
		},
        components: {
            aCard
        },
	    mounted() {
    		this.$store.dispatch("updateRunInfo");
		}
	}
</script>