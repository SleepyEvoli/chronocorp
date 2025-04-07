import {ref} from 'vue';
import {defineStore} from 'pinia';
import {MyTask, Task} from '@share/interfaces/activecollab/task';
import {Comment} from '@share/interfaces/activecollab/comment';
import type {
    CommentRequestCreate,
    CommentRequestDelete,
    CommentRequestUpdate,
} from '@share/interfaces/activecollab/post/comment';
import type {
    ChangeAssigneeRequest,
    ChangeAssignmentLabelRequest,
    SubscribeRequest,
    TaskRequestComplete,
    TaskRequestCreate,
    TaskRequestDelete,
    TaskRequestReopen,
} from '@share/interfaces/activecollab/post/task';
import {useLabelStore} from '@/stores/labelStore';
import type {Attachment} from '@share/interfaces/activecollab/attachment';
import {useAttachmentStore} from '@/stores/attachmentStore';
import type {
    SubtaskRequestComplete,
    SubtaskRequestCreate,
    SubtaskRequestDelete,
    SubtaskRequestReopen,
    SubtaskRequestUpdate,
} from '@share/interfaces/activecollab/post/subtask';
import type {Subtask} from '@share/interfaces/activecollab/subtask';
import {useEventStore} from '@/stores/eventStore';
import {useLoadingStore} from '@/stores/loadingStore';
import type {TaskNote, TaskSearchItem} from '@/interfaces';
import {FavoriteAdd, FavoriteRemove} from '@share/interfaces/activecollab/post/favorite';
import {useUserStore} from '@/stores/userStore';

