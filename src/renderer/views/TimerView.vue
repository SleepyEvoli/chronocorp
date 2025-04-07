<template>
    <div class="view-timer">
        <div class="view-timer__info">
            Ziehe das Fenster kleiner, um die Timer- und Tracking-Tabelle effektiv nutzen zu können.
        </div>
        <TaskTimer/>
        <TrackingTable
            v-for="(day, index) in getTrackingDays(false)"
            :key="index"
            :trackings="trackingStore.trackings.filter(tracking =>
                    tracking.recordDate.toISOString().split('T')[0] === day)"
        />
    </div>
</template>

<script lang="ts" setup>
import {useTrackingStore} from '@/stores/trackingStore';
import TaskTimer from '@/components/modules/TaskTimer.vue';
import TrackingTable from '@/components/modules/TrackingTable.vue';

const trackingStore = useTrackingStore();

const getTrackingDays = (notToday: boolean = false) => {
    const arr: string[] = [];
    trackingStore.trackings.forEach(tracking => {
        const dateString = tracking.recordDate.toISOString().split('T')[0];
        if (!arr.find(date => date === dateString)) {
            arr.push(dateString);
        }
    });
    arr.sort((a, b) => {
        return new Date(b).getTime() - new Date(a).getTime();
    });
    if (notToday) {
        if (arr[0] === new Date().toISOString().split('T')[0]) {
            arr.shift();
        }
    }
    return arr;
};
</script>


<style lang="scss" scoped>
@use '@/styles/variables' as *;

// Mostly overrides of the TaskTimer and TrackingTable components for a smaller view
.view-timer {
    display: flex;
    flex-direction: column;

    .view-timer__info {
        font-size: .8rem;
        text-align: center;
        margin-bottom: 1em;

        @media (max-width: $breakpoint-tablet) {
            display: none;
        }
    }

    :deep(.task-timer) {
        font-size: .75rem;
        gap: .5em;
        text-align: center;
        border-radius: 0;
        padding: 0;

        .task-timer__actions {
            display: none;
        }

        .task-timer-body {
            flex-direction: column;
            gap: 0;

            .task-timer-body__info {
                width: 100%;
                padding: 1em;

                .task-timer-body__info-task {
                    text-align: center;
                }

                .task-timer-body__info-project {
                    text-align: center;
                }
            }

            .task-timer-body__actions {
                display: none;
            }

            .task-timer-body__display {
                border-radius: 0;
                border: none;
                align-items: center;
            }

            .task-timer-body__display-actions {
                font-size: 1.3em;
            }

        }
    }

    :deep(.tracking-table) {
        .tracking-table__header {
            font-size: .75em;
            align-items: end;
            padding: 1em;

            .tracking-table__header-action {
                width: 2em;
                height: 2em;
            }

            .tracking-table__header-date {
                font-size: 1.5em;
            }
        }

        .tracking-table__body {
            max-height: 70vh;
            padding: 0;

            .tracking-table__body-item-info-names-task {
                pointer-events: none;
            }

            .tracking-table__body-row-company {
                display: none;
            }

            .tracking-table__body-item {
                font-size: .9em;
                border-radius: 0;
            }

            .tracking-table__body-item-info-names-task {
                text-align: left;
                max-width: 15em;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .tracking-table__body-item-info-names-project {
                text-align: left;
                max-width: 15em;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .tracking-table__body-item-settings-billable {
                width: 1em;
                height: 1em;
            }

            .tracking-table__body-item-settings-jobtype {
                max-width: 6em;
            }
        }
    }

}
</style>
