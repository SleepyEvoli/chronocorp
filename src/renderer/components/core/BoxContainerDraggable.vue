<template lang="html">
    <div
        v-if="active"
        ref="draggable-box"
        :style="{ top: `${y}px`, left: `${x}px` }"
        class="box-container-draggable"
    >
        <div class="box-container-draggable__header" @mousedown="onStartDrag">
            <Button class="box-container-draggable__header-action icon no-border no-bg">
                <Icon icon-name="drag"/>
            </Button>
            <Button class="box-container-draggable__header-action icon no-border no-bg" @click="onClose">
                <Icon icon-name="close"/>
            </Button>
        </div>
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import Icon from '@/components/core/Icon.vue';
import {onBeforeUnmount, onMounted, ref} from 'vue';
import Button from '@/components/core/Button.vue';

const emit = defineEmits(['close']);

const active = ref(true);
const x = ref<number>(30);
const y = ref<number>(0);

let offsetX = 0;
let offsetY = 0;
let isDragging = false;

const onStartDrag = (event: MouseEvent) => {
    offsetX = event.clientX - x.value;
    offsetY = event.clientY - y.value;
    isDragging = true;
};

const drag = (event: MouseEvent) => {
    if (isDragging) {
        x.value = event.clientX - offsetX;
        y.value = event.clientY - offsetY;
    }
};

const stopDrag = () => {
    isDragging = false;
};

const onClose = () => {
    active.value = false;
    emit('close');
};

onMounted(() => {
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
});

onBeforeUnmount(() => {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.box-container-draggable {
    position: fixed;
    max-height: 80vh;
    overflow-y: auto;
    z-index: 1;
    max-width: 85vw;
    border: 1px solid $primary-color-1;
    border-radius: $border-radius-sm;
    resize: both;

    :deep(.box) {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    .box-container-draggable__header {
        background-color: $primary-color-3;
        border-radius: .2em .2em 0 0;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        user-select: none;
        padding: 0.2rem;

        .box-container-draggable__header-action {
            height: 1.25rem;
            width: 1.25rem;
        }
    }
}
</style>
