<template lang="html">
    <List class="comment-list">
        <CommentListItem
            v-for="(comment, index) in comments"
            :key="index"
            :comment="comment"
            :index="comments.length - index"
            :projectId="props.projectId"
            :taskId="props.taskId"
            @change="emit('change')"
        />
    </List>
</template>

<script lang="ts" setup>
import type {Comment} from '@share/interfaces/activecollab/comment';
import CommentListItem from '@/components/modules/CommentListItem.vue';
import List from '@/components/core/List.vue';
import {defineProps} from 'vue';

const props = defineProps({
    projectId: {
        type: String,
        required: true,
    },
    taskId: {
        type: String,
        required: true,
    },
    comments: {
        type: Array as () => Comment[],
        required: true,
    },
});

const emit = defineEmits(['change']);

</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.comment-list {
    overflow: hidden;
    font-size: 0.8rem;
    gap: 0.5em;
    margin-top: 1em;
}
</style>
