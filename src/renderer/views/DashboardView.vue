<template lang="html">
    <section class="view-dashboard">
        <div class="view-dashboard__tracking-pin-area">
            <TaskTimer class="view-dashboard__timer"/>
            <div class="view-dashboard__pins">
                <DragDrop
                    v-for="pin in trackingStore.pinnedTasks"
                    :key="pin.task_id" :data="pin"
                    class="view-dashboard__pin"
                >
                    <PinnedTaskBox :task="pin"/>
                </DragDrop>
            </div>
        </div>
        <div class="view-dashboard__tracking-tables">
            <TrackingTable
                :trackings="trackingStore.trackings.filter(tracking =>
                tracking.recordDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0])"
            />
            <TrackingTable
                v-for="(day, index) in getTrackingDays(true)"
                :key="index"
                :trackings="trackingStore.trackings.filter(tracking =>
                    tracking.recordDate.toISOString().split('T')[0] === day)"
            />
        </div>
    </section>
</template>

<script lang="ts" setup>
import TaskTimer from '@/components/modules/TaskTimer.vue';
import PinnedTaskBox from '@/components/modules/PinnedTaskBox.vue';
import DragDrop from '@/components/core/DragDrop.vue';
import {useTrackingStore} from '@/stores/trackingStore';
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

.view-dashboard {
    .view-dashboard__timer {
        justify-content: space-between;
        height: fit-content;
    }

    .view-dashboard__tracking-pin-area {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 1rem;
        margin-bottom: 2rem;
        padding: .5em;

        .view-dashboard__pins {
            display: flex;
            flex-wrap: wrap;
            gap: .5rem;
            height: fit-content;
        }
    }

    .view-dashboard__tracking-tables {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
}
</style>
