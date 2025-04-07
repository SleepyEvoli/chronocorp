<template>
    <div class="task-assignment-view">
        <div class="task-assignment-view__container">
            <TaskAssignmentDropbox
                v-for="assignmentLabel in labelStore.assignmentLabels"
                :key="assignmentLabel.id"
                :assignment-label="assignmentLabel"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import TaskAssignmentDropbox from '@/components/modules/TaskAssignmentDropbox.vue';
import {useLabelStore} from '@/stores/labelStore';

const labelStore = useLabelStore();
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.task-assignment-view {
    margin-top: 2.5em;

    .task-assignment-view__container {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        gap: 1em;
    }
}
</style>
