export interface TimeRecordRequestCreate {
    projectId: string;
    taskId: string;

    requestData: {
        time_record: {
            value: number;
            user_id: string;
            job_type_id: string;
            record_date: Date;
            summary: string;
            billable_status: number;
        }
        submitted: 'submitted';
    }
}

export interface TimeRecordRequestUpdate extends TimeRecordRequestCreate {
    recordId: string;
}

export interface TimeRecordRequestDelete {
    recordId: string;
    projectId: string;
    taskId: string;

    requestData: {
        submitted: 'submitted';
    }
}
