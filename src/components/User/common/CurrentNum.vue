<template>
    <component :is="comName"></component>
</template>
<script>
    import CurrentIp from "../../../components/User/common/CurrentIp"
    import CurrentPos from "../../../components/User/common/CurrentPos"
    import {envMixin} from "@/components/mixins/envMix"
    export default {
        mixins: [envMixin],
        computed: {
            comName() {return this.isWeb ? "CurrentPos" : "CurrentIp"}
        },
        components: {
            CurrentIp,  // 本地版编号
            CurrentPos  // 网络版编号
        }
    }
</script>