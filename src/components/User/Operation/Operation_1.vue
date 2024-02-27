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
                    <p class="desc_txt">{{LIQ_LV}}</p> 
                </el-col>
              <!-- 实时液位 end -->
              <!-- 育苗的左喷灌泵 start -->
              <el-col :span="8" class="mobile-oncell" v-if="!isPlant">
                  <h5 class="hide-mobile"> {{$t("message.喷灌泵")}}</h5>
                  <h5 class="hide-pc"> {{$t("message.左侧喷灌泵")}}</h5>
                  <p><span class="hide-mobile">{{$t("message.左侧喷灌泵")}}：</span><el-switch v-model="SIP1" @change="onChangeSIP1" :disabled="AUTO" /></p>
              </el-col>
              <!-- 育苗的左喷灌泵 end -->
              <!-- 育苗的右喷灌泵 start -->
              <el-col :span="8" class="mobile-oncell" v-if="!isPlant">
                  <h5 class="hide-mobile">&nbsp;</h5>
                  <h5 class="hide-pc">{{$t("message.右侧喷灌泵")}}</h5>  
                  <p><span class="hide-mobile">{{$t("message.右侧喷灌泵")}}：</span><el-switch v-model="SIP2" @change="onChangeSIP2" :disabled="AUTO" /></p>
              </el-col>
              <!-- 育苗的右喷灌泵 end -->
              <!-- 种植喷灌泵 start -->
              <el-col :span="8" class="mobile-oncell" v-if="isPlant">
                  <h5>{{$t("message.喷灌泵")}}</h5>
                  <p><span class="hide-mobile">{{$t("message.喷灌泵")}}：</span><el-switch v-model="SIP" @change="onChangeSIP3" :disabled="AUTO" /></p>
              </el-col>
              <!-- 种植喷灌泵 end -->
            </el-row>
        </a-card>
        <a-card class="space-btm1 card-pd mobile-no-bg">
            <el-row :gutter="20" class="mobile-oncellbox">
                <!-- 回水泵 start -->
                <el-col :span="6" class="mobile-oncell">
                    <h5>{{$t("message.回水泵")}}</h5>
                    <p><span class="hide-mobile">{{$t("message.回水泵")}}：</span><el-switch v-model="BWP1" @change="onChangeBWP1" :disabled="AUTO" /></p>
                </el-col>
                <!-- 回水泵 end -->
                <!-- 补水阀 start -->
                <el-col :span="6" class="mobile-oncell">
                    <h5>{{$t("message.补水阀")}}</h5>
                    <p><span class="hide-mobile">{{$t("message.补水阀")}}：</span><el-switch v-model="WSV" @change="onChangeWSV" :disabled="AUTO" /></p>
                </el-col>
                <!-- 补水阀 end -->
                <el-col :span="6" class="mobile-oncell">
                    <h5>{{$t("message.补水系数校正")}}</h5>
                    <p><span class="hide-mobile">{{$t("message.系数校正")}}：</span><el-switch v-model="openWaterXs" @change="onchangeXs" :disabled="runInfo.dig.WSV == 1" /></p>
                </el-col>
                <!-- 搅拌泵 start -->
                <el-col :span="6" class="mobile-oncell">
                    <h5>{{$t("message.搅拌泵")}}</h5>
                    <p><span class="hide-mobile">{{$t("message.搅拌泵")}}：</span><el-switch v-model="MIX_P" @change="onChangeMIX_P" :disabled="AUTO" /></p>
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
                    <td>{{$t("message.状态")}}：<el-switch v-model="VL4" @change="onChangeVL4" :disabled="AUTO" /></td>
                    <td>{{$t("message.状态")}}：<el-switch v-model="VR4" @change="onChangeVR4" :disabled="AUTO" /></td>
                </tr>
                <tr>
                    <td>{{$t("message.第三层")}}</td>
                    <td>{{$t("message.状态")}}：<el-switch v-model="VL3" @change="onChangeVL3" :disabled="AUTO" /></td>
                    <td>{{$t("message.状态")}}：<el-switch v-model="VR3" @change="onChangeVR3" :disabled="AUTO" /></td>
                </tr>
                <tr>
                    <td>{{$t("message.第二层")}}</td>
                    <td>{{$t("message.状态")}}：<el-switch v-model="VL2" @change="onChangeVL2" :disabled="AUTO" /></td>
                    <td>{{$t("message.状态")}}：<el-switch v-model="VR2" @change="onChangeVR2" :disabled="AUTO" /></td>
                </tr>
                <tr>
                    <td>{{$t("message.第一层")}}</td>
                    <td>{{$t("message.状态")}}：<el-switch v-model="VL1" @change="onChangeVL1" :disabled="AUTO" /></td>
                    <td>{{$t("message.状态")}}：<el-switch v-model="VR1" @change="onChangeVR1" :disabled="AUTO" /></td>
                </tr>
            </table>
        </a-card>
        <!-- 育苗水阀 end -->
    </div>
