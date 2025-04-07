<template lang="html">
    <section class="app-left-bar">
        <div class="app-left-bar__actions">
            <div class="app-left-bar__actions-toggle">
                <Button
                    class="icon secondary"
                    title="Toggle Menü"
                    @click="onToggle"
                >
                    <Icon iconName="arrowBack"/>
                </Button>
            </div>
        </div>
        <div class="app-left-bar-container">
            <div class="app-left-bar__column">
                <div class="app-left-bar__filter">
                    <SearchFuzzy
                        :search-list="projects.map((project)=>project.name)"
                        class="app-left-bar__filter-fuzzy"
                        placeholder="Search Projects"
                        @filter="(v)=>fuzzyProjectNames = v"
                    />
                    <div class="app-left-bar__filter-toggles">
                        <Button
                            v-for="filter in settingStore.projectFilters"
                            :key="filter.key"
                            :toggle="filter.state"
                            class="secondary no-border"
                            @click="()=>{filter.state = !filter.state}"
                        >
                            {{ filter.label }}
                        </Button>
                    </div>
                    <div class="app-left-bar__filter-dropdowns">
                        <div>
                            <Label>Company</label>
                            <SelectField
                                id="filter-company"
                                :options="companyStore.companies.map((company) => ({
                            optionValue: company.id,
                            optionName: company.name || 'Undefined'}
                        ))"
                                :value="onlyCompanyId"
                                class="app-left-bar__filter-dropdown"
                                @change="(event)=>onlyCompanyId = event.target.value"
                            />
                        </div>
                    </div>
                </div>
                <List class="app-left-bar__list">
                    <template v-for="project in filteredProjects" :key="project.id">
                        <ListItem
                            :class="{'app-left-bar__list-item': true, 'completed': project.is_completed}"
                            :data-project-id=project.id
                            role="button"
                            tabindex="0"
                            @click="(e) => {
                                onProjectListItemClick(project.id, e)
                            }"
                        >
                            <div class="app-left-bar__list-item-name">
                                {{ project.name }}
                            </div>
                            <div class="app-left-bar__list-item-buttons">
                                <Button
                                    :class="{
                                        'icon': true,
                                        'secondary': true,
                                        'app-left-bar__list-item-button': true,
                                        'red': project.is_favorite
                                }"
                                    title="Project favorisieren/nicht favorisieren"
                                    @click="(e)=>{
                                    e.stopPropagation();
                                    onFavorite(project);
                                }"
                                >
                                    <Icon icon-name="heart"/>
                                </Button>
                                <Button
                                    class="app-left-bar__list-item-button icon secondary"
                                    title="Neue Aufgabe erstellen"
                                    @click="(e) => {
                                        e.stopPropagation();
                                        focusedProjectId = project.id;
                                        createTaskVisible = !createTaskVisible
                                    }"
                                >
                                    <Icon icon-name="addTask"/>
                                </Button>
                            </div>
                        </ListItem>
                    </template>
                </List>
            </div>
            <div v-if="tasks.length > 0" class="app-left-bar__column task-list">
                <div class="app-left-bar__filter">
                    <SearchFuzzy
                        :search-list="tasks.map((task)=>task.name)"
                        class="app-left-bar__filter-fuzzy"
                        placeholder="Search Tasks"
                        @filter="(v)=>fuzzyTaskNames = v"
                    />
                    <div class="app-left-bar__filter-toggles">
                        <Button
                            v-for="filter in settingStore.taskFilters"
                            :key="filter.key"
                            :toggle="filter.state"
                            class="secondary no-border"
                            @click="()=>{filter.state = !filter.state}"
                        >
                            {{ filter.label }}
                        </Button>
                    </div>
                    <div class="app-left-bar__filter-dropdowns">
                        <div class="app-left-bar__filter-dropdown">
                            <Label>Status</Label>
                            <SelectField
                                id="filter-state"
                                :options="labelStore.stateList.map((state) => ({
                                optionValue: state,
                                optionName: labelStore.getStateName(state) || 'Undefined'
                            }))"
                                :value="onlyTasksState"
                                class="app-left-bar__filter-dropdown"
                                @change="(event)=>onlyTasksState = event.target.value"
                            >
                            </SelectField>
                        </div>
                        <div class="app-left-bar__filter-dropdown">
                            <Label>Assignment Label</Label>
                            <SelectField
                                id="filter-assignment-label"
                                :options="labelStore.assignmentLabels.map((label) => ({
                                optionValue: label.id,
                                optionName: label.name || 'Undefined'
                            }))"
                                :value="onlyLabelIdTasks"
                                class="app-left-bar__filter-dropdown"
                                @change="(event)=>onlyLabelIdTasks = event.target.value"
                            >
                            </SelectField>
                        </div>
                    </div>
                </div>
                <List class="app-left-bar__list">
                    <ListItem
                        v-for="task in filteredTasks"
                        :class="{'app-left-bar__list-item': true, 'completed': task.is_completed}"
                        :data-task-id=task.id
                        @click="onTaskListItemClick( task.project_id, task.task_id, $event)"
                    >
                        <div class="app-left-bar__list-item-name">
                            {{ task.name }}
                        </div>
                        <div class="app-left-bar__list-item-buttons">
                            <Button
                                :class="{
                                        'icon': true,
                                        'secondary': true,
                                        'app-left-bar__list-item-button': true,
                                        'red': task.is_favorite
                                }"
                                title="Task favorisieren/nicht favorisieren"
                                @click="(e)=>{
                                    e.stopPropagation();
                                    onFavorite(task);
                                }"
                            >
                                <Icon icon-name="heart"/>
                            </Button>
                            <Button
                                class="icon blue app-left-bar__list-item-button primary"
                                title="Tracking Eintrag hinzufügen"
                                @click="(e)=>{
                                        e.stopPropagation();
                                        onAddTracking(task)}
                                ">
                                <Icon icon-name="plus"/>
                            </Button>
                            <Button
                                class="icon blue app-left-bar__list-item-button primary"
                                title="Task Pinnen"
                                @click="onPinTask($event, task)"
                            >
                                <Icon icon-name="pin"/>
                            </Button>
                        </div>
                    </ListItem>
                </List>
            </div>
        </div>
    </section>
    <BoxFocus
        v-if="createTaskVisible && focusedProjectId"
        :is-closeable="true"
        class="create-task"
        @close="createTaskVisible = false"
    >
        <TaskCreate :project-id="focusedProjectId"/>
    </BoxFocus>
