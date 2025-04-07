<template lang="html">
    <ListItem class="context-menu-item">
        {{ props.label }}
    </ListItem>
</template>

<script lang="ts" setup>
import ListItem from '@/components/core/ListItem.vue';

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.context-menu-item {
    align-items: center;
    border-bottom: unset;
    display: flex;
    font-size: .85em;
    padding: 0.5em 1em;
}

.context-menu-item:hover {
    background-color: $primary-color-3;
    cursor: pointer;
}
</style>
