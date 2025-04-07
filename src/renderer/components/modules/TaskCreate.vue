<template lang="html">
    <div class="task-add">
        <div class="task-add__body">
            <div class="task-add__body-main">
                <InputField
                    :value="taskRequest.requestData.task.name"
                    class="task-add__body-main-title"
                    placeholder="Task Name"
                    @input="(event)=>taskRequest.requestData.task.name = event.target.value"
                />
                <RichTextArea
                    id="task-create-editor"
                    :value="taskRequest.requestData.task.body"
                    @save="(v)=>taskRequest.requestData.task.body = v"
                />
            </div>
            <div class="task-add__options">
                <div class="task-add__option">
                    <Label>Priorität</label>
                    <SelectField
                        :options="labelStore.priorityList.map((priority) => ({
                            optionValue: priority.toString(),
                            optionName: labelStore.getPriorityName(priority)
                        }))"
                        :value="taskRequest.requestData.task.priority"
                        @change="(event)=>taskRequest.requestData.task.priority = event.target.value"
                    />
                </div>
                <div v-if="taskCategories" class="task-add__option">
                    <Label>Kategorie</label>
                    <SelectField
                        :options="taskCategories.map((category) => ({
                            optionValue: category.id,
                            optionName: category.name
                        }))"
                        :value="taskRequest.requestData.task.category_id"
                        @change="(event)=>taskRequest.requestData.task.category_id = event.target.value"
                    />
                </div>
                <div class="task-add__option">
                    <Label>Sichtbarkeit</label>
                    <SelectField
                        :options="labelStore.visibilityList.map((visibility) => ({
                            optionValue: visibility,
                            optionName: labelStore.getVisibilityName(visibility)
                        }))"
                        :value="taskRequest.requestData.task.visibility"
                        @change="(event)=>taskRequest.requestData.task.visibility = event.target.value"
                    />
                </div>
                <div class="task-add__option">
                    <div class="task-add__option-estimate">
                        <Label>Zeitschätzung</label>
                        <InputField
                            :value="taskRequest.requestData.task.estimate_value?.toString()"
                            placeholder="Geschätzte Zeit"
                            @input="(event)=>taskRequest.requestData.task.estimate_value = event.target.value"
                        />
                        <Label>Job Type</label>
                        <SelectField
                            :options="labelStore.jobTypes.map((jobType) => ({
                                optionValue: jobType.id,
                                optionName: jobType.name
                            }))"
                            :value="taskRequest.requestData.task.estimate_job_type_id"
                            @change="(event)=>taskRequest.requestData.task.estimate_job_type_id = event.target.value"
                        />
                    </div>
                </div>
                <div class="task-add__option">
                    <Label>Assignment Label</label>
                    <SelectField
                        :options="labelStore.assignmentLabels.map((assignmentLabel) => ({
                            optionValue: assignmentLabel.id,
                            optionName: assignmentLabel.name
                        }))"
                        :value="taskRequest.requestData.task.label_id"
                        @change="(event)=>taskRequest.requestData.task.label_id = event.target.value"
                    />
                </div>
                <div class="task-add__option">
                    <div class="task-add__option-date">
                        <div class="task-add__option-date-label">Start am:</div>
                        <InlineEditDateField
                            :value="taskRequest.requestData.task.start_on"
                            class=""
                            @save="(v)=>taskRequest.requestData.task.start_on = v"
                        />
                    </div>
                </div>
                <div class="task-add__option">
                    <div class="task-add__option-date">
                        <div class="task-add__option-date-label">Ende am:</div>
                        <InlineEditDateField
                            :value="taskRequest.requestData.task.due_on"
                            @save="(v)=>taskRequest.requestData.task.due_on = v"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="task-add__footer">
            <div class="task-add__footer-actions">
                <Button class="primary" @click="async()=>{
                    await taskStore.submitTaskCreate(toRaw(taskRequest));
                }">Erstellen
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {defineProps, onMounted, ref, toRaw} from 'vue';
import InputField from '@/components/core/InputField.vue';
import {useLabelStore} from '@/stores/labelStore';
import SelectField from '@/components/core/SelectField.vue';
import {useUserStore} from '@/stores/userStore';
import type {TaskRequestCreate} from '@share/interfaces/activecollab/post/task';
import Button from '@/components/core/Button.vue';
import InlineEditDateField from '@/components/core/InlineEditDateField.vue';
import type {Category} from '@share/interfaces/activecollab/system';
import {useTaskStore} from '@/stores/taskStore';
import RichTextArea from '@/components/core/RichTextArea.vue';
import Label from '@/components/core/Label.vue';

const props = defineProps({
    projectId: {
        type: String,
        required: true,
    },
});

const labelStore = useLabelStore();
const userStore = useUserStore();
const taskStore = useTaskStore();

const taskCategories = ref<Category[]>();
const taskRequest = ref<TaskRequestCreate>({
    projectId: props.projectId,
    requestData: {
        task: {
            name: 'Lorem Ipsum',
            body: '',
            category_id: '0',
            milestone_id: '0',
            priority: 0,
            visibility: 0,
            start_on: new Date(),
            due_on: null,
            estimate_value: 0,
            estimate_job_type_id: taskStore.defaultJobTypeId,
            label_id: labelStore.defaultAssignmentLabelId,
            other_assignees: [],
            assignee_id: userStore.loggedUser!.id,
        },
        submitted: 'submitted',
    },
});

onMounted(async () => {
    taskCategories.value = await labelStore.fetchTaskCategories(props.projectId);
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.task-add {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .label {
        padding-left: 0;
    }

    .task-add__options {
        display: flex;
        flex-direction: column;
        font-size: 0.8em;
        gap: 1rem;

        .task-add__option {
            align-items: center;

            .task-add__option-estimate {
                background-color: $primary-color-3;
                padding: 0.5rem;
                border-radius: $border-radius-md;
                display: flex;
                gap: 0.5rem;
                flex-direction: column;
            }

            .task-add__option-date {
                display: flex;
                flex-direction: row;
                gap: 1rem;
                align-items: center;
                align-self: center;

                .task-add__option-date-label {
                    display: flex;
                    align-items: center;
                    white-space: nowrap;
                    font-size: 0.9em;
                    padding-right: 1rem;
                }
            }
        }

    }

    .task-add__body {
        display: flex;
        gap: 1rem;

        .task-add__body-main {
            display: flex;
            flex-direction: column;
            width: 45rem;
            gap: 1rem;
            height: fit-content;

            .task-add__body-main-title {
                font-size: 1.5em;
            }
        }
    }

    .task-add__footer {
        display: flex;
        justify-content: flex-end;
    }
}
</style>
