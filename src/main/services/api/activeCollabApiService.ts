import ApiService from './apiService';
import {Project} from '@shareMain/interfaces/activecollab/project';
import {AssignmentLabel, Category, Info, JobType} from '@shareMain/interfaces/activecollab/system';
import {Attachment} from '@shareMain/interfaces/activecollab/attachment';
import {Company} from '@shareMain/interfaces/activecollab/company';
import {TimeRecord} from '@shareMain/interfaces/activecollab/timeRecord';
import {User} from '@shareMain/interfaces/activecollab/user';
import {Task} from '@shareMain/interfaces/activecollab/task';
import {Comment} from '@shareMain/interfaces/activecollab/comment';
import {Subtask} from '@shareMain/interfaces/activecollab/subtask';

export class ActiveCollabApiService extends ApiService {

    private static instance: ActiveCollabApiService;

    private constructor() {
        super('https://ac.intercorp.de/public/api.php');
    }

    static getInstance(): ActiveCollabApiService {
        if (!ActiveCollabApiService.instance) {
            ActiveCollabApiService.instance = new ActiveCollabApiService();
        }
        return ActiveCollabApiService.instance;
    }

    urlBuilder(pathInfo: string): string {
        return `${this.baseUrl}?auth_api_token=${this.apiKey}&path_info=${pathInfo}&async=1`;
    }

    async isApiAvailable(): Promise<boolean> {
        const res = await this.get('info');
        return res.hasOwnProperty('logged_user');
    }

    // This takes a Date object and formats it to a string that URLSearchParams can handle
    formatPostDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    /*
    ===============================
    GET REQUESTS
    ===============================
    */

    public async getJobTypes(): Promise<JobType[]> {
        return await this.get('info/job-types');
    }

    public async getAssignmentLabels(): Promise<AssignmentLabel[]> {
        return await this.get('info/labels/assignment');
    }

    public async getProjectLabels(): Promise<AssignmentLabel[]> {
        return await this.get('info/labels/project');
    }

    public async getInfo(): Promise<Info> {
        return await this.get('info');
    }

    public async getProjectCategories(): Promise<Category[]> {
        return await this.get(`projects/categories`);
    }

    public async getProjects(): Promise<Project[]> {
        return await this.get('projects');
    }

    public async getProject(projectId: string): Promise<Project> {
        return await this.get(`projects/${projectId}`);
    }

    public async getProjectTimeRecords(projectId: string): Promise<TimeRecord[]> {
        return await this.get(`projects/${projectId}/tracking`);
    }

    public async getProjectUsers(projectId: string): Promise<User[]> {
        return await this.get(`projects/${projectId}/people`);
    }

    public async getTasks(projectId: string): Promise<Task[]> {
        return await this.get(`projects/${projectId}/tasks`);
    }

    public async getMyTasks(): Promise<Task[]> {
        return await this.get(`my-tasks`);
    }

    public async getTask(projectId: string, taskId: string): Promise<Task> {
        return await this.get(`projects/${projectId}/tasks/${taskId}`);
    }

    public async getTasksCategories(projectId: string): Promise<Category[]> {
        return await this.get(`projects/${projectId}/tasks/categories`);
    }

    public async getTaskAttachments(projectId: string, taskId: string): Promise<Attachment[]> {
        return await this.get(`projects/${projectId}/tasks/${taskId}/attachments`);
    }

    public async getTaskComments(projectId: string, taskId: string): Promise<Comment[]> {
        return await this.get(`projects/${projectId}/tasks/${taskId}/comments`);
    }

    public async getTaskCommentAttachments(projectId: string, taskId: string, commentId: string): Promise<Attachment[]> {
        return await this.get(`projects/${projectId}/tasks/${taskId}/comments/${commentId}/attachments`);
    }

    public async getSubtasks(projectId: string, taskId: string): Promise<Subtask[]> {
        return await this.get(`projects/${projectId}/tasks/${taskId}/subtasks`);
    }

    public async getTimeRecords(projectId: string, taskId: string): Promise<TimeRecord[]> {
        return await this.get(`projects/${projectId}/tasks/${taskId}/tracking`);
    }

    public async getUsers(): Promise<User[]> {
        return await this.get('people/1/users');
    }

    public async getUser(userId: string): Promise<User> {
        return await this.get(`people/1/users/${userId}`);
    }

    public async getCompanies(): Promise<Company[]> {
        return await this.get('people');
    }

    /*
    ===============================
    POST REQUESTS
    ===============================
    */

    public async createTimeRecord(projectId: string, taskId: string, data: any): Promise<TimeRecord> {
        return await this.post(`projects/${projectId}/tasks/${taskId}/tracking/time/add`, data);
    }

