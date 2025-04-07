<template lang="html">
    <div
        :style="{
            backgroundColor: props.color,
            outlineColor: props.outlineColor,
            outlineWidth: props.outlineColor ? '1px' : '0'
        }"
        class="label"
    >
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    color: {
        type: String,
        required: false,
    },
    outlineColor: {
        type: String,
        required: false,
    },
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.label {
    border-radius: $border-radius-sm;
    color: #FFFFFF;
    font-family: $font-family-title;
    font-weight: 400;
    padding: 0.25em 0;
    border: 1px solid transparent;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    outline-style: solid;
}
</style>
