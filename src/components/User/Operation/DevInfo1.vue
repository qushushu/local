<template>
    <a-card size="small" class="space-btm1 text-center" id="smartgrow-home-card1">
        <el-row justify="space-between" type="flex" :gutter="6">
            <el-col v-for="item,key in dataInfo" :key="key">
                <div class="mobile-wrap-card">
                    <p class="text-dt">{{item.name}}</p>
                    <p class="text-dd">{{item.value}} <span class="dw" v-if="item.refUnit">{{item.unit}}</span></p>
                </div>
            </el-col>
        </el-row>
    </a-card>
</template>
<script>
    import {runInfoMixin} from "../mixins/runinfo"
    export default {
        mixins: [runInfoMixin],
        computed: {
            dataInfo() {return this.getRunInfo("ana",["EC","PH","LIQ_LV","LIQ_TEMP"])},
        }
    }
</script>