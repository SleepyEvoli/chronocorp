// Parent is not needed, even when AC always sends it on the website
export interface CommentRequestCreate {
    projectId: string;
    taskId: string;

    requestData: {
        comment: {
            body: string;
            attachments?: {
                pending_parent: string[];
            };
        },
        parent?: {
            is_completed: 0;
            assignee_id: string;
            label_id: string;
            category_id: string | undefined;
        }
        submitted: 'submitted';
    }
}

export interface CommentRequestUpdate extends CommentRequestCreate {
    commentId: string;
}

export interface CommentRequestDelete {
    projectId: string;
    taskId: string;
    commentId: string;
    requestData: {
        submitted: 'submitted';
    }
}
