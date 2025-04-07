<template lang="html">
    <div class="task-time-record-creator task-time-record-table">
        <div class="task-time-record-creator__actions">
            <Button
                class="task-time-record-creator__action icon secondary"
                title="Eintrag hinzufügen"
                @click="()=>{
                    const tracking = trackingStore.createTracking(props.task);
                    if (tracking) {
                        trackingStore.addTracking(tracking);
                    }
                }"
            >
                <Icon alt="Add Time Record Icon" iconName="plus"/>
            </Button>
        </div>
        <div
            v-for="tracking in trackingStore.trackings.filter(t => t.task.task_id === props.task.task_id)"
            :key="tracking.id"
            class="task-time-record-table__item"
        >
            <div class="task-time-record-table__item-header">
                <Button
                    class="task-time-record-table__item-header-action icon secondary"
                    @click="()=>{
                        trackingStore.submitTimeRecord(tracking.id);
                    }"
                >
                    <Icon icon-name="check"></Icon>
                </Button>
                <Button
                    class="task-time-record-table__item-header-action icon secondary"
                    @click="()=>{
                        trackingStore.removeTracking(tracking.id);
                    }"
                >
                    <Icon icon-name="close"></Icon>
                </Button>
            </div>
            <div class="task-time-record-table__item-body">
                <div class="task-time-record-table__item-body-user">
                    <UserThumbnail
                        v-if="tracking.createdBy"
                        :user="tracking.createdBy"
                        class="task-time-record-table__item-body-user-thumbnail"
                    />
                    <InlineEditDropdownField
                        v-if="tracking.createdBy"
                        :list="userStore.users.map(user => ({
                                optionValue: user.id,
                                optionName: user.name
                            }))"
                        :value="tracking.createdBy.id"
                        class="task-time-record-table__item-body-user-name"
                        @save="(v)=>{
                        tracking.createdBy = userStore.users.find(user => user.id == v) ?? userStore.users[0];
                    }"
                    />
                </div>
                <InlineEditDropdownField
                    :list="labelStore.jobTypes.map(jobType => ({
                        optionValue: jobType.id,
                        optionName: jobType.name
                    }))"
                    :offset="7"
                    :value="tracking.jobTypeId"
                    class="task-time-record-table__item-body-jobtype"
                    @save="(v)=>tracking.jobTypeId = v"
                />
                <InlineEditDateField
                    :value="tracking.recordDate"
                    class="task-time-record-table__item-body-date"
                    @save="(v)=>tracking.recordDate = v"
                />
                <InlineEditAreaField
                    :value="tracking.summary"
                    class="task-time-record-table__item-body-summary"
                    @save="(v)=>tracking.summary = v"
                />
                <Button
                    :class="{
                        'task-time-record-table__item-body-billable-active': tracking.billableStatus == BillableStatus.BILLABLE,
                    }"
                    class="icon no-border no-bg task-time-record-table__item-body-billable"
                    title="Abrechnungsfähig"
                    @click="()=>tracking.billableStatus = tracking.billableStatus == BillableStatus.BILLABLE ?BillableStatus.UNBILLABLE : BillableStatus.BILLABLE"
                >
                    <Icon alt="Billable Icon" iconName="dollarCircle"/>
                </Button>
                <div>
                    <div class="task-time-record-table__item-body-value-time">
                        <InlineEditTime
                            :is-hour="true"
                            :value="tracking.time.hours"
                            @save="(v)=>tracking.time.hours = v"
                        />
                        :
                        <InlineEditTime
                            :is-minute="true"
                            :value="tracking.time.minutes"
                            @save="(v)=>tracking.time.minutes = v"
                        />
                    </div>
                    <div class="task-time-record-table__item-body-value">
                        {{ calculateTimeValue(tracking.time.hours, tracking.time.minutes) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import UserThumbnail from '@/components/modules/UserThumbnail.vue';
import {calculateTimeValue} from '@/utils';
import {BillableStatus} from '@share/interfaces/activecollab/enums';
import Icon from '@/components/core/Icon.vue';
import Button from '@/components/core/Button.vue';
import InlineEditDropdownField from '@/components/core/InlineEditDropdownField.vue';
import InlineEditDateField from '@/components/core/InlineEditDateField.vue';
import type {Task} from '@share/interfaces/activecollab/task';
import {useTrackingStore} from '@/stores/trackingStore';
import {useLabelStore} from '@/stores/labelStore';
import {useUserStore} from '@/stores/userStore';
import InlineEditTime from '@/components/core/InlineEditTime.vue';
import InlineEditAreaField from '@/components/core/InlineEditAreaField.vue';

const props = defineProps({
    task: {
        type: Object as () => Task,
        required: true,
    },
});

const emit = defineEmits(['submit']);

const trackingStore = useTrackingStore();
const labelStore = useLabelStore();
const userStore = useUserStore();

</script>

<style lang="scss">
@use '@/styles/variables' as *;

.task-time-record-creator {
    max-height: unset;

    .task-time-record-creator__actions {
        display: flex;
        justify-content: flex-end;

        .task-time-record-creator__action {
            width: 1.5em;
        }
    }

    .task-time-record-table__item {
        background-color: $primary-color-3;
        border: 1px solid $primary-color-2;
        border-radius: $border-radius-sm;
        gap: 0;

        .task-time-record-table__item-header {
            display: flex;
            justify-content: flex-end;
            padding: .5em;

            .task-time-record-table__item-header-action {
                width: 1.5em;
            }
        }

        .task-time-record-table__item-body:hover {
            background-color: unset;
        }

        .task-time-record-table__item-body-value {
            display: flex;
            justify-content: center;
        }

    }
}
</style>
