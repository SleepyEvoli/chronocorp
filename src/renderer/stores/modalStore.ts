import {ref} from 'vue';
import {defineStore} from 'pinia';

export const useModalStore = defineStore('modal', () => {
    const confirmModalVisible = ref(false);
    const confirmModalMessage = ref('');
    const confirmCallback = ref<(() => void) | null>(null);

    const openConfirmModal = (message: string, callback: () => void): void => {
        confirmModalMessage.value = message;
        confirmCallback.value = callback;
        confirmModalVisible.value = true;
    };

    const closeConfirmModal = (): void => {
        confirmModalVisible.value = false;
        confirmCallback.value = null;
    };

    const confirm = (): void => {
        if (confirmCallback.value) {
            confirmCallback.value();
        }
        closeConfirmModal();
    };

    return {
        confirmModalVisible,
        confirmModalMessage,
        openConfirmModal,
        closeConfirmModal,
        confirm,
    };
});
