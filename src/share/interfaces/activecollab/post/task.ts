export interface TaskRequestCreate {
    projectId: string;
    requestData: {
        task: {
            name: string;
            body: string | undefined;
            category_id: string;
            milestone_id: string;
            priority: number;
            visibility: number;
            start_on: Date | undefined;
            due_on: Date | null;
            estimate_value?: number;
            attachments?: {
                pending_parent?: string[];
            }
            estimate_job_type_id: string;
            label_id: string;
            other_assignees: string[];
            assignee_id: string;
            subscribers?: string[];
        }
        submitted: 'submitted';
    };
}

export interface TaskRequestUpdate extends TaskRequestCreate {
    taskId: string;
}

export interface TaskRequestDelete {
    projectId: string;
    taskId: string;

    requestData: {
        submitted: 'submitted';
    };
}

export interface TaskRequestReopen {
    projectId: string;
    taskId: string;

    requestData: {
        submitted: 'submitted';
    };
}

export interface TaskRequestComplete {
    projectId: string;
    taskId: string;

    requestData: {
        submitted: 'submitted';
    };
}

export interface ChangeAssigneeRequest {
    projectId: string;
    taskId: string;

    requestData: {
        object: {
            other_assignees: string[];
            assignee_id: string;
        },
        subscribers?: string[];
        submitted: 'submitted';
    };
}

export interface SubscribeRequest {
    projectId: string;
    taskId: string;
    userId: string;

    requestData: {
        submitted: 'submitted';
    };
}

export interface UnsubscribeRequest {
    projectId: string;
    taskId: string;
    userId: string;

    requestData: {
        submitted: 'submitted';
    };
}

export interface ChangeAssignmentLabelRequest {
    projectId: string;
    taskId: string;

    requestData: {
        object: {
            label_id: string;
        }
        submitted: 'submitted';
    };
}
