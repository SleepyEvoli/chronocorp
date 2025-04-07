<template lang="html">
    <div
        :style="{
                top: (contextMenuStore.position.y - horizontalOffset) + 'px',
                left: (contextMenuStore.position.x + verticalOffset) + 'px'
             }"
        class="context-menu"
    >
        <List class="context-menu__list">
            <ContextMenuItem
                v-for="item in contextMenuStore.items"
                :key="item.label"
                :label="item.label"
                @click="item.cb"
            />
        </List>
    </div>
</template>

<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref} from 'vue';
import List from '@/components/core/List.vue';
import ContextMenuItem from '@/components/core/ContextMenuItem.vue';
import {useContextMenuStore} from '@/stores/contextMenuStore';

const emit = defineEmits(['close']);

const contextMenuStore = useContextMenuStore();

const horizontalOffset = ref(10);
const verticalOffset = ref(15);

onMounted(() => {
    document.addEventListener('click', () => emit('close'));
});

onBeforeUnmount(() => {
    document.removeEventListener('click', () => emit('close'));
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.context-menu {
    position: absolute;
    z-index: 100;
    color: $text-color;
    outline: 1px solid $primary-color-2;
    border-radius: $border-radius-sm;

    .context-menu__list {
        background-color: $primary-color-4;
        box-shadow: $box-shadow-sm;
        min-width: 10em;
        border-radius: $border-radius-md;
    }

}
</style>
