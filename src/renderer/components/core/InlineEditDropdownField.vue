<template lang="html">
    <SelectField
        :options="list.map((item) => ({optionValue: item.optionValue, optionName: item.optionName.slice(offset)}))"
        :style="{
            color: color,
            outlineColor: outlineColor,
        }"
        :value="inputValue"
        class="inline-edit-dropdown-field"
        @change="onSaveField($event.target.value)"
    >
    </SelectField>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue';
import type {SelectionOption} from '@/interfaces';
import SelectField from '@/components/core/SelectField.vue';

const emit = defineEmits(['save']);

const props = defineProps({
    value: {
        type: [String, Number],
        required: true,
        default: '',
    },
    list: {
        type: Array as () => SelectionOption[],
        required: true,
    },
    offset: {
        type: Number,
        required: false,
        default: 0,
    },
    outlineColor: {
        type: String,
        required: false,
        default: 'transparent',
    },
    color: {
        type: String,
        required: false,
        default: 'inherit',
    },
});

const inputValue = ref<string | number>(props.value);

watch(() => props.value, (newValue) => {
    inputValue.value = newValue;
});

const onSaveField = (newValue: string | number) => {
    if (props.value != newValue) {
        emit('save', newValue);
    }
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.inline-edit-dropdown-field {
    font-size: inherit;
    color: inherit;
    background-color: inherit;
    outline-width: 1px;
    outline-style: solid;
    border: unset;
}

</style>
