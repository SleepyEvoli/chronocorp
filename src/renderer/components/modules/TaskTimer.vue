<template lang="html">
    <div
        class="task-timer"
        @dragover="(e)=>e.preventDefault()"
        @drop="onDrop"
    >
        <div class="task-timer-body">
            <div
                v-if="trackingStore.focusedTracking"
                :class="{
                        'task-timer-body__display': true,
                        'is-running': timerStore.running}"
            >
                <div class="task-timer-body__display-task-time">
                    <InlineEditTime
                        :isHour="true"
                        :value="trackingStore.focusedTracking.time.hours"
                        class="task-timer-body__display-task-time-hour"
                        @save="(v)=>{
                                if  (trackingStore.focusedTracking) {
                                    trackingStore.focusedTracking.time.hours = v;
                                }
                            }"
                    />
                    <span>:</span>
                    <InlineEditTime
                        :isMinute="true"
                        :value="trackingStore.focusedTracking.time.minutes"
                        class="task-timer-body__display-task-time-minute"
                        @save="(v)=>{
                                if  (trackingStore.focusedTracking) {
                                    trackingStore.focusedTracking.time.minutes = v;
                                }
                            }"
                    />
                </div>
                <div class="task-timer-body__display-actions">
                    <Button
                        class="icon no-border task-timer-body__display-action no-bg"
                        style="transform: rotate(180deg)"
                        title="Reduziere Zeit"
                        @click="timerStore.addTime(-5)"
                    >
                        <Icon icon-name="forward"/>
                    </Button>
                    <Button
                        v-if="timerStore.running"
                        class="icon no-border task-timer-body__display-action no-bg"
                        title="Stop"
                        @click="timerStore.stopTimer"
                    >
                        <Icon icon-name="pause"/>
                    </Button>
                    <Button
                        v-else
                        class="icon no-border task-timer-body__display-action no-bg"
                        title="Start"
                        @click="timerStore.startTimer"
                    >
                        <Icon icon-name="play"/>
                    </Button>
                    <Button
                        class="icon no-border task-timer-body__display-action no-bg"
                        title="Erhöhe Zeit"
                        @click="()=>timerStore.addTime(5)"
                    >
                        <Icon icon-name="forward"/>
                    </Button>
                </div>
            </div>
            <div class="task-timer-body__info">
                <div class="task-timer-body__info-task">
                    {{
                        trackingStore.focusedTracking ? trackingStore.focusedTracking.task.name : `No task selected`
                    }}
                </div>
                <div class="task-timer-body__info-project">
                    {{
                        trackingStore.focusedTracking ?
                            trackingStore.focusedTracking.task.project?.name
                            : 'No project defined'
                    }}
                </div>
            </div>
            <div class="task-timer-body__actions">
                <Button
                    class="icon no-border task-timer-body__action no-bg"
                    title="Zum Task"
                    @click="async ()=>{
                            await forwardToAsk();
                        }"
                >
                    <Icon icon-name="openNew"/>
                </Button>
            </div>
        </div>
        <div class="task-timer__actions">
            <Button
                class="icon task-timer__action no-bg"
                title="Sende Zeiteintrag"
                @click="onSubmit"
            >
                <Icon icon-name="check"/>
            </Button>
            <Button
                class="icon task-timer__action no-bg"
                title="Kommentare"
                @click="()=>commentBoxVisible = !commentBoxVisible"
            >
                <Icon icon-name="comment"/>
            </Button>
            <Button
                class="icon task-timer__action no-bg"
                title="Zeiteinträge"
                @click="()=>timeRecordTableVisible = !timeRecordTableVisible"
            >
                <Icon icon-name="clockHistory"/>
            </Button>
            <Button
                class="icon task-timer__action no-bg"
                title="Subtasks"
                @click="()=>subtasksVisible = !subtasksVisible"
            >
                <Icon icon-name="projectManager"/>
            </Button>
        </div>
        <BoxContainerDraggable
            v-if="trackingStore.focusedTracking && commentBoxVisible"
            class="task-timer__draggable"
            @close="commentBoxVisible = false"
        >
            <Box>
                <CommentInput
                    :projectId="trackingStore.focusedTracking.task.project_id"
                    :taskId="trackingStore.focusedTracking.task.task_id"
                    @submit="async ()=>{
                        if (trackingStore.focusedTracking) {
                            comments = await taskStore.fetchComments(trackingStore.focusedTracking.task.project_id, trackingStore.focusedTracking.task.task_id);
                        }
                    }"
                />
                <CommentList
                    :comments="comments"
                    :projectId="trackingStore.focusedTracking.task.project_id"
                    :taskId="trackingStore.focusedTracking.task.task_id"
                    @change="async ()=>{
                        if (trackingStore.focusedTracking) {
                            comments = await taskStore.fetchComments(trackingStore.focusedTracking.task.project_id, trackingStore.focusedTracking.task.task_id);
                        }
                    }"
                />
            </Box>
        </BoxContainerDraggable>
        <BoxContainerDraggable
            v-if="trackingStore.focusedTracking && timeRecordTableVisible"
            class="task-timer__draggable"
            @close="timeRecordTableVisible = false"
        >
            <Box>
                <TaskTimeRecordCreator :task="trackingStore.focusedTracking.task"/>
                <TaskTimeRecords :task="trackingStore.focusedTracking.task"/>
            </Box>
        </BoxContainerDraggable>
        <BoxContainerDraggable
            v-if="trackingStore.focusedTracking && subtasksVisible"
            class="task-timer__draggable"
            @close="subtasksVisible = false"
        >
            <Box>
                <SubtaskList
                    :project-id="trackingStore.focusedTracking.task.project_id"
                    :task-id="trackingStore.focusedTracking.task.task_id"
                />
            </Box>
        </BoxContainerDraggable>
    </div>
