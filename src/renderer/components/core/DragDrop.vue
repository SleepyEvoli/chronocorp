<template lang="html">
    <div
        ref="componentRef"
        class="drag-drop"
        draggable="true"
        @dragstart="dragStart"
    >
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import type {MyTask, Task} from '@share/interfaces/activecollab/task';
import type {Tracking} from '@/interfaces';
import {DragType} from '@/interfaces';
import {useDragStore} from '@/stores/dragStore';
import {ref} from 'vue';

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
});

const dragStore = useDragStore();
const componentRef = ref<HTMLElement | null>(null);

// Type guards. Those are kind of hardcoded checks because the check happens at runtime
function isTask(data: any): data is Task {
    return data != null && typeof data === 'object' && data['class'] === 'Task';
}

function isMyTask(data: any): data is MyTask {
    return data != null && typeof data === 'object' && data['type'] === 'Task' && 'tracked_time' in data;
}

function isTracking(data: any): data is Tracking {
    return (
        data != null &&
        typeof data === 'object' &&
        'time' in data &&
        typeof (data as any).time === 'object' &&
        'hours' in (data as any).time &&
        typeof (data as any).time.hours === 'number' &&
        'minutes' in (data as any).time &&
        typeof (data as any).time.minutes === 'number'
    );
}

// Drop is called before dragend, so we can use it to clear the dragged task
const dragStart = () => {
    if (isTask(props.data)) {
        dragStore.setCurrentDraggedObject(props.data, DragType.TASK);
        (componentRef.value as HTMLElement).addEventListener('dragend', dragStore.clearCurrentDraggedObject);
    } else if (isTracking(props.data)) {
        dragStore.setCurrentDraggedObject(props.data, DragType.TRACKING);
        (componentRef.value as HTMLElement).addEventListener('dragend', dragStore.clearCurrentDraggedObject);
    } else if (isMyTask(props.data)) {
        dragStore.setCurrentDraggedObject(props.data, DragType.MY_TASK);
        (componentRef.value as HTMLElement).addEventListener('dragend', dragStore.clearCurrentDraggedObject);
    }
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.drag-drop {
    cursor: pointer;
    height: fit-content;
}

.drag-drop:hover {
    cursor: grabbing;
    outline: 1px solid #f0f0f0;
    border-radius: $border-radius-md;
}


</style>
