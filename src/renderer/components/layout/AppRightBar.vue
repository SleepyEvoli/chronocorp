<template lang="html">
    <section class="app-right-bar">
        <div ref="componentContainerRef" class="app-right-bar__list">
            <Button
                v-for="(component) in components" :key="component.key"
                :title="component.title"
                :toggle="component.visibility.value"
                class="icon no-bg no-border app-right-bar__icon"
                @click="toggleComponent(component)"
            >
                <Icon :icon-name="component.icon"/>
            </Button>
            <div class="app-right-bar__component-containers">
                <template v-for="(component) in components" :key="component.key">
                    <div
                        v-if="component.visibility.value"
                        class="component-container-box"
                    >
                        <div class="app-right-bar__component-container-header">
                            <div class="component-container-box__header-icon">
                                <Icon :icon-name="component.icon"/>
                            </div>
                            <div class="component-container-box__header-text">
                                {{ component.title }}
                            </div>
                        </div>
                        <div class="app-right-bar__component-container-body">
                            <component :is="component.component"/>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import Icon from '@/components/core/Icon.vue';
import Button from '@/components/core/Button.vue';
import UserList from '@/components/modules/UserList.vue';
import type {Ref} from 'vue';
import {ref, watch} from 'vue';
import LazyTrackings from '@/components/modules/LazyTrackings.vue';
import RecentEvents from '@/components/modules/RecentEvents.vue';
import TaskSearch from '@/components/modules/TaskSearch.vue';
import TimeRecordHistory from '@/components/modules/TimeRecordHistory.vue';

const componentContainerRef = ref<HTMLDivElement | null>(null);

interface SidebarComponent {
    key: string;
    title: string;
    icon: string;
    component: any;
    visibility: Ref<boolean>;
}

const components: SidebarComponent[] = [
    {key: 'userList', title: 'Users', icon: 'people', component: UserList, visibility: ref(false)},
    {key: 'lazyTracking', title: 'Lazy Tracking', icon: 'rocket', component: LazyTrackings, visibility: ref(false)},
    {key: 'recentEvents', title: 'Recent Events', icon: 'history', component: RecentEvents, visibility: ref(false)},
    {key: 'taskSearch', title: 'Task Search', icon: 'search', component: TaskSearch, visibility: ref(false)},
    {
        key: 'timeRecordHistory',
        title: 'Time Record History',
        icon: 'overview',
        component: TimeRecordHistory,
        visibility: ref(false),
    },
];

watch(
    components.map((component) => component.visibility),
    () => {
        const anyComponentVisible = components.some((component) => component.visibility.value);
        if (anyComponentVisible) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }
    },
);

const toggleComponent = (component: SidebarComponent) => {
    const wasVisible = component.visibility.value; // Use .value for refs
    resetComponentVisibility();
    component.visibility.value = !wasVisible; // Toggle correctly
};

const resetComponentVisibility = () => {
    components.forEach((component) => {
        component.visibility.value = false; // Use .value for refs
    });
};

const handleClickOutside = (event: MouseEvent) => {
    const clickElement = event.target as HTMLElement;

    if (componentContainerRef.value
        && !componentContainerRef.value.contains(event.target as Node)
        && !clickElement.classList.contains('confirm-dialog__button')
        && !clickElement.classList.contains('context-menu-item')
    ) {
        resetComponentVisibility();
    }
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.app-right-bar {
    display: flex;
    flex-direction: column;
    width: 3em;
    height: 100vh;
    align-items: center;
    z-index: 80;
    border-left: 1px solid $primary-color-3;
    padding-top: 1em;
    background-color: $primary-color-6;

    @media (max-width: $breakpoint-tablet) {
        display: none;
    }

    .app-right-bar__list {
        display: flex;
        flex-direction: column;
        gap: 1em;
    }

    .app-right-bar__icon {
        :deep(svg) {
            fill: $primary-color-2;
            width: 1.5em;
            height: 1.5em;
        }

        :deep(svg):hover {
            fill: $primary-color-1;
        }
    }

    .app-right-bar__component-containers {
        position: absolute;
        max-height: 80vh;
        overflow-y: auto;
        right: calc(0rem + 3em);
        display: flex;
        flex-direction: column;
        gap: 1em;
        padding: 0.5em;

        .component-container-box {
            background: $primary-color-4;
            border-radius: $border-radius-md;
            padding: 1em;
            border: 1px solid $primary-color-2;

            .app-right-bar__component-container-header {
                font-size: 1em;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 0.5em;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid $primary-color-2;
            }

            .app-right-bar__component-container-body {
                padding-top: 0.5em;
                font-size: 0.9em;
            }
        }
    }
}
</style>
