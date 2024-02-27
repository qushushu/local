<template>
    <div>
        <a-card class="card-pd nobdCard">
            <section style="margin-bottom: 20px;">
                <el-steps :active="active" finish-status="success" size="small" :align-center="true">
                  <el-step title="Coefficient initialization"></el-step>
                  <el-step title="Calibrate"></el-step>
                </el-steps>
            </section>

            <table class="normal-table text-center" v-if="active==0">
                <tr>
                    <td class="td-name">{{$t('message.名称')}}</td>
                    <td class="td-name" v-show="false">{{$t('message.标准液EC')}}</td>
                    <td class="td-name" v-show="false">{{$t('message.当前质量')}}</td>
                    <td class="td-name">{{$t('message.系数')}}</td>
                    <td class="td-name">Coefficient initialization</td>
                </tr>
                <tr>
                    <td class="td-name">EC1</td>
                    <td class="td-name" v-show="false">{{value1}} <a href="javascript:;" class="editText" @click="showJzLayer(1)" v-if="!btnDis">{{$t('message.修改')}}</a></td>
                    <td class="td-name" v-show="false">{{ECCurList[0]}}</td>
                    <td class="td-name">{{xishu1}}</td>
                    <td class="td-name"><el-button type="primary" @click="toJz(1)" size="small" :disabled="btnDis">Coefficient initialization</el-button></td>
                </tr>
                <tr>
                    <td class="td-name">EC2</td>
                    <td class="td-name" v-show="false">{{value2}} <a href="javascript:;" class="editText" @click="showJzLayer(2)" v-if="!btnDis">{{$t('message.修改')}}</a></td>
                    <td class="td-name" v-show="false">{{ECCurList[1]}}</td>
                    <td class="td-name">{{xishu2}}</td>
                    <td class="td-name"><el-button type="primary" :disabled="btnDis" @click="toJz(2)" size="small">Coefficient initialization</el-button></td>
                </tr>
            </table>

            <table class="normal-table text-center" v-if="active==1">
                <tr>
                    <td class="td-name">{{$t('message.名称')}}</td>
                    <td class="td-name">{{$t('message.标准液EC')}}</td>
                    <td class="td-name">{{$t('message.当前质量')}}</td>
                    <td class="td-name">{{$t('message.系数')}}</td>
                    <td class="td-name">{{$t('message.校正')}}</td>
                </tr>
                <tr>
                    <td class="td-name">EC1</td>
                    <td class="td-name">{{value1}} <a href="javascript:;" class="editText" @click="showJzLayer(1)" v-if="!btnDis">{{$t('message.修改')}}</a></td>
                    <td class="td-name">{{ECCurList[0]}}</td>
                    <td class="td-name">{{xishu1}} <a href="javascript:;" class="editText" @click="showXsLayer(1)" v-if="!btnDis">{{$t('message.修改')}}</a></td>
                    <td class="td-name"><el-button type="primary" @click="toJz(1)" size="small" :disabled="btnDis">{{$t('message.校正')}}</el-button></td>
                </tr>
                <tr>
                    <td class="td-name">EC2</td>
                    <td class="td-name">{{value2}} <a href="javascript:;" class="editText" @click="showJzLayer(2)" v-if="!btnDis">{{$t('message.修改')}}</a></td>
                    <td class="td-name">{{ECCurList[1]}}</td>
                    <td class="td-name">{{xishu2}} <a href="javascript:;" class="editText" @click="showXsLayer(2)" v-if="!btnDis">{{$t('message.修改')}}</a></td>
                    <td class="td-name"><el-button type="primary" :disabled="btnDis" @click="toJz(2)" size="small">{{$t('message.校正')}}</el-button></td>
                </tr>
            </table>
             <!-- 下一步 上一步 -->
            <el-row type="flex" justify="space-between">
                <el-button style="margin-top: 12px;" @click="prev" size="small" :disabled="active == 0">{{$t('message.上一步')}}</el-button>
                <el-button style="margin-top: 12px;" @click="next" size="small" :disabled="active == 1">{{$t('message.下一步')}}</el-button>
            </el-row>
        </a-card>

        <el-dialog :title="'EC' + currentEC + $t('message.校正')" :visible.sync="dialogVisible" :width="loginDialogWidth">
         <div>
            <el-form :inline="true">
                <el-form-item>
                    <el-button @click="setCShowV(currentEC,1413)" :type="showValue == 1413 ? 'primary' : 'default'" class="space-btm" size="small">1413</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="setCShowV(currentEC,3000)" :type="showValue == 3000 ? 'primary' : 'default'" class="space-btm" size="small">3000</el-button>
                </el-form-item>
                <el-form-item>
                    <el-input size="small" v-model="showValue" placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-form>
         </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" size="small">{{$t('message.取消')}}</el-button>
            <el-button type="primary" @click="sureSetBd" v-loading.fullscreen.lock="fullscreenLoading" size="small">{{$t('message.确定')}}</el-button>
          </span>
        </el-dialog>

        <el-dialog :title="$t('message.系数修改')" :visible.sync="dialogVisible1" :width="loginDialogWidth">
         <div>
            <el-form :inline="true">
                <el-form-item :label="$t('message.系数：')">
                    <el-input size="small" v-model="showXs" :placeholder="$t('message.请输入系数')"></el-input>
                </el-form-item>
            </el-form>
            <span style="font-size: 12px;color: red">Note: The coefficient should be between 0.5 and 1.5,with a maximum of 5 decimal places.</span>
         </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible1 = false" size="small">{{$t('message.取消')}}</el-button>
            <el-button type="primary" @click="sureSetXs" size="small">{{$t('message.确定')}}</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<style scoped>
    .editText {font-size: 12px;text-decoration: none;color: #409eff;}
    .nobdCard {border: none !important;}
</style>
<script>
    import {getUserPower} from "../../../assets/tools/tool"
    export default {
        data() {
            return {
                active: 0,
                currentEC: 0,
                value1: 1413,
                value2: 1413,
                dialogVisible: false,
                fullscreenLoading: false,
                showValue: 1413,
                dialogVisible1: false,
                showXs: 0,
                setXs1: 1,
                setXs2: 1,
            }
        },
        watch: {
            signNum(d) {
                this.fullscreenLoading = false;
                if(d) {
                    if(this.signTip) {
                        this.$message({
                            type: 'success',
                            message: this.$t('message.操作成功!')
                        });
                        if(this.currentEC == 1) {
                            this.value1 = this.showValue;
                        } else if(this.currentEC == 2) {
                            this.value2 = this.showValue;
                        }
                        this.resetState();
                    } else {
                        this.$message({
                            type: 'error',
                            message: this.signTip.msg
                        });
                    }
                }
            },
        },
        computed: {
            isMobile() {
                return this.$store.state.isMobile;
            },
            signNum() {
                return this.$store.state.signNum;
            },
            signTip() {
                return this.$store.state.signTip;
            },
            xishu1() {
                if(this.active == 0) {
                    return this.setXs1
                } else {
                    return this.ECCurList[0] ? (this.value1 / this.ECCurList[0]).toFixed(5) : '--'
                }
                // return this.setXs1 || (this.ECCurList[0] ? (this.value1 / this.ECCurList[0]).toFixed(5) : '--');
            },
            xishu2() {
                if(this.active == 0) {
                    return this.setXs2
                } else {
                    return this.ECCurList[1] ? (this.value2 / this.ECCurList[1]).toFixed(5) : '--'
                }
            },
            runInfo() {
                return this.$store.state.runInfo;
            },
            ECCurList() {
                if(this.runInfo.ana) {
                    let {EC1,EC2} = this.runInfo.ana;
                    return [EC1,EC2];
                } else {
                    return [];
                }
            },
            loginDialogWidth() {
                return this.isMobile ? "353px" : "33%";
            },
            btnDis() {
                return this.runInfo.dig.AUTO ? true : false
            }
        },
        methods: {
             prev() {
                if(this.active > 0) {
                    this.active--
                    this.setXs1 = 1
                    this.setXs2 = 1
                }
            },
            next() {
                if(this.active < 1) {
                    this.active++
                }
            },
            // 点击校正按钮
            showJzLayer(n) {
                this.currentEC = n;
                if(n == 1) {
                    this.showValue = this.value1;
                } else if(n == 2) {
                    this.showValue = this.value2;
                }
                this.dialogVisible = true;
            },
            // 点击按钮
            setCShowV(index,num) {
                this.showValue = num
            },
            // 修改营养液
            sureSetBd() {
                let value = Number(this.showValue);
                if(isNaN(value)) {
                    this.$message({
                        type: 'error',
                        message: this.$t('message.请输入正确的EC值!')
                    });
                    return;
                };
                this.$confirm(this.$t('message.确认修改标准液质量？'), this.$t('message.提示'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('message.确定'),
                    cancelButtonText: this.$t('message.取消'),
                }).then(()=> {
                    if(this.currentEC == '1') {
                        this.value1 = value;
                        this.setXs1 = 0;
                    } else if(this.currentEC == '2') {
                        this.value2 = value;
                        this.setXs2 = 0;
                    }
                    this.dialogVisible = false;
                    this.currentEC = 0;
                })
            },
            showXsLayer(n) {
                this.currentEC = n;
                if(n == 1) {
                    this.showXs = this.xishu1;
                } else if(n == 2) {
                    this.showXs = this.xishu2;
                }
                this.dialogVisible1 = true;
            },
            // 修改系数
            sureSetXs() {
                if(isNaN(this.showXs)) {
                    this.$message({
                        type: 'error',
                        message: "The coefficient should be between 0.5 and 1.5!"
                    });
                    return;
                }
                if((this.showXs > 1.5) || (this.showXs < 0.5)) {
                    this.$message({
                        type: 'error',
                        message: "The coefficient should be between 0.5 and 1.5!"
                    });
                    return;
                }
                if(this.currentEC == 1) {
                    this.setXs1 = this.showXs;
                } else if(this.currentEC == 2) {
                    this.setXs2 = this.showXs;
                }
                this.dialogVisible1 = false;
            },
            // 校正
            toJz(n) {
                if(n == '1') {
                    let xs =  this.xishu1;
                    if(xs > 1.5 || xs<0.5) {
                        this.$message({
                            type: 'error',
                            message: this.$t('message.超出标定范围，请重新修改标准液质量！')
                        });
                        return;
                    }
                } else if(n == '2') {
                    let xs =  this.xishu2;
                    if(xs > 1.5 || xs<0.5) {
                        this.$message({
                            type: 'error',
                            message: this.$t('message.超出标定范围，请重新修改标准液质量！')
                        });
                        return;
                    }
                }
                this.$confirm(this.$t('message.确认标定EC值？'), this.$t('message.提示'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('message.确定'),
                    cancelButtonText: this.$t('message.取消'),
                }).then(()=> {
                    this.fullscreenLoading = true;
                    let data_id,data_code,value;
                    if(n == '1') {
                        data_id = 26;
                        data_code = "EC1_CORRECT";
                        value = Number(this.xishu1);
                    } else if(n == '2') {
                        data_id = 27;
                        data_code = "EC2_CORRECT";
                        value = Number(this.xishu2);
                    }
                    this.$store.dispatch("adjust1",{
                        data: {
                            data_id,
                            data_code,
                            value,
                        }
                    });
                })
            },
            resetState() {
                this.fullscreenLoading = false;
            },
        },
        mounted() {
            this.$store.commit("signNum",{
                tip: {},
                reset: true
            });
        },
    }
</script>