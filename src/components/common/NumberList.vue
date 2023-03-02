<!-- 
  组件说明： 本组件为培植方案列表组件，点击顶部全部培植方案按钮，该组件即可显示。
-->
<template>
    <!-- 培植方案列表 start -->
    <div style="position: absolute;right: 21px;top: 53px;z-index: 10;">
        <ul class="num-cell-list">
            <li v-for="item,key in arrNumberList" class="num-cell" @click="toJumpIp(key)" :class="{current: item == currentNum}">{{item}}</li>
            <li style="height: 0;border: 0;" class="num-cell"  v-for="i in 6"></li>
        </ul>
    </div>
    <!-- 培植方案列表 end -->
</template>
<style scoped>
    .num-cell-list {display: flex;width: 340px;padding: 8px;background: #FFF;flex-wrap: wrap;justify-content: space-between;}
    .num-cell {width: 35px;height: 35px;border: 1px solid #8b8a89;text-align: center;line-height: 35px;font-size: 16px; margin: 4px;cursor: pointer;transition: .6s; color: #8b8a89;border-radius: 2px;  }
    .num-cell.current {background: #8b8a89;color: #FFF;}
</style>
<script>
    export default {
        data() {
            return {
                currentNum: 0,
                dataCurNum: 0,
                testUrl: "http://192.168.1.13:3601/#/",
                arrUrl: [],
                hostUrl: [],
                loading: false,
                ErrDesc: ""
            }
        },
        computed: {
            arrNumberList() {
                return this.$store.state.arrNumberList;
            },
            currentUrl() {
                return this.$store.state.currentUrl;
            },
            localMode() {
                return this.$store.state.localMode;
            },
            arrNumberList() {
                return this.$store.state.arrNumberList;
            }
        },
        methods: {
            toHideLayer() {
                this.$emit("hideNumberLayer")
            },
            getHost() {
                // 获取编号
                let originData = this.currentUrl;
                let arr = originData.split(":");
                if(arr.length < 3) {
                    this.ErrDesc = "编号获取失败！"
                    return;
                }
                this.arrUrl = arr;

                // 处理编号
                let host = this.arrUrl[1];
                let arr1 = host.split(".");
                if(arr1.length < 4) {
                    this.ErrDesc = "编号获取失败！"
                    return;
                } 
                this.hostUrl = arr1;
                let num = arr1[3];
                this.currentNum = Number(num);
                this.dataCurNum = this.currentNum;
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
            toJumpIp(key) {
                this.$confirm('确定跳转吗？', this.$t('message.确认信息'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('message.确认'),
                    cancelButtonText: this.$t('message.取消')
                }).then(_ => {
                    this.dataCurNum = this.arrNumberList[key];
                    let newUrl = this.getNewUrl();
                    this.changeUrl(newUrl);
                })
            }
        },
        mounted() {
            this.currentNum1 = location.href;
            if(this.localMode) {
                this.$store.commit("updatecurrentUrl",this.testUrl);
            }
            this.loading = false;
            this.getHost();
        }
    }
</script>