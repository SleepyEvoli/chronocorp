import {ref, watch} from 'vue';
import {defineStore} from 'pinia';
import {useTrackingStore} from '@/stores/trackingStore';
import {hourStringToNumber, minuteStringToNumber} from '@/utils';

export const useTimerStore = defineStore('timer', () => {
    const trackingStore = useTrackingStore();

    const running = ref<boolean>(false);
    const timerInterval = ref<NodeJS.Timeout>();

    watch(() => trackingStore.focusedTracking, (newValue) => {
        stopTimer();
        if (newValue) {
            startTimer();
        }
    });

    const startTimer = (): void => {
        if (running.value) {
            stopTimer();
        }
        running.value = true;
        timerInterval.value = setInterval(() => {
            if (trackingStore.focusedTracking) {
                addTime(1);
            }
        }, 60000);
    };

    const stopTimer = (): void => {
        running.value = false;
        if (timerInterval.value) {
            clearInterval(timerInterval.value);
        }
    };

    const hourChange = (value: string): void => {
        if (trackingStore.focusedTracking) {
            trackingStore.focusedTracking.time.hours = hourStringToNumber(value);
        }
    };

    const minuteChange = (value: string): void => {
        if (trackingStore.focusedTracking) {
            trackingStore.focusedTracking.time.minutes = minuteStringToNumber(value);
        }
    };

    const addTime = (minutes: number): void => {
        if (trackingStore.focusedTracking) {
            const totalMinutes = trackingStore.focusedTracking.time.hours * 60 + trackingStore.focusedTracking.time.minutes + minutes;
            trackingStore.focusedTracking.time.hours = hourStringToNumber(Math.floor(totalMinutes / 60).toString());
            trackingStore.focusedTracking.time.minutes = minuteStringToNumber((totalMinutes % 60).toString());
        }
    };

    const init = (): void => {
        // LocalStorage will lose the reference to the tracking object, so we need to find it again
        if (trackingStore.focusedTracking) {
            const found = trackingStore.trackings.find(tracking => tracking.id === trackingStore.focusedTracking?.id);
            if (found) {
                trackingStore.focusedTracking = found;
            } else {
                trackingStore.focusedTracking = null;
            }
            running.value = false;
            timerInterval.value = undefined;
        }
    };

    return {
        running,
        startTimer,
        stopTimer,
        hourUpdate: hourChange,
        minuteUpdate: minuteChange,
        addTime,
        init,
    };
});
