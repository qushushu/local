<!-- 
  组件说明： 本组件为设置设备参数值组件。
  进入方式： 操作员登录后点击导航栏"设备参数"。列表任一条目下"参数"按钮进入。
  用户权限： 操作员可以使用。
-->
<template>
    <div class="ym-main">
        <!-- 顶部编号 start -->
        <slot name="currentNum"></slot>
        <!-- 顶部编号 end -->
        <a-card class="card-pd">
            <!-- 头部标题 start -->
            <PageHeader :title="$t('message.设置参数值')" class="space-btm1"></PageHeader>
            <!-- 头部标题 end -->
            <!-- 表格 start -->
            <el-table class="space-btm" :data="tableDataShow" border size="small" :height="heightW3">
                <el-table-column prop="sort_index1" :label="$t('message.序号')" width="50"></el-table-column>
                <el-table-column prop="name" :label="$t('message.参数项')" width="160"></el-table-column>
                <el-table-column prop="param_code" :label="$t('message.代码')" width="150"></el-table-column>
                <el-table-column prop="ref_value" :label="$t('message.参数值')">
                    <template slot-scope="scope">
                        <el-input :placeholder="$t('message.请输入内容')" size="small" v-model="scope.row.ref_value" :disabled="disabledCodeList.includes(scope.row.param_code)" v-if="scope.row"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="unit" :label="$t('message.单位')" width="200"></el-table-column>
            </el-table>
            <!-- 表格 end -->
            <!-- 功能按钮 start -->
            <div><el-button type="primary" size="small" @click="save">{{$t('message.保存')}}</el-button><el-button type="warning" size="small" @click="read">{{$t('message.读设备参数')}}</el-button></div>
            <!-- 功能按钮 end -->
        </a-card>
    </div>
</template>
<script>
    import {get_dev_model,get_dev,save_device_param_item,read_device_param,write_device_param} from "../../store/ajax"
    import * as XLSX from "XLSX"
    import base_params from "../../config/config/param/base_params"
    import {switchTimeToShow,switchTimeToSubmit} from "../../assets/tools/tool.js"
    import {envMixin} from "@/components/mixins/envMix"
    export default {
        data() {
            return {
                fullscreenLoading: false,
                param_item: {},
                tableData: [],
                tableDataShow: [],
                control1: [],
                disabledCodeList: ["MODEL","CONTROL1","CONTROL2"]
            }
        },
        mixins: [envMixin],
        computed: {
            userInfo() {return this.$store.state.userInfo},
            heightW3() {return this.isMobile ? 805 : 647},
            originCtrol1() {
                let tb = this.tableDataShow;
                let res = '0';
                if(tb.length && tb[1]) {
                    let rf = tb[1].ref_value;
                    Number(rf) && (res = String(Number(rf).toString(2)));
                }
                return res.padStart(15,"0").split("").reverse().map(item => item == '1');
            }
        },
        watch: {
            originCtrol1(d) {
                this.control1 = d;
            }
        },
        methods: {
            // 用来获取左侧的参数列表
            async getList() {
                // 获取模板参数
                let res = await get_dev_model(this.$route.query.model_code);
                this.tableData = res.param_item;
                this.tableDataShow = this.tableData.filter(item => {
                    return base_params.includes(item.param_code)
                }).map((item,key) => {
                    item.sort_index1 = key + 1;
                    return item;
                })
                // 获取设备参数
                let res1 = await get_dev(this.$route.query.dev_inst_id);
                // 设备参数代替模板参数
                if(res1 && res1.param_item) {
                    res1.param_item.forEach(item => {
                        this.tableDataShow.forEach(item1 => {
                            if(item1["param_code"] === item["param_code"]) {
                                item1["ref_value"] = item["value"];
                            }
                        });
                    });
                }
            },
            // 保存
            save() {
                let res = this.baseSave();
                res.then(_=> {
                    this.$message({
                      type: 'success',
                      message: this.$t('message.保存成功')
                    });
                    this.getList();
                })
            },
            // 保存
            baseSave() {
                return new Promise(async resolve => {
                    let param_item = [];
                    /*
                        参数改变：
                        1).时间转化
                        2).PH保留两位，其他保留一位小数
                    */
                    this.tableDataShow.forEach(item => {
                        let otmp = JSON.parse(JSON.stringify(item));
                        delete otmp["sort_index1"];
                        let idx = this.tableData.findIndex(itm => {
                            return itm.id === item.id
                        })
                        this.tableData.splice(idx,1,otmp);
                    })
                    this.tableData.forEach(item => {
                        if(item) {
                            item = switchTimeToSubmit(item);
                            let value = item.ref_value;
                            let code = item.param_code;
                            if(/PH/g.test(code)) {
                                value = Number(Number(value).toFixed(2));
                            } else if(/CONTROL1/g.test(code)) {
                                value = this.digListToNumber();
                            } else if(/CONTROL2/g.test(code)) {
                                value = 0;
                            } else {
                                value = Number(Number(value).toFixed(1));
                            }
                            let json = {
                                dev_model_param_id: item.id,
                                value
                            }
                            param_item.push(json);
                        }
                    });
                    this.fullscreenLoading = true;
                    let res = await save_device_param_item({
                        dev_inst_id: this.$route.query.dev_inst_id,
                        dev_model_id: this.$route.query.dev_model_id,
                        param_item
                    });
                    this.fullscreenLoading = false;
                    res && resolve();
                })
            },
            digListToNumber() {
                let arr = this.control1.map(item => item ? '1' : 0).reverse();
                return parseInt(arr.join(""),2);
            },
            // 读设备参数
            async read() {
                let res = await read_device_param({
                    op_id: String(this.userInfo.user.id),
                    operateNo: this.userInfo.user.account,
                    op_type: "OP_FARM_CALL_SET",
                    dev_id: parseInt(this.$route.query.dev_inst_id)
                });
                if(res) {
                    let itemList = res.item;
                    let result = this.tableData.map((item) => {
                        if(item) {
                            let tmp = itemList.filter(itm => {
                                return itm["param_code"].toUpperCase() == item["param_code"].toUpperCase() || '';
                            });
                            if(tmp.length) {
                                let json = {
                                    name: item["name"],
                                    ref_value: tmp[0]["value"],
                                    param_code: item["param_code"].toUpperCase(),
                                    sort_index: item["sort_index"],
                                    unit: item["unit"],
                                    remark: item["remark"],
                                    id: item["id"],
                                    dev_model_id: item["dev_model_id"]
                                }
                                json = switchTimeToShow(json);
                                return json;
                            }
                        }
                    });
                    this.tableData = result;
                    this.tableDataShow = this.tableData.filter(item => {
                        return base_params.includes(item.param_code);
                    }).map((item,key) => {
                        item.sort_index1 = key + 1;
                        return item;
                    })
                    this.$message({
                      type: 'success',
                      message: this.$t('message.读取成功')
                    });
                }
            }
        },
        mounted() {
            this.getList();
        }
    }
</script>