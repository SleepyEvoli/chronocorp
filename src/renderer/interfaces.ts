import {BillableStatus} from '@share/interfaces/activecollab/enums';
import {User} from '@share/interfaces/activecollab/user';
import {Task} from '@share/interfaces/activecollab/task';

export enum DragType {
    TASK = 'TASK',
    TRACKING = 'TRACKING',
    MY_TASK = 'MY_TASK'
}

// minimal data needed to create a Time Record
export interface Tracking {
    id: string;
    createdOn: Date;
    createdBy: User;
    task: Task;
    recordDate: Date;
    summary: string;
    jobTypeId: string;
    billableStatus: BillableStatus;
    keepOnSubmit: boolean;
    time: {
        hours: number;
        minutes: number;
    };
}

export interface SelectionOption {
    optionValue: string | number;
    optionName: string;
}

export interface EventNotification {
    id: string;
    title: string;
    body?: string;
    dateTime: Date;
    url?: string;
}

export interface TaskSearchItem {
    id: string;
    name: string;
    taskId: string;
    projectId: string;
    projectName: string;
}

export interface TaskNote {
    content: string;
    taskId: string;
}
