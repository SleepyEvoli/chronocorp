<template lang="html">
    <input
        ref="inputElement"
        :placeholder="props.placeholder"
        :type="props.type"
        :value="inputValue"
        class="input-field"
    >
</template>

<script lang="ts" setup>

import {ref, watch} from 'vue';

const props = defineProps({
    placeholder: {
        type: String,
        default: 'search...',
    },
    type: {
        type: String as () => HTMLInputElement['type'],
        default: 'text',
    },
    value: {
        required: true,
        default: '',
    },
});

const inputElement = ref<HTMLInputElement | null>(null);
defineExpose({inputElement});

const inputValue = ref(props.value);

watch(() => props.value, (newValue) => {
    inputValue.value = newValue;
});

</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.input-field {
    background-color: $primary-color-4;
    color: $text-color;
    margin: 0;
    width: 100%;
    min-width: 3em;
    border-radius: $border-radius-sm;
    padding: 0.25em 1em;
    border: 1px solid $primary-color-1;
}

.input-field::placeholder {
    color: $primary-color-1;
}

.input-field:focus {
    outline: unset;
    border-radius: $border-radius-sm;
}
</style>
