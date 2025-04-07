<template lang="html">
    <InputField
        ref="inputRef"
        :maxlength="props.maxlength"
        :value="inputValue"
        class="inline-edit-text-field"
        @change="onSaveField"
        @focus="selectText"
        @keyup.enter="onSaveField"
        @keyup.esc="()=>{
            inputValue = props.value;
        }"
    />
</template>

<script lang="ts" setup>
import {nextTick, ref, watch} from 'vue';
import InputField from '@/components/core/InputField.vue';

const emit = defineEmits(['save']);

const props = defineProps({
    value: {
        required: true,
        type: String,
        default: '',
    },
    maxlength: {
        required: false,
        type: Number,
        default: -1,
    },
});

const inputValue = ref<string>(props.value);
const inputRef = ref<InstanceType<typeof InputField> | null>(null);

watch(() => props.value, (newValue) => {
    inputValue.value = newValue;
});

const selectText = async () => {
    await nextTick();
    if (inputRef.value?.inputElement) {
        inputRef.value.inputElement.select();
    }
};

const onSaveField = (event: Event) => {
    inputValue.value = (event.target as HTMLInputElement).value;

    if (inputValue.value !== props.value) {

        if (inputRef.value && inputRef.value.inputElement) {
            inputRef.value.inputElement.blur();
        }

        emit('save', inputValue.value);
    }
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.inline-edit-text-field {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    background-color: inherit;
    font-size: inherit;
    font-family: inherit;
    color: inherit;
}

.inline-edit-text-field:hover {
    cursor: pointer;
}
</style>
