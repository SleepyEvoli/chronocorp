<template lang="html">
    <div class="subtask-list">
        <div class="subtask-list__add-settings">
            <div class="subtask-list__add-settings-due-date-name">
                <InputField
                    :value="newSubtaskName"
                    class="subtask-list__add-settings-input"
                    placeholder="Neuer Subtask"
                    @input="(event)=>newSubtaskName = event.target.value"
                    @keydown.enter="onCreateSubtask"
                />
            </div>
        </div>
        <List class="subtask-list__list">
            <ListItem
                v-for="subtask in subtasks"
                :key="subtask.id"
                :class="{ 'low-opacity': subtask.is_completed, 'subtask-list__item': true }"
                @click.right="onOpenContextMenu($event, subtask)"
            >
                <div class="subtask-list__item-header">
                    <span>Due:</span>
                    <InlineEditDateField
                        :value="subtask.due_on?.date_object" class="subtask-list__item-header-due-date"
                        @save="async (v)=>{
                            let tmpSubtask = subtask;
                            if (tmpSubtask.due_on) {
                                tmpSubtask.due_on.date_object = v;
                                await updateSubtask(props.projectId, props.taskId, tmpSubtask);
                            } else {
                                tmpSubtask.due_on = {
                                    date_object: v
                                };
                                await updateSubtask(props.projectId, props.taskId, tmpSubtask);
                            }
                    }"
                    />
                </div>
                <div class="subtask-list__item-body">
                    <Checkbox
                        :checked="subtask.is_completed"
                        class="subtask-list__item-checkbox"
                        @change="()=>{
                            changeSubtaskStatus(props.projectId, props.taskId, subtask);
                        }"
                    />
                    <InlineEditAreaField
                        :value="subtask.name"
                        class="subtask-list__item-body-content"
                        @save="async (v)=>{
                            const tmpSubtask = subtask;
                            tmpSubtask.name = v;
                            await updateSubtask(props.projectId, props.taskId, tmpSubtask);
                        }"
                    />
                </div>
                <div class="subtask-list__item-footer">
                    <div class="subtask-list__item-footer-assignee">
                        <InlineEditDropdownField
                            :list="userStore.users.map(user => ({
                                optionValue: user.id,
                                optionName: user.name
                            }))"
                            :value="subtask.assignee_id ?? userStore.loggedUser.id"
                            class="task-time-record-table__item-body-user-name"
                            @save="(v)=>{
                                const tmpSubtask = subtask;
                                tmpSubtask.assignee_id = v;
                                updateSubtask(props.projectId, props.taskId, tmpSubtask);
                            }"
                        />
                    </div>
                    <div class="subtask-list__item-footer-priority">
                        <InlineEditDropdownField
                            :list="labelStore.priorityList.map((priority)=>{
                                return {
                                    optionValue: priority,
                                    optionName: labelStore.getPriorityName(priority),
                                };
                            })"
                            :outline-color="labelStore.getPriorityColor(subtask.priority)"
                            :value="subtask.priority"
                            color="#FFF"
                            @save="(v)=>{
                                const tmpSubtask = subtask;
                                tmpSubtask.priority = v;
                                updateSubtask(props.projectId, props.taskId, tmpSubtask);
                            }"
                        />
                    </div>
                    <div class="subtask-list__item-footer-assignment-label">
                        <InlineEditDropdownField
                            :list="labelStore.assignmentLabels.map((label)=>{
                            return {
                                optionValue: label.id,
                                optionName: label.name,
                            };
                        })"
                            :outline-color="labelStore.getAssignmentLabelById(subtask.label_id)?.bg_color"
                            :value="subtask.label_id"
                            @save="(v)=>{
                                const tmpSubtask = subtask;
                                tmpSubtask.label_id = v;
                                updateSubtask(props.projectId, props.taskId, tmpSubtask);
                            }"
                        />
                    </div>
                </div>
            </ListItem>
        </List>
    </div>
</template>

<script lang="ts" setup>
import {defineProps, onMounted, ref, watch} from 'vue';
import List from '@/components/core/List.vue';
import {useContextMenuStore} from '@/stores/contextMenuStore';
import Checkbox from '@/components/core/Checkbox.vue';
import InputField from '@/components/core/InputField.vue';
import {Priority} from '@share/interfaces/activecollab/enums';
import type {User} from '@share/interfaces/activecollab/user';
import {useLabelStore} from '@/stores/labelStore';
import {useUserStore} from '@/stores/userStore';
import {useProjectStore} from '@/stores/projectStore';
import {useTaskStore} from '@/stores/taskStore';
import ListItem from '@/components/core/ListItem.vue';
import InlineEditDateField from '@/components/core/InlineEditDateField.vue';
import InlineEditAreaField from '@/components/core/InlineEditAreaField.vue';
import InlineEditDropdownField from '@/components/core/InlineEditDropdownField.vue';
import type {Subtask} from '@share/interfaces/activecollab/subtask';

