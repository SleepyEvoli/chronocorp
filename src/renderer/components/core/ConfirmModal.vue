<template lang="html">
    <BoxFocus
        @close="emit('cancel')"
        @click.self="emit('cancel')"
    >
        <div class="confirm-dialog">
            <div class="confirm-dialog__message">
                {{ modalStore.confirmModalMessage }}
            </div>
            <div class="confirm-dialog__buttons">
                <Button class="confirm-dialog__button red" @click="emit('confirm')">Okay</Button>
                <Button class="confirm-dialog__button secondary" @click="emit('cancel')">Abbrechen</Button>
            </div>
        </div>
    </BoxFocus>
</template>

<script lang="ts" setup>
import {defineEmits} from 'vue';
import Button from '@/components/core/Button.vue';
import {useModalStore} from '@/stores/modalStore';
import BoxFocus from '@/components/core/BoxFocus.vue';

const emit = defineEmits(['confirm', 'cancel']);

const modalStore = useModalStore();
</script>

<style lang="scss">
@use '@/styles/variables' as *;

.confirm-dialog {
    background: $primary-color-4;
    border-radius: 8px;
    width: 20em;
    font-size: 1.1em;
    text-align: center;

    .confirm-dialog__message {
        padding: .5em;
    }

    .confirm-dialog__buttons {
        display: flex;
        gap: 1em;
        width: 100%;
        padding: .5em 0;
        justify-content: center;
        font-size: 1em;
    }
}

</style>