</template>
<style scoped>
  	.desc_txt {font-size: 14px; color: #5e6d82; line-height: 1.5em;}
</style>
<script>
    import {runInfoMixin} from "../mixins/runinfo"
    import {control,read_device_param,write_device_param,get_dev} from "../../../store/ajax.js"
	export default {
        mixins: [runInfoMixin],
        data() {
            return {
                openWaterXs: false,
                h1: 0,
                h2: 0,
                t1: 0,
                t2: 0,
                accuracy: 0,
                beginWatchLv: false,
                jzOver: false,
            }
        },
        computed: {
            op_onOff() {return this.$store.state.op_onOff},
            isPlant() {return this.$store.state.isPlant},
            op_id() {return String(this.$store.state.userInfo.user.id)},
            LIQ_LV() {return this.getRunInfo("ana","LIQ_LV").value},
            AUTO() {return this.getRunInfo("dig","AUTO").refValue},
            SIP1: {
                get() {return this.getRunInfo("dig","SIP1").refValue},
                set(d) {}
            },
            SIP2: {
                get() {return this.getRunInfo("dig","SIP2").refValue},
                set(d) {}
            },
            SIP: {
                get() {return this.getRunInfo("dig","SIP").refValue},
                set(d) {}
            },
            BWP1: {
                get() {return this.getRunInfo("dig","BWP1").refValue},
                set(d) {}
            },
            WSV: {
                get() {return this.getRunInfo("dig","WSV").refValue},
                set(d) {}
            },
            MIX_P: {
                get() {return this.getRunInfo("dig","MIX_P").refValue},
                set(d) {}
            },
            VL4: {
                get() {return this.getRunInfo("dig","VL4").refValue},
                set(d) {}
            },
            VL3: {
                get() {return this.getRunInfo("dig","VL3").refValue},
                set(d) {}
            },
            VL2: {
                get() {return this.getRunInfo("dig","VL2").refValue},
                set(d) {}
            },
            VL1: {
                get() {return this.getRunInfo("dig","VL1").refValue},
                set(d) {}
            },
            VR4: {
                get() {return this.getRunInfo("dig","VR4").refValue},
                set(d) {}
            },
            VR3: {
                get() {return this.getRunInfo("dig","VR3").refValue},
                set(d) {}
            },
            VR2: {
                get() {return this.getRunInfo("dig","VR2").refValue},
                set(d) {}
            },
            VR1: {
                get() {return this.getRunInfo("dig","VR1").refValue},
                set(d) {}
            },
        },
		methods: {
			 // 修改XX状态
            onChangeGlobal({data_id,data_code,checked,tip_text}) {
                this.$confirm(tip_text, this.$t('message.提示'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('message.确定'),
                    cancelButtonText: this.$t('message.取消'),
                }).then(()=> {
                    this.$store.dispatch("control",{
                        data: {
                            data_id,
                            data_code,
                            value: checked ? 1 : 0
                        }
                    });
                });
            },
            // 修改左喷灌泵状态
            onChangeSIP1(checked) {
                this.onChangeGlobal({
                    data_id: 1,
                    data_code: "C_SIP1",
                    checked,
                    tip_text: `${this.$t('message.确认修改左喷灌泵状态')}?`
                });
            },
            // 修改右喷灌泵状态
            onChangeSIP2(checked) {
                this.onChangeGlobal({
                    data_id: 2,
                    data_code: "C_SIP2",
                    checked,
                    tip_text: `${this.$t('message.确认修改右喷灌泵状态')}?`
                });
            },
            onChangeSIP3(checked) {
                this.onChangeGlobal({
                    data_id: 1,
                    data_code: "C_SIP1",
                    checked,
                    tip_text: `${this.$t('message.确认修改喷灌泵状态')}?`
                });
            },
            // 修改回水泵状态
            onChangeBWP1(checked) {
                this.onChangeGlobal({
                    data_id: 3,
                    data_code: "C_BWP1",
                    checked,
                    tip_text: `${this.$t('message.确认修改回水泵状态')}?`
                });
            },
            onChangeWSV(checked) {
                this.onChangeGlobal({
                    data_id: 6,
                    data_code: "C_WSV",
                    checked,
                    tip_text: `${this.$t('message.确认修改补水阀状态')}?`
                });
            },
            onChangeMIX_P(checked) {
                this.onChangeGlobal({
                    data_id: 5,
                    data_code: "C_MP",
                    checked,
                    tip_text: `${this.$t('message.确认修改搅拌泵状态')}?`
                });
            },
            // 修改左侧1层水阀
            onChangeVL1(checked) {
                this.onChangeGlobal({
                    data_id: 10,
                    data_code: "C_VL1",
                    checked,
                    tip_text: `${this.$t('message.确认修改左侧一层水阀状态')}?`
                });
            },
            // 修改右侧1层水阀
            onChangeVR1(checked) {
                this.onChangeGlobal({
                    data_id: 14,
                    data_code: "C_VR1",
                    checked,
                    tip_text: `${this.$t('message.确认修改右侧一层水阀状态')}?`
                });
            },
            // 修改左侧2层水阀
            onChangeVL2(checked) {
                this.onChangeGlobal({
                    data_id: 11,
                    data_code: "C_VL2",
                    checked,
                    tip_text: `${this.$t('message.确认修改左侧二层水阀状态')}?`
                });
            },
            // 修改右侧2层水阀
            onChangeVR2(checked) {
                this.onChangeGlobal({
                    data_id: 15,
                    data_code: "C_VR2",
                    checked,
                    tip_text: `${this.$t('message.确认修改右侧二层水阀状态')}?`
                });
            },
            // 修改左侧3层水阀
            onChangeVL3(checked) {
                this.onChangeGlobal({
                    data_id: 12,
                    data_code: "C_VL3",
                    checked,
                    tip_text: `${this.$t('message.确认修改左侧三层水阀状态')}?`
                });
            },
            // 修改右侧3层水阀
            onChangeVR3(checked) {
                this.onChangeGlobal({
                    data_id: 16,
                    data_code: "C_VR3",
                    checked,
                    tip_text: `${this.$t('message.确认修改右侧三层水阀状态')}?`
                });
            },
            // 修改左侧4层水阀
            onChangeVL4(checked) {
                this.onChangeGlobal({
                    data_id: 13,
                    data_code: "C_VL4",
                    checked,
                    tip_text: `${this.$t('message.确认修改左侧四层水阀状态')}?`
                });
            },
            // 修改右侧4层水阀
            onChangeVR4(checked) {
                this.onChangeGlobal({
                    data_id: 17,
                    data_code: "C_VR4",
                    checked,
                    tip_text: `${this.$t('message.确认修改右侧四层水阀状态')}?`
                });
            },
             // 切换补水系数校正
            async onchangeXs(checked) {
                if(checked && this.LIQ_LV) {
                    if(this.LIQ_LV >= 20) {
                        // 实时液位大于20cm无法校正
                        this.$message({
                            type: 'error',
                            message: `${this.$t('message.液位太高，无法校正')}!`
                        });  
                        this.resetJZbefore();
                    } else if(this.LIQ_LV < 5) {
                        // 小于5cm时打开补水阀
                        this.toggle_c_wsv("open");
                        this.beginWatchLv = true;
                    } else {
                        // 5 - 20
                        this.setJsBegin();
                    }
                }
            },
            setJsBegin() {
                this.h1 = this.LIQ_LV;
                this.t1 = new Date().getTime();
                this.toggle_c_wsv("open");
            },
            // 打开/关闭 补水阀
            toggle_c_wsv(str) {
                let value;
                switch(str) {
                    case "open":
                        value = 1;
                    break;
                    case "close":
                        value = 0;
                    break;
                }
                this.$store.dispatch("control",{
                    data: {
                        data_id: 6,
                        data_code: "C_WSV",
                        value
                    },
                    notTip: true  // 值为true,不提示操作成功
                });
            },
            // 确认是否写入校正值
            readyWATER_SUPPLY() {
                let supplyValue = this.isPlant ? 0.996*0.5290 : 1.375*0.630;
                this.accuracy = (supplyValue*((this.h2 - this.h1) / 100)*1000 / ((this.t2-this.t1) / 1000)).toFixed(3);
                // let tipString = `补水系数为${this.accuracy}，测试数据(h2:${this.h2}，h1:${this.h1}:用时秒数${(this.t2 - this.t1) / 1000})，是否写入校正值?`
                let tipString = `补水系数为${this.accuracy}，是否写入校正值?`
                this.$confirm(tipString, this.$t('message.提示'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('message.数据校正'),
                    cancelButtonText: this.$t('message.放弃校正'),
                }).then(()=> {
                    this.writeWATER_SUPPLY(this.accuracy);
                }).catch(()=> {
                    this.resetJZbefore();
                });
            },
            // 写入校正值
            async writeWATER_SUPPLY(d) {
                let res1 = await read_device_param({
                    op_id: this.op_id,
                    op_type: "OP_FARM_CALL_SET",     
                    dev_id: 1
                });
                let param_item = res1.item.map(item => {
                    return {
                        param_id: item.param_id,
                        param_code: item.param_code, 
                        value: item.value
                    }
                });
               let idx = param_item.findIndex(item => item.param_id == 15)
               param_item[idx].value = d;
               let res = await write_device_param({
                    op_id: this.op_id,
                    op_type: "OP_FARM_SET_SET",
                    dev_id: 1,
                    instance_number: res1.instance_number,     
                    item_num: param_item.length,
                    dev_inst_id: res1.dev_inst_id,
                    dev_model_id: res1.dev_model_id,
                    item: param_item
                });
                res && (this.$message({
                    type: 'success',
                    message: `${this.$t('message.写入成功')}!`
                }) && this.resetJZbefore());
            },
            // 重置状态到补水系数校正前
            resetJZbefore() {
                this.t1 = 0;
                this.t2 = 0;
                this.h1 = 0;
                this.h2 = 0;
                this.accuracy = 0;
                this.jzOver = false;
                this.beginWatchLv = false;
                this.openWaterXs = false;
            }
		},
		watch: {
			op_onOff(value) {
				if(value && !this.openWaterXs) {
					this.$message({
                        type: 'success',
                        message: `${this.$t('message.操作成功')}!`
                    });
                    this.$store.commit("changeOpOnoff",false);
				}
			},
            LIQ_LV(d) {
                if(this.beginWatchLv) {
                    if(d >= 5) {
                        this.beginWatchLv = false;
                        // 关闭水阀
                        this.toggle_c_wsv("close");
                        setTimeout(()=> {
                           this.setJsBegin();
                        },5000);
                    }
                }
                if(this.h1 && ((d - this.h1) > 10) && !this.jzOver) {
                    this.t2 = new Date().getTime();
                    this.jzOver = true;
                    // 关闭补水阀
                    this.toggle_c_wsv("close");
                    // 延迟5秒钟使当前液位稳定下来
                    setTimeout(()=> {
                        this.h2 = this.LIQ_LV;
                        this.readyWATER_SUPPLY();
                    },5000);
                }
            }
		}
	}
</script>