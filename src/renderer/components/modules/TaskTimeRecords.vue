<template lang="html">
    <div class="task-time-records task-time-record-table">
        <div
            v-for="record in timeRecords"
            :key="record.id"
            class="task-time-record-table__item"
            @click.right="onOpenContextMenu($event, record)"
        >
            <router-link
                v-if="showProjectInfo"
                :to="{name: 'task-detail', params: {
                        projectId: trackingStore.getProjectFromTimeRecord(record)?.id,
                        taskId: trackingStore.getTaskIdFromTimeRecord(record)
                    }}"
                class="task-time-record-table__item-header link"
            >
                <div class="task-time-record-table__item-header-project">
                    {{ trackingStore.getProjectFromTimeRecord(record)?.name }}
                </div>
                <div class="task-time-record-table__item-header-task">
                    ({{ trackingStore.getTaskIdFromTimeRecord(record) }})
                </div>
            </router-link>
            <div class="task-time-record-table__item-body">
                <div class="task-time-record-table__item-body-user">
                    <UserThumbnail
                        :user="record.user"
                        class="task-time-record-table__item-body-user-thumbnail"
                    />
                    <InlineEditDropdownField
                        :list="projectUsers.map(user => ({
                                optionValue: user.id,
                                optionName: user.name
                            }))"
                        :value="record.user.id"
                        class="task-time-record-table__item-body-user-name"
                        @save="async (v)=>{
                            const user = projectUsers.find(user => user.id == v) ?? userStore.users[0];
                            record.created_by_id = user.id;
                            await trackingStore.submitTimeRecordUpdate(record);
                        }"
                    />
                </div>
                <InlineEditDropdownField
                    :list="labelStore.jobTypes.map(jobType => ({
                                optionValue: jobType.id,
                                optionName: jobType.name
                        }))"
                    :offset="7"
                    :value="record.job_type_id"
                    class="task-time-record-table__item-body-jobtype"
                    @save="async (v)=>{
                            record.job_type_id = v;
                            record.job_type = labelStore.jobTypes.find(jobType => jobType.id === v);
                            await trackingStore.submitTimeRecordUpdate(record);
                        }"
                />
                <InlineEditDateField
                    :value="record.record_date.date_object"
                    class="task-time-record-table__item-body-date"
                    @save="async (v)=>{
                            record.record_date.date_object = v;
                            await trackingStore.submitTimeRecordUpdate(record);
                        }"
                />
                <InlineEditAreaField
                    :value="record.summary"
                    class="task-time-record-table__item-body-summary"
                    @save="async (v)=>{
                        record.summary = v;
                        await trackingStore.submitTimeRecordUpdate(record);
                    }"
                />
                <Button
                    :class="{
                                'task-time-record-table__item-body-billable-active': record.billable_status === BillableStatus.BILLABLE,
                                'task-time-record-table__item-body-billable' : true
                            }"
                    class="icon no-border no-bg"
                    title="Abrechnungsfähig"
                    @click="async ()=>{
                                record.billable_status = (record.billable_status === BillableStatus.BILLABLE) ? BillableStatus.UNBILLABLE : BillableStatus.BILLABLE;
                                await trackingStore.submitTimeRecordUpdate(record);
                            }"
                >
                    <Icon alt="Billable Icon" iconName="dollarCircle"/>
                </Button>
                <InlineEditTextField
                    :value="record.value.toString()"
                    class="task-time-record-table__item-body-value"
                    @save="async (v)=>{
                            record.value = v;
                            await trackingStore.submitTimeRecordUpdate(record);
                    }"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import UserThumbnail from '@/components/modules/UserThumbnail.vue';
import {onMounted, ref, watch} from 'vue';
import {BillableStatus} from '@share/interfaces/activecollab/enums';
import Icon from '@/components/core/Icon.vue';
import Button from '@/components/core/Button.vue';
import type {TimeRecord} from '@share/interfaces/activecollab/timeRecord';
import {useContextMenuStore} from '@/stores/contextMenuStore';
import InlineEditTextField from '@/components/core/InlineEditTextField.vue';
import InlineEditDropdownField from '@/components/core/InlineEditDropdownField.vue';
import InlineEditDateField from '@/components/core/InlineEditDateField.vue';
import type {Task} from '@share/interfaces/activecollab/task';
import {useTrackingStore} from '@/stores/trackingStore';
import {useLabelStore} from '@/stores/labelStore';
import {useModalStore} from '@/stores/modalStore';
import {useUserStore} from '@/stores/userStore';
import type {User} from '@share/interfaces/activecollab/user';
import InlineEditAreaField from '@/components/core/InlineEditAreaField.vue';