</template>

<script lang="ts" setup>
import Icon from '@/components/core/Icon.vue';
import List from '@/components/core/List.vue';
import ListItem from '@/components/core/ListItem.vue';
import Button from '@/components/core/Button.vue';
import {onMounted, ref, watch} from 'vue';
import type {Project} from '@share/interfaces/activecollab/project';
import type {Task} from '@share/interfaces/activecollab/task';
import {useRouter} from 'vue-router';
import SearchFuzzy from '@/components/modules/SearchFuzzy.vue';
import {useTrackingStore} from '@/stores/trackingStore';
import {Priority, State} from '@share/interfaces/activecollab/enums';
import {useCompanyStore} from '@/stores/companyStore';
import {useProjectStore} from '@/stores/projectStore';
import {useLabelStore} from '@/stores/labelStore';
import {useTaskStore} from '@/stores/taskStore';
import BoxFocus from '@/components/core/BoxFocus.vue';
import TaskCreate from '@/components/modules/TaskCreate.vue';
import SelectField from '@/components/core/SelectField.vue';
import Label from '@/components/core/Label.vue';
import {useSettingStore} from '@/stores/settingStore';

const trackingStore = useTrackingStore();
const labelStore = useLabelStore();
const projectStore = useProjectStore();
const companyStore = useCompanyStore();
const taskStore = useTaskStore();
const settingStore = useSettingStore();

const router = useRouter();

const projects = ref<Project[]>(projectStore.projects);
const filteredProjects = ref<Project[]>([]);
const fuzzyProjectNames = ref<string[]>([]);
const focusedProjectId = ref<string>();
const onlyProjectState = ref<State>(State.IS_ACTIVE);
const onlyCompanyId = ref<string>();

const fuzzyTaskNames = ref<string[]>([]);
const filteredTasks = ref<Task[]>([]);
const tasks = ref<Task[]>([]);
const onlyTasksState = ref<State>(State.IS_ACTIVE);
const onlyTasksPriority = ref<Priority>(Priority.NORMAL);
const onlyLabelIdTasks = ref<string>('');
const createTaskVisible = ref(false);

