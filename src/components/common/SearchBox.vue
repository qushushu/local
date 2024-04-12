<template>
    <div class="search_box">
        <el-input :placeholder="placeholder" class="normal-ipt" size="small" clearable v-model="search_text" @change="toSearch"></el-input>
        <el-button size="small" class="search_btn" type="primary" @click="toSearch"><i class="el-icon-search"></i></el-button>
    </div>
</template>
<style scoped>
    .search_box {position: relative;width: 205px;display: inline-block;margin-right: 10px;margin-bottom: 10px;}
    .normal-ipt {width: 165px;}
    .search_box .search_btn {position: absolute;right: 0;}
</style>
<script>
    export default {
        data() {
            return {
                search_text: ""
            }
        },
        props: ["placeholder"],
        methods: {
            toSearch() {
                this.$emit("search",this.search_text);
            },
            toSearch1() {
                console.log(123);
            }
        }
    }
</script>