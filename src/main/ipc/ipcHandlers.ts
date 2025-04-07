import {
    TimeRecordRequestCreate,
    TimeRecordRequestDelete,
    TimeRecordRequestUpdate,
} from '@shareMain/interfaces/activecollab/post/timerecord';
import {ActiveCollabApiService} from '../services/api/activeCollabApiService';
import {
    CommentRequestCreate,
    CommentRequestDelete,
    CommentRequestUpdate,
} from '@shareMain/interfaces/activecollab/post/comment';
import {
    SubtaskRequestComplete,
    SubtaskRequestCreate,
    SubtaskRequestDelete,
    SubtaskRequestUpdate,
} from '@shareMain/interfaces/activecollab/post/subtask';
import {
    ChangeAssigneeRequest,
    ChangeAssignmentLabelRequest,
    SubscribeRequest,
    TaskRequestComplete,
    TaskRequestCreate,
    TaskRequestDelete,
    TaskRequestUpdate,
    UnsubscribeRequest,
} from '@shareMain/interfaces/activecollab/post/task';
import {AttachmentRequestCreate} from '@shareMain/interfaces/activecollab/post/attachment';
import {FavoriteAdd, FavoriteRemove} from '@shareMain/interfaces/activecollab/post/favorite';
import {app, ipcMain, safeStorage} from 'electron';
import {IpcResponse} from '@shareMain/interfaces/ipc';
import {mainWindow} from '../main';
import * as fs from 'node:fs';
import * as path from 'node:path';

const configPath = path.join(app.getPath('userData'), 'secure_config.json');

async function apiConnectionPossible(): Promise<boolean> {

    if (!safeStorage.isEncryptionAvailable()) {
        console.error('Safe storage is not available on this system.');
        return false;
    }

    if (!fs.existsSync(configPath)) {
        console.error('No credentials found.');
        return false;
    }

    try {
        const encryptedData = fs.readFileSync(configPath);
        const decryptedData = JSON.parse(safeStorage.decryptString(encryptedData));

        const {username, password, apiKey} = decryptedData;

        if (username === null || password === null || apiKey === null) {
            console.error('No credentials found');
            return false;
        }

        ActiveCollabApiService.getInstance().setup(username, password, apiKey);
        if (!await ActiveCollabApiService.getInstance().isApiAvailable()) {
            console.error('API not available');
            return false;
        }

        return true;

    } catch (error) {
        console.error('Failed to decrypt credentials:', error);
        return null;
    }
}

async function setupApiCredentials(username: string, password: string, apiKey: string): Promise<void> {
    ActiveCollabApiService.getInstance().setup(username, password, apiKey);

    if (!safeStorage.isEncryptionAvailable()) {
        console.error('Safe storage is not available on this system.');
    }

    const encryptedData = safeStorage.encryptString(JSON.stringify({username, password, apiKey}));

    fs.writeFileSync(configPath, encryptedData);
}

async function resetApiCredentials(): Promise<void> {
    try {
        if (fs.existsSync(configPath)) {
            fs.unlinkSync(configPath);
            console.log('Credentials have been reset.');
        } else {
            console.log('No credentials found to reset.');
        }
    } catch (error) {
        console.error('Error resetting credentials:', error);
    }
}

function createIpcResponse(data: any, success: boolean, error: any = null): IpcResponse {
    data = processJSON(data);
    return {
        success: success,
        error: error,
        data: data,
    } as IpcResponse;
}

function processJSON(data: any): any {
    data = convertIdsToString(data);
    data = addDateObjectKeys(data);
    return data;
}

function convertIdsToString(obj: any) {
    if (Array.isArray(obj)) {
        return obj.map(item => convertIdsToString(item));
    } else if (obj !== null && typeof obj === 'object') {
        for (const key in obj) {
            if ((key === 'id' || key.endsWith('_id')) && obj[key] !== null) {
                obj[key] = String(obj[key]);
            } else {
                obj[key] = convertIdsToString(obj[key]);
            }
        }
    }
    return obj;
}

function addDateObjectKeys(obj: any) {
    if (Array.isArray(obj)) {
        return obj.map(item => addDateObjectKeys(item));
    } else if (obj !== null && typeof obj === 'object') {
        for (const key in obj) {
            if (key === 'timestamp' && obj[key] !== null) {
                obj[`date_object`] = new Date(obj[key] * 1000);
            } else if (key === 'dob' && obj[key] !== null) {
                const [day, month, year] = obj[key].split('.').map(Number);
                obj[key] = new Date(year, month - 1, day); // Month is 0-based
            } else {
                obj[key] = addDateObjectKeys(obj[key]);
            }
        }
    }
    return obj;
}

