<template lang="html">
    <InputField
        ref="inputRef"
        :value="inputValue"
        class="input-field-time"
        @change="save"
        @focus="selectText"
    />
</template>
<script lang="ts" setup>
import {nextTick, onMounted, ref, watch} from 'vue';
import InputField from '@/components/core/InputField.vue';

const props = defineProps({
    value: {
        required: true,
        default: 0,
        type: Number,
    },
    isMinute: {
        required: false,
        type: Boolean,
        default: false,
    },
    isHour: {
        required: false,
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['save']);

const inputValue = ref<string>();

const inputRef = ref<InstanceType<typeof InputField> | null>(null);

watch(() => props.value, (newValue) => {
    inputValue.value = formatToTimeString(newValue);
});

const selectText = async () => {
    await nextTick();
    if (inputRef.value?.inputElement) {
        inputRef.value.inputElement.select();
    }
};

const formatToTimeString = (value: number): string => {

    if (Number.isNaN(value)) {
        console.warn('Value is not a number. Converting to 00');
        return '00';
    }

    if (props.isHour) {
        if (value > 23) {
            console.warn('Hour is greater than 23. Converting to 23');
            return '23';
        } else if (value < 0) {
            console.warn('Hour is less than 0. Converting to 00');
            return '00';
        } else {
            return value.toString().padStart(2, '0');
        }
    } else if (props.isMinute) {
        if (value > 59) {
            console.warn('Minute is greater than 59. Converting to 59');
            return '59';
        } else if (value < 0) {
            console.warn('Minute is less than 0. Converting to 00');
            return '00';
        } else {
            return value.toString().padStart(2, '0');
        }
    } else {
        console.warn('No type specified. (isMinute, isHour)');
        return '00';
    }
};

const save = (event: InputEvent) => {
    if (event.target) {

        // Format any string to a 2 digit time string, by getting its integer value first
        inputValue.value = event.target ? formatToTimeString(parseInt((event.target as HTMLInputElement).value)) : '00';

        let inputValueAsNumber = parseInt(inputValue.value);

        if (Number.isNaN(inputValueAsNumber)) {
            inputValueAsNumber = 0;
            inputValue.value = '00';
        }

        if (inputRef.value && inputRef.value.inputElement) {
            inputRef.value.inputElement.blur();
        }

        // Triggers an actual update of the input field for the watcher
        (event.target as HTMLInputElement).value = inputValue.value;

        emit('save', inputValueAsNumber);
    }
};

onMounted(() => {
    inputValue.value = formatToTimeString(props.value);
});
</script>
<style lang="scss" scoped>
@use '@/styles/variables' as *;

.input-field-time {
    text-align: center;
    overflow: unset;
    width: 1.25em;
    background-color: #334054;
    color: #CFD4DA;
    font-size: 1em;
    margin: 0;
    min-width: unset;
    border-radius: 0.25rem;
    border: unset;
    padding: 0;
    outline: none;
}

.input-field-time:hover {
    filter: brightness(1.1);
}
</style>
