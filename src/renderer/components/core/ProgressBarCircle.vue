<template lang="html">
    <div ref="progressBar" class="progress-bar-circle">
        <div class="progress-bar-circle__inner-area">
            <div class="progress-bar-circle__title">
                <p class="progress-bar-circle__title-percentage">{{ percentage }}%</p>
                <slot class="progress-bar-circle__title-subtitle" name="subtitle"></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref, watch} from 'vue';

const props = defineProps({
    percentage: {
        type: Number,
        default: 100,
        required: true,
    },
});

watch(() => props.percentage, (newVal) => {
    maxPercentage.value = newVal;
    percentage.value = 0;
    stopProgress();
    startProgress();
});

const progressBar = ref<HTMLElement | null>(null);
const maxPercentage = ref<number>(props.percentage);
const percentage = ref<number>(0);
const progressInterval = ref<NodeJS.Timeout>();
const nonProgressColor = 'transparent';
const speed = 5;

const progressColor = computed(() => {
    if (percentage.value > 75) {
        return `rgb(225, 88, 3)`; // Should be the highest threshold first
    } else if (percentage.value > 50) {
        return `rgb(225, 214, 3)`;
    } else {
        return `rgba(3, 159, 225, 1)`;
    }
});

const stopProgress = () => {
    if (progressInterval.value) {
        clearInterval(progressInterval.value);
    }
};

const startProgress = () => {
    progressInterval.value = setInterval(() => {
        if (progressBar.value) {
            progressBar.value.style.background = `
                conic-gradient(
                    ${progressColor.value} ${percentage.value * 3.6}deg,
                    ${nonProgressColor} ${percentage.value * 3.6}deg
                )`;

            if (percentage.value >= maxPercentage.value || !isFinite(maxPercentage.value)) {
                stopProgress();
            } else {
                percentage.value++;
            }
        }
    }, speed);
};

onMounted(() => {
    stopProgress();
    startProgress();
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.progress-bar-circle {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    .progress-bar-circle__inner-area {
        width: 170px;
        height: 170px;
        border-radius: 50%;
        background-color: $primary-color-3;
        position: relative;
    }

    .progress-bar-circle__title {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5em;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        .progress-bar-circle__title-percentage {
            position: relative;
            font-size: 2em;
            color: #FFF;
            margin: 0;
            font-weight: bold;
        }
    }
}
</style>
