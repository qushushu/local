<template>
  <!-- 补水阀 start -->
  <a-card>
    <card-header type="only">
      <div>{{$t("message.补水阀")}}</div>
      <div>
        <ToOp />
        <el-switch v-model="WSV" disabled></el-switch>
      </div>
    </card-header>
  </a-card>
  <!-- 补水阀 end -->
</template>
<script>
  import {runInfoMixin} from "../mixins/runinfo"
  import ToOp from "./ToOp"
  export default {
    mixins: [runInfoMixin],
    computed: {
      WSV() {return this.getRunInfo("dig","WSV").refValue}
    },
    components: {
      ToOp
    }
  }
</script>