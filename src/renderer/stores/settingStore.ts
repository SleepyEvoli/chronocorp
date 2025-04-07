import {ref} from 'vue';
import {defineStore} from 'pinia';

export const useSettingStore = defineStore('setting', () => {
    const alwaysOnTop = ref<boolean>(true);

    // Sidebar Settings
    const projectFilters = ref([
        {key: 'assigned', label: 'Zugeteilt', state: false},
        {key: 'complete', label: 'Abgeschlossen', state: false},
        {key: 'incomplete', label: '!Abgeschlossen', state: false},
        {key: 'favorite', label: 'Favoriten', state: false},
    ]);
    const taskFilters = ref([
        {key: 'assigned', label: 'Zugeteilt', state: false},
        {key: 'complete', label: 'Abgeschlossen', state: false},
        {key: 'incomplete', label: '!Abgeschlossen', state: false},
        {key: 'favorite', label: 'Favoriten', state: false},
    ]);

    const init = async (): Promise<void> => {
        await window.electron.app.setAlwaysOnTop(alwaysOnTop.value);
    };

    return {
        alwaysOnTop,
        projectFilters,
        taskFilters,
        init,
    };
});