const props = defineProps({
    projectId: {
        type: String,
        required: true,
    },
    taskId: {
        type: String,
        required: true,
    },
});

const contextMenuStore = useContextMenuStore();
const labelStore = useLabelStore();
const userStore = useUserStore();
const projectStore = useProjectStore();
const taskStore = useTaskStore();

const subtasks = ref<Subtask[]>([]);
const newSubtaskName = ref<string>('');
const newSubtaskPriority = ref<Priority>(Priority.NORMAL);
const projectUsers = ref<User[]>([]);
const dueDate = ref<Date | null>(null);
const newSubtaskAssigneeId = ref<string>('');

watch([() => props.projectId, () => props.taskId], async () => {
    await loadSubtasks(props.projectId, props.taskId);
});

const onCreateSubtask = async () => {
    const success = await taskStore.submitSubtaskCreate(props.projectId, props.taskId, newSubtaskName.value, newSubtaskAssigneeId.value, newSubtaskPriority.value, labelStore.defaultAssignmentLabelId, dueDate.value);
    if (success) {
        await loadSubtasks(props.projectId, props.taskId);
        newSubtaskName.value = '';
    }
};

const onOpenContextMenu = (event: MouseEvent, subtask: Subtask) => {
    contextMenuStore.openMenu(event, [
        {
            label: 'Delete',
            cb: async () => {
                await deleteSubtask(props.projectId, props.taskId, subtask.id);
            },
        },
    ]);
};

const loadSubtasks = async (projectId: string, taskId: string) => {
    console.log('loadSubtasks', projectId, taskId);
    subtasks.value = await taskStore.fetchSubtasks(projectId, taskId);
    subtasks.value = sortSubtasks(subtasks.value);
};

const deleteSubtask = async (projectId: string, taskId: string, subtaskId: string) => {
    if (await taskStore.submitSubtaskDelete(projectId, taskId, subtaskId)) {
        await loadSubtasks(projectId, taskId);
    }
};

const updateSubtask = async (projectId: string, taskId: string, subtask: Subtask) => {
    if (await taskStore.submitSubtaskUpdate(projectId, taskId, subtask)) {
        await loadSubtasks(projectId, taskId);
    }
};

const changeSubtaskStatus = async (projectId: string, taskId: string, subtask: Subtask) => {
    const res = await taskStore.submitSubtaskChangeComplete(projectId, taskId, subtask.id, subtask.is_completed);
    if (res) {
        await loadSubtasks(projectId, taskId);
    }
};

const sortSubtasks = (subtasks: Subtask[]) => {
    return subtasks.sort((a, b) => {
        if (a.is_completed && !b.is_completed) {
            return 1;
        }
        if (!a.is_completed && b.is_completed) {
            return -1;
        }
        return 0;
    });
};

onMounted(async () => {
    await loadSubtasks(props.projectId, props.taskId);
    projectUsers.value = userStore.users;
    newSubtaskAssigneeId.value = userStore.loggedUser.id;
    subtasks.value = sortSubtasks(subtasks.value);
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.subtask-list {
    color: $text-color;
    font-size: 0.9rem;
    gap: .5em;
    height: 100%;
    margin-top: 1em;
    overflow-y: auto;
    padding: 1em;
    display: flex;
    flex-direction: column;

    .subtask-list__list {
        display: flex;
        flex-direction: column;
        gap: 1em;
    }

    .subtask-list__item {
        display: flex;
        flex-direction: column;
        border-radius: $border-radius-sm;
        padding: .5em .5em 1.5em .5em;
        gap: 0.5em;
        font-size: .9em;
        background-color: $primary-color-3;
        border: 1px solid $primary-color-2;

        .subtask-list__item-header {
            width: 100%;
            display: flex;
            gap: .5em;

            .subtask-list__item-header-due-date {
                :deep(.inline-edit-date-field__display) {
                    display: flex;
                    gap: .5em;
                }
            }
        }

        .subtask-list__item-body {
            display: flex;
            width: 100%;

            .subtask-list__item-body-content {
                width: 100%;
            }
        }

        .subtask-list__item-footer {
            display: flex;
            gap: .5em;
            width: 100%;
            font-size: .85em;
            padding-top: .5em;
        }
    }

    .subtask-list__item:hover {
        background-color: $primary-color-2;
        cursor: pointer;
    }
}
</style>
