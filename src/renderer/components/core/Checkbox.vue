<template lang="html">
    <div class="checkbox">
        <input
            :checked="checkedValue"
            type="checkbox"
            @change="()=>{
                checkedValue = !checkedValue;
                emit('change', checkedValue);
            }"
        >
        <div
            class="checkbox-text"
            @click="()=>{
                checkedValue = !checkedValue;
                emit('change', checkedValue);
            }"
        >
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {defineEmits, defineProps, ref, watch} from 'vue';

const props = defineProps({
    checked: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['change']);

const checkedValue = ref(props.checked);

watch(() => props.checked, (value) => {
    checkedValue.value = value;
});

</script>


<style lang="scss" scoped>
@use '@/styles/variables' as *;

.checkbox {
    align-items: center;
    display: flex;
    flex-direction: row;

    .checkbox-text {
        cursor: pointer;
    }

    input[type='checkbox'] {
        appearance: none;
        background-color: $primary-color-7;
        border: 2px solid $primary-color-2;
        border-radius: $border-radius-sm;
        height: 1em;
        width: 1em;
        align-self: center;
        margin-right: .5em;
        margin-left: 0;
        position: relative;
    }

    input[type='checkbox']:hover {
        border-color: $primary-color-1;
        cursor: pointer;
    }

    input[type='checkbox']:checked::before {
        content: '✔';
        color: #FFFFFF;
        transform: translate(-50%, -50%) scale(.8); // Workaround for centering the checkmark
        position: absolute;
        top: 50%;
        left: 50%;
    }
}

</style>
