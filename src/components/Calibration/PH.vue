<template>
    <div>
        <a-card class=" card-pd nobdCard">
            <!-- 校正液表格 start -->
            <table class="normal-table text-center space-btm">
                <tr>
                    <td class="td-name">{{$t('message.名称')}}</td>
                    <td class="td-name">{{$t('message.当前校正液')}}</td>
                    <td class="td-name">{{$t('message.配置校正液')}}</td>
                </tr>
                <tr>
                    <td class="td-name">{{$t('message.第一点校正液')}}</td>
                    <td class="td-name">{{arrJzy[0][index1]}}</td>
                    <td class="td-name"><el-button type="primary" @click="showJzyLayer(1)" size="small">{{$t('message.配置')}}</el-button></td>
                </tr>
                <tr>
                    <td class="td-name">{{$t('message.第二点校正液')}}</td>
                    <td class="td-name">{{arrJzy[1][index2]}}</td>
                    <td class="td-name"><el-button type="primary" @click="showJzyLayer(2)" size="small">{{$t('message.配置')}}</el-button></td>
                </tr>
            </table>
            <!-- 校正液表格 end -->
            <!-- 校正表格 start -->
            <table class="normal-table text-center">
                <tr>
                    <td class="td-name">{{$t('message.名称')}}</td>
                    <td class="td-name">{{$t('message.当前PH值')}}</td>
                    <td class="td-name">{{$t('message.零点校正')}}</td>
                    <td class="td-name">{{$t('message.斜率校正')}}</td>
                </tr>
                <tr>
                    <td class="td-name">{{$t('message.PH传感器1')}}</td>
                    <td class="td-name">{{PHCurList.length == 2 && PHCurList[0] || '--'}}</td>
                    <td class="td-name"><el-button type="primary" @click="toJz(30,'PH1_ZERO')" size="small">{{$t('message.校正')}}</el-button></td>
                    <td class="td-name"><el-button type="primary" @click="toJz(31,'PH1_SLOPE')" size="small">{{$t('message.校正')}}</el-button></td>
                </tr>
                <tr>
                    <td class="td-name">{{$t('message.PH传感器2')}}</td>
                    <td class="td-name">{{PHCurList.length == 2 && PHCurList[1] || '--'}}</td>
                    <td class="td-name"><el-button type="primary" @click="toJz(32,'PH2_ZERO')" size="small">{{$t('message.校正')}}</el-button></td>
                    <td class="td-name"><el-button type="primary" @click="toJz(33,'PH2_SLOPE')" size="small">{{$t('message.校正')}}</el-button></td>
                </tr>
            </table>
            <!-- 校正表格 end -->
        </a-card>
        <!-- 校正液层 start -->
        <el-dialog :title="$t('message.选择校正液')" :visible.sync="dialogVisible" :width="autoDialogWidth">
            <el-form :inline="true">
                <el-form-item v-for="item,key in comArrJzy" :key="key">
                    <el-button class="space-btm" @click="updateCurIndex(item)" :type="fnArrSel() == item ? 'primary' : 'default'" size="small">{{item}}</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="canceUpdateJzy " size="small">{{$t('message.取消')}}</el-button>
                <el-button type="primary" @click="sureSetJzy" v-loading.fullscreen.lock="fullscreenLoading" size="small">{{$t('message.确定')}}</el-button>
             </span>
        </el-dialog>
        <!-- 校正液层 end -->
    </div>
</template>
<style scoped>
    .editText {font-size: 12px;text-decoration: none;color: #409eff;}
    .nobdCard {border: none !important;}
</style>
<script>
    import aCard from "../common/Acard"
    export default {
        data() {
            return {
                currentJzy: 0,
                arrJzy: [["7.00","6.86"],["1.68","4.01","9.18","10.01","12.45"]],
                index1: 1,
                index2: 1,
                showIndex1: 1,
                showIndex2: 1,
                dialogVisible: false,
                fullscreenLoading: false,
            }
        },
        components: {
            aCard
        },
        watch: {
            // loading标记改变，结束加载
            signNum(d) {
                if(d) {
                    this.fullscreenLoading = false;
                }
            },
        },
        computed: {
            // 移动端判断
            isMobile() {
                return this.$store.state.isMobile;
            },
            // 弹层宽度
            autoDialogWidth() {
                return this.isMobile ? "353px" : "33%";
            },
            // 判断loading结束标记
            signNum() {
                return this.$store.state.signNum;
            },
            comArrJzy() {
                return this.arrJzy[this.currentJzy];
            },
            runInfo() {
                return this.$store.state.runInfo;
            },
            PHCurList() {
                if(this.runInfo.ana) {
                    let {PH1,PH2} = this.runInfo.ana;
                    return [PH1,PH2];
                } else {
                    return [];
                }
            },
            
        },
        methods: {
            // 取消校正
            canceUpdateJzy() {
                this.dialogVisible = false;
                if(this.currentJzy == 0) {
                    this.showIndex1 = this.index1;
                } else {
                    this.showIndex2 = this.index2;
                }
            },
            // 显示配置层
            showJzyLayer(n) {
                this.currentJzy = n - 1;
                this.dialogVisible = true;
            },
            // 当前校正液
            fnArrSel() {
                if(this.currentJzy == 0) {
                    return this.comArrJzy[this.showIndex1];
                } else {
                    return this.comArrJzy[this.showIndex2];
                }
            },
            // 点击目标校正液
            updateCurIndex(val) {
                let idx =  this.comArrJzy.findIndex(item => item ==  val);
                if(this.currentJzy == 0) {
                    this.showIndex1 = idx;
                } else {
                    this.showIndex2 = idx;
                }
            },
            // 确认设置校正液
            sureSetJzy() {
                this.$confirm(this.$t('message.确认配置校正液？'), this.$t('message.提示'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('message.确定'),
                    cancelButtonText: this.$t('message.取消'),
                }).then(data => {
                    let data_id,data_code,value
                    if(this.currentJzy == 0) {
                        data_id = 28
                        data_code = "PH_POINT1";
                        this.index1 = this.showIndex1;
                        value = this.index1;
                    } else {
                        data_id = 29
                        data_code = "PH_POINT2";
                        this.index2 = this.showIndex2;
                        value = this.index2;
                    }
                    this.$store.dispatch("adjust1",{
                        data: {
                            data_id,
                            data_code,
                            value,
                        }
                    });
                    this.dialogVisible = false;
                })
            },
            // 校正
            toJz(data_id,data_code) {
                this.$confirm(this.$t('message.确认校正？'), this.$t('message.提示'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('message.确定'),
                    cancelButtonText: this.$t('message.取消'),
                }).then(data => {
                    this.fullscreenLoading = true;
                    let value = 1;
                    this.$store.dispatch("adjust1",{
                        data: {
                            data_id,
                            data_code,
                            value,
                        }
                    });
                })
            }
        }
    }
</script>