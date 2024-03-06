<template>
    <ul class="dev_list">
        <li v-for="item in 4" :id="item">
            <span>D001</span> 
            <el-button size="small" type="primary" :disabled="currentId == item"> 进入</el-button>
            <el-button size="small" type="default" v-if="currentId == item">参数设置</el-button>
            <el-button size="small" type="warning" v-if="currentId == item">校正</el-button>
        </li>
    </ul>
</template>
<style scoped>
    .dev_list {position: absolute;top: 50px;background: #FFF;z-index: 10;width: 400px;}
    .dev_list li {padding: 8px 10px;line-height: 30px;display: flex;align-items: center;border-bottom: 1px solid #E4E7ED;transition: .6s;}
    .dev_list li:hover {background: #fbfbfb;}
    .dev_list span {display: inline-block;width: 160px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;font-size: 14px;}
</style>
<script>
    export default {
        data() {
            return {
                currentId: 1,
                a:true,
                idList: [1,2,3,4,5]
            }
        }
    }
</script>   