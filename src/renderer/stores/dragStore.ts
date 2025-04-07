import {ref} from 'vue';
import {defineStore} from 'pinia';
import {DragType} from '@/interfaces';

export const useDragStore = defineStore('drag', () => {
    const currentDraggedObject = ref<Object | null>(null);
    const lastDragType = ref<DragType | null>(null);

    // Before we work with an item after dropping it, we check what type of item it is
    const setCurrentDraggedObject = (obj: Object | null, type: DragType): void => {
        currentDraggedObject.value = obj;
        setLastDragType(type);
    };

    const clearCurrentDraggedObject = (): void => {
        currentDraggedObject.value = null;
    };

    const setLastDragType = (type: DragType): void => {
        lastDragType.value = type;
    };

    return {
        currentDraggedObject,
        lastDragType,
        setCurrentDraggedObject,
        setLastDragType,
        clearCurrentDraggedObject,
    };
});
