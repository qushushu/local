<!-- 
  组件说明： 本组件为手动操作面板配液设置组件。
-->
<template>
	<div>
        <!-- 营养液相关信息 start -->
        <DevInfo1 />
        <!-- 营养液相关信息 end -->
		<!-- PC 转速、重量 start -->
        <a-card class="auto_card">
          	<table class="normal-table text-center tb-atw">
				<tr>
					<td class="td-name"></td>
					<td class="td-onoff">{{$t("message.开关")}}</td>
                    <td>{{$t("message.转速")}}</td>
					<td class="td-zs">{{$t("message.转速调节")}}</td>
                    <td v-if="!isMobile">{{$t("message.当前质量")}}(g)</td>
                    <td v-if="!isMobile">{{$t("message.起始质量")}}(g)</td>
                    <td v-if="!isMobile">{{$t("message.本次增加质量")}}(g)</td>
                    <td v-if="isMobile">{{$t("message.当前")}} / {{$t("message.起始")}} / {{$t("message.增加质量")}}(g)</td>
				</tr>
				<tr v-for="num in nameList.length">
                    <!-- 蠕动泵名称 start -->
                    <td>{{nameList[num - 1]}}</td>
                    <!-- 蠕动泵名称 end -->
                    <!-- 开关 start -->
                    <td><el-switch class="js_rdb" @change="onChangeRdb($event,num)" :disabled="runInfo.dig.AUTO === 1" :asid="num" v-model="radioOnOff[num-1]"></el-switch></td>
                    <!-- 开关 end -->
                    <!-- 转速 start -->
                    <td><span>{{showArrZs[num-1]}}</span></td>
                    <!-- 转速 end -->
                    <!-- 转速调节 start -->
                    <td><el-input-number v-for="i in 5" :key="i" :step="5"  v-if="num == i" :disabled="runInfo.dig.AUTO === 1" v-model="sliderData[i-1]" @change="onChangeZs($event,i)" :min="0" :max="300" :label="$t('message.描述文字')" size="small"></el-input-number></td>
                    <!-- 转速调节 end -->
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
<script>
    import {runInfoMixin} from "../mixins/runinfo"
    import {envMixin} from "@/components/mixins/envMix"
    import DevInfo1 from "./DevInfo1"
	export default {
        mixins: [runInfoMixin,envMixin],
		data() {
			return {
				nameList: [this.$t('message.A液蠕动泵'),this.$t('message.B液蠕动泵'),this.$t('message.C液蠕动泵'),this.$t('message.酸液蠕动泵'),this.$t('message.碱液蠕动泵')],
                oldSliderData: [],
				sliderData: [],
                timer: null,
                isUpdate: false
			}
		},
        computed: {
            // 获取当前转速信息
            showArrZs() {
                let {ZS1,ZS2,ZS3,ZS4,ZS5} = this.runInfo.ana;
                return [ZS1,ZS2,ZS3,ZS4,ZS5];
            },
            // 获取开关状态
            radioOnOff() {
                let {PP1,PP2,PP3,PP4,PP5} = this.runInfo.dig;
                return [PP1,PP2,PP3,PP4,PP5].map(item => item == "1" ? true: false);
            },
            op_onOff() {return this.$store.state.op_onOff}
        },
        watch: {
            showArrZs(data) {
                if(!this.isUpdate) {
                    this.isUpdate = true;
                    this.sliderData = [...data];
                }
            },
            op_onOff(value) {
                if(value) {
                    this.$message({
                        type: 'success',
                        message: `${this.$t('message.操作成功')}!`
                    });
                    this.$store.commit("changeOpOnoff",false);
                }
            }
        },
		methods: {
			// 蠕动泵开关修改
			onChangeRdb(checked,num1) {
				let value = checked ? 1 : 0;
				this.$confirm(value ? `${this.$t('message.是否开启蠕动泵开关')}?` : `${this.$t('message.是否关闭蠕动泵开关')}?`, this.$t('message.提示'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('message.确定'),
                    cancelButtonText: this.$t('message.取消'),
                }).then(()=> {
                    let nodeJsRdb = document.querySelectorAll(".js_rdb");
                    let tNode = nodeJsRdb[num1 - 1];
                    let baseNum = parseInt(tNode.getAttribute("asid"));
					this.$store.dispatch("control",{
						data: {
                            data_id: 256 + baseNum,
                            data_code: "C_PP" + baseNum,
                            value
                        }
		    		});
                })
			},
            // 改变酸液蠕动泵转速值
            onChangeZs(value,i) {
                this.noUpData();
                let data_id = i;
                this.$confirm(`${this.$t('message.确认修改蠕动泵转速值')}`, this.$t('message.提示'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('message.确定'),
                    cancelButtonText: this.$t('message.取消'),
                }).then(()=> {
                    // this.toUpData();
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
            noUpData() {
                clearInterval(this.timer);
            }
		},
        components: {
            DevInfo1
        }
	}
</script>