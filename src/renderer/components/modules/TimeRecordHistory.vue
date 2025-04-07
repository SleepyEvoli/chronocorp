<template lang="html">
    <div class="time-record-history">
        <div class="time-record-history__actions">
            <div class="info">Derzeit für 1 Monat</div>
            <Button
                class="icon secondary"
                title="Refresh"
                @click="refreshTimeRecordHistory"
            >
                <Icon icon-name="refresh"/>
            </Button>
        </div>
        <div
            v-for="(records, date) in timeRecordsSeparatedByDate()"
            :key="date"
            class="time-record-history__lists"
        >
            <div
                class="time-record-history__list-heading"
            >
                <div class="time-record-history__list-heading-title">
                    {{ records[0].record_date.date_object.toLocaleDateString() }} -
                    {{ getWeekday(records[0].record_date.date_object) }}
                </div>
                <div class="time-record-history__list-heading-sum">
                    {{ records.reduce((acc, record) => Number(acc) + Number(record.value), 0) }}h
                </div>
            </div>
            <TaskTimeRecords
                :show-project-info="true"
                :timeRecords="records"
                class="time-record-history__list"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import Icon from '@/components/core/Icon.vue';
import Button from '@/components/core/Button.vue';
import type {TimeRecord} from '@share/interfaces/activecollab/timeRecord';
import {useTrackingStore} from '@/stores/trackingStore';
import {useProjectStore} from '@/stores/projectStore';
import {getWeekday} from '@/utils';
import TaskTimeRecords from '@/components/modules/TaskTimeRecords.vue';

const projectStore = useProjectStore();
const trackingStore = useTrackingStore();

const refreshTimeRecordHistory = async (event: Event, monthCount: number = 1) => {
    const cutoffTime = new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * monthCount;

    trackingStore.timeRecordHistory = [];

    for (const project of projectStore.projects) {
        const records = await projectStore.fetchProjectTimeRecords(project.id);
        records.forEach((record) => {
            if (record.record_date.date_object.getTime() < cutoffTime) {
                return;
            }
            trackingStore.addToTimeRecordHistory(record);
        });
    }
};

// Example:
// [
//     ["2024-02-28", [{ id: 1, class: "TimeRecord"... }]],
//     ["2024-02-27", [{ id: 2, class: "TimeRecord"... }]],
//     ["2024-02-26", [{ id: 3, class: "TimeRecord"... }]]
// ]
const timeRecordsSeparatedByDate = () => {
    const groupedRecords = trackingStore.timeRecordHistory.reduce((acc, record) => {
        const date = record.record_date.date_object.toDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(record);
        return acc;
    }, {} as { [key: string]: TimeRecord[] });

    return Object.fromEntries(
        Object.entries(groupedRecords).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime()),
    );
};
</script>

<style lang="scss">
@use '@/styles/variables' as *;

.time-record-history {
    min-width: max-content;
    display: flex;
    flex-direction: column;
    gap: 1em;

    .time-record-history__actions {
        display: flex;
    }

    .time-record-history__lists {
        border-radius: $border-radius-sm;
        display: flex;
        flex-direction: column;
        padding-bottom: .5em;
        gap: 1em;

        :deep(.task-time-records) {
            max-height: unset;
        }

        .time-record-history__list-heading {
            display: flex;
            justify-content: space-between;
            background-color: $primary-color-6;
            padding: .5em;
            border-radius: $border-radius-sm;
            color: $text-color;

            .time-record-history__list-heading-title {
                font-size: .75em;
                font-weight: bold;
            }

            .time-record-history__list-heading-sum {
                font-size: .75em;
                font-weight: bold;
            }
        }
    }
}
</style>
