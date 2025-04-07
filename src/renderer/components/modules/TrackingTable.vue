<template lang="html">
    <div v-if="trackings.length > 0" class="tracking-table">
        <div class="tracking-table__header">
            <div class="tracking-table__header-date">
                {{ formatDateToTrackingTableHeading(trackings[0].recordDate) }}
            </div>
            <div class="tracking-table__header-actions">
                <Button
                    class="tracking-table__header-action icon secondary"
                    title="Sende alle Zeiteinträge von diesem Tag"
                    @click="()=>{
                        props.trackings.forEach(tracking => {
                            console.log(tracking);
                            if (tracking.keepOnSubmit) {
                                trackingStore.submitTimeRecord(tracking.id, false);
                            } else {
                                trackingStore.submitTimeRecord(tracking.id, true);
                            }
                        }
                    )}"
                >
                    <Icon icon-name="check"/>
                </Button>
            </div>
        </div>
        <div class="tracking-table__body">
            <DragDrop v-for="tracking in trackings" :key="tracking.id" :data="tracking">
                <div
                    :class="{
                        'tracking-table__body-item': true,
                        'tracking-table__body-item--selected': trackingStore.focusedTracking ? tracking.id === trackingStore.focusedTracking.id : false
                    }"
                    @click.right="onOpenContextMenu($event, tracking)"
                >
                    <div class="tracking-table__body-item-actions">
                        <Checkbox
                            :checked="tracking.keepOnSubmit"
                            class="tracking-table__body-item-action"
                            @change="()=>{
                                tracking.keepOnSubmit = !tracking.keepOnSubmit
                            }"
                        >
                            Keep on submit
                        </Checkbox>
                    </div>
                    <div class="tracking-table__body-item-info-names">
                        <router-link
                            :to="{
                                name: 'task-detail',
                                params: {
                                   projectId: tracking.task.project_id,
                                   taskId: tracking.task.task_id
                                }}"
                            class="tracking-table__body-item-info-names-task"
                        >
                            {{ tracking.task.name }}
                        </router-link>
                        <div class="tracking-table__body-item-info-names-project">
                            {{ getProjectName(tracking) }}
                        </div>
                    </div>
                    <InlineEditAreaField
                        :value="tracking.summary"
                        class="tracking-table__body-item-summary"
                        @save="(v) => tracking.summary = v"
                    />
                    <div class="tracking-table__body-item-settings">
                        <InlineEditDropdownField
                            :list="labelStore.jobTypes.map(jobType => ({
                                    optionValue: jobType.id,
                                    optionName: jobType.name
                            }))"
                            :offset="7"
                            :value="tracking.jobTypeId"
                            class="tracking-table__body-item-settings-jobtype"
                            @save="(v) => tracking.jobTypeId = v"
                        />
                        <InlineEditDateField
                            :value="tracking.recordDate"
                            class="tracking-table__body-item-settings-date"
                            @save="(v) => tracking.recordDate = v"
                        />
                        <Button
                            :class="{
                                'tracking-table__body-item-settings-billable-billable': tracking.billableStatus === BillableStatus.BILLABLE
                            }"
                            class="icon no-border no-bg tracking-table__body-item-settings-billable"
                            title="Abrechnungsfähig"
                            @click="tracking.billableStatus = (tracking.billableStatus === BillableStatus.BILLABLE) ? BillableStatus.UNBILLABLE : BillableStatus.BILLABLE"
                        >
                            <Icon alt="Billable Icon" iconName="dollarCircle"/>
                        </Button>
                        <div class="tracking-table__body-item-settings-values">
                            <div class="tracking-table__body-item-settings-value-time">
                                <InlineEditTime
                                    :is-hour="true"
                                    :value="tracking.time.hours"
                                    @save="(v) => tracking.time.hours = v"
                                />
                                <span>:</span>
                                <InlineEditTime
                                    :is-minute="true"
                                    :value="tracking.time.minutes"
                                    @save="(v) => {
                                        tracking.time.minutes = v;
                                    }"
                                />
                            </div>
                            <div class="tracking-table__body-item-settings-value-value">
                                {{ calculateTimeValue(tracking.time.hours, tracking.time.minutes) }}
                            </div>
                        </div>
                    </div>
                </div>
            </DragDrop>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Icon from '@/components/core/Icon.vue';
import type {Tracking} from '@/interfaces';
import {defineProps} from 'vue';
import InlineEditDropdownField from '@/components/core/InlineEditDropdownField.vue';
import {BillableStatus} from '@share/interfaces/activecollab/enums';
import Button from '@/components/core/Button.vue';
import DragDrop from '@/components/core/DragDrop.vue';
import {calculateTimeValue} from '@/utils';
import InlineEditDateField from '@/components/core/InlineEditDateField.vue';
import {useTrackingStore} from '@/stores/trackingStore';
import {useContextMenuStore} from '@/stores/contextMenuStore';
import {useLabelStore} from '@/stores/labelStore';
import {useProjectStore} from '@/stores/projectStore';
import InlineEditTime from '@/components/core/InlineEditTime.vue';
import InlineEditAreaField from '@/components/core/InlineEditAreaField.vue';
import Checkbox from '@/components/core/Checkbox.vue';

