<template lang="html">
    <div
        ref='refDropbox'
        class="assignment-label-dropbox"
        @dragenter="onDragOver"
        @dragleave="onDragLeave($event)"
        @dragover="(e)=>e.preventDefault()"
        @drop="onDrop"
    >
        <div class="assignment-label-dropbox__header">
            <div
                :style="{
                    backgroundColor: assignmentLabel.bg_color,
                    color: assignmentLabel.fg_color
                }"
                class="assignment-label-dropbox__header-label"
            >
                <span>{{ props.assignmentLabel.name }}</span>
            </div>
            <div
                :style="{
                    backgroundColor: assignmentLabel.bg_color,
                }"
                class="assignment-label-dropbox__header-counter"
            >
                <span :style="{
                          color: assignmentLabel.fg_color
                      }"
                >
                    {{ myTasks.length }}
                </span>
            </div>
        </div>
        <div class="assignment-label-dropbox__body">
            <div class="assignment-label-dropbox__body-tasks">
                <DragDrop
                    v-for="task in myTasks"
                    :key="task.id"
                    :data="task"
                    class="assignment-label-dropbox__body-task"
                    @click.right="onContextMenuOpen($event, task)"
                >
                    <div
                        class="assignment-label-dropbox__body-task--title"
                        @click="async ()=>{
                            await router.push({name: 'task-detail', params: {taskId: task.task_id, projectId: task.project_id}});
                        }"
                    >
                        {{ task.name }}
                    </div>
                    <div class="assignment-label-dropbox__body-task--project">
                        {{ task.project }}
                    </div>
                </DragDrop>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {defineProps, ref, watch} from 'vue';
import type {AssignmentLabel} from '@share/interfaces/activecollab/system';
import {useTaskStore} from '@/stores/taskStore';
import type {MyTask} from '@share/interfaces/activecollab/task';
import DragDrop from '@/components/core/DragDrop.vue';
import {DragType} from '@/interfaces';
import {useDragStore} from '@/stores/dragStore';
import {useContextMenuStore} from '@/stores/contextMenuStore';
import {useTrackingStore} from '@/stores/trackingStore';
import router from '@/router/router';

const props = defineProps({
    assignmentLabel: {
        type: Object as () => AssignmentLabel,
        required: true,
    },
});

const taskStore = useTaskStore();
const dragStore = useDragStore();
const contextMenuStore = useContextMenuStore();
const trackingStore = useTrackingStore();

const myTasks = ref<MyTask[]>(taskStore.myTasks.filter(t => t.label_id === props.assignmentLabel.id));

watch(() => taskStore.myTasks, (newValue) => {
    myTasks.value = newValue.filter(t => t.label_id === props.assignmentLabel.id);
});

const refDropbox = ref<HTMLElement | null>(null);

const onDrop = (e: DragEvent) => {
    e.preventDefault();
    refDropbox.value?.classList.remove('drag-over');
    const dragType = dragStore.lastDragType;
    if (dragType === DragType.MY_TASK) {
        if (dragStore.currentDraggedObject) {
            const task = dragStore.currentDraggedObject as MyTask;
            if (task.label_id !== props.assignmentLabel.id) {
                onChangeAssignment(task, props.assignmentLabel);
            }
        }
    }
};

const onContextMenuOpen = (e: MouseEvent, myTask: MyTask) => {
    contextMenuStore.openMenu(e, [
        {
            label: 'Start Tracking', cb: async () => {
                const task = await taskStore.fetchTaskById(myTask.project_id, myTask.task_id);
                if (task) {
                    const tracking = trackingStore.createTracking(task);
                    if (tracking) {
                        trackingStore.addTracking(tracking);
                        trackingStore.focusedTracking = tracking;
                    }
                }
            },
        },
        {
            label: 'Pin Task', cb: async () => {
                const task = await taskStore.fetchTaskById(myTask.project_id, myTask.task_id);
                if (!task) {
                    return;
                }
                await trackingStore.addPinnedTask(task);
            },
        },
    ]);
};

const onChangeAssignment = async (task: MyTask, newAssignmentLabel: AssignmentLabel) => {
    const success = await taskStore.submitChangeAssignmentLabel(task.project_id, task.task_id, newAssignmentLabel.id);
    if (success) {
        taskStore.myTasks = await taskStore.fetchMyTasks();
    }
};

const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    refDropbox.value?.classList.add('drag-over');
};

const onDragLeave = (event: MouseEvent) => {
    if (!refDropbox.value?.contains(event.relatedTarget as Node)) {
        refDropbox.value?.classList.remove('drag-over');
    }
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.assignment-label-dropbox.drag-over {
    background-color: $primary-color-3;
    border: 2px solid $primary-color-0;
}

.assignment-label-dropbox {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    font-size: 0.75rem;
    background-color: $primary-color-5;
    overflow-y: auto;
    overflow-x: hidden;

    .assignment-label-dropbox__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
        font-weight: bold;
        border-radius: $border-radius-sm;

        .assignment-label-dropbox__header-label {
            padding: 0.5em 0 0.5em 1em;
            border-radius: $border-radius-sm 0 0 $border-radius-sm;
            width: 100%;
            font-size: 1.2em;
            text-transform: lowercase;
            white-space: nowrap;
            filter: saturate(0.4);
        }

        .assignment-label-dropbox__header-label::first-letter {
            text-transform: uppercase;
        }

        .assignment-label-dropbox__header-counter {
            background-color: $accent-color-green-2;
            padding: 0.5em 1em;
            border-radius: 0 $border-radius-md $border-radius-md 0;
            color: $accent-color-green-1;
            font-weight: 500;
            align-content: center;
            height: 100%;
            filter: saturate(0.4);
            white-space: nowrap;
        }
    }

    .assignment-label-dropbox__body-tasks {
        display: flex;
        flex-direction: column;
        height: 25em;
        width: 15em;
        border-radius: $border-radius-sm;
        padding: 1em;
        gap: 1em;

        .assignment-label-dropbox__body-task {
            background-color: $primary-color-4;
            border: 1px solid $primary-color-2;
            padding: 0.5em;
            border-radius: $border-radius-md;
            pointer-events: all;

            .assignment-label-dropbox__body-task--title {
                font-weight: bold;
                margin-bottom: 0.3em;
            }

            .assignment-label-dropbox__body-task--title:hover {
                text-decoration: underline;
                cursor: pointer;
            }

            .assignment-label-dropbox__body-task--project {
                font-size: 1em;
                font-weight: 300;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .assignment-label-dropbox__body-task:hover {
                background-color: $primary-color-3;
            }
        }
    }
}


</style>
