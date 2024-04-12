<!-- 
  组件说明：本组件为传感器设置组件。
  进入方式：系统管理员登录后点击"传感器设置"菜单进入此页面。
  用户权限：系统管理员方可查看，
-->
<template>
    <div class="ym-main">
        <slot></slot>
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
    import {adjust} from "../../store/ajax.js"
    export default {
        computed: {
            operateNo() {return this.$store.state.userInfo.user.account},
            adjustBaseData() {
                return {
                    operateNo: this.operateNo,
                    op_type: "OP_FARM_ADJUST",
                    dev_id: 1
                }
            }
        },
        methods: {
            async handleSubmit() {
                // 设置分度
                let res1 = await adjust({
                    data_id: 21,
                    value: 12,
                    data_code: "W_SCALE",
                    ...this.adjustBaseData
                });
                if(res1) {
                    this.$message({
                        type: 'success',
                        message: this.$t('message.分度设置成功!')
                    });
                }
                // 设置量程
                let res2 = await adjust({
                    data_id: 22,
                    value: 20000,
                    data_code: "W_RANGE",
                    ...this.adjustBaseData
                })
                if(res2) {
                    this.$message({
                        type: 'success',
                        message: this.$t('message.量程设置成功!')
                    });
                }
                // 设置AD转换速
                let res3 = await adjust({
                    data_id: 23,
                    value: 3,
                    data_code: "W_AD",
                    ...this.adjustBaseData
                })
                if(res3) {
                    this.$message({
                        type: 'success',
                        message: this.$t('message.AD转换速设置成功!')
                    });
                }
            }
        }
    }
</script>