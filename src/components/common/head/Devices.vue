<template>
    <div @click="closeCurrentLayer">
        <!-- 当前设备 start -->
        <el-row type="flex" justify="space-between" align="middle" class="space-btm">
            <el-col>{{currentShowData}} ({{$t("message.当前")}})</el-col>
            <el-col>
                <el-row type="flex" justify="end" align="middle">
                    <el-button size="small" type="default" @click="enterParameter">{{$t("message.参数设置")}}</el-button>
                    <el-button size="small" type="warning" @click="enterCalibration">{{$t("message.校正")}}</el-button>
                </el-row>
            </el-col>
        </el-row>
        <!-- 当前设备 end -->
        <!-- 设备列表 start -->
        <el-row type="flex" justify="space-between" align="middle" v-for="item in devList" :key="item.instance_number" :id="item" class="dev_list">
            <el-col>{{isWeb ? (item.description || item.instance_number) : (item.dev_inst_id || item.description)}}</el-col>
            <el-col>
                <el-row type="flex" justify="end" align="middle">
                    <el-button size="small" type="primary" :disabled="currentId == item.id" @click="toggleDev(item)">{{$t("message.进入")}}</el-button>
                </el-row>
            </el-col>
        </el-row>
        <!-- 设备列表 end -->
    </div>
</template>
<script>
    import {get_device_param_list_local} from "../../../store/ajax.js"
    import {envMixin} from "@/components/mixins/envMix"
    export default {
        data() {
            return {
                localAllDevs: []
            }
        },
        mixins: [envMixin],
        computed: {
            mobileReqPort() {return this.$store.state.mobileReqPort},
            currentRoomInfo() {return this.$store.state.currentInfo.room},
            devList() {
                let allDevs = this.isWeb ? (this.currentRoomInfo.devs || []) : this.localAllDevs;
                return allDevs.filter(item => item.id !== this.currentId);
            },
            currentDev() {
                if(this.isWeb) {
                    return this.$store.state.currentInfo.dev
                } else {
                    let LocalDveNum = this.$store.state.currentInfo.LocalDveNum;
                    if(this.isMobile) {
                        LocalDveNum = this.mobileReqPort;
                    }
                    let arr = this.localAllDevs.filter(item => item.dev_inst_id == LocalDveNum);
                    return arr.length ? arr[0] : [];
                }
            },
            currentId() {
                if(this.isMobile) {
                    return this.mobileReqPort;
                } else {
                    return this.currentDev.id;
                }
            },
            currentShowData() {return this.isWeb ? (this.currentDev.description || this.currentDev.instance_number) : (this.currentDev.description || this.currentDev.dev_inst_id)},
            apiurl() {
                let baseUrl = this.isMobile ? (window.localStorage.apiurl || "http://192.168.0.107") : window.ip.apiURL;
                baseUrl += "/farm";
                return baseUrl;
            }
        },
        methods: {
            // 获取本地设备列表
            async getDevParamList(d="") {
                this.localAllDevs = await get_device_param_list_local();
            },
            // 切换设备
            toggleDev(item) {
                if(this.isWeb) {
                    this.$store.commit("updateCurrentDevInfo",item);
                    if(this.$route.name !== "Dashboard") {
                        this.$router.push({path: "/Dashboard"});
                    }
                } else if(this.isMobile) {
                    if(item.dev_inst_id) {
                        localStorage.mobileReqPort = item.dev_inst_id;
                        // 刷新页面
                        location.reload();
                    }
                } else {
                    let originData = this.apiurl;
                    originData = originData.replace("\/farm","");
                    let arr = originData.split(":");
                    if(arr.length < 3) {
                        // mobile
                    } else {
                        let arr1 = arr[1].split(".");
                        if(arr1.length < 4) {
                            return;
                        }
                        arr1[3] = item.dev_inst_id;
                        arr[1] = arr1.join(".");
                        let r1 = arr.join(":")
                        location.href = r1;
                    }
                }
            },
            // 今日参数设置
            enterParameter() {
                this.$router.push({path: "/ParameterAdjustmentUser",query: this.currentDev});
            },
            // 进入校正
            enterCalibration() {
                this.$router.push({path: "/Calibration"});
            },
            // 关闭层
            closeCurrentLayer() {
                this.$emit("send");
            }
        },
        mounted() {
            this.getDevParamList();
        }
    }
</script>   