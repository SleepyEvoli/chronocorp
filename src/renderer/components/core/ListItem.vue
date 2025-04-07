<template lang="html">
    <li class="list-item">
        <slot></slot>
    </li>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.list-item {
    border-bottom: solid 1px $primary-color-6;
    line-height: 1.4em;
    padding: .5em .75em;
    width: 100%;
    list-style: none;
    align-items: center;
}

.list-item.hover:hover {
    background-color: $primary-color-6;
    border-radius: $border-radius-sm;
    cursor: pointer;
}
</style>
