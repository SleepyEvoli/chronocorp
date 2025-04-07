<template lang="html">
    <List class="lazy-trackings">
        <div
            v-for="tracking in trackingStore.lazyTrackings"
            :key="tracking.id"
            class="lazy-trackings__item"
            @click="trackingStore.submitLazyTracking(tracking)"
            @click.right="onContextMenuOpenLazyTracking($event, tracking)"
        >
            <div class="lazy-trackings__item-titles">
                <div class="lazy-trackings__item-title-task">
                    {{ tracking.task.name }}
                </div>
                <div class="lazy-trackings__item-title-project">
                    {{ tracking.task.project?.name }}
                </div>
                <div class="lazy-trackings__item-title-summary">
                    {{ tracking.summary }}
                </div>
            </div>
            <div class="lazy-trackings__item-value">
                {{ calculateTimeValue(tracking.time.hours, tracking.time.minutes) }}
            </div>
        </div>
    </List>
</template>

<script lang="ts" setup>
import {useTrackingStore} from '@/stores/trackingStore';
import {useContextMenuStore} from '@/stores/contextMenuStore';
import type {Tracking} from '@/interfaces';
import List from '@/components/core/List.vue';
import {calculateTimeValue} from '@/utils';

const contextMenuStore = useContextMenuStore();
const trackingStore = useTrackingStore();

const onContextMenuOpenLazyTracking = (event: MouseEvent, tracking: Tracking) => {
    event.preventDefault();
    contextMenuStore.openMenu(event, [
        {
            label: 'Delete',
            cb: () => trackingStore.removeLazyTracking(tracking.id),
        },
    ]);
};
</script>
<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.lazy-trackings {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: .75em;

    .lazy-trackings__header {
        font-size: 1em;
        margin-bottom: .5em;
        font-family: Raleway, sans-serif;
        display: flex;
        gap: .5em;
        align-items: center;
    }

    .lazy-trackings__item {
        display: flex;
        gap: 1em;
        align-items: center;
        border-radius: 0.25em;
        justify-content: space-between;
        padding: .7em;
        background-color: $primary-color-3;
        border: 1px solid $primary-color-2;
        font-size: .8em;

        .lazy-trackings__item-titles {
            display: flex;
            flex-direction: column;
            gap: .25em;
            width: 20rem;

            .lazy-trackings__item-title-task {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: bold;
            }

            .lazy-trackings__item-title-project {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .lazy-trackings__item-title-summary {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-style: italic;
                border-top: 1px solid $primary-color-1;
                padding-top: .25em;
                margin-top: .25em;
            }
        }

        .lazy-trackings__item-value {
            padding: .25em;
            font-weight: bold;
            border-radius: $border-radius-sm;
            border: 1px solid $primary-color-1;
        }
    }

    .lazy-trackings__item:hover {
        background-color: $primary-color-2;
        cursor: pointer;
    }
}
</style>
