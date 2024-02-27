<!-- 
  组件说明： 本组件为机器编号按钮，该组件即可显示。
-->
<template>
    <!-- 培植方案列表 start -->
    <div class="listbox">
        <ul class="num-cell-list">
            <li v-for="item,key in arrNumberList" class="num-cell" @click="toJumpIp(key)" :class="{current: item == currentNum}">{{item.description}}</li>
            <li class="num-cell-empty num-cell" v-for="i in 6"></li>
        </ul>
    </div>
    <!-- 培植方案列表 end -->
</template>
<style scoped>
    .listbox {position: absolute;right: 21px;top: 53px;z-index: 10;}
    .num-cell-list {display: flex;width: 340px;padding: 8px;background: #FFF;flex-wrap: wrap;justify-content: space-between;}
    .num-cell {height: 35px;border: 1px solid #8b8a89;text-align: center;line-height: 35px;font-size: 16px; margin: 4px;cursor: pointer;transition: .6s; color: #8b8a89;border-radius: 2px;padding-left: 4px;padding-right: 4px;}
    .num-cell.current {background: #8b8a89;color: #FFF;}
    .num-cell-empty {height: 0;border: 0;}
</style>
<script>
    export default {
        data() {
            return {
                currentNum: 0,
                dataCurNum: 0,
                testUrl: "http://192.168.1.22:3601/#/",
                arrUrl: [],
                hostUrl: [],
                loading: false,
                ErrDesc: ""
            }
        },
        computed: {
            // 是否为移动端
            isMobile() {
                return this.$store.state.isMobile;
            },
            // 移动端请求地址
            apiurl() {
                return this.$store.state.apiurl;
            },
            localMode() {
                return this.$store.state.localMode;
            },
            arrNumberList() {
                return this.$store.state.mobileDevGroup;
            },
            arrList() {
                return JSON.parse(localStorage.devGroup);
            },
            isPlant() {
                return this.$store.state.isPlant;
            },
        },
        watch: {
        },
        methods: {
            getDevParamList() {
                if(localStorage.devGroup) {
                    let json = JSON.parse(localStorage.devGroup);
                    this.$store.commit("updateMobileDevGroup",json);
                }
            },
            toHideLayer() {
                this.$emit("hideNumberLayer");
            },
            getHost() {
                // 获取编号
                let originData = this.apiurl;
                originData = originData.replace(/\/plant/,"");
                originData = originData.replace(/\/seedling/,"");
                let arr = originData.split(":");
                if(arr.length < 3) {
                    this.ErrDesc = `${this.$t("message.编号获取失败")}！`
                    return;
                }
                this.arrUrl = arr;
                // 处理编号
                let host = this.arrUrl[1];
                let arr1 = host.split(".");
                if(arr1.length < 4) {
                    this.ErrDesc = `${this.$t("message.编号获取失败")}！`
                    return;
                } 
                this.hostUrl = arr1;
                let num = arr1[3];
                this.currentNum = Number(num);
                this.dataCurNum = this.currentNum;
            },
            toJumpIp(key) {
                this.dataCurNum = this.arrNumberList[key]["dev_number"];
                this.changeUrl(this.getNewUrl());
            },
            getNewUrl() {
                this.hostUrl[3] = this.dataCurNum;
                let strHost = this.hostUrl.join(".");
                this.arrUrl[1] = strHost;
                let result = "";
                result = this.arrUrl.join(":");
                return result;
            },
            changeUrl(url) {
                this.$store.commit("updateMobileBaseUrl",url);
                this.$message({
                  message: this.$t("message.切换成功"),
                  type: 'success'
                });
                setTimeout(()=> {
                    window.location.reload();
                },1000);
            },
        },
        mounted() {
            this.currentNum1 = location.href;
            this.loading = false;
            this.getHost();
            this.getDevParamList();
        }
    }
</script>