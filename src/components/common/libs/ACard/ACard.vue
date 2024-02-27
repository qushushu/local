<template>
    <div class="common-card" :class="{mint: $attrs.type=='mint',sea: $attrs.type=='sea'}" @click="handleClick">
        <slot></slot>
    </div>
</template>
<style scoped>
    .common-card {box-sizing: border-box;flex: 1;margin-bottom: 10px;padding: 12px;border: 1px solid #e8e8e8;line-height: 1.5; font-size: 14px;color: #000000a6;background: #FFF;}
    .common-card.mint {background: #78db6a;color: #FFF;}
    .common-card.sea {border-bottom: 2px solid #72bef2;padding: 0 0 8px;text-align:center;font-size: 16px;background: #5cb1eb;border-radius: 10px;box-shadow: 2px 4px 6px rgba(55, 52, 73, 0.4), inset -2px -2px 4px white;}
</style>
<script>
    export default {
        methods: {
            handleClick() {
                this.$emit("handleClick");
            }
        }
    }
</script>