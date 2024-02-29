<!-- 
  组件说明： 本组件为切换ip组件。
-->
<template>
    <a-card size="small" class="space-btm mobile-home-bhbox">
        <el-row type="flex" justify="space-between">
            <el-col class="text-center">
                <span v-if="!ErrDesc" style="font-weight: bold">{{currentDesc || ('No. ' + currentNum)}} </span>
                <span v-if="ErrDesc">{{ErrDesc}}</span>
            </el-col>
            <div style="position: absolute;right: 0;top: -5px;">
                <el-button size="small" @click="toDevice">设备列表</el-button>
            </div>
        </el-row>
        <div v-loading="loading"></div>
    </a-card>
</template>
<script>
    export default {
        data() {
            return {
                currentNum: 0,
                currentDesc: "",
                dataCurNum: 0,
                arrUrl: [],
                hostUrl: [],
                loading: false,
                ErrDesc: ""
            }
        },
        methods: {
            getHost() {
                // 获取编号
                let originData = this.apiurl;
                let arr = originData.split(":");
                // 非 协议:host:port形式
                if(arr.length < 3) {
                    let localMobileInfo = localStorage.mobileInfo;
                    // 处理本地缓存设备编号信息
                    if(localMobileInfo) {
                        let arr = localMobileInfo.split(" ");
                        if(arr.length == 1) {
                            if(!isNaN(arr[0])) {
                                // 只填写设备编号
                                this.currentNum = Number(arr[0]);
                                this.dataCurNum = this.currentNum;
                                this.currentDesc = "";
                            } else {
                                this.ErrDesc = this.$t('message.编号设置错误');
                            }
                            
                        }  else if(arr.length == 2 && !isNaN(arr[0])) {
                            // 填写设备编号和设备备注
                            this.currentNum = Number(arr[0]);
                            this.dataCurNum = this.currentNum;
                            this.currentDesc = arr[1];
                        }
                    } else {
                        this.ErrDesc = this.$t('message.编号未设置，请点击右上角齿轮设置编号') + "!";
                    }
                    return;
                }
                this.arrUrl = arr;
                // 处理编号
                let host = this.arrUrl[1];
                let arr1 = host.split(".");
                if(arr1.length < 4) {
                    this.ErrDesc = this.$t('message.编号获取失败') + "!";
                    return;
                } 
                this.hostUrl = arr1;
                let num = arr1[3];
                this.currentNum = Number(num);

                if(localStorage.devGroup) {
                    let arr = JSON.parse(localStorage.devGroup);
                    let res = arr.find(item => Number(item.dev_number) === this.currentNum)
                    this.currentDesc = res.description || "";
                }
            },
            changeUrl(url) {
                this.loading = true;
                location.href = url;
            },
            getNewUrl() {
                this.hostUrl[3] = this.dataCurNum;
                let strHost = this.hostUrl.join(".");
                this.arrUrl[1] = strHost;
                let result = "";
                result = this.arrUrl.join(":");
                return result;
            },
            toDevice() {
                this.$router.push({
                    path: "/Device",
                })
            }
        },
        computed: {
            apiurl() {
                return this.$store.state.apiurl;
            },
            localMode() {
                return this.$store.state.localMode;
            },
            arrNumberList() {
                return this.$store.state.arrNumberList;
            },
            isMobile() {
                return this.$store.state.isMobile;
            },
            mobileBaseUrl() {
                return this.$store.state.mobileBaseUrl;
            }
        },
        mounted() {
            this.currentNum1 = location.href;
            this.loading = false;
            this.getHost();
        }
    }
</script>