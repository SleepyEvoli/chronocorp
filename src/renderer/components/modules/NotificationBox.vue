<template lang="html">
    <div
        :class="[
            'notification-box',
            {'notification-box--visible': eventStore.notificationQueue.length > 0}
        ]"
    >
        <List class="notification-box__list">
            <TransitionGroup class="notification-box__list" name="fade-slide" tag="div">
                <ListItem
                    v-for="item in eventStore.notificationQueue.slice().reverse()"
                    :key="item.notification.id"
                    class="notification-box__list-item"
                    @click="eventStore.removeFromNotificationQueue(item.notification.id)"
                >
                    <div class="notification-box__list-item-title">
                        {{ item.notification.title }}
                    </div>
                    <div v-if="item.notification.body" class="notification-box__list-item-body">
                        {{ item.notification.body }}
                    </div>
                </ListItem>
            </TransitionGroup>
        </List>
    </div>
</template>

<script lang="ts" setup>
import List from '@/components/core/List.vue';
import ListItem from '@/components/core/ListItem.vue';
import {useEventStore} from '@/stores/eventStore';

const eventStore = useEventStore();
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.notification-box--visible {
    display: unset !important;
}

.notification-box {
    height: fit-content;
    width: 25em;
    padding: .25em;
    font-size: .7rem;
    display: none;

    .notification-box__list {
        display: flex;
        flex-direction: column;
        gap: 1em;

        .notification-box__list-item {
            padding: 1em;
            background-color: rgba(44, 56, 75, 0.75);
            border-radius: $border-radius-md;
            border: 2px solid $accent-color-blue-1;

            .notification-box__list-item-title {
                font-weight: bold;
                border-bottom: 1px solid $primary-color-1;
                padding-bottom: .25em;
                font-size: 1.1em;
            }

            .notification-box__list-item-body {
                margin-top: .5em;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .notification-box__list-item:hover {
            cursor: pointer;
            filter: brightness(1.1);
        }
    }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.5s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(-20px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

</style>