    public async updateRecord(projectId: string, taskId: string, recordId: string, data: any): Promise<TimeRecord> {
        return await this.post(`projects/${projectId}/tasks/${taskId}/tracking/time/${recordId}/edit`, data);
    }

    public async deleteRecord(projectId: string, taskId: string, recordId: string, data: any): Promise<TimeRecord> {
        return await this.post(`projects/${projectId}/tasks/${taskId}/tracking/time/${recordId}/trash`, data);
    }

    public async createTask(projectId: string, data: any): Promise<Task> {
        return await this.post(`projects/${projectId}/tasks/add`, data);
    }

    public async updateTask(projectId: string, taskId: string, data: any): Promise<Task> {
        return await this.post(`projects/${projectId}/tasks/${taskId}/edit`, data);
    }

    public async deleteTask(projectId: string, taskId: string, data: any): Promise<Task> {
        return await this.post(`projects/${projectId}/tasks/${taskId}/trash`, data);
    }

    public async reopenTask(projectId: string, taskId: string, data: any): Promise<Task> {
        return await this.post(`projects/${projectId}/tasks/${taskId}/reopen`, data);
    }

    public async completeTask(projectId: string, taskId: string, data: any): Promise<Task> {
        return await this.post(`projects/${projectId}/tasks/${taskId}/complete`, data);
    }

    public async changeAssignee(projectId: string, taskId: string, data: any): Promise<any> {
        return await this.post(`projects/${projectId}/tasks/${taskId}/assignees`, data);
    }

    public async changeAssignmentLabel(projectId: string, taskId: string, data: any): Promise<any> {
        return await this.post(`projects/${projectId}/tasks/${taskId}/update-label`, data);
    }

    public async subscribeTask(projectId: string, taskId: string, userId: string, data: any): Promise<any> {
        return await this.post(`projects/${projectId}/tasks/${taskId}/subscribe&user_id=${userId}`, data);
    }

    public async unsubscribeTask(projectId: string, taskId: string, userId: string, data: any): Promise<any> {
        return await this.post(`projects/${projectId}/tasks/${taskId}/unsubscribe&user_id=${userId}`, data);
    }

    public async createSubtask(projectId: string, taskId: string, data: any): Promise<Subtask> {
        return await this.post(`projects/${projectId}/tasks/${taskId}/subtasks/add`, data);
    }

    public async updateSubtask(projectId: string, taskId: string, subtaskId: string, data: any): Promise<Subtask> {
        return await this.post(`projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/edit`, data);
    }

    public async deleteSubtask(projectId: string, taskId: string, subtaskId: string, data: any): Promise<Subtask> {
        return await this.post(`projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/trash`, data);
    }

    public async completeSubtask(projectId: string, taskId: string, subtaskId: string, data: any): Promise<Subtask> {
        return await this.post(`projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/complete`, data);
    }

    public async reopenSubtask(projectId: string, taskId: string, subtaskId: string, data: any): Promise<Subtask> {
        return await this.post(`projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/reopen`, data);
    }

    public async createComment(projectId: string, taskId: string, data: any): Promise<Comment> {
        return await this.post(`projects/${projectId}/tasks/${taskId}/comments/add`, data);
    }

    public async updateComment(projectId: string, taskId: string, commentId: string, data: any): Promise<Comment> {
        return await this.post(`projects/${projectId}/tasks/${taskId}/comments/${commentId}/edit`, data);
    }

    public async deleteComment(projectId: string, taskId: string, commentId: string, data: any): Promise<Comment> {
        return await this.post(`projects/${projectId}/tasks/${taskId}/comments/${commentId}/trash`, data);
    }

    public async createAttachment(data: FormData): Promise<Attachment> {
        return await this.post(`attachments/temporary/add&async=1&advanced_upload=1`, data, false);
    }

    public async addFavoriteProject(userId: string, objectId: string, data: any): Promise<any> {
        return await this.post(`people/1/users/${userId}/favorites/add&object_type=Project&object_id=${objectId}&async=1`, data);
    }

    public async removeFavoriteProject(userId: string, objectId: string, data: any): Promise<any> {
        return await this.post(`people/1/users/${userId}/favorites/remove&object_type=Project&object_id=${objectId}&async=1`, data);
    }

    public async addFavoriteTask(userId: string, objectId: string, data: any): Promise<any> {
        return await this.post(`people/1/users/${userId}/favorites/add&object_type=Task&object_id=${objectId}&async=1`, data);
    }

    public async removeFavoriteTask(userId: string, objectId: string, data: any): Promise<any> {
        return await this.post(`people/1/users/${userId}/favorites/remove&object_type=Task&object_id=${objectId}&async=1`, data);
    }
}
