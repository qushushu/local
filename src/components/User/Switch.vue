<!-- 
  组件说明：本组件为设备信息组件。
  进入方式：操作员登录后点击导航栏"设备信息"进入
  用户权限：操作员可以使用。
-->
<template>
    <div class="ym-main">
        <!-- 顶部编号 start -->
        <slot name="currentNum"></slot>
        <!-- 顶部编号 end -->
        <a-card class="card-pd">
            <!-- 标题 start -->
            <PageHeader :title="$t('message.操作记录')"></PageHeader>
            <!-- 标题 end -->
            <!-- 筛选项 start -->
            <div class="space-btm">
                <el-select v-model="dig_param" :placeholder="$t('message.请选择')" size="small" @change="init">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <!-- 筛选项 end -->
            <!-- 操作表格 start -->
            <el-table ref="multipleTable" :data="tableData" border stripe size="small">
                <el-table-column prop="time" :label="$t('message.时间')"></el-table-column>
                <el-table-column prop="dig_param" :label="$t('message.名称')" width="150"></el-table-column>
                <el-table-column prop="dig_param_fz" :label="$t('message.名称')" width="150"></el-table-column>
                <el-table-column prop="operateNo" label="操作人" width="150"></el-table-column>
                <el-table-column prop="value" :label="$t('message.当前值')">
                    <template slot-scope="scope">
                        <span :class="scope.row.dig_content == 1 ? 'open' : 'close'">{{scope.row.dig_content == "1" ? $t('message.开') : $t('message.关')}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 操作表格 end -->
        </a-card>
    </div>
</template>
<script>
    import {diglog} from "../../store/ajax"
    import {digList} from "../../config/config/param/param_diglist"
    import {formatTime} from "../../assets/tools/tool.js"
    let timer;
    export default {
        data() {
            return {
                radio: "1",
                tableData: [],
                dig_param: "",
                options: [{
                    value: '',
                    label: '全部'
                },{
                    value: 'C_SIP',
                    label: '喷灌泵'
                },{
                    value: 'C_BWP',
                    label: '回水泵'
                },{
                    value: 'C_WSV',
                    label: '补水阀'
                },{
                    value: 'C_MP',
                    label: '搅拌泵'
                },{
                    value: 'C_VL',
                    label: '水阀'
                },{
                    value: 'C_PP',
                    label: '蠕动泵'
                }]
            }
        },
        methods: {
            async init() {
               let res =  await diglog(this.dig_param);
               if(res && res.length) {
                   this.tableData = res.map(item => {
                        item.time = formatTime(item.time);
                        let arr = digList.filter(item1 => item1["code"] == item.dig_param.substring(2));
                        item.dig_param_fz = arr.length ? arr[0]["name"] : "--";
                        return item;
                   });
               } else {
                this.tableData = [];
               }
            }
        },
        mounted() {
            timer = setInterval(()=> {
                this.init()
            },1000);
            this.init()
        },
        beforeDestroy() {
            clearInterval(timer);
        }
    }
</script>