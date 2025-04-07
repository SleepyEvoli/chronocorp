<template lang="html">
    <section v-if="task" class="view-task-detail">
        <div class="view-task-detail__main">
            <Box>
                <div class="view-task-detail__main-header">
                    <div class="view-task-detail__header-labels">
                        <InlineEditDropdownField
                            :list="labelStore.assignmentLabels.map((label)=>{
                                return {
                                    optionValue: label.id,
                                    optionName: label.name,
                                };
                            })"
                            :outline-color="labelStore.getAssignmentLabelById(task.label ? task.label.id : '0' )?.bg_color"
                            :value="task.label_id"
                            @save="(v)=>{
                                let tmpTask = task;
                                if (tmpTask) {
                                    tmpTask.label_id = v;
                                    onSubmitEditTask(tmpTask);
                                }
                            }"
                        />
                        <InlineEditDropdownField
                            :list="labelStore.priorityList.map((priority)=>{
                                    return {
                                        optionValue: priority,
                                        optionName: labelStore.getPriorityName(priority),
                                    };
                                })"
                            :outline-color="labelStore.getPriorityColor(task.priority)"
                            :value="task.priority"
                            color="#FFF"
                            @save="(v)=>{
                                    let tmpTask = task;
                                    if (tmpTask) {
                                        tmpTask.priority = v;
                                        taskStore.submitTaskUpdate(tmpTask);
                                    }
                                }"
                        />
                        <InlineEditDropdownField
                            :list="labelStore.visibilityList.map((visibility)=>{
                                return {
                                    optionValue: visibility,
                                    optionName: labelStore.getVisibilityName(visibility),
                                };
                            })"
                            :outline-color="labelStore.getVisibilityColor(task.visibility)"
                            :value="task.visibility"
                            class="view-task-detail__header-label"
                            color="#FFF"
                            @save="(v)=>{
                                let tmpTask = task;
                                if (tmpTask) {
                                    tmpTask.visibility = v;
                                    taskStore.submitTaskUpdate(tmpTask);
                                }
                            }"
                        />
                    </div>
                    <div class="view-task-detail__header-actions">
                        <a
                            :href="`https://ac.intercorp.de/public/index.php?path_info=projects/${task.project_id}/tasks/${task.task_id}`"
                            rel="noopener noreferrer"
                            target="_blank"
                            title="Task in ActiveCollab öffnen"
                        >
                            <Button class="view-task-detail__header-action secondary">
                                AC
                            </Button>
                        </a>
                        <a
                            :href="`https://vc.intercorp.de/${task.project ? task.project.slug : task.project_id}/${task.task_id}`"
                            rel="noopener noreferrer"
                            target="_blank"
                            title="Eine Jitsi Session starten"
                        >
                            <Button class="view-task-detail__header-action secondary">
                                Jitsi
                            </Button>
                        </a>
                        <Button
                            class="view-task-detail__header-action secondary"
                            title="Lazy Tracking hinzufügen"
                            @click="showLazyTrackingCreator = !showLazyTrackingCreator"
                        >
                            <Icon
                                icon-name="rocket"
                            />
                        </Button>
                        <Button
                            :toggle="trackingStore.pinnedTasks.map((t)=>t.id).includes(task.id)"
                            class="icon view-task-detail__header-action secondary"
                            title="Task pinnen"
                        >
                            <Icon icon-name="pin" @click="trackingStore.addPinnedTask(task)"/>
                        </Button>
                        <Button
                            :toggle="showNotes"
                            class="icon view-task-detail__header-action secondary"
                            title="Notizen"
                            @click="showNotes = !showNotes"
                        >
                            <Icon icon-name="featherPaper"/>
                        </Button>
                    </div>
                </div>
                <div>
                    <div class="view-task-detail__main-body">
                        <InlineEditTextField
                            :value="task.name"
                            class="view-task-detail__main-body-title"
                            @save="(v)=>{
                                    let tmpTask = task;
                                    if (tmpTask) {
                                        tmpTask.name = v;
                                        taskStore.submitTaskUpdate(tmpTask);
                                    }
                                }"
                        />
                        <div class="view-task-detail__main-body-content">
                            <InlineEditAreaField
                                :id="`task-detail-content-edit-${task.id}`"
                                :formatHtml="true"
                                :rich-text="true"
                                :value="task.body"
                                @save="(v)=>{
                                    console.log(v)
                                    let tmpTask = task;
                                    if (tmpTask) {
                                        tmpTask.body = v;
                                        taskStore.submitTaskUpdate(tmpTask);
                                    }
                                }"
                            />
                        </div>
                        <div v-if="task.attachments_count >= 0" class="view-task-detail__main-body-attachments">
                            <div class="view-task-detail__main-body-attachments-list">
                                <template v-for="attachment in attachments" :key="attachment.id">
                                    <AttachmentItem :attachment="attachment"/>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
                <SubtaskList
                    v-if="task.total_subtasks >= 0"
                    :project-id="task.project_id"
                    :task-id="task.task_id"
                    class="view-task-detail__main-body-subtasks"
                />
                <div class="view-task-detail__main-footer">
                    <div class="view-task-detail__footer-meta">
                        <div>Erstellt am:</div>
                        <div>
                            <InlineEditDateField
                                :value="task.created_on.date_object"
                                @save="(v)=>{
                                    let tmpTask = task;
                                    if (tmpTask) {
                                        tmpTask.created_on.date_object = v;
                                        taskStore.submitTaskUpdate(tmpTask);
                                    }
                                }"
                            />
                        </div>
                        <div>Erstellt von:</div>
                        <div>{{ task.created_by.name }}</div>
                        <div>Aktualisiert von:</div>
                        <div>{{ task.updated_by ? task.updated_by.name : '-' }}</div>
                        <div>Aktualisiert am:</div>
                        <div>{{ task.updated_on ? task.updated_on.formatted : '-' }}</div>
                        <div>Sichtbarkeit:</div>
                        <div>{{ labelStore.getVisibilityName(task.visibility) }}</div>
                        <div>Status:</div>
                        <div>{{ task ? labelStore.getStateName(task.state) : '' }}</div>

                    </div>
                    <div class="view-task-detail__footer-actions">
                        <Button
                            class="icon view-task-detail__footer-action secondary"
                            title="Task löschen"
                            @click="onDeleteTask"
                        >
                            <Icon icon-name="trash"/>
                        </Button>
                        <Button
                            v-if="!task.is_completed"
                            class="icon view-task-detail__footer-action secondary"
                            title="Task abschließen"
                            @click="onCompleteTask"
                        >
                            <Icon icon-name="check"/>
                        </Button>
                        <Button
                            v-else-if="task.is_completed"
                            class="icon view-task-detail__footer-action secondary"
                            title="Task wieder öffnen"
                            @click="onReopenTask"
                        >
                            <Icon icon-name="reopen"/>
                        </Button>
                    </div>
                </div>
            </Box>
        </div>
        <div class="view-task-detail__secondary">
            <Box v-if="showNotes" class="view-task-detail__notes">
                <div class="view-task-detail__notes-heading">
                    Notizen
                </div>
                <TextArea
                    :value="taskNote?.content || ''"
                    class="view-task-detail__notes-input"
                    @input="taskStore.setTaskNote(task.id, $event.target.value)"
                />
            </Box>
            <Box>
                <div class="view-task-detail__secondary-assignment-estimate">
                    <div class="view-task-detail__secondary-assignment">
                        <div v-if="task.assignee" class="view-task-detail__secondary-assignment-assignee">
                            <div class="view-task-detail__secondary-assignment-assignee-thumbnail">
                                <UserThumbnail :user="task.assignee"/>
                            </div>
                            <div class="view-task-detail__secondary-assignment-assignee-name">
                                {{ task.assignee.name }}
                            </div>
                        </div>
                        <AssigneeSelection
                            :task="task"
                        />
                    </div>
                    <div class="view-task-detail__secondary-progress">
                        <ProgressBarCircle
                            :percentage="task.estimate ? Math.floor((task.object_time / task.estimate.value)*100) : 0"
                            class="view-task-detail__secondary-estimate"
                        >
                            <template #subtitle>
                                <div class="progress-bar-circle__title-subtitle">
                                    <div
                                        class="progress-bar-circle__title-subtitle-value"
                                    >{{ `${task.object_time}` }}
                                    </div>
                                    <div>-</div>
                                    <InlineEditTextField
                                        :value="task.estimate?.value.toString() + 'h' || '0'"
                                        class="progress-bar-circle__title-subtitle-estimate"
                                        @save="(v)=>{
                                        let tmpTask = task;
                                        if (tmpTask) {
                                            if (!tmpTask.estimate) {
                                                tmpTask.estimate = {
                                                    value: parseFloat(v),
                                                    job_type_id: taskStore.defaultJobTypeId,
                                                    job_type_name: labelStore.getJobTypeById(taskStore.defaultJobTypeId)?.name || 'Allgemeine Konzeption',
                                                    comment: ''
                                                };
                                            } else {
                                                tmpTask.estimate.value = parseFloat(v);
                                            }
                                            taskStore.submitTaskUpdate(tmpTask);
                                        }
                                    }"
                                    />
                                </div>
                            </template>
                        </ProgressBarCircle>
                        <div class="view-task-detail__secondary-progress-date-due">
                            <div>Zeit bis:</div>
                            <InlineEditDateField
                                :value="task.due_on?.date_object"
                                @save="(v)=>{
                                    let tmpTask = task;
                                    if (tmpTask) {
                                        if (!tmpTask.due_on) {
                                            tmpTask.due_on = {
                                                date_object: v
                                            };
                                        } else {
                                            tmpTask.due_on.date_object = v;
                                        }
                                        taskStore.submitTaskUpdate(tmpTask);
                                    }
                                }"
                            />
                        </div>
                    </div>
                </div>
            </Box>
            <Box>
                <div class="view-task-detail__secondary-time-records">
                    <TaskTimeRecordCreator
                        :task="task"
                        @submit="async ()=>{
                            if (task) {
                                timeRecords = await trackingStore.fetchTimeRecords(task.project_id, task.task_id);
                            }
                        }"
                    />
                    <TaskTimeRecords
                        :time-records="timeRecords"
                    />
                </div>
            </Box>
            <Box>
                <CommentInput
                    :project-id="projectId"
                    :task-id="taskId"
                    @submit="async ()=>{
                        if (task) {
                            comments = await taskStore.fetchComments(task.project_id, task.task_id);
                        }
                    }"
                />
            </Box>
            <Box>
                <CommentList
                    :comments="comments"
                    :project-id="projectId"
                    :task-id="taskId"
                    @change="async ()=>{
                        if (task) {
                            comments = await taskStore.fetchComments(task.project_id, task.task_id);
                        }
                    }"
                />
            </Box>
        </div>
        <BoxFocus
            v-if="showLazyTrackingCreator"
            :is-closeable="true"
            class="lazy-tracking-creator"
            @close="showLazyTrackingCreator = !showLazyTrackingCreator"
        >
            <LazyTrackingCreator
                :task="task"
                @close="showLazyTrackingCreator = !showLazyTrackingCreator"
            />
        </BoxFocus>
    </section>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue';
