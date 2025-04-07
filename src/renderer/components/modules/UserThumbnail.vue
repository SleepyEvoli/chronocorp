<template lang="html">
    <div class="user-thumbnail">
        <img
            :src="props.user ? props.user.avatar.large : placeholderThumbnail"
            alt="User Thumbnail"
            @click="userCardVisible = !userCardVisible"
        >
        <BoxContainerDraggable v-if="userCardVisible" @close="userCardVisible = false">
            <Box v-if="userCardVisible">
                <UserCard v-if="user" :user-id="user.id"/>
            </Box>
        </BoxContainerDraggable>
    </div>
</template>

<script lang="ts" setup>
import type {User} from '@share/interfaces/activecollab/user';
import {ref} from 'vue';
import UserCard from '@/components/modules/UserCard.vue';
import Box from '@/components/core/Box.vue';
import BoxContainerDraggable from '@/components/core/BoxContainerDraggable.vue';
import placeholderThumbnail from '@/assets/profile-placeholder.png?url';

const props = defineProps({
        user: {
            type: Object as () => User,
            required: true,
        },
    },
);

const userCardVisible = ref(false);
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.user-thumbnail {
    height: 100%;
    width: 100%;

    img {
        border-radius: $border-radius-sm;
        height: 100%;
        object-fit: cover;
        width: 100%;
    }

    img:hover {
        cursor: pointer;
        transform: scale(.95);
        border: 1px solid $accent-color-blue-1;
    }
}
</style>
