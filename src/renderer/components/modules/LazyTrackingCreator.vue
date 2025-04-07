<template lang="html">
    <div class="lazy-tracking-creator">
        <div class="lazy-tracking-creator__info">
            <div class="lazy-tracking-creator__info-heading">
                Create Lazy Tracking
            </div>
            <div>Task: {{ task.name }}</div>
            <div>Project: {{ task.project?.name }}</div>
        </div>

        <div class="lazy-tracking-creator__input">
            <Label>Summary</Label>
            <TextArea
                :value="lazyTrackingSummary"
                @input="lazyTrackingSummary = $event.target.value"
            />
            <div class="lazy-tracking-creator__input-time">
                <div>
                    <Label>Stunde</Label>
                    <InputField
                        :value="formatNumberToHourString(lazyTrackingHour)"
                        class="lazy-tracking-creator__input-time-hour"
                        placeholder="0"
                        type="number"
                        @input="(event)=>lazyTrackingHour = hourStringToNumber(event.target.value)"
                    />
                </div>
                <div>
                    <Label>Minute</Label>
                    <InputField
                        :value="formatNumberToMinuteString(lazyTrackingMinute)"
                        class="lazy-tracking-creator__input-time-minute"
                        placeholder="0"
                        type="number"
                        @input="(event)=>lazyTrackingMinute = minuteStringToNumber(event.target.value)"
                    />
                </div>
            </div>
            <Label>Jobtype</Label>
            <SelectField
                :options="labelStore.jobTypes.map((jobType) => ({
                        optionValue: jobType.id,
                        optionName: jobType.name}
                    ))"
                :value="lazyTrackingJobTypeId"
                @change="(event)=>lazyTrackingJobTypeId = event.target.value"
            />
            <Label>Abrechenbar</Label>
            <SelectField
                :options="labelStore.billableStatusList.map((billableStatus) => ({
                        optionValue: billableStatus,
                        optionName: labelStore.getBillableStatusName(billableStatus)
                    }))"
                :value="lazyTrackingBillableStatus"
                @change="(event)=>lazyTrackingBillableStatus = event.target.value"
            />
        </div>
        <Button class="primary blue" @click="()=>{
                    createLazyTracking();
                    emit('close');
                }">Erstellen
        </Button>
    </div>
</template>
<script lang="ts" setup>
import Button from '@/components/core/Button.vue';
import InputField from '@/components/core/InputField.vue';
import SelectField from '@/components/core/SelectField.vue';
import type {Tracking} from '@/interfaces';
import {ref} from 'vue';
import {BillableStatus} from '@share/interfaces/activecollab/enums';
import {useLabelStore} from '@/stores/labelStore';
import {useUserStore} from '@/stores/userStore';
import type {Task} from '@share/interfaces/activecollab/task';
import {useTrackingStore} from '@/stores/trackingStore';
import {formatNumberToHourString, formatNumberToMinuteString, hourStringToNumber, minuteStringToNumber} from '@/utils';
import Label from '@/components/core/Label.vue';
import TextArea from '@/components/core/TextArea.vue';

const props = defineProps({
    task: {
        type: Object as () => Task,
        required: true,
    },
});

const labelStore = useLabelStore();
const userStore = useUserStore();
const trackingStore = useTrackingStore();

const emit = defineEmits(['close']);

const lazyTrackingSummary = ref<string>('Umsetzung;');
const lazyTrackingJobTypeId = ref<string>(labelStore.jobTypes[0].id);
const lazyTrackingBillableStatus = ref<BillableStatus>(labelStore.billableStatusList[0]);
const lazyTrackingHour = ref<number>(0);
const lazyTrackingMinute = ref<number>(30);

const createLazyTracking = () => {
    const track: Tracking = {
        id: new Date().getTime().toString(),
        createdOn: new Date(),
        createdBy: userStore.loggedUser,
        task: props.task,
        recordDate: new Date(),
        summary: lazyTrackingSummary.value,
        jobTypeId: lazyTrackingJobTypeId.value,
        billableStatus: lazyTrackingBillableStatus.value,
        keepOnSubmit: false,
        time: {
            hours: lazyTrackingHour.value,
            minutes: lazyTrackingMinute.value,
        },
    };

    trackingStore.addLazyTracking(track);
};
</script>
<style lang="scss" scoped>

.lazy-tracking-creator {
    display: flex;
    flex-direction: column;
    gap: 1em;
    font-size: .9rem;

    .lazy-tracking-creator__info {
        gap: .5em;
        display: flex;
        flex-direction: column;
        margin-bottom: 1em;

        .lazy-tracking-creator__info-heading {
            font-weight: 600;
        }
    }

    .lazy-tracking-creator__input {
        gap: .5em;
        display: flex;
        flex-direction: column;

        .lazy-tracking-creator__input-time {
            display: flex;
            flex-direction: row;
            gap: .5em;
        }
    }
}

</style>