import Box from '@/components/core/Box.vue';
import Icon from '@/components/core/Icon.vue';
import Button from '@/components/core/Button.vue';
import UserThumbnail from '@/components/modules/UserThumbnail.vue';
import type {Task} from '@share/interfaces/activecollab/task';
import type {Attachment as UserAttachment} from '@share/interfaces/activecollab/attachment';
import AssigneeSelection from '@/components/modules/AssigneeSelection.vue';
import SubtaskList from '@/components/modules/SubtaskList.vue';
import AttachmentItem from '@/components/core/AttachmentItem.vue';
import {useTrackingStore} from '@/stores/trackingStore';
import {useRouter} from 'vue-router';
import {useModalStore} from '@/stores/modalStore';
import {useLabelStore} from '@/stores/labelStore';
import ProgressBarCircle from '@/components/core/ProgressBarCircle.vue';
import BoxFocus from '@/components/core/BoxFocus.vue';
import {useTaskStore} from '@/stores/taskStore';
import {useProjectStore} from '@/stores/projectStore';
import {useAttachmentStore} from '@/stores/attachmentStore';
import TaskTimeRecordCreator from '@/components/modules/TaskTimeRecordCreator.vue';
import LazyTrackingCreator from '@/components/modules/LazyTrackingCreator.vue';
import TaskTimeRecords from '@/components/modules/TaskTimeRecords.vue';
import InlineEditDropdownField from '@/components/core/InlineEditDropdownField.vue';
import InlineEditTextField from '@/components/core/InlineEditTextField.vue';
import type {TimeRecord} from '@share/interfaces/activecollab/timeRecord';
import TextArea from '@/components/core/TextArea.vue';
import type {TaskNote} from '@/interfaces';
import CommentInput from '@/components/modules/CommentInput.vue';
import CommentList from '@/components/modules/CommentList.vue';
import type {Comment} from '@share/interfaces/activecollab/comment';
import InlineEditDateField from '@/components/core/InlineEditDateField.vue';
import InlineEditAreaField from '@/components/core/InlineEditAreaField.vue';

