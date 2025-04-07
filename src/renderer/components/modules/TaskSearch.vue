<template lang="html">
    <div class="task-search">
        <div class="task-search__actions">
            <div class="info">Um die Tasks durchsuchen zu können, müssen diese geladen werden. Diese
                werden
                gespeichert. Dies
                wird etwas länger dauern. Neue Tasks werden nicht automatisch hinzugefügt.
            </div>
            <Button class="icon secondary task-search__action" @click="getAllTasks">
                <Icon icon-name="refresh"/>
            </Button>
        </div>
        <div class="task-search__task-count">
            {{ taskStore.taskSearchItems.length }} Tasks geladen
        </div>
        <SearchFuzzy
            :search-list="taskStore.taskSearchItems.map((item)=>item.name)"
            class='task-search__input'
            @filter="filterTaskNames"
        />
        <List class="task-search__list">

            <ListItem v-for="task in filteredTasks" :key="task.id" class="hover task-search__list-item">
                <router-link
                    :to="{name: 'task-detail', params: {
                        projectId: task.projectId,
                        taskId: task.taskId
                    }}"
                    class="task-search__list-item-link"
                >
                    <div class="task-search__list-item-link-project">{{ task.projectName }}</div>
                    <div class="task-search__list-item-link-task">{{ task.name }}</div>
                </router-link>
            </ListItem>
        </List>
    </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import SearchFuzzy from '@/components/modules/SearchFuzzy.vue';
import Button from '@/components/core/Button.vue';
import Icon from '@/components/core/Icon.vue';
import List from '@/components/core/List.vue';
import ListItem from '@/components/core/ListItem.vue';
import {useProjectStore} from '@/stores/projectStore';
import {useTaskStore} from '@/stores/taskStore';
import type {TaskSearchItem} from '@/interfaces';
import type {Task} from '@share/interfaces/activecollab/task';

const projectStore = useProjectStore();
const taskStore = useTaskStore();

const filteredTasks = ref<TaskSearchItem[]>([]);
// Using a map to quickly find the task by name
let taskMap = new Map(taskStore.taskSearchItems.map(item => [item.name, item]));

const getAllTasks = async () => {
    taskMap.clear();

    const max = 100000;

    taskStore.taskSearchItems = [];

    for (const project of projectStore.projects) {
        if (taskStore.taskSearchItems.length >= max) {
            break;
        }
        const tasks = await taskStore.fetchTasks(project.id);

        const items: TaskSearchItem[] = tasks.map((task: Task) => {
            return {
                id: task.id,
                name: task.name,
                projectId: project.id,
                projectName: project.name,
                taskId: task.task_id,
            };
        });

        taskStore.taskSearchItems.push(...items);
    }
    taskMap = new Map(taskStore.taskSearchItems.map(item => [item.name, item]));
};

const filterTaskNames = (taskNames: string[]) => {
    filteredTasks.value = taskNames.map(name => taskMap.get(name)).filter(item => item !== undefined);
};

</script>
<style lang="scss" scoped>
@use '@/styles/variables' as *;

.task-search {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    font-size: .8rem;
    width: 30em;

    .task-search__task-count {
        width: 100%;
        font-size: 0.75rem;
        color: $primary-color-1;
    }

    .task-search__input {
        width: 100%;
    }

    .task-search__actions {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .task-search__action {
            width: 2rem;
            height: 2rem;
        }
    }

    .task-search__list {
        max-height: 40rem;
        overflow-y: auto;

        .task-search__list-item-link {
            display: flex;
            flex-direction: column;
            justify-content: left;
            text-align: left;

            .task-search__list-item-link-project {
                width: 100%;
                font-size: 0.75rem;
                color: $primary-color-1;
            }

            .task-search__list-item-link-task {
                width: 100%;
                font-weight: bold;
                text-align: end;
            }
        }
    }
}
</style>