const props = defineProps({
    task: {
        type: Object as () => Task,
        required: false,
        default: null,
    },
    timeRecords: {
        type: Array as () => TimeRecord[],
        required: false,
        default: () => [],
    },
    showProjectInfo: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const contextMenuStore = useContextMenuStore();
const trackingStore = useTrackingStore();
const labelStore = useLabelStore();
const modalStore = useModalStore();
const userStore = useUserStore();

const task = ref<Task | null>(null);
const timeRecords = ref<TimeRecord[]>([]);
const projectUsers = ref<User[]>(userStore.users);

watch(() => props.task, async (newTask) => {
    await loadWithTask(newTask);
});

watch(() => props.timeRecords, async (newTimeRecords) => {
    await loadWithTimeRecords(newTimeRecords);
});

const onDeleteTimeRecord = async (record: TimeRecord) => {
    modalStore.openConfirmModal(
        'Sicher, dass du den Zeiteintrag löschen möchtest?',
        async () => {
            const success = await trackingStore.submitTimeRecordDelete(record);
            if (success) {
                timeRecords.value = timeRecords.value.filter(r => r.id !== record.id);
            } else {
                console.error('Error deleting time record');
            }
        });
};

const onOpenContextMenu = (event: MouseEvent, record: TimeRecord) => {
    contextMenuStore.openMenu(
        event,
        [
            {
                label: 'Delete',
                cb: () => onDeleteTimeRecord(record),
            },
        ],
    );
};

const loadWithTask = async (newTask: Task) => {
    task.value = newTask;
    timeRecords.value = await trackingStore.fetchTimeRecords(task.value.project_id, task.value.task_id);
};

const loadWithTimeRecords = async (newTimeRecords: TimeRecord[]) => {
    timeRecords.value = newTimeRecords;
};

onMounted(async () => {
    // You can use either props.task or props.timeRecords. But one of them must be provided
    if (props.task) {
        await loadWithTask(props.task);
    } else if (props.timeRecords) {
        await loadWithTimeRecords(props.timeRecords);
    }
});
</script>

<style lang="scss">
@use '@/styles/variables' as *;

.task-time-record-table {
    display: flex;
    flex-direction: column;
    font-size: 0.85rem;
    gap: 0.5em;
    overflow: auto;
    max-height: 20rem;
    width: 100%;

    .task-time-record-table__item {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        min-width: fit-content;
        width: 100%;

        .task-time-record-table__item-header {
            display: flex;
            gap: 0.5em;
            font-weight: 500;
            font-size: 0.9em;
            padding-bottom: 0.25em;
        }

        .task-time-record-table__item-header.link {
            color: $primary-color-0;
        }

        .task-time-record-table__item-header.link:hover {
            cursor: pointer;
            color: $text-color;
        }

        .task-time-record-table__item-body {
            display: flex;
            gap: 0.5em;
            flex-wrap: nowrap;
            align-items: center;
            border-radius: $border-radius-sm;
            padding: 0.25em;
            text-align: center;

            .task-time-record-table__item-body-user {
                font-weight: 500;
                white-space: nowrap;
                display: flex;
                gap: 0.5em;
                align-items: center;

                .task-time-record-table__item-body-user-thumbnail {
                    width: 2em;
                    height: 2em;
                }

                .task-time-record-table__item-body-user-name {
                    width: 6.5em;
                    min-width: 6.5em;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }

            .task-time-record-table__item-body-jobtype {
                width: 8em;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .task-time-record-table__item-body-summary {
                overflow: visible;
                white-space: wrap;
                text-overflow: unset;
                text-align: left;
                min-width: 10em;
                width: 100%;
            }

            .task-time-record-table__item-body-date {
                min-width: fit-content;
                width: 6em;
            }

            .task-time-record-table__item-body-billable {
                min-width: 2em;
                width: 2em;
            }

            .task-time-record-table__item-body-billable :deep(svg) {
                width: 2em;
                height: 2em;
            }

            .task-time-record-table__item-body-billable-active svg {
                fill: $accent-color-green-1 !important;
            }

            .task-time-record-table__item-body-value-time {
                display: flex;
                gap: 0.1em;
                justify-content: center;
                text-align: left;
            }

            .task-time-record-table__item-body-value {
                min-width: 4em;
                font-size: 1.1em;
                width: 4em;
                text-align: center;
            }
        }

        .task-time-record-table__item-body:hover {
            background-color: $primary-color-6;
            cursor: pointer;
        }
    }
}
</style>