const props = defineProps({
    taskId: {
        type: String,
        required: true,
    },
    projectId: {
        type: String,
        required: true,
    },
});

const router = useRouter();
const modalStore = useModalStore();
const trackingStore = useTrackingStore();
const labelStore = useLabelStore();
const taskStore = useTaskStore();
const projectStore = useProjectStore();
const attachmentStore = useAttachmentStore();

const task = ref<Task | null>();
const attachments = ref<UserAttachment[]>([]);
const timeRecords = ref<TimeRecord[]>([]);
const comments = ref<Comment[]>([]);

const showLazyTrackingCreator = ref<boolean>(false);
const showNotes = ref<boolean>(false);
const taskNote = ref<TaskNote>();

watch(() => props.taskId, async (newVal) => {
        await reload(props.projectId, newVal);
    },
);

const reload = async (projectId: string, taskId: string) => {
    task.value = await taskStore.fetchTaskById(projectId, taskId);
    timeRecords.value = [];
    attachments.value = [];
    comments.value = [];

    if (task.value) {
        attachments.value = await attachmentStore.fetchTaskAttachments(task.value.project_id, task.value.task_id);
        timeRecords.value = await trackingStore.fetchTimeRecords(task.value.project_id, task.value.task_id);
        taskNote.value = taskStore.getTaskNote(task.value.id);

        if (taskNote.value && taskNote.value.content !== '') {
            showNotes.value = true;
        }

        comments.value = await taskStore.fetchComments(projectId, taskId);
    }
};

