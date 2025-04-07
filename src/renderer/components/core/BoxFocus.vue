<template lang="html">
    <div class="box-focus">
        <Box
            :is-closeable="props.isCloseable"
            class="box-focus__box"
            @close="emit('close')"
        >
            <slot></slot>
        </Box>
    </div>
</template>

<script lang="ts" setup>
import Box from '@/components/core/Box.vue';

const props = defineProps({
    isCloseable: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['close']);
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.box-focus {
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 90;

    .box-focus__box {
        width: fit-content;
        margin: 3.5rem auto 0 auto;
    }
}
</style>
