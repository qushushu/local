<!-- 
  组件说明：本组件为传感器设置组件。
  进入方式：系统管理员登录后点击传感器设置菜单进入此页面。
  用户权限：只有系统管理员方可查看，其他用户（或登录用户）进入此页后将自动跳转至首页。
-->
<template>
    <div class="ym-main">
        <a-card class="card-pd">
            <!-- 标题 start -->
            <PageHeader :title="$t('message.传感器配置')" goBack=false></PageHeader>
            <!-- 标题 end -->
            <div class="space-btm1">
                <el-button type="primary" @click="handleSubmit" size="small">{{$t('message.开始配置')}}</el-button>
            </div>
            <p style="color: red;font-size: 12px">{{$t('message.说明：此配置设置内容如下：分度为1g，量程为20kg，AD转速率为3。设置一次即可，无需重复设置！')}}</p>
        </a-card>
    </div>
</template>
<script>
    import PageHeader from "./common/PageHeader"
    import {autoJump} from "../assets/tools/tool"
    import axios from 'axios'
    import aCard from "./common/Acard"
    export default {
        components: {
            PageHeader,
            aCard
        },
        computed: {
            apiurl() {
                return this.$store.state.apiurl;
            },
            operateNo() {
                return this.$store.state.user.operateNo;
            },
            userId() {
                return this.$store.state.user.userId;
            },
            adjustBaseData() {
                return {
                    operateNo: this.operateNo,
                    op_id: this.userId,
                    op_type: "OP_SEEDLING_ADJUST",
                    dev_id: 1
                }
            }
        },
        methods: {
           handleSubmit() {
                axios({
                    method: "post",
                    url: `${this.apiurl}/la/adjust`,
                    data: {
                        data: {
                            data_id: 21,
                            value: 12,
                            data_code: "W_SCALE",
                            ...this.adjustBaseData
                        }
                    }
                }).then(data => {
                    if(data.data.code == 200) {
                        this.$message({
                            type: 'success',
                            message: this.$t('message.分度设置成功!')
                        });
                    }
                    axios({
                        method: "post",
                        url: `${this.apiurl}/la/adjust`,
                        data: {
                            data: {
                                data_id: 22,
                                value: 20000,
                                data_code: "W_RANGE",
                                ...this.adjustBaseData
                            }
                        }
                    }).then(data => {
                        if(data.data.code == 200) {
                            this.$message({
                                type: 'success',
                                message: this.$t('message.量程设置成功!')
                            });
                            axios({
                                method: "post",
                                url: `${this.apiurl}/la/adjust`,
                                data: {
                                    data: {
                                        data_id: 23,
                                        value: 3,
                                        data_code: "W_AD",
                                        ...this.adjustBaseData
                                    }
                                }
                            }).then(data => {
                                if(data.data.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: this.$t('message.AD转换速设置成功!')
                                    });
                                }
                            })
                        }
                    })
                });
            }
        },
        mounted() {
            autoJump(2);
        }
    }
</script>