const onCompleteTask = (): void => {
    modalStore.openConfirmModal('Sicher, dass du den Task abschließen willst?', async () => {
        if (task.value) {
            await taskStore.submitTaskComplete(task.value.project_id, task.value.task_id);
            await reload(task.value.project_id, task.value.task_id);
        }
    });
};

const onReopenTask = (): void => {
    modalStore.openConfirmModal('Sicher, dass du den Task wieder öffnen möchtest?', async () => {
        if (task.value) {
            await taskStore.submitTaskReopen(task.value.project_id, task.value.task_id);
            await reload(task.value.project_id, task.value.task_id);
        }
    });
};

const onDeleteTask = (): void => {
    modalStore.openConfirmModal('Sicher, dass du den Task löschen möchtest?', async () => {
        if (task.value) {
            const success = await taskStore.submitTaskDelete(task.value.project_id, task.value.task_id);
            if (success) {
                await router.push('/');
            }
        }
    });
};

const onSubmitEditTask = async (task: Task): Promise<void> => {
    const res = await taskStore.submitTaskUpdate(task);
    if (res) {
        await reload(props.projectId, task.task_id);
    }
};

onMounted(async () => {
    await reload(props.projectId, props.taskId);
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.view-task-detail {
    display: grid;
    gap: 1em;
    grid-template-columns: 1fr 1fr;

    .view-task-detail__notes {
        display: flex;
        flex-direction: column;
        gap: 1em;

        .view-task-detail__notes-heading {
            font-size: 1.5em;
            font-weight: 600;
            padding-bottom: 1rem;
        }

        .view-task-detail__notes-input {
            height: 20em;
        }
    }

    .view-task-detail__main-header {
        align-items: center;
        display: flex;
        justify-content: space-between;
        padding-bottom: .5em;

        .view-task-detail__header-labels {
            display: flex;
            gap: .5em;
            align-items: center;
            font-size: .7em;
        }

        .view-task-detail__header-actions {
            display: flex;
            gap: .75em;
            height: 2em;
            align-items: center;

            .view-task-detail__header-action {
                font-weight: 600;
                font-size: .75em;
                min-width: 2em;
                min-height: 2em;
                width: 2em;
                height: 2em;
            }
        }
    }

    .view-task-detail__main {
        display: grid;
        gap: .5em;
        width: 100%;
        overflow-y: auto;
        max-height: 90vh;

        @media (max-width: $breakpoint-tablet) {
            grid-template-columns: 1fr;
        }

        .view-task-detail__main-body {
            display: flex;
            flex-direction: column;
            gap: 1em;

            .view-task-detail__main-body-title {
                background-color: $primary-color-3;
                border-left: 2px solid #FFFFFF;
                color: #FFFFFF;
                font-size: 1.5em;
                padding: 1em;
                white-space: normal;
            }

            .view-task-detail__main-body-content {
                font-size: .9em;

                :deep(.inline-edit-rich-text-field__display) {
                    background-color: unset;
                }

                img {
                    max-height: 512px;
                    max-width: 100%;
                }
            }

            .view-task-detail__main-body-attachments {
                color: $primary-color-0;
                display: flex;
                flex-direction: column;
                font-size: .75em;
                gap: .25em;

                .view-task-detail__main-body-attachments-list {
                    display: flex;
                    flex-direction: column;
                    gap: .25em;
                }
            }
        }

        .view-task-detail__main-body-subtasks {
            margin-top: 1em;
        }
    }

    .view-task-detail__main-footer {
        color: $primary-color-0;
        display: flex;
        justify-content: space-between;
        margin-top: 1em;
        padding: 1em;

        .view-task-detail__footer-meta {
            display: grid;
            font-size: .75em;
            gap: .5em;
            grid-template-columns: 2fr 1fr;
        }

        .view-task-detail__footer-actions {
            align-items: flex-end;
            display: flex;
            gap: .5em;

            .view-task-detail__footer-action {
                height: 1.75em;
                width: 1.75em;
            }
        }
    }

    .view-task-detail__secondary {
        display: flex;
        flex-direction: column;
        max-height: 90vh;
        position: relative;
        gap: 1em;
        width: 100%;
        overflow-y: auto;

        .view-task-detail__secondary-assignment-estimate {
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: center;
        }

        .view-task-detail__secondary-estimate {
            justify-self: end;
            align-self: flex-start;

            .progress-bar-circle__title-subtitle {
                display: flex;
                flex-direction: column;
                text-align: center;

                .progress-bar-circle__title-subtitle-value {
                    font-weight: bold;
                }

                .progress-bar-circle__title-subtitle-estimate {
                    text-align: center;
                    width: 100%;
                    font-weight: bold;
                }
            }
        }

        .view-task-detail__secondary-assignment {
            display: flex;
            flex-direction: column;
            gap: .5em;

            .view-task-detail__secondary-assignment-assignee {
                display: flex;
                flex-direction: column;
                gap: .25em;

                .view-task-detail__secondary-assignment-assignee-name {
                    font-size: .75em;
                }

                .view-task-detail__secondary-assignment-assignee-thumbnail {
                    height: 3em;
                    width: 3em;
                }
            }
        }

        .view-task-detail__secondary-progress {
            display: flex;
            flex-direction: column;
            justify-self: end;
            gap: 1em;
            align-self: flex-start;

            .view-task-detail__secondary-progress-date-due {
                gap: 1em;
                display: flex;
                align-items: center;
                align-self: center;
                text-align: center;
            }
        }

        .view-task-detail__secondary-time-records {
            display: flex;
            flex-direction: column;
            gap: .5em;
        }
    }
}

</style>
