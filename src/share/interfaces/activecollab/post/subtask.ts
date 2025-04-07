export interface SubtaskRequestCreate {
    projectId: string;
    taskId: string;

    requestData: {
        subtask: {
            body: string;
            assignee_id: string;
            priority: number;
            label_id: string;
            due_on: Date | null;
        }
        submitted: 'submitted';
    };
}

export interface SubtaskRequestUpdate extends SubtaskRequestCreate {
    subtaskId: string;
}

export interface SubtaskRequestDelete {
    projectId: string;
    taskId: string;
    subtaskId: string;

    requestData: {
        submitted: 'submitted';
    };
}

export interface SubtaskRequestComplete {
    projectId: string;
    taskId: string;
    subtaskId: string;

    requestData: {
        submitted: 'submitted';
    };
}

export interface SubtaskRequestReopen extends SubtaskRequestComplete {
}
