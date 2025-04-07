<template lang="html">
    <textarea
        :placeholder="placeholder"
        :value="inputValue"
        class="textarea"
    />
</template>

<script lang="ts" setup>
import {defineProps, ref, watch} from 'vue';

const props = defineProps({
    placeholder: {
        type: String,
        default: '...',
    },
    value: {
        type: String,
        default: '',
    },
});

const inputValue = ref<string>(props.value);

watch(() => props.value, (newVal) => {
    inputValue.value = newVal;
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.textarea {
    background-color: $primary-color-3;
    border: 1px solid $primary-color-1;
    border-radius: $border-radius-sm;
    color: $text-color;
    min-height: 5em;
    padding: 0.5em;
    resize: vertical;
    width: 100%;
}

.textarea::placeholder {
    color: $primary-color-1;
}

.textarea:focus {
    border-color: $primary-color-2;
    outline: none;
}
</style>
