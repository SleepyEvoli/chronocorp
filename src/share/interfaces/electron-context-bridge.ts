import {IpcResponse} from './ipc';
import {AttachmentRequestCreate} from './activecollab/post/attachment';
import {
    ChangeAssigneeRequest,
    ChangeAssignmentLabelRequest,
    SubscribeRequest,
    TaskRequestComplete,
    TaskRequestCreate,
    TaskRequestDelete,
    TaskRequestReopen,
    TaskRequestUpdate,
} from './activecollab/post/task';
import {
    TimeRecordRequestCreate,
    TimeRecordRequestDelete,
    TimeRecordRequestUpdate,
} from './activecollab/post/timerecord';
import {
    SubtaskRequestComplete,
    SubtaskRequestCreate,
    SubtaskRequestDelete,
    SubtaskRequestUpdate,
} from './activecollab/post/subtask';
import {CommentRequestCreate, CommentRequestDelete, CommentRequestUpdate} from './activecollab/post/comment';
import {FavoriteAdd, FavoriteRemove} from './activecollab/post/favorite';

interface LoginAPI {
    setup: (userName: string, password: string, apiKey: string) => Promise<void>;
    reset: () => Promise<void>;
}

interface AppAPI {
    restart: () => Promise<void>;
    getVersion: () => Promise<IpcResponse>;
    setAlwaysOnTop: (value: boolean) => Promise<IpcResponse>;
}

interface ActiveCollabAPI {
    testConnection: () => Promise<IpcResponse>;
    getInfo: () => Promise<IpcResponse>;
    getJobTypes: () => Promise<IpcResponse>;
    getAssignmentLabels: () => Promise<IpcResponse>;
    getProjectLabels: () => Promise<IpcResponse>;
    getProjectCategories: () => Promise<IpcResponse>;
    getProjects: () => Promise<IpcResponse>;
    getProject: (projectId: string) => Promise<IpcResponse>;
    getProjectTimeRecords: (projectId: string) => Promise<IpcResponse>;
    getProjectUsers: (projectId: string) => Promise<IpcResponse>;
    getTasks: (projectId: string) => Promise<IpcResponse>;
    getMyTasks: () => Promise<IpcResponse>;
    getTask: (projectId: string, taskId: string) => Promise<IpcResponse>;
    getTasksCategories: (projectId: string) => Promise<IpcResponse>;
    getTaskAttachments: (projectId: string, taskId: string) => Promise<IpcResponse>;
    getTaskComments: (projectId: string, taskId: string) => Promise<IpcResponse>;
    getTaskCommentAttachments: (projectId: string, taskId: string, commentId: string) => Promise<IpcResponse>;
    getTaskSubtasks: (projectId: string, taskId: string) => Promise<IpcResponse>;
    getTaskTimeRecords: (projectId: string, taskId: string) => Promise<IpcResponse>;
    getUsers: () => Promise<IpcResponse>;
    getUser: (userId: string) => Promise<IpcResponse>;
    getCompanies: () => Promise<IpcResponse>;

    // Attachments
    createAttachment: (data: AttachmentRequestCreate) => Promise<IpcResponse>;

    // Task-related actions
    createTask: (data: TaskRequestCreate) => Promise<IpcResponse>;
    updateTask: (data: TaskRequestUpdate) => Promise<IpcResponse>;
    deleteTask: (data: TaskRequestDelete) => Promise<IpcResponse>;
    reopenTask: (data: TaskRequestReopen) => Promise<IpcResponse>;
    completeTask: (data: TaskRequestComplete) => Promise<IpcResponse>;
    changeAssignee: (data: ChangeAssigneeRequest) => Promise<IpcResponse>;
    subscribeTask: (data: SubscribeRequest) => Promise<IpcResponse>;
    unsubscribeTask: (data: SubscribeRequest) => Promise<IpcResponse>;
    changeAssignmentLabels: (data: ChangeAssignmentLabelRequest) => Promise<IpcResponse>;

    // Time record actions
    createTimeRecord: (data: TimeRecordRequestCreate) => Promise<IpcResponse>;
    updateRecord: (data: TimeRecordRequestUpdate) => Promise<IpcResponse>;
    deleteRecord: (data: TimeRecordRequestDelete) => Promise<IpcResponse>;

    // Subtask actions
    createSubtask: (data: SubtaskRequestCreate) => Promise<IpcResponse>;
    updateSubtask: (data: SubtaskRequestUpdate) => Promise<IpcResponse>;
    deleteSubtask: (data: SubtaskRequestDelete) => Promise<IpcResponse>;
    completeSubtask: (data: SubtaskRequestComplete) => Promise<IpcResponse>;
    reopenSubtask: (data: SubtaskRequestComplete) => Promise<IpcResponse>;

    // Comment actions
    createComment: (data: CommentRequestCreate) => Promise<IpcResponse>;
    updateComment: (data: CommentRequestUpdate) => Promise<IpcResponse>;
    deleteComment: (data: CommentRequestDelete) => Promise<IpcResponse>;

    // Favorite actions
    addFavoriteProject: (data: FavoriteAdd) => Promise<IpcResponse>;
    removeFavoriteProject: (data: FavoriteRemove) => Promise<IpcResponse>;
    addFavoriteTask: (data: FavoriteAdd) => Promise<IpcResponse>;
    removeFavoriteTask: (data: FavoriteRemove) => Promise<IpcResponse>;
}

declare global {
    interface Window {
        electron: {
            login: LoginAPI;
            api: ActiveCollabAPI;
            app: AppAPI;
        };
    }
}

export {};