const filterProjects = () => {
    filteredProjects.value = [...projects.value];

    if (fuzzyProjectNames.value.length > 0) {
        filteredProjects.value = filteredProjects.value.filter((project) => {
            return fuzzyProjectNames.value.includes(project.name);
        });
    }
    if (settingStore.projectFilters.find(f => f.key === 'assigned')?.state) {
        filteredProjects.value = filteredProjects.value.filter((project) =>
            taskStore.myTasks.map((task) => task.project_id).includes(project.id));
    }
    if (settingStore.projectFilters.find(f => f.key === 'complete')?.state) {
        filteredProjects.value = filteredProjects.value.filter((project) => {
            return project.is_completed;
        });
    }
    if (settingStore.projectFilters.find(f => f.key === 'incomplete')?.state) {
        filteredProjects.value = filteredProjects.value.filter((project) => {
            return !project.is_completed;
        });
    }
    if (settingStore.projectFilters.find(f => f.key === 'favorite')?.state) {
        filteredProjects.value = filteredProjects.value.filter((project) => {
            return project.is_favorite;
        });
    }
    if (onlyProjectState.value) {
        filteredProjects.value = filteredProjects.value.filter((project) => {
            return project.state == onlyProjectState.value;
        });
    }
    if (onlyCompanyId.value) {
        filteredProjects.value = filteredProjects.value.filter((project) => {
            return project.company_id == onlyCompanyId.value;
        });
    }
};

const filterTasks = () => {
    filteredTasks.value = tasks.value;
    if (fuzzyTaskNames.value.length > 0) {
        filteredTasks.value = filteredTasks.value.filter((task) => {
            return fuzzyTaskNames.value.includes(task.name);
        });
    }
    if (settingStore.taskFilters.find(f => f.key === 'assigned')?.state) {
        filteredTasks.value = filteredTasks.value.filter((task) =>
            taskStore.myTasks.map((task) => task.id).includes(task.id));
    }
    if (settingStore.taskFilters.find(f => f.key === 'complete')?.state) {
        filteredTasks.value = filteredTasks.value.filter((task) => {
            return task.is_completed;
        });
    }
    if (settingStore.taskFilters.find(f => f.key === 'incomplete')?.state) {
        filteredTasks.value = filteredTasks.value.filter((task) => {
            return !task.is_completed;
        });
    }
    if (onlyTasksPriority.value) {
        filteredTasks.value = filteredTasks.value.filter((task) => {
            return task.priority == onlyTasksPriority.value;
        });
    }
    if (onlyLabelIdTasks.value) {
        filteredTasks.value = filteredTasks.value.filter((task) => {
            return task.label_id == onlyLabelIdTasks.value;
        });
    }
    if (settingStore.taskFilters.find(f => f.key === 'favorite')?.state) {
        filteredTasks.value = filteredTasks.value.filter((task) => {
            return task.is_favorite;
        });
    }
};

watch([fuzzyProjectNames, onlyCompanyId, ...settingStore.projectFilters], filterProjects);
watch([fuzzyTaskNames, onlyTasksPriority, onlyLabelIdTasks, ...settingStore.taskFilters], filterTasks);

watch(tasks, () => {
    filterTasks();
});

watch(projects, () => {
    filterProjects();
});

// keep highlight of a clicked item
const highlightItem = (target: any) => {
    const old = target.closest('.app-left-bar__list').querySelector('.app-left-bar__list-item.clicked');
    if (old) {
        old.classList.remove('clicked');
    }

    const el = target.closest('.app-left-bar__list .app-left-bar__list-item');
    if (el) {
        el.classList.add('clicked');
    }
};

const removeTaskHighlights = () => {
    const old = document.querySelector('.app-left-bar__column.task-list')?.querySelector('.app-left-bar__list-item.clicked');
    if (old) {
        old.classList.remove('clicked');
    }
};

const onProjectListItemClick = async (projectId: string, event: any) => {
    removeTaskHighlights();
    focusedProjectId.value = projectId;
    highlightItem(event.target);
    await getTasks(projectId);
};

const onTaskListItemClick = async (projectId: string, taskId: string, event: any) => {
    highlightItem(event.target);
    await directToTaskDetail(projectId, taskId);
};

const getTasks = async (projectId: string) => {
    tasks.value = await taskStore.fetchTasks(projectId);
};

const directToTaskDetail = async (projectId: string, taskId: string) => {
    await router.push({name: 'task-detail', params: {taskId: taskId, projectId: projectId}});
};

