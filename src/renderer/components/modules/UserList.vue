<template lang="html">
    <List class="user-list">
        <ListItem
            v-for="user in users"
            :key="user.id"
            class="user-list__item"
            @click.right="onContextMenuOpenLazyTracking($event, user)"
        >
            <div class="user-list__item-thumbnail">
                <UserThumbnail :user="user"/>
            </div>
            <div class="user-list__item-name">
                {{ user.name }}
            </div>
        </ListItem>
    </List>
</template>

<script lang="ts" setup>
import {useUserStore} from '@/stores/userStore';
import UserThumbnail from '@/components/modules/UserThumbnail.vue';
import List from '@/components/core/List.vue';
import ListItem from '@/components/core/ListItem.vue';
import {useContextMenuStore} from '@/stores/contextMenuStore';
import type {User} from '@share/interfaces/activecollab/user';

const userStore = useUserStore();
const contextMenuStore = useContextMenuStore();

const users = userStore.users;

const onContextMenuOpenLazyTracking = (event: MouseEvent, user: User) => {
    contextMenuStore.openMenu(event, [
        {
            label: 'Email senden',
            cb: () => {
                window.location.href = `mailto:${encodeURIComponent(user.email)}`;
            },
        },
    ]);
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.user-list {
    align-items: center;
    font-size: 1.1rem;
    width: 100%;

    .user-list__item {
        display: flex;
        font-size: 0.8em;

        .user-list__item-thumbnail {
            width: 2em;
            height: 2em;
            margin-right: 2em;
        }

        .user-list__item-name {
            text-align: left;
        }
    }

    .user-list__item:hover {
        background-color: $primary-color-3;
        cursor: pointer;
    }
}
</style>
