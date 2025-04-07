import {contextBridge, ipcRenderer} from 'electron';
import {
    TimeRecordRequestCreate,
    TimeRecordRequestDelete,
    TimeRecordRequestUpdate,
} from '@shareMain/interfaces/activecollab/post/timerecord';
import {
    ChangeAssigneeRequest,
    ChangeAssignmentLabelRequest,
    SubscribeRequest,
    TaskRequestComplete,
    TaskRequestCreate,
    TaskRequestDelete,
    TaskRequestReopen,
    TaskRequestUpdate,
} from '@shareMain/interfaces/activecollab/post/task';
import {
    SubtaskRequestComplete,
    SubtaskRequestCreate,
    SubtaskRequestDelete,
    SubtaskRequestUpdate,
} from '@shareMain/interfaces/activecollab/post/subtask';
import {
    CommentRequestCreate,
    CommentRequestDelete,
    CommentRequestUpdate,
} from '@shareMain/interfaces/activecollab/post/comment';
import {IpcResponse} from '@shareMain/interfaces/ipc';
import {AttachmentRequestCreate} from '@shareMain/interfaces/activecollab/post/attachment';
import {FavoriteAdd, FavoriteRemove} from '@shareMain/interfaces/activecollab/post/favorite';

contextBridge.exposeInMainWorld('electron', {
    filesystem: {},
    login: {
        setup: (userName: string, password: string, apiKey: string) =>
            ipcRenderer.invoke(`login:setup`, userName, password, apiKey),
        reset: () =>
            ipcRenderer.invoke(`login:reset`),
    },
    app: {
        restart: () => ipcRenderer.invoke(`app:restart`),
        getVersion: () => ipcRenderer.invoke(`app:get-version`),
        setAlwaysOnTop: (value: boolean) => ipcRenderer.invoke(`app:always-on-top`, value),
    },
    api: {
        testConnection: (): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:test-connection`),
        getInfo: (): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:get-info`),
        getJobTypes: (): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:get-job-types`),
        getAssignmentLabels: (): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:get-assignment-labels`),

        getProjectLabels: (): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:get-project-labels`),

        getProjectCategories: (): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:get-project-categories`),

        getProjects: (): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:get-projects`),

        getProject: (projectId: string): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:get-project`, projectId),

        getProjectTimeRecords: (projectId: string): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:get-project-time-records`, projectId),

        getProjectUsers: (projectId: string): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:get-project-users`, projectId),

        getTasks: (projectId: string): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:get-tasks`, projectId),

        getMyTasks: (): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:get-my-tasks`),

        getTask: (projectId: string, taskId: string): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:get-task`, projectId, taskId),

        getTasksCategories: (projectId: string): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:get-tasks-categories`, projectId),

        getTaskAttachments: (projectId: string, taskId: string): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:get-task-attachments`, projectId, taskId),

        getTaskComments: (projectId: string, taskId: string): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:get-task-comments`, projectId, taskId),

        getTaskCommentAttachments: (projectId: string, taskId: string, commentId: string): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:get-task-comment-attachments`, projectId, taskId, commentId),

        getTaskSubtasks: (projectId: string, taskId: string): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:get-task-subtasks`, projectId, taskId),

        getTaskTimeRecords: (projectId: string, taskId: string): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:get-task-time-records`, projectId, taskId),

        getUsers: (): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:get-users`),

        getUser: (userId: string): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:get-user`, userId),

        getCompanies: (): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:get-companies`),

        createTimeRecord: (data: TimeRecordRequestCreate): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:createTimeRecord`, data),

        updateRecord: (data: TimeRecordRequestUpdate): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:updateRecord`, data),

        deleteRecord: (data: TimeRecordRequestDelete): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:deleteRecord`, data),

        createTask: (data: TaskRequestCreate): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:createTask`, data),

        updateTask: (data: TaskRequestUpdate): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:updateTask`, data),

        deleteTask: (data: TaskRequestDelete): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:deleteTask`, data),

        reopenTask: (data: TaskRequestReopen): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:reopenTask`, data),

        completeTask: (data: TaskRequestComplete): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:completeTask`, data),

        changeAssignee: (data: ChangeAssigneeRequest): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:changeAssignee`, data),

        changeAssignmentLabels: (data: ChangeAssignmentLabelRequest): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:changeAssignmentLabel`, data),

        subscribeTask: (data: SubscribeRequest): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:subscribeTask`, data),

        unsubscribeTask: (data: SubscribeRequest): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:unsubscribeTask`, data),

        createSubtask: (data: SubtaskRequestCreate): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:createSubtask`, data),

        updateSubtask: (data: SubtaskRequestUpdate): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:updateSubtask`, data),

        deleteSubtask: (data: SubtaskRequestDelete): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:deleteSubtask`, data),

        completeSubtask: (data: SubtaskRequestComplete): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:completeSubtask`, data),
        reopenSubtask: (data: SubtaskRequestComplete): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:reopenSubtask`, data),

        createComment: (data: CommentRequestCreate): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:createComment`, data),

        updateComment: (data: CommentRequestUpdate): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:updateComment`, data),

        deleteComment: (data: CommentRequestDelete): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:deleteComment`, data),

        createAttachment: (data: AttachmentRequestCreate): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:createAttachment`, data),

        addFavoriteProject: (data: FavoriteAdd): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:addFavoriteProject`, data),

        removeFavoriteProject: (data: FavoriteRemove): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:removeFavoriteProject`, data),

        addFavoriteTask: (data: FavoriteAdd): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:addFavoriteTask`, data),

        removeFavoriteTask: (data: FavoriteRemove): Promise<IpcResponse> =>
            ipcRenderer.invoke(`api:removeFavoriteTask`, data),
    },
});
