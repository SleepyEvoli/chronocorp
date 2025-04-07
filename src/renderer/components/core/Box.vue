<template lang="html">
    <div v-if="active" ref="boxRef" class="box">
        <div v-if="props.isCloseable" class="box__close-area">
            <Button class="box__close-area-button icon secondary no-border icon" @click="onClose">
                <Icon icon-name="close"/>
            </Button>
        </div>
        <div class="box__body">
            <slot>Empty Box?</slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import Button from '@/components/core/Button.vue';
import Icon from '@/components/core/Icon.vue';

const props = defineProps({
    isCloseable: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['close']);

const active = ref<boolean>(true);

const onClose = () => {
    emit('close');
    active.value = false;
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.box {
    background-color: $primary-color-4;
    border: 2px solid $box-border-color;
    border-radius: $border-radius-md;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    height: fit-content;
    overflow: visible;

    .box__body {
        width: 100%;
        max-height: 85vh;
        padding: .75rem;
        overflow: auto;
    }

    .box__close-area {
        display: flex;
        justify-content: flex-end;
        margin-bottom: .5em;
        width: 100%;

        .box__close-area-button {
            cursor: pointer;
            height: 1.2rem;
            width: 1.2rem;
        }

        svg:hover {
            fill: $text-color;
        }
    }
}
</style>
