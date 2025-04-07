<template lang="html">
    <div
        v-show="showLabel"
        ref="inlineEditRef"
        class="inline-edit-label"
        @click="()=>showLabel = false"
    >
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted, ref, watch} from 'vue';

const props = defineProps({
    showLabel: {
        type: Boolean,
        required: true,
        default: true,
    },
});

const emit = defineEmits(['visibilityChanged']);

const showLabel = ref<boolean>(props.showLabel);
const inlineEditRef = ref<HTMLInputElement | null>(null);

watch(() => props.showLabel, (newValue) => {
    showLabel.value = newValue;
});

watch(() => showLabel.value, (newShowLabel) => {
    emit('visibilityChanged', newShowLabel);
});

const handleClickOutside = (event: Event) => {
    if (inlineEditRef.value && !inlineEditRef.value.contains(event.target as Node) && !inlineEditRef.value?.parentNode?.contains(event.target as Node)) {
        showLabel.value = true;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.inline-edit-label {
    cursor: pointer;
}
</style>