</template>

<script lang="ts" setup>
import Button from '@/components/core/Button.vue';
import Icon from '@/components/core/Icon.vue';
import {useTrackingStore} from '@/stores/trackingStore';
import {onMounted, ref, watch} from 'vue';
import type {Tracking} from '@/interfaces';
import {DragType} from '@/interfaces';
import type {Task} from '@share/interfaces/activecollab/task';
import BoxContainerDraggable from '@/components/core/BoxContainerDraggable.vue';
import Box from '@/components/core/Box.vue';
import {useTimerStore} from '@/stores/timerStore';
import TaskTimeRecords from '@/components/modules/TaskTimeRecords.vue';
import {useDragStore} from '@/stores/dragStore';
import TaskTimeRecordCreator from '@/components/modules/TaskTimeRecordCreator.vue';
import InlineEditTime from '@/components/core/InlineEditTime.vue';
import SubtaskList from '@/components/modules/SubtaskList.vue';
import router from '@/router/router';
import CommentList from '@/components/modules/CommentList.vue';
import CommentInput from '@/components/modules/CommentInput.vue';
import type {Comment} from '@share/interfaces/activecollab/comment';
import {useTaskStore} from '@/stores/taskStore';

const trackingStore = useTrackingStore();
const timerStore = useTimerStore();
const dragStore = useDragStore();
const taskStore = useTaskStore();

const commentBoxVisible = ref(false);
const timeRecordTableVisible = ref(false);
const subtasksVisible = ref(false);

const comments = ref<Comment[]>([]);

watch(() => trackingStore.focusedTracking, async () => {
    if (trackingStore.focusedTracking) {
        comments.value = await taskStore.fetchComments(trackingStore.focusedTracking.task.project_id, trackingStore.focusedTracking.task.task_id);
    }
});

const onDrop = () => {
    const dragType = dragStore.lastDragType;
    if (dragType === DragType.TASK) {
        if (dragStore.currentDraggedObject) {
            const lastDraggedTask = dragStore.currentDraggedObject as Task;
            const tracking = trackingStore.createTracking(lastDraggedTask);
            if (tracking) {
                trackingStore.addTracking(tracking);
                trackingStore.focusedTracking = tracking;
            }
        }
    } else if (dragType === DragType.TRACKING) {
        if (dragStore.currentDraggedObject) {
            trackingStore.focusedTracking = dragStore.currentDraggedObject as Tracking;
            timerStore.startTimer();
        }
    }
    const timerEl = document.querySelector('.task-timer');
    timerEl?.classList.remove('drag-over');
};

const onSubmit = async () => {
    if (trackingStore.focusedTracking) {
        await trackingStore.submitTimeRecord(trackingStore.focusedTracking.id);
        trackingStore.focusedTracking = null;
    }
};