const onToggle = () => {
    const appListingMain = document.querySelector('.app-left-bar-container');
    const listToggle = document.querySelector('.app-left-bar__actions-toggle');

    if (appListingMain && listToggle) {
        if (appListingMain.classList.contains('open')) {
            appListingMain.classList.remove('open');
            listToggle.classList.remove('open');
            // Need to close the sidebar when clicking outside of it
            document.querySelector('main')?.removeEventListener('click', onToggle);

        } else {
            appListingMain.classList.add('open');
            listToggle.classList.add('open');
            // Need to close the sidebar when clicking outside of it
            document.querySelector('main')?.addEventListener('click', onToggle);
        }
    }
};

const onPinTask = (event: Event, task: Task) => {
    event.stopPropagation();
    if (task) {
        trackingStore.addPinnedTask(task);
    }
};

const onAddTracking = (task: Task) => {
    const tracking = trackingStore.createTracking(task);
    if (tracking) {
        trackingStore.addTracking(tracking);
        trackingStore.focusedTracking = tracking;
    }
};

const onFavorite = async (object: Project | Task) => {
    let success;

    if (object.class === 'Project') {
        if (object.is_favorite) {
            success = await projectStore.removeFavoriteProject(object.id);
        } else {
            success = await projectStore.addFavoriteProject(object.id);
        }
        if (success) {
            object.is_favorite = !object.is_favorite;
        }
    } else if (object.class === 'Task') {
        if (object.is_favorite) {
            success = await taskStore.removeFavoriteTask(object.id);
        } else {
            success = await taskStore.addFavoriteTask(object.id);
        }
        if (success) {
            object.is_favorite = !object.is_favorite;
        }
    }
};

onMounted(async () => {
    filteredProjects.value = [...projects.value];
    filterProjects();
    filterTasks();
});
</script>
<style lang="scss" scoped>
@use '@/styles/variables' as *;

.app-left-bar {
    color: $primary-color-0;
    display: flex;
    font-size: .8rem;
    height: 100vh;
    z-index: 90;

    @media (max-width: $breakpoint-tablet) {
        font-size: .8em;
    }

    .app-left-bar__actions {
        align-items: center;
        background-color: $primary-color-10;
        border-right: 1px solid $primary-color-7;
        display: flex;
        flex-direction: column;
        gap: 1em;
        padding: 0 .25em;

        .app-left-bar__actions-toggle {
            background-color: $primary-color-7;
            border-radius: .5em;
            cursor: pointer;
            height: 1.5em;
            margin-top: 1em;
            transform: rotate(-180deg);
            width: 1.5em;
        }

        .app-left-bar__actions-toggle.open {
            transform: rotate(0);
        }
    }

    .app-left-bar__column {
        background-color: $primary-color-10;
        flex-direction: column;
        overflow-y: auto;
        width: 30em;

        @media (max-width: $breakpoint-tablet) {
            width: 22em;
            font-size: .85em;
        }

        .app-left-bar__filter {
            display: flex;
            flex-direction: column;
            gap: .5em;
            padding: .5em;

            .app-left-bar__filter-fuzzy {
                padding: .5em;

                :deep(input) {
                    border-radius: .1em;
                    padding: .5em;
                }
            }

            .app-left-bar__filter-toggles {
                display: flex;
                flex-wrap: wrap;
                gap: .5em;
            }

            .app-left-bar__filter-dropdowns {
                margin: .5em 0;
                display: flex;
                gap: 1em;
            }
        }
    }

    .app-left-bar__column.task-list {
        background-color: $primary-color-8;
        border-left: 1px solid $primary-color-4;

        .app-left-bar__list-item:hover {
            background-color: $primary-color-4;
        }
    }

    .app-left-bar__list {
        display: flex;
        flex-direction: column;

        .app-left-bar__list-item {
            align-items: center;
            display: flex;
            gap: 1em;
            justify-content: space-between;
            padding: .5em 1.25em;

            .app-left-bar__list-item-buttons {
                display: flex;
                gap: .5em;

                .app-left-bar__list-item-button {
                    flex: 0 0 auto;
                    height: 1.5em;
                    width: 1.5em;
                }
            }
        }

        .app-left-bar__list-item.clicked {
            background-color: $primary-color-4;
        }

        .app-left-bar__list-item:hover {
            background-color: $primary-color-8;
            cursor: pointer;
        }

        .app-left-bar__list-item.completed {
            opacity: .5;
        }
    }

    .app-left-bar-container {
        display: none;
        height: 100vh;
    }

    .app-left-bar-container.open {
        display: flex;
    }
}
</style>
