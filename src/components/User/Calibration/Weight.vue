<template>
    <div>
        <a-card class="card-pd nobdCard">
            <!-- 称重表格 start -->
            <table class="normal-table text-center">
                <tr>
                    <td class="td-name" width="80"></td>
                    <td width="80">{{$t('message.当前质量')}}</td>
                    <td>{{$t("message.传感器操作")}}</td>
                </tr>
                <tr v-for="num in 5">
                    <!-- 蠕动泵名称 start -->
                    <td>{{nameList[num - 1]}}</td>
                    <!-- 蠕动泵名称 end -->
                    <!-- 当前质量 start -->
                    <td>{{WeightCurList[num-1]}}</td>
                    <!-- 当前质量 end -->
                    <!-- 传感器操作 start -->
                    <td>
                        <el-button type="primary" size="small" :disabled="btnDis" @click="loadBdLayer(num)">{{$t("message.标定")}}</el-button>
                        <el-button type="default" size="small" @click="resetZero(num)" :disabled="btnDis">{{$t("message.清零")}}</el-button>
                    </td>
                    <!-- 传感器操作 end -->
                </tr>
            </table>
            <!-- 称重表格 end -->
        </a-card>
        <!-- 标定层 start -->
        <el-dialog :title="$t('message.称重传感器标定')" :visible.sync="dialogVisible" :width="loginDialogWidth">
         <div>
             <el-button type="primary" class="space-btm" @click="highWeight = 500" :plain="highWeight!=500" size="small">500g</el-button>
             <el-button type="primary" class="space-btm" @click="highWeight = 1000" :plain="highWeight!=1000" size="small">1kg</el-button>
             <el-button type="primary" class="space-btm" @click="highWeight = 2000" :plain="highWeight!=2000" size="small">2kg</el-button>
             <el-button type="primary" class="space-btm" @click="highWeight = 3000" :plain="highWeight!=3000" size="small">3kg</el-button>
             <el-button type="primary" class="space-btm" @click="highWeight = 4000" :plain="highWeight!=4000" size="small">4kg</el-button>
             <el-button type="primary" @click="highWeight = 5000" :plain="highWeight!=5000" size="small" style="margin-left: 0">5kg</el-button>
             <el-button type="primary" @click="highWeight = 10000" :plain="highWeight!=10000" size="small">10kg</el-button>
         </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" size="small">{{$t('message.取消')}}</el-button>
            <el-button type="primary" @click="sureSetBd" size="small">{{$t('message.确定')}}</el-button>
          </span>
        </el-dialog>
        <!-- 标定层 end -->
    </div>
</template>
<style scoped>
    .nobdCard {border: none !important;}
</style>
<script>
    export default {
        data() {
            return {
                nameList: [this.$t('message.A液质量'),this.$t('message.B液质量'),this.$t('message.C液质量'),this.$t('message.酸液质量'),this.$t('message.碱液质量')],
                oldSliderData: [],
                dialogVisible: false,
                currentBdNum: 0,
                highWeight: 500,
            }
        },
        watch: {
            op_onOff(value) {
                if(value) {
                    this.$message({
                        type: 'success',
                        message: this.$t('message.操作成功!')
                    });
                    this.$store.commit("changeOpOnoff",false);
                }
            }
        },
        computed: {
            isMobile() {
                return this.$store.state.isMobile;
            },
            op_onOff() {
                return this.$store.state.op_onOff;
            },
            runInfo() {
                return this.$store.state.runInfo;
            },
            WeightCurList() {
                if(this.runInfo.ana) {
                    let {W1,W2,W3,W4,W5} = this.runInfo.ana;
                    return [W1,W2,W3,W4,W5];
                } else {
                    return [];
                }
            },
            loginDialogWidth() {
                return this.isMobile ? "353px" : "33%";
            },
            runInfo() {
                return this.$store.state.runInfo;
            },
            btnDis() {
                return this.runInfo.dig.AUTO ? true : false
            }
        },
        methods: {
            loadBdLayer(num) {
                this.dialogVisible = true;
                this.currentBdNum = num;
            },
            sureSetBd() {
                this.$confirm(this.$t('message.确认标定？'), this.$t('message.提示'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('message.确定'),
                    cancelButtonText: this.$t('message.取消'),
                }).then(()=> {
                    this.$store.dispatch("adjust",{
                        data: {
                            data_id: 15 + this.currentBdNum,
                            data_code: `ADJ_ZS${this.currentBdNum}`,
                            value: this.highWeight
                        }
                    });
                    this.currentBdNum = 0;
                    this.highWeight = 0;
                    this.dialogVisible = false;
                })
            },
            resetZero(num) {
                this.$confirm(this.$t('message.确认清零(清零前请务必确认传感器已被置空)?'), this.$t('message.提示'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('message.确定'),
                    cancelButtonText: this.$t('message.取消'),
                }).then(()=> {
                    this.$store.dispatch("adjust",{
                        data: {
                            data_id: 10 + num,
                            data_code: `ADJ_ZS${num}`,
                            value: 0
                        }
                    });
                });
            }
        }
    }
</script>