export const useTaskStore = defineStore('task', () => {
    const labelStore = useLabelStore();
    const attachmentStore = useAttachmentStore();
    const eventStore = useEventStore();
    const userStore = useUserStore();

    const taskSearchItems = ref<TaskSearchItem[]>([]);
    const myTasks = ref<MyTask[]>([]);
    const taskNotes = ref<TaskNote[]>([]);

    const defaultCategoryId = '0';
    const defaultMilestoneId = '0';
    const defaultPriority = 0;
    const defaultVisibility = 0;
    const defaultJobTypeId = '0';
    const defaultAssigneeId = '0';

    const loadingStore = useLoadingStore();

    const init = async (): Promise<void> => {
        myTasks.value = await fetchMyTasks();
    };

    const getTaskNote = (taskId: string): TaskNote | undefined => {
        console.log('TaskNotes:', taskNotes.value);
        return taskNotes.value.find((note) => note.taskId === taskId);
    };

    const setTaskNote = (taskId: string, content: string): void => {
        const note = getTaskNote(taskId);
        if (note) {
            note.content = content;
        } else {
            taskNotes.value.push({taskId, content});
        }
    };

    const fetchTasks = async (projectId: string): Promise<Task[]> => {
        loadingStore.setLoading(true);

        try {
            const res = await window.electron.api.getTasks(projectId);

            if (!res.success) {
                throw new Error(`Error at fetching Tasks: ${res.error}`);
            }

            console.log('Tasks fetched:', res.data);

            return res.data as Task[];
        } catch (error) {
            console.error(error);
            return [];
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const fetchMyTasks = async (): Promise<MyTask[]> => {
        loadingStore.setLoading(true);
        try {
            const res = await window.electron.api.getMyTasks();

            if (!res.success) {
                throw new Error(`Error at fetching My Tasks: ${res.error}`);
            }

            // Flatten the object structure because original data is nested in "project-1234"{"assignments":...}
            const arr = [] as MyTask[];
            Object.keys(res.data).forEach((key) => {
                Object.keys(res.data[key]['assignments']).forEach((subKey) => {
                    arr.push(res.data[key]['assignments'][subKey]);
                });
            });
            console.log('My tasks fetched:', arr);
            return arr;
        } catch (error) {
            console.error(error);
            return [];
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const fetchTaskById = async (projectId: string, taskId: string): Promise<Task | null> => {
        loadingStore.setLoading(true);
        try {
            const res = await window.electron.api.getTask(projectId, taskId);

            if (!res.success) {
                throw new Error(`Error at fetching Task by ID: ${res.error}`);
            }

            console.log('Task fetched:', res.data);
            return res.data as Task;
        } catch (error) {
            console.error(error);
            return null;
        } finally {
            loadingStore.setLoading(false);
        }
    };
    const fetchComments = async (projectId: string, taskId: string): Promise<Comment[]> => {
        loadingStore.setLoading(true);
        try {
            const res = await window.electron.api.getTaskComments(projectId, taskId);

            if (!res.success) {
                throw new Error(`Failed to fetch comments: ${res.error}`);
            }

            return res.data as Comment[];
        } catch (error) {
            console.error(error);
            return [];
        } finally {
            loadingStore.setLoading(false);
        }
    };
    const fetchSubtasks = async (projectId: string, taskId: string): Promise<Subtask[]> => {
        loadingStore.setLoading(true);
        try {
            const res = await window.electron.api.getTaskSubtasks(projectId, taskId);

            if (!res.success) {
                throw new Error(`Failed to fetch subtasks: ${res.error}`);
            }

            return res.data as Subtask[];
        } catch (error) {
            console.error(error);
            return [];
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const submitTaskCreate = async (request: TaskRequestCreate): Promise<boolean> => {
        loadingStore.setLoading(true);
        try {
            const res = await window.electron.api.createTask(request);

            if (!res.success) {
                throw new Error(`Failed to create task: ${res.error}`);
            }

            console.log('Task created');
            eventStore.createEventNotification('Task erstellt', request.requestData.task.name);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const submitTaskUpdate = async (task: Task): Promise<boolean> => {
        loadingStore.setLoading(true);
        try {
            const res = await window.electron.api.updateTask({
                taskId: task.task_id,
                projectId: task.project_id,
                requestData: {
                    task: {
                        name: task.name,
                        body: task.body,
                        category_id: task.category_id ?? defaultCategoryId,
                        milestone_id: task.milestone_id ?? defaultMilestoneId,
                        priority: task.priority,
                        visibility: task.visibility ?? defaultVisibility,
                        start_on: task.start_on ? task.start_on.date_object : undefined,
                        due_on: task.due_on ? task.due_on.date_object : null,
                        estimate_value: task.estimate ? task.estimate.value : undefined,
                        attachments: {
                            pending_parent: [],
                        },
                        estimate_job_type_id: task.estimate ? task.estimate.job_type_id : defaultJobTypeId,
                        label_id: task.label_id ?? labelStore.defaultAssignmentLabelId,
                        other_assignees: task.other_assignees ? task.other_assignees.map((assignee) => assignee.id) : [],
                        assignee_id: task.assignee_id ? task.assignee_id : defaultAssigneeId,
                        subscribers: task.subscribers ? task.subscribers.map((subscriber) => subscriber.id) : [],
                    },
                    submitted: 'submitted',
                },
            });

            if (!res.success) {
                throw new Error(`Failed to update task: ${res.error}`);
            }

            console.log('Task updated');
            eventStore.createEventNotification('Task aktualisiert', task.name);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const submitTaskComplete = async (projectId: string, taskId: string): Promise<boolean> => {
        loadingStore.setLoading(true);
        try {
            const requestData: TaskRequestComplete = {
                projectId: projectId,
                taskId: taskId,
                requestData: {
                    submitted: 'submitted',
                },
            };
            const res = await window.electron.api.completeTask(requestData);

            if (!res.success) {
                eventStore.createEventNotification('Error', `Task konnte nicht abgeschlossen werden. ProjektID: ${projectId} TaskID: ${taskId}`);
                throw new Error(`Failed to complete task: ${res.error}`);
            }

            console.log('Task completed:', res.data);
            eventStore.createEventNotification('Task abgeschlossen', res.data.name);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const submitTaskReopen = async (projectId: string, taskId: string): Promise<boolean> => {
        loadingStore.setLoading(true);
        try {
            const requestData: TaskRequestReopen = {
                projectId: projectId,
                taskId: taskId,
                requestData: {
                    submitted: 'submitted',
                },
            };

            const res = await window.electron.api.reopenTask(requestData);

            if (!res.success) {
                eventStore.createEventNotification('Error', `Task konnte nicht wieder geöffnet werden ProjektID: ${projectId} TaskID ${taskId}`);
                throw new Error(`Failed to reopen task: ${res.error}`);
            }

            console.log('Task reopened:', res.data);
            eventStore.createEventNotification('Task wieder geöffnet', res.data.name);
            return true;
        } catch (error) {
            console.error('Exception during task reopening:', error);
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const submitTaskDelete = async (projectId: string, taskId: string): Promise<boolean> => {
        loadingStore.setLoading(true);
        try {
            const requestData: TaskRequestDelete = {
                projectId: projectId,
                taskId: taskId,
                requestData: {
                    submitted: 'submitted',
                },
            };

            const res = await window.electron.api.deleteTask(requestData);

            if (!res.success) {
                eventStore.createEventNotification('Error', `Task konnte nicht gelöscht werden. ProjektID: ${projectId} TaskID: ${taskId}`);
                throw new Error(`Failed to delete task: ${res.error}`);
            }

            console.log('Task deleted:', res.data);
            eventStore.createEventNotification('Task gelöscht', res.data.name);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const addFavoriteTask = async (taskId: string): Promise<boolean> => {
        if (!userStore.loggedUser) {
            return false;
        }

        const requestData: FavoriteAdd = {
            userId: userStore.loggedUser.id,
            objectId: taskId,
            requestData: {
                submitted: 'submitted',
            },
        };

        loadingStore.setLoading(true);
        try {
            const res = await window.electron.api.addFavoriteTask(requestData);

            if (!res.success) {
                throw new Error(`Error at adding favorite task: ${res.error}`);
            }

            eventStore.createEventNotification('Favorit hinzugefügt', `${taskId}`);
            console.log(`Added favorite task: `, res.data);
            return true;
        } catch (error) {
            console.error(`Exception at adding favorite task: ${error}`);
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const removeFavoriteTask = async (taskId: string): Promise<boolean> => {
        if (!userStore.loggedUser) {
            return false;
        }

        const requestData: FavoriteRemove = {
            userId: userStore.loggedUser.id,
            objectId: taskId,
            requestData: {
                submitted: 'submitted',
            },
        };

        loadingStore.setLoading(true);
        try {
            const res = await window.electron.api.removeFavoriteTask(requestData);

            if (!res.success) {
                throw new Error(`Error at removing favorite task: ${res.error}`);
            }

            eventStore.createEventNotification('Favorit entfernt', `${taskId}`);
            console.log(`Removed favorite task: `, res.data);
            return true;
        } catch (error) {
            console.error(`Exception at removing favorite task: ${error}`);
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const submitCommentCreate = async (projectId: string, taskId: string, body: string, preparedFiles: File[]): Promise<boolean> => {
        loadingStore.setLoading(true);
        let attachments: Attachment[] = [];
        let attachmentIds: string[] = [];
        try {
            if (preparedFiles.length > 0) {
                attachments = await attachmentStore.submitAttachments(preparedFiles);
                if (attachments.length > 0) {
                    attachmentIds = attachments.map(attachment => attachment.id);
                }
            }

            const data: CommentRequestCreate = {
                projectId: projectId,
                taskId: taskId,
                requestData: {
                    comment: {
                        body: body,
                        attachments: {
                            pending_parent: attachmentIds,
                        },
                    },
                    submitted: 'submitted',
                },
            };

            const res = await window.electron.api.createComment(data);

            if (!res.success) {
                eventStore.createEventNotification('Error', `Kommentar konnte nicht erstellt werden. ProjektID: ${projectId} TaskID: ${taskId}`);
                throw new Error(`Failed to create comment: ${res.error}`);
            }

            console.log('Comment created:', res.data);
            eventStore.createEventNotification('Kommentar erstellt', body.replace(/<\/?[^>]+(>|$)/g, ''));
            return true;
        } catch (error) {
            console.error('Error creating comment:', error);
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const submitCommentUpdate = async (comment: Comment, projectId: string, taskId: string): Promise<boolean> => {
        loadingStore.setLoading(true);
        try {
            const request: CommentRequestUpdate = {
                commentId: comment.id,
                projectId: projectId,
                taskId: taskId,
                requestData: {
                    comment: {
                        body: comment.body,
                    },
                    submitted: 'submitted',
                },
            };

            const res = await window.electron.api.updateComment(request);

            if (!res.success) {
                eventStore.createEventNotification('Error', `Kommentar konnte nicht aktualisiert werden. ProjektID: ${projectId} TaskID: ${taskId}`);
                throw new Error(`Failed to update comment: ${res.error}`);
            }

            console.log('Comment updated', comment);
            eventStore.createEventNotification('Kommentar aktualisiert', comment.body);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const submitCommentDelete = async (comment: Comment, projectId: string, taskId: string): Promise<boolean> => {
        loadingStore.setLoading(true);
        try {
            const request: CommentRequestDelete = {
                projectId: projectId,
                taskId: taskId,
                commentId: comment.id,
                requestData: {submitted: 'submitted'},
            };

            const res = await window.electron.api.deleteComment(request);
            if (!res.success) {
                eventStore.createEventNotification('Error', `Kommentar konnte nicht gelöscht werden. ProjektID: ${projectId} TaskID: ${taskId}`);
                throw new Error(`Failed to delete comment: ${res.error}`);
            }

            console.log('Comment deleted');
            eventStore.createEventNotification('Kommentar gelöscht', comment.body);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };
    // Assignment works differently than subscriptions.
    // You have to actively call the api to remove a subscriber or add them
    // For assignments it is enough to just change the array and then call the api
    // Important: Adding an assignee also subscribes them
    const submitChangeAssignee = async (projectId: string, taskId: string, assigneeId: string, otherAssigneesIds: string[]): Promise<boolean> => {
        loadingStore.setLoading(true);
        try {
            const data: ChangeAssigneeRequest = {
                projectId: projectId,
                taskId: taskId,
                requestData: {
                    object: {
                        other_assignees: [...otherAssigneesIds],
                        assignee_id: assigneeId ?? defaultAssigneeId,
                    },
                    submitted: 'submitted',
                },
            };
            const res = await window.electron.api.changeAssignee(data);

            if (!res.success) {
                eventStore.createEventNotification('Error', `Verantwortlicher konnte nicht geändert werden. ProjektID: ${projectId} TaskID: ${taskId}`);
                throw new Error(`Other Assignees and Main Assignee could not be saved: ${res.error}`);
            }

            console.log('Other Assignees and Main Assignee saved', res.data);
            eventStore.createEventNotification(`Verantwortlicher geändert`, `ProjectID: ${projectId} TaskID: ${taskId}`);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };
    const submitNewSubscribers = async (projectId: string, taskId: string, subscribersIds: string[]): Promise<void> => {
        loadingStore.setLoading(true);
        try {
            for (const subscriberId of subscribersIds) {
                const data: SubscribeRequest = {
                    projectId: projectId,
                    taskId: taskId,
                    userId: subscriberId,
                    requestData: {
                        submitted: 'submitted',
                    },
                };

                const res = await window.electron.api.subscribeTask(data);

                if (!res.success) {
                    eventStore.createEventNotification('Error', `Subscriber konnte nicht hinzugefügt werden. ProjektID: ${projectId} TaskID: ${taskId}`);
                    throw new Error(`Subscription could not be added: ${res.error}`);
                }

                console.log('Subscription added', res.data);
                eventStore.createEventNotification(`Subscriber hinzugefügt`, `ProjectID: ${projectId} TaskID: ${taskId}`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            loadingStore.setLoading(false);
        }
    };
    const submitRemoveSubscribers = async (projectId: string, taskId: string, subscribersIds: string[]): Promise<void> => {
        loadingStore.setLoading(true);
        // Every unsubscribe request is sent separately
        try {
            for (const userId of subscribersIds) {

                const data: SubscribeRequest = {
                    projectId: projectId,
                    taskId: taskId,
                    userId: userId,
                    requestData: {
                        submitted: 'submitted',
                    },
                };

                const res = await window.electron.api.unsubscribeTask(data);

                if (!res.success) {
                    eventStore.createEventNotification('Error', `Subscriber konnte nicht entfernt werden. ProjektID: ${projectId} TaskID: ${taskId}`);
                    throw new Error(`Subscription could not be removed: ${res.error}`);
                }

                console.log('Subscription removed', res.data);
                eventStore.createEventNotification(`Subscriber entfernt`, `ProjektID: ${projectId} TaskID: ${taskId}`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const submitChangeAssignmentLabel = async (projectId: string, taskId: string, labelId: string): Promise<boolean> => {
        loadingStore.setLoading(true);
        try {
            const requestChangeAssignmentLabel: ChangeAssignmentLabelRequest = {
                projectId: projectId,
                taskId: taskId,
                requestData: {
                    object: {
                        label_id: labelId,
                    },
                    submitted: 'submitted',
                },
            };

            const res = await window.electron.api.changeAssignmentLabels(requestChangeAssignmentLabel);

            if (!res.success) {
                eventStore.createEventNotification('Error', `Kennzeichnung konnte nicht geändert werden. ProjektID: ${projectId} TaskID: ${taskId}`);
                throw new Error(`Failed to change the assignment label: ${res.error}`);
            }

            console.log('Assignment label changed successfully');
            eventStore.createEventNotification(`Kennzeichnung geändert`, `ProjektID: ${projectId} TaskID: ${taskId}`);
            return true;
        } catch (error) {
            console.error('Exception during assignment label change:', error);
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const submitSubtaskCreate = async (projectId: string, taskId: string, name: string, assigneeId: string, priority: number, labelId: string, dueOn: Date | null): Promise<boolean> => {
        loadingStore.setLoading(true);
        try {
            const requestData: SubtaskRequestCreate = {
                projectId: projectId,
                taskId: taskId,
                requestData: {
                    subtask: {
                        body: name,
                        assignee_id: assigneeId ?? defaultAssigneeId,
                        priority: priority ?? defaultPriority,
                        label_id: labelId ?? labelStore.defaultAssignmentLabelId,
                        due_on: dueOn ?? null,
                    },
                    submitted: 'submitted',
                },
            };

            const res = await window.electron.api.createSubtask(requestData);

            if (!res.success) {
                eventStore.createEventNotification('Error', `Subtask konnte nicht erstellt werden. ProjektID: ${projectId} TaskID: ${taskId}`);
                throw new Error(`Failed to create subtask: ${res.error}`);
            }

            console.log('Subtask created', res.data);
            eventStore.createEventNotification(`Subtask erstellt`, `ProjektID: ${projectId} TaskID: ${taskId}: ${name}`);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const submitSubtaskChangeComplete = async (projectId: string, taskId: string, subtaskId: string, isCompleted: boolean): Promise<boolean> => {
        loadingStore.setLoading(true);
        try {
            const requestData = {
                projectId: projectId,
                taskId: taskId,
                subtaskId: subtaskId,
                requestData: {
                    submitted: 'submitted',
                },
            };

            const res = !isCompleted
                ? await window.electron.api.completeSubtask(requestData as SubtaskRequestComplete)
                : await window.electron.api.reopenSubtask(requestData as SubtaskRequestReopen);

            if (!res.success) {
                eventStore.createEventNotification('Error', `Subtask Status konnte nicht geändert werden. ProjektID: ${projectId} TaskID: ${taskId}`);
                throw new Error(`Failed to change subtask status: ${res.error}`);
            }

            console.log('Subtask status changed', res.data);
            eventStore.createEventNotification(`Subtask Complete Status geändert`, `ProjektID: ${projectId} TaskID: ${taskId}: ${res.data.name}`);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const submitSubtaskDelete = async (projectId: string, taskId: string, subtaskId: string): Promise<boolean> => {
        loadingStore.setLoading(true);
        try {
            const requestData: SubtaskRequestDelete = {
                projectId: projectId,
                taskId: taskId,
                subtaskId: subtaskId,
                requestData: {
                    submitted: 'submitted',
                },
            };

            const res = await window.electron.api.deleteSubtask(requestData);

            if (!res.success) {
                eventStore.createEventNotification('Error', `Subtask konnte nicht gelöscht werden. ProjektID: ${projectId} TaskID: ${taskId}`);
                throw new Error(`Failed to delete subtask: ${res.error}`);
            }

            console.log('Subtask deleted:', res.data);
            eventStore.createEventNotification(`Subtask gelöscht`, `ProjektID: ${projectId} TaskID: ${taskId}: ${res.data.name}`);
            return true;
        } catch (error) {
            console.error('Exception during subtask deletion:', error);
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const submitSubtaskUpdate = async (projectId: string, taskId: string, subtask: Subtask): Promise<boolean> => {
        loadingStore.setLoading(true);

        const requestData: SubtaskRequestUpdate = {
            projectId: projectId,
            taskId: taskId,
            subtaskId: subtask.id,
            requestData: {
                subtask: {
                    body: subtask.name,
                    assignee_id: subtask.assignee_id ?? '',
                    priority: subtask.priority,
                    label_id: subtask.label_id,
                    due_on: subtask.due_on ? subtask.due_on.date_object : null,
                },
                submitted: 'submitted',
            },
        };

        try {
            const res = await window.electron.api.updateSubtask(requestData);

            if (!res.success) {
                eventStore.createEventNotification('Error', `Subtask konnte nicht aktualisiert werden. ProjektID: ${projectId} TaskID: ${taskId}`);
                throw new Error(`Failed to update subtask: ${res.error}`);
            }

            console.log('Subtask updated', res.data);
            eventStore.createEventNotification('Subtask aktualisiert');
            return true;
        } catch (error) {
            console.error('Failed to update subtask:', error);
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };
    return {
        myTasks,
        defaultCategoryId,
        defaultMilestoneId,
        defaultPriority,
        defaultVisibility,
        defaultJobTypeId,
        defaultAssigneeId,
        fetchMyTasks,
        fetchTaskById,
        submitCommentUpdate,
        submitCommentDelete,
        submitTaskUpdate,
        submitTaskCreate,
        fetchTasks,
        fetchComments,
        submitCommentCreate,
        submitChangeAssignee,
        submitNewSubscribers,
        submitRemoveSubscribers,
        submitChangeAssignmentLabel,
        submitSubtaskCreate,
        submitSubtaskChangeComplete,
        submitSubtaskDelete,
        submitSubtaskUpdate,
        fetchSubtasks,
        submitTaskComplete,
        submitTaskReopen,
        submitTaskDelete,
        taskSearchItems,
        init,
        getTaskNote,
        setTaskNote,
        taskNotes,
        addFavoriteTask,
        removeFavoriteTask,
    };
});
