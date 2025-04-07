<template lang="html">
    <div v-if="loadingStore.loading" class="loading-circle">
        <img :src="loadingCircle" alt="Loading Circle">
    </div>
</template>

<script lang="ts" setup>
import loadingCircle from '@/assets/loading-circle.gif?url';
import {useLoadingStore} from '@/stores/loadingStore';

const loadingStore = useLoadingStore();
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.loading-circle {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
}
</style>
