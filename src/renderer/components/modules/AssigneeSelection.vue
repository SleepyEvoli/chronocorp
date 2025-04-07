<template>
    <div class="assignee-selection">
        <table class="assignee-selection__table">
            <thead>
            <tr class="assignee-selection__header">
                <th v-for="icon in ['mail', 'person', 'assignee']" :key="icon">
                    <div class="assignee-selection__header-icon">
                        <Icon :icon-name="icon"/>
                    </div>
                </th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="user in projectUsers"
                :key="user.id"
                class="assignee-selection__row"
            >
                <td class="assignee-selection__row-checkbox">
                    <Checkbox
                        :checked="isSubscribed(user.id) || subscribersToAdd.includes(user.id)"
                        @change="(e)=>toggleSubscription(e, user.id)"
                    />
                </td>
                <td class="assignee-selection__row-checkbox">
                    <Checkbox
                        :checked="editedOtherAssignees.includes(user.id)"
                        @change="toggleOtherAssignee(user.id)"
                    />
                </td>
                <td>
                    <Radio
                        :checked="user.id === editedMainAssignee"
                        name="main-assignee"
                        @change="() => (editedMainAssignee = user.id)"
                    />
                </td>
                <td class="assignee-selection__row-username">
                    {{ user.name }}
                </td>
            </tr>
            </tbody>
        </table>
        <div v-if="showSaveCancel" class="assignee-selection__actions">
            <Button
                class="assignee-selection__action secondary"
                title="Speichern"
                @click="async () => {
                    await save();
                }"
            >
                <Icon icon-name="check"/>
            </Button>
            <Button
                class="assignee-selection__action secondary"
                title="Abbrechen"
                @click="async () => {
                    await reload();
                }"
            >
                <Icon icon-name="close"/>
            </Button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref, watch} from 'vue';
import type {Task} from '@share/interfaces/activecollab/task';
import {useTaskStore} from '@/stores/taskStore';
import Checkbox from '@/components/core/Checkbox.vue';
import Icon from '@/components/core/Icon.vue';
import Radio from '@/components/core/Radio.vue';
import Button from '@/components/core/Button.vue';
import {User} from '@share/interfaces/activecollab/user';
import {areArraysEqual} from '@/utils';
import {useProjectStore} from '@/stores/projectStore';

const props = defineProps({
    task: {
        type: Object as () => Task,
        required: true,
    },
});

const emit = defineEmits(['save']);

const taskStore = useTaskStore();
const projectStore = useProjectStore();

const subscribersToAdd = ref<string[]>([]);
const subscribersToRemove = ref<string[]>([]);
const editedOtherAssignees = ref<string[]>([]);
const editedMainAssignee = ref<string>('');
const projectUsers = ref<User[]>([]);

const task = ref<Task>(props.task);

const showSaveCancel = computed(() => {
    return subscribersToAdd.value.length > 0 ||
        subscribersToRemove.value.length > 0 ||
        !areArraysEqual(editedOtherAssignees.value, task.value.other_assignee_ids || []) ||
        editedMainAssignee.value !== task.value.assignee?.id;
});

watch(() => props.task, async (newTask) => {
    task.value = newTask;
    await reload();
});

const resetAssignmentsAndSubscriptions = () => {
    editedOtherAssignees.value = [...(task.value.other_assignee_ids ?? [])];
    editedMainAssignee.value = task.value.assignee?.id ?? '';
    subscribersToAdd.value = [];
    subscribersToRemove.value = [];
};

const isSubscribed = (userId: string) => {
    if (task.value.subscribers) {
        return task.value.subscribers.some((s) => s.id === userId);
    } else {
        return false;
    }
};

const toggleSubscription = (checked: boolean, userId: string) => {

    if (checked) {
        if (isSubscribed(userId)) {
            subscribersToRemove.value = subscribersToRemove.value.filter((id) => id !== userId);
            subscribersToAdd.value = subscribersToAdd.value.filter((id) => id !== userId);
        } else {
            subscribersToAdd.value.push(userId);
            subscribersToRemove.value = subscribersToRemove.value.filter((id) => id !== userId);
        }
    } else {
        if (!isSubscribed(userId)) {
            subscribersToAdd.value = subscribersToAdd.value.filter((id) => id !== userId);
            subscribersToRemove.value = subscribersToRemove.value.filter((id) => id !== userId);

        } else {
            subscribersToRemove.value.push(userId);
            subscribersToAdd.value = subscribersToAdd.value.filter((id) => id !== userId);
        }
    }
};

const toggleOtherAssignee = (userId: string) => {
    if (editedOtherAssignees.value.includes(userId)) {
        editedOtherAssignees.value = editedOtherAssignees.value.filter((id) => id !== userId);
    } else {
        editedOtherAssignees.value.push(userId);
    }
};

const save = async () => {
    if ((editedMainAssignee.value !== task.value.assignee?.id) || (!areArraysEqual(editedOtherAssignees.value, task.value.other_assignee_ids || []))) {
        await taskStore.submitChangeAssignee(task.value.project_id, task.value.task_id, editedMainAssignee.value, editedOtherAssignees.value);
    }

    if (subscribersToAdd.value.length > 0 || subscribersToRemove.value.length > 0) {
        await Promise.all([
            taskStore.submitNewSubscribers(task.value.project_id, task.value.task_id, subscribersToAdd.value),
            taskStore.submitRemoveSubscribers(task.value.project_id, task.value.task_id, subscribersToRemove.value),
        ]);
    }

    await reload();
};

const reload = async () => {
    // Reload task is heavy, but otherwise the subscribers will not be updated.
    // However, we could also update the task manually
    const res = await taskStore.fetchTaskById(task.value.project_id, task.value.task_id);
    if (res) {
        task.value = res;
    }

    resetAssignmentsAndSubscriptions();
    projectUsers.value = []; // Clear, otherwise Template will not update
    projectUsers.value = await projectStore.fetchProjectUsers(task.value.project_id);
};

onMounted(async () => {
    resetAssignmentsAndSubscriptions();
    projectUsers.value = await projectStore.fetchProjectUsers(task.value.project_id);
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.assignee-selection {
    display: flex;
    flex-direction: column;
    font-size: .8rem;
    gap: .25em;

    .assignee-selection__header th {
        padding-left: 0;
    }

    .assignee-selection__header-icon {
        height: 1.25em;
        width: 1.25em;
    }

    .assignee-selection__row :deep(input) {
        margin-left: 0;
    }

    .assignee-selection__actions {
        display: flex;
        gap: .5em;

        .assignee-selection__action {
            width: 1.5em;
            height: 1.5em;
            padding: 0;
        }
    }

    .assignee-selection__row-username {
        white-space: nowrap;
    }
}
</style>
