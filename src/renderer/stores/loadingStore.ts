import {ref} from 'vue';
import {defineStore} from 'pinia';

export const useLoadingStore = defineStore('loading', () => {

    const loading = ref(false);

    const setLoading = (value: boolean): void => {
        loading.value = value;
    };

    return {
        loading,
        setLoading,
    };
});