const props = defineProps({
    trackings: {
        type: Array as () => Tracking[],
        required: true,
    },
});

const trackingStore = useTrackingStore();
const contextMenuStore = useContextMenuStore();
const labelStore = useLabelStore();
const projectStore = useProjectStore();

const getProjectName = (tracking: Tracking) => {
    const project = tracking.task.project || projectStore.projects.find(p => p.id === tracking.task.project_id);
    return project ? project.name : 'No Project Defined';
};

const formatDateToTrackingTableHeading = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const dateString = date.toISOString().split('T')[0];
    const todayString = today.toISOString().split('T')[0];
    const yesterdayString = yesterday.toISOString().split('T')[0];

    let value = '';
    if (dateString === todayString) {
        value = 'Heute - ';
    } else if (dateString === yesterdayString) {
        value = 'Gestern - ';
    }

    return value + date.toLocaleDateString();
};

const onOpenContextMenu = (event: MouseEvent, tracking: Tracking) => {
    contextMenuStore.openMenu(
        event,
        [
            {
                label: 'Submit',
                cb: () => trackingStore.submitTimeRecord(tracking.id, !tracking.keepOnSubmit),
            },
            {
                label: 'Delete',
                cb: () => deleteTracking(tracking.id),
            },
        ],
    );
};

const deleteTracking = (trackingId: string) => {
    trackingStore.removeTracking(trackingId);
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.tracking-table {
    width: 100%;
    background-color: $primary-color-7;
    border-radius: $border-radius-md;
    font-size: 0.9rem;

    .tracking-table__header {
        display: flex;
        justify-content: space-between;
        padding: 0.5em 1em 0 1em;
        color: $primary-color-1;
        font-size: 1.4rem;

        .tracking-table__header-date {
            font-weight: bold;
            font-family: Afacad, sans-serif;
        }

        .tracking-table__header-actions {
            display: flex;
            gap: 1em;
            align-items: center;

            .tracking-table__header-action {
                width: 1em;
                height: 1em;
            }
        }
    }

    .tracking-table__body {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        padding: 1em;
        overflow-y: auto;
        max-height: 30em;

        .tracking-table__body-item {
            border-radius: $border-radius-md;
            padding: 1em;
            background-color: $primary-color-5;
            align-items: center;
            justify-items: center;
            grid-template-columns: 2fr 4fr;
            flex-direction: column;
            gap: 0.5em;
            min-width: fit-content;
            display: flex;

            .tracking-table__body-item-actions {
                display: flex;
                flex-direction: row;
                gap: 1em;
                width: 100%;
                justify-content: space-between;

                .tracking-table__body-item-action {
                    font-size: .85em;
                }
            }

            .tracking-table__body-item-info-names {
                display: flex;
                width: 100%;
                flex-direction: column;
                gap: 0.25em;

                .tracking-table__body-item-info-names-task {
                    font-weight: bold;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    width: 100%;
                }

                .tracking-table__body-item-info-names-project {
                    opacity: 0.75;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    width: 100%;
                }
            }

            .tracking-table__body-item-summary {
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                width: 100%;
                min-width: 7.5em;
            }

            .tracking-table__body-item-settings {
                display: flex;
                flex-direction: row;
                align-items: center;
                width: 100%;
                gap: 1em;
                text-align: center;
                justify-content: space-between;

                .tracking-table__body-item-settings-jobtype {
                    width: max-content;
                }

                .tracking-table__body-item-settings-billable {
                    align-items: center;
                    min-width: 2em;
                    min-height: 2em;
                    align-content: center;
                }

                .tracking-table__body-item-settings-billable-billable {
                    :deep(svg) {
                        fill: $accent-color-green-1;
                    }
                }

                .tracking-table__body-item-settings-billable-billable:hover :deep(svg) {
                    fill: $accent-color-green-2;
                }

                .tracking-table__body-item-settings-values {
                    gap: 0.25em;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    width: 4em;

                    .tracking-table__body-item-settings-value-time {
                        display: flex;
                        flex-direction: row;
                        gap: 0.1em;
                    }

                    .tracking-table__body-item-settings-value-value {
                        font-weight: bold;
                    }
                }
            }
        }

        .tracking-table__body-item:hover {
            background-color: $primary-color-3;
            cursor: grab;
        }

        .tracking-table__body-item--selected {
            border: 2px solid $text-color;
        }
    }
}
</style>
