<template lang="html">
    <button
        :class="{
            'toggle-on': props.toggle !== null && props.toggle,
            'toggle-off': props.toggle !== null && !props.toggle,
        }"
    >
        <slot></slot>
    </button>
</template>

<script lang="ts" setup>
const props = defineProps({
    toggle: {
        type: Boolean,
        required: false,
        default: null,
    },
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

button {
    border-radius: $border-radius-sm;
    cursor: pointer;
    display: flex;
    max-width: 100%;
    padding: .25em .5em;
    text-align: center;
    font-size: inherit;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-family: afacad, sans-serif;
}

button:hover {
    color: $text-color;
}

button:hover:deep(svg) {
    fill: $text-color;
}

button:active {
    filter: brightness(1.1);
}

button.primary {
    background-color: $primary-color-0;
    color: $primary-color-4;
    border: none;
    padding: 0.25em 0.5em;
}

button.primary:hover {
    background-color: $text-color;
    color: $primary-color-8;
}

button.primary:deep(svg) {
    fill: $primary-color-4;
}

button.secondary {
    color: $primary-color-0;
    border: 1px solid $primary-color-0;
    background-color: transparent;
}

button.secondary:hover {
    background-color: $primary-color-0;
    color: $primary-color-4;
}

button.secondary:hover:deep(svg) {
    fill: $primary-color-4;
}

button.toggle-on {
    color: $primary-color-0;
    outline: 1px solid $primary-color-0;
}

button.toggle-on:hover {
    background-color: inherit;
    color: inherit;
    filter: brightness(1.1);
}

button.toggle-on:deep(svg) {
    fill: $primary-color-0 !important;
}

button.toggle-on.icon {
    outline: none;
}

button.toggle-off {
    outline: 1px solid $primary-color-3;
    color: inherit;
}

button.toggle-off.icon {
    outline: none;
}

button.toggle-off:deep(svg) {
    fill: $primary-color-0;
}

button.toggle-off:hover {
    background-color: inherit;
    color: inherit;
    filter: brightness(1.1);
}

button.icon {
    padding: 0.1rem !important;
}

button.blue {
    background-color: $accent-color-blue-1;
    color: $text-color;
    border: none;
}

button.blue:hover {
    background-color: $accent-color-blue-2;
}

button.blue:deep(svg) {
    fill: #FFFFFF;
}

button.purple {
    background-color: $accent-color-purple-1;
    border: none;
    color: $text-color;
}

button.purple:hover {
    background-color: $accent-color-purple-2;
}

button.purple:deep(svg) {
    fill: #FFFFFF;
}

button.orange {
    background-color: $accent-color-orange-1;
    border: none;
    color: $text-color;
}

button.orange:hover {
    background-color: $accent-color-orange-2;
}

button.orange:deep(svg) {
    fill: #FFFFFF;
}

button.red {
    background-color: $accent-color-red-1;
    border: none;
    color: $text-color;
}

button.red:hover {
    background-color: $accent-color-red-2;
}

button.red:deep(svg) {
    fill: #FFFFFF;
}

button.green {
    background-color: $accent-color-green-1;
    border: none;
    color: $text-color;
}

button.green:hover {
    background-color: $accent-color-green-2;
}

button.green:deep(svg) {
    fill: #FFFFFF;
}

button.disabled {
    opacity: 0.5;
}

button.disabled:hover {
    background-color: transparent;
    color: $primary-color-0;
}

button.image {
    background-color: transparent;
    border: none;
    padding: 0;
    margin: 0;
}
</style>