const forwardToAsk = async () => {
    trackingStore.focusedTracking && await router.push({
        name: 'task-detail',
        params: {
            taskId: trackingStore.focusedTracking.task.task_id,
            projectId: trackingStore.focusedTracking.task.project_id,
        },
    });
};

onMounted(async () => {
    const timerEl = document.querySelector('.task-timer');
    if (timerEl) {
        timerEl.addEventListener('dragover', (e) => {
            e.preventDefault();
            timerEl.classList.add('drag-over');
        });
        timerEl.addEventListener('dragleave', (e: Event) => {
            if (!timerEl.contains((e as MouseEvent).relatedTarget as Node)) {
                timerEl.classList.remove('drag-over');
            }
        });
    }
    if (trackingStore.focusedTracking) {
        comments.value = await taskStore.fetchComments(trackingStore.focusedTracking.task.project_id, trackingStore.focusedTracking.task.task_id);
    }
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.task-timer.drag-over {
    border: 2px solid $text-color;

    * {
        pointer-events: none;
    }
}

.task-timer {
    display: flex;
    flex-direction: column;
    gap: 2.5em;
    background: rgb(20, 63, 102);
    background: linear-gradient(135deg, rgba(20, 63, 102, 1) 21%, rgba(64, 178, 173, 1) 100%);
    border-radius: 1.75em;
    width: 100%;
    padding: 1.25em;
    box-shadow: 0 3px 10px 4px rgba(3, 21, 21, 0.3);

    .task-timer__draggable {
        width: 55vw;
    }

    .task-timer-body {
        display: flex;
        gap: 1em;
        justify-content: space-between;

        .task-timer-body__display {
            background-color: rgba(3, 11, 22, 0.1);
            display: flex;
            flex-direction: column;
            border: 2px solid rgba(121, 164, 195, 0.25);
            padding: 1em 3em;
            border-radius: 1.75em;
            box-shadow: 3px 4px 6.6px rgba(0, 0, 0, 0.30);
            font-family: 'Public Sans', sans-serif;

            .task-timer-body__display-task-time {
                font-size: 3em;
                color: #FFFFFF;
                display: flex;
            }

            .task-timer-body__display-task-time :deep(input) {
                color: #FFFFFF;
                background-color: transparent;
                font-weight: 500;
                text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
            }

            .task-timer-body__display-actions {
                margin-top: 1em;
                display: flex;
                gap: 0.5em;
                flex-direction: row;
                justify-content: center;
                background-color: rgba(255, 255, 255, 0.05);
                border-radius: 2em;
                padding: 0.25em 0.5em;

                .task-timer-body__display-action {
                    width: 2em;
                    height: 2em;
                }

                .task-timer-body__display-action:hover :deep(svg) {
                    fill: #FFFFFF !important;
                }

                .task-timer-body__display-action :deep(svg) {
                    fill: rgba(255, 255, 255, 0.75);
                }
            }
        }

        .task-timer-body__display.is-running {
            background: linear-gradient(184deg, rgb(70 167 107 / 30%) 0%, rgb(144 227 119 / 51%) 100%);
        }

        .task-timer-body__info {
            padding: 0.5em 1em;
            display: flex;
            flex-direction: column;
            gap: 1em;
            min-width: 15em;

            .task-timer-body__info-task {
                font-weight: 500;
                font-size: 1.25em;
                color: #FFFFFF;
                text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
            }

            .task-timer-body__info-project {
                font-weight: 500;
                color: #FFFFFF;
                text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
            }
        }

        .task-timer-body__action {
            width: 1.5em;
            height: 1.5em;
        }

        .task-timer-body__action:hover :deep(svg) {
            fill: #FFFFFF;
        }

        .task-timer-body__action :deep(svg) {
            fill: rgba(255, 255, 255, 0.75);
        }
    }

    .task-timer__actions {
        background-color: rgba(255, 255, 255, 0.1);
        display: flex;
        gap: 1em;
        justify-content: center;
        padding: 0.6em 1em;
        border-radius: 1.75em;

        .task-timer__action {
            width: 1.5em;
            height: 1.5em;
            border: 1px solid #FFFFFF;
            padding: 2em;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .task-timer__action :deep(svg) {
            fill: #FFF;
        }

        .task-timer__action:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }

        .task-timer__action:hover :deep(svg) {
            fill: #FFFFFF;
        }
    }
}

</style>
