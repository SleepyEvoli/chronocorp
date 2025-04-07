import {reactive, ref} from 'vue';
import {defineStore} from 'pinia';

export const useContextMenuStore = defineStore('contextMenu', () => {
    const visible = ref(false);
    const position = reactive({x: 0, y: 0});
    const items = ref<{ label: string; cb: () => void }[]>([]);

    const openMenu = (event: MouseEvent, menuItems: { label: string; cb: () => void }[]): void => {
        event.preventDefault();
        position.x = event.pageX;
        position.y = event.pageY;
        items.value = menuItems;
        visible.value = true;
    };

    const closeMenu = (): void => {
        visible.value = false;
        items.value = [];
    };

    return {
        visible,
        position,
        items,
        openMenu,
        closeMenu,
    };
});
