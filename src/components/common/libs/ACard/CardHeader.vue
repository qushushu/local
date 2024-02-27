<template>
    <div class="card-header" :class="{only: $attrs.type == 'only'}">
        <slot></slot>
    </div>
</template>
<style scoped>
    .card-header {position:relative;margin-bottom: 10px;padding-bottom: 12px;border-bottom: 1px solid #e8e8e8;font-size: 14px;display:flex;align-items:center;justify-content:space-between;}
    .card-header.only {padding-bottom: 0px;border-bottom: 0;margin-bottom: 0;}
    .mint .card-header {border-color: #5ad449}
    .sea .card-header {display:block;padding: 8px 0;border-bottom: 2px solid #72bef2;text-align:center;font-size: 16px;color:#FFF;}
</style>