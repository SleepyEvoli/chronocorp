<template lang="html">
    <input :checked="props.checked" class="radio" type="radio">
</template>

<script lang="ts" setup>
import {defineProps} from 'vue';

const props = defineProps({
    checked: {
        type: Boolean,
        default: false,
        required: false,
    },
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.radio[type='radio'] {
    appearance: none;
    background-color: $primary-color-7;
    border: 2px solid $primary-color-2;
    border-radius: 100%;
    height: 1rem;
    width: 1rem;
    position: relative;
}

.radio[type='radio']:checked::before {
    content: '';
    background-color: #FFFFFF;
    border-radius: 100%;
    height: 0.4rem;
    width: 0.4rem;
    position: absolute;
    top: calc(50% - 0.2rem);
    left: calc(50% - 0.2rem);
}

.radio[type='radio']:hover {
    border-color: $primary-color-1;
    cursor: pointer;
}

</style>
