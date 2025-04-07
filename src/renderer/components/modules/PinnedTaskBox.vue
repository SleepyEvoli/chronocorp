<template lang="html">
    <div class="pinned-box">
        <div class="pinned-box__info">
            <div
                class="pinned-box__info-task"
                @click="async () => {
                    await forwardToTaskDetail();
                }"
            >
                {{ props.task.name }}
            </div>
            <div class="pinned-box__info-project">
                {{ props.task.project ? props.task.project.name : 'Project Name Empty' }}
            </div>
        </div>
        <div class="pinned-box__actions">
            <Button
                class="pinned-box__action icon no-border no-bg"
                title="Pin entfernen"
                @click="() => trackingStore.removePinnedTask(props.task.id)"
            >
                <Icon icon-name="pinOff"/>
            </Button>
            <Button
                class="pinned-box__action icon no-border no-bg"
                title="Zeige Kommentare"
                @click="() => commentBoxVisible = !commentBoxVisible"
            >
                <Icon icon-name="comment"/>
            </Button>
        </div>
        <teleport to="main">
            <div v-if="commentBoxVisible">
                <BoxContainerDraggable
                    class="pinned-box__comments-box"
                    @close="commentBoxVisible = false"
                >
                    <Box>
                        <CommentInput
                            :projectId="props.task.project_id"
                            :taskId="props.task.task_id"
                            @submit="async () => {
                                comments = await taskStore.fetchComments(props.task.project_id, props.task.task_id);
                            }"
                        />
                        <CommentList
                            :comments="comments"
                            :projectId="props.task.project_id"
                            :taskId="props.task.task_id"
                            @change="async () => {
                                comments = await taskStore.fetchComments(props.task.project_id, props.task.task_id);
                            }"
                        />
                    </Box>
                </BoxContainerDraggable>
            </div>
        </teleport>
    </div>
</template>

<script lang="ts" setup>
import Icon from '@/components/core/Icon.vue';
import Button from '@/components/core/Button.vue';
import type {Task} from '@share/interfaces/activecollab/task';
import {useTrackingStore} from '@/stores/trackingStore';
import BoxContainerDraggable from '@/components/core/BoxContainerDraggable.vue';
import Box from '@/components/core/Box.vue';
import {onMounted, ref} from 'vue';
import router from '@/router/router';
import CommentInput from '@/components/modules/CommentInput.vue';
import CommentList from '@/components/modules/CommentList.vue';
import {useTaskStore} from '@/stores/taskStore';
import type {Comment} from '@share/interfaces/activecollab/comment';

const trackingStore = useTrackingStore();
const taskStore = useTaskStore();

const props = defineProps({
    task: {
        type: Object as () => Task,
        required: true,
    },
});

const commentBoxVisible = ref(false);
const comments = ref<Comment[]>([]);

const forwardToTaskDetail = async () => {
    await router.push({
        name: 'task-detail',
        params: {
            taskId: props.task.task_id,
            projectId: props.task.project_id,
        },
    });
};

onMounted(async () => {
    comments.value = await taskStore.fetchComments(props.task.project_id, props.task.task_id);
});

</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.pinned-box {
    padding: 0.75em;
    background-color: $primary-color-4;
    border-radius: $border-radius-md;
    display: flex;
    gap: 0.75em;
    align-items: center;
    justify-content: space-between;
    width: 17.5em;
    height: 6em;

    .pinned-box__info {
        display: flex;
        flex-direction: column;
        gap: 0.75em;
        justify-content: space-between;
        width: 90%;

        .pinned-box__info-task {
            font-size: 0.8rem;
            font-weight: 600;
            color: #FFFFFF;
            overflow: hidden;
        }

        .pinned-box__info-task:hover {
            color: $primary-color-0;
            cursor: pointer;
        }

        .pinned-box__info-project {
            font-size: 0.75rem;
            color: $primary-color-0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
        }
    }

    .pinned-box__actions {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-self: stretch;

        .pinned-box__action {
            width: 1.25em;
            height: 1.25em;
        }

        .pinned-box__action:hover :deep(svg) {
            fill: #FFFFFF;
        }

        .pinned-box__action :deep(svg) {
            fill: $primary-color-0;
        }
    }

}

.pinned-box:hover {
    background-color: $primary-color-3;
    cursor: grab;
}

.pinned-box__comments-box {
    max-width: 55vw;
}
</style>