export const initializeIpcHandlers = () => {
    ipcMain.handle('app:restart', async (): Promise<IpcResponse> => {
        try {
            app.relaunch();
            app.quit();
            return createIpcResponse(null, true);
        } catch (error) {
            console.error('Error in app:restart:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('app:get-version', async (): Promise<IpcResponse> => {
        try {
            // Works only when build with electron-builder
            return createIpcResponse(app.getVersion(), true);
        } catch (error) {
            console.error('Error in app:get-version:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('app:always-on-top', async (event: any, value: boolean): Promise<IpcResponse> => {
        try {
            mainWindow.setAlwaysOnTop(value);
            return createIpcResponse(null, true);
        } catch (error) {
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('login:setup', async (event: any, username: string, password: string, apiKey: string): Promise<void> => {
        await setupApiCredentials(username, password, apiKey);
    });

    ipcMain.handle('login:reset', async (): Promise<void> => {
        await resetApiCredentials();
    });

    ipcMain.handle('api:test-connection', async (): Promise<IpcResponse> => {
        try {
            const res = await apiConnectionPossible();
            if (res) {
                return createIpcResponse(true, true);
            } else {
                return createIpcResponse(false, true);
            }
        } catch (error) {
            console.error('Error in testConnection:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:get-job-types', async (): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().getJobTypes() ?? [];
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in getJobTypes:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:get-assignment-labels', async (): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().getAssignmentLabels() ?? [];
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in getAssignmentLabels:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:get-project-labels', async (): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().getProjectLabels() ?? [];
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in getProjectLabels:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:get-info', async (): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().getInfo();
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in getInfo:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:get-project-categories', async (): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().getProjectCategories() ?? [];
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in getProjectCategories:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:get-projects', async (): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().getProjects() ?? [];
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in getProjects:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:get-project', async (event: any, projectId: string): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().getProject(projectId);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error(`Error in getProject for project ID ${projectId}:`, error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:get-project-time-records', async (event: any, projectId: string): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().getProjectTimeRecords(projectId) ?? [];
            return createIpcResponse(res, true);
        } catch (error) {
            console.error(`Error in getProjectTracking for project ID ${projectId}:`, error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:get-project-users', async (event: any, projectId: string): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().getProjectUsers(projectId) ?? [];
            return createIpcResponse(res, true);
        } catch (error) {
            console.error(`Error in getProjectUsers for project ID ${projectId}:`, error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:get-tasks', async (event: any, projectId: string): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().getTasks(projectId) ?? [];
            return createIpcResponse(res, true);
        } catch (error) {
            console.error(`Error in getTasks for project ID ${projectId}:`, error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:get-my-tasks', async (): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().getMyTasks() ?? [];
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in getMyTasks:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:get-task', async (event: any, projectId: string, taskId: string): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().getTask(projectId, taskId);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error(`Error in getTask for project ID ${projectId} and task ID ${taskId}:`, error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:get-tasks-categories', async (event: any, projectId: string): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().getTasksCategories(projectId) ?? [];
            return createIpcResponse(res, true);
        } catch (error) {
            console.error(`Error in getTasksCategories for project ID ${projectId}:`, error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:get-task-attachments', async (event: any, projectId: string, taskId: string): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().getTaskAttachments(projectId, taskId) ?? [];
            return createIpcResponse(res, true);
        } catch (error) {
            console.error(`Error in getTaskAttachments for project ID ${projectId} and task ID ${taskId}:`, error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:get-task-comments', async (event: any, projectId: string, taskId: string): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().getTaskComments(projectId, taskId) ?? [];
            return createIpcResponse(res, true);
        } catch (error) {
            console.error(`Error in getTaskComments for project ID ${projectId} and task ID ${taskId}:`, error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:get-task-comment-attachments', async (event: any, projectId: string, taskId: string, commentId: string): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().getTaskCommentAttachments(projectId, taskId, commentId) ?? [];
            return createIpcResponse(res, true);
        } catch (error) {
            console.error(`Error in getTaskCommentAttachments for project ID ${projectId}, task ID ${taskId}, and comment ID ${commentId}:`, error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:get-task-subtasks', async (event: any, projectId: string, taskId: string): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().getSubtasks(projectId, taskId) ?? [];
            return createIpcResponse(res, true);
        } catch (error) {
            console.error(`Error in getTaskSubtasks for project ID ${projectId} and task ID ${taskId}:`, error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:get-task-time-records', async (event: any, projectId: string, taskId: string): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().getTimeRecords(projectId, taskId) ?? [];
            return createIpcResponse(res, true);
        } catch (error) {
            console.error(`Error in getTaskTracking for project ID ${projectId} and task ID ${taskId}:`, error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:get-users', async (): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().getUsers() ?? [];
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in getUsers:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:get-user', async (event: any, userId: string): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().getUser(userId);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error(`Error in getUser for user ID ${userId}:`, error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:get-companies', async (): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().getCompanies() ?? [];
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in getCompanies:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:createTimeRecord', async (event: any, data: TimeRecordRequestCreate): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().createTimeRecord(data.projectId, data.taskId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in createTimeRecord:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:updateRecord', async (event: any, data: TimeRecordRequestUpdate): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().updateRecord(data.projectId, data.taskId, data.recordId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in updateRecord:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:deleteRecord', async (event: any, data: TimeRecordRequestDelete): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().deleteRecord(data.projectId, data.taskId, data.recordId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in deleteRecord:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:createTask', async (event: any, data: TaskRequestCreate): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().createTask(data.projectId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in createTask:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:updateTask', async (event: any, data: TaskRequestUpdate): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().updateTask(data.projectId, data.taskId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in updateTask:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:deleteTask', async (event: any, data: TaskRequestDelete): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().deleteTask(data.projectId, data.taskId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in deleteTask:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:reopenTask', async (event: any, data: TaskRequestComplete): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().reopenTask(data.projectId, data.taskId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in reopenTask:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:completeTask', async (event: any, data: TaskRequestComplete): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().completeTask(data.projectId, data.taskId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in completeTask:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:changeAssignee', async (event: any, data: ChangeAssigneeRequest): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().changeAssignee(data.projectId, data.taskId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in changeAssignee:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:changeAssignmentLabel', async (event: any, data: ChangeAssignmentLabelRequest): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().changeAssignmentLabel(data.projectId, data.taskId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in changeAssignmentLabel:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:subscribeTask', async (event: any, data: SubscribeRequest): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().subscribeTask(data.projectId, data.taskId, data.userId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in subscribeTask:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:unsubscribeTask', async (event: any, data: UnsubscribeRequest): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().unsubscribeTask(data.projectId, data.taskId, data.userId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in unSubscribeTask:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:createSubtask', async (event: any, data: SubtaskRequestCreate): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().createSubtask(data.projectId, data.taskId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in createSubtask:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:updateSubtask', async (event: any, data: SubtaskRequestUpdate): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().updateSubtask(data.projectId, data.taskId, data.subtaskId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in updateSubtask:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:deleteSubtask', async (event: any, data: SubtaskRequestDelete): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().deleteSubtask(data.projectId, data.taskId, data.subtaskId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in deleteSubtask:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:completeSubtask', async (event: any, data: SubtaskRequestComplete): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().completeSubtask(data.projectId, data.taskId, data.subtaskId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in completeSubtask:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:reopenSubtask', async (event: any, data: SubtaskRequestComplete): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().reopenSubtask(data.projectId, data.taskId, data.subtaskId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in reopenSubtask:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:createAttachment', async (event: any, data: AttachmentRequestCreate): Promise<IpcResponse> => {
        try {
            // Attachment needs to be a Blob and can not just be used as File Type
            const blob = new Blob([data.requestData.attachment], {type: 'application/octet-stream'});

            const formData = new FormData();
            formData.append('attachment', blob, data.requestData.name);
            formData.append('name', data.requestData.name);
            formData.append('submitted', 'submitted');

            const res = await ActiveCollabApiService.getInstance().createAttachment(formData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in createAttachment:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:createComment', async (event: any, data: CommentRequestCreate): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().createComment(data.projectId, data.taskId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in createComment:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:updateComment', async (event: any, data: CommentRequestUpdate): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().updateComment(data.projectId, data.taskId, data.commentId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in updateComment:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:deleteComment', async (event: any, data: CommentRequestDelete): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().deleteComment(data.projectId, data.taskId, data.commentId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in deleteComment:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:addFavoriteProject', async (event: any, data: FavoriteAdd): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().addFavoriteProject(data.userId, data.objectId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in addFavoriteProject:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:removeFavoriteProject', async (event: any, data: FavoriteRemove): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().removeFavoriteProject(data.userId, data.objectId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in removeFavoriteProject:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:addFavoriteTask', async (event: any, data: FavoriteAdd): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().addFavoriteTask(data.userId, data.objectId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in addFavoriteTask:', error);
            return createIpcResponse(null, false, error);
        }
    });

    ipcMain.handle('api:removeFavoriteTask', async (event: any, data: FavoriteRemove): Promise<IpcResponse> => {
        try {
            const res = await ActiveCollabApiService.getInstance().removeFavoriteTask(data.userId, data.objectId, data.requestData);
            return createIpcResponse(res, true);
        } catch (error) {
            console.error('Error in removeFavoriteTask:', error);
            return createIpcResponse(null, false, error);
        }
    });

};
