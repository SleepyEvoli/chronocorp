<template lang="html">
    <List class="recent-events">
        <ListItem
            v-for="event in eventStore.eventNotifications.slice().reverse()"
            :key="event.id"
            class="recent-events__item"
        >
            <div class="recent-events__item-title">
                {{ event.title }}
            </div>
            <div v-if="event.body" :title=event.body class="recent-events__item-body">
                {{ event.body }}
            </div>
            <div v-if="event.url" class="recent-events__item-url">
                <a :href="event.url">{{ event.url }}</a>
            </div>
            <div class="recent-events__item-date">
                {{ event.dateTime.toLocaleString() }}
            </div>
        </ListItem>
    </List>
</template>
<script lang="ts" setup>
import List from '@/components/core/List.vue';
import ListItem from '@/components/core/ListItem.vue';
import {useEventStore} from '@/stores/eventStore';

const eventStore = useEventStore();
</script>
<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.recent-events {
    width: 100%;
    max-width: 30rem;

    .recent-events__item {
        font-size: 0.8em;
        color: $text-color;

        .recent-events__item-title {
            font-weight: bold;
        }

        .recent-events__item-body {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .recent-events__item-date {
            color: $primary-color-1;
        }
    }
}
</style>
