<!-- 
  组件说明： 本组件为手动操作面板配液设置组件。
-->
<template>
	<div>
		<!-- PC基本信息 start -->
		<a-card size="small" class="space-btm1 text-center" id="smartgrow-home-card1">
            <el-row justify="space-between" type="flex" :gutter="6">
                <el-col v-for="item,key in dataInfo" :key="key" class="op-card_mobile1">
                    <div class="mobile-wrap-card">
                        <p class="text-dt">{{item.name}}</p>
                        <p class="text-dd">{{item.value}} <span class="dw" v-if="item.dw">{{item.dw}}</span></p>
                    </div>
                </el-col>
            </el-row>
        </a-card>
		<!-- PC基本信息 end -->
		<!-- PC 转速、重量 start -->
        <a-card style="overflow: auto;">
          	<table class="normal-table text-center tb-atw">
				<tr>
					<td class="td-name" style="width: 80px;"></td>
					<td class="td-onoff">{{$t("message.开关")}}</td>
					<td class="td-zs">{{$t("message.转速")}}</td>
                    <td v-if="!isMobile">{{$t("message.当前质量")}}(g)</td>
                    <td v-if="!isMobile">{{$t("message.起始质量")}}(g)</td>
                    <td v-if="!isMobile">{{$t("message.本次增加质量")}}(g)</td>
                    <td v-if="isMobile">当前 / 起始 / 增加质量(g)</td>
				</tr>
				<tr v-for="num in 5">
                    <!-- 蠕动泵名称 start -->
                    <td>{{nameList[num - 1]}}</td>
                    <!-- 蠕动泵名称 end -->
                    <!-- 开关 start -->
                    <td> <el-switch @change="onChangeRdb" :disabled="runInfo.dig.AUTO === 1" :asid="num" v-model="radioOnOff[num-1]"></el-switch></td>
                    <!-- 开关 end -->
                    <!-- 转速 start -->
                    <td><el-input-number v-for="i in 5" :key="i" :step="5"  v-if="num == i" :disabled="runInfo.dig.AUTO === 1" v-model="sliderData[i-1]" @change="onChangeZs" :min="0" :max="300" :label="$t('message.描述文字')" size="small"></el-input-number></td>
                    <!-- 转速 end -->
                    <!-- 质量 start -->
                    <td v-if="!isMobile">{{runInfo.ana["W" + num]}}</td>
                    <td v-if="!isMobile">{{runInfo.ana["WS" + num] || "--"}}</td>
                    <td v-if="!isMobile">{{(runInfo.ana["WS" + num] - runInfo.ana["W" + num]).toFixed(1) || "--"}}</td>
                    <td v-if="isMobile">{{runInfo.ana["W" + num]}} / {{runInfo.ana["WS" + num] || "--"}} / {{(runInfo.ana["WS" + num] - runInfo.ana["W" + num]).toFixed(1) || "--"}}</td>
                    <!-- 质量 end -->
				</tr>
          	</table>
		</a-card>
		<!-- PC 转速、重量 end -->
	</div>
</template>
<style scoped>
   .td-name {width: 105px;}
   .td-onoff {width: 65px;}
   .td-zs {width: 145px;}
</style>
<script>
    import aCard from "../common/Acard"
	export default {
		data() {
			return {
				nameList: [this.$t('message.A液蠕动泵'),this.$t('message.B液蠕动泵'),this.$t('message.C液蠕动泵'),this.$t('message.酸液蠕动泵'),this.$t('message.碱液蠕动泵')],
                oldSliderData: [],
				sliderData: [],
			}
		},
		methods: {
			// 蠕动泵开关修改
			onChangeRdb(checked) {
				let value = checked ? 1 : 0;
                let tNode = event.target.parentNode;
                let baseNum = parseInt(tNode.getAttribute("asid"));
				this.$confirm(value ? '是否开启蠕动泵开关?' : '是否关闭蠕动泵开关?', '提示', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(()=> {
					let data = {
						data_id: 256 + baseNum,
					    data_code: "C_PP" + baseNum,
					    value
					}
					this.$store.dispatch("control",{
						data
		    		});
                })
			},
            // 改变酸液蠕动泵转速值
            onChangeZs(value) {
                let data_id = 0;
                this.sliderData.forEach((item,key) => {
                    if(item !== this.oldSliderData[key]) {
                        data_id = key + 1;
                    }
                });
                this.$confirm('确认修改蠕动泵转速值', '提示', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(()=> {
                    this.oldSliderData = [...this.sliderData];
                    this.$store.dispatch("adjust",{
                        data: {
                            data_id,
                            data_code: `ADJ_ZS${data_id}`,
                            value
                        }
                    });
                }).catch(err => {
                    this.sliderData = [...this.oldSliderData];
                });
            },
		},
		watch: {
			showArrZs(data) {
				this.sliderData = data;
			},
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
            isMobile() {
                return this.$store.state.isMobile;
            },
            // 获取当前信息
            runInfo() {
                return this.$store.state.runInfo;
            },
            // EC、PH、液位、液温
            dataInfo() {
                return [{
                    name: this.$t('message.营养液EC'),
                    value: this.runInfo.ana.EC ? this.runInfo.ana.EC.toFixed(2) : '--',
                    dw: "us/cm"
                },{
                    name: this.$t('message.营养液PH'),
                    value: this.runInfo.ana.PH ? this.runInfo.ana.PH.toFixed(2) : '--',
                },{
                    name: this.$t('message.液位'),
                    value: this.runInfo.ana.LIQ_LV ? this.runInfo.ana.LIQ_LV.toFixed(2) : '--',
                    dw: "CM"
                },{
                    name: this.$t('message.液温'),
                    value: this.runInfo.ana.LIQ_TEMP ? this.runInfo.ana.LIQ_TEMP.toFixed(2) : '--',
                    dw: "℃"
                }]
            },
            // 获取当前转速信息
	    	showArrZs() {
	    		let {ZS1,ZS2,ZS3,ZS4,ZS5} = this.runInfo.ana;
	    		return [ZS1,ZS2,ZS3,ZS4,ZS5];
	    	},
            // 获取开关状态
	    	radioOnOff() {
	    		let {PP1,PP2,PP3,PP4,PP5} = this.runInfo.dig;
                return [PP1,PP2,PP3,PP4,PP5].map(item => {
                    return item == "1" ? true: false;
                });
	    	},
		    op_onOff() {
            	return this.$store.state.op_onOff;
            }
	    },
        components: {
            aCard
        },
	    mounted() {
	    	this.$store.dispatch("updateRunInfo");
		}
	}
</script>