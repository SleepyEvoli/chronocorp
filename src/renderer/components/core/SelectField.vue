<template lang="html">
    <select
        :value="selectValue"
        class="select-field"
    >
        <option
            v-for="option in optionsWithEmpty"
            :key="option.optionValue"
            :value="option.optionValue"
        >
            {{ option.optionName }}
        </option>
    </select>
</template>

<script lang="ts" setup>

import type {SelectionOption} from '@/interfaces';
import {computed, defineProps, ref, watch} from 'vue';

const props = defineProps({
    options: {
        type: Array as () => SelectionOption[],
        required: true,
    },
    value: {
        type: [String, Number],
        required: true,
        default: '',
    },
});

const selectValue = ref<string | number>(props.value);

const optionsWithEmpty = computed(() => [
    {optionName: 'Select an option', optionValue: ''},
    ...props.options,
]);

watch(() => props.value, (value) => {
    selectValue.value = value;
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.select-field {
    margin: 0;
    width: 100%;
    max-width: 100%;
    background-color: $primary-color-7;
    border-radius: $border-radius-sm;
    font-size: inherit;
    color: $text-color;
    padding: .25em;
    border: unset;

    option {
        background-color: $primary-color-7;
        color: $primary-color-0;
    }
}

.select-field:focus {
    outline: none;
}

.select-field:hover {
    filter: brightness(1.1);
    cursor: pointer;
}
</style>
